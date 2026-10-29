#!/usr/bin/env python
# coding: utf-8

# # 💻 Laptop Recommendation System Using Random Forest
# 
# ## Project Overview
# 
# This notebook develops the **machine-learning core of a laptop recommendation system**.
# 
# The system follows a simple and interview-friendly pipeline:
# 
# **Laptop dataset → Data cleaning → Feature engineering → Hardware performance score → Random Forest regression → Candidate filtering → Recommendation ranking**
# 
# ### What this notebook does
# 1. Loads and inspects the laptop dataset.
# 2. Cleans invalid records.
# 3. Creates useful derived features such as total storage, resolution pixels, dedicated-GPU flag, GPU VRAM, and CPU generation.
# 4. Creates a transparent **derived hardware Performance Score** because the dataset does not contain a measured benchmark target.
# 5. Trains a Random Forest Regressor to learn that scoring relationship.
# 6. Evaluates the model using MAE, RMSE, and R².
# 7. Builds a recommendation engine that applies hard user constraints before ranking laptops.
# 8. Supports **performance**, **budget/value**, and **balanced** recommendation preferences.
# 
# > **Important:** The Performance Score in this project is an engineered score based on laptop specifications. It is not a real-world benchmark score. Therefore, the model metrics measure how well Random Forest learns our scoring rule, not how accurately it predicts benchmark performance.

# ## 1. Import Libraries
# 
# We import only the libraries required for this notebook:
# 
# - **Pandas** → data loading, cleaning, filtering, and tabular operations.
# - **NumPy** → numerical calculations.
# - **re** → extracting GPU VRAM and Intel CPU generation from the model description.
# - **scikit-learn** → train/test split, preprocessing, Random Forest, pipeline, and evaluation metrics.
# 
# Keeping imports in one place makes the notebook easier to restart and maintain.

# In[1]:


import re
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

try:
    from IPython.display import display
except ImportError:
    display = print

pd.set_option("display.max_colwidth", 200)
pd.set_option("display.max_columns", 50)


# ## 2. Load the Dataset
# 
# The notebook expects `laptops.csv` to be available in the working directory.
# 
# ### If you are using Google Colab
# Upload `laptops.csv` to the Colab session first, or change `DATA_PATH` to the uploaded file path such as `/content/laptops.csv`.
# 
# ### If you are running locally
# Place `laptops.csv` in the same folder as this notebook.

# In[2]:


DATA_PATH = "C:\\Laptop_Recommendation\\ml\\laptops.csv"

df = pd.read_csv(DATA_PATH)

print(f"Original dataset shape: {df.shape}")
display(df.head())


# ## 3. Understand the Dataset Before Cleaning
# 
# Before changing anything, we inspect:
# 
# - number of rows and columns,
# - column names,
# - data types,
# - missing values,
# - duplicate rows.
# 
# This prevents us from cleaning blindly and gives us a baseline for explaining the dataset during an interview.

# In[3]:


print("Column names:")
print(df.columns.tolist())

print("\nData types:")
display(df.dtypes.to_frame("dtype"))

print("\nMissing values:")
display(df.isnull().sum().to_frame("missing_values"))

print("\nDuplicate rows:", df.duplicated().sum())


# ## 4. Data Cleaning
# 
# ### 4.1 Remove the dataset index
# 
# The `index` column is only a row identifier. It does not describe the laptop and should not be used by the model.

# In[4]:


if "index" in df.columns:
    df = df.drop(columns=["index"])

print(f"Shape after removing index: {df.shape}")


# ### 4.2 Handle invalid CPU thread values
# 
# The dataset contains **5 laptops with `num_threads = 0`**. A zero-thread CPU record is not useful for our performance modelling, so these records are removed rather than imputed.
# 
# This is a deliberate data-quality decision: we do not invent a thread count for a laptop when the source record is invalid.

# In[5]:


invalid_thread_rows = df[df["num_threads"] == 0].copy()

