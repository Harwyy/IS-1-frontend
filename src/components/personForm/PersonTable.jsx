import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const PersonTable = ({ onEdit, onDelete }) => {
    const [persons, setPersons] = useState([]);
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState("id");
    const [direction, setDirection] = useState("asc");
    const [size, setSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchId, setSearchId] = useState("");  // Search term for ID
    const [foundPerson, setFoundPerson] = useState(null); // To store the result of the ID search
    const [showDialog, setShowDialog] = useState(false); // To control dialog visibility

    const handleSearchIdChange = (e) => {
        setSearchId(e.target.value);
    };

    const handleSearchById = async () => {
        if (searchId) {
            const url = `http://localhost:${PORT}/api/v1/person/${searchId}`;
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
                setFoundPerson(data);
            } else {
                setFoundPerson(null);
            }
            setShowDialog(true);
        }
    };

    const closeDialog = () => {
        setShowDialog(false);
        setSearchId("");
    };

    useEffect(() => {
        fetchPersons();
        const interval = setInterval(() => {
            fetchPersons();
        }, 1000);
        return () => clearInterval(interval);
    }, [page, sortBy, direction, size, searchTerm]);

    const fetchPersons = async () => {
        const url = `http://localhost:${PORT}/api/v1/person?sortBy=${sortBy}&direction=${direction}&page=${page}&size=${size}&nameContains=${searchTerm}`;
        const token = localStorage.getItem("Authorization");
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await response.json();
        setPersons(data);
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    return (
        <div className="person-table">
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
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Enter name to search..."
                    />
                </label>
                <label className="control-search-id-label">
                    Search by ID:
                    <input
                        style={{marginLeft: "10px", marginRight: "10px"}}
                        type="text"
                        className="search-input"
                        value={searchId}
                        onChange={handleSearchIdChange}
                        placeholder="Enter ID to search..."
                    />
                </label>
                <button className="update-delete-button" onClick={handleSearchById} style={{marginBottom: "20px"}}>
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
                    <th onClick={() => handleSort("color")}>
                        Color {sortBy === "color" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("hairColor")}>
                    Hair Color {sortBy === "hairColor" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("weight")}>
                        Weight {sortBy === "weight" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("nationality")}>
                        Nationality {sortBy === "nationality" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("location")}>
                        Location ID  {sortBy === "location" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {persons.length > 0 ? (
                    persons.map((person) => (
                        <tr key={person.id}>
                            <td>{person.id}</td>
                            <td>{person.name}</td>
                            <td>{person.color === "NONE" ? "N/A" : person.color}</td>
                            <td>{person.hairColor}</td>
                            <td>{person.weight || "N/A"}</td>
                            <td>{person.nationality}</td>
                            <td>{person.location ? person.location.id : "N/A"}</td>
                            <td>
                                <button
                                    className="update-delete-button"
                                    disabled={!person.updateable && localStorage.getItem("Role") === "ADMIN"}
                                    onClick={() => onEdit(person)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="update-delete-button"
                                    disabled={localStorage.getItem("Role") === "ADMIN"}
                                    onClick={() => onDelete(person)}
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
                                    No persons found.
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
                    {Array.from({ length: Math.ceil(persons.length / size) }, (_, index) => (
                        <button key={index} style={{ backgroundColor: "white", color: "black", pointerEvents: "none" }}>
                            {page + 1}
                        </button>
                    ))}
                </span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={persons.length === 0 || persons.length < size}
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
                            {foundPerson ? (
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
                                        <p><strong>Author</strong></p>
                                        <p>ID: {foundPerson.id || "N/A"}</p>
                                        <p>Name: {foundPerson.name || "N/A"}</p>
                                        <p>Color: {foundPerson.color || "N/A"}</p>
                                        <p>Hair Color: {foundPerson.hairColor || "N/A"}</p>
                                        <p>Weight: {foundPerson.weight || "N/A"}</p>
                                        <p>Nationality: {foundPerson.nationality || "N/A"}</p>
                                        <p>Location ID: {foundPerson.location?.id || "N/A"}</p>
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

export default PersonTable;
