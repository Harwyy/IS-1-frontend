import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./styles/style.css";
import { PORT } from "../../config/config";

const AdminApprovalForm = () => {
    const [unconfirmedAdmins, setUnconfirmedAdmins] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    const fetchUnconfirmedAdmins = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await fetch(`http://localhost:${PORT}/api/v1/admin/unconfirmed`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('Authorization'),
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUnconfirmedAdmins(data);
            } else if (response.status === 404) {
                setUnconfirmedAdmins([]); // Если данных нет, очистить список
            } else {
                setErrorMessage('Failed to fetch unconfirmed admins. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Error occurred while fetching unconfirmed admins.');
            console.error(error);
        }
    };

    const approveAdmin = async (adminId) => {
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await fetch(`http://localhost:${PORT}/api/v1/admin/confirm/${adminId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('Authorization'),
                },
            });
            if (response.ok) {
                setSuccessMessage(`Admin with ID ${adminId} successfully approved.`);
                setShowNotification(true); // Показать уведомление
                setTimeout(() => setShowNotification(false), 3000); // Скрыть уведомление через 3 секунды

                // Удалить утвержденного администратора из списка
                setUnconfirmedAdmins((prevAdmins) =>
                    prevAdmins.filter((admin) => admin.id !== adminId)
                );
            } else {
                setErrorMessage(`Failed to approve admin with ID ${adminId}.`);
            }
        } catch (error) {
            setErrorMessage('Error occurred while approving admin.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUnconfirmedAdmins();
    }, []);

    return (
        <div className="admin-approval-container">
            <div className="header-container">
                <h1 className="admin-approval-title">Admin Approval Panel</h1>
                <Link to="/menu" className="back-to-menu-button">Back to Menu</Link>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <div className="admin-list">
                <h2 className="admin-list-title">Unconfirmed Admins</h2>
                {unconfirmedAdmins.length === 0 ? (
                    <p className="no-admins-message">No unconfirmed admins found.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {unconfirmedAdmins.map((admin) => (
                            <tr key={admin.id}>
                                <td>{admin.id}</td>
                                <td>{admin.username}</td>
                                <td>
                                    <button
                                        className="approve-button"
                                        onClick={() => approveAdmin(admin.id)}
                                    >
                                        Approve
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showNotification && (
                <div className="notification">
                    Admin approved successfully!
                </div>
            )}

            <style jsx>{`
                .notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: #2e8b57;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    font-family: 'Roboto', sans-serif;
                    font-size: 14px;
                    opacity: 0.9;
                    z-index: 1000;
                }
            `}</style>
        </div>
    );
};

export default AdminApprovalForm;
