import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const LocationUpdate = ({ onClose, location }) => {
    const [form, setForm] = useState({
        id: location?.id || "",
        name: location?.name || "",
        coordinateX: location?.coordinateX || "",
        coordinateY: location?.coordinateY || "",
        coordinateZ: location?.coordinateZ || null,
        updateable: location?.updateable || false,
    });
    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isOwned, setIsOwned] = useState(false);
    const [isLoadingOwnership, setIsLoadingOwnership] = useState(true);

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/v1/locations/my`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("Authorization"),
                    },
                });

                if (response.ok) {
                    const locations = await response.json();
                    const locationExists = locations.some(
                        (loc) => loc.id === location.id
                    );

                    setIsOwned(locationExists);
                } else {
                    setErrors("Failed to fetch your locations.");
                }
            } catch (error) {
                setErrors("Error checking ownership. Please try again later.");
            } finally {
                setIsLoadingOwnership(false);
            }
        };

        checkOwnership();
    }, [location]);

    useEffect(() => {
        if (location) {
            setForm({
                id: location.id,
                name: location.name,
                coordinateX: location.coordinateX,
                coordinateY: location.coordinateY,
                coordinateZ: location.coordinateZ,
                updateable: location.updateable,
            });
        }
    }, [location]);

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Name is required.";
        }

        if (form.coordinateX !== null && isNaN(form.coordinateX)) {
            newErrors.coordinateX = "Coordinate X must be a number or null.";
        }

        if (form.coordinateY === "" || form.coordinateY === null) {
            newErrors.coordinateY = "Coordinate Y is required.";
        } else if (isNaN(form.coordinateY)) {
            newErrors.coordinateY = "Coordinate Y must be a valid number.";
        }

        if (form.coordinateZ !== null && isNaN(form.coordinateZ)) {
            newErrors.coordinateZ = "Coordinate Z must be a number or null.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isOwned && localStorage.getItem("Role") !== "ADMIN") {
            setErrors("You can only update your own locations.");
            return;
        }

        const url = `http://localhost:${PORT}/api/v1/locations`;
        const token = localStorage.getItem("Authorization");

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            setResponseMessage("Location updated successfully!");
            setIsSuccess(true);
        } else {
            setResponseMessage("Error updating location. Please try again.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="modal">
            <h2>Update Location</h2>
            {isLoadingOwnership ? (
                <p>Loading ownership information...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>ID:</label>
                    <input type="text" value={form.id} disabled />

                    <label>Name:</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}

                    <label>Coordinate X:</label>
                    <input
                        type="number"
                        value={form.coordinateX === null ? "" : form.coordinateX}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                coordinateX: e.target.value === "" ? null : parseFloat(e.target.value),
                            })
                        }
                        disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                    />
                    {errors.coordinateX && <p className="error-message">{errors.coordinateX}</p>}

                    <label>Coordinate Y:</label>
                    <input
                        type="number"
                        value={form.coordinateY}
                        onChange={(e) => setForm({ ...form, coordinateY: parseFloat(e.target.value) })}
                        disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                    />
                    {errors.coordinateY && <p className="error-message">{errors.coordinateY}</p>}

                    <label>Coordinate Z:</label>
                    <input
                        type="number"
                        value={form.coordinateZ === null ? "" : form.coordinateZ}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                coordinateZ: e.target.value === "" ? null : parseFloat(e.target.value),
                            })
                        }
                        disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                    />
                    {errors.coordinateZ && <p className="error-message">{errors.coordinateZ}</p>}

                    <label>
                        Updateable:
                        <input
                            type="checkbox"
                            checked={form.updateable}
                            onChange={(e) =>
                                setForm({ ...form, updateable: e.target.checked })
                            }
                            disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                        />
                    </label>

                    {(!isOwned && localStorage.getItem("Role") !== "ADMIN") && (
                        <div className="error">
                            You are not the owner of this object. You can't update it.
                        </div>
                    )}
                    {responseMessage && (
                        <div
                            className={`response-message ${isSuccess ? "success" : "error"}`}
                        >
                            {responseMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                    >
                        Update
                    </button>
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
};

export default LocationUpdate;
