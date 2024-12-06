import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const DisciplineTable = ({ onEdit, onDelete }) => {
    const [disciplines, setDisciplines] = useState([]);
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState("id");
    const [direction, setDirection] = useState("asc");
    const [size, setSize] = useState(5);
    const [searchIdTerm, setSearchIdTerm] = useState(""); // Search term for ID
    const [discipline, setDiscipline] = useState(null); // For storing the result of the ID search
    const [showDialog, setShowDialog] = useState(false); // For showing the dialog

    useEffect(() => {
        fetchDisciplines();
        const interval = setInterval(() => {
            fetchDisciplines();
        }, 1000);
        return () => clearInterval(interval);
    }, [page, sortBy, direction, size]);

    const fetchDisciplines = async () => {
        const url = `http://localhost:${PORT}/api/v1/disciplines?sortBy=${sortBy}&direction=${direction}&page=${page}&size=${size}`;
        const token = localStorage.getItem("Authorization");
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await response.json();
        setDisciplines(data);
    };

    const handleSizeChange = (e) => {
        setSize(Number(e.target.value));
        setPage(0);
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setDirection(direction === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setDirection("asc");
        }
    };

    const handleSearchIdChange = (e) => {
        setSearchIdTerm(e.target.value);
    };

    const handleSearchById = async () => {
        if (searchIdTerm) {
            const url = `http://localhost:${PORT}/api/v1/disciplines/${searchIdTerm}`;
            const token = localStorage.getItem("Authorization");
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setDiscipline(data);
            } else {
                setDiscipline(null);
            }
            setShowDialog(true);
        }
    };

    const closeDialog = () => {
        setShowDialog(false);
        setSearchIdTerm("");
    };

    return (
        <div className="discipline-table">
            <div className="controls">
                <label className="control-size-label">
                    Rows per page:
                    <select className="select-size-label" value={size} onChange={handleSizeChange}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                            <option key={number} value={number}>
                                {number}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="control-search-id-label">
                    Search by ID:
                    <input
                        type="text"
                        className="search-input"
                        value={searchIdTerm}
                        onChange={handleSearchIdChange}
                        placeholder="Enter ID to search..."
                    />
                </label>
                <button className="update-delete-button" onClick={handleSearchById} style={{ marginBottom: "20px" }}>
                    Search by ID
                </button>
            </div>
            <table>
                <thead>
                <tr>
                    <th onClick={() => handleSort("id")}>
                        ID {sortBy === "id" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("name")}>
                        Name {sortBy === "name" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("lectureHours")}>
                        Lecture Hours {sortBy === "lectureHours" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("practiceHours")}>
                        Practice Hours {sortBy === "practiceHours" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("selfStudyHours")}>
                        Self Study Hours {sortBy === "selfStudyHours" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("labsCount")}>
                        Labs Count {sortBy === "labsCount" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {disciplines.length > 0 ? (
                    disciplines.map((discipline) => (
                        <tr key={discipline.id}>
                            <td>{discipline.id}</td>
                            <td>{discipline.name}</td>
                            <td>{discipline.lectureHours}</td>
                            <td>{discipline.practiceHours}</td>
                            <td>{discipline.selfStudyHours}</td>
                            <td>{discipline.labsCount}</td>
                            <td>
                                <button
                                    className="update-delete-button"
                                    disabled={!discipline.updateable && localStorage.getItem("Role") === "ADMIN"}
                                    onClick={() => onEdit(discipline)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="update-delete-button"
                                    disabled={localStorage.getItem("Role") === "ADMIN"}
                                    onClick={() => onDelete(discipline)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7">
                            <div style={{ textAlign: "center", padding: "20px" }}>
                                <h3 style={{ color: "#dc3545", fontSize: "18px", fontWeight: "bold" }}>
                                    No disciplines found.
                                </h3>
                                <p style={{ fontSize: "14px", color: "#6c757d" }}>
                                    Try changing the page or sorting options.
                                </p>
                            </div>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 0}>
                    Previous
                </button>
                <span className="page-numbers">
                    {Array.from({ length: Math.ceil(disciplines.length / size) }, (_, index) => (
                        <button key={index} style={{ backgroundColor: "white", color: "black", pointerEvents: "none" }}>
                            {page + 1}
                        </button>
                    ))}
                </span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={disciplines.length === 0 || disciplines.length < size}
                >
                    Next
                </button>
            </div>

            {showDialog && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        animation: "fadeIn 0.3s ease-in-out",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "30px",
                            borderRadius: "10px",
                            width: "80%",
                            maxWidth: "500px",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                            position: "relative",
                            animation: "slideIn 0.3s ease-in-out",
                        }}
                    >
                        <span
                            onClick={closeDialog}
                            style={{
                                position: "absolute",
                                top: "15px",
                                right: "15px",
                                fontSize: "30px",
                                color: "#333",
                                cursor: "pointer",
                                background: "none",
                                border: "none",
                            }}
                        >
                            &times;
                        </span>
                        {discipline ? (
                            <div>
                                <h2
                                    style={{
                                        fontSize: "24px",
                                        marginBottom: "15px",
                                        color: "#333",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Discipline Found
                                </h2>
                                <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
                                    <p><strong>ID:</strong> {discipline.id}</p>
                                    <p><strong>Name:</strong> {discipline.name}</p>
                                    <p><strong>Lecture Hours:</strong> {discipline.lectureHours}</p>
                                    <p><strong>Practice Hours:</strong> {discipline.practiceHours}</p>
                                    <p><strong>Self Study Hours:</strong> {discipline.selfStudyHours}</p>
                                    <p><strong>Labs Count:</strong> {discipline.labsCount}</p>
                                </div>
                            </div>
                        ) : (
                            <h3 style={{ color: "#dc3545" }}>No discipline found with the given ID.</h3>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisciplineTable;
