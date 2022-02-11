import { Request, Response } from "express";
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import validator from "validator";
import db from "../db/connections";

import { Projects } from "../models/projects";
import { Provider } from "../models/provider";


export const getProjects = async (req: Request, res: Response): Promise<Response> => {
    const { ceco } = req.params;
    const projects = await Projects.findAll({
        include: {
            model: Provider,
            as: "proveedor",
            attributes: ['nombre']
        },
        where: {
            ceco_id: ceco
        }
    });

    return res.json({
        status: 'success',
        projects
    })
}

export const getProjectsAct = async (req: Request, res: Response): Promise<Response> => {
    const projects = await Projects.findAll({
        include: {
            model: Provider,
            as: "proveedor",
            attributes: ['nombre']
        },
        where: {
            status: 1
        }
    });

    return res.json({
        status: 'success',
        projects
    })
}

export const getProject = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const project = await Projects.findByPk(id,{
        include: {
            model: Provider,
            as: "proveedor",
            attributes: ['nombre']
        }
    });

    if(project){
         return res.json({
            status: 'success',
            project
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Proyecto no Encontrado'
        })
    }
   
}

export const getProjExpenses = async (req: Request, res: Response): Promise<Response> => {
    const { ceco } = req.params;

    const query = `SELECT
        a.id,
        a.nombre,
        a.fechainicio,
        a.fechafin,
        a.monto,
        IFNULL(b.pagado,0) as pagado,
        c.nombre as proveedor,
        a.ceco_id
        FROM proyectos a
    LEFT JOIN 
        (SELECT proyecto_id, sum(monto) as pagado FROM gastos GROUP BY proyecto_id) b 
        ON a.id = b.proyecto_id
    LEFT JOIN proveedores c ON c.id = a.proveedor_id
    WHERE ceco_id = ${ceco}`;

    const data = await db.query(query);

    if(data){
        return res.json({
            status: 'success',
            projects: data[0]
        });
    } else {
        return res.json({
            status: 'error',
            projects: []
        })
    }
}

export const getProjExpensesId = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const query = `SELECT
        a.id,
        a.nombre,
        a.fechainicio,
        a.fechafin,
        a.monto,
        IFNULL(b.pagado,0) as pagado,
        c.nombre as proveedor,
        a.ceco_id
        FROM proyectos a
    LEFT JOIN 
        (SELECT proyecto_id, sum(monto) as pagado FROM gastos GROUP BY proyecto_id) b 
        ON a.id = b.proyecto_id
    LEFT JOIN proveedores c ON c.id = a.proveedor_id
    WHERE a.id = ${id}`;

    const data = await db.query(query);

    if(data){
        return res.json({
            status: 'success',
            expense: data[0]
        });
    } else {
        return res.json({
            status: 'error',
            expense: []
        })
    }
}

export const postProject = async (req: Request, res: Response): Promise<Response> => {
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

    if(body.fechainicio > body.fechafin) {
        return res.status(400).send({
            status: 'error',
            msg: 'Fecha Inicio no debe ser Mayor a Fecha Fin'
        })
    }

    if (body.monto <= 0) {
        return res.status(400).send({
            status: 'error',
            msg: 'Monto de Proyecto debe ser mayor a 0'
        })
    }

    try {
        //TODO: Validar subcategory + category
        /* const exist = await Ctacuenta.findOne({
            where: {
                nombre: body.nombre
            }
        });

        if(exist){
            return res.status(400).json({
                status: 'error,
                msg: 'Ceco ya existe'
            })
        } */

        const project = await Projects.create(body);

        return res.json({
            status: 'success',
            msg: 'Proyecto Creado con Exito',
            project
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putProject = async (req: Request, res: Response): Promise<Response> => {

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

    if(body.fechainicio > body.fechafin) {
        return res.status(400).send({
            status: 'error',
            msg: 'Fecha Inicio no debe ser Mayor a Fecha Fin'
        })
    }

    if (body.monto <= 0) {
        return res.status(400).send({
            status: 'error',
            msg: 'Monto de Proyecto debe ser mayor a 0'
        })
    }

    try {
        const exist = await Projects.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Proyecto no existe'
            })
        }

        const project = await Projects.update(body,
            {where: 
                {id}
            });

        return res.status(200).json({
            status: 'success',
            msg: 'Proyecto Actualizado',
            project
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}


export const putSaldo = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    const query = `UPDATE proyectos SET montopag = montopag + ${body.montopag}
    WHERE id = ${id}`;
    const data = await db.query(query);

    return res.json({
        status: 'success',
        msg: 'Monto Actualizado',
        data
    });

}

export const deleteProject = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await Projects.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Proyecto no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const project = await Projects.update({status: 0},{where: {id}});

        return res.status(200).json({
            status: 'success',
            msg: 'Proyecto Borrado',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

