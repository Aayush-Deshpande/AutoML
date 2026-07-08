from pathlib import Path

import pandas as pd
from pandas.errors import EmptyDataError, ParserError

from core.dataset_profiler import DatasetProfiler


class DatasetLoader:

    def load(self, path: Path) -> tuple[pd.DataFrame, dict]:
        self._validate_file(path)

        try:
            df = pd.read_csv(path)

        except EmptyDataError:
            raise ValueError("The CSV file contains no data.")

        except ParserError:
            raise ValueError("The CSV file is malformed.")

        except UnicodeDecodeError:
            raise ValueError(
                "Unable to decode the file. Please upload a UTF-8 encoded CSV."
            )

        metadata = self._extract_metadata(df)

        profiler = DatasetProfiler()
        metadata["profile"] = profiler.profile(df)

        return df, metadata

    def _validate_file(self, path: Path) -> None:
        if path is None:
            raise ValueError("File path cannot be None.")

        if not isinstance(path, Path):
            raise TypeError("Expected a pathlib.Path object.")

        if not path.exists():
            raise FileNotFoundError(f"File not found: {path}")

        if not path.is_file():
            raise IsADirectoryError(f"{path} is not a file.")

        if path.suffix.lower() != ".csv":
            raise ValueError("Only CSV files are supported.")

        if path.stat().st_size == 0:
            raise ValueError("The CSV file is empty.")

    def _extract_metadata(self, df: pd.DataFrame) -> dict:
        metadata = {
            "total_rows": df.shape[0],
            "total_columns": df.shape[1],
            "column_names": df.columns.tolist(),
            "numeric_columns": df.select_dtypes(include="number").columns.tolist(),
            "categorical_columns": df.select_dtypes(
                include=["object", "category"]
            ).columns.tolist(),
            "boolean_columns": df.select_dtypes(include="bool").columns.tolist(),
            "datetime_columns": df.select_dtypes(
                include=["datetime", "datetimetz"]
            ).columns.tolist(),
            "memory_usage_bytes": int(df.memory_usage(deep=True).sum()),
        }

        return metadata