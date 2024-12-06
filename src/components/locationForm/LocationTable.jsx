import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const LocationTable = ({ onEdit, onDelete }) => {
    const [locations, setLocations] = useState([]);
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState("id");
    const [direction, setDirection] = useState("asc");
    const [size, setSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchIdTerm, setSearchIdTerm] = useState("");  // Search term for ID
    const [coordinate, setCoordinate] = useState(null); // For storing the result of the ID search
    const [showDialog, setShowDialog] = useState(false); // For showing the dialog

    useEffect(() => {
        fetchLocations();
        const interval = setInterval(() => {
            fetchLocations();
        }, 30000);
        return () => clearInterval(interval);
    }, [page, sortBy, direction, size, searchTerm]);

    const fetchLocations = async () => {
        const url = `http://localhost:${PORT}/api/v1/locations?sortBy=${sortBy}&direction=${direction}&page=${page}&size=${size}&nameContains=${searchTerm}`;
        const token = localStorage.getItem("Authorization");
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await response.json();
        setLocations(data);
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

    const handleSearchIdChange = (e) => {
        setSearchIdTerm(e.target.value);
    };

    const handleSearchById = async () => {
        if (searchIdTerm) {
            const url = `http://localhost:${PORT}/api/v1/locations/${searchIdTerm}`;
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
                setCoordinate(data);
            } else {
                setCoordinate(null);
            }
            setShowDialog(true);
        }
    };

    const closeDialog = () => {
        setShowDialog(false);
        setSearchIdTerm("");
    };

    return (
        <div className="location-table">
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
                <label className="control-search-id-label" >
                    Search by ID:
                    <input
                        style={{marginLeft: "10px", marginRight: "10px"}}
                        type="text"
                        className="search-input"
                        value={searchIdTerm}
                        onChange={handleSearchIdChange}
                        placeholder="Enter ID to search..."
                    />
                </label>
                <button className={"update-delete-button"} onClick={handleSearchById} style={{marginBottom: "20px"}}>Search by ID</button>
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
                    <th onClick={() => handleSort("coordinateX")}>
                        X {sortBy === "coordinateX" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("coordinateY")}>
                        Y {sortBy === "coordinateY" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("coordinateZ")}>
                        Z {sortBy === "coordinateZ" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {locations.length > 0 ? (
                    locations.map((location) => (
                        <tr key={location.id}>
                            <td>{location.id}</td>
                            <td>{location.name}</td>
                            <td>{location.coordinateX}</td>
                            <td>{location.coordinateY}</td>
                            <td>{location.coordinateZ || "N/A"}</td>
                            <td>
                                <button
                                    className="update-delete-button"
                                    disabled={!location.updateable && localStorage.getItem("Role") === "ADMIN"}
                                    onClick={() => onEdit(location)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="update-delete-button"
                                    disabled={localStorage.getItem("Role") === "ADMIN"}
                                    onClick={() => onDelete(location)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="15">
                            <div style={{ textAlign: "center", padding: "20px" }}>
                                <h3 style={{ color: "#dc3545", fontSize: "18px", fontWeight: "bold" }}>
                                    No locations found.
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
                    {Array.from({ length: Math.ceil(locations.length / size) }, (_, index) => (
                        <button key={index} style={{ backgroundColor: "white", color: "black", pointerEvents: "none" }}>
                            {page + 1}
                        </button>
                    ))}
                </span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={locations.length === 0 || locations.length < size}
                >
                    Next
                </button>
            </div>
            {showDialog && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    animation: 'fadeIn 0.3s ease-in-out',
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        width: '80%',
                        maxWidth: '500px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        position: 'relative',
                        animation: 'slideIn 0.3s ease-in-out',
                    }}>
            <span
                onClick={closeDialog}
                style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    fontSize: '30px',
                    color: '#333',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                }}>&times;</span>
                        {coordinate ? (
                            <div>
                                <h2 style={{
                                    fontSize: '24px',
                                    marginBottom: '15px',
                                    color: '#333',
                                    fontWeight: 'bold',
                                }}>Coordinate Found</h2>
                                <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                    <p><strong>ID:</strong> {coordinate.id}</p>
                                    <p><strong>X:</strong> {coordinate.coordinateX}</p>
                                    <p><strong>Y:</strong> {coordinate.coordinateY}</p>
                                    <p><strong>Z:</strong> {coordinate.coordinateZ || "N/A"}</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 style={{
                                    fontSize: '24px',
                                    marginBottom: '15px',
                                    color: '#dc3545',
                                    fontWeight: 'bold',
                                }}>Coordinate Not Found</h2>
                                <p style={{
                                    fontSize: '16px',
                                    color: '#dc3545',
                                    fontWeight: '500',
                                    marginTop: '10px',
                                }}>The coordinate with the provided ID does not exist.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default LocationTable;
