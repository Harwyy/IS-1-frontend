import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const CoordinatesDelete = ({ onClose, coordinate }) => {
    const [isOwned, setIsOwned] = useState(false);
    const [isLoadingOwnership, setIsLoadingOwnership] = useState(true);
    const [isUsedInLabWork, setIsUsedInLabWork] = useState(false);
    const [isLoadingLabWorks, setIsLoadingLabWorks] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/v1/coordinates/my`, {
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
                setIsLoadingOwnership(false);
            }
        };

        const checkLabWorkUsage = async () => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/v1/labworks/my`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": localStorage.getItem("Authorization"),
                        },
                    });

                if (response.ok) {
                    const labWorks = await response.json();
                    const isCoordinateUsed = labWorks.some((lw) => lw.coordinates.id === coordinate.id
                    );

                    setIsUsedInLabWork(isCoordinateUsed);
                } else {
                    setErrorMessage("Failed to fetch your lab works.");
                }
            } catch (error) {
                alert(error)
                setErrorMessage("Error checking lab work usage. Please try again later.");
            } finally {
                setIsLoadingLabWorks(false);
            }
        };

        checkOwnership();
        checkLabWorkUsage();
    }, [coordinate]);

    const handleDelete = async () => {
        if (!isOwned) {
            setErrorMessage("You can only delete your own coordinates.");
            return;
        }

        if (isUsedInLabWork) {
            setErrorMessage(
                "You cannot delete this coordinate because it is used in one of your lab works."
            );
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

            {isLoadingOwnership || isLoadingLabWorks ? (
                <p>Loading ownership and lab work usage information...</p>
            ) : (
                <>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    {!isOwned ? (
                        <p className="error" style={{ marginTop: "15px" }}>
                            You are not the owner of this object. You can't delete it.
                        </p>
                    ) : isUsedInLabWork ? (
                        <p className="error" style={{ marginTop: "15px" }}>
                            You cannot delete this coordinate because it is used in one of your lab works.
                        </p>
                    ) : (
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
