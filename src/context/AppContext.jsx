import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { fetchJournalEntries, createJournalEntry, submitReflectionResponse } from "../services/api"

const AppContext = createContext(null)
const validViews = ["journal", "history", "growth", "profile"]

function viewFromPath() {
  const path = window.location.pathname.replace("/", "")
  return validViews.includes(path) ? path : "journal"
}

export function AppProvider({ children }) {
  const [currentView, setCurrentView] = useState(viewFromPath)
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"))
  const [authMode, setAuthMode] = useState("login")
  
  const [entries, setEntries] = useState([])
  const [selectedEntryId, setSelectedEntryId] = useState(null)
  const [isLoadingEntries, setIsLoadingEntries] = useState(false)
  
  const [isEmergencyOpen, setEmergencyOpen] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  
  // Real user state initialized safely
  const [user, setUser] = useState({ id: null, name: "", email: "" })

  // Crisis text number state persisted in localStorage (default: 741741)
  const [crisisTextNumber, setCrisisTextNumber] = useState(() => {
    return localStorage.getItem("crisisTextNumber") || "741741"
  })

  const updateCrisisNumber = (newNumber) => {
    setCrisisTextNumber(newNumber)
    localStorage.setItem("crisisTextNumber", newNumber)
  }

  const updateProfile = (updatedData) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedData }
      if (nextUser.name) localStorage.setItem("userName", nextUser.name)
      return nextUser
    })
  }

  const token = localStorage.getItem("token")

  useEffect(() => {
    const loadBackendEntries = async () => {
      const activeToken = localStorage.getItem("token");
      if (!isAuthenticated || !activeToken) {
        setEntries([]);
        setSelectedEntryId(null);
        return;
      }
      
      setIsLoadingEntries(true)
      try {
        const data = await fetchJournalEntries(activeToken)
        if (Array.isArray(data) && data.length > 0) {
          setEntries(data)
          setSelectedEntryId(data[0].id)
        } else {
          setEntries([])
          setSelectedEntryId(null)
        }
      } catch (error) {
        console.error("Failed to fetch journal entries from API:", error)
        setEntries([])
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

  const authenticate = (profile, newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    if (profile?.name) {
      localStorage.setItem("userName", profile.name);
    }

    setUser((current) => ({ ...current, ...profile }));
    setIsAuthenticated(true);
    setEntries([]);
    setSelectedEntryId(null);
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

  const addEntry = async (rawText) => {
    const activeToken = localStorage.getItem("token");
    try {
      const response = await createJournalEntry(rawText, activeToken)
      const newEntry = response.entry || response

      setEntries((current) => [newEntry, ...current])
      setSelectedEntryId(newEntry.id)
    } catch (error) {
      console.error("Error creating entry:", error)
    }
  }

  const addFollowUp = async (entryId, message) => {
    const activeToken = localStorage.getItem("token");
    const targetEntry = entries.find((e) => e.id === entryId)
    const reflectionId = targetEntry?.socraticReflections?.[0]?.id || targetEntry?.reflections?.[0]?.id

    try {
      if (reflectionId) {
        await submitReflectionResponse(reflectionId, message, activeToken)
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
      crisisTextNumber,
      updateCrisisNumber,
      updateProfile,
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
      crisisTextNumber,
      token,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}