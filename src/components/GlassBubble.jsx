import { motion } from 'framer-motion';

export default function GlassBubble({ type = 'primary', size = 'md', amount = 0, children, onClick }) {
  const getIntensity = () => {
    if (amount > 10000) return 'high';
    if (amount > 1000) return 'mid';
    return 'low';
  };
  const intensity = getIntensity();

  return (
    <motion.div
      className={`glass-bubble ${type} ${size} intensity-${intensity}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="bubble-highlight"></div>
      {children}
    </motion.div>
  );
}
