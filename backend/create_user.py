from database import SessionLocal, engine
import models
from passlib.context import CryptContext

#Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#DATABASE
models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

#UserData
username = "admin"
plain_password = "123456"

hashed_password = pwd_context.hash(plain_password)

user = db.query(models.User).filter(models.User.username == username).first()

if not user:
    new_user = models.User(username=username, password=hashed_password)
    db.add(new_user)
    db.commit()
    print("Admin user successfully created in the database!")
else:
    print("Admin user already existe.")
db.close()