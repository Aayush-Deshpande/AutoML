from pathlib import Path

from core.data_cleaner import DataCleaner
from core.dataset_loader import DatasetLoader
from core.evaluator import Evaluator
from core.leaderboard import Leaderboard
from core.model_trainer import ModelTrainer
from core.preprocessor import Preprocessor
from core.target_detector import TargetDetector
from core.task_detector import TaskDetector


class AutoMLPipeline:

    def __init__(self) -> None:

        self.loader = DatasetLoader()
        self.target_detector = TargetDetector()
        self.task_detector = TaskDetector()
        self.cleaner = DataCleaner()
        self.preprocessor = Preprocessor()
        self.trainer = ModelTrainer()
        self.evaluator = Evaluator()
        self.leaderboard = Leaderboard()

    def analyze(
        self,
        path: Path,
        target_column: str | None = None,
    ) -> dict:

        df, metadata = self.loader.load(path)

        target = self.target_detector.detect(
            df,
            metadata,
            target_column,
        )

        task = self.task_detector.detect(
            df,
            target,
        )

        X, y, cleaning_report = self.cleaner.clean(
            df,
            metadata,
            target,
        )

        (
            X_processed,
            preprocessing_pipeline,
            feature_names,
        ) = self.preprocessor.preprocess(
            X,
        )

        training_results = self.trainer.train(
            X_processed,
            y,
            task,
        )

        evaluation_results = self.evaluator.evaluate(
            trained_models=training_results["trained_models"],
            training_times=training_results["training_times"],
            X_test=training_results["X_test"],
            y_test=training_results["y_test"],
            task=task,
        )

        leaderboard = self.leaderboard.rank(
            evaluation_results,
            task,
        )

        best_model = self.leaderboard.get_best_model(
            leaderboard,
        )

        return {
            "metadata": metadata,
            "target_column": target,
            "task": task,
            "cleaning_report": cleaning_report,
            "X_processed": X_processed,
            "feature_names": feature_names,
            "preprocessing_pipeline": preprocessing_pipeline,
            "trained_models": training_results["trained_models"],
            "training_times": training_results["training_times"],
            "failed_models": training_results["failed_models"],
            "evaluation_results": evaluation_results,
            "leaderboard": leaderboard,
            "best_model": best_model,
            "best_model_name": best_model["model_name"],
        }