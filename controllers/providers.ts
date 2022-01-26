import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 

import { Provider } from "../models/provider";

export const getProviders = async (req: Request, res: Response): Promise<Response> => {
    const providers = await Provider.findAll();

    return res.json({
        status: 'success',
        providers
    })
}


export const getProvider = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const provider = await Provider.findByPk(id);

    if(provider){
         return res.json({
            status: 'success',
            provider
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Proveedor no Encontrado'
        })
    }
   
}

export const postProvider = async (req: Request, res: Response): Promise<Response> => {
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
        const exist = await Provider.findOne({
            where: {
                nombre: body.nombre
            }
        });

        if(exist){
            return res.status(400).json({
                status: 'error',
                msg: 'Proveedor ya existe'
            })
        }

        const provider = await Provider.create(body);

        return res.json({
            status: 'success',
            msg: 'Proveedor Creado con Exito',
            provider
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putProvider = async (req: Request, res: Response): Promise<Response> => {

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
        const exist = await Provider.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Tipo cuenta no existe'
            })
        }

        const provider = await Provider.update(body,
            {where: 
                {id}
            });

        return res.status(200).json({
            status: 'success',
            msg: 'Proveedor Actualizado',
            provider
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteProvider = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Provider.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                msg: 'Proveedor no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const provider = await Provider.update({status: 0},{where: {id}});

        return res.status(200).json({
            status: 'success',
            msg: 'Proveedor Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

