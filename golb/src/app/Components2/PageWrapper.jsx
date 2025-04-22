// components/PageWrapper.jsx
"use client";
import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 px-4 md:px-6 lg:px-8"
    >
      {children}
    </motion.div>
  );
}
