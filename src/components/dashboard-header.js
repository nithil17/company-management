import React from 'react'
import { signOut } from '@/auth'

const DashboardHeader = ({ user }) => {
  return (
    <header className='mb-8 flex items-center justify-between'>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WorkForge</h1>
        <p className="text-sm text-gray-600">Welcome, {user.name || user.email}</p>
      </div>
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/signin" });
        }}
      >
        <button type="submit"
          className="mt-4 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100">
          Sign out
        </button>
      </form>
    </header>
  )
}

export default DashboardHeader