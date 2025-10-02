import React from 'react';

export default function Sidebar({ children, activePage = "overview" }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
        <nav className="mt-6">
          <a 
            href="/" 
            className={`block py-2.5 px-6 ${activePage === "overview" ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'hover:bg-gray-50'}`}
          >
            Overview
          </a>
          <a 
            href="/candidates" 
            className={`block py-2.5 px-6 ${activePage === "candidates" ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'hover:bg-gray-50'}`}
          >
            Candidates
          </a>
          <a 
            href="/job" 
            className={`block py-2.5 px-6 ${activePage === "job" ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'hover:bg-gray-50'}`}
          >
            Jobs
          </a>
          <a 
            href="/client" 
            className={`block py-2.5 px-6 ${activePage === "client" ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'hover:bg-gray-50'}`}
          >
            Client
          </a>
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}