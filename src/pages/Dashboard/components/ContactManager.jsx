import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Clock, User, Building2, Phone, Send, Archive, Trash2, MailOpen, X, UserPlus } from 'lucide-react';
import { api } from '../../../services/api';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import Modal from '../../../components/Modal/Modal';
import './ContactInbox.css';

const ContactManager = () => {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteThreadEmail, setDeleteThreadEmail] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', name: '', message: '' });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await api.contactMessages.getAll();
      // Only keep necessary fields. Grouping happens in render or memoized.
      const formatted = data.map(msg => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        phone: msg.phone,
        company: msg.company,
        message: msg.message,
        date: msg.createdAt,
        status: msg.isRead ? 'read' : 'new'
      }));
      setSubmissions(formatted);
    } catch (error) {
      console.error("Failed to fetch contact messages", error);
    }
  };

  // Group submissions by email
  const conversations = React.useMemo(() => {
    const groups = {};
    submissions.forEach(msg => {
      if (!groups[msg.email]) {
        groups[msg.email] = {
            email: msg.email,
            name: msg.name,
            company: msg.company,
            phone: msg.phone,
            messages: [],
            lastMessageDate: msg.date,
            status: 'read' // will be 'new' if any msg is new
        };
      }
      groups[msg.email].messages.push(msg);
      
      // Update metadata if this message is newer
      if (new Date(msg.date) > new Date(groups[msg.email].lastMessageDate)) {
        groups[msg.email].lastMessageDate = msg.date;
        groups[msg.email].name = msg.name;
        groups[msg.email].company = msg.company;
        groups[msg.email].phone = msg.phone;
      }
      
      if (msg.status === 'new') {
        groups[msg.email].status = 'new';
      }
    });

    // Sort conversations by last message date descending
    return Object.values(groups).sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));
  }, [submissions]);

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setReplyText('');
    
    // Mark all new messages in this thread as read
    const newMessages = conversation.messages.filter(m => m.status === 'new');
    if (newMessages.length > 0) {
      try {
        await Promise.all(newMessages.map(msg => api.contactMessages.markAsRead(msg.id)));
        
        // Update local state
        const updatedSubmissions = submissions.map(s => {
            if (s.email === conversation.email && s.status === 'new') {
                return { ...s, status: 'read' };
            }
            return s;
        });
        setSubmissions(updatedSubmissions);
      } catch (error) {
          console.error("Error marking thread as read", error);
      }
    }
  };

  const handleArchive = (email) => {
    // For now, archive just marks them in local state or we need backend support
    // Assuming archive marks them as 'archived' locally for filter.
    // In real app, we might need a field 'isArchived' on backend.
    // Reusing 'status' field for now, but backend only has 'isRead'.
    // Let's just update local state to simulate archival if backend doesn't support it directly
    // or we'd interpret 'archived' as 'read' + hidden?
    // User requested grouping, didn't specify archive logic change. 
    // I'll keep local toggle.
    setSubmissions(submissions.map(s => 
      s.email === email ? { ...s, status: 'archived' } : s
    ));
    if (selectedConversation?.email === email) {
      setSelectedConversation(prev => ({ ...prev, status: 'archived' }));
    }
  };

  const handleDeleteThread = (conversation) => {
    setDeleteThreadEmail(conversation.email);
    setDeleteItemName(conversation.name);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
        // Find all messages in this thread
        const threadMessages = submissions.filter(s => s.email === deleteThreadEmail);
        // Delete all
        await Promise.all(threadMessages.map(msg => api.contactMessages.delete(msg.id)));
        
        setSubmissions(submissions.filter(s => s.email !== deleteThreadEmail));
        
        if (selectedConversation?.email === deleteThreadEmail) {
            setSelectedConversation(null);
        }
        setDeleteThreadEmail(null);
        setShowConfirmDelete(false);
    } catch (error) {
        console.error("Error deleting thread", error);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      alert('Te rog scrie un mesaj înainte de a trimite.');
      return;
    }
    window.location.href = `mailto:${selectedConversation.email}?subject=RE: Contact RRDesign&body=${encodeURIComponent(replyText)}`;
    setReplyText('');
  };

  const handleSendInvitation = (conversation) => {
    setInviteData({
      email: conversation.email,
      name: conversation.name,
      message: `Bună ziua,\n\nÎn urma discuțiilor noastre, vă transmit cu plăcere invitația de a vă alătura platformei noastre.\n\nCu stimă,\nEchipa RRDesign`
    });
    setShowInviteModal(true);
  };

  const handleInviteUser = async () => {
      if (!inviteData.email) return;
      try {
          await api.auth.inviteUser(inviteData.email);
          alert(`Invitație trimisă către ${inviteData.email}!`);
          setShowInviteModal(false);
          setInviteData({ email: '', name: '', message: '' });
      } catch (error) {
          console.error("Invitation failed", error);
          alert("A apărut o eroare la trimiterea invitației.");
      }
  };

  const confirmSendInvitation = (e) => {
    e.preventDefault();
    handleInviteUser();
  };

  const filteredConversations = conversations.filter(c => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'new') return c.status === 'new';
    if (filterStatus === 'read') return c.status !== 'new' && c.status !== 'archived';
    if (filterStatus === 'archived') return c.status === 'archived';
    return true;
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

  const unreadCount = conversations.filter(c => c.status === 'new').length;

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
          All <span className="chip-count">{conversations.length}</span>
        </button>
        <button
          className={`filter-chip ${filterStatus === 'new' ? 'active' : ''}`}
          onClick={() => setFilterStatus('new')}
        >
          New <span className="chip-count">{conversations.filter(s => s.status === 'new').length}</span>
        </button>
        <button
          className={`filter-chip ${filterStatus === 'read' ? 'active' : ''}`}
          onClick={() => setFilterStatus('read')}
        >
          Read <span className="chip-count">{conversations.filter(s => s.status !== 'new' && s.status !== 'archived').length}</span>
        </button>
      </div>

      <div className="inbox-content">
        <div className="messages-sidebar">
          {filteredConversations.length === 0 ? (
            <div className="empty-messages">
              <Mail size={48} />
              <p>Nu există conversații</p>
            </div>
          ) : (
            <div className="messages-list">
              {filteredConversations.map(conv => (
                <div
                  key={conv.email}
                  className={`message-item ${conv.status === 'new' ? 'unread' : ''} ${selectedConversation?.email === conv.email ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="message-item-header">
                    <div className="message-sender">
                      <User size={16} />
                      <span className="sender-name">{conv.name}</span>
                    </div>
                    <span className="message-time">{formatDate(conv.lastMessageDate)}</span>
                  </div>
                  {conv.company && (
                    <div className="message-company">
                      <Building2 size={14} />
                      {conv.company}
                    </div>
                  )}
                  <div className="message-preview">
                    {conv.messages[conv.messages.length - 1].message.substring(0, 80)}...
                  </div>
                  {conv.status === 'new' && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="message-viewer">
          {selectedConversation ? (
            <>
              <div className="viewer-header">
                <div className="viewer-info">
                  <h3>{selectedConversation.name}</h3>
                  <div className="viewer-meta">
                    <span className="meta-item">
                      <Mail size={14} />
                      <a href={`mailto:${selectedConversation.email}`}>{selectedConversation.email}</a>
                    </span>
                    {selectedConversation.phone && (
                      <span className="meta-item">
                        <Phone size={14} />
                        <a href={`tel:${selectedConversation.phone}`}>{selectedConversation.phone}</a>
                      </span>
                    )}
                    {selectedConversation.company && (
                      <span className="meta-item">
                        <Building2 size={14} />
                        {selectedConversation.company}
                      </span>
                    )}
                  </div>
                </div>
                <div className="viewer-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => handleSendInvitation(selectedConversation)}
                    title="Trimite invitație de înregistrare"
                  >
                    <UserPlus size={18} />
                  </button>
                  <button 
                    className="action-btn danger"
                    onClick={() => handleDeleteThread(selectedConversation)}
                    title="Șterge Conversația"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => setSelectedConversation(null)}
                    title="Închide"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="viewer-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                {selectedConversation.messages.sort((a,b) => new Date(a.date) - new Date(b.date)).map(msg => (
                    <div key={msg.id} style={{ 
                        background: '#f3f4f6', 
                        padding: '1rem', 
                        borderRadius: '0.5rem',
                        alignSelf: 'flex-start',
                        maxWidth: '80%'
                    }}>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            {formatFullDate(msg.date)}
                        </div>
                        <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.message}</p>
                    </div>
                ))}
              </div>

              <div className="reply-box" style={{ marginTop: 'auto', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <h4>Răspunde:</h4>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Răspunde lui ${selectedConversation.name}...`}
                  rows="3"
                />
                <button 
                  className="btn-send-reply"
                  onClick={handleSendReply}
                >
                  <Send size={18} />
                  Trimite Răspuns
                </button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <MailOpen size={64} />
              <h3>Selectează o conversație</h3>
              <p>Alege o conversație din lista din stânga pentru a vizualiza istoricul</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
        title="Șterge Conversație"
        message={`Ești sigur că vrei să ștergi TOATE mesajele de la "${deleteItemName}"?`}
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