print(f"Invalid zero-thread rows found: {len(invalid_thread_rows)}")
if not invalid_thread_rows.empty:
    display(
        invalid_thread_rows[
            ["Model", "processor_brand", "processor_tier", "num_cores", "num_threads"]
        ]
    )

df = df[df["num_threads"] != 0].copy()

print(f"Shape after removing invalid rows: {df.shape}")
print("Remaining zero-thread rows:", (df["num_threads"] == 0).sum())


# ### 4.3 Verify the cleaned dataset
# 
# We verify that there are no missing values or duplicate rows after cleaning.

# In[6]:


missing_after_cleaning = df.isnull().sum()
print("Columns with missing values:")
display(missing_after_cleaning[missing_after_cleaning > 0].to_frame("missing_values"))

print("Duplicate rows after cleaning:", df.duplicated().sum())
print("Final cleaned shape:", df.shape)


# ## 5. Basic Exploratory Data Analysis
# 
# The model uses structured hardware specifications. We inspect the main categorical and numerical columns to understand what information is available.
# 
# `Model` is kept for identification and feature extraction, but it is **not used directly as a categorical ML feature** because nearly every model name is unique.

# In[7]:


categorical_columns = df.select_dtypes(include="object").columns.tolist()

for column in categorical_columns:
    print(f"\n--- {column} ---")
    print(df[column].value_counts().head(20))


# In[8]:


numerical_columns = df.select_dtypes(include=["int64", "float64"]).columns.tolist()

display(df[numerical_columns].describe().T)


# ## 6. Feature Engineering
# 
# Feature engineering converts raw columns into more useful signals for the recommendation system.
# 
# ### Engineered features
# 
# - **`total_storage`** = primary + secondary storage capacity.
# - **`resolution_pixels`** = width × height, giving total display pixels.
# - **`has_dedicated_gpu`** = 1 when the laptop has a dedicated GPU, otherwise 0.
# - **`gpu_vram`** = graphics memory extracted from the `Model` text when the description contains values such as `4GB Graph`, `8GB Graph`, etc. If no graphics-memory text is present, the value is 0, meaning **not mentioned**.
# - **`cpu_generation`** = Intel generation extracted from descriptions such as `11th Gen`, `12th Gen`, etc. AMD/Apple descriptions normally produce 0 because this rule specifically targets the Intel-style generation format.
# 
# `cpu_generation` is retained as a useful engineered feature for future improvements, although the current Random Forest feature list does not use it.

# In[9]:


# 1. Total storage in GB
df["total_storage"] = (
    df["primary_storage_capacity"] + df["secondary_storage_capacity"]
)

# 2. Total display resolution in pixels
df["resolution_pixels"] = (
    df["resolution_width"] * df["resolution_height"]
)

# 3. Binary indicator for a dedicated GPU
df["has_dedicated_gpu"] = (
    df["gpu_type"].str.lower() == "dedicated"
).astype(int)

# 4. Extract GPU VRAM from model descriptions
def extract_gpu_vram(text):
    match = re.search(r"(\d+)\s*GB\s*(?:Graph|Graphics)", str(text), re.IGNORECASE)
    return int(match.group(1)) if match else 0

# 5. Extract Intel CPU generation from model descriptions
def extract_intel_generation(text):
    match = re.search(
        r"(\d+)(?:th|st|nd|rd)\s+Gen",
        str(text),
        re.IGNORECASE
    )
    return int(match.group(1)) if match else 0

df["gpu_vram"] = df["Model"].apply(extract_gpu_vram)
df["cpu_generation"] = df["Model"].apply(extract_intel_generation)

print(f"Shape after feature engineering: {df.shape}")
display(
    df[
        [
            "Model", "total_storage", "resolution_pixels",
            "has_dedicated_gpu", "gpu_vram", "cpu_generation"
        ]
    ].head()
)


