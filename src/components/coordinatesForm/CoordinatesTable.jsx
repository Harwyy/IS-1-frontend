import React, { useState, useEffect } from "react";
import { PORT } from "../../config/config";

const CoordinatesTable = ({ onEdit, onDelete }) => {
    const [coordinates, setCoordinates] = useState([]);
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState("id");
    const [direction, setDirection] = useState("asc");
    const [size, setSize] = useState(5);

    useEffect(() => {
        fetchCoordinates();
        const interval = setInterval(() => {
            fetchCoordinates();
        }, 1000);
        return () => clearInterval(interval);
    }, [page, sortBy, direction, size]);

    useEffect(() => {
        fetchCoordinates();
    }, [page, sortBy, direction, size]);

    const fetchCoordinates = async () => {
        var url = `http://localhost:${PORT}/api/v1/coordinates?sortBy=${sortBy}&direction=${direction}&page=${page}&size=${size}`;
        var token = localStorage.getItem("Authorization");
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await response.json();
        setCoordinates(data);
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

    return (
        <div className="coordinates-table">
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
            </div>
            <table>
                <thead>
                <tr>
                    <th onClick={() => handleSort("id")}>
                        ID {sortBy === "id" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("X")}>
                        X {sortBy === "X" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th onClick={() => handleSort("Y")}>
                        Y {sortBy === "Y" && direction === "asc" ? "↑" : "↓"}
                    </th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {coordinates.length > 0 ? (
                    coordinates.map((coord) => (
                        <tr key={coord.id}>
                            <td>{coord.id}</td>
                            <td>{coord.x}</td>
                            <td>{coord.y}</td>
                            <td>
                                <button className="update-delete-button" disabled={!coord.updateable && localStorage.getItem("Role") === "ADMIN"} onClick={() => onEdit(coord)}>Edit</button>
                                <button className="update-delete-button" disabled={localStorage.getItem("Role") === "ADMIN"} onClick={() => onDelete(coord)}>Delete</button>
                            </td>
                        </tr>
                    ))
                ) :  (
                    <tr>
                        <td colSpan="15">
                            <div style={{textAlign: 'center', padding: '20px'}}>
                                <h3 style={{color: '#dc3545', fontSize: '18px', fontWeight: 'bold'}}>
                                    Oops! No more coordinates here...
                                </h3>
                                <p style={{fontSize: '14px', color: '#6c757d'}}>
                                    Maybe try a different page or perform another action!
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
                    {Array.from({length: Math.ceil(coordinates.length / size)}, (_, index) => (
                        <button key={index} style={{backgroundColor: 'white', color: 'black', pointerEvents: 'none'}}>
                            {page + 1}
                        </button>
                    ))}
                </span>
                <button onClick={() => setPage(page + 1)} disabled={coordinates.length === 0 || coordinates.length < size}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default CoordinatesTable;
