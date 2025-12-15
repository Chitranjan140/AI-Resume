'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/simple-auth'
import { userAPI } from '@/lib/simple-api'

export default function SimpleDashboard() {
  const { user, logout, isLoading } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [apiError, setApiError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/simple-login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchDashboard()
    }
  }, [user])

  const fetchDashboard = async () => {
    try {
      const response = await userAPI.getDashboard()
      setDashboardData(response.data)
      setApiError('')
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'API Error')
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  if (!user) {
    return <div className="p-8">Redirecting...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <p className="text-gray-600 mt-2">Email: {user.email}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Dashboard Data</h2>
          
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              API Error: {apiError}
            </div>
          )}
          
          {dashboardData ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(dashboardData, null, 2)}
            </pre>
          ) : (
            <p>Loading dashboard data...</p>
          )}
          
          <button
            onClick={fetchDashboard}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}