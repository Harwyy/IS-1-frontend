import React, { useState } from "react";
import DisciplineTable from "./DisciplineTable";
import DisciplineCreate from "./DisciplineCreate";
import DisciplineUpdate from "./DisciplineUpdate";
import DisciplineDelete from "./DisciplineDelete";
import "./styles/style.css";
import { Link } from "react-router-dom";

const Discipline = () => {
    const [modalType, setModalType] = useState(null);
    const [selectedDiscipline, setSelectedDiscipline] = useState(null);

    const handleOpenModal = (type, discipline = null) => {
        setModalType(type);
        setSelectedDiscipline(discipline);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedDiscipline(null);
    };

    return (
        <div className="discipline-page">
            <div className="header-container">
                <h1 className="header-title">Discipline Management</h1>
                <Link to="/menu" className="back-to-menu-link">
                    Back to Menu
                </Link>
            </div>
            <button
                onClick={() => handleOpenModal("create")}
                disabled={localStorage.getItem("Role") === "ADMIN"}
                className="create-button"
            >
                Create Discipline
            </button>
            <DisciplineTable
                onEdit={(discipline) => handleOpenModal("update", discipline)}
                onDelete={(discipline) => handleOpenModal("delete", discipline)}
            />
            {modalType === "create" && <DisciplineCreate onClose={handleCloseModal} />}
            {modalType === "update" && (
                <DisciplineUpdate onClose={handleCloseModal} discipline={selectedDiscipline} />
            )}
            {modalType === "delete" && (
                <DisciplineDelete onClose={handleCloseModal} discipline={selectedDiscipline} />
            )}
        </div>
    );
};

export default Discipline;
