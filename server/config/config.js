/**
 * PORT
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * EVIRONMENT
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * BBDD
 */
let urlServerBBDD;
if(process.env.NODE_ENV === 'dev'){
    urlServerBBDD = 'mongodb://localhost:27017/intranet';
}else{
    urlServerBBDD = process.env.MONGO_URI;
}

process.env.SERVER_BBDD = urlServerBBDD;

/**
 * Datetime for token
 */

process.env.TOKEN_TIME = 60*60*24*30;

/**
 * SEED auth
 */
process.env.SEED_AUTH = process.env.SEED_AUTH || 'este-es-el-seed-desarrollo'

/**
 * Google Client ID
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || 'CLIENT_ID_GOOGLE_API'
