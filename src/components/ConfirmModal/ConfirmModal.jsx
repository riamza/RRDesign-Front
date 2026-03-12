import React from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { useScrollLock } from "../../hooks/useScrollLock";
import "./ConfirmModal.css";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Șterge", 
  cancelText = "Anulează", 
  type = "danger" 
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "success": return <CheckCircle size={48} />;
      case "info": return <Info size={48} />;
      case "danger":
      default: return <AlertTriangle size={48} />;
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div
        className="confirm-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="confirm-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className={`confirm-modal-icon icon-${type}`}>
          {getIcon()}
        </div>

        <div className="confirm-modal-body">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>

        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button className={`btn-action btn-${type}`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;