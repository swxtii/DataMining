from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_absolute_percentage_error
import pandas as pd

model = None

def fit_model(df):
    global model
    model = ARIMA(df['value'], order=(1,1,1)).fit()

def get_forecast(period):
    forecast = model.forecast(steps=period)
    return pd.DataFrame({
        "date": pd.date_range(start=model.data.dates[-1], periods=period+1, freq='D')[1:],
        "value": forecast
    })

def get_mape(df):
    forecast = model.predict(start=0, end=len(df)-1)
    return mean_absolute_percentage_error(df['value'], forecast)
