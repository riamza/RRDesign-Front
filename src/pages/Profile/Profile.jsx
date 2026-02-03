import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, Mail, Shield, Save, Edit2, X, Camera, Lock } from 'lucide-react';
import Modal from '../../components/Modal/Modal';
import './Profile.css';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    dateOfBirth: '',
    location: ''
  });

  useEffect(() => {
    if (user) {
      // If user comes from auth context, it might be stale.
      // We should ideally fetch fresh profile. 
      // But for now, let's map what we have or fetch if needed.
      // Assuming api.auth.getProfile() is called on mount usually in real apps, 
      // but here we might rely on props or context.
      // If user context object has these fields, we use them.
      // If not, we might need to update AuthContext to fetch full profile.
      
      const loadProfile = async () => {
         try {
             // Force fetch fresh profile data
             const profile = await api.auth.getProfile();
             setFormData({
                name: profile.fullName || profile.userName,
                email: profile.email,
                role: profile.role,
                phone: profile.phoneNumber || '',
                dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '', // Format for input date
                location: profile.location || ''
             });
         } catch(e) {
             console.error("Failed to load profile", e);
             // Fallback to basic user info
             setFormData({
                name: user.userName,
                email: user.email,
                role: user.role,
                phone: '',
                dateOfBirth: '',
                location: ''
             });
         }
      };
      
      loadProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: '', message: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
        setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters' });
        return;
    }

    try {
      await api.auth.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordStatus({ type: 'success', message: 'Password changed successfully' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordStatus({ type: '', message: '' });
      }, 2000);
    } catch (error) {
       setPasswordStatus({ type: 'error', message: error.message || 'Failed to change password' });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
        <div className='profile-page'>
          <div className='profile-wrapper'>
            <div className='profile-card'>
            
            {/* Header Banner */}
            <div className='profile-banner'>
            </div>

            {/* Avatar Section */}
            <div className='profile-avatar-wrapper'>
              <div className='profile-avatar'>
                <div className='profile-avatar-inner'>
                  {getInitials(formData.name)}
                </div>
              </div>
              {isEditing && (
                <div className='avatar-edit-btn'>
                  <Camera size={18} />
                </div>
              )}
              
              <div className={`profile-role-badge ${(formData.role || '').toLowerCase()}`}>
                <Shield size={14} />
                {formData.role || 'User'}
              </div>

              <div className='profile-identity'>
                <h1 className='profile-name'>{formData.name}</h1>
                <p className='profile-email'>{formData.email}</p>
              </div>
            </div>

            {/* Stats Row (example stats) */}
            <div className='profile-stats'>
              <div className='stat-item'>
                <span className='stat-value'>12</span>
                <span className='stat-label'>{t('header.myProjects') || 'Projects'}</span>
              </div>
              <div className='stat-item'>
                <span className='stat-value'>24</span>
                <span className='stat-label'>{'Reviews' || 'Reviews'}</span>
              </div>
              <div className='stat-item'>
                <span className='stat-value'>2024</span>
                <span className='stat-label'>{'Member Since' || 'Joined'}</span>
              </div>
            </div>

            {/* Main Content Form */}
            <form onSubmit={handleSubmit} className='profile-content'>
              <div className='info-group'>
                <div className='section-title'>
                  <User size={20} className='text-indigo-600' />
                  {t('profile.personalInfo')}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className='info-label'>{t('profile.fullName')}</label>
                  {isEditing ? (
                    <input 
                      className='profile-input'
                      type='text' 
                      name='name'
                      value={formData.name} 
                      onChange={handleChange} 
                    />
                  ) : (
                    <div className='info-value'>{formData.name}</div>
                  )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label className='info-label'>{t('profile.dob', 'Date of Birth')}</label>
                  {isEditing ? (
                    <input 
                      className='profile-input'
                      type='date' 
                      name='dateOfBirth'
                      value={formData.dateOfBirth} 
                      onChange={handleChange} 
                    />
                  ) : (
                    <div className='info-value'>{formData.dateOfBirth || '-'}</div>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className='info-label'>{t('profile.location', 'Location')}</label>
                  {isEditing ? (
                    <input 
                      className='profile-input'
                      type='text' 
                      name='location'
                      value={formData.location} 
                      onChange={handleChange} 
                    />
                  ) : (
                    <div className='info-value'>{formData.location || '-'}</div>
                  )}
                </div>

                <div>
                  <label className='info-label'>{t('profile.email')}</label>
                  <div className='info-value'>{formData.email}</div>
                </div>
              </div>

              <div className='info-group'>
                <div className='section-title'>
                  <Lock size={20} className='text-indigo-600' />
                  {t('profile.security')}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label className='info-label'>Password</label>
                  <div className='info-value'>******</div>
                </div>
                
                {!isEditing && (
                  <button 
                    type='button' 
                    className='btn-cancel' 
                    style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    {t('profile.changePassword')}
                  </button>
                )}
              </div>

              {isEditing && (
                <div className='action-buttons-row'>
                  <button type='submit' className='btn-save'>
                    <Save size={18} />
                    {t('profile.saveChanges')}
                  </button>
                  <button type='button' className='btn-cancel' onClick={() => setIsEditing(false)}>
                    {t('profile.cancel')}
                  </button>
                </div>
              )}
            </form>

          </div>
        </div>

      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title={t('profile.changePassword') || 'Change Password'}>
        <form onSubmit={handlePasswordSubmit} className="password-form">
          {passwordStatus.message && (
            <div className={`status-message ${passwordStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}`} style={{marginBottom: '1rem', padding: '10px', borderRadius: '8px', backgroundColor: passwordStatus.type === 'error' ? '#fee2e2' : '#dcfce7'}}>
              {passwordStatus.message}
            </div>
          )}
          
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t('profile.currentPassword') || 'Current Password'}</label>
            <input 
              type="password" 
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="profile-input" 
              required
              style={{ width: '100%' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t('profile.newPassword') || 'New Password'}</label>
            <input 
              type="password" 
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="profile-input" 
              required
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t('profile.confirmPassword') || 'Confirm New Password'}</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="profile-input" 
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn-cancel" onClick={() => setShowPasswordModal(false)}>
              {t('common.cancel') || 'Cancel'}
            </button>
            <button type="submit" className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={16} /> {t('common.update') || 'Update'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Profile;
