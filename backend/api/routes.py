from pathlib import Path
import shutil
import uuid

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from api.response_builder import ResponseBuilder
from services.automl_service import AutoMLService


router = APIRouter()

service = AutoMLService()
response_builder = ResponseBuilder()

UPLOAD_DIRECTORY = Path("uploads")
OUTPUT_DIRECTORY = Path("outputs")

UPLOAD_DIRECTORY.mkdir(
    parents=True,
    exist_ok=True,
)

OUTPUT_DIRECTORY.mkdir(
    parents=True,
    exist_ok=True,
)


@router.post("/analyze")
async def analyze_dataset(
    file: UploadFile = File(...),
    target_column: str | None = Form(default=None),
):

    if file.filename is None:
        raise HTTPException(
            status_code=400,
            detail="No file was uploaded.",
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported.",
        )

    run_id = str(uuid.uuid4())

    dataset_path = (
        UPLOAD_DIRECTORY
        / f"{run_id}.csv"
    )

    output_directory = (
        OUTPUT_DIRECTORY
        / run_id
    )

    with open(
        dataset_path,
        "wb",
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer,
        )

    try:

        results = service.run(
            dataset_path=dataset_path,
            output_directory=output_directory,
            target_column=target_column,
        )

        response = response_builder.build(
            results,
        )

        return {
            "status": "success",
            "results": response,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )

    finally:

        if dataset_path.exists():
            dataset_path.unlink()