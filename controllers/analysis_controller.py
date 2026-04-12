import asyncio
from concurrent.futures import ThreadPoolExecutor
from fastapi import HTTPException, UploadFile
from fastapi.responses import JSONResponse

from services.skin_analyzer import EnhancedFacialSkinAnalyzer
from services.ai_chat import claude
from prompts.image_analysis import clean_and_parse_json, get_image_analysis_prompt
from prompts.shade_matching import get_shade_matching_prompt

executor = ThreadPoolExecutor()
_analyzer = None


def get_analyzer() -> EnhancedFacialSkinAnalyzer:
    global _analyzer
    if _analyzer is None:
        _analyzer = EnhancedFacialSkinAnalyzer()
    return _analyzer


async def analyze_skin(user_db: dict, image: UploadFile) -> dict:
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")
    image_bytes = await image.read()
    try:
        skin_analyzer = get_analyzer()
        result = await asyncio.get_event_loop().run_in_executor(
            executor, skin_analyzer.analyze, image_bytes
        )
        system_prompt = get_image_analysis_prompt(result)
        response = await asyncio.get_event_loop().run_in_executor(
            executor,
            lambda: claude.messages.create(
                model="claude-haiku-4-5-20251001",
                system=system_prompt,
                messages=[{"role": "user", "content": "Analyze the skin data and return the JSON response."}],
                max_tokens=4096,
                temperature=0.7,
            ),
        )
        json_result = clean_and_parse_json(response.content[0].text)
        return {"results": json_result}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})


async def analyze_shade_matching(user_db: dict, image: UploadFile) -> dict:
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")
    image_bytes = await image.read()
    try:
        skin_analyzer = get_analyzer()
        result = await asyncio.get_event_loop().run_in_executor(
            executor, skin_analyzer.analyze, image_bytes
        )
        system_prompt = get_shade_matching_prompt(result)
        response = await asyncio.get_event_loop().run_in_executor(
            executor,
            lambda: claude.messages.create(
                model="claude-haiku-4-5-20251001",
                system=system_prompt,
                messages=[{"role": "user", "content": "Analyze the skin data and return the JSON response."}],
                max_tokens=4096,
                temperature=0.7,
            ),
        )
        json_result = clean_and_parse_json(response.content[0].text)
        return {"results": json_result}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
