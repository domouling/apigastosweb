import { Request, Response } from "express";
import bcryptjs from 'bcryptjs';
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 
import db from "../db/connections";
import { v4 as uuidv4 } from "uuid";

import { Tpogasto } from "../models/tpogasto";
import { Ceco } from "../models/ceco";
import { Trxcurrency } from "../models/trxcurrency";
import { Expense } from "../models/expenses";
import { Category } from "../models/category";
import { Provider } from "../models/provider";
import { User } from "../models/user";
import { Subcategory } from "../models/subcategory";
import { Subcategory2 } from "../models/subcategory2";
import { Evento } from "../models/events";

//const arrayImgExt = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];

export const getExpenses = async (req: Request, res: Response): Promise<Response> => {
    const { ceco } = req.params;
    const expenses = await Expense.findAll({
        include: [
            {model: Category,
            attributes: ['nombre']},
            {model: Provider,
            as: "proveedor",
            attributes: ['nombre']},
            {model: Tpogasto,
            attributes: ['nombre']},
            {model: User,
            attributes: ['nombre']},
            {model: Ceco,
            attributes: ['centrocosto']},
            {model: Trxcurrency,
            as: "moneda",
            attributes: ['simbolo']},
            {model: Subcategory,
            as: "subcategoria",
            attributes: ['nombre']},
            {model: Subcategory2,
            attributes: ['nombre']}
        ],
        where: {
            ceco_id: ceco || 0
        }
    });

    return res.json({
        status: 'success',
        expenses
    })
}


export const movements = async (req: Request, res: Response): Promise<Response> => {
    const { ceco } = req.params;
    const { desde, hasta } = req.body;

    const query = `SELECT 
            ga.ceco_id as ceco,
            ce.centrocosto as ceconame,
            ga.id as idreg,
            ga.fechainicio as fecha,
            tg.nombre as tipogasto,
            pr.nombre as proyecto,
            ga.monto as monto,
            tc.nombre as metodo,
            ga.descripcion as descripcion,
            ga.imagen as imagen,
            'Cargo' as tabla
            FROM gastos ga 
            LEFT JOIN tipocuenta tc ON ga.metodo = tc.id
            LEFT JOIN centrocostos ce ON ga.ceco_id = ce.id
            LEFT JOIN tipogastos tg ON ga.tipogasto_id = tg.id
            LEFT JOIN proyectos pr ON ga.proyecto_id = pr.id
            WHERE ga.ceco_id = '${ceco}' and
            ga.fechainicio between '${desde + " 00:00:00"}' and '${hasta + " 23:59:59"}'
        UNION
        SELECT 
            py.ceco_id as ceco,
            ce.centrocosto as ceconame,
            py.id as idreg,
            py.fecha as fecha,
            '-' as tipogasto,
            pr.nombre as proyecto,
            py.monto as monto,
            '-' as metodo,
            py.descripcion as descripcion,
            null as imagen,
            'Abono' as tabla
            FROM abonos py 
            LEFT JOIN centrocostos ce ON py.ceco_id = ce.id
            LEFT JOIN proyectos pr ON py.proyecto_id = pr.id
            WHERE py.ceco_id = '${ceco}' and
            py.fecha between '${desde + " 00:00:00"}' and '${hasta + " 23:59:59"}'
        order by fecha`;

    const data = await db.query(query);

    if(data){
        return res.json({
            status: 'success',
            expenses: data[0]
        });
    } else {
        return res.json({
            status: 'error',
            expenses: []
        })
    }
}

export const totalExpenses = async (req: Request, res: Response): Promise<Response> => {
    const { desde, hasta, ceco } = req.body;

    
    /* const expanses = await Estimate.findAll({
        attributes: [
            [Sequelize.fn("SUM",Sequelize.col('monto')),"montototal"]
        ],
        raw: true,
    }); */
    
    const query = `Select ceco_id as ceco, SUM(monto) as montotot from
    gastos Where ceco_id = '${ceco}' and metodo <> 5 
    and fechainicio between '${desde + " 00:00:00"}' and '${hasta + " 23:59:59"}'`;


    const data = await db.query(query);

    return res.json({
        status: 'success',
        expenses: data[0]
    });
}

export const getExpensesMonth = async (req: Request, res: Response): Promise<Response> => {
    const { ceco } = req.params;

    const query =  `SELECT EXTRACT(MONTH FROM fechainicio) AS mes, sum(monto) as monto
    FROM gastos where ceco_id = '${ceco || 0}' and EXTRACT(YEAR FROM fechainicio) = 2022 GROUP BY mes`;

    const data = await db.query(query);

    return res.json({
        status: 'success',
        expenses: data[0]
    });
}

