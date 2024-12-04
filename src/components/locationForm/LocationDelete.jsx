import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const LocationDelete = ({ onClose, location }) => {
    const [isOwned, setIsOwned] = useState(false);
    const [isLoadingOwnership, setIsLoadingOwnership] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/v1/locations/my`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("Authorization"),
                    },
                });

                if (response.ok) {
                    const locations = await response.json();
                    const locationExists = locations.some(
                        (loc) => loc.id === location.id
                    );

                    setIsOwned(locationExists);
                } else {
                    setErrorMessage("Failed to fetch your locations.");
                }
            } catch (error) {
                setErrorMessage("Error checking ownership. Please try again later.");
            } finally {
                setIsLoadingOwnership(false);
            }
        };

        checkOwnership();
    }, [location]);

    const handleDelete = async () => {
        if (!isOwned) {
            setErrorMessage("You can only delete your own locations.");
            return;
        }

        try {
            await fetch(`http://localhost:${PORT}/api/v1/locations/${location.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("Authorization"),
                },
            });

            onClose();
        } catch (error) {
            setErrorMessage("Error deleting the location. Please try again.");
        }
    };

    return (
        <div className="modal">
            <h2>Delete Location</h2>

            {isLoadingOwnership ? (
                <p>Loading ownership information...</p>
            ) : (
                <>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    {isOwned ? (
                        <>
                            <p>Are you sure you want to delete the location with ID {location.id}?</p>
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

export default LocationDelete;
