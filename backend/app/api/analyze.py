from fastapi import APIRouter, UploadFile, Form
from app.services.ai_service import analyze_content
from app.models import AnalysisResult


router = APIRouter()

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_file(file: UploadFile = None, content: str = Form(None)):
    """
    Ανάλυση configuration αρχείου με AI.
    Ο χρήστης μπορεί να ανεβάσει αρχείο ή να κάνει paste text.
    """
    if file:
        text = (await file.read()).decode("utf-8")
    elif content:
        text = content
    else:
        return {"error": "No input provided"}

    result = await analyze_content(text)
    return result
