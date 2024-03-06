const {
    createFollow,
    getSingleFollowById,
    deleteSingleFollowById,
    getSingleFollowByFollowedId
} = require("../db/follows");
const { emitEvent } = require('../sockets/socketManager');
const { createNotificationToOwnerService, createNotificationToFollowersService } = require("./notifications");

const newFollowController = async (req, res, next) => {
    try {
        const { followed } = req.body;

        const id = await createFollow(req.userId, followed);

        const result = await getSingleFollowById(id);

        if (result.followed !== result.follower_id) {
            await createNotificationToOwnerService(result.followed, result.follower_id, `${result.email} ha comenzado a seguirte.`, 'NewFollow');
            await createNotificationToFollowersService(result.followed, result.follower_id, `${result.email} ha comenzado a seguir a ${result.followed_email}.`, 'NewFollow');
        }

        res.send({
            status: 'ok',
            data: result, 
        });
    } catch (error) {
        next(error);
    }
}

const deleteFollowByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        await deleteSingleFollowById(id);

        emitEvent("DeleteFollow", id);

        res.send({
            status: 'ok',
            message: `El follow con id: ${id} fue borrado.`
        });
    } catch (error) {
        next(error);
    }
}

const getFollowByFollowedIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await getSingleFollowByFollowedId(req.userId, id);

        res.send({
            status: 'ok',
            data: result ? result : {},
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    newFollowController,
    deleteFollowByIdController,
    getFollowByFollowedIdController
};