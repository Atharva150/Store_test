import { useEffect, useState } from "react";

import ownerService from "../services/ownerService";

function OwnerDashboard() {

    const [store, setStore] = useState(null);

    const [ratings, setRatings] = useState([]);

    const [users, setUsers] = useState([]);

    const [average, setAverage] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [passwordForm, setPasswordForm] = useState({

    oldPassword: "",

    newPassword: ""

});

const loadData = async () => {
    try {
        setLoading(true);
        setError("");

       const [ratingsData, usersData, avgData] =
    await Promise.allSettled([
        ownerService.getStoreRatings(),
        ownerService.getRatingUsers(),
        ownerService.getAverageRating(),
    ]);

setRatings(
    ratingsData.status === "fulfilled"
        ? ratingsData.value.data
        : []
);

setUsers(
    usersData.status === "fulfilled"
        ? usersData.value.data
        : []
);

setAverage(
    avgData.status === "fulfilled"
        ? avgData.value.data.average_rating
        : null
);

    } catch (err) {
        setError(err.message || "Failed to load dashboard");
    } finally {
        setLoading(false);
    }
};

const handlePasswordChange = (e) => {

    setPasswordForm({

        ...passwordForm,

        [e.target.name]: e.target.value

    });

};

const handleUpdatePassword = async (e) => {

    e.preventDefault();

    try {

        await authService.updatePassword(passwordForm);

        alert("Password updated.");

        setPasswordForm({

            oldPassword: "",

            newPassword: ""

        });

    }

    catch(err){

        alert(err.message);

    }

};


    useEffect(() => {

        loadData();

    }, []);

    if (loading) return <h2>Loading Owner Dashboard...</h2>;

    if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

    return (

        <div className="owner-page container">

            <h1>Owner Dashboard</h1>

            <div className="owner-card">

                <h2>Average Rating</h2>

                <h1>{average ?? "No ratings yet"}</h1>

            </div>

<div className="owner-card">

            <h2>Update Password</h2>

            <form onSubmit={handleUpdatePassword}>

                <input
                    className="form-input"
                    type="password"
                    name="oldPassword"
                    placeholder="Old Password"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                />

                <input
                    className="form-input"
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                />

                <button
                    className="btn btn-primary"
                    type="submit"
                >
                    Update Password
                </button>

            </form>

        </div>

            {/* RATINGS LIST */}
            <div className="owner-card">

                <h2>All Ratings</h2>

                {ratings.length === 0 ? (
                    <p>No ratings yet</p>
                ) : (
                    ratings.map((r) => (
                        <p key={r.id ?? r.rating ?? JSON.stringify(r)}>⭐ {r.rating}</p>
                    ))
                )}

            </div>

            {/* USERS WHO RATED */}
            <div className="owner-card">

                <h2>Users Who Rated</h2>

                {users.length === 0 ? (
                    <p>No users yet</p>
                ) : (
                    <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id ?? u.email ?? JSON.stringify(u)}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OwnerDashboard;