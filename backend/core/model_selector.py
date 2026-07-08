from catboost import CatBoostClassifier
from catboost import CatBoostRegressor

from lightgbm import LGBMClassifier
from lightgbm import LGBMRegressor

from xgboost import XGBClassifier
from xgboost import XGBRegressor

from sklearn.ensemble import AdaBoostClassifier
from sklearn.ensemble import AdaBoostRegressor
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import RandomForestRegressor

from sklearn.linear_model import ElasticNet
from sklearn.linear_model import Lasso
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import LogisticRegression
from sklearn.linear_model import Ridge

from sklearn.naive_bayes import GaussianNB

from sklearn.neighbors import KNeighborsClassifier
from sklearn.neighbors import KNeighborsRegressor

from sklearn.svm import SVC
from sklearn.svm import SVR

from sklearn.tree import DecisionTreeClassifier
from sklearn.tree import DecisionTreeRegressor

class ModelSelector:

    def get_models(
        self,
        task: str,
    ) -> dict[str, object]:

        model_registry = {
            "regression": self._regression_models(),
            "binary_classification": self._classification_models(),
            "multiclass_classification": self._classification_models(),
        }

        if task not in model_registry:
            raise ValueError(
                f"Unsupported task '{task}'."
            )

        return model_registry[task]

    def _regression_models(self) -> dict[str, object]:
        return {
            "Linear Regression": LinearRegression(),

            "Ridge Regression": Ridge(
                random_state=42,
            ),

            "Lasso Regression": Lasso(
                random_state=42,
            ),

            "Elastic Net": ElasticNet(
                random_state=42,
            ),

            "Decision Tree": DecisionTreeRegressor(
                random_state=42,
            ),

            "Random Forest": RandomForestRegressor(
                n_estimators=200,
                random_state=42,
                n_jobs=-1,
            ),

            "Extra Trees": ExtraTreesRegressor(
                n_estimators=200,
                random_state=42,
                n_jobs=-1,
            ),

            "Gradient Boosting": GradientBoostingRegressor(
                random_state=42,
            ),

            "AdaBoost": AdaBoostRegressor(
                random_state=42,
            ),

            "Support Vector Regressor": SVR(),

            "K-Nearest Neighbors": KNeighborsRegressor(
                n_jobs=-1,
            ),

            "XGBoost": XGBRegressor(
                random_state=42,
                n_estimators=200,
                n_jobs=-1,
                verbosity=0,
            ),

            "LightGBM": LGBMRegressor(
                random_state=42,
                n_estimators=200,
                n_jobs=-1,
                verbose=-1,
            ),

            "CatBoost": CatBoostRegressor(
                random_state=42,
                verbose=False,
            ),
        }

    def _classification_models(self) -> dict[str, object]:
        return {
            "Logistic Regression": LogisticRegression(
                max_iter=1000,
                random_state=42,
            ),

            "Decision Tree": DecisionTreeClassifier(
                random_state=42,
            ),

            "Random Forest": RandomForestClassifier(
                n_estimators=200,
                random_state=42,
                n_jobs=-1,
            ),

            "Extra Trees": ExtraTreesClassifier(
                n_estimators=200,
                random_state=42,
                n_jobs=-1,
            ),

            "Gradient Boosting": GradientBoostingClassifier(
                random_state=42,
            ),

            "AdaBoost": AdaBoostClassifier(
                random_state=42,
            ),

            "Support Vector Machine": SVC(
                probability=True,
                random_state=42,
            ),

            "K-Nearest Neighbors": KNeighborsClassifier(
                n_jobs=-1,
            ),

            "Gaussian Naive Bayes": GaussianNB(),

            "XGBoost": XGBClassifier(
                random_state=42,
                n_estimators=200,
                n_jobs=-1,
                verbosity=0,
                eval_metric="logloss",
            ),

            "LightGBM": LGBMClassifier(
                random_state=42,
                n_estimators=200,
                n_jobs=-1,
                verbose=-1,
            ),

            "CatBoost": CatBoostClassifier(
                random_state=42,
                verbose=False,
            ),
        }