import React from "react"
import Sidebar from "./components/layout/Sidebar.jsx"
import Header from "./components/layout/Header.jsx"
import EmergencySupportModal from "./components/modals/EmergencySupportModal.jsx"
import Profile from "./components/profile/Profile.jsx"
import { AppProvider, useApp } from "./context/AppContext.jsx"
import AuthView from "./views/AuthView.jsx"
import GrowthAnalyticsView from "./views/GrowthAnalyticsView.jsx"
import HistoryMasterDetailView from "./views/HistoryMasterDetailView.jsx"
import JournalWorkspaceView from "./views/JournalWorkspaceView.jsx"

const views: Record<string, React.ComponentType> = {
  journal: JournalWorkspaceView,
  history: HistoryMasterDetailView,
  growth: GrowthAnalyticsView,
  profile: Profile,
}

function ClarityApp() {
  const { isAuthenticated, currentView } = useApp()

  if (!isAuthenticated) return <AuthView />

  const CurrentView = views[currentView] || JournalWorkspaceView

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Sidebar />
      <div className="min-h-screen lg:pl-64">
        <Header>{null}</Header>
        <main className="p-6 lg:p-8">
          <CurrentView />
        </main>
      </div>
      <EmergencySupportModal />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ClarityApp />
    </AppProvider>
  )
}