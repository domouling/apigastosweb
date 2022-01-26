import { Request, Response } from "express";
import bcryptjs from 'bcryptjs';
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 

import { Tpogasto } from "../models/tpogasto";
import { Ceco } from "../models/ceco";
import { Trxcurrency } from "../models/trxcurrency";
import { Expense } from "../models/expenses";
import { Category } from "../models/category";
import { Provider } from "../models/provider";
import { User } from "../models/user";
import { Subcategory } from "../models/subcategory";
import { Subcategory2 } from "../models/subcategory2";

//const arrayImgExt = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];

export const getExpenses = async (req: Request, res: Response): Promise<Response> => {
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
        ]
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

    try {

        const expense = await Expense.create(body);

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

        //const user = await User.destroy({where: {id}});

        const expense = await Expense.update({status: 0},{where: {id}});

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
