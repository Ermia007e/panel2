import { useEffect, useState } from 'react';
import http from "../../../services/interceptor";
import { Package } from 'react-feather';
import StatsWithAreaChart from './StatsWithAreaChart';
import axios from 'axios'

const OrdersReceived = ({ kFormatter, warning }) => {
  const defaultData = {
    teacherCount: 0,
    series: [{ name: 'اساتید', data: [0] }] // مقداردهی اولیه
  };

  const [data, setData] = useState(defaultData);

  const options = {
    chart: { id: 'revenue', toolbar: { show: false }, sparkline: { enabled: true } },
    grid: { show: false },
    colors: [warning],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 0.9, opacityFrom: 0.7, opacityTo: 0.5, stops: [0, 80, 100] }
    },
    xaxis: { categories: ['اساتید'], labels: { show: true }, axisBorder: { show: true } }, // اضافه کردن دسته‌بندی داده‌ها
    yaxis: { labels: { show: true } },
    tooltip: { x: { show: true } }
  };

  useEffect(() => {
    axios.get('https://classapi.sepehracademy.ir/api/Home/LandingReport')
      .then(res => {
        console.log('Received Data:', res.data);
        setData({
          ...res.data,
          series: [{ name: 'اساتید', data: [res.data.teacherCount] }] // تنظیم مقدار `series`
        });
      })
      .catch(() => setData(defaultData));
  }, []);

  return (
    <StatsWithAreaChart
      icon={<Package size={21} />}
      color='warning'
      stats={kFormatter(data?.teacherCount ?? 0)}
      statTitle='تعداد اساتید'
      options={options}
      series={data?.series ?? [{ name: 'اساتید', data: [0] }]}
      type='area' // مقدار را صریحاً مشخص کن
    />
  );
};

export default OrdersReceived;