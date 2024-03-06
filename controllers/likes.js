const {
    createLike,
    getLikesByTweetId,
    deleteSingleLikeById,
    getSingleLikeByTweetId
} = require("../db/likes");
const { emitEvent } = require('../sockets/socketManager');
const { createNotificationToOwnerService, createNotificationToFollowersService } = require("./notifications");

const newLikesController = async (req, res, next) => {
    try {
        const { tweetId } = req.body;

        const id = await createLike(req.userId, tweetId);

        const result = await getSingleLikeByTweetId(tweetId, id);

        if (result.user_id !== result.like_owner) {
            await createNotificationToOwnerService(result.user_id, result.like_owner, `${result.email} le ha dado like a tu publicación.`, 'NewLike');
            await createNotificationToFollowersService(result.user_id, result.like_owner, `${result.email} le ha dado like a la publicación de ${result.tweet_owner_email}.`, 'NewLike');
        } else {
            await createNotificationToFollowersService(result.user_id, result.user_id, `${result.email} le ha dado like a su publicación.`, 'NewLike');
        }

        res.send({
            status: 'ok',
            data: result, 
        });
    } catch (error) {
        next(error);
    }
}

const deleteLikeByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        await deleteSingleLikeById(id);

        emitEvent("DeleteLike", id);

        res.send({
            status: 'ok',
            message: `El like con id: ${id} fue borrado.`
        });
    } catch (error) {
        next(error);
    }
}

const getLikesByTweetIdController = async (req, res, next) => {
    try {
        const { tweetId } = req.params;

        const result = await getLikesByTweetId(tweetId);

        res.send({
            status: 'ok',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    newLikesController,
    deleteLikeByIdController,
    getLikesByTweetIdController
};