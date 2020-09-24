const redis = require('redis');
let client;
const logger = require('../logging/winston_logger');

const connectRedis = () => {
    return new Promise( (resolve, reject) => {
        client = redis.createClient();
        client.on( 'connect', (err, res) => {
            logger.info( "Succesfully connected to Redis!", {res});
            return resolve( true );
        });

        client.on( 'error', (err, res) => {
            logger.error( "Error in connecting to Redis!", {error: err});
            return reject( new Error('Error in connecting to redis !'));
        });
    });

};

const getValue = (key) => {
    return new Promise( (resolve, reject) => {

        client.get( key, (err, res) => {
            if(err)
            {
                logger.error( "Error in getting value!", {error: err});
                return reject( new Error('Error in getting value!'));
            }

            logger.info( "Succesfully getted value in redis!", {res});
            return resolve( res );
            
        });
    });
};

const setValue = (key, value) => {

    return new Promise( (resolve, reject) => {

        client.set( key, value, (err, res) => {
            if(err)
            {
                logger.error( "Error in setting value!", {error: err});
                return reject( new Error('Error in setting value!'));
            }

            logger.info( "Succesfully setted value in redis!", {res});
            return resolve( true );
            
        });
    });
};

const deleteKey = () => {

};

module.exports = {
    connectRedis,
    getValue,
    setValue,
    deleteKey
}