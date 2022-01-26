import { Sequelize } from 'sequelize';

const db = new Sequelize('gastos', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false
});

export default db;