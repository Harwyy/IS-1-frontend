import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const LabWorkDelete = ({ onClose, labWork }) => {
    const [isOwned, setIsOwned] = useState(false);
    const [isLoadingOwnership, setIsLoadingOwnership] = useState(true);
    const [isCoordinateUsed, setIsCoordinateUsed] = useState(false);
    const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/v1/labworks/my`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("Authorization"),
                        },
                    });

                if (response.ok) {
                    const labWorks = await response.json();
                    const isLabWorkOwned = labWorks.some((lw) => lw.id === labWork.id);
                    setIsOwned(isLabWorkOwned);
                } else {
                    setErrorMessage("Failed to fetch your lab works.");
                }
            } catch (error) {
                setErrorMessage("Error checking ownership. Please try again later.");
            } finally {
                setIsLoadingOwnership(false);
            }
        };

        const checkCoordinateUsage = async () => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/v1/labworks/my`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("Authorization"),
                        },
                    });

                if (response.ok) {
                    const labWorks = await response.json();
                    const isCoordinateInUse = labWorks.some((lw) => lw.coordinates.id === labWork.coordinates.id && lw.id !== labWork.id);

                    setIsCoordinateUsed(isCoordinateInUse);
                } else {
                    setErrorMessage("Failed to fetch lab works for coordinate usage.");
                }
            } catch (error) {
                setErrorMessage("Error checking coordinate usage. Please try again later.");
            } finally {
                setIsLoadingCoordinates(false);
            }
        };

        checkOwnership();
        checkCoordinateUsage();
    }, [labWork]);

    const handleDelete = async () => {
        if (!isOwned) {
            setErrorMessage("You can only delete your own lab works.");
            return;
        }

        if (isCoordinateUsed) {
            setErrorMessage("You cannot delete this lab work because its coordinate is used in another lab work.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:${PORT}/api/v1/labworks/${labWork.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("Authorization"),
                    },
                });

            if (response.ok) {
                onClose(); // Закрыть модальное окно после успешного удаления
            } else {
                setErrorMessage("Error deleting the lab work. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Error deleting the lab work. Please try again.");
        }
    };

    return (
        <div className="modal">
            <h2>Delete Lab Work</h2>

            {isLoadingOwnership || isLoadingCoordinates ? (
                <p>Loading ownership and coordinate usage information...</p>
            ) : (
                <>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    {!isOwned ? (
                        <p className="error" style={{ marginTop: "15px" }}>
                            You are not the owner of this object. You can't delete it.
                        </p>
                    ) : isCoordinateUsed ? (
                        <p className="error" style={{ marginTop: "15px" }}>
                            You cannot delete this lab work because its coordinate is used in another lab work.
                        </p>
                    ) : (
                        <>
                            <p>Are you sure you want to delete the lab work with ID {labWork.id}?</p>
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

export default LabWorkDelete;
