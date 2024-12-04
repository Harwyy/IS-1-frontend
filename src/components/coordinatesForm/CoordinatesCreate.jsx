import React, { useState } from "react";
import {PORT} from "../../config/config";

const CoordinatesCreate = ({ onClose }) => {
    const [form, setForm] = useState({ x: "", y: "", updateable: false });
    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (form.x !== null && isNaN(form.x)) {
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
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const url = `http://localhost:${PORT}/api/v1/coordinates`;
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
            setResponseMessage("Coordinates created successfully!");
            setIsSuccess(true);
        } else {
            setResponseMessage("Error creating coordinates. Please try again.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="modal">
            <h2>Create Coordinates</h2>
            <form onSubmit={handleSubmit}>
                <label>X (optional):</label>
                <input
                    type="number"
                    value={form.x === null ? "" : form.x}
                    onChange={(e) =>
                        setForm({ ...form, x: e.target.value === "" ? null : parseFloat(e.target.value) })
                    }
                />
                {errors.x && <p className="error-message">{errors.x}</p>}

                <label>Y (required, max 540):</label>
                <input
                    type="number"
                    value={form.y}
                    onChange={(e) => setForm({ ...form, y: parseInt(e.target.value) || "" })}
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

export default CoordinatesCreate;
