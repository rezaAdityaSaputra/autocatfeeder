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

export default function FeedWeightChart() {
  const [eatingData, setEatingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(now);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('statistik-berat-pakan')
        .select('waktu, berat, timestamp')
        .gte('timestamp', startOfDay.toISOString())
        .lte('timestamp', endOfDay.toISOString());

      if (error) {
        console.error('Gagal ambil data dari Supabase:', error);
        return;
      }

      const jamLengkap = Array.from({ length: 24 }, (_, i) => {
        const jam = i.toString().padStart(2, '0') + ':00';
        return { name: jam, value: 0 };
      });

      const dataMap = {};
      data.forEach((item) => {
        const jam = item.waktu.slice(0, 2) + ':00';
        dataMap[jam] = item.berat;
      });

      const merged = jamLengkap.map((slot) => ({
        name: slot.name,
        value: dataMap[slot.name] ?? 0,
      }));

      setEatingData(merged);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl text-black opacity-60 font-semibold mb-2">
        Statistik Berat Pakan Hari Ini
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={eatingData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
