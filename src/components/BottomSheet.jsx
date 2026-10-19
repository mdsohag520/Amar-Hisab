import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function BottomSheet({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="center-modal-overlay"
          onClick={onClose} // Click outside to close
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="center-modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <button className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
            
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '20px', marginTop: '4px' }}>
              {title}
            </h3>
            
            <div className="modal-body">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
