import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Briefcase, Calendar, Shield, Save, Edit2, X } from 'lucide-react';
import UserSidebar from '../../components/UserSidebar/UserSidebar';
import './Profile.css';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    phone: '+40 123 456 789',
    company: 'RRDesign',
    joinDate: 'Ianuarie 2024'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aici va fi logica de salvare
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || '',
      phone: '+40 123 456 789',
      company: 'RRDesign',
      joinDate: 'Ianuarie 2024'
    });
    setIsEditing(false);
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
        <div className="profile-page">
          <div className="profile-container">
        <div className="profile-header">
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
          <div className="profile-card">
            <div className="profile-card-header">
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

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <Briefcase size={18} />
                    {t('profile.company')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="form-value">{formData.company}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    <Calendar size={18} />
                    {t('profile.joinDate')}
                  </label>
                  <div className="form-value">{formData.joinDate}</div>
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

          <div className="profile-card">
            <div className="profile-card-header">
              <h2>{t('profile.security')}</h2>
            </div>
            <div className="profile-form">
              <div className="security-item">
                <div className="security-info">
                  <h4>{t('profile.password')}</h4>
                  <p>{t('profile.passwordDescription')}</p>
                </div>
                <button className="btn btn-secondary">
                  {t('profile.changePassword')}
                </button>
              </div>
            </div>
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
