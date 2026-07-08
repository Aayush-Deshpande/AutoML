from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import shap


class Explainer:

    def explain(
        self,
        model,
        X: pd.DataFrame,
        output_dir: Path,
    ) -> dict:

        output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        explainer = self._create_explainer(
            model,
            X,
        )

        shap_values = explainer(X)

        summary_plot = output_dir / "summary_plot.png"
        bar_plot = output_dir / "feature_importance.png"

        self._save_summary_plot(
            shap_values,
            X,
            summary_plot,
        )

        self._save_bar_plot(
            shap_values,
            X,
            bar_plot,
        )

        feature_importance = self._feature_importance(
            shap_values,
            X,
        )

        return {
            "explainer": explainer,
            "shap_values": shap_values,
            "feature_importance": feature_importance,
            "summary_plot": summary_plot,
            "bar_plot": bar_plot,
        }

    def _create_explainer(
        self,
        model,
        X: pd.DataFrame,
    ):

        return shap.Explainer(
            model,
            X,
        )

    def _save_summary_plot(
        self,
        shap_values,
        X,
        path: Path,
    ) -> None:

        plt.figure()

        shap.summary_plot(
            shap_values,
            X,
            show=False,
        )

        plt.tight_layout()

        plt.savefig(
            path,
            dpi=300,
            bbox_inches="tight",
        )

        plt.close()

    def _save_bar_plot(
        self,
        shap_values,
        X,
        path: Path,
    ) -> None:

        plt.figure()

        shap.plots.bar(
            shap_values,
            show=False,
        )

        plt.tight_layout()

        plt.savefig(
            path,
            dpi=300,
            bbox_inches="tight",
        )

        plt.close()

    def _feature_importance(
        self,
        shap_values,
        X,
    ) -> dict:

        importance = (
            abs(shap_values.values)
            .mean(axis=0)
        )

        return dict(
            sorted(
                zip(
                    X.columns,
                    importance,
                ),
                key=lambda x: x[1],
                reverse=True,
            )
        )