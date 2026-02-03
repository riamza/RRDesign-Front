import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Briefcase, Calendar, Shield, Save, Edit2, X } from 'lucide-react';
import UserSidebar from '../../components/UserSidebar/UserSidebar';
import './Profile.css';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.userName || '',
        email: user.email || '',
        role: user.role || '',
        phone: user.phoneNumber || prev.phone,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aici va fi logica de salvare user info
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Parolele nu coincid!"); // Sau foloseste un state de eroare
      return;
    }
    // Aici va fi logica de schimbare parola
    console.log('Changing password:', passwordData);
    setIsEditingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleCancel = () => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            name: user.userName || '',
            email: user.email || '',
            role: user.role || '',
            phone: user.phoneNumber || prev.phone,
        }));
    }
    setIsEditing(false);
  };
  
  const handlePasswordCancel = () => {
    setIsEditingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="page-with-sidebar">
      <UserSidebar />
      <div className="page-content">
        <div className="page-layout profile-page">
          <div className="profile-container">
        <div className="card profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar-large">
              {getInitials(formData.name)}
            </div>
            <div className="profile-header-info">
              <h1>{formData.name}</h1>
              <p className="profile-role">
                <Shield size={16} />
                {formData.role === 'admin' ? t('profile.roleAdmin') : t('profile.roleUser')}
              </p>
            </div>
          </div>
          {!isEditing && (
            <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
              <Edit2 size={18} />
              {t('profile.editProfile')}
            </button>
          )}
        </div>

        <div className="profile-body">
          <div className="card profile-card">
            <div className="card-header profile-card-header">
              <h2>{t('profile.personalInfo')}</h2>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <User size={18} />
                    {t('profile.fullName')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <div className="form-value">{formData.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    <Mail size={18} />
                    {t('profile.email')}
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <div className="form-value">{formData.email}</div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <Save size={18} />
                    {t('profile.saveChanges')}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    <X size={18} />
                    {t('profile.cancel')}
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="card profile-card">
            <div className="card-header profile-card-header">
              <h2>{t('profile.security')}</h2>
              {!isEditingPassword && (
                <button className="btn-edit-profile" onClick={() => setIsEditingPassword(true)}>
                  <Edit2 size={18} />
                  {t('profile.changePassword')}
                </button>
              )}
            </div>

            <form onSubmit={handlePasswordSubmit} className="profile-form">
               {!isEditingPassword ? (
                  <div className="form-row">
                     <div className="form-group">
                        <label>{t('profile.password')}</label>
                        <div className="form-value">••••••••••••</div>
                     </div>
                  </div>
               ) : (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{t('profile.currentPassword')}</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                       <div className="form-group">
                        <label>{t('profile.newPassword')}</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>{t('profile.confirmPassword')}</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        <Save size={18} />
                        {t('profile.saveChanges')}
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={handlePasswordCancel}>
                        <X size={18} />
                        {t('profile.cancel')}
                      </button>
                    </div>
                  </>
               )}
            </form>
          </div>

          <div className="profile-card">
            <div className="profile-card-header">
              <h2>{t('profile.accountStats')}</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-value">0</div>
                <div className="stat-label">{t('profile.projectsCompleted')}</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">0</div>
                <div className="stat-label">{t('profile.activeProjects')}</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">0</div>
                <div className="stat-label">{t('profile.messagesReceived')}</div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
