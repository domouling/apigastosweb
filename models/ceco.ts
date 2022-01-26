import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";


/* const Ceco = db.define('centrocostos', {
    centrocosto: {
        unique: true,
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    unidadnegocio: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    imagen: {
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

export class Ceco extends Model {}
Ceco.init({
    centrocosto: {
        unique: true,
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    unidadnegocio: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    imagen: {
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
}, {
    sequelize: db,
    modelName: "centrocostos"
})

/* export default Ceco; */