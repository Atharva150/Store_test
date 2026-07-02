import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = ({ target }) => {
        const { name, value } = target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const name = formData.name.trim();
        const address = formData.address.trim();
        const email = formData.email.trim();

        if (name.length < 20 || name.length > 60) {
            return "Name must be between 20 and 60 characters.";
        }

        if (!address) {
            return "Address is required.";
        }

        if (address.length > 400) {
            return "Address cannot exceed 400 characters.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

        if (!passwordRegex.test(formData.password)) {
            return "Password must be 8–16 characters long and contain at least one uppercase letter and one special character.";
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                address: formData.address.trim(),
                password: formData.password,
            };

            const response = await authService.signup(payload);

            alert(response.message || "Account created successfully.");

            navigate("/login", {
                replace: true,
            });

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Signup failed."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="signup-page">

            <div className="signup-card">

                <h2 className="signup-title">
                    Create Account
                </h2>

                <form
                    className="form"
                    onSubmit={handleSubmit}
                    noValidate
                >

                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            className="form-input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            className="form-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="address">
                            Address
                        </label>

                        <input
                            id="address"
                            className="form-input"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            autoComplete="street-address"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            className="form-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
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
                        {loading
                            ? "Creating Account..."
                            : "Sign Up"}
                    </button>

                </form>

                <p className="login-footer">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Signup;