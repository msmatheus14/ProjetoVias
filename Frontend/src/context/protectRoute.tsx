"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login"); 
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, router]);

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return <>{children}</>;
}
