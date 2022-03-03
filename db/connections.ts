import { Sequelize, QueryTypes, Op } from 'sequelize';

/*const db = new Sequelize('gastos', 'bill', 'Kxqw_10801', {
    host: 'vps-2399293-x.dattaweb.com',
    dialect: 'mysql',
    //logging: false
});*/

const db = new Sequelize('gastos', 'tato', 'Kxqw_10801', {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false
});

export default db;