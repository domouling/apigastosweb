import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 
import db from "../db/connections";
import { v4 as uuidv4 } from "uuid";

import { Payment } from "../models/payments";
import { Ceco } from "../models/ceco";
import { User } from "../models/user";
import { Evento } from "../models/events";


export const getPayments = async (req: Request, res: Response): Promise<Response> => {
    const { ceco } = req.params;
    const payments = await Payment.findAll({
        include: [
            {model: Ceco,
            attributes: ['centrocosto']},
            {model: User,
            attributes: ['nombre']}
            ],
        where: {
            ceco_id: ceco
        }
    });

    return res.json({
        status: 'success',
        payments
    })
}

export const getPaymentsAct = async (req: Request, res: Response): Promise<Response> => {
    const payments = await Payment.findAll({
        include: [
            {model: Ceco,
            attributes: ['centrocosto']},
            {model: User,
            attributes: ['nombre']}
            ],
        where: {
            status: 1
        }
        },
        );

    return res.json({
        status: 'success',
        payments
    })
}

export const getPaymentsMonth = async (req: Request, res: Response): Promise<Response> => {
    const { ceco } = req.params;
    
    const query =  `SELECT EXTRACT(MONTH FROM fecha) AS mes, sum(monto) as monto
    FROM abonos where ceco_id = '${ceco}' and EXTRACT(YEAR FROM fecha) = 2022 GROUP BY mes`;

    const data = await db.query(query);
    
    return res.json({
        status: 'success',
        payments: data[0]
    });
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

        body.id = uuidv4();

        const payment = await Payment.create(body);

        const event = {
            id: uuidv4(),
            user_id: body.user_id,
            ip_solic: req.ip,
            solicitud: 'Post_Abono: ' + body.id,
            status: '200',
            response: 'Payments'
        }
        Evento.create(event);

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

export const totalPayments = async (req: Request, res: Response): Promise<Response> => {
    const { desde, hasta, ceco} = req.body;
    
    /* const expanses = await Estimate.findAll({
        attributes: [
            [Sequelize.fn("SUM",Sequelize.col('monto')),"montototal"]
        ],
        raw: true,
    }); */
    
    const query = `Select ceco_id as ceco, SUM(monto) as montotot from
    abonos Where ceco_id = '${ceco}'
    and fecha between '${desde + " 00:00:00"}' and '${hasta + " 23:59:59"}'`;
    
    const data = await db.query(query);

    return res.json({
        status: 'success',
        payments: data[0]
    });
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

            const event = {
                id: uuidv4(),
                user_id: body.user_id,
                ip_solic: req.ip,
                solicitud: 'Put_Abono: ' + id,
                status: '200',
                response: 'Payments'
            }
            Evento.create(event);

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

        const payment = await Payment.destroy({where: {id}});

        const event = {
            id: uuidv4(),
            user_id: exist.getDataValue('user_id'),
            ip_solic: req.ip,
            solicitud: 'Del_Abono: ' + id,
            status: '200',
            response: 'Payments'
        }
        Evento.create(event);

        //const payment = await Payment.update({status: 0},{where: {id}});

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