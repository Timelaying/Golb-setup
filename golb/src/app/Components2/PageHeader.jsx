// components/PageHeader.jsx
"use client";
import { motion } from "framer-motion";

export default function PageHeader({ title }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-3xl md:text-4xl font-bold text-center mb-6 text-white"
    >
      {title}
    </motion.h1>
  );
}
