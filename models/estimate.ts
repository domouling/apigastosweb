import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";
import { Ceco } from "./ceco";
import { Tpogasto } from "./tpogasto";
import { Trxcurrency } from "./trxcurrency";

export class Estimate extends Model {}
Estimate.init({
    id:{
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fechainicio: {
        type: DataTypes.DATE
    },
    fechafin: {
        type: DataTypes.DATE
    },
    montoctacorriente: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    montolineacredito: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    montotrjcredito: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    montototal: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    montototalbase: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    temporalidad: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    tipogastogen: {
        type: DataTypes.INTEGER
    },
    ceco_id: {
        type: DataTypes.STRING
    },
    trxcurrency_id: {
        type: DataTypes.STRING
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
    modelName: "presupuestos"
})

/* export default Estimate; */

Estimate.belongsTo(Ceco, {
    foreignKey: 'ceco_id'
});

Estimate.belongsTo(Trxcurrency, {
    as: "moneda",
    foreignKey: 'trxcurrency_id'
})

Estimate.belongsTo(Tpogasto, {
    foreignKey: 'tipogastogen'
})