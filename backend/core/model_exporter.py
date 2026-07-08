from pathlib import Path
import json
import joblib


class ModelExporter:

    def export(
        self,
        results: dict,
        output_dir: Path,
    ) -> dict:

        output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        model_path = output_dir / "best_model.pkl"

        preprocessing_path = (
            output_dir
            / "preprocessing_pipeline.pkl"
        )

        metadata_path = (
            output_dir
            / "metadata.json"
        )

        leaderboard_path = (
            output_dir
            / "leaderboard.json"
        )

        self._save_model(
            results["best_model"]["model"],
            model_path,
        )

        self._save_preprocessor(
            results["preprocessing_pipeline"],
            preprocessing_path,
        )

        self._save_json(
            results["metadata"],
            metadata_path,
        )

        self._save_json(
            results["leaderboard"],
            leaderboard_path,
        )

        return {
            "model_path": model_path,
            "preprocessing_pipeline_path": preprocessing_path,
            "metadata_path": metadata_path,
            "leaderboard_path": leaderboard_path,
        }

    def _save_model(
        self,
        model,
        path: Path,
    ) -> None:

        joblib.dump(
            model,
            path,
        )

    def _save_preprocessor(
        self,
        preprocessor,
        path: Path,
    ) -> None:

        joblib.dump(
            preprocessor,
            path,
        )

    def _save_json(
        self,
        data,
        path: Path,
    ) -> None:

        with open(
            path,
            "w",
            encoding="utf-8",
        ) as file:

            json.dump(
                data,
                file,
                indent=4,
                default=str,
            )