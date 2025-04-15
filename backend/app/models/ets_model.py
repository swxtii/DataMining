import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from sklearn.metrics import mean_absolute_percentage_error

model = None
fitted = None

def fit_model(df):
    global model, fitted
    model = ExponentialSmoothing(df['value'], trend='add', seasonal='add', seasonal_periods=7)
    fitted = model.fit()

def get_forecast(period):
    forecast = fitted.forecast(period)
    last_date = df['date'].iloc[-1]
    dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=period)
    return pd.DataFrame({'date': dates, 'value': forecast})

def get_mape(df):
    pred = fitted.fittedvalues
    return mean_absolute_percentage_error(df['value'], pred)
