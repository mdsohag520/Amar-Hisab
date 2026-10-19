import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast({ message, type = 'info', isOpen, onClose }) {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle size={20} className="text-emerald-500" style={{color: '#10b981'}} />,
    error: <AlertCircle size={20} className="text-rose-500" style={{color: '#ef4444'}} />,
    info: <Info size={20} className="text-blue-500" style={{color: '#3b82f6'}} />
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 20, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={`toast-pill ${type}`}
        onClick={onClose}
      >
        {icons[type]}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
