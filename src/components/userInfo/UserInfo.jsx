import React from 'react';
import './styles/style.css';

const UserInfo = () => {
    const name = localStorage.getItem('Name') || 'Guest';
    const role = localStorage.getItem('Role') || 'USER';

    return (
        <div className="user-info-container">
            <p className="role">{role}</p>
            <div className="divider"></div>
            <p className="name">{name}</p>
        </div>
    );
};

export default UserInfo;
