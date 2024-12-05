import './styles/App.css';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthForm from "./components/authForm/Auth";
import {useDispatch, useSelector} from "react-redux";
import {setAuthenticated, setUnauthenticated} from "./redux/authSlice";
import {useEffect} from "react";
import Menu from "./pages/Menu";
import UserInfo from "./components/userInfo/UserInfo";
import Coordinates from "./components/coordinatesForm/Coordinates";
import Location from "./components/locationForm/Location";
import Discipline from "./components/disciplineForm/Discipline";
import Person from "./components/personForm/Person";

export default function App() {

    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        const storedAuthState = localStorage.getItem("isAuthenticated") === "true";
        if (!storedAuthState) {
            dispatch(setUnauthenticated());
        }
    }, [dispatch]);

    const handleAuthSuccess = () => {
        dispatch(setAuthenticated());
    };

    const handleLogout = () => {
        dispatch(setUnauthenticated());
    };

    return (
        <Router>
            <Routes>


                <Route path="/auth" element={<AuthForm onAuthSuccess={handleAuthSuccess} />} />

                <Route
                    path="/menu"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <UserInfo/>
                            <Menu onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/coordinates"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <UserInfo/>
                            <Coordinates />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/location"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <UserInfo/>
                            <Location />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/discipline"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <UserInfo/>
                            <Discipline />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/person"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <UserInfo/>
                            <Person />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/*"
                    element={
                        isAuthenticated ? <Navigate to="/menu" replace /> : <Navigate to="/auth" replace />
                    }
                />

            </Routes>
        </Router>
    );
}

