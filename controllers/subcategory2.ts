import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";


import { Subcategory2 } from "../models/subcategory2";
import { Subcategory } from "../models/subcategory";
import { Evento } from "../models/events";

export const getSubcategories2 = async (req: Request, res: Response): Promise<Response> => {
    const subcategories2 = await Subcategory2.findAll({
        include: {
            model: Subcategory,
            as: "subcategoria",
            attributes: ['nombre']
        }
    });

    return res.json({
        status: 'success',
        subcategories2
    })
}

export const getSubcategories2Act = async (req: Request, res: Response): Promise<Response> => {
    const subcategories2 = await Subcategory2.findAll({
        include: {
            model: Subcategory,
            as: "subcategoria",
            attributes: ['nombre']
        },
        where: {
            status: 1
        }
    });

    return res.json({
        status: 'success',
        subcategories2
    })
}


export const getSubcategory2 = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const subcategory2 = await Subcategory2.findByPk(id, {
        include: {
            model: Subcategory,
            as: "subcategoria",
            attributes: ['nombre']
        }
    });

    if(subcategory2){
         return res.json({
            status: 'success',
            subcategory2
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Subcategoria2 no Encontrado'
        })
    }
   
}

export const getSubSubCat = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const subcategory2 = await Subcategory2.findAll({
        where: {
            subcategoria_id: id
        }
    })

    if(subcategory2 && subcategory2.length > 0){
         return res.json({
            status: 'success',
            subcategory2
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Subcategorias2 no Encontrado'
        })
    }
   
}

export const postSubcategory2 = async (req: Request, res: Response): Promise<Response> => {
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
        //TODO: Validar subcategory2 + subcategory
        /* const exist = await Ctacuenta.findOne({
            where: {
                centrocosto: body.centrocosto
            }
        });

        if(exist){
            return res.status(400).json({
                msg: 'Ceco ya existe'
            })
        } */

        body.id = uuidv4();

        const subcategory2 = await Subcategory2.create(body);

        const event = {
            id: uuidv4(),
            user_id: body.user_id,
            ip_solic: req.ip,
            solicitud: 'Post_Detalle: ' + body.id,
            status: '200',
            response: 'Subcategories2'
        }
        Evento.create(event);

        return res.json({
            status: 'success',
            msg: 'Subcategoria2 Creado con Exito',
            subcategory2
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putSubcategory2 = async (req: Request, res: Response): Promise<Response> => {

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
        const exist = await Subcategory2.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'SubCategoria2 no existe'
            })
        }

        const subcategory2 = await Subcategory2.update(body,
            {where: 
                {id}
            });

        const event = {
            id: uuidv4(),
            user_id: body.user_id,
            ip_solic: req.ip,
            solicitud: 'Put_Detalle: ' + id,
            status: '200',
            response: 'Subcategories2'
        }
        Evento.create(event);

        return res.status(200).json({
            status: 'success',
            msg: 'Subcategoria2 Actualizado',
            subcategory2
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteSubcategory2 = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Subcategory2.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Subcategoria2 no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const subcategory2 = await Subcategory2.update({status: 0},{where: {id}});

        return res.status(200).json({
            status: 'success',
            msg: 'Subcategoria2 Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

