const pool = require("../config/db");

/**
 * Create a new store
 */
const createStore = async ({
    name,
    email,
    address,
    owner_id,
}) => {

    // Check if owner exists
   const owner = await pool.query(
    `
    SELECT id
    FROM users
    WHERE id = $1
    AND role = 'OWNER'
    `,
    [owner_id]
);

if (owner.rows.length === 0) {
    throw new Error("Invalid store owner.");
}

    if (owner.rows[0].role !== "OWNER") {
        throw new Error("Selected user is not a store owner.");
    }

    const result = await pool.query(
        `
        INSERT INTO stores
        (name, email, address, owner_id)

        VALUES ($1, $2, $3, $4)

        RETURNING *
        `,
        [
            name,
            email,
            address,
            owner_id,
        ]
    );

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

ORDER BY s.name ASC
        `
    );

    return result.rows;
};

/**
 * Get one store
 */
const getStoreById = async (storeId) => {

    const result = await pool.query(
        `
        SELECT *

        FROM stores

        WHERE id = $1
        `,
        [storeId]
    );

    if (result.rows.length === 0) {
        throw new Error("Store not found.");
    }

    return result.rows[0];
};

/**
 * Update Store
 */
const updateStore = async (
    storeId,
    {
        name,
        email,
        address,
        owner_id,
    }
) => {

    const result = await pool.query(
        `
        UPDATE stores

        SET

            name = $1,

            email = $2,

            address = $3,

            owner_id = $4

        WHERE id = $5

        RETURNING *
        `,
        [
            name,
            email,
            address,
            owner_id,
            storeId,
        ]
    );

    if (result.rows.length === 0) {
        throw new Error("Store not found.");
    }

    return result.rows[0];
};

/**
 * Delete Store
 */
const deleteStore = async (storeId) => {

    const result = await pool.query(
        `
        DELETE FROM stores

        WHERE id = $1

        RETURNING *
        `,
        [storeId]
    );

    if (result.rows.length === 0) {
        throw new Error("Store not found.");
    }

    return {
        message: "Store deleted successfully."
    };
};

module.exports = {
    createStore,
    getAllStores,
    getStoreById,
    updateStore,
    deleteStore,
};