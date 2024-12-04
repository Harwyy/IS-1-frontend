import React, { useState } from "react";
import LocationTable from "./LocationTable";
import LocationCreate from "./LocationCreate";
import LocationUpdate from "./LocationUpdate";
import LocationDelete from "./LocationDelete";
import "./styles/style.css";
import { Link } from "react-router-dom";

const Location = () => {
    const [modalType, setModalType] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleOpenModal = (type, location = null) => {
        setModalType(type);
        setSelectedLocation(location);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedLocation(null);
    };

    return (
        <div className="location-page">
            <div className="header-container">
                <h1 className="header-title">Location Management</h1>
                <Link to="/menu" className="back-to-menu-link">
                    Back to Menu
                </Link>
            </div>
            <button
                onClick={() => handleOpenModal("create")}
                disabled={localStorage.getItem("Role") === "ADMIN"}
                className="create-button"
            >
                Create Location
            </button>
            <LocationTable
                onEdit={(location) => handleOpenModal("update", location)}
                onDelete={(location) => handleOpenModal("delete", location)}
            />
            {modalType === "create" && <LocationCreate onClose={handleCloseModal} />}
            {modalType === "update" && (
                <LocationUpdate onClose={handleCloseModal} location={selectedLocation} />
            )}
            {modalType === "delete" && (
                <LocationDelete onClose={handleCloseModal} location={selectedLocation} />
            )}
        </div>
    );
};

export default Location;
