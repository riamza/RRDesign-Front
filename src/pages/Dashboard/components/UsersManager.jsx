import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Mail, Calendar, CheckCircle, Clock, Eye, Ban, Briefcase, Shield, AlertTriangle } from 'lucide-react';
import { api } from '../../../services/api';
import Modal from '../../../components/Modal/Modal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import { fetchUsers, toggleUserStatus as toggleUserStatusAction } from '../../../store/slices/usersSlice';
import { getInitials } from '../../../utils/stringUtils';
import './Manager.css';

const UsersManager = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { items: users, status } = useSelector((state) => state.users);

    const [userProjects, setUserProjects] = useState([]);
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

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers());
        }
    }, [status, dispatch]);

    const filteredUsers = users.filter(u => {
        if (filterStatus === 'all') return true;
        return u.status === filterStatus;
    });

    const getStatusInfo = (status) => {
        const map = {
            active: { color: '#22c55e', text: t('dashboard.usersManager.statusActive'), icon: CheckCircle },
            pending: { color: '#f59e0b', text: t('dashboard.usersManager.statusPending'), icon: Clock },
            suspended: { color: '#ef4444', text: t('dashboard.usersManager.statusSuspended'), icon: Ban }
        };
        return map[status] || map.active;
    };

    const formatDate = (dateString) => {
        if (!dateString || typeof dateString === 'number') return '-';
        try {
            return new Intl.DateTimeFormat('ro-RO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(new Date(dateString));
        } catch { return '-'; }
    };

    useEffect(() => {
        if (viewingUser) {
            setUserProjects([]); 
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
            alert(t('dashboard.usersManager.invitationSent', { email: inviteForm.email }) +
                `\n\nLink: ${response.invitationLink}` +
                `\n\n(In production this would be emailed)`);
            
            setShowInviteModal(false);
            setInviteForm({ email: '', name: '', message: '' });
            dispatch(fetchUsers());
        } catch (err) {
            alert("Failed to send invitation: " + err.message);
        }
    };

    const handleSuspendUser = (user) => {
        setActionType('suspend');
        setActionUserId(user.id);
        setActionUserName(user.fullName);
        setShowConfirmAction(true);
    };

    const handleActivateUser = (user) => {
        setActionType('activate'); 
        setActionUserId(user.id);
        setActionUserName(user.fullName);
        setShowConfirmAction(true);
    };

    const confirmAction = async () => {
        if (!actionUserId) return;
        try {
            const newStatus = actionType === 'suspend' ? 'suspended' : 'active';
            await dispatch(toggleUserStatusAction({ id: actionUserId, status: newStatus })).unwrap();
        } catch (error) {
            alert("Action failed: " + error.message);
        } finally {
            setActionUserId(null);
            setActionUserName('');
            setActionType(null);
            setShowConfirmAction(false);
        }
    };

    const getActionMessage = () => {
        if (actionType === 'suspend') {
            return t('dashboard.usersManager.confirmSuspendMessage', { name: actionUserName });
        }
        if (actionType === 'activate') {
             return `Esti sigur ca vrei sa activezi contul pentru ${actionUserName}?`;
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

            {/* Filters */}
            <div className="filter-buttons" style={{ marginBottom: '2rem', display: 'flex', gap: '10px' }}>
                {['all', 'active', 'pending', 'suspended'].map(s => (
                     <button
                        key={s}
                        className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
                        onClick={() => setFilterStatus(s)}
                    >
                        {t(`dashboard.usersManager.${s}`)} 
                        <span className="count">
                            ({s === 'all' ? users.length : users.filter(u => u.status === s).length})
                        </span>
                    </button>
                ))}
            </div>

            <div className="manager-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {filteredUsers.map(user => {
                        const statusInfo = getStatusInfo(user.status);
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                            <div key={user.id} className="user-card" onClick={() => handleViewUser(user)}>
                                {/* Banner Header */}
                                <div className="user-card-header"></div>

                                <div className="user-card-body">
                                    {/* Avatar */}
                                    <div className="user-card-avatar">
                                        <div className="user-card-avatar-inner">
                                            {getInitials(user.fullName || user.email)}
                                        </div>
                                    </div>

                                    {/* Identity */}
                                    <h3 className="user-card-title">{user.fullName || 'User'}</h3>
                                    <p className="user-card-subtitle">{user.email}</p>

                                    {/* Stats Row */}
                                    <div className="user-card-stats">
                                        <div className="user-stat-item">
                                            <span className="user-stat-value" style={{ color: statusInfo.color }}>
                                                <StatusIcon size={16} />
                                                {statusInfo.text}
                                            </span>
                                            <span className="user-stat-label">Status</span>
                                        </div>
                                        
                                        <div className="user-stat-item">
                                            <span className="user-stat-value">
                                                {user.projectsCount || 0}
                                            </span>
                                            <span className="user-stat-label">Proiecte</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="user-card-actions" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={() => handleViewUser(user)}
                                            className="btn-icon-soft"
                                            title="View Details"
                                        >
                                            <Eye size={16} /> Detalii
                                        </button>

                                        {user.status === 'active' && (
                                            <button 
                                                onClick={() => handleSuspendUser(user)}
                                                className="btn-icon-soft danger"
                                                title="Block Account"
                                            >
                                                <Ban size={16} /> Blocheaza
                                            </button>
                                        )}
                                        
                                        {user.status === 'suspended' && (
                                            <button 
                                                onClick={() => handleActivateUser(user)}
                                                className="btn-icon-soft success"
                                                title="Activate Account"
                                            >
                                                <CheckCircle size={16} /> Activeaza
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
                        <label>{t('dashboard.usersManager.email')} *</label>
                        <input
                            type="email"
                            value={inviteForm.email}
                            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                            required
                            placeholder={t('dashboard.usersManager.emailPlaceholder')}
                        />
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

            {/* Modal Detalii & Proiecte */}
            {viewingUser && (
                <Modal
                    isOpen={!!viewingUser}
                    onClose={() => setViewingUser(null)}
                    title={viewingUser.fullName || viewingUser.email}
                >
                    <div className="user-details">
                        {/* Profile Header in Modal as well for consistency */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                             <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', fontWeight: 800, fontSize: '1.5rem' }}>
                                {getInitials(viewingUser.fullName || viewingUser.email)}
                             </div>
                             <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{viewingUser.fullName}</h3>
                                <p style={{ margin: 0, color: '#64748b' }}>{viewingUser.email}</p>
                             </div>
                        </div>

                        <div className="detail-row">
                            <strong>Status:</strong>
                            <span style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                padding: '4px 10px', 
                                borderRadius: '20px', 
                                background: viewingUser.status === 'active' ? '#dcfce7' : viewingUser.status === 'suspended' ? '#fee2e2' : '#fef3c7',
                                color: viewingUser.status === 'active' ? '#166534' : viewingUser.status === 'suspended' ? '#991b1b' : '#92400e',
                                fontWeight: 600,
                                fontSize: '0.85rem'
                            }}>
                                {viewingUser.status === 'active' ? <CheckCircle size={14}/> : viewingUser.status === 'suspended' ? <Ban size={14}/> : <Clock size={14}/>}
                                {getStatusInfo(viewingUser.status).text}
                            </span>
                        </div>

                        <h4 style={{marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <Briefcase size={18} className='text-indigo-600'/> 
                            Proiecte active ({userProjects.length})
                        </h4>
                        
                        <div className="user-projects-list-mini" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {userProjects.length > 0 ? (
                                <ul style={{listStyle: 'none', padding: 0}}>
                                    {userProjects.map(p => (
                                        <li key={p.id} style={{
                                            padding: '12px',
                                            border: '1px solid #f1f5f9',
                                            borderRadius: '8px',
                                            marginBottom: '8px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: '#f8fafc'
                                        }}>
                                            <div>
                                                <div style={{fontWeight: 600, color: '#1e293b'}}>{p.title}</div>
                                                <div style={{fontSize: '0.8rem', color: '#64748b'}}>{p.domain}</div>
                                            </div>
                                            <span className={`status-pill ${p.status === 'Active' ? 'status-active' : 'status-completed'}`}
                                                  style={{fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: p.status === 'Active' ? '#e0f2fe' : '#dcfce7', color: p.status === 'Active' ? '#0284c7' : '#166534'}}>
                                                {p.status || 'Active'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div style={{padding: '2rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', background: '#f8fafc', borderRadius: '8px'}}>
                                    Nu există proiecte asociate acestui utilizator.
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal Confirmare Acțiune */}
            <ConfirmModal
                isOpen={showConfirmAction}
                onClose={() => setShowConfirmAction(false)}
                onConfirm={confirmAction}
                title={actionType === 'suspend' ? 'Blocare Cont' : 'Activare Cont'}
                message={getActionMessage()}
            />
        </div>
    );
};

export default UsersManager;
