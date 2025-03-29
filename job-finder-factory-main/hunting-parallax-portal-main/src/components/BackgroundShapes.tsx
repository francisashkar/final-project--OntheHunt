import { motion } from "framer-motion";

export function BackgroundShapes() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full filter blur-3xl"
        style={{
          background: "radial-gradient(circle, #00e887 50%, transparent 100%)",
          transform: "translate(-50%, -50%)",
        }}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full filter blur-3xl"
        style={{
          background: "radial-gradient(circle, #a5d6a7 50%, transparent 100%)",
          transform: "translate(25%, 25%)",
        }}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full filter blur-3xl"
        style={{
          background: "radial-gradient(circle, #e8f5e9 50%, transparent 100%)",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}