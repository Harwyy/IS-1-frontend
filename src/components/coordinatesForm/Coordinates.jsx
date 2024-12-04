import React, { useState } from "react";
import CoordinatesTable from "./CoordinatesTable";
import CoordinatesCreate from "./CoordinatesCreate";
import CoordinatesUpdate from "./CoordinatesUpdate";
import CoordinatesDelete from "./CoordinatesDelete";
import "./styles/style.css"
import {Link} from "react-router-dom";

const Coordinates = () => {
    const [modalType, setModalType] = useState(null);
    const [selectedCoordinate, setSelectedCoordinate] = useState(null);

    const handleOpenModal = (type, coordinate = null) => {
        setModalType(type);
        setSelectedCoordinate(coordinate);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedCoordinate(null);
    };

    return (
        <div className="coordinates-page">
            <div className="header-container">
                <h1 className="header-title">Coordinates Management</h1>
                <Link to="/menu" className="back-to-menu-link">Back to Menu</Link>
            </div>
            <button onClick={() => handleOpenModal("create")} disabled={localStorage.getItem("Role") === "ADMIN"} className="create-button">
                Create Coordinates
            </button>
            <CoordinatesTable
                onEdit={(coordinate) => handleOpenModal("update", coordinate)}
                onDelete={(coordinate) => handleOpenModal("delete", coordinate)}
            />
            {modalType === "create" && (
                <CoordinatesCreate onClose={handleCloseModal}/>
            )}
            {modalType === "update" && (
                <CoordinatesUpdate
                    onClose={handleCloseModal}
                    coordinate={selectedCoordinate}
                />
            )}
            {modalType === "delete" && (
                <CoordinatesDelete
                    onClose={handleCloseModal}
                    coordinate={selectedCoordinate}
                />
            )}
        </div>
    );
};

export default Coordinates;
