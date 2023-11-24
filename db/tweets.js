const { generateError } = require("../helpers");
const { getConnection } = require("./db");


const createTweet = async (userId, text, image = '') => {
    let connection;

    try {
        connection = await getConnection();
        const [result] = await connection.query(`
        INSERT INTO tweets (user_id, text, image) VALUES(?,?,?)
        `, [userId, text, image]
        );

        return result.insertId;

    } finally {
        if (connection) connection.release();
    }
};


module.exports = {
    createTweet,
};