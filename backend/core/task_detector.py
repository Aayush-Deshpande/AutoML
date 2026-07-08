import pandas as pd

class TaskDetector:

    def detect(
        self,
        df: pd.DataFrame,
        target_column: str,
    ) -> str:

        target = df[target_column]

        unique_values = target.nunique(dropna=False)

        total_samples = len(target)

        unique_ratio = unique_values / total_samples

        if pd.api.types.is_bool_dtype(target):
            return "binary_classification"

        if unique_values == 2:
            return "binary_classification"

        if not pd.api.types.is_numeric_dtype(target):
            return "multiclass_classification"

        if unique_ratio >= 0.05:
            return "regression"

        if unique_values <= 20:
            return "multiclass_classification"

        return "regression"