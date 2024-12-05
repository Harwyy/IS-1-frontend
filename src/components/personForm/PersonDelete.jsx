import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const PersonDelete = ({ onClose, person }) => {
    const [isOwned, setIsOwned] = useState(false);
    const [isLoadingOwnership, setIsLoadingOwnership] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/v1/person/my`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("Authorization"),
                        },
                    });

                if (response.ok) {
                    const persons = await response.json();
                    const isPersonOwned = persons.some((p) => p.id === person.id);
                    setIsOwned(isPersonOwned);
                } else {
                    setErrorMessage("Failed to fetch your persons.");
                }
            } catch (error) {
                setErrorMessage("Error checking ownership. Please try again later.");
            } finally {
                setIsLoadingOwnership(false);
            }
        };

        checkOwnership();
    }, [person]);

    const handleDelete = async () => {
        if (!isOwned) {
            setErrorMessage("You can only delete your own persons.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:${PORT}/api/v1/person/${person.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("Authorization"),
                    },
                });

            if (response.ok) {
                onClose(); // Закрыть модальное окно после успешного удаления
            } else {
                setErrorMessage("Error deleting the person. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Error deleting the person. Please try again.");
        }
    };

    return (
        <div className="modal">
            <h2>Delete Person</h2>

            {isLoadingOwnership ? (
                <p>Loading ownership information...</p>
            ) : (
                <>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    {isOwned ? (
                        <>
                            <p>Are you sure you want to delete the person with ID {person.id}?</p>
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

export default PersonDelete;
