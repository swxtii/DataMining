// import React, { useState } from "react";
// import axios from "axios";
// import ForecastPlot from "./ForecastPlot";

// function ForecastForm() {
//   const [period, setPeriod] = useState(7);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [fromDate, setFromDate] = useState("2024-01-01");
//   const [toDate, setToDate] = useState("2024-01-31");

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log("Submitting with dates:", fromDate, toDate, "and period:", period);

//       const response = await axios.post("http://localhost:8000/forecast/date-range", {
//         from_date: fromDate,
//         to_date: toDate,
//         period: period,
//       });

//       console.log("API Response:", response.data);

//       if (response.data.error) {
//         setError(response.data.error);
//         setResult(null);
//         return;
//       }

//       if (!response.data.forecast || response.data.forecast.length === 0) {
//         setError("No forecast data received from the API");
//         setResult(null);
//         return;
//       }

//       setResult(response.data);
//     } catch (error) {
//       console.error("API Error:", error);
//       setError("Error submitting data: " + (error.response?.data?.error || error.message));
//       setResult(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-blue-50 flex flex-col items-center px-4 py-12">
//       <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-10 space-y-8 border border-blue-100">
//         <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">📈 Time Series Forecasting</h1>

//         <div className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-md font-semibold mb-2 text-gray-700">From Date</label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-300 rounded-xl p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-md font-semibold mb-2 text-gray-700">To Date</label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-300 rounded-xl p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
//             <label className="text-md font-semibold text-gray-700">Forecast Period (days):</label>
//             <input
//               type="number"
//               min="1"
//               className="w-24 border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={period}
//               onChange={(e) => setPeriod(Number(e.target.value))}
//             />
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md transition-all duration-300 ease-in-out"
//           >
//             {loading ? "Generating Forecast..." : "🔮 Generate Forecast"}
//           </button>

//           {error && (
//             <div className="bg-red-100 border border-red-200 text-red-800 px-6 py-4 rounded-xl text-center mt-4">
//               <strong>Error:</strong> {error}
//             </div>
//           )}
//         </div>
//       </div>

//       {result && (
//         <div className="mt-12 w-full max-w-5xl h-[500px]">
//           <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">📊 Forecast Output</h2>
//           <ForecastPlot
//             forecastData={result.forecast}
//             actualData={result.actual}
//             model={result.model}
//             mape={result.mape}
//           />
//           <div className="text-center mt-6 text-lg text-gray-700 space-y-1">
//             <p><strong>Best Model:</strong> <span className="text-blue-700">{result.model || 'N/A'}</span></p>
//             <p><strong>MAPE:</strong> {result.mape ? <span className="text-blue-700">{(result.mape * 100).toFixed(2)}%</span> : 'N/A'}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ForecastForm;


// import React, { useState } from "react";
// import axios from "axios";
// import ForecastPlot from "./ForecastPlot";

// function ForecastForm() {
//   const [period, setPeriod] = useState(7);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [fromDate, setFromDate] = useState("2024-01-01");
//   const [toDate, setToDate] = useState("2024-01-31");