# ## 7. Create the Target: Hardware Performance Score
# 
# The dataset does not provide a reliable measured `Performance_Score`. It contains a user/product `Rating`, but that rating is not the same thing as hardware performance.
# 
# Therefore, this project creates a **transparent derived hardware score** from CPU, GPU, RAM, storage, and display specifications.
# 
# ### Why this approach?
# 
# It gives the Random Forest a numerical target that represents our project's definition of hardware capability.
# 
# ### Important limitation
# 
# The weights and component scores are **project assumptions**, not benchmark measurements. A stronger future version would replace this engineered target with real CPU/GPU benchmark data.

# ### 7.1 CPU score
# 
# CPU score combines:
# 
# - CPU tier baseline: 60%
# - normalized core count: 20%
# - normalized thread count: 20%
# 
# The tier mapping provides a reasonable baseline ordering such as Celeron < Core i3 < Core i5 < Core i7 < Core i9 and Ryzen 3 < Ryzen 5 < Ryzen 7 < Ryzen 9.

# In[10]:


cpu_tier_score_map = {
    "celeron": 25,
    "pentium": 30,
    "core i3": 45,
    "core i5": 60,
    "core i7": 75,
    "core i9": 90,
    "core ultra 7": 80,
    "ryzen 3": 45,
    "ryzen 5": 60,
    "ryzen 7": 75,
    "ryzen 9": 90,
    "m1": 65,
    "m2": 75,
    "m3": 85,
    "other": 40,
}

df["cpu_tier_score"] = (
    df["processor_tier"].str.lower().map(cpu_tier_score_map).fillna(40)
)

df["cpu_core_score"] = (
    df["num_cores"] / df["num_cores"].max()
) * 100

df["cpu_thread_score"] = (
    df["num_threads"] / df["num_threads"].max()
) * 100

df["cpu_score"] = (
    0.60 * df["cpu_tier_score"]
    + 0.20 * df["cpu_core_score"]
    + 0.20 * df["cpu_thread_score"]
)


# ### 7.2 GPU score
# 
# GPU score combines:
# 
# - GPU brand baseline: 45%
# - dedicated/integrated GPU type: 40%
# - GPU VRAM: 15%
# 
# This is a simplified scoring rule designed for this project, not a replacement for real GPU benchmarks.

# In[11]:


gpu_brand_score_map = {
    "nvidia": 90,
    "amd": 80,
    "intel": 55,
    "apple": 70,
    "arm": 40,
}

df["gpu_brand_score"] = (
    df["gpu_brand"].str.lower().map(gpu_brand_score_map).fillna(40)
)

df["gpu_type_score"] = np.where(
    df["gpu_type"].str.lower() == "dedicated",
    90,
    np.where(df["gpu_type"].str.lower() == "integrated", 50, 65)
)

df["gpu_vram_score"] = (
    df["gpu_vram"].clip(0, 16) / 16
) * 100

df["gpu_score"] = (
    0.45 * df["gpu_brand_score"]
    + 0.40 * df["gpu_type_score"]
    + 0.15 * df["gpu_vram_score"]
)


# ### 7.3 RAM, storage, and display scores
# 
# - RAM is capped at 32 GB for scoring.
# - Total storage is capped at 2048 GB for scoring.
# - Display score uses resolution (70%) and screen size (30%).
# 
# The caps prevent unusually large specifications from dominating the score.

# In[12]:


df["ram_score"] = (
    df["ram_memory"].clip(0, 32) / 32
) * 100

df["storage_score"] = (
    df["total_storage"].clip(0, 2048) / 2048
) * 100

df["resolution_score"] = (
    df["resolution_pixels"] / df["resolution_pixels"].max()
) * 100

df["display_size_score"] = (
    df["display_size"] / df["display_size"].max()
) * 100

df["display_score"] = (
    0.70 * df["resolution_score"]
    + 0.30 * df["display_size_score"]
)


# ### 7.4 Final Performance Score
# 
# The final score is:
# 
# **40% CPU + 40% GPU + 10% RAM + 5% Storage + 5% Display**
# 
# CPU and GPU receive the largest weights because this project focuses on overall hardware capability.

