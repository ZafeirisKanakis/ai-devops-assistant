from fastapi import FastAPI
from app.api import analyze
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI DevOps Assistant API")

# CORS για σύνδεση με frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "AI DevOps Assistant API is running 🚀"}