export const getExpensesAct = async (req: Request, res: Response): Promise<Response> => {
    const expenses = await Expense.findAll({
        include: [
            {model: Category,
            attributes: ['nombre']},
            {model: Provider,
            as: "proveedor",
            attributes: ['nombre']},
            {model: Tpogasto,
            attributes: ['nombre']},
            {model: User,
            attributes: ['nombre']},
            {model: Ceco,
            attributes: ['centrocosto']},
            {model: Trxcurrency,
            as: "moneda",
            attributes: ['simbolo']},
            {model: Subcategory,
            as: "subcategoria",
            attributes: ['nombre']},
            {model: Subcategory2,
            attributes: ['nombre']}
        ],
        where: {
            status: 1
        }
    });

    return res.json({
        status: 'success',
        expenses
    })
}


export const getExpense = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const expense = await Expense.findByPk(id,{
        include: [
            {model: Category,
            attributes: ['nombre']},
            {model: Provider,
            as: "proveedor",
            attributes: ['nombre']},
            {model: Tpogasto,
            attributes: ['nombre']},
            {model: User,
            attributes: ['nombre']},
            {model: Ceco,
            attributes: ['centrocosto']},
            {model: Trxcurrency,
            as: "moneda",
            attributes: ['simbolo']},
            {model: Subcategory,
            as: "subcategoria",
            attributes: ['nombre']},
            {model: Subcategory2,
            attributes: ['nombre']}
        ]
    });

    if(expense){
         return res.json({
            status: 'success',
            expense
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Gasto no Encontrado'
        })
    }
   
}

export const postExpense = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    let validate_inicio:any;

    try {
        validate_inicio = !validator.isEmpty(body.fechainicio);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_inicio) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    if(body.monto <= 0) {
        return res.status(400).send({
            status: 'error',
            msg: 'Monto de Cargo debe ser Mayor a 0'
        })
    }

    try {
        body.id = uuidv4();

        const expense = await Expense.create(body);

        //Event
        const event = {
            id: uuidv4(),
            user_id: body.user_id,
            ip_solic: req.ip,
            solicitud: 'Post_Gasto: ' + body.id,
            status: '200',
            response: 'Expenses'
        }
        Evento.create(event);

        return res.json({
            status: 'success',
            msg: 'Gasto Creado con Exito',
            expense
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putExpense = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { body } = req;
    let validate_inicio:any;

    try {
        validate_inicio = !validator.isEmpty(body.fechainicio);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_inicio) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    if(body.monto <= 0) {
        return res.status(400).send({
            status: 'error',
            msg: 'Monto de Cargo debe ser Mayor a 0'
        })
    }

    try {
        const exist = await Expense.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Gasto no existe'
            })
        }

        const expense = await Expense.update(body,
            {where: 
                {id}
            });

        //Event
        const event = {
            id: uuidv4(),
            user_id: body.user_id,
            ip_solic: req.ip,
            solicitud: 'Put_Gasto: ' + id,
            status: '200',
            response: 'Expenses'
        }
        Evento.create(event);

        return res.status(200).json({
            status: 'success',
            msg: 'Gasto Actualizado',
            expense
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteExpense = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {

        const exist = await Expense.findByPk(id);

        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Gasto no existe'
            })
        }
        const expense = await Expense.destroy({where: {id}});

        //const expense = await Expense.update({status: 0},{where: {id}});

        const event = {
            id: uuidv4(),
            user_id: exist.getDataValue('user_id'),
            ip_solic: req.ip,
            solicitud: 'Del_Gasto: ' + id,
            status: '200',
            response: 'Expenses'
        }
        Evento.create(event);

        return res.status(200).json({
            status: 'success',
            msg: 'Gasto Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const avatar = (req: Request, res: Response) => {
    const { filename } = req.params;
    const pathfile = './uploads/expenses/' + filename;
    if(fs.existsSync(pathfile)){
        return res.sendFile(path.resolve(pathfile));
    } else {
        return res.status(400).send({
            status: 'error',
            msg: 'Imagen no existe'
        })
    }
}

export const uploadAvatar = (req: Request, res: Response) => {
    return res.status(200).json({
        status: 'success',
        msg: 'Archivo Subido',
        data: req.file?.filename
    })
}


export const updateImage = async(req: Request, res: Response) => {
    const { id, imagen } = req.body;
    
    const expense:any = await Expense.update({imagen},{where:{id}});
    if(!expense || expense == 0) return res.status(400).json({ msg: 'Prespuesto no Existe'});
    return res.status(200).json({
        msg: 'Imagen Gasto Actualizado',
        expense
    })
}

export const deleteAvatar = async (req: Request, res: Response) => {
    const { imagen } = req.params;
    const pathfile = './uploads/expenses/' + imagen;
    if(fs.existsSync(pathfile)) {
        await fs.unlink(path.resolve('uploads/expenses/' + imagen));
        return res.status(200).send({
            status: 'success',
            msg: 'Imagen Eliminada'
        })
    } else {
        return res.status(400).send({
            status: 'error',
            msg: 'Imagen No existe'
        })
    }
}
