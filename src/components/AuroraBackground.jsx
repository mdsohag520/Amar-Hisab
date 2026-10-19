import { motion } from 'framer-motion';

export default function AuroraBackground() {
  return (
    <div className="aurora-bg">
      <div className="noise-overlay"></div>
      <motion.div 
        className="blob blob-1"
        animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="blob blob-2"
        animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="blob blob-3"
        animate={{ x: [0, 50, -50, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="blob blob-4"
        animate={{ x: [0, -50, 50, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />
      
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="floating-bubble"
          style={{ left: `${10 + i * 15}%` }}
          animate={{ y: [window.innerHeight, -100], opacity: [0, 0.4, 0.6, 0] }}
          transition={{ duration: 15 + i * 3, repeat: Infinity, delay: i * 2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
