'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { supabase } from '@/lib/supabaseClient';


export default function DetectionChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('terdeteksi')
        .select('jam');

      if (error) {
        console.error('Gagal ambil data dari Supabase:', error);
        return;
      }

      const jamArray = Array.from({ length: 24 }, (_, i) => ({
        name: i.toString().padStart(2, '0') + ':00',
        value: 0,
      }));

      data.forEach(({ jam }) => {
        const hour = jam.split(':')[0];
        const label = hour.padStart(2, '0') + ':00';
        const index = jamArray.findIndex(j => j.name === label);
        if (index !== -1) {
          jamArray[index].value += 1;
        }
      });

      setChartData(jamArray);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl text-black opacity-60 font-semibold">
          Statistik Kucing Terdeteksi Makan per Jam
        </h2>
        
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0ea5e9"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
