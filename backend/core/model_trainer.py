from time import perf_counter

from sklearn.model_selection import train_test_split

from core.model_selector import ModelSelector


class ModelTrainer:

    def __init__(self) -> None:
        self.model_selector = ModelSelector()

    def train(
        self,
        X,
        y,
        task: str,
    ) -> dict:

        models = self.model_selector.get_models(task)

        X_train, X_test, y_train, y_test = self._split_data(
            X,
            y,
            task,
        )

        trained_models = {}
        training_times = {}
        failed_models = {}

        for model_name, model in models.items():

            try:
                start_time = perf_counter()

                model.fit(
                    X_train,
                    y_train,
                )

                end_time = perf_counter()

                trained_models[model_name] = model
                training_times[model_name] = (
                    end_time - start_time
                )

            except Exception as error:

                failed_models[model_name] = str(error)

        return {
            "trained_models": trained_models,
            "training_times": training_times,
            "failed_models": failed_models,
            "X_train": X_train,
            "X_test": X_test,
            "y_train": y_train,
            "y_test": y_test,
        }

    def _split_data(
        self,
        X,
        y,
        task: str,
    ):

        stratify = None

        if task in {
            "binary_classification",
            "multiclass_classification",
        }:
            stratify = y

        return train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42,
            stratify=stratify,
        )