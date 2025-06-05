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

import { supabase } from '@/lib/supabaseClient'


export default function EatingChart() {
  const [eatingData, setEatingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('statistik-berat-pakan')
        .select('waktu, berat');
  
      if (error) {
        console.error('Gagal ambil data dari Supabase:', error);
        return;
      }
  
      // Buat jam lengkap 00:00 - 23:00
      const jamLengkap = Array.from({ length: 24 }, (_, i) => {
        const jam = i.toString().padStart(2, '0') + ':00';
        return { name: jam, value: 0 };
      });
  
      // Mapping data supabase ke object berdasarkan jam (HH:00)
      const dataMap = {};
      data.forEach((item) => {
        const jam = item.waktu.slice(0, 2) + ':00';
        dataMap[jam] = item.berat;
      });
  
      // Gabungkan data default + data supabase (replace value jika ada)
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
        statistik berat pakan tiap jam
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
