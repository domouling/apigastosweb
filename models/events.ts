import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";

export class Evento extends Model {}
Evento.init({
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.STRING
    },
    ip_solic: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    solicitud: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    response: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE
    }
},{
    sequelize: db,
    modelName: "eventos"
})