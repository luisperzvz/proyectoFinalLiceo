const { getConnection } = require("./db");

const createNotification = async (userId, ownerId, text) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(
            `
                INSERT INTO notifications (owner_id, text, dispatcher)
                VALUES (?, ?, ?);
            `,
            [ownerId, text, userId]
        );

        return result.insertId;
    } finally {
        if (connection) connection.release();
    }
};

const getNotificationsByFollowedId = async (id) => {
    let connection;
    try {
        connection = await getConnection();

        const [result] = await connection.query(
            `
                SELECT n.*
                FROM notifications n
                INNER JOIN follows f ON f.followed = n.owner_id
                WHERE f.followed = ?
                    AND n.dispatcher <> ?
                    AND n.isRead = 0;
            `,
            [id, id]
        );

        return result;
    } finally {
        if (connection) connection.release();
    }
}

const getNotificationsByFollowerId = async (id) => {
    let connection;
    try {
        connection = await getConnection();

        const [result] = await connection.query(
            `
                SELECT n.*
                FROM notifications n
                INNER JOIN follows f ON f.followed = n.owner_id
                WHERE f.follower_id = ?
                    AND n.dispatcher <> ?
                    AND n.isRead = 0;
            `,
            [id, id]
        );

        return result;
    } finally {
        if (connection) connection.release();
    }
}

const deleteNotificationById = async (id) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      await connection.query(
        `
        UPDATE notifications
        SET isRead = 1
        WHERE id = ?
      `,
        [id]
      );
  
      return;
    } finally {
      if (connection) connection.release();
    }
}

module.exports = {
    createNotification,
    getNotificationsByFollowedId,
    deleteNotificationById,
    getNotificationsByFollowerId
};