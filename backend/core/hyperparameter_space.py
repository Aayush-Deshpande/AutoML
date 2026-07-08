class HyperparameterSpace:

    def get_space(
        self,
        model_name: str,
        task: str,
    ):

        if task == "regression":
            spaces = self._regression_spaces()

        elif task in {
            "binary_classification",
            "multiclass_classification",
        }:
            spaces = self._classification_spaces()

        else:
            raise ValueError(
                f"Unsupported task '{task}'."
            )

        if model_name not in spaces:
            raise ValueError(
                f"No hyperparameter space defined for '{model_name}'."
            )

        return spaces[model_name]

    def _regression_spaces(self) -> dict:
        return {
            "Linear Regression": self._linear_regression_space(),
            "Ridge Regression": self._ridge_space(),
            "Lasso Regression": self._lasso_space(),
            "Elastic Net": self._elastic_net_space(),
            "Decision Tree": self._decision_tree_space(),
            "Random Forest": self._random_forest_space(),
            "Extra Trees": self._extra_trees_space(),
            "Gradient Boosting": self._gradient_boosting_space(),
            "AdaBoost": self._adaboost_space(),
            "Support Vector Regressor": self._svm_space(),
            "K-Nearest Neighbors": self._knn_space(),
            "XGBoost": self._xgboost_space(),
            "LightGBM": self._lightgbm_space(),
            "CatBoost": self._catboost_space(),
        }

    def _classification_spaces(self) -> dict:
        return {
            "Logistic Regression": self._logistic_regression_space(),
            "Decision Tree": self._decision_tree_space(),
            "Random Forest": self._random_forest_space(),
            "Extra Trees": self._extra_trees_space(),
            "Gradient Boosting": self._gradient_boosting_space(),
            "AdaBoost": self._adaboost_space(),
            "Support Vector Machine": self._svm_space(),
            "K-Nearest Neighbors": self._knn_space(),
            "Gaussian Naive Bayes": self._gaussian_nb_space(),
            "XGBoost": self._xgboost_space(),
            "LightGBM": self._lightgbm_space(),
            "CatBoost": self._catboost_space(),
        }

    def _linear_regression_space(self):
        pass

    def _ridge_space(self):
        pass

    def _lasso_space(self):
        pass

    def _elastic_net_space(self):
        pass

    def _logistic_regression_space(self):
        pass

    def _decision_tree_space(self):
        pass

    def _random_forest_space(self):
        pass

    def _extra_trees_space(self):
        pass

    def _gradient_boosting_space(self):
        pass

    def _adaboost_space(self):
        pass

    def _svm_space(self):
        pass

    def _knn_space(self):
        pass

    def _gaussian_nb_space(self):
        pass

    def _xgboost_space(self):
        pass

    def _lightgbm_space(self):
        pass

    def _catboost_space(self):
        pass