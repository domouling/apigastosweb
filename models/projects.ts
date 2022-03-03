import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";
import { Provider } from "./provider";

export class Projects extends Model {}
Projects.init({
    id:{
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    fechainicio : {
        type: DataTypes.DATE
    },
    fechafin : {
        type: DataTypes.DATE
    },
    monto : {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    montopag : {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    user_id: {
        type: DataTypes.STRING
    },
    proveedor_id : {
        type: DataTypes.STRING
    },
    ceco_id : {
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
        type: DataTypes.DATE
    }
}, {
    sequelize: db,
    modelName: "proyectos",
});

Projects.belongsTo(Provider, {
    as: 'proveedor',
    foreignKey: 'proveedor_id'
});

Provider.hasOne(Projects, {
    as: 'proveedor',
    foreignKey: 'proveedor_id'
});
