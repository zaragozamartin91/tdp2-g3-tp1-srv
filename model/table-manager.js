const BusinessUser = require('./BusinessUser');
//const Role = require('./Role');
const ApplicationServer = require('./ApplicationServer');
const ApplicationUser = require('./ApplicationUser');
const Car = require('./Car');
const TokenModel = require('./Token');
const Trip = require('./Trip');
const Rule = require('./Rule');
const Transaction = require('./Transaction');
const Hit = require('./Hit');
const RuleCommit = require('./RuleCommit');

const dbManager = require('./db-manager');
const logger = require('log4js').getLogger('table-manager');

// BusinessUser-----------------------------------------------------------------------------

/**
 * Crea la tabla de usuarios de negocio.
 * @param {Function} callback Funcion a invocar luego de crear la tabla.
 */
exports.createBusinessUsersTable = function (callback) {
    const sql = `CREATE TABLE ${BusinessUser.table} (
        id ${BusinessUser.idType} PRIMARY KEY,
        _ref VARCHAR(128) NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        password VARCHAR(256) NOT NULL,
        name VARCHAR(32) DEFAULT '${BusinessUser.DEFAULT_NAME}',
        surname VARCHAR(32) DEFAULT '${BusinessUser.DEFAULT_SURNAME}',
        roles JSON DEFAULT '[]'
    )`;
    dbManager.query(sql, [], err => {
        if (err) logger.error(err);
        callback();
    });
};

exports.dropBusinessUsersTable = function (callback) {
    dbManager.query(`DROP TABLE ${BusinessUser.table}`, [], err => {
        if (err) logger.error(err);
        callback();
    });
};

// ApplicationServer ----------------------------------------------------------------------------------------

exports.createApplicationServersTable = function (callback) {
    dbManager.query(`CREATE TABLE ${ApplicationServer.table} (
        id VARCHAR(64) NOT NULL PRIMARY KEY,
        _ref VARCHAR(256) NOT NULL,
        created_by ${BusinessUser.idType} REFERENCES ${BusinessUser.table}(id) ON DELETE SET NULL,
        created_time TIMESTAMP DEFAULT now(),
        name VARCHAR(64) UNIQUE NOT NULL,
        last_conn TIMESTAMP DEFAULT now(),
        url VARCHAR(128) DEFAULT ''
    )`, [], callback);
};

exports.dropApplicationServersTable = function (callback) {
    dbManager.query(`DROP TABLE ${ApplicationServer.table}`, [], err => {
        if (err) logger.error(err);
        callback();
    });
};

// TokenModel -------------------------------------------------------------------------------------------------

exports.createTokensTable = function (callback) {
    const sql = `CREATE TABLE ${TokenModel.table} (
        token VARCHAR(256) NOT NULL,
        expiresAt TIMESTAMP NOT NULL,
        owner VARCHAR(64) DEFAULT '',
        counter SERIAL
    )`;
    dbManager.query(sql, [], err => {
        if (err) console.error(err);
        callback(err);
    });
};

exports.dropTokensTable = function (callback) {
    const sql = `DROP TABLE ${TokenModel.table}`;
    dbManager.query(sql, [], err => {
        if (err) console.error(err);
        callback(err);
    });
};

// ApplicationUser -------------------------------------------------------------------------------------------------------

// EL BALANCE LO GUARDO COMO UN JSON
exports.createApplicationUsersTable = function (callback) {
    const sql = `CREATE TABLE ${ApplicationUser.table} (
        id ${ApplicationUser.idType} PRIMARY KEY,
        _ref VARCHAR(128) NOT NULL,
        applicationOwner ${ApplicationServer.idType} REFERENCES ${ApplicationServer.table}(id) ON DELETE CASCADE, 
        username VARCHAR(64) NOT NULL,
        password VARCHAR(256) NOT NULL,
        name VARCHAR(32) DEFAULT '${ApplicationUser.DEFAULT_NAME}',
        surname VARCHAR(32) DEFAULT '${ApplicationUser.DEFAULT_SURNAME}',
        country VARCHAR(32),
        email VARCHAR(64),
        birthdate TIMESTAMP,
        type VARCHAR(16),
        images JSON DEFAULT '[]',
        balance JSON DEFAULT '[]',
        fb JSON DEFAULT '{}',
        UNIQUE (applicationOwner, username)
    )`;
    dbManager.query(sql, [], err => {
        if (err) logger.error(err);
        callback();
    });
};

exports.dropApplicationUsersTable = function (callback) {
    const sql = `DROP TABLE ${ApplicationUser.table}`;
    dbManager.query(sql, [], err => {
        if (err) logger.error(err);
        callback();
    });
};

// Car -------------------------------------------------------------------------------------------------------

exports.createCarsTable = function (callback) {
    const sql = `CREATE TABLE ${Car.table} (
        id SERIAL PRIMARY KEY,
        _ref VARCHAR(128) NOT NULL,
        owner ${ApplicationUser.idType} REFERENCES ${ApplicationUser.table}(id) ON DELETE CASCADE,
        properties JSON DEFAULT '[]'
    )`;
    dbManager.query(sql, [], err => {
        if (err) logger.error(err);
        callback();
    });
};

exports.dropCarsTable = function (callback) {
    const sql = `DROP TABLE ${Car.table}`;
    dbManager.query(sql, [], err => {
        if (err) logger.error(err);
        callback();
    });
};

// Trip -------------------------------------------------------------------------------------------------------

