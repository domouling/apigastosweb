import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import { v4 as uuidv4 } from "uuid";

import { Ctagasto } from "../models/ctagasto";

export const getCtagastos = async (req: Request, res: Response): Promise<Response> => {
    const ctagastos = await Ctagasto.findAll();

    return res.json({
        status: 'success',
        ctagastos
    })
}

export const getCtagastosAct = async (req: Request, res: Response): Promise<Response> => {
    const ctagastos = await Ctagasto.findAll({
        where: {
            status: 1
        }
    });

    return res.json({
        status: 'success',
        ctagastos
    })
}


export const getCtagasto = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const ctagasto = await Ctagasto.findByPk(id);

    if(ctagasto){
         return res.json({
            status: 'success',
            ctagasto
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Cuenta Gasto no Encontrado'
        })
    }
   
}

export const postCtagasto = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;

    try {
        /* const exist = await Ctagasto.findOne({
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

        const ctagasto = await Ctagasto.create(body);

        return res.json({
            msg: 'Cuenta Gasto Creado con Exito',
            ctagasto
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putCtagasto = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { body } = req;

    try {
        const exist = await Ctagasto.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                msg: 'Cuenta Gasto no existe'
            })
        }

        const ctagasto = await Ctagasto.update(body,
            {where: 
                {id}
            });

        return res.status(200).json({
            msg: 'Cuenta Gasto Actualizado',
            body
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteCtagasto = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Ctagasto.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                msg: 'Cuenta Gasto no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const ctagasto = await Ctagasto.update({status: 0},{where: {id}});

        return res.status(200).json({
            msg: 'Cuenta Gasto Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

