module.exports = {
    HOST: 'localhost',
    USER: "c##WDA1",
    PASSWORD: "1234",
    DB: "oracleDB", 
    PORT: 1521,
    SID: 'orcl',
    dialect: "oracle",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};