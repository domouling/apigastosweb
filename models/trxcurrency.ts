import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";


/* const Trxcurrency = db.define('trxcurrency', {
    isocode: {
        unique: true,
        type: DataTypes.STRING
    },
    nombre: {
        type: DataTypes.STRING
    },
    simbolo: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
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
    freezeTableName: true
}); */

export class Trxcurrency extends Model {}
Trxcurrency.init({
    id:{
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    isocode: {
        unique: true,
        type: DataTypes.STRING
    },
    nombre: {
        type: DataTypes.STRING
    },
    simbolo: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
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
    modelName: "trxcurrency",
    freezeTableName: true,
    tableName: "trxcurrency"
})
/* export default Trxcurrency; */