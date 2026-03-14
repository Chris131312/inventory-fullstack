from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
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

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

SECRET_KEY = "mi_clave_secreta_super_segura_123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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


#GET
@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.DBProduct).all()
    return products

#POST
@app.post("/products")
def create_product(product: Product, db: Session = Depends(get_db)):
    new_product = models.DBProduct(
        name=product.name,
        category=product.category,
        price=product.price,
        stock=product.stock
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

#UPDATE
@app.put("/products/{product_id}")
def update_product(product_id: int, updated_product: Product, db: Session = Depends(get_db)):
    db_product = db.query(models.DBProduct).filter(models.DBProduct.id == product_id).first()

    if not db_product:
        return {"error": "Product not found"}
    
    db_product.name = updated_product.name 
    db_product.category = updated_product.category
    db_product.price = updated_product.price
    db_product.stock = updated_product.stock

    db.commit()
    db.refresh(db_product)

    return db_product

#DELETE
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.DBProduct).filter(models.DBProduct.id == product_id).first()

    if not db_product:
        return {"error": "Product not found"}
    
    db.delete(db_product)
    db.commit()

    return {"message": "Product deleted successfully"}