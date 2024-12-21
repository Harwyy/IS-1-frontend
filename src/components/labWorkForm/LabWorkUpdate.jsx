import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";
import DisciplineCreate from "../disciplineForm/DisciplineCreate";
import PersonCreate from "../personForm/PersonCreate";
import CoordinatesCreate from "../coordinatesForm/CoordinatesCreate";

const LabWorkUpdate = ({ onClose, labWork }) => {
    const [form, setForm] = useState({
        id: labWork?.id || "",
        name: labWork?.name || "",
        description: labWork?.description || "",
        difficulty: labWork?.difficulty || "NONE",
        minimalPoint: labWork?.minimalPoint || null,
        creationDate: labWork?.creationDate || new Date().toISOString(),
        authorId: labWork?.author?.id || null,
        disciplineId: labWork?.discipline?.id || null,
        coordinatesId: labWork?.coordinates?.id || null,
        updateable: labWork?.updateable || false,
    });

    const [disciplines, setDisciplines] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [coordinates, setCoordinates] = useState([]);
    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [showDisciplineModal, setShowDisciplineModal] = useState(false);
    const [showAuthorModal, setShowAuthorModal] = useState(false);
    const [showCoordinatesModal, setShowCoordinatesModal] = useState(false);
    const [isOwned, setIsOwned] = useState(false);
    const [isLoadingOwnership, setIsLoadingOwnership] = useState(true);

    const userRole = localStorage.getItem("Role");

    useEffect(() => {
        if (!showDisciplineModal) fetchDisciplines();
        if (!showAuthorModal) fetchAuthors();
        if (!showCoordinatesModal) fetchCoordinates();
    }, [showDisciplineModal, showAuthorModal, showCoordinatesModal]);

    const fetchDisciplines = async () => {
        const url = `http://localhost:${PORT}/api/v1/disciplines/my`;
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
                setDisciplines(data);
            } else {
                console.error("Failed to fetch disciplines.");
            }
        } catch (error) {
            console.error("Error fetching disciplines:", error);
        }
    };

    const fetchAuthors = async () => {
        const url = `http://localhost:${PORT}/api/v1/person/my`;
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
                setAuthors(data);
            } else {
                console.error("Failed to fetch authors.");
            }
        } catch (error) {
            console.error("Error fetching authors:", error);
        }
    };

    const fetchCoordinates = async () => {
        const url = `http://localhost:${PORT}/api/v1/coordinates/my`;
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
                setCoordinates(data);
            } else {
                console.error("Failed to fetch coordinates.");
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
    };

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/v1/labworks/my`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("Authorization"),
                        },
                    }
                );

                if (response.ok) {
                    const labworks = await response.json();
                    const isPersonOwned = labworks.some((p) => p.id === labWork.id);
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
    },[labWork]);

    const validateForm = () => {
        const newErrors = {};
        if (!form.name.trim()) {
            newErrors.name = "Name is required.";
        }
        if (!form.description.trim()) {
            newErrors.description = "Description is required.";
        }
        if (form.description.length >= 1800) {
            newErrors.description = "Description should contain less than 1800 characters.";
        }
        if ((form.minimalPoint !== null && (isNaN(form.minimalPoint) || form.minimalPoint <= 0)) || form.minimalPoint === null) {
            newErrors.minimalPoint = "Minimal Point must be a non-negative number.";
        }
        if (!form.coordinatesId) {
            newErrors.coordinatesId = "Coordinates must be selected.";
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

        const url = `http://localhost:${PORT}/api/v1/labworks`;
        const token = localStorage.getItem("Authorization");

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                ...form,
                discipline: form.disciplineId ? { id: form.disciplineId } : null,
                author: form.authorId ? { id: form.authorId } : null,
                coordinates: form.coordinatesId ? { id: form.coordinatesId } : null,
            }),
        });

        console.log(JSON.stringify({
            ...form,
            discipline: form.disciplineId ? { id: form.disciplineId } : null,
            author: form.authorId ? { id: form.authorId } : null,
            coordinates: form.coordinatesId ? { id: form.coordinatesId } : null,
        }))
        if (response.ok) {
            setResponseMessage("LabWork updated successfully!");
            setIsSuccess(true);
        } else {
            setResponseMessage("Error updating LabWork. Please try again.");
            setIsSuccess(false);
        }
    };

    const handleCoordinatesCreated = (newCoordinates) => {
        setCoordinates((prev) => [...prev, newCoordinates]);
        setForm((prev) => ({...prev, coordinatesId: newCoordinates.id}));
        setShowCoordinatesModal(false);
    };

    const handleDisciplineCreated = (newDiscipline) => {
        setDisciplines((prev) => [...prev, newDiscipline]);
        setForm((prev) => ({ ...prev, disciplineId: newDiscipline.id }));
        setShowDisciplineModal(false);
    };

    const handleAuthorCreated = (newAuthor) => {
        setAuthors((prev) => [...prev, newAuthor]);
        setForm((prev) => ({ ...prev, authorId: newAuthor.id }));
        setShowAuthorModal(false);
    };

    return (
        <div className="modal">
            <h2>Update LabWork</h2>
            {isLoadingOwnership ? (
                    <p>Loading ownership information...</p>
                ) : (
                <form onSubmit={handleSubmit}>
                    <label>Name (required):</label>
                    <input
                        disabled={!isOwned && userRole !== "ADMIN"}
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}

                    <label>Description (required):</label>
                    <textarea
                        disabled={!isOwned && userRole !== "ADMIN"}
                        style={{
                            borderColor: "#94a8b3",
                            borderRadius: "5px",
                            resize: "vertical",
                            maxHeight: "150px",
                            padding: "10px"
                        }}
                        value={form.description}
                        onChange={(e) =>
                            setForm({...form, description: e.target.value})
                        }
                    />
                    {errors.description && <p className="error-message">{errors.description}</p>}

                    <label>Difficulty (optional):</label>
                    <select
                        className="enum"
                        disabled={!isOwned && userRole !== "ADMIN"}
                        value={form.difficulty}
                        onChange={(e) => setForm({...form, difficulty: e.target.value})}
                    >
                        <option value="NONE">Select Difficulty</option>
                        <option value="EASY">Easy</option>
                        <option value="NORMAL">Normal</option>
                        <option value="HARD">Hard</option>
                        <option value="TERRIBLE">Terrible</option>
                    </select>

                    <label>Discipline (optional):</label>
                    <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                        <select
                            disabled={(!isOwned && userRole !== "ADMIN") || userRole === "ADMIN"}
                            className="enum"
                            value={form.disciplineId || ""}
                            onChange={(e) =>
                                setForm({...form, disciplineId: e.target.value || null})}
                        >
                            <option value="">Select Discipline</option>
                            {disciplines.map((d) => (
                                <option key={d.id} value={d.id}>
                                    Discipline ID: {d.id} - {d.name}
                                </option>
                            ))}
                        </select>
                        <button type="button"
                                disabled={localStorage.getItem("Role") === "ADMIN"}
                                className="button-for-list"
                                onClick={() => setShowDisciplineModal(true)}
                                title="Create New Discipline"
                        >
                            +
                        </button>
                    </div>

                    <label>Author (optional):</label>
                    <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                        <select
                            disabled={(!isOwned && userRole !== "ADMIN") || userRole === "ADMIN"}
                            className="enum"
                            value={form.authorId || ""}
                            onChange={(e) =>
                                setForm({...form, authorId: e.target.value})
                            }
                        >
                            <option value="">Select Author</option>
                            {authors.map((a) => (
                                <option key={a.id} value={a.id}>
                                    Author ID: {a.id} - {a.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            disabled={localStorage.getItem("Role") === "ADMIN"}
                            className="button-for-list"
                            onClick={() => setShowAuthorModal(true)}
                            title="Create New Author"
                        >
                            +
                        </button>
                    </div>

                    <label>Coordinates (required):</label>
                    <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                        <select
                            disabled={(!isOwned && userRole !== "ADMIN") || userRole === "ADMIN"}
                            className="enum"
                            value={form.coordinatesId || ""}
                            onChange={(e) =>
                                setForm({...form, coordinatesId: e.target.value || null})
                            }
                        >
                            <option value="">Select Coordinates</option>
                            {coordinates.map((c) => (
                                <option key={c.id} value={c.id}>
                                    Coordinates ID: {c.id} - x: {c.x}; y: {c.y}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            disabled={localStorage.getItem("Role") === "ADMIN"}
                            className="button-for-list"
                            onClick={() => setShowCoordinatesModal(true)}
                            title="Create New Coordinates"
                        >
                            +
                        </button>
                    </div>

                    <label>Minimal Point (required):</label>
                    <input
                        type="number"
                        value={form.minimalPoint || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                minimalPoint: e.target.value === "" ? null : parseFloat(e.target.value),
                            })
                        }
                        disabled={!isOwned && userRole !== "ADMIN"}
                    />
                    {errors.minimalPoint && <p className="error-message">{errors.minimalPoint}</p>}

                    <label>
                        Updateable:
                        <input
                            disabled={(!isOwned && userRole !== "ADMIN") || userRole === "ADMIN"}
                            type="checkbox"
                            checked={form.updateable}
                            onChange={(e) => setForm({...form, updateable: e.target.checked})}
                        />
                    </label>
                    {(!isOwned && userRole !== "ADMIN") && (
                        <div className="error">
                            You are not the owner of this object. You can't update it.
                        </div>
                    )}

                    {responseMessage && (
                        <p className={isSuccess ? "success" : "error"}>
                            {responseMessage}
                        </p>
                    )}

                    <button type="submit" disabled={!isOwned && userRole !== "ADMIN"}>Update</button>
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
                )}

            {showDisciplineModal && (
                <DisciplineCreate
                    onClose={() => setShowDisciplineModal(false)}
                    onCreate={handleDisciplineCreated}
                />
            )}

            {showAuthorModal && (
                <PersonCreate
                    onClose={() => setShowAuthorModal(false)}
                    onCreate={handleAuthorCreated}
                />
            )}

            {showCoordinatesModal && (
                <CoordinatesCreate
                    onClose={() => setShowCoordinatesModal(false)}
                    onCreate={handleCoordinatesCreated}
                />
            )}

        </div>
    );
};

export default LabWorkUpdate;
