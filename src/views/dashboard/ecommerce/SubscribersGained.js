import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users } from 'react-feather';
import StatsWithAreaChart from './StatsWithAreaChart';

const StudentsGained = ({ kFormatter }) => {
  const defaultData = {
    studentCount: 0,
    series: [{ name: 'دانش جویان', data: [0] }] 
  };
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    axios.get('https://classapi.sepehracademy.ir/api/Home/LandingReport')
      .then(res => {
        console.log('Received Data:', res.data);
        setData({
          ...res.data,
          series: [{ name: 'دانش جویان', data: [res.data.studentCount] }] 
        });
      })
      .catch(() => setData(defaultData));
  }, []);

  return (
    <StatsWithAreaChart
      icon={<Users size={21} />}
      color='primary'
      stats={kFormatter(data?.studentCount ?? 0)}
      statTitle='دانش جویان'
      options={{
        chart: { id: 'students', toolbar: { show: false }, sparkline: { enabled: true } },
        grid: { show: false },
        colors: ['#007bff'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2.5 },
        fill: {
          type: 'gradient',
          gradient: { shadeIntensity: 0.9, opacityFrom: 0.7, opacityTo: 0.5, stops: [0, 80, 100] }
        },
        xaxis: { categories: ['دانش جویان'], labels: { show: true }, axisBorder: { show: true } },
        yaxis: { labels: { show: true } },
        tooltip: { x: { show: true } }
      }}
      series={data?.series ?? [{ name: 'دانش جویان', data: [0] }]}
      type='area'
    />
  );
};

export default StudentsGained;