require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;

  try {
    connection = await getConnection();

    console.log('Borrando tablas existentes');
    await connection.query('DROP TABLE IF EXISTS notifications;');
    await connection.query('DROP TABLE IF EXISTS follows;');
    await connection.query('DROP TABLE IF EXISTS likes;');
    await connection.query('DROP TABLE IF EXISTS comments;');
    await connection.query('DROP TABLE IF EXISTS tweets;');
    await connection.query('DROP TABLE IF EXISTS users;');

    console.log('Creando tablas');

    await connection.query(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE tweets (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER NOT NULL,
        text VARCHAR(280) NOT NULL,
        image VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);

    await connection.query(`
      CREATE TABLE comments (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        tweet INTEGER NOT NULL,
        comment_owner INTEGER NOT NULL,
        content VARCHAR(280) NOT NULL,
        tweet_owner INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (comment_owner) REFERENCES users(id),
        FOREIGN KEY (tweet_owner) REFERENCES users(id),
        FOREIGN KEY (tweet) REFERENCES tweets(id)
      );
    `);

    await connection.query(`
      CREATE TABLE likes (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        tweet INTEGER NOT NULL,
        like_owner INTEGER NOT NULL,
        FOREIGN KEY (like_owner) REFERENCES users(id),
        FOREIGN KEY (tweet) REFERENCES tweets(id)
      );
    `);

    await connection.query(`
      CREATE TABLE follows (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        follower_id INTEGER NOT NULL,
        followed INTEGER NOT NULL,
        FOREIGN KEY (follower_id) REFERENCES users(id),
        FOREIGN KEY (followed) REFERENCES users(id)
      );
    `);

    await connection.query(`
      CREATE TABLE notifications (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        owner_id INTEGER NOT NULL,
        dispatcher INTEGER NOT NULL,
        text VARCHAR(255) NOT NULL,
        isRead boolean DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id),
        FOREIGN KEY (dispatcher) REFERENCES users(id)
      );
    `);

  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main().catch((error) => console.error(error));