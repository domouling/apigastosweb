import { Sequelize, QueryTypes, Op } from 'sequelize';

const db = new Sequelize('gastos', 'tato', 'Kxqw_10801', {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false
});

export default db;