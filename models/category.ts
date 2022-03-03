import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";
import { Subcategory } from "./subcategory";

export class Category extends Model {}
Category.init({
    id:{
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    jerarquia: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    nombre: {
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
    modelName: 'categorias'
})

Category.hasMany(Subcategory, {
    foreignKey: 'categoria_id'
});

Subcategory.belongsTo(Category,{
    foreignKey: 'categoria_id'
})


/* export default Category */;