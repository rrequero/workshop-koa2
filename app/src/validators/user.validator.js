const logger = require('logger');
const ErrorSerializer = require('serializers/error.serializer');

class UserValidator {
    static async create(ctx, next) {
        logger.debug('Validating body for create user');
        ctx.checkBody('name').notEmpty().len(2, 100);
        ctx.checkBody('email').notEmpty().isEmail();
        ctx.checkBody('role').optional().in(["USER","ADMIN"], "role not supported!");

        if (ctx.errors) {
            ctx.body = ErrorSerializer.serializeValidationBodyErrors(ctx.errors);
            ctx.status = 400;
            return;
        }
        await next();
    }

    static async update(ctx, next) {
        logger.debug('Validating body for update user');
        ctx.checkBody('name').optional().len(2, 100);
        ctx.checkBody('email').optional().isEmail();
        ctx.checkBody('role').optional().in(["USER","ADMIN"], "role not supported!")

        if (ctx.errors) {
            ctx.body = ErrorSerializer.serializeValidationBodyErrors(ctx.errors);
            ctx.status = 400;
            return;
        }
        await next();
    }
}

module.exports = UserValidator;