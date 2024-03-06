const { generateError } = require("../helpers");
const { getConnection } = require("./db");

const createComment = async (userId, comment, tweetId) => {
    let connection;

    try {
        connection = await getConnection();

        const [tweetOwner] = await connection.query(`
            SELECT user_id FROM tweets WHERE id = ?;
        `, [tweetId]);

        const [result] = await connection.query(
            `
                INSERT INTO comments (tweet, comment_owner, content, tweet_owner)
                VALUES (?, ?, ?, ?);
            `,
            [tweetId, userId, comment, tweetOwner[0].user_id]
        );
        
        return result.insertId;
    } finally {
        if (connection) connection.release();
    }
};

const getCommentById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT * FROM comments WHERE id = ?;
        `, [id]);

        if (result.length === 0) {
            throw generateError(`El comentario con id: ${id} no existe.`, 404);
        }

        return result[0];

    } finally {
        if(connection) connection.release();
    }
};

const getCommentsByTweetId = async (tweetId) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT
                c.id,
                c.tweet,
                c.comment_owner,
                c.content,
                c.tweet_owner,
                u.email
            FROM comments c
            INNER JOIN users u ON u.id = c.comment_owner
            WHERE c.tweet = ?;
        `, [tweetId]);

        return result;

    } finally {
        if(connection) connection.release();
    }
};

const getSingleCommentByTweetId = async (tweetId, id) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT
                c.id,
                c.tweet,
                c.comment_owner,
                c.content,
                c.tweet_owner,
                u.email,
                u2.email AS tweet_owner_email
            FROM comments c
            INNER JOIN users u ON u.id = c.comment_owner
            INNER JOIN users u2 ON u2.id = c.tweet_owner
            WHERE c.tweet = ?
            AND c.id = ?;
        `, [tweetId, id]);

        if (result.length === 0) {
            throw generateError(`El comentario con id: ${id} no existe.`, 404);
        }

        return result[0];

    } finally {
        if(connection) connection.release();
    }
};

const deleteSingleCommentById = async (id) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      await connection.query(
        `
        DELETE FROM comments WHERE id = ?
      `,
        [id]
      );
  
      return;
    } finally {
      if (connection) connection.release();
    }
};

module.exports = {
    createComment,
    getCommentById,
    getCommentsByTweetId,
    getSingleCommentByTweetId,
    deleteSingleCommentById
};