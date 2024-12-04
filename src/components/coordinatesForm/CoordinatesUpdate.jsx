import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const CoordinatesUpdate = ({ onClose, coordinate }) => {
    const [form, setForm] = useState({
        id: coordinate?.id || "",
        x: coordinate?.x || "",
        y: coordinate?.y || "",
        updateable: coordinate?.updateable || false,
    });
    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isOwned, setIsOwned] = useState(false);
    const [isLoadingOwnership, setIsLoadingOwnership] = useState(true); // Новое состояние

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
                    setErrors("Failed to fetch your coordinates.");
                }
            } catch (error) {
                setErrors("Error checking ownership. Please try again later.");
            } finally {
                setIsLoadingOwnership(false); // Завершение загрузки
            }
        };

        checkOwnership();
    }, [coordinate]);

    useEffect(() => {
        if (coordinate) {
            setForm({
                id: coordinate.id,
                x: coordinate.x,
                y: coordinate.y,
                updateable: coordinate.updateable,
            });
        }
    }, [coordinate]);

    const validateForm = () => {
        const newErrors = {};
        if (form.x.length === 0 && isNaN(form.x)) {
            newErrors.x = "X must be a number or null.";
        }

        if (form.y === "" || form.y === null) {
            newErrors.y = "Y is required.";
        } else if (form.y > 540) {
            newErrors.y = "Y must not exceed 540.";
        } else if (isNaN(form.y)) {
            newErrors.y = "Y must be a valid number.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isOwned && localStorage.getItem("Role") !== "ADMIN") {
            setErrors("You can only update your own coordinates.");
            return;
        }

        const url = `http://localhost:${PORT}/api/v1/coordinates`;
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
            setResponseMessage("Coordinates updated successfully!");
            setIsSuccess(true);
        } else {
            setResponseMessage("Error updating coordinates. Please try again.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="modal">
            <h2>Update Coordinates</h2>
            {isLoadingOwnership ? (
                <p>Loading ownership information...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>ID:</label>
                    <input type="text" value={form.id} disabled />

                    <label>X:</label>
                    <input
                        type="number"
                        value={form.x}
                        onChange={(e) => setForm({ ...form, x: parseFloat(e.target.value) })}
                        disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                    />
                    {errors.x && <p className="error-message">{errors.x}</p>}

                    <label>Y:</label>
                    <input
                        type="number"
                        value={form.y}
                        onChange={(e) => setForm({ ...form, y: parseInt(e.target.value) })}
                        disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                    />
                    {errors.y && <p className="error-message">{errors.y}</p>}

                    <label>
                        Updateable:
                        <input
                            type="checkbox"
                            checked={form.updateable}
                            onChange={(e) =>
                                setForm({ ...form, updateable: e.target.checked })
                            }
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

export default CoordinatesUpdate;
