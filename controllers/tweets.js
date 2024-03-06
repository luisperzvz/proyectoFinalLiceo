//DEFINIMOS LOS CONTROLADORES DE LOS TWEETS

const {
  createTweet,
  getAllTweets,
  getTweetById,
  deleteTweetById,
} = require('../db/tweets');
const { generateError, createPathIfNotExists } = require('../helpers');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');
const { emitEvent } = require('../sockets/socketManager');
const { createNotificationToOwnerService, createNotificationToFollowersService } = require("./notifications");



const getTweetsController = async (req, res, next) => {
    //CUALQUIER ERROR QUE SE ENCUENTRE EN EL TRY, PASARÁ AL CATCH, EL CUAL LO REDIGIRÁ A SERVER.JS DONDE SE ENCUENTRAN EL GESTOR DE ERRORES
    try {
        const tweets = await getAllTweets();
        res.send({
            status: "Ok",
            data: tweets,
        });

    } catch(error) {
        next(error);
    }
};


const newTweetController = async (req, res, next) => {
    try {
      const { text } = req.body;
  
      if (!text || text.length > 280) {
        throw generateError(
          'El texto del tweet debe existir y ser menor de 280 caracteres',
          400
        );
      }
      let imageFileName;
  
      if (req.files && req.files.image) {
        // Creo el path del directorio uploads
        const uploadsDir = path.join(__dirname, '../uploads');
  
        // Creo el directorio si no existe
        await createPathIfNotExists(uploadsDir);
  
        // Procesar la imagen
        const image = sharp(req.files.image.data);
        image.resize(500);
  
        // Guardo la imagen con un nombre aleatorio en el directorio uploads
        imageFileName = `${nanoid(24)}.jpg`;
  
        await image.toFile(path.join(uploadsDir, imageFileName));
      }
  
      const id = await createTweet(req.userId, text, imageFileName);
  
      const tweet = await getTweetById(id);

      if (tweet) {
        await createNotificationToFollowersService(tweet.user_id, tweet.user_id, `${tweet.email} ha creado un nuevo tweet.`, 'NewTweet');
      }
  
      res.send({
        status: 'ok',
        data: tweet, 
      });
    } catch (error) {
      next(error);
    }
  };



  const getSingleTweetController = async (req, res, next) => {
    try {
      const { id } = req.params;
      const tweet = await getTweetById(id);
  
      res.send({
        status: 'ok',
        data: tweet,
      });
    } catch (error) {
      next(error);
    }
  };



const deleteTweetController = async (req, res, next) => {
    //CUALQUIER ERROR QUE SE ENCUENTRE EN EL TRY, PASARÁ AL CATCH, EL CUAL LO REDIGIRÁ A SERVER.JS DONDE SE ENCUENTRAN EL GESTOR DE ERRORES

    try {

        //req.userId
        const {id} = req.params;
    
        // Conseguir la información del tweet que quiero borrar
        const tweet = await getTweetById(id);
    
        // Comprobar que el usuario del token es el mismo que creó el tweet
        if (req.userId !== tweet.user_id) {
          throw generateError(
            `Estás intentando borrar un tweet que no es tuyo`,
            401
          );
        }
    
        // Borrar el tweet
        await deleteTweetById(id);

        emitEvent("DeleteTweet", id);
    
        res.send({
          status: 'ok',
          message: `El tweet con id: ${id} fue borrado`,
        });
      } catch (error) {
        next(error);
      }
    };

const reTweetController = async (req, res, next) => {
  try {
    const { tweetId } = req.body;

    const tweet = await getTweetById(tweetId);

    const id = await createTweet(req.userId, tweet.text, tweet.image);

    const reTweet = await getTweetById(id);

    if (tweet.user_id !== reTweet.user_id) {
      await createNotificationToOwnerService(tweet.user_id, reTweet.user_id, `${reTweet.email} ha dado retweet a tu publicación.`, 'NewReTweet');
      await createNotificationToFollowersService(tweet.user_id, reTweet.user_id, `${reTweet.email} ha dado retweet a la publicación de ${tweet.email}.`, 'NewReTweet');
    }

    res.send({
      status: 'ok',
      data: reTweet, 
    });
  } catch (error) {
    next(error);
  }
};

//AQUI LOS EXPORTAMOS
module.exports = {
  newTweetController,
  getSingleTweetController,
  getTweetsController,
  deleteTweetController,
  reTweetController
};