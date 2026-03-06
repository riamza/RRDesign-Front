import React from "react";
import ReactDOM from "react-dom";
import { useScrollLock } from "../../hooks/useScrollLock";
import "./Modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
