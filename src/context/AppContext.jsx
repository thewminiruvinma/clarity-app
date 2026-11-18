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
  
  // Check if token exists in localStorage to determine real authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"))
  const [authMode, setAuthMode] = useState("login")
  
  // Database states
  const [entries, setEntries] = useState([])
  const [selectedEntryId, setSelectedEntryId] = useState(null)
  const [isLoadingEntries, setIsLoadingEntries] = useState(false)
  
  const [isEmergencyOpen, setEmergencyOpen] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  
  // Real user state initialized safely (cleared default mock data)
  const [user, setUser] = useState({ id: null, name: "", email: "" })

  const token = localStorage.getItem("token")

  // Load entries from Express / MySQL backend on mount or authentication
  useEffect(() => {
    const loadBackendEntries = async () => {
      if (!isAuthenticated || !token) return
      setIsLoadingEntries(true)
      try {
        const data = await fetchJournalEntries(token)
        if (data && data.length > 0) {
          setEntries(data)
          setSelectedEntryId(data[0].id)
        } else {
          setEntries([])
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

  const authenticate = (profile, token) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    if (profile?.name) {
      localStorage.setItem("userName", profile.name);
    }

    setUser((current) => ({ ...current, ...profile }));
    setIsAuthenticated(true);
    navigate("journal");
  }

  const signOut = () => {
    setIsAuthenticated(false);
    setUser({ id: null, name: "", email: "" });
    setEntries([]);
    setSelectedEntryId(null);
    
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    
    window.history.pushState({}, "", "/");
  }

 // Create new journal entry via API
  const addEntry = async (rawText) => {
    try {
      const response = await createJournalEntry(rawText, token)
      const newEntry = response.entry || response

      setEntries((current) => [newEntry, ...current])
      setSelectedEntryId(newEntry.id)
    } catch (error) {
      console.error("Error creating entry:", error)
    }
  }

  // Submit follow-up dialogue / reflection response via API
  const addFollowUp = async (entryId, message) => {
    const targetEntry = entries.find((e) => e.id === entryId)
    const reflectionId = targetEntry?.socraticReflections?.[0]?.id || targetEntry?.reflections?.[0]?.id

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