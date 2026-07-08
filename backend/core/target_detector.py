import pandas as pd


class TargetDetector:

    def detect(
        self,
        df: pd.DataFrame,
        metadata: dict,
        target_column: str | None = None,
    ) -> str:

        if target_column is not None:
            self._validate_target(
                df,
                target_column,
            )
            return target_column

        return self._auto_detect(
            df,
            metadata,
        )

    def _validate_target(
        self,
        df: pd.DataFrame,
        target_column: str,
    ) -> None:

        if target_column not in df.columns:
            raise ValueError(
                f"Target column '{target_column}' does not exist."
            )

        if df[target_column].isna().all():
            raise ValueError(
                f"Target column '{target_column}' contains only missing values."
            )

        if df[target_column].nunique(dropna=False) <= 1:
            raise ValueError(
                f"Target column '{target_column}' contains only one unique value."
            )

    def _auto_detect(
        self,
        df: pd.DataFrame,
        metadata: dict,
    ) -> str:

        best_column = None
        best_score = float("-inf")

        for column in df.columns:

            score = self._score_column(
                df,
                metadata,
                column,
            )

            if score > best_score:
                best_score = score
                best_column = column

        return best_column

    def _score_column(
        self,
        df: pd.DataFrame,
        metadata: dict,
        column: str,
    ) -> float:

        score = 0.0

        score += self._keyword_score(column)
        score += self._position_score(metadata, column)
        score += self._dtype_score(df[column])
        score += self._cardinality_score(df[column])
        score += self._missing_score(df[column])
        score += self._id_penalty(metadata, column)
        score += self._constant_penalty(metadata, column)

        return score

    def _keyword_score(
        self,
        column: str,
    ) -> float:

        target_keywords = {
            "target",
            "label",
            "class",
            "output",
            "response",
            "result",
            "prediction",
            "y",
            "price",
            "salary",
            "income",
            "cost",
            "sales",
            "revenue",
            "species",
            "diagnosis",
            "survived",
            "churn",
            "default",
        }

        return 50.0 if column.lower() in target_keywords else 0.0

    def _position_score(
        self,
        metadata: dict,
        column: str,
    ) -> float:

        columns = metadata["column_names"]

        if column == columns[-1]:
            return 20.0

        if len(columns) > 1 and column == columns[-2]:
            return 10.0

        return 0.0

    def _dtype_score(
        self,
        column: pd.Series,
    ) -> float:

        if pd.api.types.is_numeric_dtype(column):
            return 10.0

        if pd.api.types.is_bool_dtype(column):
            return 10.0

        return 5.0

    def _cardinality_score(
        self,
        column: pd.Series,
    ) -> float:

        unique_ratio = (
            column.nunique(dropna=False)
            / len(column)
        )

        if unique_ratio >= 0.95:
            return -30.0

        if unique_ratio <= 0.20:
            return 10.0

        return 5.0

    def _missing_score(
        self,
        column: pd.Series,
    ) -> float:

        missing_ratio = (
            column.isna().sum()
            / len(column)
        )

        if missing_ratio == 0:
            return 10.0

        if missing_ratio < 0.20:
            return 5.0

        return -10.0

    def _id_penalty(
        self,
        metadata: dict,
        column: str,
    ) -> float:

        if column in metadata["profile"]["id_columns"]:
            return -40.0

        return 0.0

    def _constant_penalty(
        self,
        metadata: dict,
        column: str,
    ) -> float:

        if column in metadata["profile"]["constant_columns"]:
            return -100.0

        return 0.0  