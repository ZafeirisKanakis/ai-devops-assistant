from pydantic import BaseModel
from typing import List


class AnalysisResult(BaseModel):
    summary: str
    issues: List[str]
    recommendations: List[str]
