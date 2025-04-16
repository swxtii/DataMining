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
import numpy as np 

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

# @app.post("/forecast/date-range")
# def forecast_date_range(request: DateRangeRequest):
#     # This endpoint would be for the date range picker
#     # You would need to implement logic to fetch data for the given date range
#     # Or modify this endpoint as needed for your specific use case
#     pass


@app.post("/forecast/date-range")
def forecast_date_range(request: DateRangeRequest):
    try:
        # Convert string dates to datetime objects
        from_date = pd.to_datetime(request.from_date)
        to_date = pd.to_datetime(request.to_date)
        
        # Debug log
        print(f"Date range request: {from_date} to {to_date}, period: {request.period}")
        
        # Read from CSV file - adjust path if needed
        try:
            # Try to read the CSV file
            csv_path = "../frontend/public/generated_time_series.csv"
            print(f"Attempting to read CSV from: {csv_path}")
            
            df = pd.read_csv(csv_path, header=None, names=["date", "value"])
            print(f"Successfully read CSV with {len(df)} rows")
            
            # Convert date column to datetime
            df["date"] = pd.to_datetime(df["date"])
            
            # Filter the data based on the date range
            df = df[(df["date"] >= from_date) & (df["date"] <= to_date)]
            print(f"After filtering: {len(df)} rows")
            
            if df.empty:
                print("No data found for the selected date range")
                return {"error": "No data found for the selected date range"}
            
        except Exception as e:
            print(f"Error reading CSV file: {str(e)}")
            
            # For testing, generate synthetic data if CSV can't be read
            print("Generating synthetic data instead")
            date_range = pd.date_range(start=from_date, end=to_date)
            data = []
            for i, date in enumerate(date_range):
                value = float(100 * np.sin(i * 0.1) + 500 + np.random.normal(0, 20))
                data.append({"date": date, "value": value})
            df = pd.DataFrame(data)
        
        # Get model and forecast
        features = extract_features(df)
        model_name = get_best_model(features)
        print(f"Selected model: {model_name}")
        
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
        print(f"Generated forecast with {len(forecast_df)} points")
        
        # Extra validation of data format
        for column in ["date", "value"]:
            if column not in forecast_df.columns:
                print(f"Warning: '{column}' not in forecast_df columns: {forecast_df.columns}")
                
        result = {
            "model": model_name,
            "forecast": forecast_df.to_dict(orient='records'),
            "actual": df.to_dict(orient='records'),
            "mape": model.get_mape(df)
        }
        
        # Validate result
        print(f"Forecast points: {len(result['forecast'])}")
        print(f"Actual points: {len(result['actual'])}")
        print(f"MAPE: {result['mape']}")
        
        return result
        
    except Exception as e:
        import traceback
        print(f"Unexpected error: {str(e)}")
        print(traceback.format_exc())
        return {"error": f"Server error: {str(e)}"}

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