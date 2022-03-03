import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";
import { Category } from "./category";
import { Ceco } from "./ceco";
import { Provider } from "./provider";
import { Subcategory } from "./subcategory";
import { Subcategory2 } from "./subcategory2";
import { Tpocuenta } from "./tpocuenta";
import { Tpogasto } from "./tpogasto";
import { Trxcurrency } from "./trxcurrency";
import { User } from "./user";

export class Expense extends Model {}
Expense.init({
    id:{
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    categoria_id: {
        type: DataTypes.UUIDV4
    },
    usar_ccard: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    cuotas: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    descripcion: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    status_aprobmonto: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    fechaprimerpago: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    fechainicio: {
        type: DataTypes.DATE
    },
    fechafin: {
        type: DataTypes.DATE
    },
    gastosasoc: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    imagen: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    mailregistro: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    metodo: {
        type: DataTypes.STRING
    },
    proyecto_id: {
        type: DataTypes.STRING,
        defaultValue: 0
    },
    monto: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    montobase: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    nombrecuenta: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    proveedor_id: {
        type: DataTypes.STRING
    },
    tipogasto_id: {
        type: DataTypes.STRING
    },
    user_id: {
        type: DataTypes.STRING
    },
    ceco_id: {
        type: DataTypes.STRING
    },
    trxcurrency_id: {
        type: DataTypes.STRING
    },
    subcategoria2_id : {
        type: DataTypes.STRING
    },
    subcategoria_id : {
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
    modelName: "gastos"
})

/* export default Estimate; */

Expense.belongsTo(Tpocuenta, {
    foreignKey: 'metodo'
});

Expense.belongsTo(Provider, {
    as: "proveedor",
    foreignKey: 'proveedor_id'
});

Provider.hasOne(Expense, {
    foreignKey: 'proveedor_id'
});

Expense.belongsTo(Tpogasto, {
    foreignKey: 'tipogasto_id'
});

Tpogasto.hasOne(Expense, {
    foreignKey: 'tipogasto_id'
});

Expense.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasOne(Expense, {
    foreignKey: 'user_id'
});

Expense.belongsTo(Ceco, {
    foreignKey: 'ceco_id'
});

Ceco.hasOne(Expense, {
    foreignKey: 'ceco_id'
});

Expense.belongsTo(Trxcurrency, {
    as: "moneda",
    foreignKey: 'trxcurrency_id'
});

Trxcurrency.hasOne(Expense, {
    foreignKey: 'trxcurrency_id'
});

Expense.belongsTo(Subcategory2, {
    foreignKey: 'subcategoria2_id'
});

Subcategory2.hasOne(Expense, {
    foreignKey: 'subcategoria2_id'
});

Expense.belongsTo(Subcategory, {
    as: "subcategoria",
    foreignKey: 'subcategoria_id'
});

Subcategory.hasOne(Expense, {
    foreignKey: 'subcategoria_id'
});

Expense.belongsTo(Category, {
    foreignKey: 'categoria_id'
});

Category.hasOne(Expense, {
    foreignKey: 'categoria_id'
});