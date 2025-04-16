
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
      
//       // Use date range endpoint
//       const response = await axios.post("http://localhost:8000/forecast/date-range", {
//         from_date: fromDate,
//         to_date: toDate,
//         period: period,
//       });

//       console.log("API Response:", response.data);
      
//       // Check if response contains error
//       if (response.data.error) {
//         setError(response.data.error);
//         setResult(null);
//         return;
//       }
      
//       // Validate forecast data
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
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8">
//       <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
//         <h1 className="text-4xl font-bold text-center text-gray-800">Time Series Forecasting</h1>

//         <div className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-md font-semibold mb-1 text-gray-700">From Date:</label>
//               <input
//                 type="date"
//                 className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-md font-semibold mb-1 text-gray-700">To Date:</label>
//               <input
//                 type="date"
//                 className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <label className="text-md font-semibold text-gray-700">Forecast Period (days):</label>
//             <input
//               type="number"
//               min="1"
//               className="w-24 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"



import React, { useState } from "react";
import axios from "axios";
import ForecastPlot from "./ForecastPlot";

function ForecastForm() {
  const [period, setPeriod] = useState(7);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("2024-01-01");
  const [toDate, setToDate] = useState("2024-01-31");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Submitting with dates:", fromDate, toDate, "and period:", period);

      const response = await axios.post("http://localhost:8000/forecast/date-range", {
        from_date: fromDate,
        to_date: toDate,
        period: period,
      });

      console.log("API Response:", response.data);

      if (response.data.error) {
        setError(response.data.error);
        setResult(null);
        return;
      }

      if (!response.data.forecast || response.data.forecast.length === 0) {
        setError("No forecast data received from the API");
        setResult(null);
        return;
      }

      setResult(response.data);
    } catch (error) {
      console.error("API Error:", error);
      setError("Error submitting data: " + (error.response?.data?.error || error.message));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-blue-50 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-10 space-y-8 border border-blue-100">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">📈 Time Series Forecasting</h1>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-md font-semibold mb-2 text-gray-700">From Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-xl p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-md font-semibold mb-2 text-gray-700">To Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-xl p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <label className="text-md font-semibold text-gray-700">Forecast Period (days):</label>
            <input
              type="number"
              min="1"
              className="w-24 border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md transition-all duration-300 ease-in-out"
          >
            {loading ? "Generating Forecast..." : "🔮 Generate Forecast"}
          </button>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-800 px-6 py-4 rounded-xl text-center mt-4">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-12 w-full max-w-5xl h-[500px]">
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">📊 Forecast Output</h2>
          <ForecastPlot
            forecastData={result.forecast}
            actualData={result.actual}
            model={result.model}
            mape={result.mape}
          />
          <div className="text-center mt-6 text-lg text-gray-700 space-y-1">
            <p><strong>Best Model:</strong> <span className="text-blue-700">{result.model || 'N/A'}</span></p>
            <p><strong>MAPE:</strong> {result.mape ? <span className="text-blue-700">{(result.mape * 100).toFixed(2)}%</span> : 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForecastForm;
