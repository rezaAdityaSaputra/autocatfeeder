"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ManualFeed() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(false);

  const timerRef = useRef(null); // no TS type annotation

  const handleFeedClick = async () => {
    if (cooldown) {
      setMessage("Tunggu sampai 30 detik sebelum klik lagi.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("beri-pakan")
      .insert([{ status: "feed" }]);

    if (error) {
      console.error("Gagal mengirim perintah:", error);
      setMessage(`Gagal mengirim perintah: ${error.message}`);
    } else {
      setMessage("Perintah beri makan berhasil dikirim!");
      setCooldown(true);

      timerRef.current = setTimeout(() => {
        setCooldown(false);
        setMessage("");
      }, 30000);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h2 className="text-xl text-black opacity-60 font-semibold mb-2">
        Pemberian Makan Manual
      </h2>
      <p className="mb-4 text-gray-600">
        Tekan tombol di bawah ini untuk memberikan makan kucing Anda sekarang.
      </p>
      <button
        onClick={handleFeedClick}
        disabled={loading || cooldown}
        className={`${
          loading || cooldown ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        } text-xl text-white px-4 py-2 rounded transition`}
      >
        {loading ? "Mengirim..." : "Beri Makan Sekarang"}
      </button>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
