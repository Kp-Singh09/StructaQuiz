// src/components/HorizontalNavbar.jsx
import { UserButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const HorizontalNavbar = () => {
  return (
    <motion.header 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      // Reverted to the transparent, blurred background
      className="fixed top-0 left-0 md:left-64 right-0 h-20 bg-[#0A0F1F]/80 backdrop-blur-sm border-b border-slate-800 z-30 flex items-center justify-end px-8"
    >
      {/* Logo is removed, leaving only the UserButton aligned to the right */}
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </motion.header>
  );
};

export default HorizontalNavbar;