# In[13]:


df["Performance_Score"] = (
    0.40 * df["cpu_score"]
    + 0.40 * df["gpu_score"]
    + 0.10 * df["ram_score"]
    + 0.05 * df["storage_score"]
    + 0.05 * df["display_score"]
).round(2)

print("Performance Score summary:")
display(df["Performance_Score"].describe().to_frame())


# ## 8. Inspect the Generated Scores
# 
# This check helps us verify that the scoring system behaves directionally as expected: higher-end CPUs/GPUs and larger memory configurations should generally appear near the top.

# In[14]:


score_view = [
    "Model", "Price", "processor_tier", "gpu_brand",
    "gpu_type", "ram_memory", "total_storage", "Performance_Score"
]

top_laptops = df.sort_values("Performance_Score", ascending=False).head(15)
display(top_laptops[score_view])


# ## 9. Prepare Features and Target for Machine Learning
# 
# ### Target (`y`)
# 
# `Performance_Score` is the numerical value that Random Forest will learn to predict.
# 
# ### Features (`X`)
# 
# We use hardware and product attributes that are available when recommending a laptop.
# 
# `Model` is intentionally excluded because it is almost unique for every row and would not generalize well as a categorical feature.
# 
# > **Target leakage note:** The intermediate score columns such as `cpu_score`, `gpu_score`, and `ram_score` are not used as model inputs because they were directly used to construct the target. Including them would make the evaluation misleading.

# In[15]:


target = "Performance_Score"

features = [
    "Price",
    "processor_brand",
    "processor_tier",
    "num_cores",
    "num_threads",
    "ram_memory",
    "primary_storage_type",
    "primary_storage_capacity",
    "gpu_brand",
    "gpu_type",
    "gpu_vram",
    "has_dedicated_gpu",
    "display_size",
    "resolution_width",
    "resolution_height",
    "OS",
]

categorical_features = [
    "processor_brand",
    "processor_tier",
    "primary_storage_type",
    "gpu_brand",
    "gpu_type",
    "OS",
]

numerical_features = [
    "Price",
    "num_cores",
    "num_threads",
    "ram_memory",
    "primary_storage_capacity",
    "gpu_vram",
    "has_dedicated_gpu",
    "display_size",
    "resolution_width",
    "resolution_height",
]

X = df[features]
y = df[target]

print("Number of model features:", len(features))
print("Categorical features:", categorical_features)
print("Numerical features:", numerical_features)


# ## 10. Train-Test Split
# 
# We keep **20% of the data as an unseen test set**.
# 
# - 80% → training
# - 20% → testing
# - `random_state=42` → reproducible split
# 
# The test set is not used to fit the model and is used only for evaluation.

# In[16]:


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
)

print("Training rows:", len(X_train))
print("Testing rows:", len(X_test))


# ## 11. Build the Preprocessing + Random Forest Pipeline
# 
# The pipeline has two main stages.
# 
# ### Stage 1 — Preprocessing
# 
# Categorical columns are converted to numerical form using **One-Hot Encoding**.
# 
# `handle_unknown="ignore"` makes the pipeline robust when a new category appears during prediction.
# 
# ### Stage 2 — Random Forest Regressor
# 
# Random Forest combines many decision trees and averages their predictions to produce a numerical score.
# 
# We use:
# 
# - `n_estimators=300` → 300 trees
# - `random_state=42` → reproducibility
# - `n_jobs=-1` → use available CPU cores

# In[17]:


preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features,
        )
    ],
    remainder="passthrough",
)

rf_model = RandomForestRegressor(
    n_estimators=300,
    random_state=42,
    n_jobs=-1,
)

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", rf_model),
    ]
)

pipeline


# ## 12. Train the Random Forest Model

# In[18]:


pipeline.fit(X_train, y_train)
print("Random Forest training completed successfully.")


