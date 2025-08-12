// src/pages/SignInPage.jsx
import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1F] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SignIn 
          afterSignInUrl="/dashboard" 
          appearance={{
            elements: {
              rootBox: "glass-card p-8",
              card: "bg-transparent shadow-none",
            }
          }}
        />
      </motion.div>
    </div>
  );
};

export default SignInPage;