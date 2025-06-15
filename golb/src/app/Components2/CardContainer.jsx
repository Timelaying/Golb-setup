// components/CardContainer.jsx
"use client";
import { motion } from "framer-motion";

export default function CardContainer({ children, className = "" }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full max-w-4xl bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}
