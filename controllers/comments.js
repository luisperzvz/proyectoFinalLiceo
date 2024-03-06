const {
    createComment,
    getCommentsByTweetId,
    getSingleCommentByTweetId,
    deleteSingleCommentById
} = require("../db/comments");
const { emitEvent } = require('../sockets/socketManager');
const { createNotificationToOwnerService, createNotificationToFollowersService } = require("./notifications");

const newCommentController = async (req, res, next) => {
    try {
        const { comment, tweetId } = req.body;

        const id = await createComment(req.userId, comment, tweetId);

        const result = await getSingleCommentByTweetId(tweetId, id);

        if (result.tweet_owner !== result.comment_owner) {
            await createNotificationToOwnerService(result.tweet_owner, result.comment_owner, `${result.email} ha comentado tu publicación.`, 'NewComment');
            await createNotificationToFollowersService(result.tweet_owner, result.comment_owner, `${result.email} ha comentado la publicación de ${result.tweet_owner_email}.`, 'NewComment');
        } else {
            await createNotificationToFollowersService(result.tweet_owner, result.tweet_owner, `${result.email} ha comentado su publicación.`, 'NewComment');
        }

        res.send({
            status: 'ok',
            data: result, 
        });
    } catch (error) {
        next(error);
    }
}

const getCommentsByTweetIdController = async (req, res, next) => {
    try {
        const { tweetId } = req.params;

        const result = await getCommentsByTweetId(tweetId);

        res.send({
            status: 'ok',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

const deleteCommentByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        await deleteSingleCommentById(id);

        emitEvent("DeleteComment", id);

        res.send({
            status: 'ok',
            message: `El comentario con id: ${id} fue borrado.`
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    newCommentController,
    getCommentsByTweetIdController,
    deleteCommentByIdController
};