


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

// import React, { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import Papa from "papaparse";

// function ForecastPlot({ data: forecastData }) {
//   const [actualData, setActualData] = useState([]);
//   useEffect(() => {
//     Papa.parse("/generated_time_series.csv", {
//         download: true,
//         header: false,
//         skipEmptyLines: true,
//         complete: (result) => {
//           const parsed = result.data
//             .filter((row) => row.length >= 2 && row[0] && row[1])
//             .map(([date, value]) => ({
//               date: new Date(date).toLocaleDateString("en-GB"),
//               actual: parseFloat(value),
//             }));
//           setActualData(parsed);
//         },
//         error: (err) => console.error("CSV parsing error:", err),
//       });
      
//   }, []);
  
//   console.log("Actual:", actualData)
//   if (!forecastData || forecastData.length === 0) {
//     return <div className="text-center text-gray-500">No forecast data available</div>;
//   }

//   // Forma`t forecasted data
//   const formattedForecast = forecastData.map((point) => ({
//     date: new Date(point.date).toLocaleDateString("en-GB"),
//     predicted: parseFloat(point.value),
//   }));

//   // Merge actual and forecast by date
//   const mergedData = [...actualData, ...formattedForecast].reduce((acc, curr) => {
//     const existing = acc.find((item) => item.date === curr.date);
//     if (existing) {
//       Object.assign(existing, curr);
//     } else {
//       acc.push({ ...curr });
//     }
//     return acc;
//   }, []);

//   return (
//     <div className="w-full h-96 bg-white rounded-xl shadow-lg p-4">
//       <ResponsiveContainer width="100%" height={400}>
//         <LineChart data={mergedData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="actual"
//             stroke="#10b981"
//             strokeWidth={2}
//             dot={{ r: 3 }}
//             activeDot={{ r: 6 }}
//             name="Actual"
//           />
//           <Line
//             type="monotone"
//             dataKey="predicted"
//             stroke="#2563eb"
//             strokeWidth={2}
//             strokeDasharray="5 5"
//             dot={{ r: 3 }}
//             activeDot={{ r: 6 }}
//             name="Predicted"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default ForecastPlot;

import React from "react";
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

function ForecastPlot({ forecastData, actualData, model, mape }) {
  // Debug logs
  console.log("Forecast Data:", forecastData);
  console.log("Actual Data:", actualData);
  
  // Additional checks for data availability
  if (!forecastData) {
    console.error("Forecast data is undefined");
    return <div className="text-center text-gray-500">No forecast data available</div>;
  }
  
  if (forecastData.length === 0) {
    console.error("Forecast data array is empty");
    return <div className="text-center text-gray-500">No forecast data available</div>;
  }
  
  // Format forecasted data
  const formattedForecast = forecastData.map((point) => {
    console.log("Processing forecast point:", point);
    return {
      date: new Date(point.date).toLocaleDateString("en-GB"),
      predicted: parseFloat(point.value),
    };
  });

  // Format actual data
  const formattedActual = actualData ? actualData.map((point) => {
    console.log("Processing actual point:", point);
    return {
      date: new Date(point.date).toLocaleDateString("en-GB"),
      actual: parseFloat(point.value),
    };
  }) : [];

  console.log("Formatted Forecast:", formattedForecast);
  console.log("Formatted Actual:", formattedActual);

  // Merge actual and forecast by date
  const mergedData = [...formattedActual, ...formattedForecast].reduce((acc, curr) => {
    const existing = acc.find((item) => item.date === curr.date);
    if (existing) {
      Object.assign(existing, curr);
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);

  console.log("Merged Data:", mergedData);

  // Sort by date
  mergedData.sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateA - dateB;
  });

  return (
    <div className="w-full h-96 bg-white rounded-xl shadow-lg p-4">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Legend />
          {formattedActual.length > 0 && (
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name="Actual"
            />
          )}
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
