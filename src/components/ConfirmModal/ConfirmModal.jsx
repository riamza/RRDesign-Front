import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={e => e.stopPropagation()}>
        <button className="confirm-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="confirm-modal-icon">
          <AlertTriangle size={48} />
        </div>
        
        <div className="confirm-modal-body">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Anulează
          </button>
          <button className="btn-confirm" onClick={handleConfirm}>
            Șterge
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
