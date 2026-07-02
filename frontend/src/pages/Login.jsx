import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import useAuth from "../hooks/useAuth";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (loading) return;

        if (!formData.email.trim() || !formData.password.trim()) {
            setError("Email and password are required.");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.login({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            if (!response?.token || !response?.user) {
                throw new Error("Invalid response received from server.");
            }

            login(response.token, response.user);

            switch (response.user.role) {
                case "ADMIN":
                    navigate("/admin", { replace: true });
                    break;

                case "OWNER":
                    navigate("/owner", { replace: true });
                    break;

                case "USER":
                    navigate("/stores", { replace: true });
                    break;

                default:
                    navigate("/login", { replace: true });
            }
        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <h2 className="login-title">
                    Login
                </h2>

                <form
                    className="form"
                    onSubmit={handleSubmit}
                    noValidate
                >

                    <div className="form-group">

                        <label
                            htmlFor="email"
                            className="form-label"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            className="form-input"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label
                            htmlFor="password"
                            className="form-label"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            className="form-input"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        className="btn btn-primary login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="login-footer">
                    Don't have an account?{" "}
                    <Link to="/signup">
                        Sign Up
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;