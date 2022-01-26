import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 

import { Trxcurrency } from "../models/trxcurrency";

export const getTrxcurrencies = async (req: Request, res: Response): Promise<Response> => {
    const trxcurrencies = await Trxcurrency.findAll();

    return res.json({
        status: 'success',
        trxcurrencies
    })
}

export const getTrxcurrency = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const trxcurrency = await Trxcurrency.findByPk(id);

    if(trxcurrency){
         return res.json({
            status: 'success',
            trxcurrency
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Moneda no Encontrado'
        })
    }
   
}

export const postTrxcurrency = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    let validate_isocode:any;
    let validate_nombre:any;
    let validate_simbolo:any;

    try {
        validate_isocode = !validator.isEmpty(body.isocode);
        validate_nombre = !validator.isEmpty(body.nombre);
        validate_simbolo = !validator.isEmpty(body.simbolo);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_nombre || !validate_isocode || !validate_simbolo) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    try {
        const exist = await Trxcurrency.findOne({
            where: {
                simbolo: body.simbolo
            }
        });

        if(exist){
            return res.status(400).json({
                status: 'error',
                msg: 'Moneda ya existe'
            })
        }

        const trxcurency = await Trxcurrency.create(body);

        return res.json({
            status: 'success',
            msg: 'Tipo cuenta Creado con Exito',
            trxcurency
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putTrxcurrency = async (req: Request, res: Response): Promise<Response> => {
    
    const { id } = req.params;
    const { body } = req;

    let validate_isocode:any;
    let validate_nombre:any;
    let validate_simbolo:any;

    try {
        validate_isocode = !validator.isEmpty(body.isocode);
        validate_nombre = !validator.isEmpty(body.nombre);
        validate_simbolo = !validator.isEmpty(body.simbolo);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_nombre || !validate_isocode || !validate_simbolo) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    try {
        const exist = await Trxcurrency.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Moneda no existe'
            })
        }
        
        console.log(body);
        const trxcurrency = await Trxcurrency.update(body,
            {where: 
                {id}
            });

        return res.status(200).json({
            status: 'success',
            msg: 'Moneda Actualizado',
            trxcurrency
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteTrxcurrency = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Trxcurrency.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Moneda no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const trxcurrency = await Trxcurrency.update({status: 0},{where: {id}});

        return res.status(200).json({
            status: 'success',
            msg: 'Moneda Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

