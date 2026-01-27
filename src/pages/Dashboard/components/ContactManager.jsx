import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Clock, User, Building2, Phone, Send, Archive, Trash2, MailOpen, X, UserPlus } from 'lucide-react';
import { contactSubmissions as initialSubmissions } from '../../../data/mockData';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import Modal from '../../../components/Modal/Modal';
import './ContactInbox.css';

const ContactManager = () => {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', name: '', message: '' });

  const handleSelectMessage = (submission) => {
    setSelectedSubmission(submission);
    setReplyText('');
    
    if (submission.status === 'new') {
      setSubmissions(submissions.map(s => 
        s.id === submission.id ? { ...s, status: 'read' } : s
      ));
    }
  };

  const handleArchive = (id) => {
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, status: 'archived' } : s
    ));
    if (selectedSubmission?.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status: 'archived' });
    }
  };

  const handleDelete = (submission) => {
    setDeleteId(submission.id);
    setDeleteItemName(submission.name);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    setSubmissions(submissions.filter(s => s.id !== deleteId));
    if (selectedSubmission?.id === deleteId) {
      setSelectedSubmission(null);
    }
    setDeleteId(null);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      alert('Te rog scrie un mesaj înainte de a trimite.');
      return;
    }
    alert(`Răspuns trimis către ${selectedSubmission.email}`);
    setReplyText('');
    setSelectedSubmission(null);
  };

  const handleSendInvitation = (submission) => {
    setInviteData({
      email: submission.email,
      name: submission.name,
      message: `Bună ziua,\n\nÎn urma discuțiilor noastre, vă transmit cu plăcere invitația de a vă alătura platformei noastre.\n\nCu stimă,\nEchipa RRDesign`
    });
    setShowInviteModal(true);
  };

  const confirmSendInvitation = (e) => {
    e.preventDefault();
    
    const invitationToken = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const invitationLink = `${window.location.origin}/register?token=${invitationToken}`;
    
    alert(`Invitație trimisă către ${inviteData.email}!\n\nLink de înregistrare: ${invitationLink}\n\nUtilizatorul a fost adăugat în secțiunea "Utilizatori" cu statusul "În așteptare".\n\nÎn producție, acest link va fi trimis automat prin email.`);
    
    setShowInviteModal(false);
    setInviteData({ email: '', name: '', message: '' });
  };

  const filteredSubmissions = submissions.filter(s => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return new Intl.DateTimeFormat('ro-RO', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } else if (diffDays === 1) {
      return 'Ieri';
    } else if (diffDays < 7) {
      return `${diffDays} zile`;
    } else {
      return new Intl.DateTimeFormat('ro-RO', {
        day: '2-digit',
        month: 'short'
      }).format(date);
    }
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const unreadCount = submissions.filter(s => s.status === 'new').length;

  return (
    <div className="contact-inbox">
      <div className="inbox-header">
        <div className="inbox-title">
          <Mail size={28} />
          <h2>{t('dashboard.contactManager.title')}</h2>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
      </div>

      <div className="inbox-filters">
        <button
          className={`filter-chip ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          Toate <span className="chip-count">{submissions.length}</span>
        </button>
        <button
          className={`filter-chip ${filterStatus === 'new' ? 'active' : ''}`}
          onClick={() => setFilterStatus('new')}
        >
          Noi <span className="chip-count">{submissions.filter(s => s.status === 'new').length}</span>
        </button>
        <button
          className={`filter-chip ${filterStatus === 'read' ? 'active' : ''}`}
          onClick={() => setFilterStatus('read')}
        >
          Citite <span className="chip-count">{submissions.filter(s => s.status === 'read').length}</span>
        </button>
        <button
          className={`filter-chip ${filterStatus === 'archived' ? 'active' : ''}`}
          onClick={() => setFilterStatus('archived')}
        >
          Arhivate <span className="chip-count">{submissions.filter(s => s.status === 'archived').length}</span>
        </button>
      </div>

      <div className="inbox-content">
        <div className="messages-sidebar">
          {filteredSubmissions.length === 0 ? (
            <div className="empty-messages">
              <Mail size={48} />
              <p>Nu există mesaje</p>
            </div>
          ) : (
            <div className="messages-list">
              {filteredSubmissions.map(submission => (
                <div
                  key={submission.id}
                  className={`message-item ${submission.status === 'new' ? 'unread' : ''} ${selectedSubmission?.id === submission.id ? 'active' : ''}`}
                  onClick={() => handleSelectMessage(submission)}
                >
                  <div className="message-item-header">
                    <div className="message-sender">
                      <User size={16} />
                      <span className="sender-name">{submission.name}</span>
                    </div>
                    <span className="message-time">{formatDate(submission.date)}</span>
                  </div>
                  {submission.company && (
                    <div className="message-company">
                      <Building2 size={14} />
                      {submission.company}
                    </div>
                  )}
                  <div className="message-preview">
                    {submission.message.substring(0, 80)}...
                  </div>
                  {submission.status === 'new' && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="message-viewer">
          {selectedSubmission ? (
            <>
              <div className="viewer-header">
                <div className="viewer-info">
                  <h3>{selectedSubmission.name}</h3>
                  <div className="viewer-meta">
                    <span className="meta-item">
                      <Mail size={14} />
                      <a href={`mailto:${selectedSubmission.email}`}>{selectedSubmission.email}</a>
                    </span>
                    {selectedSubmission.phone && (
                      <span className="meta-item">
                        <Phone size={14} />
                        <a href={`tel:${selectedSubmission.phone}`}>{selectedSubmission.phone}</a>
                      </span>
                    )}
                    {selectedSubmission.company && (
                      <span className="meta-item">
                        <Building2 size={14} />
                        {selectedSubmission.company}
                      </span>
                    )}
                    <span className="meta-item">
                      <Clock size={14} />
                      {formatFullDate(selectedSubmission.date)}
                    </span>
                  </div>
                </div>
                <div className="viewer-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => handleSendInvitation(selectedSubmission)}
                    title="Trimite invitație de înregistrare"
                  >
                    <UserPlus size={18} />
                  </button>
                  {selectedSubmission.status !== 'archived' && (
                    <button 
                      className="action-btn"
                      onClick={() => handleArchive(selectedSubmission.id)}
                      title="Arhivează"
                    >
                      <Archive size={18} />
                    </button>
                  )}
                  <button 
                    className="action-btn danger"
                    onClick={() => handleDelete(selectedSubmission)}
                    title="Șterge"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => setSelectedSubmission(null)}
                    title="Închide"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="viewer-body">
                <div className="message-content">
                  <h4>Mesaj:</h4>
                  <p>{selectedSubmission.message}</p>
                </div>

                <div className="reply-box">
                  <h4>Răspunde:</h4>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Răspunde lui ${selectedSubmission.name}...`}
                    rows="6"
                  />
                  <button 
                    className="btn-send-reply"
                    onClick={handleSendReply}
                  >
                    <Send size={18} />
                    Trimite Răspuns
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <MailOpen size={64} />
              <h3>Selectează un mesaj</h3>
              <p>Alege un mesaj din lista din stânga pentru a-l vizualiza</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
        title={t('dashboard.contactManager.confirmDelete')}
        message={`Ești sigur că vrei să ștergi mesajul de la "${deleteItemName}"? Această acțiune nu poate fi anulată.`}
      />

      {/* Modal Invitație Utilizator */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Trimite Invitație Utilizator"
      >
        <form onSubmit={confirmSendInvitation} className="manager-form" style={{ margin: 0, padding: 0, border: 'none', boxShadow: 'none' }}>
          <div className="form-group">
            <label>Nume complet</label>
            <input
              type="text"
              value={inviteData.name}
              onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={inviteData.email}
              onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Mesaj personalizat</label>
            <textarea
              value={inviteData.message}
              onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
              rows="6"
              placeholder="Mesaj care va fi inclus în emailul de invitație..."
            />
          </div>

          <div style={{ 
            background: '#f0f9ff', 
            border: '1px solid #0ea5e9', 
            borderRadius: '8px', 
            padding: '12px', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: '#0c4a6e'
          }}>
            <strong>ℹ️ Informații:</strong>
            <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
              <li>Un email cu link de înregistrare va fi trimis automat</li>
              <li>Link-ul este valabil 7 zile</li>
              <li>Utilizatorul poate accesa aplicația doar cu acest link</li>
            </ul>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowInviteModal(false)}>
              Anulează
            </button>
            <button type="submit" className="btn-primary">
              <UserPlus size={18} />
              Trimite Invitația
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContactManager;
