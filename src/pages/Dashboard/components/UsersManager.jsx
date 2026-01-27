import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Mail, Calendar, CheckCircle, XCircle, Clock, Eye, Ban } from 'lucide-react';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import './Manager.css';

const UsersManager = () => {
  const { t } = useTranslation();
  
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Ion Popescu',
      email: 'ion.popescu@example.com',
      status: 'active',
      registeredDate: '2024-01-15',
      lastLogin: '2026-01-20',
      projectsCount: 3,
      invitedBy: 'admin@rrdesign.ro'
    },
    {
      id: 2,
      name: 'Maria Ionescu',
      email: 'maria.ionescu@example.com',
      status: 'pending',
      invitationSentDate: '2026-01-18',
      invitedBy: 'admin@rrdesign.ro',
      projectsCount: 0
    },
    {
      id: 3,
      name: 'Alex Dumitrescu',
      email: 'alex.dumitrescu@example.com',
      status: 'active',
      registeredDate: '2023-11-20',
      lastLogin: '2026-01-21',
      projectsCount: 7,
      invitedBy: 'admin@rrdesign.ro'
    },
    {
      id: 4,
      name: 'Elena Georgescu',
      email: 'elena.georgescu@example.com',
      status: 'suspended',
      registeredDate: '2024-03-10',
      lastLogin: '2025-12-15',
      projectsCount: 2,
      invitedBy: 'admin@rrdesign.ro',
      suspendedReason: 'Neplată servicii'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [viewingUser, setViewingUser] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showConfirmAction, setShowConfirmAction] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionUserId, setActionUserId] = useState(null);
  const [actionUserName, setActionUserName] = useState('');
  
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    message: ''
  });

  const filteredUsers = users.filter(u => {
    if (filterStatus === 'all') return true;
    return u.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'status-active', text: t('dashboard.usersManager.statusActive'), icon: CheckCircle },
      pending: { class: 'status-pending', text: t('dashboard.usersManager.statusPending'), icon: Clock },
      suspended: { class: 'status-suspended', text: t('dashboard.usersManager.statusSuspended'), icon: Ban }
    };
    const badge = badges[status] || badges.active;
    const Icon = badge.icon;
    return (
      <span className={`status-badge ${badge.class}`}>
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
  };

  const handleSendInvitation = (e) => {
    e.preventDefault();
    
    // Generează token unic pentru invitație
    const invitationToken = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const invitationLink = `${window.location.origin}/register?token=${invitationToken}`;
    
    // Adaugă utilizatorul ca pending
    const newUser = {
      id: Date.now(),
      name: inviteForm.name,
      email: inviteForm.email,
      status: 'pending',
      invitationSentDate: new Date().toISOString(),
      invitedBy: 'admin@rrdesign.ro',
      invitationToken: invitationToken,
      projectsCount: 0
    };
    
    setUsers([newUser, ...users]);
    
    // Simulare trimitere email
    alert(t('dashboard.usersManager.invitationSent', { email: inviteForm.email }) + `\n\nLink de înregistrare: ${invitationLink}\n\nÎn producție, acest link va fi trimis automat prin email.`);
    
    setInviteForm({ email: '', name: '', message: '' });
    setShowInviteModal(false);
  };

  const handleSuspendUser = (user) => {
    setActionType('suspend');
    setActionUserId(user.id);
    setActionUserName(user.name);
    setShowConfirmAction(true);
  };

  const handleActivateUser = (user) => {
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: 'active' } : u
    ));
    alert(t('dashboard.usersManager.userActivated', { name: user.name }));
  };

  const handleResendInvitation = (user) => {
    const invitationLink = `${window.location.origin}/register?token=${user.invitationToken || 'new_token'}`;
    alert(t('dashboard.usersManager.invitationResent', { email: user.email }) + `\n\nLink: ${invitationLink}`);
  };

  const confirmAction = () => {
    if (actionType === 'suspend') {
      setUsers(users.map(u => 
        u.id === actionUserId ? { ...u, status: 'suspended', suspendedReason: 'Suspendat de admin' } : u
      ));
    }
    setActionUserId(null);
    setActionUserName('');
    setActionType(null);
  };

  const getActionMessage = () => {
    if (actionType === 'suspend') {
      return t('dashboard.usersManager.confirmSuspendMessage', { name: actionUserName });
    }
    return '';
  };

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>
          <Users size={24} />
          {t('dashboard.usersManager.title')}
        </h2>
        <button className="btn-primary" onClick={() => setShowInviteModal(true)}>
          <Mail size={18} />
          {t('dashboard.usersManager.sendInvitation')}
        </button>
      </div>

      <div className="filter-buttons" style={{ marginBottom: '2rem' }}>
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          {t('dashboard.usersManager.all')} <span className="count">({users.length})</span>
        </button>
        <button
          className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
          onClick={() => setFilterStatus('active')}
        >
          {t('dashboard.usersManager.active')} <span className="count">({users.filter(u => u.status === 'active').length})</span>
        </button>
        <button
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          {t('dashboard.usersManager.pending')} <span className="count">({users.filter(u => u.status === 'pending').length})</span>
        </button>
        <button
          className={`filter-btn ${filterStatus === 'suspended' ? 'active' : ''}`}
          onClick={() => setFilterStatus('suspended')}
        >
          {t('dashboard.usersManager.suspended')} <span className="count">({users.filter(u => u.status === 'suspended').length})</span>
        </button>
      </div>

      <div className="manager-content">
        {/* User Cards */}
        <div className="users-cards">
          {filteredUsers.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-card-header">
                <div className="user-card-info">
                  <h4>{user.name}</h4>
                  {getStatusBadge(user.status)}
                </div>
                <span className="projects-badge">{user.projectsCount}</span>
              </div>

              <div className="user-card-body">
                <div className="user-card-row">
                  <Mail size={14} />
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </div>

                {user.status === 'pending' ? (
                  <div className="user-card-row">
                    <Clock size={14} />
                    <span>{t('dashboard.usersManager.invited')}: {formatDate(user.invitationSentDate)}</span>
                  </div>
                ) : (
                  <>
                    <div className="user-card-row">
                      <Calendar size={14} />
                      <span>{formatDate(user.registeredDate)}</span>
                    </div>
                    {user.lastLogin && (
                      <div className="user-card-row">
                        <Clock size={14} />
                        <span>{formatDate(user.lastLogin)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="user-card-actions">
                <button 
                  className="btn-action btn-view"
                  onClick={() => handleViewUser(user)}
                >
                  <Eye size={16} /> {t('dashboard.usersManager.viewDetails')}
                </button>
                
                {user.status === 'pending' && (
                  <button 
                    className="btn-action btn-primary"
                    onClick={() => handleResendInvitation(user)}
                  >
                    <Mail size={16} />
                  </button>
                )}
                
                {user.status === 'active' && (
                  <button 
                    className="btn-action btn-warning"
                    onClick={() => handleSuspendUser(user)}
                  >
                    <Ban size={16} />
                  </button>
                )}
                
                {user.status === 'suspended' && (
                  <button 
                    className="btn-action btn-success"
                    onClick={() => handleActivateUser(user)}
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <p>{t('dashboard.usersManager.noUsers')}</p>
          </div>
        )}
      </div>

      {/* Modal Invitație */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title={t('dashboard.usersManager.inviteModalTitle')}
      >
        <form onSubmit={handleSendInvitation} className="manager-form" style={{ margin: 0, padding: 0, border: 'none', boxShadow: 'none' }}>
          <div className="form-group">
            <label>{t('dashboard.usersManager.fullName')} *</label>
            <input
              type="text"
              value={inviteForm.name}
              onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              required
              placeholder={t('dashboard.usersManager.fullNamePlaceholder')}
            />
          </div>

          <div className="form-group">
            <label>{t('dashboard.usersManager.email')} *</label>
            <input
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              required
              placeholder={t('dashboard.usersManager.emailPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label>{t('dashboard.usersManager.personalizedMessage')}</label>
            <textarea
              value={inviteForm.message}
              onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
              rows="4"
              placeholder={t('dashboard.usersManager.messagePlaceholder')}
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
            <strong>ℹ️ {t('dashboard.usersManager.inviteInfo')}</strong>
            <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
              <li>{t('dashboard.usersManager.inviteInfoEmail')}</li>
              <li>{t('dashboard.usersManager.inviteInfoValidity')}</li>
              <li>{t('dashboard.usersManager.inviteInfoAccess')}</li>
            </ul>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowInviteModal(false)}>
              {t('dashboard.usersManager.cancel')}
            </button>
            <button type="submit" className="btn-primary">
              <Mail size={18} />
              {t('dashboard.usersManager.sendInvite')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detalii Utilizator */}
      {viewingUser && (
        <Modal
          isOpen={!!viewingUser}
          onClose={() => setViewingUser(null)}
          title={t('dashboard.usersManager.userDetailsTitle')}
        >
          <div className="user-details">
            <div className="detail-row">
              <strong>{t('dashboard.usersManager.name')}:</strong>
              <span>{viewingUser.name}</span>
            </div>
            
            <div className="detail-row">
              <strong>{t('dashboard.usersManager.email')}:</strong>
              <span><a href={`mailto:${viewingUser.email}`}>{viewingUser.email}</a></span>
            </div>
            
            <div className="detail-row">
              <strong>Status:</strong>
              {getStatusBadge(viewingUser.status)}
            </div>
            
            {viewingUser.status === 'pending' ? (
              <>
                <div className="detail-row">
                  <strong>{t('dashboard.usersManager.invited')}:</strong>
                  <span>{formatDate(viewingUser.invitationSentDate)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="detail-row">
                  <strong>{t('dashboard.usersManager.registeredDate')}:</strong>
                  <span>{formatDate(viewingUser.registeredDate)}</span>
                </div>
                
                <div className="detail-row">
                  <strong>{t('dashboard.usersManager.lastLogin')}:</strong>
                  <span>{formatDate(viewingUser.lastLogin)}</span>
                </div>
              </>
            )}
            
            <div className="detail-row">
              <strong>{t('dashboard.usersManager.invitedBy')}:</strong>
              <span>{viewingUser.invitedBy}</span>
            </div>
            
            <div className="detail-row">
              <strong>{t('dashboard.usersManager.projectsCount')}:</strong>
              <span className="projects-badge">{viewingUser.projectsCount}</span>
            </div>
            
            {viewingUser.status === 'suspended' && viewingUser.suspendedReason && (
              <div className="detail-row">
                <strong>{t('dashboard.usersManager.suspendReason')}:</strong>
                <span style={{ color: '#dc2626' }}>{viewingUser.suspendedReason}</span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal Confirmare Acțiune */}
      <ConfirmModal
        isOpen={showConfirmAction}
        onClose={() => setShowConfirmAction(false)}
        onConfirm={confirmAction}
        title={actionType === 'suspend' ? t('dashboard.usersManager.confirmSuspend') : t('dashboard.usersManager.cancel')}
        message={getActionMessage()}
      />
    </div>
  );
};

export default UsersManager;
