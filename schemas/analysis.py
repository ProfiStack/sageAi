from pydantic import BaseModel
from typing import Dict, List


class SkinAnalysisResult(BaseModel):
    skin_type: str
    concerns: List[Dict[str, float]]
    tone: str
    undertone: str
    texture: str
    under_eye: str
    lip_color: str
