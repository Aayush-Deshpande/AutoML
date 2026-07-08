import pandas as pd

class DatasetProfiler:

    def profile(self, df: pd.DataFrame) -> dict:
        missing = df.isna().sum()
        unique = df.nunique(dropna=False)

        profile = {
            "missing_values": missing.to_dict(),
            "missing_percentage": (
                (missing / len(df)) * 100
            ).round(2).to_dict(),
            "duplicate_rows": int(df.duplicated().sum()),
            "constant_columns": self._detect_constant_columns(unique),
            "unique_values": unique.to_dict(),
            "high_cardinality_columns": self._detect_high_cardinality_columns(df),
            "id_columns": self._detect_id_columns(df),
        }

        return profile

    def _detect_constant_columns(self, unique: pd.Series) -> list[str]:
        return unique[unique == 1].index.tolist()

    def _detect_id_columns(self, df: pd.DataFrame) -> list[str]:
        id_columns = []

        id_keywords = {
            "id",
            "index",
            "customer_id",
            "user_id",
            "employee_id",
            "order_id",
            "product_id",
            "transaction_id",
        }

        for column in df.columns:
            column_name = column.lower()

            unique_ratio = df[column].nunique(dropna=False) / len(df)

            if column_name in id_keywords:
                id_columns.append(column)
                continue

            if unique_ratio >= 0.98:
                id_columns.append(column)

        return id_columns

    def _detect_high_cardinality_columns(
        self,
        df: pd.DataFrame,
    ) -> list[str]:

        high_cardinality = []

        id_columns = set(self._detect_id_columns(df))

        categorical_columns = df.select_dtypes(
            include=["object", "category"]
        ).columns

        for column in categorical_columns:

            if column in id_columns:
                continue

            if df[column].nunique(dropna=False) > 50:
                high_cardinality.append(column)

        return high_cardinality