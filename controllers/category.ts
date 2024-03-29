import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

import { Category } from "../models/category";
import { Evento } from "../models/events";

export const getCategories = async (req: Request, res: Response): Promise<Response> => {
    const categories = await Category.findAll();

    return res.json({
        status: 'success',
        categories
    })
}

export const getCategoriesAct = async (req: Request, res: Response): Promise<Response> => {
    const categories = await Category.findAll({
        where: {
            status: 1
        }
    });

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

        body.id = uuidv4();

        const category = await Category.create(body);

        const event = {
            id: uuidv4(),
            user_id: body.user_id,
            ip_solic: req.ip,
            solicitud: 'Post_Category: ' + body.id,
            status: '200',
            response: 'Categorias'
        }
        Evento.create(event);

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

        const event = {
            id: uuidv4(),
            user_id: body.user_id,
            ip_solic: req.ip,
            solicitud: 'Put_Category: ' + body.id,
            status: '200',
            response: 'Categorias'
        }
        Evento.create(event);

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

