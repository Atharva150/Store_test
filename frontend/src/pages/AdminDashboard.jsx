import { useEffect, useState } from "react";
import adminService from "../services/adminService";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stores, setStores] = useState([]);
    const [userSearch, setUserSearch] = useState("");
    const [storeSearch, setStoreSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    const [storeForm, setStoreForm] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER"
    });

    const fetchDashboard = async () => {
        try {
            const response = await adminService.getDashboard();
            setStats(response.data || response);
        } catch (err) {
            setError(err.message || "Failed to load dashboard");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await adminService.getAllUsers();
            setUsers(Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []));
        } catch (err) {
            setError(err.message || "Failed to load users");
        }
    };

    const fetchOwners = async () => {
        try {
            const response = await adminService.getOwners();
            setOwners(Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStores = async () => {
    try {

        const response = await adminService.getAllStores();

        setStores(
            Array.isArray(response.data)
                ? response.data
                : []
        );

    } catch (err) {

        console.error(err);

    }
};

const searchUsers = async (keyword) => {

    try {

        if (keyword.trim() === "") {
            fetchUsers();
            return;
        }

        const response =
            await adminService.searchUsers(keyword);

        setUsers(response.data);

    } catch (err) {

        console.error(err);

    }

};

const searchStores = async (keyword) => {

    try {

        if (keyword.trim() === "") {
            fetchStores();
            return;
        }

        const response =
            await adminService.searchStores(keyword);

        setStores(response.data);

    } catch (err) {

        console.error(err);

    }

};

    const loadData = async () => {
        setLoading(true);
        setError("");
        await Promise.all([
            fetchDashboard(),
            fetchUsers(),
            fetchOwners(),
            fetchStores()
        ]);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleStoreChange = (e) => {
        setStoreForm({
            ...storeForm,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        try {
            await adminService.createStore(storeForm);
            alert("Store created successfully.");
            setStoreForm({ name: "", email: "", address: "", owner_id: "" });
            await loadData();
        } catch (err) {
            alert(err.message || "Failed to create store.");
        }
    };

    const handleUserChange = (e) => {
        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await adminService.createUser(userForm);
            alert("User created successfully.");
            setUserForm({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "USER"
            });
            fetchUsers();
            fetchOwners();
            fetchDashboard();
        } catch (err) {
            alert(err.message || "Failed to create user.");
        }
    };

    const handleDeleteUser = async (id) => {
        const confirmDelete = window.confirm("Delete this user?");
        if (!confirmDelete) return;
        try {
            await adminService.deleteUser(id);
            alert("User deleted.");
            fetchUsers();
            fetchDashboard();
        } catch (err) {
            alert(err.message || "Delete failed.");
        }
    };

    const handleViewUser = async (id) => {

    try {

        const response =
            await adminService.getUserById(id);

        setSelectedUser(response.data);

        setShowUserModal(true);

    } catch (err) {

        alert(
            err.message ||
            "Failed to fetch user details."
        );
    }
};

    if (loading) return <h2>Loading Admin Dashboard...</h2>;
    if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

    return (
        <div className="admin-page container">
            <h1>Admin Dashboard</h1>

            <div className="stats-grid">
                <div className="stats-card">
                    <h3>Total Users</h3>
                    <p>{stats?.totalUsers ?? 0}</p>
                </div>
                <div className="stats-card">
                    <h3>Total Stores</h3>
                    <p>{stats?.totalStores ?? 0}</p>
                </div>
                <div className="stats-card">
                    <h3>Total Ratings</h3>
                    <p>{stats?.totalRatings ?? 0}</p>
                </div>
            </div>

            {/* Add New Store */}
            <div className="card">
                <h2>Add New Store</h2>
                <form className="form" onSubmit={handleCreateStore}>
                    <div className="form-group">
                        <label>Store Name</label>
                        <input
                            className="form-input"
                            type="text"
                            name="name"
                            value={storeForm.name}
                            onChange={handleStoreChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Store Email</label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            value={storeForm.email}
                            onChange={handleStoreChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            className="form-input"
                            type="text"
                            name="address"
                            value={storeForm.address}
                            onChange={handleStoreChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Store Owner</label>
                        <select
                            className="form-select"
                            name="owner_id"
                            value={storeForm.owner_id}
                            onChange={handleStoreChange}
                            required
                        >
                            <option value="">Select Owner</option>
                            {owners.map((owner) => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary" type="submit">
                        Add Store
                    </button>
                </form>
            </div>

            <h2 className="section-title">
    Stores
</h2>

{
    stores.length === 0
        ? (
            <p>No stores found.</p>
        )
        : (
            <div className="table-wrapper">

<div className="search-bar">

    <input

        className="form-input"

        type="text"

        placeholder="Search Stores"

        value={storeSearch}

        onChange={(e) => {

            setStoreSearch(e.target.value);

            searchStores(e.target.value);

        }}

    />

</div>

                <table className="table">

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Address</th>

                            <th>Average Rating</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            stores.map((store) => (

                                <tr key={store.id}>

                                    <td>
                                        {store.name}
                                    </td>

                                    <td>
                                        {store.email}
                                    </td>

                                    <td>
                                        {store.address}
                                    </td>

                                    <td>
                                        {
                                            store.average_rating ??
                                            "No Ratings"
                                        }
                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>
        )
}

            {/* Create New User */}
            <div className="card">
                <h2>Create User</h2>
                <form className="form" onSubmit={handleCreateUser}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            className="form-input"
                            type="text"
                            name="name"
                            value={userForm.name}
                            onChange={handleUserChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleUserChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            value={userForm.password}
                            onChange={handleUserChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            className="form-input"
                            type="text"
                            name="address"
                            value={userForm.address}
                            onChange={handleUserChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            className="form-select"
                            name="role"
                            value={userForm.role}
                            onChange={handleUserChange}
                        >
                            <option value="USER">Normal User</option>
                            <option value="OWNER">Store Owner</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" type="submit">
                        Create User
                    </button>
                </form>
            </div>

            <h2 className="section-title">Users</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="table-wrapper">
                    <div className="search-bar">

    <input

        className="form-input"

        type="text"

        placeholder="Search Users"

        value={userSearch}

        onChange={(e) => {

            setUserSearch(e.target.value);

            searchUsers(e.target.value);

        }}

    />

</div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.address}</td>
                                    <td>{user.role}</td>
                                  <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            handleViewUser(user.id)
                                        }
                                    >
                                        View
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                            handleDeleteUser(user.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showUserModal && selectedUser && (
    <div className="modal-overlay">
        <div className="modal">
            <h2>User Details</h2>
            <p>
                <strong>Name:</strong>
                {selectedUser.name}
            </p>
            <p>
                <strong>Email:</strong>
                {selectedUser.email}
            </p>
            <p>
                <strong>Address:</strong>
                {selectedUser.address}
            </p>
            <p>
                <strong>Role:</strong>
                {selectedUser.role}
            </p>
          {
    selectedUser.role === "OWNER" && (

        <p>

            <strong>Average Rating:</strong>

            {
                selectedUser.average_rating
                    ? `${selectedUser.average_rating} ⭐`
                    : "No Ratings Yet"
            }

        </p>

    )
}
            <button
                className="btn"
                onClick={() =>
                    setShowUserModal(false)
                }
            >
                Close
            </button>
        </div>
    </div>
)}
        </div>
    );
}

export default AdminDashboard;