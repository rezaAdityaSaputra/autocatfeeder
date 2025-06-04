'use client'

import { useState, useEffect } from 'react'
import JadwalMakanModal from './JadwalMakan'
import { supabase } from '@/lib/supabaseClient'

export default function FeedSchedule() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [feedingTimes, setFeedingTimes] = useState([])

  const getCurrentTimeWIB = () => {
    const now = new Date()
    const utc = now.getTime() + now.getTimezoneOffset() * 60000
    const wib = new Date(utc + 7 * 60 * 60000) // UTC+7
    return wib.toTimeString().slice(0, 5) // Format: "HH:mm"
  }

  const fetchFeedingTimes = async () => {
    const { data, error } = await supabase
      .from('jadwal-makan')
      .select('id, waktu')
      .order('waktu', { ascending: true }) // Ubah ke waktu

    if (error || !data) {
      console.error('❌ Gagal mengambil data:', error)
      setFeedingTimes([])
      return
    }

    const nowTime = getCurrentTimeWIB()

    const updatedTimes = data.map((item) => {
      const waktuHHMM = item.waktu.slice(0, 5) // jika format waktu 'HH:mm:ss'
      return {
        time: waktuHHMM,
        status: waktuHHMM < nowTime ? 'Selesai' : 'Belum',
      }
    })

    setFeedingTimes(updatedTimes)
  }

  useEffect(() => {
    fetchFeedingTimes()
    const interval = setInterval(() => {
      fetchFeedingTimes()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsEditOpen(false)
      }
    }

    if (isEditOpen) {
      document.addEventListener('keydown', handleEsc)
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isEditOpen])

  return (
    <div className="bg-white p-4 rounded shadow relative">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-black opacity-60">
          Jam Pemberian Makan Hari Ini
        </h2>
        <button
          onClick={() => setIsEditOpen(true)}
          className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-100 text-black"
        >
          Edit Jadwal
        </button>
      </div>

      <ul>
        {feedingTimes.map((item, idx) => (
          <li key={idx} className="flex justify-between py-1">
            <span className="flex text-black opacity-60 items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${
                  item.status === 'Selesai' ? 'bg-green-500' : 'bg-gray-400'
                }`}
              ></span>
              <span className="font-medium">{item.time}</span>
            </span>
            <span
              className={item.status === 'Selesai' ? 'text-green-500' : 'text-gray-500'}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>

      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-0 rounded-lg shadow-lg max-w-4xl w-full relative">
            <JadwalMakanModal onClose={() => setIsEditOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
