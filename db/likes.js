const { generateError } = require("../helpers");
const { getConnection } = require("./db");

const createLike = async (userId, tweetId) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(
            `
                INSERT INTO likes (tweet, like_owner)
                VALUES (?, ?);
            `,
            [tweetId, userId]
        );
        
        return result.insertId;
    } finally {
        if (connection) connection.release();
    }
};

const getLikesByTweetId = async (tweetId) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT
                l.id,
                l.like_owner,
                u.email
            FROM likes l
            INNER JOIN users u ON u.id = l.like_owner
            WHERE l.tweet = ?;
        `, [tweetId]);

        return result;

    } finally {
        if(connection) connection.release();
    }
};

const getSingleLikeByTweetId = async (tweetId, id) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT
                l.id,
                l.like_owner,
                u.email,
                u2.email AS tweet_owner_email,
                t.user_id
            FROM likes l
            INNER JOIN users u ON u.id = l.like_owner
            INNER JOIN tweets t ON t.id = l.tweet
            INNER JOIN users u2 ON u2.id = t.user_id
            WHERE l.tweet = ?
            AND l.id = ?;
        `, [tweetId, id]);

        if (result.length === 0) {
            throw generateError(`El like con id: ${id} no existe.`, 404);
        }

        return result[0];

    } finally {
        if(connection) connection.release();
    }
};

const deleteSingleLikeById = async (id) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      await connection.query(
        `
        DELETE FROM likes WHERE id = ?
      `,
        [id]
      );
  
      return;
    } finally {
      if (connection) connection.release();
    }
};

module.exports = {
    createLike,
    getLikesByTweetId,
    getSingleLikeByTweetId,
    deleteSingleLikeById
}