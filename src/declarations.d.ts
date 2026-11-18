declare module './App';
declare module "*.jsx" {
  import React from "react";
  const Component: React.ComponentType<any>;
  export default Component;
}

declare module "./components/layout/Sidebar" {
  const Sidebar: React.ComponentType<any>;
  export default Sidebar;
}

declare module "./components/layout/Header" {
  const Header: React.ComponentType<{ children?: React.ReactNode }>;
  export default Header;
}

declare module "./components/modals/EmergencySupportModal" {
  const EmergencySupportModal: React.ComponentType<any>;
  export default EmergencySupportModal;
}

declare module "./context/AppContext";
declare module "./views/AuthView";
declare module "./views/GrowthAnalyticsView";
declare module "./views/HistoryMasterDetailView";
declare module "./views/JournalWorkspaceView";