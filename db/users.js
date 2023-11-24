const bcrypt = require("bcrypt");
const { generateError } = require("../helpers");
const {getConnection} = require("./db");
//CREAMOS UN USUARIO EN LA BASE DE DATOS Y NOS DEVUELVE SU ID
const createUser = async (email, password) => {
    let connection;
    try {
        connection = await getConnection();

    //COMPROBAMOS QUE NO HAY OTRO USUARIO CON ESE EMAIL
    const [user] = await connection.query(
        `
        SELECT id FROM users WHERE email = ?
        `,
        [email]
    );

    if (user.lenght > 0) {
        throw generateError(`Ya hay un usuario con este email en la base de datos`, 409);
    }


    //ENCRIPTAMOS LA CONTRASEÑA
    const passwordHash = await bcrypt.hash(password, 8);

    //CREAMOS EL USUARIO
    const [newUser] = await connection.query(
        `
        INSERT INTO users (email, password) VALUES(?, ?)
        `,
        [email, passwordHash]

    );



    //DEVOLVEMOS SU ID
    return newUser.insertId;


    } finally {
        if(connection) connection.release();

    }


};


module.exports = {
    createUser,
};