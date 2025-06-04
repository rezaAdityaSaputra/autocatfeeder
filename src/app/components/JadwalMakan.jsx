'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

export default function JadwalMakanModal({ onClose }) {
  const [jadwal, setJadwal] = useState([])
  const [form, setForm] = useState({ waktu: '' })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)

  async function fetchData() {
    const { data, error } = await supabase
      .from('jadwal-makan')
      .select('*')
      .order('id')
    if (!error) setJadwal(data || [])
  }

  async function handleSubmit() {
    setError(null)
    if (!form.waktu) {
      setError('Waktu wajib diisi')
      return
    }

    const { data: existing } = await supabase
      .from('jadwal-makan')
      .select('id')
      .eq('waktu', form.waktu)

    const conflict = existing?.find((item) => item.id !== editingId)
    if (conflict) {
      setError('Waktu ini sudah terdaftar. Gunakan waktu yang berbeda.')
      return
    }

    if (editingId) {
      await supabase.from('jadwal-makan').update(form).eq('id', editingId)
    } else {
      await supabase.from('jadwal-makan').insert(form)
    }

    setForm({ waktu: '' })
    setEditingId(null)
    fetchData()
  }

  async function handleDelete(id) {
    await supabase.from('jadwal-makan').delete().eq('id', id)
    fetchData()
  }

  function handleEdit(item) {
    setEditingId(item.id)
    setForm({ waktu: item.waktu })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg max-w-3xl w-full shadow flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-black font-bold">Jadwal Makan</h2>
      </div>

      <div className="flex gap-2 justify-between">
        <input
          type="time"
          placeholder="Waktu"
          value={form.waktu}
          onChange={(e) => setForm({ ...form, waktu: e.target.value })}
          className="border rounded px-2 py-1 flex-1 text-black"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
        >
          {editingId ? 'Update' : 'Tambah'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <table className="w-full border  border-gray-300 text-sm">
        <thead>
          <tr className="bg-blue text-white">
            <th className="border text-black px-2 py-1 text-center  ">ID</th>
            <th className="border text-black px-2 py-1 text-center">Waktu</th>
            <th className="border text-black px-2 py-1 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {jadwal.map((item) => (
            <tr key={item.id}>
              <td className="border text-black px-2 py-1 text-center">{item.id}</td>
              <td className="border text-black px-2 py-1 text-center">{item.waktu}</td>
              <td className="border text-black px-2 py-1 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {onClose && (
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-600 text-white px-4 py-1 rounded mt-2"
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  )
}
