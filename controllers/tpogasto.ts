import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 

import { Tpogasto } from "../models/tpogasto";

export const getTpogastos = async (req: Request, res: Response): Promise<Response> => {
    const tpogastos = await Tpogasto.findAll();

    return res.json({
        status: 'success',
        tpogastos
    })
}


export const getTpogasto = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const tpogasto = await Tpogasto.findByPk(id);

    if(tpogasto){
         return res.json({
            status: 'success',
            tpogasto
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Tipo Gasto no Encontrado'
        })
    }
   
}

export const postTpogasto = async (req: Request, res: Response): Promise<Response> => {
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
        const exist = await Tpogasto.findOne({
            where: {
                nombre: body.nombre
            }
        });

        if(exist){
            return res.status(400).json({
                msg: 'Ceco ya existe'
            })
        }

        const tpogasto = await Tpogasto.create(body);

        return res.json({
            status: 'success',
            msg: 'Tipo Gasto Creado con Exito',
            tpogasto
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putTpogasto = async (req: Request, res: Response): Promise<Response> => {

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
        const exist = await Tpogasto.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Tipo Gasto no existe'
            })
        }

        const tpogasto = await Tpogasto.update(body,
            {where: 
                {id}
            });

        return res.status(200).json({
            status: 'success',
            msg: 'Tipo Gasto Actualizado',
            tpogasto
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteTpogasto = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Tpogasto.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Tipo Gasto no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const tpogasto = await Tpogasto.update({status: 0},{where: {id}});

        return res.status(200).json({
            status: 'success',
            msg: 'Tipo Gasto Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

