import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send, Search, Trash2, Archive, Star, Plus } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader';
import { api } from '../../services/api';
import './Messages.css';

const Messages = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  
  // Get user role from storage or context (assuming stored as 'user_role')
  const userRole = localStorage.getItem('user_role');
  const isAdmin = userRole === 'Admin';

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // If admin, fetch all. If user, fetch my history.
      const data = isAdmin ? await api.contactMessages.getAll() : await api.contactMessages.getMyHistory();
      
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        from: msg.name,
        // For admin: show Company/Name. For User: show "To Support" or similar? 
        // Actually for user, it's their own message. 
        subject: `Contact: ${msg.company || msg.name}`, 
        preview: msg.message.substring(0, 100) + (msg.message.length > 100 ? '...' : ''),
        date: msg.createdAt,
        read: msg.isRead,
        starred: false,
        email: msg.email,
        phone: msg.phone,
        company: msg.company,
        fullMessage: msg.message
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    message: ''
  });

  const handleCompose = () => {
    setIsComposeModalOpen(true);
  };

  const handleCloseComposeModal = () => {
    setIsComposeModalOpen(false);
    setNewMessage({ to: '', subject: '', message: '' });
  };

  const handleComposeInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessage(prev => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    const messageToAdd = {
      id: messages.length + 1,
      from: 'Tu',
      subject: newMessage.subject,
      preview: newMessage.message.substring(0, 100) + '...',
      date: new Date().toISOString(),
      read: true,
      starred: false
    };

    setMessages([messageToAdd, ...messages]);
    handleCloseComposeModal();
    alert('Mesajul a fost trimis cu succes!');
  };

  const handleReply = () => {
    alert(`Răspuns la: ${selectedMessage.subject}`);
  };

  const handleStar = () => {
    setMessages(messages.map(msg =>
      msg.id === selectedMessage.id ? { ...msg, starred: !msg.starred } : msg
    ));
    setSelectedMessage({ ...selectedMessage, starred: !selectedMessage.starred });
  };

  const handleArchive = () => {
    if (window.confirm('Sigur vrei să arhivezi acest mesaj?')) {
      setMessages(messages.filter(msg => msg.id !== selectedMessage.id));
      setSelectedMessage(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Sigur vrei să ștergi acest mesaj?')) {
      try {
        await api.contactMessages.delete(selectedMessage.id);
        setMessages(messages.filter(msg => msg.id !== selectedMessage.id));
        setSelectedMessage(null);
      } catch (error) {
        console.error('Error deleting message', error);
      }
    }
  };

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    if (!message.read) {
        try {
            await api.contactMessages.markAsRead(message.id);
            setMessages(messages.map(msg =>
                msg.id === message.id ? { ...msg, read: true } : msg
            ));
        } catch (error) {
            console.error('Error marking as read', error);
        }
    }
  };

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

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
        <div className="page-layout messages-page">
          <PageHeader
            icon={MessageSquare}
            title={t('messages.title')}
            description={t('messages.description')}
            buttonText={t('messages.compose')}
            buttonIcon={Plus}
            onButtonClick={handleCompose}
            buttonClassName="btn-primary"
          />

          <div className="page-container messages-container">
            <div className="messages-content">
              <div className="messages-sidebar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder={t('messages.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="messages-stats">
              <div className="stat-item">
                <span className="stat-number">{messages.filter(m => !m.read).length}</span>
                <span className="stat-text">{t('messages.unread')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{messages.length}</span>
                <span className="stat-text">{t('messages.total')}</span>
              </div>
            </div>

            <div className="messages-list">
              {filteredMessages.map(message => (
                <div
                  key={message.id}
                  className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'active' : ''}`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className="message-item-header">
                    <div className="message-from">
                      {message.starred && <Star size={14} className="star-icon" />}
                      {message.from}
                    </div>
                    <div className="message-date">{formatDate(message.date)}</div>
                  </div>
                  <div className="message-subject">{message.subject}</div>
                  <div className="message-preview">{message.preview}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="message-viewer">
            {selectedMessage ? (
              <>
                <div className="message-viewer-header">
                  <div className="message-viewer-info">
                    <h2>{selectedMessage.subject}</h2>
                    <div className="message-meta">
                      <span className="from-label">{t('messages.from')}:</span>
                      <span className="from-name">{selectedMessage.from}</span>
                      <span className="date-full">{new Date(selectedMessage.date).toLocaleString('ro-RO')}</span>
                    </div>
                  </div>
                  <div className="message-actions">
                    <button className="btn-icon" title={t('messages.star')} onClick={handleStar}>
                      <Star size={18} className={selectedMessage.starred ? 'star-icon' : ''} />
                    </button>
                    <button className="btn-icon" title={t('messages.archive')} onClick={handleArchive}>
                      <Archive size={18} />
                    </button>
                    <button className="btn-icon btn-delete" title={t('messages.delete')} onClick={handleDelete}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="message-body">
                  <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px', marginBottom: '20px' }}>
                     <p><strong>Email:</strong> <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a></p>
                     <p><strong>Phone:</strong> {selectedMessage.phone}</p>
                     <p><strong>Company:</strong> {selectedMessage.company}</p>
                  </div>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{selectedMessage.fullMessage}</pre>
                </div>
                <div className="message-reply">
                  <button className="btn-reply" onClick={() => window.location.href = `mailto:${selectedMessage.email}`}>
                    <Send size={18} />
                    {t('messages.reply')}
                  </button>
                </div>
              </>
            ) : (
              <div className="no-message-selected">
                <MessageSquare size={64} />
                <h3>{t('messages.noSelection')}</h3>
                <p>{t('messages.selectMessage')}</p>
              </div>
            )}
          </div>
            </div>
          </div>

          {/* Modal pentru compunere mesaj nou */}
        {isComposeModalOpen && (
          <div className="modal-overlay" onClick={handleCloseComposeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Mesaj Nou</h2>
                <button className="modal-close" onClick={handleCloseComposeModal}>×</button>
              </div>
              <form onSubmit={handleSendMessage} className="message-form">
                <div className="form-group">
                  <label>Către:</label>
                  <input
                    type="text"
                    name="to"
                    value={newMessage.to}
                    onChange={handleComposeInputChange}
                    placeholder="admin@rrdesign.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subiect:</label>
                  <input
                    type="text"
                    name="subject"
                    value={newMessage.subject}
                    onChange={handleComposeInputChange}
                    placeholder="Subiectul mesajului..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mesaj:</label>
                  <textarea
                    name="message"
                    value={newMessage.message}
                    onChange={handleComposeInputChange}
                    placeholder="Scrie mesajul tău aici..."
                    rows="8"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseComposeModal}>
                    Anulează
                  </button>
                  <button type="submit" className="btn btn-purple">
                    <Send size={18} />
                    Trimite Mesaj
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
  );
};

export default Messages;
