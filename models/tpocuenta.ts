import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";


/* const Tpocuenta = db.define('tipocuenta', {
    nombre: {
        unique: true,
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
}); */

export class Tpocuenta extends Model {}
Tpocuenta.init({
    nombre: {
        unique: true,
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
    modelName: "tipocuenta"
})

/* export default Tpocuenta; */