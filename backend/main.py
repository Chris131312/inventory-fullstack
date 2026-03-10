from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

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

products_db =[
    {"id": 1, "name": "Laptop Gamer", "category": "Electrónica", "price": 1500.0, "stock": 5},
    {"id": 2, "name": "Mouse Inalámbrico", "category": "Accesorios", "price": 25.0, "stock": 12},
    {"id": 3, "name": "Teclado Mecánico", "category": "Electrónica", "price": 85.0, "stock": 8},
    {"id": 4, "name": "Monitor 4K", "category": "Electrónica", "price": 300.0, "stock": 3},
]

@app.get("/")
def read_root():
    return{"message": "El sistema de inventario está ONLINE"}

@app.get("/products", response_model=List[Product])
def get_products():
    return products_db

@app.post("/products", response_model=Product)
def create_product(product: Product):
    product.id = len(products_db) + 1

    products_db.append(product)

    return product

@app.put("/products/{product_id}")
def update_product(product_id: int, updated_product: Product):
    for index, product in enumerate(products_db):

        if type(product) is dict:
            current_id = product["id"]
        else:
            current_id = product_id

        if current_id == product_id:
            updated_product.id = product_id
            products_db[index] = updated_product.dict()
            return updated_product
        
        return{"error": "Product not found"}
    
   