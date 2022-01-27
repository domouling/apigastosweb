import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 

import { Payment } from "../models/payments";
import { Ceco } from "../models/ceco";
import { User } from "../models/user";


export const getPayments = async (req: Request, res: Response): Promise<Response> => {
    const payments = await Payment.findAll({
        include: [
            {model: Ceco,
            attributes: ['centrocosto']},
            {model: User,
            attributes: ['nombre']}
            ]
    });

    return res.json({
        status: 'success',
        payments
    })
}


export const getPayment = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const payment = await Payment.findByPk(id,{
        include: [
            {model: Ceco,
            attributes: ['centrocosto']},
            {model: User,
            attributes: ['nombre']}
            ]
    });

    if(payment){
         return res.json({
            status: 'success',
            payment
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Abono no Encontrado'
        })
    }
   
}

export const postPayment = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    let validate_describe:any;
    let validate_fecha:any;

    try {
        validate_describe = !validator.isEmpty(body.descripcion);
        validate_fecha = !validator.isEmpty(body.fecha);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_describe || !validate_fecha) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    if(body.monto <= 0) {
        return res.status(400).send({
            status: 'error',
            msg: 'Monto de Abono debe ser Mayor a 0'
        })
    }

    try {

        const payment = await Payment.create(body);

        return res.json({
            status: 'success',
            msg: 'Abono Creado con Exito',
            payment
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

/* export const getTotEstimate = async (req: Request, res: Response): Promise<Response> => {
    console.log('entre');
    const estimates = await Estimate.findAll({
        attributes: [
            [Sequelize.fn("SUM",Sequelize.col('montototal')),"montototal"],
            [Sequelize.fn("SUM",Sequelize.col('montoctacorriente')),"totctacorriente"],
            [Sequelize.fn("SUM",Sequelize.col('montolineacredito')),"totlineacredito"],
            [Sequelize.fn("SUM",Sequelize.col('montotrjcredito')),"tottrjcreditom"],
        ],
        raw: true
    });

    return res.json({
        status: 'success',
        estimates
    })

} */

export const putPayment = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { body } = req;
    let validate_describe:any;
    let validate_fecha:any;

    try {
        validate_describe = !validator.isEmpty(body.descripcion);
        validate_fecha = !validator.isEmpty(body.fecha);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_describe || !validate_fecha) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    if(body.monto <= 0) {
        return res.status(400).send({
            status: 'error',
            msg: 'Monto de Abono debe ser Mayor a 0'
        })
    }

    try {
        const exist = await Payment.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Abono no existe'
            })
        }

        const payment = await Payment.update(body,
            {where: 
                {id}
            });

        return res.status(200).json({
            status: 'success',
            msg: 'Abono Actualizado',
            payment
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deletePayment = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Payment.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Abono no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const payment = await Payment.update({status: 0},{where: {id}});

        return res.status(200).json({
            status: 'success',
            msg: 'Abono Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}