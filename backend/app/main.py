# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import pandas as pd
# from app.utils import extract_features, get_best_model
# from app.models import arima_model, ets_model, prophet_model, xgboost_model

# app = FastAPI()

# # Add CORS middleware BEFORE defining routes
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allow all origins for testing
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all methods including OPTIONS
#     allow_headers=["*"],
# )

# class ForecastRequest(BaseModel):
#     data: list
#     period: int

# @app.post("/forecast/")
# def forecast(request: ForecastRequest):
#     df = pd.DataFrame(request.data)
#     df.columns = ['date', 'value']
#     df['date'] = pd.to_datetime(df['date'])
#     features = extract_features(df)
#     model_name = get_best_model(features)
#     if model_name == 'ARIMA':
#         model = arima_model
#     elif model_name == 'ETS':
#         model = ets_model
#     elif model_name == 'Prophet':
#         model = prophet_model
#     elif model_name == 'XGBoost':
#         model = xgboost_model
#     model.fit_model(df)
#     forecast_df = model.get_forecast(period=request.period)
#     return {
#         "model": model_name,
#         "forecast": forecast_df.to_dict(orient='records'),
#         "mape": model.get_mape(df)
#     }



from fastapi import FastAPI, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from typing import List, Optional
from app.utils import extract_features, get_best_model
from app.models import arima_model, ets_model, prophet_model, xgboost_model
import io

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TimeSeriesPoint(BaseModel):
    date: str
    value: float

class ForecastRequest(BaseModel):
    data: List[TimeSeriesPoint]
    period: int

class DateRangeRequest(BaseModel):
    from_date: str
    to_date: str
    period: int

@app.post("/forecast/")
def forecast(request: ForecastRequest):
    df = pd.DataFrame([(item.date, item.value) for item in request.data], columns=['date', 'value'])
    df['date'] = pd.to_datetime(df['date'])
    
    # Get model and forecast
    features = extract_features(df)
    model_name = get_best_model(features)
    
    if model_name == 'ARIMA':
        model = arima_model
    elif model_name == 'ETS':
        model = ets_model
    elif model_name == 'Prophet':
        model = prophet_model
    elif model_name == 'XGBoost':
        model = xgboost_model
        
    model.fit_model(df)
    forecast_df = model.get_forecast(period=request.period)
    
    return {
        "model": model_name,
        "forecast": forecast_df.to_dict(orient='records'),
        "actual": df.to_dict(orient='records'),
        "mape": model.get_mape(df)
    }

@app.post("/forecast/date-range")
def forecast_date_range(request: DateRangeRequest):
    # This endpoint would be for the date range picker
    # You would need to implement logic to fetch data for the given date range
    # Or modify this endpoint as needed for your specific use case
    pass

@app.post("/forecast/upload")
async def forecast_upload(file: UploadFile = File(...), period: int = Form(...)):
    # Read CSV file
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    
    # Ensure the CSV has the right format
    if 'date' not in df.columns or 'value' not in df.columns:
        # Try to infer columns if they're not named correctly
        if len(df.columns) >= 2:
            df.columns = ['date', 'value'] + list(df.columns[2:])
        else:
            return {"error": "CSV file must have at least two columns for date and value"}
    
    # Process the data
    df['date'] = pd.to_datetime(df['date'])
    
    # Get model and forecast
    features = extract_features(df)
    model_name = get_best_model(features)
    
    if model_name == 'ARIMA':
        model = arima_model
    elif model_name == 'ETS':
        model = ets_model
    elif model_name == 'Prophet':
        model = prophet_model
    elif model_name == 'XGBoost':
        model = xgboost_model
        
    model.fit_model(df)
    forecast_df = model.get_forecast(period=period)
    
    return {
        "model": model_name,
        "forecast": forecast_df.to_dict(orient='records'),
        "actual": df.to_dict(orient='records'),
        "mape": model.get_mape(df)
    }