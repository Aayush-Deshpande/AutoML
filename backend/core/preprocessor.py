import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


class Preprocessor:

    def preprocess(
        self,
        X: pd.DataFrame,
    ) -> tuple:

        preprocessor = self._build_pipeline(X)

        X_processed = preprocessor.fit_transform(X)

        feature_names = preprocessor.get_feature_names_out().tolist()

        return (
            X_processed,
            preprocessor,
            feature_names,
        )

    def _build_pipeline(
        self,
        X: pd.DataFrame,
    ) -> ColumnTransformer:

        numeric_columns = X.select_dtypes(
            include="number",
        ).columns.tolist()

        categorical_columns = X.select_dtypes(
            include=[
                "object",
                "category",
                "bool",
            ],
        ).columns.tolist()

        numeric_pipeline = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(
                        strategy="median",
                    ),
                ),
                (
                    "scaler",
                    StandardScaler(),
                ),
            ]
        )

        categorical_pipeline = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(
                        strategy="most_frequent",
                    ),
                ),
                (
                    "encoder",
                    OneHotEncoder(
                        handle_unknown="ignore",
                        sparse_output=False,
                    ),
                ),
            ]
        )

        preprocessor = ColumnTransformer(
            transformers=[
                (
                    "numeric",
                    numeric_pipeline,
                    numeric_columns,
                ),
                (
                    "categorical",
                    categorical_pipeline,
                    categorical_columns,
                ),
            ],
            remainder="drop",
        )

        return preprocessor