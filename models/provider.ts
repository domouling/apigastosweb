import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";


/* const Provider = db.define('proveedores', {
    nombre: {
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

export class Provider extends Model {}
Provider.init({
    nombre: {
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
    modelName: "proveedores",
    tableName: "proveedores",
    freezeTableName: true
})

/* export default Provider; */