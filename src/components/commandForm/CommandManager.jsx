import React, { useState, useEffect } from 'react';
import "./styles/styles.css";
import { PORT } from "../../config/config";

const FunctionsComponent = () => {
    const [input1, setInput1] = useState(''); // MinimalPoint input
    const [input2, setInput2] = useState(''); // MinimalPoint threshold input
    const [inputSubstring, setInputSubstring] = useState(''); // Substring input for search
    const [errorMessageDelete, setErrorMessageDelete] = useState(''); // Error message for delete
    const [errorMessageCount, setErrorMessageCount] = useState(''); // Error message for count
    const [errorMessageSubstring, setErrorMessageSubstring] = useState(''); // Error message for substring search
    const [searchResults, setSearchResults] = useState([]); // Store search results
    const [labWorks, setLabWorks] = useState([]); // Store lab works
    const [labWorks2, setLabWorks2] = useState([]); // Store lab works
    const [disciplines, setDisciplines] = useState([]); // Store disciplines
    const [selectedLabWork, setSelectedLabWork] = useState(''); // Selected lab work
    const [selectedLabWork2, setSelectedLabWork2] = useState(''); // Selected lab work
    const [selectedDiscipline, setSelectedDiscipline] = useState(''); // Selected discipline
    const [errorMessageAdd, setErrorMessageAdd] = useState(''); // Error message for adding lab work
    const [errorMessageDeleteLabWork, setErrorMessageDeleteLabWork] = useState(''); // Error message for deleting lab work


    const handleDeleteLabWork = async () => {
        if (!selectedLabWork2) {
            setErrorMessageDeleteLabWork('LabWork must be selected!');
            return;
        }

        try {
            const response = await fetch(`http://localhost:${PORT}/api/v1/commands/labworks/${selectedLabWork2}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("Authorization"),
                },
            });

            if (response.ok) {
                alert(`LabWork with ID ${selectedLabWork2} was successfully deleted.`);
                setErrorMessageDeleteLabWork('');
            } else {
                setErrorMessageDeleteLabWork('Failed to delete LabWork. Please try again.');
            }
        } catch (error) {
            setErrorMessageDeleteLabWork('Error occurred while deleting LabWork.');
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchLabWorks = async () => {
            try {
                const response = await fetch(`http://localhost:${PORT}/api/v1/labworks/my`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("Authorization"),
                    },
                });
                const data = await response.json();
                setLabWorks(data.filter(lab => !isNaN(lab.discipline)));
            } catch (error) {
                console.error('Error fetching lab works:', error);
            }
        };

        const fetchLabWorks2 = async () => {
            try {
                const response = await fetch(`http://localhost:${PORT}/api/v1/labworks/my`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("Authorization"),
                    },
                });
                const data = await response.json();
                setLabWorks2(data.filter(lab => isNaN(lab.discipline)));
            } catch (error) {
                console.error('Error fetching lab works:', error);
            }
        };

        const fetchDisciplines = async () => {
            try {
                const response = await fetch(`http://localhost:${PORT}/api/v1/disciplines/my`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("Authorization"),
                    },
                });
                const data = await response.json();
                setDisciplines(data);
            } catch (error) {
                console.error('Error fetching disciplines:', error);
            }
        };

        fetchLabWorks();
        fetchDisciplines();
        fetchLabWorks2();
    }, []);

    const handleAddLabWorkToDiscipline = async () => {
        if (!selectedLabWork || !selectedDiscipline) {
            setErrorMessageAdd('Both LabWork and Discipline must be selected!');
            return;
        }

        try {
            const response = await fetch(`http://localhost:${PORT}/api/v1/commands/${selectedDiscipline}/labworks/${selectedLabWork}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("Authorization"),
                },
            });

            if (response.ok) {
                alert(`LabWork with ID ${selectedLabWork} added to Discipline with ID ${selectedDiscipline}`);
                setErrorMessageAdd('');
            } else {
                setErrorMessageAdd('Failed to add LabWork to Discipline. Please try again.');
            }
        } catch (error) {
            setErrorMessageAdd('Error occurred while adding LabWork to Discipline.');
            console.error('Error:', error);
        }
    };

    const handleDeleteButtonClick = async () => {
        if (!input1) {
            setErrorMessageDelete('MinimalPoint must be filled!');
            return;
        }

        try {
            const minimalPoint = input1;
            const response = await fetch(`http://localhost:${PORT}/api/v1/commands/${minimalPoint}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("Authorization"),
                },
            });
            const responseText = await response.text();

            if (response.status === 204) {
                alert(`Object with minimalPoint ${minimalPoint} was deleted successfully.`);
                setErrorMessageDelete('');
            } else {
                setErrorMessageDelete(responseText);
            }
        } catch (error) {
            setErrorMessageDelete('Error occurred while deleting the object.');
            console.error('Error:', error);
        }
    };

    const handleCountButtonClick = async () => {
        if (!input2) {
            setErrorMessageCount('Threshold minimalPoint must be filled!');
            return;
        }

        try {
            const threshold = input2;
            const response = await fetch(`http://localhost:${PORT}/api/v1/commands/${threshold}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("Authorization"),
                },
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Number of objects with minimalPoint > ${input2}: ${data}`);
                setErrorMessageCount('');
            } else {
                setErrorMessageCount('Failed to retrieve count. Please try again.');
            }
        } catch (error) {
            setErrorMessageCount('Error occurred while fetching count.');
            console.error('Error:', error);
        }
    };

    const handleSubstringSearch = async () => {
        if (!inputSubstring) {
            setErrorMessageSubstring('Substring must be filled!');
            return;
        }

        try {
            const substring = inputSubstring;
            const response = await fetch(`http://localhost:${PORT}/api/v1/commands/substring/${substring}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("Authorization"),
                },
            });

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data); // Save the search results
                setErrorMessageSubstring('');
            } else {
                setErrorMessageSubstring('Try another substring.');
            }
        } catch (error) {
            setErrorMessageSubstring('Error occurred while searching for substring.');
            console.error('Error:', error);
        }
    };

    const handleClearTable = () => {
        setSearchResults([]);
    };

    return (
        <div className="functions-container">
            <h1 className="functions-title">Functions</h1>
            <p className="functions-description">
                Delete laboratory work with provided minimal point.
            </p>
            <ol className="functions-list">
                <li className="function-item">
                    <div className="function-content">
                        <div className="input-group-horizontal">
                            <input
                                type="text"
                                className="input-field"
                                value={input1}
                                onChange={(e) => setInput1(e.target.value)}
                                placeholder="Enter minimalPoint"
                            />
                            <button className="create-button" style={{marginLeft: "10px"}} onClick={handleDeleteButtonClick}>
                                Submit (Delete)
                            </button>
                        </div>
                        {errorMessageDelete && <div className="error-message">{errorMessageDelete}</div>}
                    </div>
                </li>

                <li className="function-item">
                    <div className="function-content">
                        <p className="functions-description">
                            Get the count of objects where minimalPoint is greater than the provided minimal point.
                        </p>
                        <div className="input-group-horizontal">
                            <input
                                type="number"
                                className="input-field"
                                value={input2}
                                onChange={(e) => setInput2(e.target.value)}
                                placeholder="Enter minimalPoint threshold"
                            />
                            <button className="create-button" style={{marginLeft: "10px"}} onClick={handleCountButtonClick}>
                                Submit (Get Count)
                            </button>
                        </div>
                        {errorMessageCount && <div className="error-message">{errorMessageCount}</div>}
                    </div>
                </li>

                <li className="function-item">
                    <div className="function-content">
                        <p className="functions-description">
                            Search for objects where description contains the provided substring.
                        </p>
                        <div className="input-group-horizontal">
                            <input
                                type="text"
                                className="input-field"
                                value={inputSubstring}
                                onChange={(e) => setInputSubstring(e.target.value)}
                                placeholder="Enter description substring"
                            />
                            <button className="create-button" style={{marginLeft: "10px"}} onClick={handleSubstringSearch}>
                                Submit (Search by Substring)
                            </button>
                        </div>
                        {errorMessageSubstring && <div className="error-message">{errorMessageSubstring}</div>}
                    </div>
                </li>

                <li className="function-item">
                    <div className="function-content">
                        <p className="functions-description">
                            Add discipline to laboratory work.
                        </p>
                        <div className="input-group-horizontal">
                            <select
                                className="input-field"
                                value={selectedLabWork}
                                onChange={(e) => setSelectedLabWork(e.target.value)}
                            >
                                <option value="">Select LabWork</option>
                                {labWorks.map((lab) => (
                                    <option key={lab.lab_work_id} value={lab.lab_work_id}>
                                        {lab.id}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="input-field"
                                value={selectedDiscipline}
                                onChange={(e) => setSelectedDiscipline(e.target.value)}
                            >
                                <option value="">Select Discipline</option>
                                {disciplines.map((discipline) => (
                                    <option key={discipline.discipline_id} value={discipline.discipline_id}>
                                        {discipline.id}
                                    </option>
                                ))}
                            </select>
                            <button className="create-button" style={{marginLeft: "10px"}} onClick={handleAddLabWorkToDiscipline}>
                                Add LabWork to Discipline
                            </button>
                        </div>
                        {errorMessageAdd && <div className="error-message">{errorMessageAdd}</div>}
                    </div>
                </li>
            </ol>

            <li className="function-item">
                <div className="function-content">
                    <p className="functions-description">
                        Delete disciplines from laboratory work.
                    </p>
                    <div className="input-group-horizontal">
                        <select
                            className="input-field"
                            value={selectedLabWork2}
                            onChange={(e) => setSelectedLabWork2(e.target.value)}
                        >
                            <option value="">Select LabWork</option>
                            {labWorks2.map((lab) => (
                                <option key={lab.lab_work_id} value={lab.lab_work_id}>
                                    {lab.id}
                                </option>
                            ))}
                        </select>
                        <button className="create-button" style={{marginLeft: "10px"}} onClick={handleDeleteLabWork}>
                            Delete LabWork
                        </button>
                    </div>
                    {errorMessageDeleteLabWork && <div className="error-message">{errorMessageDeleteLabWork}</div>}
                </div>
            </li>

            {searchResults.length > 0 && (
                <div className="results-table-container">
                    <table className="results-table">
                        <thead>
                        <tr>
                            <th>Lab Work ID</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {searchResults.map((item) => (
                            <tr key={item.lab_work_id}>
                                <td>{item.lab_work_id}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="clear-table-container">
                <button className="clear-table-button" onClick={handleClearTable}>
                    Clear Table
                </button>
            </div>

            <div className="back-to-menu">
                <a href="/menu" className="back-to-menu-button">
                    Back to Menu
                </a>
            </div>
        </div>
    );
};

export default FunctionsComponent;
