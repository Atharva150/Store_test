const pool = require("../config/db");
const bcrypt = require("bcrypt");

const getDashboardStats = async () => {

    const totalUsers = await pool.query(`
        SELECT COUNT(*) AS count
        FROM users
    `);

    const totalStores = await pool.query(`
        SELECT COUNT(*) AS count
        FROM stores
    `);

    const totalRatings = await pool.query(`
        SELECT COUNT(*) AS count
        FROM ratings
    `);

    return {
        totalUsers: Number(totalUsers.rows[0].count),
        totalStores: Number(totalStores.rows[0].count),
        totalRatings: Number(totalRatings.rows[0].count),
    };

};

const createUser = async ({
    name,
    email,
    password,
    address,
    role,
}) => {

    const existingUser = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `
        INSERT INTO users
        (name, email, password_hash, address, role)

        VALUES ($1,$2,$3,$4,$5)

        RETURNING
        id,
        name,
        email,
        address,
        role,
        created_at
        `,
        [
            name,
            email,
            passwordHash,
            address,
            role,
        ]
    );
    return result.rows[0];
};

const getAllUsers = async () => {

    const result = await pool.query(`
        SELECT
            id,
            name,
            email,
            address,
            role,
            created_at

        FROM users

        ORDER BY created_at DESC
    `);

    return result.rows;

};

const getUserById = async (id) => {

    const result = await pool.query(
        `
        SELECT

u.id,

u.name,

u.email,

u.address,

u.role,

ROUND(AVG(r.rating),2) AS average_rating

FROM users u

LEFT JOIN stores s
ON s.owner_id = u.id

LEFT JOIN ratings r
ON r.store_id = s.id

WHERE u.id=$1

GROUP BY u.id;
        `,
        [id]
    );
    if (result.rows.length === 0) {
        throw new Error("User not found.");
    }
    return result.rows[0];

};

const getAllStores = async () => {

    const result = await pool.query(
        `
        SELECT

        s.id,

        s.name,

        s.email,

        s.address,

        s.owner_id,

        s.created_at,

        ROUND(AVG(r.rating),2) AS average_rating

        FROM stores s

        LEFT JOIN ratings r

        ON s.id = r.store_id

        GROUP BY

        s.id

        ORDER BY s.name;
        `
    );
    return result.rows;
};

const getOwners = async () => {

    const result = await pool.query(
        `
        SELECT
            id,
            name,
            email

        FROM users

        WHERE role = 'OWNER'

        ORDER BY name
        `
    );

    return result.rows;

};

const createStore = async (storeData) => {
    console.log("Received storeData:", storeData);
    const {
        name,
        email,
        address,
        owner_id
    } = storeData;

    console.log(storeData);

    const owner = await pool.query(

        `
        SELECT id

        FROM users

        WHERE id = $1
        AND role = 'OWNER'
        `,

        [owner_id]

    );
        console.log(owner.rows);
    if (owner.rows.length === 0) {

        throw new Error("Invalid store owner.");

    }

    const result = await pool.query(

        `
        INSERT INTO stores
        (
            name,
            email,
            address,
            owner_id
        )

        VALUES ($1,$2,$3,$4)

        RETURNING *;
        `,

        [
            name,
            email,
            address,
            owner_id
        ]

    );

    return result.rows[0];

};

const searchUsers = async (keyword) => {

    const result = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            address,
            role

        FROM users

        WHERE
            name ILIKE $1
            OR email ILIKE $1
            OR address ILIKE $1
            OR role ILIKE $1

        ORDER BY name
        `,
        [`%${keyword}%`]
    );

    return result.rows;

};

const searchStores = async (keyword) => {

    const result = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            address

        FROM stores

        WHERE
            name ILIKE $1
            OR address ILIKE $1

        ORDER BY name
        `,
        [`%${keyword}%`]
    );

    return result.rows;

};

const deleteUser = async (id) => {

    const result = await pool.query(
        `
        DELETE FROM users

        WHERE id = $1

        RETURNING *
        `,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found.");
    }

    return result.rows[0];

};

module.exports = {
    getDashboardStats,
    createUser,
    createStore,
    getAllUsers,
    getUserById,
    getAllStores,
    getOwners,
    searchUsers,
    searchStores,
    deleteUser
};


