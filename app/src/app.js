const Koa = require('koa');
const logger = require('logger');
const koaLogger = require('koa-logger');
const config = require('config');
const loader = require('loader');
const convert = require('koa-convert');
const validate = require('koa-validate');
const ErrorSerializer = require('serializers/error.serializer');
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const mongoUri = `mongodb://${config.get('mongodb.host')}:${config.get('mongodb.port')}/${config.get('mongodb.database')}`;

const koaBody = require('koa-body')({
    multipart: true,
    jsonLimit: '50mb',
    formLimit: '50mb',
    textLimit: '50mb'
});
mongoose.connect(mongoUri, (err) => {
    if (err) {
        logger.error(err);
        throw new Error(err);
    }
});

const app = new Koa();

app.use(convert(koaBody));

validate(app);

app.use(async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        let error = err;
        try {
            error = JSON.parse(err);
        } catch (e) {
            logger.error('Error parse');
        }
        ctx.status = error.status || 500;
        logger.error(error);
        ctx.body = ErrorSerializer.serializeError(ctx.status, error.message);
        if (process.env.NODE_ENV === 'prod' && this.status === 500) {
            ctx.body = 'Unexpected error';
        }
        ctx.response.type = 'application/vnd.api+json';
    }

});

app.use(koaLogger());

loader.loadRoutes(app);
const instance = app.listen(process.env.PORT, () => {
    logger.info('Server started in ', process.env.PORT);
});

module.exports = instance;
