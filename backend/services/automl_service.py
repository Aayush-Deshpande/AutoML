from pathlib import Path

from core.model_exporter import ModelExporter
from core.pipeline import AutoMLPipeline

class AutoMLService:

    def __init__(self) -> None:

        self.pipeline = AutoMLPipeline()
        self.exporter = ModelExporter()

    def run(
        self,
        dataset_path: Path,
        output_directory: Path,
        target_column: str | None = None,
    ) -> dict:

        results = self.pipeline.analyze(
            path=dataset_path,
            target_column=target_column,
        )

        results["exported_files"] = self.exporter.export(
            results,
            output_directory,
        )

        return results