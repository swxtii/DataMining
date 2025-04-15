import numpy as np
import pandas as pd
from statsmodels.tsa.stattools import adfuller, acf
from scipy.stats import kurtosis, skew
from sklearn.ensemble import RandomForestClassifier

# Create a simple in-memory classifier instead of loading from disk
clf = RandomForestClassifier(n_estimators=10)

# This function will be called on the first prediction
def lazy_init_classifier(features_df):
    global clf
    # Simple rules based on feature values to make a decision
    values = features_df.iloc[0]
    
    # Check stationarity and autocorrelation to make decisions
    if values['stationarity'] < 0.05:  # Stationary series
        if values['autocorr'] > 0.7:  # Strong autocorrelation
            return 3  # ARIMA
        else:
            return 1  # ETS
    else:  # Non-stationary series
        if abs(values['trend']) > 0.1:  # Strong trend
            return 0  # Prophet
        else:
            return 2  # XGBoost

def extract_features(df):
    values = df['value'].values
    features = {
        "mean": np.mean(values),
        "std": np.std(values),
        "min": np.min(values),
        "max": np.max(values),
        "skew": skew(values),
        "kurtosis": kurtosis(values),
        "stationarity": adfuller(values)[1],
        "autocorr": acf(values, nlags=1)[1],
        "trend": np.polyfit(range(len(values)), values, 1)[0],
    }
    return pd.DataFrame([features])

def get_best_model(features_df):
    # Use simplified logic instead of the trained model
    label = lazy_init_classifier(features_df)
    return ['Prophet', 'ETS', 'XGBoost', 'ARIMA'][label]