# ## 13. Predict on the Unseen Test Set
# 
# The trained pipeline automatically applies the same categorical encoding used during training and then generates predicted Performance Scores.

# In[19]:


predictions = pipeline.predict(X_test)

print("First 10 predictions:")
print(predictions[:10])


# ## 14. Evaluate the Model
# 
# We use three regression metrics:
# 
# ### MAE — Mean Absolute Error
# Average absolute difference between actual and predicted scores. Lower is better.
# 
# ### RMSE — Root Mean Squared Error
# Penalizes larger errors more strongly than MAE. Lower is better.
# 
# ### R² — Coefficient of Determination
# Measures how much of the variation in the target is explained by the model. Closer to 1 is better.
# 
# ### Interpretation for this project
# Because `Performance_Score` was itself generated from the same hardware specifications supplied to the model, a very high R² is expected. We should **not** describe this as real-world benchmark prediction accuracy.

# In[20]:


mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))
r2 = r2_score(y_test, predictions)

print(f"MAE : {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R²  : {r2:.4f}")


# ## 15. Actual vs Predicted Values
# 
# This table makes individual prediction errors easy to inspect.

# In[21]:


results = pd.DataFrame({
    "Actual": y_test.values,
    "Predicted": predictions,
})

results["Error"] = results["Actual"] - results["Predicted"]
results["Absolute_Error"] = results["Error"].abs()

results.head(15)


# ## 16. Random Forest Feature Importance
# 
# Random Forest can estimate how much each transformed feature contributes to prediction.
# 
# Because categorical variables were one-hot encoded, the importance output contains the encoded category names.

# In[22]:


trained_model = pipeline.named_steps["model"]
trained_preprocessor = pipeline.named_steps["preprocessor"]

feature_names = trained_preprocessor.get_feature_names_out()

importance = pd.DataFrame({
    "Feature": feature_names,
    "Importance": trained_model.feature_importances_,
}).sort_values("Importance", ascending=False)

print("Top 20 model features:")
display(importance.head(20))


# # 17. Recommendation Engine
# 
# The ML model predicts a performance score, but **prediction alone is not a recommendation system**.
# 
# A recommendation request has user constraints such as:
# 
# - maximum budget,
# - minimum RAM,
# - minimum storage,
# - intended purpose,
# - preference for maximum performance, value, or balance.
# 
# Therefore, the system uses this order:
# 
# **1. Hard filtering → 2. ML performance prediction → 3. Value calculation → 4. Preference-aware ranking → 5. Top-N recommendations**
# 
# This is important because a laptop that violates the user's budget or minimum RAM requirement should not be recommended merely because it has a high performance score.

# ## 18. Hard Constraint Filtering
# 
# The first stage removes laptops that do not satisfy the user's mandatory requirements.
# 
# Current hard constraints:
# 
# - `Price <= budget`
# - `RAM >= min_ram`
# - `total_storage >= min_storage`
# 
# Gaming also requires a dedicated GPU in the current implementation.

# In[23]:


def filter_laptops(data, budget, min_ram=8, min_storage=256):
    """Apply mandatory user constraints before ML ranking."""
    return data[
        (data["Price"] <= budget)
        & (data["ram_memory"] >= min_ram)
        & (data["total_storage"] >= min_storage)
    ].copy()


def apply_purpose_filter(data, purpose):
    """Apply purpose-specific constraints currently supported by the project."""
    purpose = purpose.lower().strip()

    if purpose == "gaming":
        return data[data["has_dedicated_gpu"] == 1].copy()

    return data.copy()


# ## 19. Recommendation Ranking Logic
# 
# The recommendation function supports three ranking preferences.
# 
# ### Performance
# Sort only by predicted performance, highest first.
# 
# ### Budget / Value
# Calculate:
# 
# **Value Score = Predicted Performance / Price × 100,000**
# 
# A higher value score means the user gets more predicted performance per unit of price.
# 
# ### Balanced
# Normalize both predicted performance and value, then calculate:
# 
# **Final Score = 70% normalized performance + 30% normalized value**
# 
# This produces a compromise between buying the fastest laptop and buying the best value.

