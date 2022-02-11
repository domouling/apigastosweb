import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 

import { Tpocuenta } from "../models/tpocuenta";

export const getTpocuentas = async (req: Request, res: Response): Promise<Response> => {
    const tpocuentas = await Tpocuenta.findAll();

    return res.json({
        status: 'success',
        tpocuentas
    })
}

export const getTpocuentasAct = async (req: Request, res: Response): Promise<Response> => {
    const tpocuentas = await Tpocuenta.findAll({where: {status: 1}});

    return res.json({
        status: 'success',
        tpocuentas
    })
}


export const getTpocuenta = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const tpocuenta = await Tpocuenta.findByPk(id);

    if(tpocuenta){
         return res.json({
            status: 'success',
            tpocuenta
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Tipo Cuenta no Encontrado'
        })
    }
   
}

export const postTpocuenta = async (req: Request, res: Response): Promise<Response> => {
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
        const exist = await Tpocuenta.findOne({
            where: {
                nombre: body.nombre
            }
        });

        if(exist){
            return res.status(400).json({
                status: 'error',
                msg: 'Tipo Cuenta ya existe'
            })
        } 

        const tpocuenta = await Tpocuenta.create(body);

        return res.json({
            status: 'success',
            msg: 'Tipo cuenta Creado con Exito',
            tpocuenta
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putTpocuenta = async (req: Request, res: Response): Promise<Response> => {

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
        const exist = await Tpocuenta.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Tipo cuenta no existe'
            })
        }

        const tpocuenta = await Tpocuenta.update(body,
            {where: 
                {id}
            });

        return res.status(200).json({
            status: 'success',
            msg: 'Tipo cuenta Actualizado',
            tpocuenta
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteTpocuenta = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Tpocuenta.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Tipo cuenta no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const tpocuenta = await Tpocuenta.update({status: 0},{where: {id}});

        return res.status(200).json({
            status: 'success',
            msg: 'Tipo cuenta Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

