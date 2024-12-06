import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";
import DisciplineCreate from "../disciplineForm/DisciplineCreate";
import PersonCreate from "../personForm/PersonCreate";
import CoordinatesCreate from "../coordinatesForm/CoordinatesCreate";

const LabWorkCreate = ({ onClose }) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        difficulty: "NONE",
        minimalPoint: null,
        disciplineId: null,
        authorId: null,
        coordinatesId: null,
        updateable: false,
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

    const handleCoordinatesCreated = (newCoordinates) => {
        setCoordinates((prev) => [...prev, newCoordinates]);
        setForm((prev) => ({ ...prev, coordinatesId: newCoordinates.id }));
        setShowCoordinatesModal(false);
    };

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
            method: "POST",
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

        if (response.ok) {
            setResponseMessage("Lab work created successfully!");
            setIsSuccess(true);
            setForm({
                name: "",
                description: "",
                difficulty: "",
                minimalPoint: null,
                disciplineId: null,
                authorId: null,
                coordinatesId: null,
                updateable: false,
            });
        } else {
            setResponseMessage("Error creating lab work. Please try again.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="modal">
            <h2>Create Lab Work</h2>
            <form onSubmit={handleSubmit}>
                <label>Name (required):</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}

                <label>Description (required):</label>
                <textarea
                    style={{
                        borderColor: "#94a8b3",
                        borderRadius: "5px",
                        resize: "vertical",
                        maxHeight: "150px",
                        padding: "10px"
                    }}
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                />
                {errors.description && <p className="error-message">{errors.description}</p>}

                <label>Difficulty (optional):</label>
                <select
                    className="enum"
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
                        className="enum"
                        value={form.disciplineId || ""}
                        onChange={(e) =>
                            setForm({...form, disciplineId: e.target.value || null})
                        }
                    >
                        <option value="">Select Discipline</option>
                        {disciplines.map((discipline) => (
                            <option key={discipline.id} value={discipline.id}>
                                Discipline ID: {discipline.id} - {discipline.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
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
                        className="enum"
                        value={form.authorId || ""}
                        onChange={(e) =>
                            setForm({...form, authorId: e.target.value || null})
                        }
                    >
                        <option value="">Select Author</option>
                        {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                                Author ID: {author.id} - {author.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
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
                        className="enum"
                        value={form.coordinatesId || ""}
                        onChange={(e) =>
                            setForm({...form, coordinatesId: e.target.value || null})
                        }
                    >
                        <option value="">Select Coordinates</option>
                        {coordinates.map((coordinate) => (
                            <option key={coordinate.id} value={coordinate.id}>
                                Coordinates ID: {coordinate.id}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        className="button-for-list"
                        onClick={() => setShowCoordinatesModal(true)}
                        title="Create New Coordinates"
                    >
                        +
                    </button>
                </div>
                {errors.coordinatesId && <p className="error-message">{errors.coordinatesId}</p>}

                <label>Minimal Point (required):</label>
                <input
                    type="number"
                    value={form.minimalPoint === null ? "" : form.minimalPoint}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            minimalPoint: e.target.value === "" ? null : parseFloat(e.target.value),
                        })
                    }
                />
                {errors.minimalPoint && <p className="error-message">{errors.minimalPoint}</p>}

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

export default LabWorkCreate;
