import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function CryptoRest() {
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: [],
        borderColor: 'green',
        fill: false,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://min-api.cryptocompare.com/data/v2/histominute?fsym=BTC&tsym=USD&limit=10'
        );

        const data = response.data.Data;
        const prices = data.Data.map(item => item.close);
        const timestamps = data.Data.map(item => new Date(item.time * 1000).toLocaleString());

        const cryptoData = timestamps.map((timestamp, index) => ({
          timestamp,
          price: prices[index],
          symbol: 'Bitcoin',
        }));

        setCryptoData(cryptoData);
        setChartDataFromCryptoData(cryptoData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data once on mount

  const setChartDataFromCryptoData = data => {
    if (data.length > 0) {
      const labels = data.map(item => item.timestamp);
      const bitcoinPrices = data
        .filter(item => item.symbol === 'Bitcoin')
        .map(item => item.price);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Bitcoin Price (USD)',
            data: bitcoinPrices,
            borderColor: 'green',
            fill: false,
          },
        ],
      });
    }
  };

  return (
    <div>
      <h1>Real-Time Crypto Price Chart</h1>
      {cryptoData.length > 0 ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: false,
                min: Math.min(...cryptoData.map(item => item.price)),
                max: Math.max(...cryptoData.map(item => item.price)),
                ticks: {
                  stepSize: null,
                  precision: 2,
                  callback: value => `$${value}`,
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default CryptoRest;
