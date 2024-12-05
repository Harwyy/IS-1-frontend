import React, { useState } from "react";
import PersonTable from "./PersonTable";
import PersonCreate from "./PersonCreate";
import PersonUpdate from "./PersonUpdate";
import PersonDelete from "./PersonDelete";
import "./styles/style.css";
import { Link } from "react-router-dom";

const Person = () => {
    const [modalType, setModalType] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const handleOpenModal = (type, person = null) => {
        setModalType(type);
        setSelectedPerson(person);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedPerson(null);
    };

    return (
        <div className="person-page">
            <div className="header-container">
                <h1 className="header-title">Person Management</h1>
                <Link to="/menu" className="back-to-menu-link">
                    Back to Menu
                </Link>
            </div>
            <button
                onClick={() => handleOpenModal("create")}
                disabled={localStorage.getItem("Role") === "ADMIN"}
                className="create-button"
            >
                Create Person
            </button>
            <PersonTable
                onEdit={(person) => handleOpenModal("update", person)}
                onDelete={(person) => handleOpenModal("delete", person)}
            />
            {modalType === "create" && <PersonCreate onClose={handleCloseModal} />}
            {modalType === "update" && (
                <PersonUpdate onClose={handleCloseModal} person={selectedPerson} />
            )}
            {modalType === "delete" && (
                <PersonDelete onClose={handleCloseModal} person={selectedPerson} />
            )}
        </div>
    );
};

export default Person;
