const Router = require('koa-router');
const logger = require('logger');
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const Promise = require('bluebird');
const ErrorSerializer = require('serializers/error.serializer');
const UserSerializer = require('serializers/user.serializer');
const UserValidator = require('validators/user.validator');
const UserModel = require('models/user.model');

const router = new Router({
    prefix: '/user',
});


class UserRouter {

    static async get(ctx) {
        logger.info('Obtaining users');
        const users = await UserModel.find();
        ctx.body = UserSerializer.serialize(users);
    }

    static async getById(ctx) {
        logger.info(`Obtaining user by id ${ctx.params.id}`);
        const user = await UserModel.findById(ctx.params.id);
        ctx.body = UserSerializer.serialize(user);
    }

    static async create(ctx) {
        logger.info('Creating user');
        const user = await new UserModel(ctx.request.body).save();
        ctx.body = UserSerializer.serialize(user);
    }

    static async update(ctx) {
        logger.info(`Update user by id ${ctx.params.id}`);
        let user = await UserModel.findById(ctx.params.id);
        if (!user) {
            ctx.throw(404, 'User not found');
            return;
        }
        user = Object.assign(user, ctx.request.body);
        await user.save();
        ctx.body = UserSerializer.serialize(user);
    }

    static async delete(ctx) {
        logger.info(`Deleting user by id ${ctx.params.id}`);
        const user = await UserModel.findByIdAndRemove(ctx.params.id);
        if (!user) {
            logger.debug('not user');
            ctx.throw(404, 'User not found');
            return;
        }
        ctx.status = 204;
    }

}


router.get('/', UserRouter.get);
router.get('/:id', UserRouter.getById);
router.post('/', UserValidator.create, UserRouter.create);
router.patch('/:id', UserValidator.update, UserRouter.update);
router.delete('/:id', UserRouter.delete);

module.exports = router;
