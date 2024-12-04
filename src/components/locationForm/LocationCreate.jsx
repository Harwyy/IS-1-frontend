import React, { useState } from "react";
import { PORT } from "../../config/config";

const LocationCreate = ({ onClose }) => {
    const [form, setForm] = useState({
        name: "",
        coordinateX: "",
        coordinateY: "",
        coordinateZ: null,
        updateable: false,
    });
    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

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
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const url = `http://localhost:${PORT}/api/v1/locations`;
        const token = localStorage.getItem("Authorization");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            setResponseMessage("Location created successfully!");
            setIsSuccess(true);
            setForm({ name: "", coordinateX: "", coordinateY: "", coordinateZ: null, updateable: false });
        } else {
            setResponseMessage("Error creating location. Please try again.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="modal">
            <h2>Create Location</h2>
            <form onSubmit={handleSubmit}>
                <label>Name (required):</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}

                <label>Coordinate X (optional):</label>
                <input
                    type="number"
                    value={form.coordinateX === null ? "" : form.coordinateX}
                    onChange={(e) =>
                        setForm({ ...form, coordinateX: e.target.value === "" ? null : parseFloat(e.target.value) })
                    }
                />
                {errors.coordinateX && <p className="error-message">{errors.coordinateX}</p>}

                <label>Coordinate Y (required):</label>
                <input
                    type="number"
                    value={form.coordinateY}
                    onChange={(e) =>
                        setForm({ ...form, coordinateY: parseFloat(e.target.value) || "" })
                    }
                />
                {errors.coordinateY && <p className="error-message">{errors.coordinateY}</p>}

                <label>Coordinate Z (optional):</label>
                <input
                    type="number"
                    value={form.coordinateZ === null ? "" : form.coordinateZ}
                    onChange={(e) =>
                        setForm({ ...form, coordinateZ: e.target.value === "" ? null : parseInt(e.target.value) })
                    }
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
                    />
                </label>
                {responseMessage && (
                    <div className={`response-message ${isSuccess ? "success" : "error"}`}>
                        {responseMessage}
                    </div>
                )}
                <button type="submit">Create</button>
                <button type="button" className="cancel-button" onClick={onClose}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default LocationCreate;
