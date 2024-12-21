import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";
import LocationCreate from "../locationForm/LocationCreate";

const PersonCreate = ({ onClose }) => {
    const [form, setForm] = useState({
        name: "",
        color: "NONE",
        hairColor: "BLACK",
        locationId: null,
        weight: null,
        nationality: "RUSSIA",
        updateable: false,
    });
    const [locations, setLocations] = useState([]);
    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    useEffect(() => {
        if (!showLocationModal) {
            fetchLocations();
        }
    }, [showLocationModal, form.locationId]);

    const fetchLocations = async () => {
        const url = `http://localhost:${PORT}/api/v1/locations/my`;
        const token = localStorage.getItem("Authorization");
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLocations(data);
            } else {
                console.error("Failed to fetch locations.");
            }
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    const handleLocationCreated = (newLocation) => {
        setLocations((prev) => [...prev, newLocation]);
        setForm((prev) => ({ ...prev, locationId: newLocation.id }));
        setShowLocationModal(false); // Закрываем модальное окно
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.name.trim()) {
            newErrors.name = "Name is required.";
        }
        if (form.weight !== null && (isNaN(form.weight) || form.weight <= 0)) {
            newErrors.weight = "Weight must be a positive number or null.";
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

        const url = `http://localhost:${PORT}/api/v1/person`;
        const token = localStorage.getItem("Authorization");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                ...form,
                location: form.locationId ? { id: form.locationId } : null,
            }),
        });

        if (response.ok) {
            setResponseMessage("Person created successfully!");
            setIsSuccess(true);
            setForm({
                name: "",
                color: "NONE",
                hairColor: "BLACK",
                locationId: null,
                weight: null,
                nationality: "RUSSIA",
                updateable: false,
            });
        } else {
            setResponseMessage("Error creating person. Please try again.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="modal">
            <h2>Create Person</h2>
            <form onSubmit={handleSubmit}>
                <label>Name (required):</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}

                <label>Color (optional):</label>
                <select
                    className="enum"
                    value={form.color}
                    onChange={(e) => setForm({...form, color: e.target.value})}
                >
                    <option value="NONE">Select Color</option>
                    <option value="GREEN">Green</option>
                    <option value="BLACK">Black</option>
                    <option value="BLUE">Blue</option>
                </select>

                <label>Hair Color (required):</label>
                <select
                    className="enum"
                    value={form.hairColor}
                    onChange={(e) => setForm({...form, hairColor: e.target.value})}
                >
                    <option value="GREEN">Green</option>
                    <option value="BLACK">Black</option>
                    <option value="BLUE">Blue</option>
                </select>

                <label>Location (optional):</label>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <select
                        className="enum"
                        style={{
                            flex: "1",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #94a8b3",
                            fontSize: "14px",
                        }}
                        value={form.locationId || ""}
                        onChange={(e) =>
                            setForm({...form, locationId: e.target.value || null})
                        }
                    >
                        <option value="">Select Location</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                                Location ID: {loc.id} - {loc.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        className="button-for-list"
                        onClick={() => setShowLocationModal(true)}
                        title="Create New Location"

                    >
                        +
                    </button>
                </div>

                <label>Nationality (required):</label>
                <select
                    className="enum"
                    value={form.nationality}
                    onChange={(e) => setForm({...form, nationality: e.target.value})}
                >
                    <option value="RUSSIA">Russia</option>
                    <option value="USA">USA</option>
                    <option value="THAILAND">Thailand</option>
                </select>

                <label>Weight (optional):</label>
                <input
                    type="number"
                    value={form.weight === null ? "" : form.weight}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            weight: e.target.value === "" ? null : parseInt(e.target.value),
                        })
                    }
                />
                {errors.weight && <p className="error-message">{errors.weight}</p>}

                <label>
                    Updateable:
                    <input
                        type="checkbox"
                        checked={form.updateable}
                        onChange={(e) => setForm({...form, updateable: e.target.checked})}
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

            {showLocationModal && (
                <LocationCreate
                    onClose={() => setShowLocationModal(false)}
                    onCreate={handleLocationCreated}
                />
            )}
        </div>
    );
};

export default PersonCreate;
