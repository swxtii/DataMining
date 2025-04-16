import pandas as pd
import numpy as np
from scipy.stats import skew, kurtosis
from statsmodels.tsa.stattools import adfuller
from scipy.stats import linregress

# Load dataset
df = pd.read_csv("../frontend/public/generated_time_series.csv")

# Ensure proper types
df["date"] = pd.to_datetime(df["date"])
df["value"] = pd.to_numeric(df["value"], errors='coerce')

# Group by series_id in case there are multiple series
features = []

for series_id, group in df.groupby("series_id"):
    values = group["value"].dropna().values
    dates = (group["date"] - group["date"].min()).dt.days.values  # Numeric time for trend

    # Statistical features
    mean_val = np.mean(values)
    std_val = np.std(values)
    min_val = np.min(values)
    max_val = np.max(values)
    skew_val = skew(values)
    kurt_val = kurtosis(values)

    # Stationarity (ADF test)
    try:
        adf_stat = adfuller(values)[0]
    except Exception:
        adf_stat = np.nan

    # Autocorrelation (lag-1)
    autocorr_val = pd.Series(values).autocorr(lag=1)

    # Trend (slope of linear regression on time vs. value)
    try:
        slope, _, _, _, _ = linregress(dates, values)
    except Exception:
        slope = np.nan

    # Label: dummy (or replace with your own logic)
    label = np.random.randint(0, 3)

    features.append([
        series_id, mean_val, std_val, min_val, max_val, 
        skew_val, kurt_val, adf_stat, autocorr_val, slope, label
    ])

# Create DataFrame
columns = ["series_id", "mean", "std", "min", "max", "skew", "kurtosis",
           "stationarity", "autocorr", "trend", "label"]

features_df = pd.DataFrame(features, columns=columns)

# Save to CSV
features_df.to_csv("../frontend/public/generated_time_series_features.csv", index=False)
print("✅ Features saved to generated_time_series_features.csv")
