import { DataTypes, Model, DATE } from "sequelize";
import db from "../db/connections";

import { Ceco } from "./ceco";

/* import bcryptjs from 'bcryptjs'; */

/* export interface ILoginUser {
    nombre: string,
    email: string,
    password: string
} */

/* const User = db.define('User', {
    nombre: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'ROLE_USER'
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    email: {
        unique: true,
        type: DataTypes.STRING
    },
    imagen: {
        type: DataTypes.STRING
    },
    ceco_id: {
        type: DataTypes.INTEGER
    },
    ultimasesion: {
        type: DataTypes.STRING
    },
    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE
    },
    updatedAt: {
        field: 'updated_at',
        type: DATE
    }
}); */

export class User extends Model {}
User.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
        type: DataTypes.STRING,
        defaultValue: 'ROLE_USER'
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    email: {
        unique: true,
        type: DataTypes.STRING
    },
    imagen: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    ceco_id: DataTypes.INTEGER,
    ultimasesion: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE
    },
    updatedAt: {
        field: 'updated_at',
        type: DATE
    }
}, {
    sequelize: db,
    modelName: "users"
});

User.belongsTo(Ceco, {
    foreignKey: 'ceco_id'
});
