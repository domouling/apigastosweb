import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";


/* const Tpogasto = db.define('tipogastos', {
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


export class Tpogasto extends Model {}
Tpogasto.init({
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
    modelName: "tipogastos"
})
/* export default Tpogasto; */
