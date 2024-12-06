import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Menu.css';

const Menu = ({ onLogout }) => {
    return (
        <div className="menu-container">
            <div className="menu-header">
                <h2>Welcome, {localStorage.getItem("Name").toLowerCase()}</h2>
            </div>
            <nav className="menu-nav">
                <ul>
                    <li><Link to="/laboratory" className="menu-item">Laboratory Works</Link></li>
                    <li><Link to="/person" className="menu-item">People</Link></li>
                    <li><Link to="/discipline" className="menu-item">Disciplines</Link></li>
                    <li><Link to="/location" className="menu-item">Locations</Link></li>
                    <li><Link to="/coordinates" className="menu-item">Coordinates</Link></li>
                    {localStorage.getItem("Role") !== 'ADMIN' && (
                        <li>
                            <Link to="/functions" className="menu-item">
                                Functions
                            </Link>
                        </li>
                    )}
                    {localStorage.getItem("Role") !== 'USER' && (
                        <li>
                            <Link to="/approve" className="menu-item">
                                Approve new admins
                            </Link>
                        </li>
                    )}
                    <li>
                        <button onClick={onLogout} className="menu-item logout-btn">Log Out</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Menu;
