import asyncio
import base64
from fastapi import FastAPI, HTTPException, WebSocket, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil

# Corrected import: Use absolute import since uvicorn runs this as a top-level script
from services import processing

app = FastAPI()

# Configuration for CORS (Cross-Origin Resource Sharing)
# Adjust these for your production environment
origins = [
    "http://localhost",
    "http://localhost:5173",  # React development server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProjectData(BaseModel):
    projectType: str
    totalArea: int
    floors: int
    region: str
    disciplines: List[dict]

class WebSocketMessage(BaseModel):
    type: str
    data: dict

@app.get("/")
async def root():
    return {"message": "TGA Desktop Automation Backend is running!"}

@app.post("/upload-dwg/")
async def upload_dwg(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Create a temporary directory to store the file
    upload_dir = "temp_uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    file_path = os.path.join(upload_dir, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {e}")
    finally:
        file.file.close()
    
    return {"filename": file.filename, "file_path": file_path, "message": "File uploaded successfully"}

@app.websocket("/ws/process")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            # Receive project data from the frontend
            data = await websocket.receive_json()
            project_data = ProjectData(**data)
            
            # This is the callback function that will send status updates back to the frontend
            async def status_callback(status: str, stage_name: str, progress: float):
                # Using a dictionary for flexibility
                message = {
                    "status": status,
                    "current_stage": stage_name,
                    "progress": progress
                }
                await websocket.send_json(message)

            # Start the processing workflow asynchronously
            results = await processing.run_processing_workflow(project_data.dict(), status_callback)
            
            # Send the final results back to the client
            await websocket.send_json({"status": "completed", "results": results})
            
    except Exception as e:
        print(f"WebSocket Error: {e}")
        await websocket.close()
