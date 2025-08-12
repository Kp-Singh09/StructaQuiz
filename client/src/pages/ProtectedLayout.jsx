// src/pages/ProtectedLayout.jsx
import { Outlet } from 'react-router-dom';
import VerticalSidebar from '../components/VerticalSidebar';
import HorizontalNavbar from '../components/HorizontalNavbar';

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white">
      <VerticalSidebar />
      <HorizontalNavbar />
      
      {/* Main content container, offset by the sidebar's width */}
      <main className="ml-64">
        {/* 1. This is a new empty div that acts as a spacer. 
               It has the same height as the navbar (h-20), pushing everything below it down. */}
        <div className="h-20" />

        {/* 2. The grid background is now on this inner container,
               which starts perfectly below the navbar. */}
        <div className="p-8 bg-[length:80px_80px] bg-[linear-gradient(transparent_79px,#232733_80px),linear-gradient(90deg,transparent_79px,#232733_80px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProtectedLayout;