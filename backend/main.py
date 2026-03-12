from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from database import engine
import models
from sqlalchemy.orm import Session
from database import SessionLocal

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

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