# In[24]:


def recommend_laptops(
    data,
    budget,
    min_ram=8,
    min_storage=256,
    purpose="General",
    preference="balanced",
    top_n=5,
):
    """Return top laptop recommendations after filtering and ML ranking."""

    # 1. Apply hard constraints.
    candidates = filter_laptops(
        data,
        budget=budget,
        min_ram=min_ram,
        min_storage=min_storage,
    )

    # 2. Apply purpose-specific filtering.
    candidates = apply_purpose_filter(candidates, purpose)

    if candidates.empty:
        return pd.DataFrame()

    # 3. Predict hardware performance for eligible laptops.
    candidates["Predicted_Performance"] = pipeline.predict(candidates[features])

    # 4. Calculate performance per price unit.
    candidates["Value_Score"] = (
        candidates["Predicted_Performance"] / candidates["Price"]
    ) * 100000

    preference = preference.lower().strip()

    # 5. Rank according to the user's preference.
    if preference == "performance":
        candidates = candidates.sort_values(
            "Predicted_Performance", ascending=False
        )

    elif preference == "budget":
        candidates = candidates.sort_values(
            "Value_Score", ascending=False
        )

    elif preference == "balanced":
        max_performance = candidates["Predicted_Performance"].max()
        max_value = candidates["Value_Score"].max()

        candidates["Normalized_Performance"] = (
            candidates["Predicted_Performance"] / max_performance
        )
        candidates["Normalized_Value"] = (
            candidates["Value_Score"] / max_value
        )
        candidates["Final_Score"] = (
            0.70 * candidates["Normalized_Performance"]
            + 0.30 * candidates["Normalized_Value"]
        )

        candidates = candidates.sort_values(
            "Final_Score", ascending=False
        )

    else:
        raise ValueError(
            "preference must be 'performance', 'budget', or 'balanced'"
        )

    return candidates.head(top_n).copy()


# ## 20. Test the Recommendation System
# 
# ### Example user request
# 
# - Budget: **₹80,000**
# - Minimum RAM: **16 GB**
# - Minimum storage: **512 GB**
# - Purpose: **Gaming**
# - Number of recommendations: **5**
# 
# First we test performance-oriented ranking.

# In[25]:


performance_recs = recommend_laptops(
    df,
    budget=80000,
    min_ram=16,
    min_storage=512,
    purpose="Gaming",
    preference="performance",
    top_n=5,
)

recommendation_columns = [
    "Model",
    "Price",
    "ram_memory",
    "total_storage",
    "gpu_brand",
    "gpu_type",
    "Predicted_Performance",
    "Value_Score",
]

display(performance_recs[recommendation_columns])


# ## 21. Budget / Value-Oriented Recommendations
# 
# The budget preference does **not** simply select the cheapest laptops. It ranks by performance obtained per unit of price.

# In[26]:


budget_recs = recommend_laptops(
    df,
    budget=80000,
    min_ram=16,
    min_storage=512,
    purpose="Gaming",
    preference="budget",
    top_n=5,
)

display(budget_recs[recommendation_columns])


# ## 22. Balanced Recommendations
# 
# The balanced mode combines:
# 
# - 70% predicted performance
# - 30% value for money
# 
# This is useful for users who want strong performance without automatically selecting the most expensive machine.

# In[27]:


balanced_recs = recommend_laptops(
    df,
    budget=80000,
    min_ram=16,
    min_storage=512,
    purpose="Gaming",
    preference="balanced",
    top_n=5,
)

display(
    balanced_recs[
        recommendation_columns + ["Final_Score"]
    ]
)


