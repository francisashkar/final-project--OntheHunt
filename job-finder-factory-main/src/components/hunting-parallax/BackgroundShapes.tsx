import { motion } from "framer-motion";

export default function BackgroundShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Green gradient circle in the top-left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full filter blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(0, 232, 135, 0.7) 0%, transparent 70%)",
          transform: "translate(-25%, -25%)",
        }}
      />
      
      {/* Light green gradient circle in the bottom-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full filter blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(165, 214, 167, 0.7) 0%, transparent 70%)",
          transform: "translate(25%, 25%)",
        }}
      />
      
      {/* Very light green gradient circle in the center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full filter blur-[150px]"
        style={{
          background: "radial-gradient(circle, rgba(232, 245, 233, 0.7) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
      />
      
      {/* Subtle floating animation for all shapes */}
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
} 