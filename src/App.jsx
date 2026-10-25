import Sidebar from "./components/layout/Sidebar"
import Header from "./components/layout/Header"
import EmergencySupportModal from "./components/modals/EmergencySupportModal"
import { AppProvider, useApp } from "./context/AppContext"
import AuthView from "./views/AuthView"
import GrowthAnalyticsView from "./views/GrowthAnalyticsView"
import HistoryMasterDetailView from "./views/HistoryMasterDetailView"
import JournalWorkspaceView from "./views/JournalWorkspaceView"

const views = {
  journal: JournalWorkspaceView,
  history: HistoryMasterDetailView,
  growth: GrowthAnalyticsView,
}

function ClarityApp() {
  const { isAuthenticated, currentView } = useApp()

  if (!isAuthenticated) return <AuthView />

  const CurrentView = views[currentView] || JournalWorkspaceView

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Sidebar />
      <div className="min-h-screen lg:pl-64">
        <Header />
        <main>
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
