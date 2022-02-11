import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 

import { Subcategory } from "../models/subcategory";
import { Category } from "../models/category";

export const getSubcategories = async (req: Request, res: Response): Promise<Response> => {
    const subcategories = await Subcategory.findAll({
        include: {
            model: Category,
            attributes: ['nombre']
        }
    });

    return res.json({
        status: 'success',
        subcategories
    })
}

export const getSubcategoriesAct = async (req: Request, res: Response): Promise<Response> => {
    const subcategories = await Subcategory.findAll({
        include: {
            model: Category,
            attributes: ['nombre']
        },
        where: {
            status: 1
        }
    });

    return res.json({
        status: 'success',
        subcategories
    })
}


export const getSubcategory = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const subcategory = await Subcategory.findByPk(id,{
        include: {
            model: Category,
            attributes: ['nombre']
        }
    });

    if(subcategory){
         return res.json({
            status: 'success',
            subcategory
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Subcategoria no Encontrado'
        })
    }
   
}

export const getSubCat = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const subcategory = await Subcategory.findAll({
        where: {
            categoria_id: id
        }
    })

    if(subcategory && subcategory.length > 0){
         return res.json({
            status: 'success',
            subcategory
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Subcategorias no Encontrado'
        })
    }
   
}

export const postSubcategory = async (req: Request, res: Response): Promise<Response> => {
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
        //TODO: Validar subcategory + category
        /* const exist = await Ctacuenta.findOne({
            where: {
                nombre: body.nombre
            }
        });

        if(exist){
            return res.status(400).json({
                status: 'error,
                msg: 'Ceco ya existe'
            })
        } */

        const subcategory = await Subcategory.create(body);

        return res.json({
            status: 'success',
            msg: 'Subcategoria Creado con Exito',
            subcategory
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putSubcategory = async (req: Request, res: Response): Promise<Response> => {

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
        const exist = await Subcategory.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Subcategoria no existe'
            })
        }

        const subcategory = await Subcategory.update(body,
            {where: 
                {id}
            });

        return res.status(200).json({
            status: 'success',
            msg: 'Subcategoria Actualizado',
            subcategory
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteSubcategory = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Subcategory.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Subcategoria no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const subcategory = await Subcategory.update({status: 0},{where: {id}});

        return res.status(200).json({
            status: 'success',
            msg: 'Subcategoria Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

