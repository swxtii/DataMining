import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_percentage_error

model = None
train_data = None

def create_features(df):
    df['day'] = df['date'].dt.day
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    return df[['day', 'month', 'year']], df['value']

def fit_model(df):
    global model, train_data
    df = df.copy()
    X, y = create_features(df)
    model = XGBRegressor()
    model.fit(X, y)
    train_data = df

def get_forecast(period):
    last_date = train_data['date'].iloc[-1]
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=period)
    future_df = pd.DataFrame({'date': future_dates})
    X_future, _ = create_features(future_df)
    y_pred = model.predict(X_future)
    return pd.DataFrame({'date': future_dates, 'value': y_pred})

def get_mape(df):
    X, y = create_features(df)
    y_pred = model.predict(X)
    return mean_absolute_percentage_error(y, y_pred)
