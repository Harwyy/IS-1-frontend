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

    useEffect(() => {
        fetchLabWorks();
        const interval = setInterval(() => {
            fetchLabWorks();
        }, 30000);
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
                        Discipline ID {sortBy === "discipline_id" && direction === "asc" ? "↑" : "↓"}
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
            </div>
        </div>
    );
};

export default LabWorkTable;
