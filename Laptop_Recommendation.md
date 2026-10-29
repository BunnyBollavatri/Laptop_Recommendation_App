# Laptop Recommendation System Using Machine Learning

## 1. Project Overview

Choosing a laptop can be difficult because there are many models with different combinations of processors, graphics cards, RAM, storage, displays, battery capacity, weight, and prices. A laptop that is suitable for gaming may not be the best choice for a student or a professional.

This project aims to build a **machine-learning-based laptop recommendation system** that recommends suitable laptops according to a user's budget, intended usage, and hardware preferences.

The system will first filter laptops according to the user's mandatory requirements. It will then use a **Random Forest Regression model** to predict the performance of the eligible laptops and rank them to produce the best recommendations.

---

## 2. Problem Statement

Laptop comparison websites provide specifications and filters, but users still have to compare many products and decide which configuration provides the best value for their particular needs.

The goal of this project is:

> **To automatically identify and rank laptops that best match a user's budget, usage requirements, and performance preferences using machine learning.**

---

## 3. Project Objectives

- Collect and preprocess laptop specification and pricing data.
- Identify hardware features that are relevant to laptop performance.
- Allow users to specify budget, usage, and hardware requirements.
- Filter laptops that do not satisfy mandatory requirements.
- Use Random Forest Regression to predict laptop performance.
- Rank eligible laptops according to predicted performance.
- Provide a simple web interface for personalized recommendations.

---

## 4. Literature Survey

### 4.1 Recommender Systems

Recommender systems help users make decisions by reducing the amount of information they need to evaluate. Common approaches include **content-based filtering, collaborative filtering, and hybrid recommendation systems**.

Collaborative filtering generally depends on historical user-item interactions such as ratings, purchases, or clicks. While effective when sufficient user history is available, it can suffer from data sparsity and cold-start problems.

For the initial version of this project, collaborative filtering is not appropriate because we do not have a large collection of historical user ratings or interactions.

### 4.2 Content-Based Recommendation

Content-based recommendation uses item characteristics to identify products that match user requirements. For laptops, these characteristics include CPU, GPU, RAM, storage, display, battery, weight, and price.

This approach is particularly relevant to laptop recommendation because laptop specifications provide rich information for comparing products.

Our system builds on this idea by using specification-based filtering followed by machine-learning-based performance prediction.

### 4.3 Machine Learning for Recommendation

Machine learning can identify relationships between product characteristics and outcomes that are difficult to capture with simple manually defined rules.

Random Forest is an ensemble learning algorithm that combines multiple decision trees to produce a prediction. It is suitable for this project because laptop performance can depend on several interacting hardware features.

In this project, Random Forest Regression will be used to estimate a numerical **Performance Score** for eligible laptops.

### 4.4 Laptop Recommendation Research

Previous laptop recommendation studies have explored techniques such as content-based filtering and machine learning to recommend laptops according to specifications, prices, and user requirements.

A 2024 study on laptop recommendation and price estimation investigated machine-learning techniques for recommending laptops based on user preferences and laptop specifications.

Another 2024 project, RECBOT, explored web-based laptop recommendation using content-based filtering and product attributes such as price and performance.

These studies demonstrate that laptop recommendation is a suitable application for recommendation and machine-learning techniques.

### 4.5 Identified Gap

Many basic laptop recommendation systems focus primarily on specification matching, similarity, or manually defined rules.

This project takes a more structured approach:

```text
User Requirements
       ↓
Constraint-Based Filtering
       ↓
Eligible Laptops
       ↓
Feature Engineering
       ↓
Random Forest Prediction
       ↓
Performance Ranking
       ↓
Personalized Recommendations
```

The separation between **hard constraints** and **machine-learning-based ranking** makes the recommendation process easier to understand and implement.

---

## 5. Proposed System

The proposed system consists of four main stages.

### Stage 1 — User Input

The user provides requirements such as:

- Budget
- Usage
- Performance preference
- Minimum RAM
- Minimum storage
- Optional display or GPU requirements

Example:

```text
Budget: ₹70,000
Usage: Gaming
Preference: Performance
RAM: 16 GB
Storage: 512 GB
```

### Stage 2 — Candidate Filtering

The system applies mandatory constraints before running the ML model.

For example:

```text
Price <= ₹70,000
RAM >= 16 GB
Storage >= 512 GB
```

This reduces the number of laptops that need to be evaluated and ensures that unsuitable laptops are not recommended.

### Stage 3 — Performance Prediction

The filtered laptops are transformed into model-ready features.

Example features include:

```text
CPU information
GPU information
RAM capacity
Storage capacity
GPU VRAM
Screen size
Resolution
Refresh rate
Battery capacity
Weight
Price
```

The Random Forest Regressor predicts a performance score for each eligible laptop.

### Stage 4 — Ranking and Recommendation

The eligible laptops are ranked using their predicted performance scores.

Example:

| Rank | Laptop | Price | Predicted Performance |
|---|---|---:|---:|
| 1 | Laptop A | ₹68,990 | 91.4 |
| 2 | Laptop B | ₹67,990 | 88.7 |
| 3 | Laptop C | ₹64,990 | 86.2 |

