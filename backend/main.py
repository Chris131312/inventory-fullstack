from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from database import engine
import models
from sqlalchemy.orm import Session
from database import SessionLocal
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from email_utils import send_low_stock_email
app = FastAPI()
models.Base.metadata.create_all(bind=engine)

SECRET_KEY = "mi_clave_secreta_super_segura_123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    return username


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp" : expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Product(BaseModel):
    id: int
    name: str
    category: str
    price: float
    stock: int

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    username: str
    password: str

#ENDPOINT LOGING
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})

    return {"access_token": access_token, "token_type": "bearer"}

#NewUserRegister
@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()

    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    db_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_email: 
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password)

    new_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        username=user.username,
        password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully", "username": new_user.username}

#GET
@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.DBProduct).all()
    return products

#POST
@app.post("/products")
def create_product(product: Product, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    new_product = models.DBProduct(
        name=product.name,
        category=product.category,
        price=product.price,
        stock=product.stock
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    if new_product.stock < 5:
        background_tasks.add_tasks(send_low_stock_email, new_product.name, new_product.stock)

    return new_product

#UPDATE
@app.put("/products/{product_id}")
def update_product(product_id: int, updated_product: Product, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_product = db.query(models.DBProduct).filter(models.DBProduct.id == product_id).first()

    if not db_product:
        return {"error": "Product not found"}
    
    db_product.name = updated_product.name 
    db_product.category = updated_product.category
    db_product.price = updated_product.price
    db_product.stock = updated_product.stock

    db.commit()
    db.refresh(db_product)

    if db_product.stock < 5:
        background_tasks.add_task(send_low_stock_email, db_product.name, db_product.stock)

    return db_product

#DELETE
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_product = db.query(models.DBProduct).filter(models.DBProduct.id == product_id).first()

    if not db_product:
        return {"error": "Product not found"}
    
    db.delete(db_product)
    db.commit()

    return {"message": "Product deleted successfully"}

#COMMENT