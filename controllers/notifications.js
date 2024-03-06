const {
    getNotificationsByFollowedId,
    createNotification,
    getNotificationsByFollowerId,
    deleteNotificationById
} = require("../db/notifications")
const { getAllFollowersByUserId } = require("../db/follows")
const { generateError } = require("../helpers");
const { emitEvent } = require('../sockets/socketManager');

const getNotificationsController = async (req, res, next) => {
    try {

        const result = await getNotificationsByFollowedId(req.userId);
        const result2 = await getNotificationsByFollowerId(req.userId);

        res.send({
            status: 'ok',
            data: [...result, ...result2], 
        });
    } catch (error) {
        next(error);
    }
}

const deleteNotificationController = async (req, res, next) => {
    try {
        const { id } = req.params;

        await deleteNotificationById(id);

        res.send({
            status: 'ok',
            message: `La notificación con id: ${id} fue borrada.`
        });
    } catch (error) {
        next(error);
    }
}

const createNotificationToOwnerService = async (ownerId, userId, text, eventName) => {
    try {

        await createNotification(userId, ownerId, text);

        emitEvent(eventName + "_owner", ownerId)

    } catch (error) {
        throw generateError(error.message, 500);
    }
}

const createNotificationToFollowersService = async (ownerId, userId, text, eventName) => {
    try {

        await createNotification(userId, userId, text);

        let followers = [...await getAllFollowersByUserId(ownerId), ...await getAllFollowersByUserId(userId)]

        followers.forEach(follower => emitEvent(eventName + "_follower", { owner: follower.followed, user: follower.follower_id }));

    } catch (error) {
        throw generateError(error.message, 500);
    }
}

module.exports = {
    getNotificationsController,
    createNotificationToOwnerService,
    createNotificationToFollowersService,
    deleteNotificationController
}