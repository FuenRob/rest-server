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
    urlServerBBDD = 'mongodb+srv://<user>:<password>@cluster0-nixve.mongodb.net/intranet';
}

process.env.urlServerBBDD = urlServerBBDD;