/* NOTA: LOS NOMBRES DE COLUMNA start Y end SON INVALIDOS, POR LO CUAL SE ASIGNAN LOS NOMBRES DE COLUMNA
_start Y _end. 
La distancia se mide en METROS
El tiempo se mide en segundos*/
exports.createTripsTable = function (callback) {
    const sql = `CREATE TABLE ${Trip.TABLE} (
        id SERIAL PRIMARY KEY, 
        applicationOwner ${ApplicationServer.idType} REFERENCES ${ApplicationServer.table}(id) ON DELETE CASCADE , 
        driver ${ApplicationUser.idType} REFERENCES ${ApplicationUser.table}(id) ON DELETE CASCADE, 
        passenger ${ApplicationUser.idType} REFERENCES ${ApplicationUser.table}(id) ON DELETE CASCADE, 
        _start JSON DEFAULT '{}', 
        _end JSON DEFAULT '{}', 
        totalTime INTEGER DEFAULT 0, 
        waitTime INTEGER DEFAULT 0, 
        travelTime INTEGER DEFAULT 0, 
        distance INTEGER DEFAULT 0,
        route JSON DEFAULT '[]', 
        cost JSON DEFAULT '{}',
        date TIMESTAMP DEFAULT NOW()
    )`;
    dbManager.queryPromise(sql, [])
        .then(() => callback())
        .catch(cause => {
            logger.error(cause);
            callback();
        });
};

exports.dropTripsTable = function (callback) {
    dbManager.queryPromise(`DROP TABLE ${Trip.TABLE}`, [])
        .then(() => callback())
        .catch(cause => {
            logger.error(cause);
            callback();
        });
};

// Rule -------------------------------------------------------------------------------------------------------

exports.createRulesTable = function (callback) {
    const sql = `CREATE TABLE ${Rule.TABLE} (
        id SERIAL PRIMARY KEY, 
        _ref VARCHAR(128) NOT NULL,
        language VARCHAR(32) DEFAULT '${Rule.DEFAULT_LANGUAGE}',
        blob JSON NOT NULL,
        active BOOLEAN,
        priority INTEGER DEFAULT ${Rule.DEFAULT_PRIORITY}
    )`;
    dbManager.queryPromise(sql, [])
        .then(() => callback())
        .catch(cause => {
            console.error(cause);
            callback();
        });
};

exports.dropRulesTable = function (callback) {
    const sql = `DROP TABLE ${Rule.TABLE}`;
    dbManager.queryPromise(sql, [])
        .then(() => callback())
        .catch(cause => {
            console.error(cause);
            callback();
        });
};

// RuleCommit -------------------------------------------------------------------------------------------------------

//author, message, timestamp, blob, active
exports.createRuleCommitsTable = function (callback) {
    const sql = `CREATE TABLE ${RuleCommit.table} (
        id SERIAL PRIMARY KEY, 
        rule integer REFERENCES ${Rule.TABLE} ON DELETE CASCADE,
        author ${BusinessUser.idType} REFERENCES ${BusinessUser.table}(id) ON DELETE CASCADE,
        message VARCHAR(128),
        timestamp TIMESTAMP DEFAULT now(),
        blob JSON NOT NULL,
        active BOOLEAN
    )`;
    dbManager.queryPromise(sql, [])
        .then(() => callback())
        .catch(cause => {
            console.error(cause);
            callback();
        });
};

exports.dropRuleCommitsTable = function (callback) {
    const sql = `DROP TABLE ${RuleCommit.table}`;
    dbManager.queryPromise(sql, [])
        .then(() => callback())
        .catch(cause => {
            console.error(cause);
            callback();
        });
};

// Transaction -------------------------------------------------------------------------------------------------------

//id, currency, value, date, user, trip, done
exports.createTransactionsTable = function (callback) {
    const sql = `CREATE TABLE ${Transaction.table} (
        id VARCHAR(128), 
        currency VARCHAR(3) NOT NULL,
        value DECIMAL(9,2),
        date TIMESTAMP DEFAULT now(),
        appusr ${ApplicationUser.idType} REFERENCES ${ApplicationUser.table}(id) ON DELETE CASCADE,
        trip ${Trip.idType} REFERENCES ${Trip.TABLE}(id) ON DELETE CASCADE,
        done BOOLEAN,
        UNIQUE (id,appusr)
    )`;
    dbManager.queryPromise(sql, [])
        .then(() => callback())
        .catch(cause => {
            console.error(cause);
            callback();
        });
};

exports.dropTransactionsTable = function (callback) {
    const sql = `DROP TABLE ${Transaction.table}`;
    dbManager.queryPromise(sql, [])
        .then(() => callback())
        .catch(cause => {
            console.error(cause);
            callback();
        });
};


// Hit -------------------------------------------------------------------------------------------------------

//id, server, url, date
exports.createHitTable = function (callback) {
    const sql = `CREATE TABLE ${Hit.table} (
        id SERIAL PRIMARY KEY, 
        server ${ApplicationServer.idType} REFERENCES ${ApplicationServer.table}(id) ON DELETE CASCADE ,
        method VARCHAR(8),
        url VARCHAR(128),
        date TIMESTAMP DEFAULT now()
    )`;
    dbManager.queryPromise(sql, [])
        .then(() => callback())
        .catch(cause => {
            console.error(cause);
            callback();
        });
};

exports.dropHitTable = function (callback) {
    const sql = `DROP TABLE ${Hit.table}`;
    dbManager.queryPromise(sql, [])
        .then(() => callback())
        .catch(cause => {
            console.error(cause);
            callback();
        });
};