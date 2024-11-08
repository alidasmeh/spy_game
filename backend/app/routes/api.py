from fastapi import (
    APIRouter,
    Depends,
    FastAPI,
    HTTPException,
    Request,
    Response,
    status,
    Body
)

api = APIRouter(tags=["api"])

@api.get("/")
def hello_world():
    return {"message": "API"}

@api.get("/hello")
def hello_world():
    return {"message": "Hello, World!"}


