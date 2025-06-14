"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function PakanBeratUpdater() {
  const [berat, setBerat] = useState(null);
  const [waktu, setWaktu] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBeratTerbaru = async () => {
    const { data, error } = await supabase
      .from("statistik-berat-pakan")
      .select("berat, waktu")
      .order("waktu", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Gagal mengambil data berat:", error);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const waktuISO = `${today}T${data?.waktu}`;

    setBerat(data?.berat ?? null);
    setWaktu(waktuISO);
    setLoading(false);
  };

  useEffect(() => {
    fetchBeratTerbaru();
    const interval = setInterval(fetchBeratTerbaru, 60000);
    return () => clearInterval(interval);
  }, []);

  const isNormal = berat >= 20;
  const lingkaranStyle = isNormal ? "border-blue-500 text-blue-600" : "border-red-500 text-red-600";
  const keteranganStyle = isNormal ? "text-blue-600" : "text-red-600";
  const Icon = isNormal ? CheckCircle : AlertCircle;
  const keteranganText = isNormal ? "Berat pakan mencukupi" : "Berat pakan kurang";

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl text-black opacity-60 font-semibold mb-2">Status Pakan</h2>
      {loading ? (
        <p>Memuat...</p>
      ) : (
        <>
          <div className="flex flex-col items-center mb-6">
            <div className={`w-40 h-40 flex items-center justify-center rounded-full border-8 transition-colors duration-300 ${lingkaranStyle}`}>
              <span className="text-3xl font-bold">{berat}g</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Diambil pada: {new Date(waktu).toLocaleTimeString("id-ID", { hour12: false })}
            </p>
            <div className={`mt-4 flex items-center gap-2 text-xl font-medium ${keteranganStyle}`}>
              <Icon className="w-6 h-6" />
              {keteranganText}
            </div>
            <div className="h-4 bg-[#3B82F6] mt-2 rounded"></div>
          </div>
        </>
      )}
    </div>
  );
}
