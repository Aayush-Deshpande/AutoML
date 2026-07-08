import numpy as np

from sklearn.metrics import (
    accuracy_score,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
    roc_auc_score,
)


class Evaluator:

    def evaluate(
        self,
        trained_models: dict,
        training_times: dict,
        X_test,
        y_test,
        task: str,
    ) -> dict:

        results = {}

        for model_name, model in trained_models.items():

            y_pred = model.predict(X_test)

            if task == "regression":

                metrics = self._regression_metrics(
                    y_test,
                    y_pred,
                )

            else:

                y_prob = self._predict_probabilities(
                    model,
                    X_test,
                )

                metrics = self._classification_metrics(
                    y_test,
                    y_pred,
                    y_prob,
                    task,
                )

            results[model_name] = {
                "model": model,
                "metrics": metrics,
                "training_time": training_times.get(
                    model_name,
                    None,
                ),
                "predictions": y_pred,
            }

        return results

    def _regression_metrics(
        self,
        y_true,
        y_pred,
    ) -> dict:

        mse = mean_squared_error(
            y_true,
            y_pred,
        )

        return {
            "mae": mean_absolute_error(
                y_true,
                y_pred,
            ),
            "mse": mse,
            "rmse": np.sqrt(mse),
            "r2": r2_score(
                y_true,
                y_pred,
            ),
        }

    def _classification_metrics(
        self,
        y_true,
        y_pred,
        y_prob,
        task: str,
    ) -> dict:

        metrics = {
            "accuracy": accuracy_score(
                y_true,
                y_pred,
            ),
            "precision": precision_score(
                y_true,
                y_pred,
                average="weighted",
                zero_division=0,
            ),
            "recall": recall_score(
                y_true,
                y_pred,
                average="weighted",
                zero_division=0,
            ),
            "f1": f1_score(
                y_true,
                y_pred,
                average="weighted",
                zero_division=0,
            ),
        }

        if (
            task == "binary_classification"
            and y_prob is not None
        ):
            metrics["roc_auc"] = roc_auc_score(
                y_true,
                y_prob,
            )

        return metrics

    def _predict_probabilities(
        self,
        model,
        X_test,
    ):

        if hasattr(
            model,
            "predict_proba",
        ):

            probabilities = model.predict_proba(
                X_test,
            )

            if probabilities.shape[1] == 2:
                return probabilities[:, 1]

        return None