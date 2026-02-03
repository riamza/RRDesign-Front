import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import './Register.css'; // We'll create this or reuse Login styles

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        location: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (!token) {
            setError(t('register.missingToken', "Invalid link. Please check your email."));
            setLoading(false);
            return;
        }

        const checkToken = async () => {
             try {
                 const res = await api.auth.validateInvitation(token);
                 // Assuming API returns { email: '...' } on success
                 setEmail(res.email);
                 setLoading(false);
             } catch (err) {
                 setError(t('register.invalidToken', "This invitation link is invalid or has expired."));
                 setLoading(false);
             }
        };

        checkToken();
    }, [token, t]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError(t('register.passwordMismatch', "Passwords do not match."));
            return;
        }
        
        if (formData.password.length < 6) {
           setError(t('register.passwordTooShort', "Password must be at least 6 characters."));
           return;
        }

        try {
            const payload = {
                token,
                fullName: formData.fullName,
                dateOfBirth: formData.dateOfBirth, // Ensure format is ISO or compatible
                location: formData.location,
                password: formData.password
            };
            
            const res = await api.auth.completeRegistration(payload);
            
            // Auto login with the response
            if (res.accessToken) {
                localStorage.setItem('access_token', res.accessToken);
                localStorage.setItem('refresh_token', res.refreshToken);
                localStorage.setItem('user_role', res.role);
                navigate('/dashboard'); // or user profile
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || t('register.failed', "Registration failed."));
        }
    };

    if (loading) return <div className="register-container"><div className="loader">Loading...</div></div>;

    if (error) {
        return (
            <div className="register-container">
                <div className="error-card">
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button onClick={() => navigate('/login')}>Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>{t('register.completeProfile', "Complete Your Profile")}</h2>
                <p className="register-email">Account for: <strong>{email}</strong></p>
                
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label>{t('register.fullName', "Full Name")}</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('register.dob', "Date of Birth")}</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>{t('register.location', "Location")}</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="City, Country"
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('register.password', "Password")}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="******"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>{t('register.confirmPassword', "Confirm Password")}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="******"
                        />
                    </div>

                    <button type="submit" className="btn-register">
                        {t('register.submit', "Create Account")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
