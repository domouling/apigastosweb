import { DataTypes, DATE, Model } from "sequelize";
import db from "../db/connections";
import { Ceco } from "./ceco";
import { User } from "./user";

export class Payment extends Model {}
Payment.init({
    descripcion: {
        type: DataTypes.STRING
    },
    fecha: {
        type: DataTypes.DATE
    },
    monto: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    ceco_id: {
        type: DataTypes.INTEGER
    },
    proyecto_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
    modelName: "abonos"
})

/* export default Estimate; */

Payment.belongsTo(Ceco, {
    foreignKey: 'ceco_id'
});

Ceco.hasOne(Payment,{
    foreignKey: 'ceco_id'
});

Payment.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasOne(Payment, {
    foreignKey: 'user_id'
});