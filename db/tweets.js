const { generateError } = require("../helpers");
const { getConnection } = require("./db");


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
}


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
    getAllTweets,
};