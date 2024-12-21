import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";
import LocationCreate from "../locationForm/LocationCreate";

const PersonUpdate = ({ onClose, person }) => {
    const [form, setForm] = useState({
        id: person?.id || "",
        name: person?.name || "",
        color: person?.color || "NONE",
        hairColor: person?.hairColor || "BLACK",
        locationId: person?.location?.id || null,
        weight: person?.weight || null,
        nationality: person?.nationality || "RUSSIA",
        updateable: person?.updateable || false,
    });
    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [locations, setLocations] = useState([]);
    const [isOwned, setIsOwned] = useState(false);
    const [isLoadingOwnership, setIsLoadingOwnership] = useState(true);
    const [showLocationModal, setShowLocationModal] = useState(false);

    const userRole = localStorage.getItem("Role");

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/v1/locations/my`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("Authorization"),
                        },
                    }
                );

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

        fetchLocations();
    }, [showLocationModal]);

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/v1/person/my`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("Authorization"),
                        },
                    }
                );

                if (response.ok) {
                    const persons = await response.json();
                    const isPersonOwned = persons.some((p) => p.id === person.id);
                    setIsOwned(isPersonOwned);
                } else {
                    console.error("Failed to fetch person's ownership status.");
                }
            } catch (error) {
                console.error("Error checking ownership:", error);
            } finally {
                setIsLoadingOwnership(false);
            }
        };

        checkOwnership();
    }, [person]);

    const handleLocationCreated = (newLocation) => {
        setLocations((prev) => [...prev, newLocation]);
        setForm((prev) => ({ ...prev, locationId: newLocation.id }));
        setShowLocationModal(false);
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

        if (!isOwned && userRole !== "ADMIN") {
            setResponseMessage("You can only update your own persons.");
            setIsSuccess(false);
            return;
        }

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const url = `http://localhost:${PORT}/api/v1/person`;
        const token = localStorage.getItem("Authorization");

        const response = await fetch(url, {
            method: "PUT",
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
            setResponseMessage("Person updated successfully!");
            setIsSuccess(true);
        } else {
            setResponseMessage("Error updating person. Please try again.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="modal">
            <h2>Update Person</h2>
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
                        disabled={!isOwned && userRole !== "ADMIN"}
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}

                    <label>Color:</label>
                    <select
                        className="enum"
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        disabled={!isOwned && userRole !== "ADMIN"}
                    >
                        <option value="NONE">Select Color</option>
                        <option value="GREEN">Green</option>
                        <option value="BLACK">Black</option>
                        <option value="BLUE">Blue</option>
                    </select>

                    <label>Hair Color:</label>
                    <select
                        className="enum"
                        value={form.hairColor}
                        onChange={(e) => setForm({ ...form, hairColor: e.target.value })}
                        disabled={!isOwned && userRole !== "ADMIN"}
                    >
                        <option value="GREEN">Green</option>
                        <option value="BLACK">Black</option>
                        <option value="BLUE">Blue</option>
                    </select>

                    <label>Location:</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <select
                            className="enum"
                            value={form.locationId || ""}
                            onChange={(e) =>
                                setForm({ ...form, locationId: e.target.value || null })
                            }
                            disabled={(!isOwned && userRole !== "ADMIN") || userRole === "ADMIN"}
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
                            disabled={(!isOwned && userRole !== "ADMIN") || userRole === "ADMIN"}
                        >
                            +
                        </button>
                    </div>

                    <label>Weight:</label>
                    <input
                        type="number"
                        value={form.weight === null ? "" : form.weight}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                weight: e.target.value === "" ? null : parseInt(e.target.value),
                            })
                        }
                        disabled={!isOwned && userRole !== "ADMIN"}
                    />
                    {errors.weight && <p className="error-message">{errors.weight}</p>}

                    <label>Nationality:</label>
                    <select
                        className="enum"
                        value={form.nationality}
                        onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                        disabled={!isOwned && userRole !== "ADMIN"}
                    >
                        <option value="RUSSIA">Russia</option>
                        <option value="USA">USA</option>
                        <option value="THAILAND">Thailand</option>
                    </select>

                    <label>
                        Updateable:
                        <input
                            type="checkbox"
                            checked={form.updateable}
                            disabled={(!isOwned && userRole !== "ADMIN") || userRole === "ADMIN"}
                            onChange={(e) =>
                                setForm({ ...form, updateable: e.target.checked })
                            }
                        />
                    </label>
                    {(!isOwned && userRole !== "ADMIN") && (
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
                        disabled={!isOwned && userRole !== "ADMIN"}
                    >
                        Update
                    </button>
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            )}

            {showLocationModal && (
                <LocationCreate
                    onClose={() => setShowLocationModal(false)}
                    onCreate={handleLocationCreated}
                />
            )}
        </div>
    );
};

export default PersonUpdate;
