import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const CoordinatesDelete = ({ onClose, coordinate }) => {
    const [isOwned, setIsOwned] = useState(false);
    const [isLoadingOwnership, setIsLoadingOwnership] = useState(true); // Добавлено новое состояние
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await fetch(`http://localhost:${PORT}/api/v1/coordinates/my`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("Authorization"),
                    },
                });

                if (response.ok) {
                    const coordinates = await response.json();
                    const coordinateExists = coordinates.some(
                        (coord) => coord.id === coordinate.id
                    );

                    setIsOwned(coordinateExists);
                } else {
                    setErrorMessage("Failed to fetch your coordinates.");
                }
            } catch (error) {
                setErrorMessage("Error checking ownership. Please try again later.");
            } finally {
                setIsLoadingOwnership(false); // Завершение проверки
            }
        };

        checkOwnership();
    }, [coordinate]);

    const handleDelete = async () => {
        if (!isOwned) {
            setErrorMessage("You can only delete your own coordinates.");
            return;
        }

        try {
            await fetch(`http://localhost:${PORT}/api/v1/coordinates/${coordinate.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("Authorization"),
                },
            });

            onClose();
        } catch (error) {
            setErrorMessage("Error deleting the coordinate. Please try again.");
        }
    };

    return (
        <div className="modal">
            <h2>Delete Coordinates</h2>

            {isLoadingOwnership ? (
                <p>Loading ownership information...</p>
            ) : (
                <>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    {isOwned ? (
                        <>
                            <p>Are you sure you want to delete the coordinate with ID {coordinate.id}?</p>
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

export default CoordinatesDelete;
