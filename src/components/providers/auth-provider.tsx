"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AuthModal } from "@/components/auth/auth-modal"

interface User {
  id: string
  email: string
  name: string | null
  role: "ADMIN" | "CUSTOMER"
  avatar?: string | null
  twoFactorEnabled?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  logout: () => Promise<void>
  refresh: () => Promise<void>
  openAuthModal: (view?: "login" | "register") => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalView, setModalView] = useState<"login" | "register">("login")
  
  const router = useRouter()
  const pathname = usePathname()

  const fetchAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        if (response.status === 401) {
          const refreshToken = localStorage.getItem("refreshToken")
          if (refreshToken) {
            const refreshResponse = await fetch("/api/auth/refresh", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            })

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json()
              if (refreshData.data) {
                localStorage.setItem("token", refreshData.data.accessToken)
                localStorage.setItem("refreshToken", refreshData.data.refreshToken)
                const retryResponse = await fetch("/api/user/me", {
                  headers: { Authorization: `Bearer ${refreshData.data.accessToken}` },
                })
                if (retryResponse.ok) {
                  const userData = await retryResponse.json()
                  if (userData.success && userData.data?.user) {
                    setUser(userData.data.user)
                    setIsLoading(false)
                    return
                  }
                }
              }
            }
          }
        }
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        setUser(null)
      } else {
        const userData = await response.json()
        if (userData.success && userData.data?.user) {
          setUser(userData.data.user)
        }
      }
    } catch (error) {
      console.error("Auth fetch error:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAuth()
  }, [])

  const logout = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      setUser(null)
      router.push("/")
    }
  }

  const openAuthModal = (view: "login" | "register" = "login") => {
    setModalView(view)
    setIsModalOpen(true)
  }

  const closeAuthModal = () => setIsModalOpen(false)

  const refresh = async () => {
    await fetchAuth()
  }

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    logout,
    refresh,
    openAuthModal,
    closeAuthModal,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <AuthModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        defaultView={modalView} 
      />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
