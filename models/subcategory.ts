import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";
import { Category } from "./category";


export class Subcategory extends Model {}
Subcategory.init({
    id:{
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    categoria_id : {
        type: DataTypes.STRING
    },
    jerarquiasubcatpcpal : {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    jerarquiasubcat : {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    numjerarsubcat : {
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
    modelName: "subcategoria",
    tableName: "subcategoria",
    freezeTableName: true
});


/* export default Subcategory; */