import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Mail, Calendar, CheckCircle, XCircle, Clock, Eye, Ban, Briefcase } from 'lucide-react';
import { api } from '../../../services/api';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import './Manager.css';

const UsersManager = () => {
  const { t } = useTranslation();
  const [userProjects, setUserProjects] = useState([]);
  
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

  React.useEffect(() => {
     if (viewingUser) {
         api.getClientProjectsByUser(viewingUser.id)
            .then(data => setUserProjects(data))
            .catch(e => {
                console.error("Error fetching user projects", e);
                setUserProjects([]);
            });
     }
  }, [viewingUser]);


  const handleViewUser = (user) => {
    setViewingUser(user);
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    
    try {
        const response = await api.auth.inviteUser(inviteForm.email);
        
        // Show success and the link (since we might not have real email sending yet)
        alert(t('dashboard.usersManager.invitationSent', { email: inviteForm.email }) + 
              `\n\nLink: ${response.invitationLink}` +
              `\n\n(In production this would be emailed)`);
        
        // Refresh users list properly - for now we just close the modal
        // ideally we should fetch Users list again from API
        setShowInviteModal(false);
        setInviteForm({ email: '', name: '', message: '' });

    } catch (err) {
        alert("Failed to send invitation: " + err.message);
    }
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
        {/* User Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredUsers.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-card-header">
                {/* Header background gradient only */}
              </div>

              <div className="user-card-body">
                <div className="user-card-avatar">
                   <div className="user-card-avatar-inner">
                      {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                   </div>
                </div>

                <div className="user-card-title">{user.name || user.email}</div>
                <div className="user-card-subtitle">{user.email}</div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                   {getStatusBadge(user.status)}
                   <span style={{ 
                      fontSize: '0.75rem', 
                      background: '#f1f5f9', 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      color: '#64748b', 
                      fontWeight: '600'
                   }}>
                      {user.projectsCount || 0} PROIECTE
                   </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                   {user.status === 'pending' ? (
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={14} />
                          <span>Invitatie: {formatDate(user.invitationSentDate)}</span>
                       </div>
                   ) : (
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={14} />
                          <span>Inregistrat: {formatDate(user.registeredDate)}</span>
                       </div>
                   )}
                </div>

                <div className="user-card-actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button 
                    onClick={() => handleViewUser(user)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
                  >
                    <Eye size={16} style={{ marginRight: '5px' }} />Detalii
                  </button>
                  
                  {user.status === 'active' && (
                    <button 
                       onClick={() => handleSuspendUser(user)}
                       className="btn-secondary"
                       style={{ color: '#ef4444', borderColor: '#fee2e2', padding: '0.5rem' }}
                       title="Suspend Account"
                    >
                      <Ban size={16} />
                    </button>
                  )}
                  
                  {user.status === 'suspended' && (
                    <button 
                       onClick={() => handleActivateUser(user)}
                       className="btn-secondary"
                       style={{ color: '#22c55e', borderColor: '#dcfce7', padding: '0.5rem' }}
                       title="Activate Account"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}

                  {user.status === 'pending' && (
                    <button 
                       onClick={() => handleResendInvitation(user)}
                       className="btn-secondary"
                       style={{ padding: '0.5rem' }}
                       title="Resend Invite"
                    >
                      <Mail size={16} />
                    </button>
                  )}
                </div>
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
                   <strong>Active Projects:</strong>
                   <div className="user-projects-list-mini">
                       {userProjects.length > 0 ? (
                           <ul>
                               {userProjects.map(p => (
                                   <li key={p.id}>
                                       <span>{p.title}</span>
                                       <span className={p.endDate ? 'text-success' : 'text-warning'}>
                                           {p.endDate ? '(Finished)' : '(Active)'}
                                       </span>
                                   </li>
                               ))}
                           </ul>
                       ) : (
                           <span>No projects found.</span>
                       )}
                   </div>
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