The top-ranked laptops are presented to the user.

---

## 6. System Architecture

```text
                    USER
                      │
                      ↓
             React.js Frontend
                      │
                      │ HTTP Request
                      ↓
                FastAPI Backend
                      │
                      ↓
             Recommendation Engine
                      │
             ┌────────┴────────┐
             ↓                 ↓
       User Constraints    Laptop Dataset
             │                 │
             └────────┬────────┘
                      ↓
             Constraint Filtering
                      ↓
              Candidate Laptops
                      ↓
              Feature Engineering
                      ↓
            Random Forest Regressor
                      ↓
          Predicted Performance Score
                      ↓
                  Ranking
                      ↓
             Top Recommendations
                      │
                      ↓
                React.js UI
```

---

## 7. Machine Learning Approach

### Algorithm

**Random Forest Regressor**

### Problem Type

**Supervised Learning — Regression**

The model will predict a numerical performance score rather than directly predicting a laptop name.

### Model Input

Potential features include:

- CPU performance
- GPU performance
- RAM
- Storage
- GPU VRAM
- Display refresh rate
- Resolution
- Battery capacity
- Weight
- Price
- Other relevant specifications

### Model Output

```text
Predicted Performance Score
```

The actual target definition will be established during data preparation using reliable benchmark/performance information rather than an arbitrary score.

---

## 8. Model Evaluation

The Random Forest model will be evaluated using regression metrics:

### Mean Absolute Error (MAE)

Measures the average absolute difference between actual and predicted performance.

### Root Mean Squared Error (RMSE)

Measures prediction error while giving greater weight to larger errors.

### R² Score

Measures how well the model explains the variation in the target variable.

The final project will report the actual evaluation results obtained during model training.

---

## 9. Technology Stack

| Area | Technology |
|---|---|
| Programming | Python |
| Data Processing | Pandas, NumPy |
| Machine Learning | Scikit-learn |
| ML Algorithm | Random Forest Regressor |
| Backend | FastAPI |
| Frontend | React.js |
| Data Storage | CSV initially |
| Database | PostgreSQL if required |
| Version Control | Git, GitHub |

---

## 10. Development Workflow

```text
1. Dataset Collection
        ↓
2. Data Cleaning
        ↓
3. Exploratory Data Analysis
        ↓
4. Feature Engineering
        ↓
5. Define Performance Target
        ↓
6. Train Random Forest
        ↓
7. Evaluate Model
        ↓
8. Implement Filtering
        ↓
9. Build Recommendation Engine
        ↓
10. Develop FastAPI Backend
        ↓
11. Develop React Frontend
        ↓
12. Testing and Deployment
```

---

## 11. Expected Outcome

The completed application should allow a user to enter requirements such as:

```text
Budget: ₹70,000
Usage: Gaming
Preference: Performance
RAM: 16 GB
Storage: 512 GB
```

The system will then:

1. Filter laptops that do not meet the requirements.
2. Predict the performance of the remaining laptops using Random Forest.
3. Rank the eligible laptops.
4. Display the top recommendations with relevant specifications and performance information.

---

## 12. Future Improvements

Future versions could include:

- Real-time laptop pricing.
- More comprehensive benchmark data.
- User ratings and feedback.
- Price-to-performance scoring.
- Content-based similarity recommendations.
- Hybrid recommendation methods.
- Explainable recommendations showing why a laptop was selected.

---

## 13. References and Literature

1. **Recommender Systems Survey** — Springer. Research covering content-based, collaborative, and hybrid recommender systems and common challenges such as personalization, cold-start, and explainability.  
   https://link.springer.com/article/10.1007/s00521-024-10828-5

2. **A Systematic Review of Recommender Systems** — Journal of Big Data. Overview of recommendation approaches and research challenges.  
   https://link.springer.com/article/10.1186/s40537-022-00592-5

3. **A Review on Designing of Laptop Recommendation and Price Estimation System** — ResearchGate, 2024. Study of machine-learning approaches for laptop recommendation and price estimation.  
   https://www.researchgate.net/publication/379652053_A_Review_on_Designing_of_Laptop_recommendation_and_price_estimation_System

4. **RECBOT: Web-based Laptop Recommendation using Machine Learning** — ResearchGate, 2024. Laptop recommendation using product attributes and content-based filtering.  
   https://www.researchgate.net/publication/406168827_RECBOT_Web-based_Laptop_Recommendation_using_Machine_Learning

5. **Random Forest for Recommendation** — PubMed Central. Published research demonstrating the application of Random Forest to recommendation-related prediction tasks.  
   https://pmc.ncbi.nlm.nih.gov/articles/PMC4142736/

---

## 14. Project Summary

The Laptop Recommendation System combines **constraint-based filtering** with **machine-learning-based performance prediction**.

The key design is:

> **Filter unsuitable laptops first, use Random Forest to predict the performance of eligible laptops, and rank the results to provide personalized recommendations.**

This approach provides a practical foundation for a machine-learning recommendation application while keeping the system understandable, testable, and suitable for future extensions.
