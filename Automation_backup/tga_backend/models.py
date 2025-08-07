from typing import List, Literal, Optional
from pydantic import BaseModel, Field

# Define a literal type for the processing status to ensure consistency.
ProcessingStatus = Literal["idle", "processing", "completed", "error"]

# --- Input Models ---

class FileUploadRequest(BaseModel):
    """
    Model for the file upload request payload.
    This model simulates a file upload by accepting its name and content as a string.
    In a real-world scenario, you would handle file uploads differently (e.g., using UploadFile from FastAPI).
    """
    file_name: str = Field(..., description="The name of the uploaded DWG/PDF file.")
    file_content: str = Field(..., description="The content of the file encoded as a string.")

class TGADiscipline(BaseModel):
    """
    Model for a single TGA discipline.
    """
    code: str = Field(..., description="The unique code for the discipline (e.g., 'EL' for Electrical).")
    name: str = Field(..., description="The full name of the discipline.")

class TechnicalStandard(BaseModel):
    """
    Model for a single technical standard.
    """
    number: str = Field(..., description="The standard number (e.g., 'DIN 18015').")
    title: str = Field(..., description="The full title of the standard.")
    type: Literal["DIN", "VDI", "VOB", "EN", "ISO"] = Field(..., description="The type of standard.")
    category: str = Field(..., description="The category the standard belongs to.")

class ProjectConfig(BaseModel):
    """
    Model for the initial project configuration.
    """
    project_type: Literal["residential", "office", "industrial", "retail", "healthcare", "education"] = Field(
        "office", description="The type of building for the project."
    )
    total_area: int = Field(1000, ge=1, description="The total area of the project in square meters.")
    floors: int = Field(3, ge=1, description="The number of floors in the project.")
    region: Literal["germany", "europe", "international"] = Field(
        "germany", description="The geographical region for standards application."
    )
    disciplines: List[TGADiscipline] = Field(..., description="A list of selected TGA disciplines for the project.")


# --- Output Models (Responses) ---

class ProcessingStage(BaseModel):
    """
    Model representing a single stage in the processing workflow.
    """
    id: str = Field(..., description="Unique identifier for the stage.")
    name: str = Field(..., description="A human-readable name for the stage.")
    status: Literal["pending", "active", "completed", "error"] = Field(
        "pending", description="The current status of the stage."
    )
    progress: float = Field(0.0, ge=0.0, le=100.0, description="The progress of the stage in percentage.")
    duration: Optional[int] = Field(
        None, ge=0, description="The duration of the stage in seconds, if completed."
    )

class ComplianceResult(BaseModel):
    """
    Model for a single compliance check result.
    """
    standard: str = Field(..., description="The name of the standard checked.")
    compliant: bool = Field(..., description="Boolean indicating if the project is compliant.")
    score: int = Field(..., ge=0, le=100, description="A compliance score from 0 to 100.")
    violations: List[str] = Field(..., description="A list of specific violations found.")
    recommendations: List[str] = Field(..., description="A list of recommendations to fix violations.")

class GeneratedFile(BaseModel):
    """
    Model for a single generated output file.
    """
    id: str = Field(..., description="Unique identifier for the generated file.")
    name: str = Field(..., description="The name of the generated file.")
    file_type: str = Field(..., alias="type", description="The file type (e.g., 'DWG', 'PDF').")
    discipline: str = Field(..., description="The discipline the file belongs to.")
    size: int = Field(..., ge=0, description="The file size in bytes.")
    download_url: str = Field(..., alias="downloadUrl", description="The URL to download the file.")

class ProjectStatusResponse(BaseModel):
    """
    The response model for checking the status of a project.
    """
    project_id: str = Field(..., description="The unique ID of the project.")
    status: ProcessingStatus = Field(..., description="The overall status of the project.")
    current_stage: Optional[str] = Field(None, description="The name of the current processing stage.")
    stages: List[ProcessingStage] = Field(..., description="A list of all processing stages with their details.")

class ProjectResultsResponse(BaseModel):
    """
    The response model for retrieving the final results of a completed project.
    """
    project_id: str = Field(..., description="The unique ID of the project.")
    status: ProcessingStatus = "completed"
    generated_files: List[GeneratedFile] = Field(
        ..., alias="generatedFiles", description="A list of all generated files."
    )
    compliance_report: List[ComplianceResult] = Field(
        ..., alias="complianceReport", description="A detailed compliance report."
    )
