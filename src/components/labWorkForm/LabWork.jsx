import React, { useState } from "react";
import LabWorkTable from "./LabWorkTable";
import LabWorkCreate from "./LabWorkCreate";
import LabWorkUpdate from "./LabWorkUpdate";
import LabWorkDelete from "./LabWorkDelete";
import "./styles/style.css";
import { Link } from "react-router-dom";

const LabWork = () => {
    const [modalType, setModalType] = useState(null);
    const [selectedLabWork, setSelectedLabWork] = useState(null);

    const handleOpenModal = (type, labWork = null) => {
        setModalType(type);
        setSelectedLabWork(labWork);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedLabWork(null);
    };

    return (
        <div className="labwork-page">
            <div className="header-container">
                <h1 className="header-title">Lab Work Management</h1>
                <Link to="/menu" className="back-to-menu-link">
                    Back to Menu
                </Link>
            </div>
            <button
                onClick={() => handleOpenModal("create")}
                disabled={localStorage.getItem("Role") === "ADMIN"}
                className="create-button"
            >
                Create Lab Work
            </button>
            <LabWorkTable
                onEdit={(labWork) => handleOpenModal("update", labWork)}
                onDelete={(labWork) => handleOpenModal("delete", labWork)}
            />
            {modalType === "create" && <LabWorkCreate onClose={handleCloseModal} />}
            {modalType === "update" && (
                <LabWorkUpdate onClose={handleCloseModal} labWork={selectedLabWork} />
            )}
            {modalType === "delete" && (
                <LabWorkDelete onClose={handleCloseModal} labWork={selectedLabWork} />
            )}
        </div>
    );
};

export default LabWork;
