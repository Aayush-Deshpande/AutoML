import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Database,
  Cpu,
  BarChart2,
  Download,
  CheckCircle,
  FlaskConical,
} from "lucide-react";

// ============================================================
// LandingPage — professional introduction to the AutoML platform
// Tone: Linear / Vercel — precise, confident, minimal
// NOT: animated blobs, glassmorphism everywhere, generic SaaS
// ============================================================

// Algorithms from model_selector.py
const REGRESSION_MODELS = [
  "Linear Regression", "Ridge", "Lasso", "Elastic Net",
  "Decision Tree", "Random Forest", "Extra Trees",
  "Gradient Boosting", "AdaBoost", "SVR",
  "K-Nearest Neighbors", "XGBoost", "LightGBM", "CatBoost",
];

const CLASSIFICATION_MODELS = [
  "Logistic Regression", "Decision Tree", "Random Forest",
  "Extra Trees", "Gradient Boosting", "AdaBoost",
  "SVM", "K-Nearest Neighbors", "Gaussian Naive Bayes",
  "XGBoost", "LightGBM", "CatBoost",
];

// Pipeline steps from pipeline.py
const PIPELINE_STEPS = [
  {
    icon: Database,
    title: "Load & Profile",
    description:
      "Reads your CSV, extracts column types, detects missing values, duplicate rows, and ID/constant columns.",
  },
  {
    icon: FlaskConical,
    title: "Detect & Clean",
    description:
      "Auto-detects the target column and task type. Removes duplicates, constant and ID columns automatically.",
  },
  {
    icon: Cpu,
    title: "Preprocess & Train",
    description:
      "Imputes missing values, scales numerics, encodes categoricals. Trains all candidate models in parallel.",
  },
  {
    icon: BarChart2,
    title: "Evaluate & Rank",
    description:
      "Evaluates every model on a held-out test set. Ranks by R² (regression) or F1 score (classification).",
  },
  {
    icon: Download,
    title: "Export",
    description:
      "Exports the best model, preprocessing pipeline, metadata, and full leaderboard as downloadable files.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export function LandingPage() {
  return (
    <div className="min-h-full p-6 max-w-[900px] mx-auto">

      {/* ─── Hero ─── */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="pt-8 pb-10 border-b border-[var(--color-border)]"
        aria-labelledby="hero-heading"
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] mb-5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" aria-hidden="true" />
          <span className="text-[11px] text-[var(--color-text-3)]">Open source · MIT license</span>
        </div>

        <h1
          id="hero-heading"
          className="text-[28px] font-bold text-[var(--color-text-1)] tracking-tight leading-tight max-w-[600px]"
        >
          Automated machine learning
          <br />
          for tabular data.
        </h1>

        <p className="text-[14px] text-[var(--color-text-2)] mt-3 max-w-[480px] leading-relaxed">
          Upload a CSV file. AutoML detects the task, trains{" "}
          <strong className="text-[var(--color-text-1)] font-medium">
            up to {REGRESSION_MODELS.length} models
          </strong>
          , ranks them by performance, and exports your best pipeline — ready to deploy.
        </p>

        <div className="flex items-center gap-3 mt-6">
          <Link
            to="/analyze"
            className="flex items-center gap-2 h-9 px-4 rounded bg-[var(--color-accent)] text-white text-[13px] font-semibold hover:bg-[var(--color-accent-dim)] transition-colors"
          >
            Get started
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
          <a
            href="https://github.com/Aayush-Deshpande/AutoML"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 h-9 px-4 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[13px] text-[var(--color-text-2)] hover:text-[var(--color-text-1)] hover:border-[var(--color-border-strong)] transition-colors"
          >
            View source
          </a>
        </div>
      </motion.section>

      {/* ─── Pipeline ─── */}
      <section className="py-8 border-b border-[var(--color-border)]" aria-labelledby="pipeline-heading">
        <h2
          id="pipeline-heading"
          className="text-[11px] font-semibold text-[var(--color-text-3)] uppercase tracking-wider mb-5"
        >
          How it works
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-5 gap-px bg-[var(--color-border)] rounded-lg overflow-hidden border border-[var(--color-border)]"
        >
          {PIPELINE_STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              variants={item}
              className="flex flex-col gap-3 px-4 py-4 bg-[var(--color-bg-elevated)]"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded bg-[var(--color-surface-2)] shrink-0">
                  <step.icon size={12} className="text-[var(--color-text-2)]" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-mono text-[var(--color-text-4)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[var(--color-text-1)]">
                  {step.title}
                </p>
                <p className="text-[11px] text-[var(--color-text-3)] leading-relaxed mt-1">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── Supported algorithms ─── */}
      <section className="py-8 border-b border-[var(--color-border)]" aria-labelledby="algorithms-heading">
        <h2
          id="algorithms-heading"
          className="text-[11px] font-semibold text-[var(--color-text-3)] uppercase tracking-wider mb-5"
        >
          Supported algorithms
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Regression */}
          <div>
            <p className="text-[12px] font-semibold text-[var(--color-text-2)] mb-3">
              Regression
              <span className="ml-2 text-[10px] font-mono text-[var(--color-text-4)]">
                {REGRESSION_MODELS.length} models
              </span>
            </p>
            <motion.ul
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col gap-1"
              aria-label="Regression models"
            >
              {REGRESSION_MODELS.map((model) => (
                <motion.li
                  key={model}
                  variants={item}
                  className="flex items-center gap-2 text-[12px] text-[var(--color-text-2)]"
                >
                  <CheckCircle size={10} className="text-[var(--color-text-4)] shrink-0" aria-hidden="true" />
                  {model}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Classification */}
          <div>
            <p className="text-[12px] font-semibold text-[var(--color-text-2)] mb-3">
              Classification
              <span className="ml-2 text-[10px] font-mono text-[var(--color-text-4)]">
                {CLASSIFICATION_MODELS.length} models · binary & multiclass
              </span>
            </p>
            <motion.ul
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col gap-1"
              aria-label="Classification models"
            >
              {CLASSIFICATION_MODELS.map((model) => (
                <motion.li
                  key={model}
                  variants={item}
                  className="flex items-center gap-2 text-[12px] text-[var(--color-text-2)]"
                >
                  <CheckCircle size={10} className="text-[var(--color-text-4)] shrink-0" aria-hidden="true" />
                  {model}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* ─── Key features ─── */}
      <section className="py-8" aria-labelledby="features-heading">
        <h2
          id="features-heading"
          className="text-[11px] font-semibold text-[var(--color-text-3)] uppercase tracking-wider mb-5"
        >
          Key features
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            {
              title: "Auto target detection",
              desc: "Scores each column on keyword hints, position, dtype, cardinality and missing rate to pick the best target.",
            },
            {
              title: "Auto task detection",
              desc: "Determines regression, binary, or multiclass classification from the target column's value distribution.",
            },
            {
              title: "Smart data cleaning",
              desc: "Removes duplicates, constant columns, and ID columns automatically before training.",
            },
            {
              title: "Full preprocessing pipeline",
              desc: "Median imputation + standard scaling for numerics. Mode imputation + one-hot encoding for categoricals.",
            },
            {
              title: "Exportable artifacts",
              desc: "Downloads best model .pkl, preprocessing pipeline .pkl, metadata .json, and leaderboard .json.",
            },
            {
              title: "Sortable leaderboard",
              desc: "Compare all models by any metric. Winner highlighted. Training times shown for every model.",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="px-4 py-3.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
            >
              <p className="text-[12px] font-semibold text-[var(--color-text-1)]">
                {feature.title}
              </p>
              <p className="text-[11px] text-[var(--color-text-3)] leading-relaxed mt-1">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <div className="mt-8 flex items-center gap-3">
          <Link
            to="/analyze"
            className="flex items-center gap-2 h-9 px-4 rounded bg-[var(--color-accent)] text-white text-[13px] font-semibold hover:bg-[var(--color-accent-dim)] transition-colors"
          >
            Start analyzing
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
          <p className="text-[11px] text-[var(--color-text-4)]">
            No setup required · Upload and go
          </p>
        </div>
      </section>
    </div>
  );
}
