"use client";

import Link from "next/link";
import { useAuth } from "../src/context/AuthContext";

export function Header() {
  const { logout, isAuthenticated } = useAuth();

  return (
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen bg-[#141416] border-r border-[#2b2b2e] 
                 flex flex-col justify-between p-6 text-gray-200"
    >
      <div>
        <h1 className="text-2xl font-bold text-white mb-8 tracking-tight">
          Gestão
        </h1>
        <ul className="space-y-3">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1f1f23] transition"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 21"
              >
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
              </svg>
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1f1f23] transition"
            >
            <svg
                className="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 
                     .553-.894L9 2m0 18l6-3m-6 3V2m6 15l5.447 2.724A1 1 0 0 0 
                     21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4"
                />
              </svg>
              <span>Ver Mapa</span>
            </Link>
          </li>

          <li>
            <Link
              href="/buracos"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1f1f23] transition"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 18"
              >
                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Z" />
              </svg>
              <span>Arrumar buracos</span>
            </Link>
          </li>
        </ul>
      </div>

      {isAuthenticated && (
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-4 py-2 
                     rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 
                 4v1a2 2 0 01-2 2H5a2 2 0 
                 01-2-2V7a2 2 0 012-2h6a2 
                 2 0 012 2v1"
            />
          </svg>
          Sair
        </button>
      )}
    </aside>
  );
}
