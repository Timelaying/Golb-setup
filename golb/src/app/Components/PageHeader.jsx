// components/PageHeader.jsx
import { motion } from "framer-motion";

export default function PageHeader({ title }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-3xl font-semibold text-center mb-6"
    >
      {title}
    </motion.h1>
  );
}
