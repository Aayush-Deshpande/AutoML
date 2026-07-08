# AutoML Frontend Development Specification

## Objective

Build a world-class frontend for an AutoML platform.

This is **NOT** a marketing website.

This is **NOT** a portfolio landing page.

This is **NOT** an Awwwards clone.

This is a professional AI SaaS application whose primary purpose is helping users upload datasets, analyze them, compare machine learning models, and download trained pipelines.

The frontend must feel like a polished production product.

Think:

- OpenAI
- Cursor
- Linear
- Vercel
- Perplexity
- Anthropic
- Supabase
- GitHub

NOT:

- Generic AI-generated dashboards
- Bootstrap templates
- Material UI admin panels
- Hero → Features → CTA templates
- Excessive gradients
- Random floating blobs
- Overused glassmorphism everywhere
- Fake futuristic animations
- Stock AI illustrations
- Generic SaaS landing pages

The UI should feel intentionally designed by a senior product designer.

---

# FIRST TASK

Before writing a single line of frontend code:

Understand the backend completely.

Do NOT immediately start generating React code.

Go through the backend one file at a time.

Build a complete mental model.

Understand:

- Architecture
- Folder structure
- Responsibilities
- Data flow
- API contracts
- Object lifecycle
- Execution flow
- Exported files
- Error handling
- Response formats

Specifically understand:

main.py

api/

- routes.py
- response_builder.py

services/

- automl_service.py

core/

- dataset_loader.py
- dataset_profiler.py
- target_detector.py
- task_detector.py
- data_cleaner.py
- preprocessor.py
- model_selector.py
- model_trainer.py
- evaluator.py
- leaderboard.py
- pipeline.py
- model_exporter.py

Do not make assumptions.

If something is unclear, ask.

Only after the backend is completely understood should implementation begin.

---

# Development Philosophy

The frontend should look handcrafted.

Avoid every visual pattern that immediately screams "AI generated."

Never generate:

- equally sized cards everywhere
- repetitive spacing
- identical border radii
- generic shadows
- template dashboards
- copied SaaS layouts
- overuse of glass cards
- meaningless animations
- random decorative elements
- huge empty hero sections

Everything should have purpose.

Every component should solve a problem.

Prioritize usability over decoration.

Design should support the workflow rather than distract from it.

---

# Technology Stack

React

TypeScript

Vite

TailwindCSS

shadcn/ui

Framer Motion

Lucide Icons

Axios

Recharts

React Hook Form

Zod

Do not use:

Bootstrap

Material UI

Chakra UI

Ant Design

jQuery

---

# Overall Structure

Landing Page

↓

Upload Dataset

↓

Analysis Progress

↓

Results Dashboard

↓

Downloads

---

# Pages

## Landing

Minimal.

Professional.

Purpose:

Explain:

- What AutoML does
- Supported algorithms
- Pipeline overview
- Key features
- CTA

No unnecessary animations.

Subtle motion only.

---

## Upload

Drag and drop.

Browse button.

Target column selector.

Dataset validation.

Analyze button.

Progress indicator.

---

## Loading

Beautiful progress experience.

Skeletons.

Progress states.

Animated status updates.

Prevent duplicate submissions.

---

## Results Dashboard

Dataset Summary

Cleaning Report

Detected Task

Detected Target

Leaderboard

Best Model

Metrics

Downloads

Failed Models

Everything should be readable at a glance.

---

# Dashboard Layout

Top Navigation

↓

Sidebar

↓

Main Content

↓

Responsive Grid

↓

Cards only where appropriate

Avoid putting everything inside cards.

Mix layouts naturally.

---

# Components

Navbar

Sidebar

UploadZone

DatasetSummary

CleaningReport

TaskCard

BestModelCard

LeaderboardTable

MetricsGrid

DownloadSection

ErrorAlert

LoadingState

Footer

Reusable only.

No duplicated UI.

---

# API

Backend endpoint

POST

/analyze

multipart/form-data

Inputs

file

target_column (optional)

Backend returns

status

results

Inside results

metadata

target_column

task

cleaning_report

leaderboard

best_model

failed_models

exported_files

Frontend must exactly match this contract.

Do not modify backend expectations.

---

# Dataset Summary

Display

Rows

Columns

Memory Usage

Numeric Columns

Categorical Columns

Boolean Columns

Datetime Columns

---

# Cleaning Report

Duplicates Removed

Constant Columns Removed

ID Columns Removed

Total Columns Removed

---

# Best Model

Large featured component.

Display

Model Name

Primary Score

Training Time

Metrics

Highlight clearly.

---

# Leaderboard

Sortable.

Searchable.

Responsive.

Columns

Rank

Model

Score

Training Time

Metrics

Winner should be visually distinguished.

---

# Downloads

Buttons

Download Model

Download Preprocessor

Download Metadata

Download Leaderboard

---

# Error Handling

Handle

Upload failures

Invalid CSV

Backend exceptions

Network failures

Empty responses

Gracefully.

Never expose raw Python tracebacks.

---

# UX

Everything should feel fast.

Smooth transitions.

Meaningful micro-interactions.

No distracting motion.

Professional polish.

Responsive.

Accessible.

Keyboard friendly.

---

# Code Quality

Use proper folder structure.

services/

components/

hooks/

pages/

layouts/

types/

utils/

assets/

No API calls inside components.

Centralize all networking.

Strong TypeScript types.

No duplicated logic.

---

# Final Requirement

Continuously maintain a mental model of the backend while building the frontend.

Before generating each major section:

1. Explain your understanding.

2. Explain why that design fits the backend.

3. Implement.

4. Verify against the backend.

5. Continue.

Do not rush.

Do not generate the entire project in one pass.

Build incrementally while ensuring every screen matches the backend exactly.

The final result should look like a premium AI product built by an experienced product engineering team—not a generic AI-generated React dashboard or template.
