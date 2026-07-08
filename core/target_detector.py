import pandas as pd

class TargetDetector:

    def detect(
        self,
        df: pd.DataFrame,
        metadata: dict,
        target_column: str | None = None,
    ) -> str:

        if target_column is not None:
            self._validate_target(df, target_column)
            return target_column

        return self._auto_detect(df, metadata)

    def _validate_target(
        self,
        df: pd.DataFrame,
        target_column: str,
    ) -> None:
        
        if target_column not in df.columns:
            raise ValueError(
                f"Target column '{target_column}' does not exist."
            )

        if df[target_column].nunique(dropna=False) <= 1:
            raise ValueError(
                f"Target column '{target_column}' contains only one unique value."
            )

        if df[target_column].isna().all():
            raise ValueError(
                f"Target column '{target_column}' contains only missing values."
            )

    def _auto_detect(
    self,
    df: pd.DataFrame,
    metadata: dict,
    ) -> str:

        best_column = None
        best_score = -1

        for column in df.columns:
            score = self._score_column(df, metadata, column)

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

        return score
    
    def _keyword_score(self, column: str) -> float:
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

        if column.lower() in target_keywords:
            return 50.0

        return 0.0
    
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