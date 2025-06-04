'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CountdownTimer() {
  const [nextFeedTime, setNextFeedTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const getCurrentTimeWIB = () => {
    const now = new Date()
    const utc = now.getTime() + now.getTimezoneOffset() * 60000
    return new Date(utc + 7 * 60 * 60000) // WIB (UTC+7)
  }

  const getNextFeedingTime = async () => {
    const { data, error } = await supabase
      .from('jadwal-makan')
      .select('waktu')
      .order('waktu', { ascending: true })

    if (error || !data) {
      console.error('❌ Gagal mengambil data jadwal makan:', error)
      return null
    }

    const now = getCurrentTimeWIB()
    const today = new Date(now.toDateString()) // reset ke jam 00:00 WIB

    // Cari waktu berikutnya di hari ini
    for (const item of data) {
      const [h, m, s] = item.waktu.split(':').map(Number)
      const scheduled = new Date(today)
      scheduled.setHours(h, m, s || 0, 0)

      if (scheduled > now) {
        return { label: item.waktu.slice(0, 5), date: scheduled }
      }
    }

    // Jika semua waktu sudah lewat, ambil yang pertama untuk hari berikutnya
    const [h, m, s] = data[0].waktu.split(':').map(Number)
    const nextDay = new Date(today)
    nextDay.setDate(today.getDate() + 1)
    nextDay.setHours(h, m, s || 0, 0)

    return { label: data[0].waktu.slice(0, 5), date: nextDay }
  }

  useEffect(() => {
    let timer

    const updateCountdown = async () => {
      const nextFeeding = await getNextFeedingTime()
      if (!nextFeeding) return

      setNextFeedTime(nextFeeding.label)

      timer = setInterval(() => {
        const now = getCurrentTimeWIB()
        const diff = nextFeeding.date.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft({ hours, minutes, seconds })
      }, 1000)
    }

    updateCountdown()

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h2 className="text-xl font-semibold text-black opacity-60 mb-2">
        Waktu Menuju Pemberian Makan Berikutnya
      </h2>
      <div className="text-2xl text-black opacity-60 font-bold">
        {timeLeft.hours.toString().padStart(2, '0')}
        <span className="text-sm"> Jam </span>
        {timeLeft.minutes.toString().padStart(2, '0')}
        <span className="text-sm"> Menit </span>
        {timeLeft.seconds.toString().padStart(2, '0')}
        <span className="text-sm"> Detik </span>
      </div>
      <p className="text-black opacity-60 mt-2">
        Pemberian makan berikutnya: <strong>{nextFeedTime}</strong>
      </p>
      <div className="h-2 bg-green-500 mt-2 rounded"></div>
    </div>
  )
}
