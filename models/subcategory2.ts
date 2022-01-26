import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";
import { Subcategory } from "./subcategory";


/* const Subcategory2 = db.define('subcategoria2', {
    nombre: {
        type: DataTypes.STRING
    },
    subcategoria_id : {
        type: DataTypes.INTEGER
    },
    jerarquiacat : {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    jerarquiasubcat : {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    jerarquiasubcat2 : {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    unidadnegocio: {
        type: DataTypes.STRING,
        defaultValue: null
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

export class Subcategory2 extends Model {}
Subcategory2.init({
    nombre: {
        type: DataTypes.STRING
    },
    subcategoria_id : {
        type: DataTypes.INTEGER
    },
    jerarquiacat : {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    jerarquiasubcat : {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    jerarquiasubcat2 : {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    unidadnegocio: {
        type: DataTypes.STRING,
        defaultValue: null
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
    modelName: "subcategoria2",
    tableName: "subcategoria2",
    freezeTableName: true
});

Subcategory2.belongsTo(Subcategory, {
    as: "subcategoria",
    foreignKey: 'subcategoria_id'
});

Subcategory.hasOne(Subcategory2, {
    foreignKey: 'subcategoria_id'
});

/* export default Subcategory2; */