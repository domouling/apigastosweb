import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";
import { Provider } from "./provider";

export class Projects extends Model {}
Projects.init({
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
    proveedor_id : {
        type: DataTypes.INTEGER
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
    modelName: "proyectos",
});

Projects.belongsTo(Provider, {
    foreignKey: 'proveedor_id'
});

Provider.hasOne(Projects, {
    foreignKey: 'proveedor_id'
});