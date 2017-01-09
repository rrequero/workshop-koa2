const logger = require('logger');
const assert = require('assert');
const request = require('superagent').agent();
const mongoose = require('mongoose');

require('should');

const UserModel = require('models/user.model');

let instance = null;
let BASE_URL = null;

const user = {
	email:"pepe@gmail.com",
	role: "USER",
	name: "pepe"
};
let userCreated = null;

describe('User API', () => {
    before(async () => {       
        const app = require('app');
        BASE_URL = `http://localhost:${app.address().port}`;     
        await UserModel.remove({});
        userCreated = await new UserModel(user).save();
    });

    it('Get users correctly', async() => {
        let response = null;
        try {
            response = await request.get(`${BASE_URL}/api/v1/user`).send();
        } catch (e) {
            logger.error(e);
            assert(false, 'Exception throwed');
        }
        response.status.should.equal(200);
        response.body.should.have.property('data').with.lengthOf(1);        
        response.body.data[0].should.have.property('attributes');
        response.body.data[0].attributes.should.have.property('email', user.email);
        response.body.data[0].attributes.should.have.property('role', user.role);
        response.body.data[0].attributes.should.have.property('email', user.email);
        response.body.data[0].should.have.property('id', userCreated.id);
    });

    it('Get user by id correctly', async() => {
        let response = null;
        try {
            response = await request.get(`${BASE_URL}/api/v1/user/${userCreated.id}`).send();
        } catch (e) {
            logger.error(e);
            assert(false, 'Exception throwed');
        }
        response.status.should.equal(200);
        response.body.should.have.property('data');        
        response.body.data.should.have.property('attributes');
        response.body.data.attributes.should.have.property('email', user.email);
        response.body.data.attributes.should.have.property('role', user.role);
        response.body.data.attributes.should.have.property('email', user.email);
        response.body.data.should.have.property('id', userCreated.id);
    });

    it('Create user with error of validation', async() => {
        let response = null;
        try {
            response = await request.post(`${BASE_URL}/api/v1/user`).send({
                email: user.email,
                role: user.role
            });
            assert(false, 'Exception not throwed');
        } catch (e) {
            e.status.should.equal(400);
            e.response.body.should.have.property('errors').with.length(1);        
            e.response.body.errors[0].should.have.property('source');
            e.response.body.errors[0].source.should.deepEqual({
                parameter: 'name'
            });
            e.response.body.errors[0].should.have.property('code', 'invalid_body_parameter');
            e.response.body.errors[0].should.have.property('title', 'Invalid body parameter');
            e.response.body.errors[0].should.have.property('detail', 'name can not be empty.');     
        }       
        
    });

    

    after(() => {
        if (instance) {
            instance.close();
        }
    });
});
