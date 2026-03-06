import React, { useState } from 'react';
import { Check, Copy, MailCheck } from 'lucide-react';
import Modal from '../Modal/Modal';
import './InvitationSuccessModal.css';

const InvitationSuccessModal = ({ isOpen, onClose, email, invitationLink }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invitație Trimisă">
      <div className="invitation-success-content">
        <div className="success-icon-wrapper">
          <MailCheck size={48} className="success-icon" />
        </div>
        
        <h3 className="success-title">Succes!</h3>
        <p className="success-message">
          Invitația a fost generată cu succes pentru <strong>{email}</strong>.
        </p>

        {invitationLink && (
          <div className="link-section">
            <p className="link-description">
              În mod normal, un email este trimis utilizatorului. Dacă aveți nevoie de link-ul de activare manual, îl puteți copia de mai jos:
            </p>
            
            <div className="link-box">
              <input 
                type="text" 
                readOnly 
                value={invitationLink} 
                className="link-input"
              />
              <button 
                onClick={handleCopy} 
                className={`copy-btn ${copied ? 'copied' : ''}`}
                title="Copiază link"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: '2rem' }}>
          <button className="button button-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
            Închide
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InvitationSuccessModal;
