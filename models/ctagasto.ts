import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";


/* const Ctagasto = db.define('cuentagastos', {
    nombre: {
        type: DataTypes.STRING
    },
    saldocuenta: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    saldocuenta_base: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    segmentocuenta: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    exchangerate: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tipocuenta_id: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    ceco_id: {
        type: DataTypes.INTEGER
    },
    trxcurrency_id: {
        type: DataTypes.INTEGER
    },
    subcentrocosto: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    unidadnegocio: {
        type: DataTypes.STRING,
        defaultValue: null
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

export class Ctagasto extends Model {}
Ctagasto.init({
    nombre: {
        type: DataTypes.STRING
    },
    saldocuenta: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    saldocuenta_base: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    segmentocuenta: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    exchangerate: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tipocuenta_id: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    ceco_id: {
        type: DataTypes.INTEGER
    },
    trxcurrency_id: {
        type: DataTypes.INTEGER
    },
    subcentrocosto: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    unidadnegocio: {
        type: DataTypes.STRING,
        defaultValue: null
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
    modelName: "cuentagastos"
})


/* export default Ctagasto; */