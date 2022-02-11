import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator"; 

import { Ceco } from "../models/ceco";

export const getCecos = async (req: Request, res: Response): Promise<Response> => {
    const cecos = await Ceco.findAll();

    return res.json({
        status: 'success',
        cecos
    })
}

export const getCecosAct = async (req: Request, res: Response): Promise<Response> => {
    const cecos = await Ceco.findAll({
        where: {
            status: 1
        }
    });

    return res.json({
        status: 'success',
        cecos
    })
}


export const getCeco = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const ceco = await Ceco.findByPk(id);

    if(ceco){
         return res.json({
            status: 'success',
            ceco
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Ceco no Encontrado'
        })
    }
   
}

export const postCeco = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    let validate_nombre:any;

    try {
        validate_nombre = !validator.isEmpty(body.centrocosto);

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
        const exist = await Ceco.findOne({
            where: {
                centrocosto: body.centrocosto
            }
        });

        if(exist){
            return res.status(400).json({
                msg: 'Ceco ya existe'
            })
        }

        const ceco = await Ceco.create(body);

        return res.json({
            status: 'success',
            msg: 'Ceco Creado con Exito',
            ceco
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putCeco = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { body } = req;
    let validate_nombre:any;

    try {
        validate_nombre = !validator.isEmpty(body.centrocosto);

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
        const exist = await Ceco.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Ceco no existe'
            })
        }

        const ceco = await Ceco.update(body,
            {where: 
                {id}
            });

        return res.status(200).json({
            status: 'success',
            msg: 'Ceco Actualizado',
            ceco
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteCeco = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Ceco.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Ceco no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const ceco = await Ceco.update({status: 0},{where: {id}});

        return res.status(200).json({
            status: 'success',
            msg: 'Ceco Borrado',
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
    const pathfile = './uploads/cecos/' + filename;
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
    
    const ceco:any = await Ceco.update({imagen},{where:{id}});
    if(!ceco || ceco == 0) return res.status(400).json({ msg: 'Ceco no Existe'});
    return res.status(200).json({
        status: 'success',
        msg: 'Imagen Ceco Actualizado',
        ceco
    })
}


export const deleteAvatar = async (req: Request, res: Response) => {
    const { imagen } = req.params;
    const pathfile = './uploads/cecos/' + imagen;
    if(fs.existsSync(pathfile)) {
        await fs.unlink(path.resolve('uploads/cecos/' + imagen));
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
