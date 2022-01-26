import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 

import { Category } from "../models/category";

export const getCategories = async (req: Request, res: Response): Promise<Response> => {
    const categories = await Category.findAll();

    return res.json({
        status: 'success',
        categories
    })
}


export const getCategory = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const category = await Category.findByPk(id);

    if(category){
         return res.json({
            status: 'success',
            category
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Categoria no Encontrado'
        })
    }
   
}

export const postCategory = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    let validate_nombre:any;

    try {
        validate_nombre = !validator.isEmpty(body.nombre);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_nombre) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    try {
        const exist = await Category.findOne({
            where: {
                nombre: body.nombre
            }
        });

        if(exist){
            return res.status(400).json({
                status: 'error',
                msg: 'Ceco ya existe'
            })
        }

        const category = await Category.create(body);

        return res.json({
            status: 'success',
            msg: 'Categoria Creado con Exito',
            category
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putCategory = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { body } = req;
    let validate_nombre:any;

    try {
        validate_nombre = !validator.isEmpty(body.nombre);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_nombre) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    try {
        const exist = await Category.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Tipo cuenta no existe'
            })
        }

        const category = await Category.update(body,
            {where: 
                {id}
            });

        return res.status(200).json({
            status: 'success',
            msg: 'Categoria Actualizado',
            body
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteCategory = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Category.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Categoria no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const category = await Category.update({status: 0},{where: {id}});

        return res.status(200).json({
            status: 'success',
            msg: 'Categoria Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

