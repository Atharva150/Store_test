import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import storeService from "../services/storeService";
import ratingService from "../services/ratingService";

function Stores() {
    const { user } = useAuth();

    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: ""
});

    const fetchStores = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await storeService.getAllStores();

            // Accept either:
            // response = [...]
            // or response = { stores: [...] }

            const storesData = Array.isArray(response)
                ? response
                : response?.data || [];

            setStores(storesData);

        } catch (err) {
            console.error(err);

            setError(
                err?.message ||
                "Failed to load stores."
            );

            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleRating = async (storeId, rating) => {
        try {
            await ratingService.submitRating({
                store_id: storeId,
                rating: Number(rating),
            });

            await fetchStores();

        } catch (err) {
            alert(
                err?.message ||
                "Failed to submit rating."
            );
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

        alert("Password updated successfully.");

        setPasswordForm({

            oldPassword: "",

            newPassword: ""

        });

    }

    catch(err){

        alert(err.message);

    }

};

    const filteredStores = stores.filter((store) => {
        const name = store?.name?.toLowerCase() || "";
        const address = store?.address?.toLowerCase() || "";

        return (
            name.includes(search.toLowerCase()) ||
            address.includes(search.toLowerCase())
        );
    });

    if (loading) {
        return <h2>Loading stores...</h2>;
    }

    if (error) {
        return (
            <div className="stores-page container">
                <p className="login-error">{error}</p>
            </div>
        );
    }

    return (
        <div className="stores-page container">

            <div className="stores-header">
                <div className="owner-card password-card">

    <h2>Update Password</h2>

    <form onSubmit={handleUpdatePassword}>

        <input

            className="form-input"

            type="password"

            name="oldPassword"

            placeholder="Old Password"

            value={passwordForm.oldPassword}

            onChange={handlePasswordChange}

            required

        />

        <input
            className="form-input"
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            required
        />
        <button
            className="btn btn-primary"
            type="submit"
        >
            Update Password
        </button>
    </form>
</div>
                <h2>Stores</h2>

                <input
                    className="search-input"
                    type="text"
                    placeholder="Search by name or address"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {filteredStores.length === 0 ? (

                <p>No stores found.</p>

            ) : (

                filteredStores.map((store) => (

                    <div
                        className="store-card"
                        key={store.id}
                    >

                        <h3>{store.name}</h3>

                        <p>
                            <strong>Address:</strong>{" "}
                            {store.address}
                        </p>

                        <p>
                            <strong>Overall Rating:</strong>{" "}
                            {store.average_rating ?? "No ratings yet"}
                        </p>

                        <p>
                        <strong>Your Rating:</strong>

                        {

                        store.user_rating ??

                        "Not rated"

                        }

                        </p>    

                        {user?.role === "USER" && (

                            <div className="store-rating-section">

                                <label>

                                {

                                store.user_rating

                                ?

                                "Update Rating"

                                :

                                "Submit Rating"

                                }

                                </label>

                                <select
                                    className="form-select"
                                    value={store.user_rating ?? ""}
                                    onChange={(e) =>
                                        handleRating(
                                            store.id,
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="" disabled>
                                        Select Rating
                                    </option>

                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <option
                                            key={rating}
                                            value={rating}
                                        >
                                            {rating}
                                        </option>
                                    ))}

                                </select>

                            </div>

                        )}

                    </div>

                ))

            )}

        </div>
    );
}

export default Stores;