//   const handleSubmit = async () => {
//     if (fromDate > toDate) {
//       setError("From date must be before or equal to To date.");
//       return;
//     }
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axios.post("http://localhost:8000/forecast/date-range", {
//         from_date: fromDate,
//         to_date: toDate,
//         period,
//       });

//       if (response.data.error || !response.data.forecast?.length) {
//         setError(response.data.error || "No forecast data received");
//         setResult(null);
//       } else {
//         setResult(response.data);
//       }
//     } catch (err) {
//       setError("API Error: " + (err.response?.data?.error || err.message));
//       setResult(null);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center px-4 py-12">
//       <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg border border-blue-100 p-8">
//         <h1 className="text-4xl font-bold text-blue-700 text-center mb-6">📈 Time Series Forecast</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block font-semibold text-gray-700 mb-1">From Date</label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
//             />
//           </div>
//           <br>
//           </br>
//           <div>
//             <label className="block font-semibold text-gray-700 mb-1">To Date</label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
//             />
//           </div>
//         </div>

//         <br>
//         </br>
//         <div className="mb-6">
//           <label className="block font-semibold text-gray-700 mb-1">Forecast Period (in days)</label>
//           <input
//             type="number"
//             value={period}
//             onChange={(e) => setPeriod(Number(e.target.value))}
//             min={1}
//             className="w-32 border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
//           />
//         </div>

//         <br></br>
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
//         >
//           {loading ? "⏳ Generating..." : "🔮 Generate Forecast"}
//         </button>

//         {error && (
//           <div className="mt-4 bg-red-100 text-red-700 border border-red-200 p-4 rounded-xl text-center">
//             <strong>Error:</strong> {error}
//           </div>
//         )}
//       </div>

//       {result && (
//         <div className="mt-12 w-full max-w-5xl">
//           <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">📊 Forecast Output</h2>

//           <div className="h-[500px] mb-6">
//             <ForecastPlot
//               forecastData={result.forecast}
//               actualData={result.actual}
//               model={result.model}
//               mape={result.mape}
//             />
//           </div>

//           <div className="text-center text-lg text-gray-700 space-y-2">
//             <p><strong>Best Model:</strong> <span className="text-blue-700">{result.model || "N/A"}</span></p>
//             <p><strong>MAPE:</strong> {result.mape ? <span className="text-blue-700">{(result.mape * 100).toFixed(2)}%</span> : "N/A"}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ForecastForm;


import React, { useState } from "react";
import axios from "axios";
import ForecastPlot from "./ForecastPlot";
import { 
  DatePicker, 
  NumericTextBox, 
  Button,
  Form,
  FormElement,
  Field,
  FieldWrapper,
  Error
} from "@progress/kendo-react-all";
import { loadMessages, IntlProvider } from "@progress/kendo-react-intl";
import "@progress/kendo-theme-default/dist/all.css";

function ForecastForm() {
  const [period, setPeriod] = useState(7);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(new Date("2024-01-01"));
  const [toDate, setToDate] = useState(new Date("2024-01-31"));

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
    
  //   if (fromDate > toDate) {
  //     setError("From date must be before or equal to To date.");
  //     return;
  //   }
    
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const response = await axios.post("http://localhost:8000/forecast/date-range", {
  //       from_date: fromDate.toISOString().split('T')[0],
  //       to_date: toDate.toISOString().split('T')[0],
  //       period,
  //     });

  //     if (response.data.error || !response.data.forecast?.length) {
  //       setError(response.data.error || "No forecast data received");
  //       setResult(null);
  //     } else {
  //       setResult(response.data);
  //     }
  //   } catch (err) {
  //     setError("API Error: " + (err.response?.data?.error || err.message));
  //     setResult(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (fromDate > toDate) {
      setError("From date must be before or equal to To date.");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      const response = await axios.post("http://localhost:8000/forecast/date-range", {
        from_date: fromDate.toISOString().split('T')[0],
        to_date: toDate.toISOString().split('T')[0],
        period,
      });
  
      if (response.data.error || !response.data.forecast?.length) {
        setError(response.data.error || "No forecast data received");
        setResult(null);
      } else {
        setResult(response.data);
      }
    } catch (err) {
      setError("API Error: " + (err.response?.data?.error || err.message));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <IntlProvider locale="en">
      <div className="forecast-container">
        <div className="forecast-form-wrapper">
          <h1 className="forecast-title">📈 Time Series Forecast</h1>

          <Form onSubmit={handleSubmit} render={(formRenderProps) => (
            <FormElement style={{ maxWidth: "750px" }}>
              <div className="date-inputs">
                <Field name="fromDate" component={DateInputField} label="From Date" 
                  value={fromDate} onChange={(e) => setFromDate(e.value)} />
                
                <Field name="toDate" component={DateInputField} label="To Date" 
                  value={toDate} onChange={(e) => setToDate(e.value)} />
              </div>

              <Field name="period" component={NumericInputField} label="Forecast Period (in days)" 
                value={period} onChange={(e) => setPeriod(e.value)} min={1} />

              <div className="form-buttons">
                <Button 
                  type="submit" 
                  themeColor="primary" 
                  disabled={loading}
                  size="large"
                  className="submit-button"
                >
                  {loading ? "⏳ Generating..." : "🔮 Generate Forecast"}
                </Button>
              </div>
            </FormElement>
          )} />

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {result && (
          <div className="forecast-results">
            <h2 className="results-title">📊 Forecast Output</h2>

            <div className="forecast-chart">
              <ForecastPlot
                forecastData={result.forecast}
                actualData={result.actual}
                model={result.model}
                mape={result.mape}
              />
            </div>

            <div className="forecast-metrics">
              <p><strong>Best Model:</strong> <span className="metric-value">{result.model || "N/A"}</span></p>
              <p><strong>MAPE:</strong> {result.mape ? <span className="metric-value">{(result.mape * 100).toFixed(2)}%</span> : "N/A"}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .forecast-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          background: linear-gradient(to bottom right, #f0f8ff, #ffffff);
          border-radius: 10px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }
        
        .forecast-form-wrapper {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }
        
        .forecast-title {
          color: #2c6ecf;
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .date-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .form-buttons {
          margin-top: 2rem;
          text-align: center;
        }
        
        .submit-button {
          width: 100%;
          padding: 12px;
          font-weight: 600;
        }
        
        .error-message {
          background-color: #fff1f0;
          border: 1px solid #ffccc7;
          color: #cf1322;
          padding: 12px;
          border-radius: 8px;
          margin-top: 1rem;
          text-align: center;
        }
        
        .forecast-results {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        
        .results-title {
          color: #2c6ecf;
          font-size: 1.75rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .forecast-chart {
          height: 500px;
          margin-bottom: 1.5rem;
        }
        
        .forecast-metrics {
          text-align: center;
          font-size: 1.1rem;
          color: #333;
        }
        
        .metric-value {
          color: #2c6ecf;
          font-weight: 600;
        }
      `}</style>
    </IntlProvider>
  );
}

// Custom Field Components
const DateInputField = (fieldRenderProps) => {
  const { validationMessage, visited, label, id, valid, disabled, ...others } = fieldRenderProps;

  return (
    <FieldWrapper>
      <label className="k-label" htmlFor={id}>{label}</label>
      <div className="k-form-field-wrap">
        <DatePicker 
          id={id} 
          disabled={disabled}
          valid={valid}
          {...others}
          style={{ width: '100%' }}
        />
        {visited && validationMessage && (
          <Error>{validationMessage}</Error>
        )}
      </div>
    </FieldWrapper>
  );
};

const NumericInputField = (fieldRenderProps) => {
  const { validationMessage, visited, label, id, valid, disabled, ...others } = fieldRenderProps;

  return (
    <FieldWrapper>
      <label className="k-label" htmlFor={id}>{label}</label>
      <div className="k-form-field-wrap">
        <NumericTextBox 
          id={id} 
          disabled={disabled}
          valid={valid}
          {...others}
          style={{ width: '100%' }}
        />
        {visited && validationMessage && (
          <Error>{validationMessage}</Error>
        )}
      </div>
    </FieldWrapper>
  );
};

export default ForecastForm;