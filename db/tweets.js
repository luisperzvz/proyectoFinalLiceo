const { generateError } = require("../helpers");
const { getConnection } = require("./db");


const deleteTweetById = async (id) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      await connection.query(
        `
        DELETE FROM tweets WHERE id = ?
      `,
        [id]
      );
  
      return;
    } finally {
      if (connection) connection.release();
    }
  };




const getTweetById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

const [result] = await connection.query(`
          SELECT
            t.id,
            t.user_id,
            t.text,
            t.image,
            t.created_at,
            u.email
          FROM tweets t
          INNER JOIN users u ON u.id = t.user_id
          WHERE t.id = ?;
        `, [id]);

        if (result.length === 0) {
            throw generateError(`El tweet con id: ${id} no existe`, 404);
        }

        return result[0];

    } finally {
        if(connection) connection.release();
    }
};





const getAllTweets = async () => {
    let connection;

    try {
        connection = await getConnection();

const [result] = await connection.query(`
        SELECT * FROM tweets ORDER BY created_at DESC
        `)

        return result;

    } finally {
        if(connection) connection.release();
    }
};

const createTweet = async (userId, text, image = '') => {
    let connection;
  
    try {
      connection = await getConnection();
  
      const [result] = await connection.query(
        `
        INSERT INTO tweets (user_id, text, image)
        VALUES(?,?,?)
      `,
        [userId, text, image]
      );
  
      return result.insertId;
    } finally {
      if (connection) connection.release();
    }
  };



module.exports = {
    createTweet,
    getAllTweets,
    getTweetById,
    deleteTweetById,
};