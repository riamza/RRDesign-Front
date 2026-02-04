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
    const [globalError, setGlobalError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        location: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (!token) {
            setGlobalError(t('register.missingToken', "Invalid link. Please check your email."));
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
                 setGlobalError(t('register.invalidToken', "This invitation link is invalid or has expired."));
                 setLoading(false);
             }
        };

        checkToken();
    }, [token, t]);

    const validateField = (name, value) => {
        let error = null;
        switch (name) {
            case 'fullName':
                if (!value.trim()) error = t('register.required', "This field is required.");
                break;
            case 'dateOfBirth':
                if (!value) error = t('register.required', "This field is required.");
                break;
            case 'location':
                if (!value.trim()) error = t('register.required', "This field is required.");
                break;
            case 'password':
                if (value.length < 6) error = t('register.passwordTooShort', "Password must be at least 6 characters.");
                // Add more strength checks if needed
                break;
            case 'confirmPassword':
                if (value !== formData.password) error = t('register.passwordMismatch', "Passwords do not match.");
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Real-time validation for passwords
        if (name === 'password' || name === 'confirmPassword') {
            const error = validateField(name, value);
            setFieldErrors(prev => ({ ...prev, [name]: error }));
            
            // If changing password, re-validate confirmPassword if it has value
            if (name === 'password' && formData.confirmPassword) {
                 const confirmError = value !== formData.confirmPassword 
                    ? t('register.passwordMismatch', "Passwords do not match.") 
                    : null;
                 setFieldErrors(prev => ({ ...prev, confirmPassword: confirmError }));
            }
        } else {
            // Clear error on change for other fields
            if (fieldErrors[name]) {
                setFieldErrors(prev => ({ ...prev, [name]: null }));
            }
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFieldErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalError(null);

        // Validate all
        const errors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) errors[key] = error;
        });
        
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
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
                
                if (res.role === 'Admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/my-projects');
                }
            } else {
                navigate('/login');
            }
        } catch (err) {
            setGlobalError(err.message || t('register.failed', "Registration failed."));
        }
    };

    if (loading) return <div className="register-container"><div className="loader">Loading...</div></div>;

    if (globalError) {
        return (
            <div className="register-container">
                <div className="error-card">
                    <h3>Error</h3>
                    <p>{globalError}</p>
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
                            onBlur={handleBlur}
                            className={fieldErrors.fullName ? 'input-error' : ''}
                            required
                            placeholder="John Doe"
                        />
                        {fieldErrors.fullName && <span className="error-text">{fieldErrors.fullName}</span>}
                    </div>

                    <div className="form-group">
                        <label>{t('register.dob', "Date of Birth")}</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={fieldErrors.dateOfBirth ? 'input-error' : ''}
                            required
                        />
                        {fieldErrors.dateOfBirth && <span className="error-text">{fieldErrors.dateOfBirth}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>{t('register.location', "Location")}</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={fieldErrors.location ? 'input-error' : ''}
                            required
                            placeholder="City, Country"
                        />
                        {fieldErrors.location && <span className="error-text">{fieldErrors.location}</span>}
                    </div>

                    <div className="form-group">
                        <label>{t('register.password', "Password")}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={fieldErrors.password ? 'input-error' : ''}
                            required
                            placeholder="******"
                        />
                        {fieldErrors.password && <span className="error-text">{fieldErrors.password}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>{t('register.confirmPassword', "Confirm Password")}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={fieldErrors.confirmPassword ? 'input-error' : ''}
                            required
                            placeholder="******"
                        />
                         {fieldErrors.confirmPassword && <span className="error-text">{fieldErrors.confirmPassword}</span>}
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
