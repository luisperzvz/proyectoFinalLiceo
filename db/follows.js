const { getConnection } = require("./db");

const createFollow = async (userId, followed) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(
            `
                INSERT INTO follows (followed, follower_id)
                VALUES (?, ?);
            `,
            [followed, userId]
        );
        
        return result.insertId;
    } finally {
        if (connection) connection.release();
    }
};

const getSingleFollowById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT
                f.id,
                f.follower_id,
                f.followed,
                u.email,
                u2.email AS followed_email
            FROM follows f
            INNER JOIN users u ON u.id = f.follower_id
            INNER JOIN users u2 ON u2.id = f.followed
            WHERE f.id = ?;
        `, [id]);

        return result[0];

    } finally {
        if(connection) connection.release();
    }
};

const getSingleFollowByFollowedId = async (userId, followedId) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT
                f.id,
                f.follower_id,
                f.followed
            FROM follows f
            WHERE f.follower_id = ?
            and followed = ?;
        `, [userId, followedId]);

        return result[0];

    } finally {
        if(connection) connection.release();
    }
};

const deleteSingleFollowById = async (id) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      await connection.query(
        `
        DELETE FROM follows WHERE id = ?;
      `,
        [id]
      );
  
      return;
    } finally {
      if (connection) connection.release();
    }
};

const getAllFollowersByUserId = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT
                f.id,
                f.follower_id,
                f.followed
            FROM follows f
            WHERE f.followed = ?;
        `, [id]);

        return result;

    } finally {
        if(connection) connection.release();
    }
}

module.exports = {
    createFollow,
    getSingleFollowById,
    deleteSingleFollowById,
    getSingleFollowByFollowedId,
    getAllFollowersByUserId
}