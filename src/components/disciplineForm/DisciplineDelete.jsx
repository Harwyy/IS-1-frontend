import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const DisciplineDelete = ({ onClose, discipline }) => {
    const [isOwned, setIsOwned] = useState(false);
    const [isLoadingOwnership, setIsLoadingOwnership] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/v1/disciplines/my`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": localStorage.getItem("Authorization"),
                        },
                    });

                if (response.ok) {
                    const disciplines = await response.json();
                    const disciplineExists = disciplines.some(
                        (disc) => disc.id === discipline.id
                    );

                    setIsOwned(disciplineExists);
                } else {
                    setErrorMessage("Failed to fetch your disciplines.");
                }
            } catch (error) {
                setErrorMessage("Error checking ownership. Please try again later.");
            } finally {
                setIsLoadingOwnership(false);
            }
        };

        checkOwnership();
    }, [discipline]);

    const handleDelete = async () => {
        if (!isOwned) {
            setErrorMessage("You can only delete your own disciplines.");
            return;
        }

        try {
            await fetch(`http://localhost:${PORT}/api/v1/disciplines/${discipline.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("Authorization"),
                },
            });

            onClose();
        } catch (error) {
            setErrorMessage("Error deleting the discipline. Please try again.");
        }
    };

    return (
        <div className="modal">
            <h2>Delete Discipline</h2>

            {isLoadingOwnership ? (
                <p>Loading ownership information...</p>
            ) : (
                <>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    {isOwned ? (
                        <>
                            <p>Are you sure you want to delete the discipline with ID {discipline.id}?</p>
                            <div className="modal-actions" style={{ marginTop: "15px" }}>
                                <button
                                    onClick={handleDelete}
                                    className="delete-button"
                                    style={{ marginRight: "20px" }}
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="error" style={{ marginTop: "15px" }}>
                            You are not the owner of this object. You can't delete it.
                        </p>
                    )}

                    <div className="modal-actions" style={{ marginTop: "15px" }}>
                        <button onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DisciplineDelete;
