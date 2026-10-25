import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { fetchJournalEntries, createJournalEntry, submitReflectionResponse } from "../services/api"

const AppContext = createContext(null)
const validViews = ["journal", "history", "growth"]

function viewFromPath() {
  const path = window.location.pathname.replace("/", "")
  return validViews.includes(path) ? path : "journal"
}

export function AppProvider({ children }) {
  const [currentView, setCurrentView] = useState(viewFromPath)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [authMode, setAuthMode] = useState("login")
  
  // Database states
  const [entries, setEntries] = useState([])
  const [selectedEntryId, setSelectedEntryId] = useState(null)
  const [isLoadingEntries, setIsLoadingEntries] = useState(false)
  
  const [isEmergencyOpen, setEmergencyOpen] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState({ name: "Maya", email: "maya@example.com" })

  // Retrieve token from storage (or pass token as needed)
  const token = localStorage.getItem("token")

  // Load entries from Express / MySQL backend on mount
  useEffect(() => {
    const loadBackendEntries = async () => {
      if (!isAuthenticated) return
      setIsLoadingEntries(true)
      try {
        const data = await fetchJournalEntries(token)
        if (data && data.length > 0) {
          setEntries(data)
          setSelectedEntryId(data[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch journal entries from API:", error)
      } finally {
        setIsLoadingEntries(false)
      }
    }

    loadBackendEntries()
  }, [isAuthenticated, token])

  useEffect(() => {
    const handlePopState = () => setCurrentView(viewFromPath())
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const navigate = (view) => {
    setCurrentView(view)
    setSidebarOpen(false)
    window.history.pushState({}, "", `/${view}`)
  }

  const authenticate = (profile) => {
    setUser((current) => ({ ...current, ...profile }))
    setIsAuthenticated(true)
    navigate("journal")
  }

  const signOut = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("token")
    window.history.pushState({}, "", "/")
  }

  // Create new journal entry via API
  const addEntry = async (rawText) => {
    try {
      const newEntry = await createJournalEntry(rawText, token)
      setEntries((current) => [newEntry, ...current])
      setSelectedEntryId(newEntry.id)
    } catch (error) {
      console.error("Error creating entry:", error)
    }
  }

  // Submit follow-up dialogue / reflection response via API
  const addFollowUp = async (entryId, message) => {
    const targetEntry = entries.find((e) => e.id === entryId)
    const reflectionId = targetEntry?.reflections?.[0]?.id

    try {
      if (reflectionId) {
        await submitReflectionResponse(reflectionId, message, token)
      }

      setEntries((current) =>
        current.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                dialogue: [
                  ...(entry.dialogue || []),
                  { role: "user", text: message, time: "Just now" },
                  {
                    role: "assistant",
                    text: "Thank you for staying with that thought. What would it feel like to carry this more balanced perspective into the next small step?",
                    time: "Just now",
                  },
                ],
              }
            : entry,
        ),
      )
    } catch (error) {
      console.error("Error saving reflection response:", error)
    }
  }

  const selectedEntry =
    entries.find((entry) => entry.id === selectedEntryId) || entries[0] || null

  const value = useMemo(
    () => ({
      currentView,
      navigate,
      isAuthenticated,
      authMode,
      setAuthMode,
      authenticate,
      signOut,
      user,
      entries,
      selectedEntry,
      setSelectedEntryId,
      addEntry,
      addFollowUp,
      isLoadingEntries,
      isEmergencyOpen,
      setEmergencyOpen,
      isSidebarOpen,
      setSidebarOpen,
    }),
    [
      currentView,
      isAuthenticated,
      authMode,
      user,
      entries,
      selectedEntry,
      isLoadingEntries,
      isEmergencyOpen,
      isSidebarOpen,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}