class ResponseBuilder:

    def build(
        self,
        results: dict,
    ) -> dict:

        return {
            "metadata": results["metadata"],
            "target_column": results["target_column"],
            "task": results["task"],
            "cleaning_report": results["cleaning_report"],
            "leaderboard": self._serialize_leaderboard(
                results["leaderboard"],
            ),
            "best_model": {
                "model_name": results["best_model"]["model_name"],
                "score": results["best_model"]["score"],
                "metrics": results["best_model"]["metrics"],
                "training_time": results["best_model"]["training_time"],
            },
            "failed_models": results["failed_models"],
            "exported_files": self._serialize_paths(
                results["exported_files"],
            ),
        }

    def _serialize_leaderboard(
        self,
        leaderboard: list[dict],
    ) -> list[dict]:

        serialized = []

        for model in leaderboard:

            serialized.append(
                {
                    "model_name": model["model_name"],
                    "score": model["score"],
                    "metrics": model["metrics"],
                    "training_time": model["training_time"],
                }
            )

        return serialized

    def _serialize_paths(
        self,
        paths: dict,
    ) -> dict:

        return {
            key: str(value)
            for key, value in paths.items()
        }