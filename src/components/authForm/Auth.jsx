import React, { useState } from 'react';
import './styles/AuthForm.css';
import {PORT} from '../../config/config'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthForm = ({ onAuthSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value,});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        if (!formData.username || !formData.password || (!isLoginMode && !formData.confirmPassword)) {
            setError('Please fill in all fields.');
            setIsSubmitting(false);
            return;
        }

        if (formData.username.length < 4){
            setError('Username must consist of at least 4 letters.');
            setIsSubmitting(false);
            return;
        }

        if (formData.username.length > 32){
            setError('Maximum username length should not exceed 32 letters.');
            setIsSubmitting(false);
            return;
        }

        if (formData.username.includes(' ') || formData.password.includes(' ')) {
            setError('Username and password should not contain spaces.');
            setIsSubmitting(false);
            return;
        }

        if (formData.password.length < 8){
            setError('Password must consist of at least 8 letters.');
            setIsSubmitting(false);
            return;
        }

        if (formData.password.length > 32){
            setError('Maximum password length should not exceed 32 letters.');
            setIsSubmitting(false);
            return;
        }

        if (!isLoginMode && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setIsSubmitting(false);
            return;
        }

        try {
            const url = isLoginMode ? `http://localhost:${PORT}/api/v1/auth/login` : `http://localhost:${PORT}/api/v1/auth/register`;

            const body = isLoginMode
                ? { username: formData.username, password: formData.password }
                : { username: formData.username, password: formData.password, role: formData.role };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            });

            if (!(response.status === 200 || response.status === 201)) {
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    setError(errorData.message || 'An error occurred.');
                } else {
                    const errorText = await response.text();
                    setError(errorText || 'An error occurred.');
                }
                setIsSubmitting(false);
                return;
            }

            const contentType = response.headers.get('Content-Type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (isLoginMode) {
                if (data.token) {
                    localStorage.setItem('Role', jwtDecode(data.token).role);
                    localStorage.setItem('Name', jwtDecode(data.token).sub);
                    localStorage.setItem('Authorization', `Bearer ${data.token}`);
                    onAuthSuccess();
                    navigate('/user');
                } else {
                    setError(data.message || 'Unexpected response format.');
                }
            } else {
                setSuccessMessage('Account successfully created! You can now log in.');
            }

            setFormData({ username: '', password: '', confirmPassword: '', role: 'USER' });
        } catch (err) {
            console.error('Error:', err);
            setError('Network error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="text"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                {!isLoginMode && (
                    <>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="text"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </>
                )}
                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Loading...' : isLoginMode ? 'Login' : 'Register'}
                </button>
            </form>
            <button className="toggle-button" onClick={() => setIsLoginMode((prev) => !prev)}>
                {isLoginMode ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
        </div>
    );
};

export default AuthForm;
