import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const LabWorkTable = ({ onEdit, onDelete }) => {
    const [labWorks, setLabWorks] = useState([]);
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState("id");
    const [direction, setDirection] = useState("asc");
    const [size, setSize] = useState(5);
    const [searchName, setSearchName] = useState("");
    const [searchDescription, setSearchDescription] = useState("");
    const [searchId, setSearchId] = useState("");  // Search term for ID
    const [foundLabWork, setFoundLabWork] = useState(null); // To store the result of the ID search
    const [showDialog, setShowDialog] = useState(false); // To control dialog visibility

    const handleSearchIdChange = (e) => {
        setSearchId(e.target.value);
    };

    const handleSearchById = async () => {
        if (searchId) {
            const url = `http://localhost:${PORT}/api/v1/labworks/${searchId}`;
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
                setFoundLabWork(data);
            } else {
                setFoundLabWork(null);
            }
            setShowDialog(true);
        }
    };

    const closeDialog = () => {
        setShowDialog(false);
        setSearchId("");
    };


    useEffect(() => {
        fetchLabWorks();
        const interval = setInterval(() => {
            fetchLabWorks();
        }, 1000);
        return () => clearInterval(interval);
    }, [page, sortBy, direction, size, searchName, searchDescription]);

    const fetchLabWorks = async () => {
        const url = `http://localhost:${PORT}/api/v1/labworks?sortBy=${sortBy}&direction=${direction}&page=${page}&size=${size}&nameContains=${searchName}&descriptionContains=${searchDescription}`;
        const token = localStorage.getItem("Authorization");
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await response.json();
        setLabWorks(data);
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

    const handleSearchNameChange = (e) => {
        setSearchName(e.target.value);
        setPage(0);
    };

    const handleSearchDescriptionChange = (e) => {
        setSearchDescription(e.target.value);
        setPage(0);
    };

    const handleDescriptionClick = (description) => {
        const customAlert = document.createElement('div');
        customAlert.innerText = description + "\n";
        customAlert.style.position = 'fixed';
        customAlert.style.top = '50%';
        customAlert.style.left = '50%';
        customAlert.style.transform = 'translate(-50%, -50%)';
        customAlert.style.backgroundColor = '#fff';
        customAlert.style.padding = '20px';
        customAlert.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        customAlert.style.borderRadius = '8px';
        customAlert.style.zIndex = '1000';
        customAlert.style.maxWidth = '15%';
        customAlert.style.maxHeight = '80%';
        customAlert.style.overflowY = 'auto';

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.backgroundColor = '#dc3545';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.padding = '10px 20px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.borderRadius = '5px';
        closeButton.style.marginTop = '10px';

        closeButton.onclick = () => {
            document.body.removeChild(customAlert);
        };

        customAlert.appendChild(closeButton);
        document.body.appendChild(customAlert);
    };

    return (
        <div className="labwork-table">
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
                <label className="control-search-label">
                    Search by Name:
                    <input
                        type="text"
                        className="search-input"
                        value={searchName}
                        onChange={handleSearchNameChange}
                        placeholder="Enter name to search..."
                    />
                </label>
                <label className="control-search-label">
                    Search by Description:
                    <input
                        type="text"
                        className="search-input"
                        value={searchDescription}
                        onChange={handleSearchDescriptionChange}
                        placeholder="Enter description to search..."
                    />
                </label>
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
                        style={{ marginLeft: "10px", marginRight: "10px" }}
                        type="text"
                        className="search-input"
                        value={searchId}
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
                    <th onClick={() => handleSort("description")}>
                        Description {sortBy === "description" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("createdAt")}>
                        Created At {sortBy === "createdAt" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("difficulty")}>
                        Difficulty {sortBy === "difficulty" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("minimalPoint")}>
                        Minimal Point {sortBy === "minimalPoint" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("discipline")}>
                        Discipline ID {sortBy === "discipline" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("coordinates")}>
                        Coordinates ID {sortBy === "coordinates" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("author")}>
                        Author ID {sortBy === "author" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {labWorks.length > 0 ? (
                    labWorks.map((labWork) => (
                        <tr key={labWork.id}>
                            <td>{labWork.id}</td>
                            <td>{labWork.name}</td>
                            <td>
                                {labWork.description.length > 10 ? (
                                    <span onClick={() => handleDescriptionClick(labWork.description)}>
                                        {labWork.description.slice(0, 10)}... (Read More)
                                    </span>
                                ) : (
                                    labWork.description
                                )}
                            </td>
                            <td>{new Date(labWork.createdAt).toLocaleString()}</td>
                            <td>{labWork.difficulty === "NONE" ? "N/A" : labWork.difficulty}</td>
                            <td>{labWork.minimalPoint}</td>
                            <td>{labWork.discipline ? labWork.discipline.id : "N/A"}</td>
                            <td>{labWork.coordinates ? labWork.coordinates.id : "N/A"}</td>
                            <td>{labWork.author ? labWork.author.id : "N/A"}</td>
                            <td>
                                <button
                                    className="update-delete-button"
                                    disabled={!labWork.updateable && localStorage.getItem("Role") === "ADMIN"}
                                    onClick={() => onEdit(labWork)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="update-delete-button"
                                    disabled={localStorage.getItem("Role") === "ADMIN"}
                                    onClick={() => onDelete(labWork)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9">
                            <div style={{ textAlign: "center", padding: "20px" }}>
                                <h3 style={{ color: "#dc3545", fontSize: "18px", fontWeight: "bold" }}>
                                    No lab works found.
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
                    {Array.from({ length: Math.ceil(labWorks.length / size) }, (_, index) => (
                        <button key={index} style={{ backgroundColor: "white", color: "black", pointerEvents: "none" }}>
                            {page + 1}
                        </button>
                    ))}
                </span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={labWorks.length === 0 || labWorks.length < size}
                >
                    Next
                </button>
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
                            {foundLabWork ? (
                                <div>
                                    <h2
                                        style={{
                                            fontSize: "24px",
                                            marginBottom: "15px",
                                            color: "#333",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Lab Work Found
                                    </h2>
                                    <div style={{fontSize: "16px", lineHeight: "1.6"}}>
                                        <p><strong>ID:</strong> {foundLabWork.id || "N/A"}</p>
                                        <p><strong>Name:</strong> {foundLabWork.name || "N/A"}</p>
                                        <strong>Description:</strong>
                                        <div style={{maxHeight: "100px", overflowY: "auto", border: "1px solid black"}}>
                                            <p style={{whiteSpace: "pre-wrap", wordBreak: "break-word"}}>
                                                {foundLabWork.description || "N/A"}
                                            </p>
                                        </div>
                                        <p><strong>Created At:</strong> {foundLabWork.createdAt || "N/A"}</p>
                                        <p><strong>Difficulty:</strong> {foundLabWork.difficulty || "N/A"}</p>
                                        <p><strong>Minimal Point:</strong> {foundLabWork.minimalPoint || "N/A"}</p>
                                        <p><strong>Discipline</strong></p>
                                        <p> ------- Discipline ID: {foundLabWork.discipline?.id || "N/A"}</p>
                                        <p> ------- Name: {foundLabWork.discipline?.name || "N/A"}</p>
                                        <p> ------- Lecture Hours: {foundLabWork.discipline?.lectureHours || "N/A"}</p>
                                        <p> ------- Practice
                                            Hours: {foundLabWork.discipline?.practiceHours || "N/A"}</p>
                                        <p> ------- Self Study
                                            Hours: {foundLabWork.discipline?.selfStudyHours || "N/A"}</p>
                                        <p> ------- Labs Count: {foundLabWork.discipline?.labsCount || "N/A"}</p>
                                        <p><strong>Coordinates</strong></p>
                                        <p> ------- Coordinates ID: {foundLabWork.coordinates?.id || "N/A"}</p>
                                        <p> ------- X: {foundLabWork.coordinates?.x || "N/A"}</p>
                                        <p> ------- Y: {foundLabWork.coordinates?.y || "N/A"}</p>
                                        <p><strong>Author</strong></p>
                                        <p> ------- Author ID: {foundLabWork.author?.id || "N/A"}</p>
                                        <p> ------- Name: {foundLabWork.author?.name || "N/A"}</p>
                                        <p> ------- Color: {foundLabWork.author?.color || "N/A"}</p>
                                        <p> ------- Hair Color: {foundLabWork.author?.hairColor || "N/A"}</p>
                                        <p> ------- Weight: {foundLabWork.author?.weight || "N/A"}</p>
                                        <p> ------- Nationality: {foundLabWork.author?.nationality || "N/A"}</p>
                                        <p> ------- Location ID: {foundLabWork.author?.location?.id || "N/A"}</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2
                                        style={{
                                            fontSize: "24px",
                                            marginBottom: "15px",
                                            color: "#dc3545",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Lab Work Not Found
                                    </h2>
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            color: "#dc3545",
                                            fontWeight: "500",
                                            marginTop: "10px",
                                        }}
                                    >
                                        The lab work with the provided ID does not exist.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LabWorkTable;
