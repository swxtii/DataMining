from prophet import Prophet
import pandas as pd
from sklearn.metrics import mean_absolute_percentage_error

model = None

def fit_model(df):
    global model
    df_prophet = df.rename(columns={'date': 'ds', 'value': 'y'})
    model = Prophet(daily_seasonality=True)
    model.fit(df_prophet)

def get_forecast(period):
    future = model.make_future_dataframe(periods=period)
    forecast = model.predict(future)
    return forecast[['ds', 'yhat']].tail(period).rename(columns={'ds': 'date', 'yhat': 'value'})

def get_mape(df):
    df_prophet = df.rename(columns={'date': 'ds', 'value': 'y'})
    forecast = model.predict(df_prophet)
    return mean_absolute_percentage_error(df_prophet['y'], forecast['yhat'])
