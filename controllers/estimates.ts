import { Request, Response } from "express";
import bcryptjs from 'bcryptjs';
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 

import Sequelize, { fn } from "sequelize";

import { Estimate } from "../models/estimate";
import { Tpogasto } from "../models/tpogasto";
import { Ceco } from "../models/ceco";
import { Trxcurrency } from "../models/trxcurrency";

//const arrayImgExt = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];


export const getEstimates = async (req: Request, res: Response): Promise<Response> => {
    const estimates = await Estimate.findAll({
        include: [
            {model: Tpogasto,
            attributes: ['nombre']},
            {model: Ceco,
            attributes: ['centrocosto']},
            {model: Trxcurrency,
            as: "moneda",
            attributes: ['simbolo']}
            ]
    });

    return res.json({
        status: 'success',
        estimates
    })
}


export const getEstimate = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const estimate = await Estimate.findByPk(id,{
        include: [
            {model: Tpogasto,
            attributes: ['nombre']},
            {model: Ceco,
            attributes: ['centrocosto']},
            {model: Trxcurrency,
            as: "moneda", 
            attributes: ['simbolo']}
            ]
    });

    if(estimate){
         return res.json({
            status: 'success',
            estimate
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Presupuesto no Encontrado'
        })
    }
   
}

export const postEstimate = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    let validate_inicio:any;
    let validate_final:any;

    try {
        validate_inicio = !validator.isEmpty(body.fechainicio);
        validate_final = !validator.isEmpty(body.fechafin);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_inicio || !validate_final) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    if(body.fechainicio > body.fechafin) {
        return res.status(400).send({
            status: 'error',
            msg: 'Fecha Inicio no debe ser Mayor a Fecha Fin'
        })
    }

    if(body.montototal <= 0) {
        return res.status(400).send({
            status: 'error',
            msg: 'Monto de Presupuesto debe ser Mayor a 0'
        })
    }

    try {

        const estimate = await Estimate.create(body);

        return res.json({
            status: 'success',
            msg: 'Presupuesto Creado con Exito',
            estimate
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const getTotEstimate = async (req: Request, res: Response): Promise<Response> => {
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

}

export const putEstimate = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { body } = req;
    let validate_inicio:any;
    let validate_final:any;

    try {
        validate_inicio = !validator.isEmpty(body.fechainicio);
        validate_final = !validator.isEmpty(body.fechafin);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_inicio || !validate_final) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    if(body.fechainicio > body.fechafin) {
        return res.status(400).send({
            status: 'error',
            msg: 'Fecha Inicio no debe ser Mayor a Fecha Fin'
        })
    }

    if(body.montototal <= 0) {
        return res.status(400).send({
            status: 'error',
            msg: 'Monto de Presupuesto debe ser Mayor a 0'
        })
    }

    try {
        const exist = await Estimate.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Prespuesto no existe'
            })
        }

        const estimate = await Estimate.update(body,
            {where: 
                {id}
            });

        return res.status(200).json({
            status: 'success',
            msg: 'Prespuesto Actualizado',
            estimate
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteEstimate = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Estimate.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Prespuesto no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const estimate = await Estimate.update({status: 0},{where: {id}});

        return res.status(200).json({
            status: 'success',
            msg: 'Prespuesto Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const avatar = (req: Request, res: Response) => {
    const { filename } = req.params;
    const pathfile = './uploads/estimates/' + filename;
    if(fs.existsSync(pathfile)){
        return res.sendFile(path.resolve(pathfile));
    } else {
        return res.status(400).send({
            status: 'error',
            msg: 'Imagen no existe'
        })
    }
}

export const uploadAvatar = (req: Request, res: Response) => {
    
    return res.status(200).json({
        status: 'success',
        msg: 'Archivo Subido',
        data: req.file?.filename
    })
}


export const updateImage = async(req: Request, res: Response) => {
    const { id, imagen } = req.body;
    
    const estimate:any = await Estimate.update({imagen},{where:{id}});
    if(!estimate || estimate == 0) return res.status(400).json({ msg: 'Prespuesto no Existe'});
    return res.status(200).json({
        status: 'success',
        msg: 'Imagen Presupuesto Actualizado',
        estimate
    })
}


export const deleteAvatar = async (req: Request, res: Response) => {
    const { imagen } = req.params;
    const pathfile = './uploads/estimates/' + imagen;
    if(fs.existsSync(pathfile)) {
        await fs.unlink(path.resolve('uploads/estimates/' + imagen));
        return res.status(200).send({
            status: 'success',
            msg: 'Imagen Eliminada'
        })
    } else {
        return res.status(400).send({
            status: 'error',
            msg: 'Imagen No existe'
        })
    }
}
