import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./styles/style.css";
import { PORT } from "../../config/config";

const AdminApprovalForm = () => {
    const [unconfirmedAdmins, setUnconfirmedAdmins] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
            }  else if (response.status === 404) {

            }else {
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
                fetchUnconfirmedAdmins();
            }else {
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
        </div>
    );
};

export default AdminApprovalForm;
