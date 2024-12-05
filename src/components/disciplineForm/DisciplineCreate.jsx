import React, { useState } from "react";
import { PORT } from "../../config/config";

const DisciplineCreate = ({ onClose }) => {
    const [form, setForm] = useState({
        name: "",
        lectureHours: "",
        practiceHours: "",
        selfStudyHours: "",
        labsCount: "",
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
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const url = `http://localhost:${PORT}/api/v1/disciplines`;
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
            setResponseMessage("Discipline created successfully!");
            setIsSuccess(true);
            setForm({
                name: "",
                lectureHours: "",
                practiceHours: "",
                selfStudyHours: "",
                labsCount: "",
                updateable: false,
            });
        } else {
            setResponseMessage("Error creating discipline. Please try again.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="modal">
            <h2>Create Discipline</h2>
            <form onSubmit={handleSubmit}>
                <label>Name (required):</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}

                <label>Lecture Hours (required):</label>
                <input
                    type="number"
                    value={form.lectureHours}
                    onChange={(e) =>
                        setForm({ ...form, lectureHours: e.target.value })
                    }
                />
                {errors.lectureHours && <p className="error-message">{errors.lectureHours}</p>}

                <label>Practice Hours (optional):</label>
                <input
                    type="number"
                    value={form.practiceHours}
                    onChange={(e) =>
                        setForm({ ...form, practiceHours: e.target.value })
                    }
                />
                {errors.practiceHours && <p className="error-message">{errors.practiceHours}</p>}

                <label>Self-Study Hours (required):</label>
                <input
                    type="number"
                    value={form.selfStudyHours}
                    onChange={(e) =>
                        setForm({ ...form, selfStudyHours: e.target.value })
                    }
                />
                {errors.selfStudyHours && <p className="error-message">{errors.selfStudyHours}</p>}

                <label>Labs Count (optional):</label>
                <input
                    type="number"
                    value={form.labsCount}
                    onChange={(e) =>
                        setForm({ ...form, labsCount: e.target.value })
                    }
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

export default DisciplineCreate;
