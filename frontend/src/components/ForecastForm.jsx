

import React, { useState } from "react";
import axios from "axios";
import ForecastPlot from "./ForecastPlot";

function ForecastForm() {
  const [data, setData] = useState("");
  const [period, setPeriod] = useState(7);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const formatted = data
        .split("\n")
        .map((line) => line.trim()) // remove leading/trailing whitespace
        .filter((line) => line && line.includes(",")) // skip empty or invalid lines
        .map((line) => {
            const [date, value] = line.split(",");
            return { date: date.trim(), value: parseFloat(value) };
        });

      const response = await axios.post("http://localhost:8000/forecast/", {
        data: formatted,
        period,
      });

      setResult(response.data);

    } catch (error) {
      setError("Error submitting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">Time Series Forecasting</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-md font-semibold mb-1 text-gray-700">
              Enter your time series data (format: YYYY-MM-DD,value)
            </label>
            <textarea
              rows="6"
              className="w-full border rounded-xl p-4 text-sm font-mono shadow-sm focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setData(e.target.value)}
              placeholder="2024-01-01,1000&#10;2024-01-02,1005"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-md font-semibold text-gray-700">Forecast Period (days):</label>
            <input
              type="number"
              min="1"
              className="w-24 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300"
          >
            {loading ? "Generating Forecast..." : "Generate Forecast"}
          </button>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl text-center">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-10 w-full max-w-5xl h-[500px]" >
          <h2 className="text-2xl font-semibold text-center mb-6">Line Graph</h2>
          <ForecastPlot data={result.forecast} model={result.model} mape={result.mape}/>
          <div className="text-center mt-6 text-lg text-gray-700">
            <p><strong>MAPE:</strong> {result.mape}</p>
            <p><strong>MODEL:</strong> {result.model}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForecastForm;
