from pathlib import Path

from core.dataset_loader import DatasetLoader
from core.target_detector import TargetDetector
from core.task_detector import TaskDetector

class AutoMLPipeline:

    def __init__(self) -> None:
        self.loader = DatasetLoader()
        self.target_detector = TargetDetector()
        self.task_detector = TaskDetector()

    def analyze(
        self,
        path: Path,
        target_column: str | None = None,
    ) -> dict:
        df, metadata = self.loader.load(path)

        target = self.target_detector.detect(
            df=df,
            metadata=metadata,
            target_column=target_column,
        )

        task = self.task_detector.detect(
            df=df,
            target_column=target,
        )

        return {
            "dataframe": df,
            "metadata": metadata,
            "target_column": target,
            "task": task,
        }