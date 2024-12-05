import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const DisciplineUpdate = ({ onClose, discipline }) => {
    const [form, setForm] = useState({
        id: discipline?.id || "",
        name: discipline?.name || "",
        lectureHours: discipline?.lectureHours || "",
        practiceHours: discipline?.practiceHours || "",
        selfStudyHours: discipline?.selfStudyHours || "",
        labsCount: discipline?.labsCount || "",
        updateable: discipline?.updateable || false,
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
                    `http://localhost:${PORT}/api/v1/disciplines/my`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("Authorization"),
                        },
                    });

                if (response.ok) {
                    const disciplines = await response.json();
                    const disciplineExists = disciplines.some(
                        (disc) => disc.id === discipline.id
                    );

                    setIsOwned(disciplineExists);
                } else {
                    setErrors("Failed to fetch your disciplines.");
                }
            } catch (error) {
                setErrors("Error checking ownership. Please try again later.");
            } finally {
                setIsLoadingOwnership(false);
            }
        };

        checkOwnership();
    }, [discipline]);

    useEffect(() => {
        if (discipline) {
            setForm({
                id: discipline.id,
                name: discipline.name,
                lectureHours: discipline.lectureHours,
                practiceHours: discipline.practiceHours,
                selfStudyHours: discipline.selfStudyHours,
                labsCount: discipline.labsCount,
                updateable: discipline.updateable,
            });
        }
    }, [discipline]);

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Name is required.";
        }

        if (!form.lectureHours || isNaN(form.lectureHours) || form.lectureHours < 1) {
            newErrors.lectureHours = "Lecture hours must be a positive number.";
        }

        if (form.practiceHours !== "" && (isNaN(form.practiceHours) || form.practiceHours < 1)) {
            newErrors.practiceHours = "Practice hours must be a positive number.";
        }

        if (!form.selfStudyHours || isNaN(form.selfStudyHours) || form.selfStudyHours < 1) {
            newErrors.selfStudyHours = "Self-study hours must be a positive number.";
        }

        if (form.labsCount !== "" && (isNaN(form.labsCount) || form.labsCount < 1)) {
            newErrors.labsCount = "Labs count must be a positive number.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isOwned && localStorage.getItem("Role") !== "ADMIN") {
            setErrors("You can only update your own disciplines.");
            return;
        }

        const url = `http://localhost:${PORT}/api/v1/disciplines`;
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
            setResponseMessage("Discipline updated successfully!");
            setIsSuccess(true);
        } else {
            setResponseMessage("Error updating discipline. Please try again.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="modal">
            <h2>Update Discipline</h2>
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

                    <label>Lecture Hours:</label>
                    <input
                        type="number"
                        value={form.lectureHours}
                        onChange={(e) =>
                            setForm({ ...form, lectureHours: e.target.value })
                        }
                        disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                    />
                    {errors.lectureHours && <p className="error-message">{errors.lectureHours}</p>}

                    <label>Practice Hours:</label>
                    <input
                        type="number"
                        value={form.practiceHours}
                        onChange={(e) =>
                            setForm({ ...form, practiceHours: e.target.value })
                        }
                        disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                    />
                    {errors.practiceHours && <p className="error-message">{errors.practiceHours}</p>}

                    <label>Self-Study Hours:</label>
                    <input
                        type="number"
                        value={form.selfStudyHours}
                        onChange={(e) =>
                            setForm({ ...form, selfStudyHours: e.target.value })
                        }
                        disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                    />
                    {errors.selfStudyHours && <p className="error-message">{errors.selfStudyHours}</p>}

                    <label>Labs Count:</label>
                    <input
                        type="number"
                        value={form.labsCount}
                        onChange={(e) =>
                            setForm({ ...form, labsCount: e.target.value })
                        }
                        disabled={!isOwned && localStorage.getItem("Role") !== "ADMIN"}
                    />
                    {errors.labsCount && <p className="error-message">{errors.labsCount}</p>}

                    <label>
                        Updateable:
                        <input
                            type="checkbox"
                            checked={form.updateable}
                            onChange={(e) =>
                                setForm({ ...form, updateable: e.target.checked })
                            }
                            disabled={localStorage.getItem("Role") == "ADMIN"}
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

export default DisciplineUpdate;
