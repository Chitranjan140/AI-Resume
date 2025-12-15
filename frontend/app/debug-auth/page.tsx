'use client'

import { useAuth } from '@/lib/auth-context'
import { userAPI } from '@/lib/api'
import { useState } from 'react'

export default function DebugAuth() {
  const { user, userProfile, loading } = useAuth()
  const [apiResult, setApiResult] = useState<any>(null)
  const [apiError, setApiError] = useState<any>(null)

  const testAPI = async () => {
    try {
      const result = await userAPI.getDashboard()
      setApiResult(result.data)
      setApiError(null)
    } catch (error) {
      setApiError(error)
      setApiResult(null)
    }
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
      
      <div className="bg-white p-4 rounded mb-4">
        <h2 className="font-bold">Auth State:</h2>
        <p>Loading: {loading.toString()}</p>
        <p>User: {user ? 'Yes' : 'No'}</p>
        <p>User Email: {user?.email || 'None'}</p>
        <p>User Name: {userProfile?.displayName || 'None'}</p>
      </div>

      <div className="bg-white p-4 rounded mb-4">
        <h2 className="font-bold">LocalStorage:</h2>
        <p>userEmail: {typeof window !== 'undefined' ? localStorage.getItem('userEmail') : 'N/A'}</p>
        <p>userName: {typeof window !== 'undefined' ? localStorage.getItem('userName') : 'N/A'}</p>
        <p>rememberUser: {typeof window !== 'undefined' ? localStorage.getItem('rememberUser') : 'N/A'}</p>
      </div>

      <button 
        onClick={testAPI}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Test API Call
      </button>

      {apiResult && (
        <div className="bg-green-100 p-4 rounded mb-4">
          <h2 className="font-bold">API Success:</h2>
          <pre>{JSON.stringify(apiResult, null, 2)}</pre>
        </div>
      )}

      {apiError && (
        <div className="bg-red-100 p-4 rounded">
          <h2 className="font-bold">API Error:</h2>
          <pre>{JSON.stringify(apiError.response?.data || apiError.message, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}