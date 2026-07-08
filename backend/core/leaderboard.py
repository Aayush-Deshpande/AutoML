class Leaderboard:

    def rank(
        self,
        evaluation_results: dict,
        task: str,
    ) -> list[dict]:

        metric = "r2" if task == "regression" else "f1"

        leaderboard = []

        for model_name, result in evaluation_results.items():

            leaderboard.append(
                {
                    "model_name": model_name,
                    "model": result["model"],
                    "score": result["metrics"][metric],
                    "metrics": result["metrics"],
                    "training_time": result["training_time"],
                    "predictions": result["predictions"],
                }
            )

        leaderboard.sort(
            key=lambda model: model["score"],
            reverse=True,
        )

        return leaderboard

    def get_best_model(
        self,
        leaderboard: list[dict],
    ) -> dict:

        if not leaderboard:
            raise ValueError(
                "Leaderboard is empty."
            )

        return leaderboard[0]