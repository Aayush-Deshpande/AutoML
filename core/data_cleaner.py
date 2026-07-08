import pandas as pd


class DataCleaner:

    def clean(
        self,
        df: pd.DataFrame,
        metadata: dict,
        target_column: str,
    ) -> tuple[pd.DataFrame, pd.Series, dict]:

        cleaning_report = {}

        original_rows = len(df)

        df = self._remove_duplicates(df)

        cleaning_report["duplicates_removed"] = original_rows - len(df)

        constant_columns = metadata["profile"]["constant_columns"]
        cleaning_report["constant_columns_removed"] = len(constant_columns)

        df = self._drop_constant_columns(df, constant_columns)

        id_columns = [
            column
            for column in metadata["profile"]["id_columns"]
            if column != target_column
        ]

        cleaning_report["id_columns_removed"] = len(id_columns)

        df = self._drop_id_columns(df, id_columns)

        X, y = self._split_features_target(df, target_column)

        return X, y, cleaning_report

    def _remove_duplicates(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:
        return df.drop_duplicates(ignore_index=True)

    def _drop_constant_columns(
        self,
        df: pd.DataFrame,
        constant_columns: list[str],
    ) -> pd.DataFrame:

        return df.drop(
            columns=constant_columns,
            errors="ignore",
        )

    def _drop_id_columns(
        self,
        df: pd.DataFrame,
        id_columns: list[str],
    ) -> pd.DataFrame:

        return df.drop(
            columns=id_columns,
            errors="ignore",
        )

    def _split_features_target(
        self,
        df: pd.DataFrame,
        target_column: str,
    ) -> tuple[pd.DataFrame, pd.Series]:

        y = df[target_column]

        X = df.drop(columns=[target_column])

        return X, y