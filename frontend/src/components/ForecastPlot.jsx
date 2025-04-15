


// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// function ForecastPlot({ data }) {
//   if (!data || data.length === 0) {
//     return <div className="text-center text-gray-500">No forecast data available</div>;
//   }

//   // Format the data (optional: can format dates here if needed)
//   const formattedData = data.map((point) => ({
//     date: new Date(point.date).toLocaleDateString('en-GB'), // or 'en-US'
//     value: Number(point.value),
//   }));
  

//   return (
//     <div className="w-full h-96 bg-white rounded-xl shadow-lg p-4">
//       <ResponsiveContainer width="100%" height={400}>
//         <LineChart data={formattedData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
//           <YAxis />
//           <Tooltip />
//           <Line
//             type="monotone"
//             dataKey="value"
//             stroke="#2563eb"
//             strokeWidth={2}
//             dot={{ r: 3 }}
//             activeDot={{ r: 6 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default ForecastPlot;

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Papa from "papaparse";

function ForecastPlot({ data: forecastData }) {
  const [actualData, setActualData] = useState([]);
  console.log("called")
  console.log("📊 forecastData:", forecastData);
  console.log("📈 actualData:", actualData);

  useEffect(() => {
    // Load actual data from CSV
    Papa.parse("../tsa_dataset.csv", {
      download: true,
      header: false,
      complete: (result) => {
        const parsed = result.data
          .filter((row) => row.length === 2)
          .map(([date, value]) => ({
            date: new Date(date).toLocaleDateString("en-GB"),
            actual: parseFloat(value),
          }));
        setActualData(parsed);
      },
      error: (err) => console.error("CSV parsing error:", err),
    });
  }, []);

  if (!forecastData || forecastData.length === 0) {
    return <div className="text-center text-gray-500">No forecast data available</div>;
  }

  // Format forecasted data
  const formattedForecast = forecastData.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-GB"),
    predicted: parseFloat(point.value),
  }));

  // Merge actual and forecast by date
  const mergedData = [...actualData, ...formattedForecast].reduce((acc, curr) => {
    const existing = acc.find((item) => item.date === curr.date);
    if (existing) {
      Object.assign(existing, curr);
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);

  return (
    <div className="w-full h-96 bg-white rounded-xl shadow-lg p-4">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            name="Actual"
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#2563eb"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            name="Predicted"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ForecastPlot;
