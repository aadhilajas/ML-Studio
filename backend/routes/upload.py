from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from services.preprocessing import get_columns, UPLOAD_DIR

router = APIRouter()

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        details = get_columns(file.filename)
        return {"filename": file.filename, "details": details}
    except Exception as e:
        if os.path.exists(file_path):
             os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
