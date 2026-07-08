import pandas as pd


class DataCleaner:

    def clean(
        self,
        df: pd.DataFrame,
        metadata: dict,
        target_column: str,
    ) -> tuple[pd.DataFrame, pd.Series]:

        df = self._remove_duplicates(df)

        df = self._drop_constant_columns(df, metadata)

        df = self._drop_id_columns(df, metadata, target_column)

        X, y = self._split_features_target(df, target_column)

        return X, y

    def _remove_duplicates(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:
        pass

    def _drop_constant_columns(
        self,
        df: pd.DataFrame,
        metadata: dict,
    ) -> pd.DataFrame:
        pass

    def _drop_id_columns(
        self,
        df: pd.DataFrame,
        metadata: dict,
        target_column: str,
    ) -> pd.DataFrame:
        pass

    def _split_features_target(
        self,
        df: pd.DataFrame,
        target_column: str,
    ) -> tuple[pd.DataFrame, pd.Series]:
        pass