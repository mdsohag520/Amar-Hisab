import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, lang }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="center-modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="center-modal-content"
            style={{ textAlign: 'center', maxWidth: '320px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '50%' }}>
                <AlertTriangle size={32} color="#ef4444" />
              </div>
            </div>
            
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>{title}</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>{message}</p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={onClose}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}
              >
                {lang === 'BN' ? 'বাতিল' : 'Cancel'}
              </button>
              <button 
                onClick={() => { onConfirm(); onClose(); }}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '600', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)' }}
              >
                {lang === 'BN' ? 'মুছে ফেলুন' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