# ## 23. End-to-End System Flow
# 
# The complete logic implemented in this notebook is:
# 
# ```text
# User inputs
#    ↓
# Budget / RAM / Storage / Purpose / Preference
#    ↓
# Hard constraint filtering
#    ↓
# Eligible laptops
#    ↓
# Random Forest prediction
#    ↓
# Predicted Performance Score
#    ↓
# Value Score
#    ↓
# Preference-based ranking
#    ↓
# Top-N laptop recommendations
# ```
# 
# ### Why filter before ML ranking?
# 
# Machine learning should rank **eligible candidates**, not override explicit user requirements. For example, if the user says the budget is ₹80,000, a ₹2,00,000 laptop must never appear simply because it has a higher performance score.

# # 24. What You Should Be Able to Explain in an Interview
# 
# ### Why Random Forest?
# 
# > “I used Random Forest Regression because the target is numerical and the relationship between hardware specifications and performance is nonlinear. Random Forest can capture interactions between numerical and categorical features and does not require feature scaling.”
# 
# ### Why One-Hot Encoding?
# 
# > “The dataset contains categorical variables such as processor tier, GPU brand, GPU type, and OS. I used One-Hot Encoding to convert these categories into numerical features that the Random Forest model can process.”
# 
# ### Why did you create Performance Score?
# 
# > “The dataset did not contain a reliable benchmark-based performance target. So I created a transparent hardware-performance score using CPU, GPU, RAM, storage, and display specifications. The Random Forest then learns this scoring relationship.”
# 
# ### Why not use Rating as the target?
# 
# > “Rating represents a product or user rating and does not directly measure hardware performance, so I did not treat it as the performance target.”
# 
# ### Why filtering before prediction?
# 
# > “Budget, minimum RAM, and minimum storage are hard constraints. I filter those first and use the ML model only to rank the laptops that are actually eligible.”
# 
# ### What does the high R² mean here?
# 
# > “The high R² shows that Random Forest learned our engineered scoring relationship very well. Since the target was constructed from the same specifications used as inputs, I would not claim that this is real-world benchmark prediction accuracy.”

# # 25. Limitations and Future Improvements
# 
# This notebook is a strong portfolio prototype, but there are clear improvements for a production-quality system.
# 
# ### Current limitations
# 
# 1. The Performance Score is engineered rather than benchmark-measured.
# 2. GPU model names are not used as a direct ML feature.
# 3. `cpu_generation` is extracted but not currently included in the model feature list.
# 4. Purpose filtering currently has a dedicated-GPU rule for Gaming; richer purpose-specific logic can be added.
# 5. `Price` is included as a model feature even though it is not directly part of the engineered Performance Score. A future experiment should compare this version with a model that excludes price.
# 
# ### Planned improvements
# 
# - Add real CPU and GPU benchmark data.
# - Add stronger purpose-specific scoring for Gaming, AI/ML, Video Editing, Programming, Student, Office, and General use.
# - Add optional brand and OS constraints.
# - Generate human-readable recommendation explanations.
# - Save the trained pipeline using Joblib.
# - Expose the recommendation function through a FastAPI `/recommend` endpoint.
# - Connect the API to the React frontend.
# - Deploy the frontend and backend.
# 
# The final application architecture is intended to be:
# 
# **React.js → FastAPI → Recommendation Engine → Random Forest → Ranked Recommendations → React UI**

# # 26. Final Checklist
# 
# Before moving to the web application stage, verify that you can run the notebook from top to bottom without manually re-running cells out of order.
# 
# - [ ] Dataset loads successfully.
# - [ ] Invalid zero-thread records are removed.
# - [ ] No missing/duplicate records remain.
# - [ ] Engineered features are created.
# - [ ] Performance Score is generated.
# - [ ] Train/test split is reproducible.
# - [ ] Random Forest pipeline trains successfully.
# - [ ] MAE, RMSE, and R² are calculated.
# - [ ] Feature importance is displayed.
# - [ ] Recommendation filtering works.
# - [ ] Performance preference works.
# - [ ] Budget/value preference works.
# - [ ] Balanced preference works.
# 
# **Next project phase:** save the trained pipeline and build the **FastAPI backend** that will receive user requirements from the React frontend.
