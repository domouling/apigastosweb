import { Request, Response } from "express";
import validator from "validator"; 
import bcryptjs from 'bcryptjs';
import path from "path";
import fs from 'fs-extra';
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import requestIp from 'request-ip';

import jwt, { TokenExpiredError, verify } from "jsonwebtoken";

import { User } from "../models/user";
import { Ceco } from "../models/ceco";
import { Evento } from "../models/events";

interface IPayload {
    _id: any;
    nombre: string;
    email: string;
    role: string;
    imagen: string;
    iat: number;
    exp: number;
}
//const arrayImgExt = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];

export const login = async(req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    
    const user:any = await User.findOne({where: {
        email: body.email,
        status: 1,
    }, raw: true});

    //console.log(user);

    if(!user) return res.status(400).json({ msg: 'Email erroneo o Usuario inactivo'});
  
    const hash = body.password;

    const verify = await bcryptjs.compare(hash, user.password);
    if(!verify) {
        return  res.status(400).json({
           msg: 'Password Invalido'
        });
    }

    const token: string = jwt.sign({
        _id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        ceco_id: user.ceco_id,
        imagen: user.imagen,
    }, process.env.TOKEN_SECRET || 'tokentest', {
        expiresIn: 60 * 60
    });

    user.password = undefined;

    //Event
    const event = {
        id: uuidv4(),
        user_id: user.id,
        ip_solic: req.ip,
        solicitud: 'Login',
        status: '200',
        response: 'user'
    }
    Evento.create(event);

    return res.header('auth-token', token).status(200).json({
        status: 'Success',
        msg: 'Login Exitoso',
        data: user
    })
}

export const register = async(req: Request, res: Response): Promise<Response> => {
    const { body } = req;

    if(!body.ultimasesion) {
        const today = moment().format('YYYY-MM-DD H:mm:ss');
        body.ultimasession = today;
    }

    try {
        const exist = await User.findOne({
            where: {
                email: body.email
            }
        });

        if(exist){
            return res.status(400).json({
                msg: 'Usuario ya existe'
            })
        }

        const salt = bcryptjs.genSaltSync();
        body.password = bcryptjs.hashSync(body.password, salt);

        body.id = uuidv4();

        const user = await User.create(body);
        

        //const token:string  = jwt.sign({_id: user.dataValues.id}, process.env.TOKEN_SECRET || 'tokentest');

        /* return res.header('auth-token', token).json({
            msg: 'Usuario Registrado con Exito',
            user,
            token
        }); */

        return res.json({
            msg: 'Usuario Registrado con Exito',
            user,

        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await User.findAll({
        include: {
            model: Ceco,
            attributes: ['centrocosto']
        },
        attributes: {
            exclude: ['password']
        }
    });

    
    return res.json({
        status: 'success',
        users
    })
}

export const getUsersAct = async (req: Request, res: Response): Promise<Response> => {
    const users = await User.findAll({
        include: {
            model: Ceco,
            attributes: ['centrocosto']
        },
        where: {
            status: 1
        },
        attributes: {
            exclude: ['password']
        }
    },);

    return res.json({
        status: 'success',
        users
    })
}

export const getTokeninf = (req: Request, res: Response) => {
    const token = req.header('auth-token');
    if(!token) {return res.status(401).json('Acceso Denegado');}

    /* try {
        const payload:any = jwt.verify(token,process.env.TOKEN_SECRET || 'tokentest') as IPayload;
        if(!payload){
            return res.status(419).json({
                status: 'error',
                msg: 'Token Invalido o Expirado'
            })
        } else {
            return res.status(200).json({
                status: 'success',
                data: payload
            })
        } 
    } catch (err) {
        if(err instanceof TokenExpiredError) {
            return res.status(419).json({
                status: 'error',
                msg: 'Token Invalido o Expirado'
            })
        }
    } */
    jwt.verify(token,process.env.TOKEN_SECRET || 'tokentest', (error,decoded) => {
        if(error){
            if (error.name === 'TokenExpiredError'){
                return res.status(419).json({
                    status: 'error',
                    msg: 'Token Expirado'
                })
            } else {
                return res.status(400).json({
                    status: 'error',
                    msg: 'Token Invalido'
                })
            }
        } else {
            const payload = decoded as IPayload;

            return res.status(200).json({
                status: 'success',
                data: payload
            })
        }
    })
    
    
}


export const getUser = async(req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const user = await User.findByPk(id,{
        attributes: {
            exclude: ['password']
        }
    });

    if(user){
         return res.json({
            status: 'success',
            user
        })
    } else {
        return res.status(404).json({
            status: 'error',
            msg: 'Usuario no Encontrado'
        })
    }
   
}

export const postUser = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    let validate_nombre:any;
    let validate_email:any;
    let validate_password:any;
    let validate_repass:any;
    const today = moment().format('YYYY-MM-DD H:mm:ss');
    body.ultimasesion = today;

    try {

        validate_nombre = !validator.isEmpty(body.nombre);
        validate_email = !validator.isEmpty(body.email) && validator.isEmail(body.email);
        validate_password = !validator.isEmpty(body.password);
        validate_repass = !validator.isEmpty(body.retypePassword);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_nombre || !validate_email || !validate_password || !validate_repass) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    if (body.password != body.retypePassword){
        return res.status(400).send({
            msg: 'No coinciden la contraseñas.. Revisar'
        })
    }


    try {
        const exist = await User.findOne({
            where: {
                email: body.email
            }
        });

        if(exist){
            return res.status(400).json({
                msg: 'Usuario ya existe'
            })
        }

        const salt = bcryptjs.genSaltSync();
        body.password = bcryptjs.hashSync(body.password, salt);

        body.id = uuidv4();

        const user = await User.create(body);

        const event = {
            id: uuidv4(),
            user_id: body.admin_id,
            ip_solic: req.ip,
            solicitud: 'Post_User: ' + body.id,
            status: '200',
            response: 'Usuarios'
        }
        Evento.create(event);

        return res.json({
            status: 'success',
            msg: 'Usuario Creado con Exito',
            user
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const putUser = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { body } = req;

    let validate_nombre:any;
    let validate_email:any;
    const today = moment().format('YYYY-MM-DD H:mm:ss');
    body.ultimasesion = today;


    try {

        validate_nombre = !validator.isEmpty(body.nombre);
        validate_email = !validator.isEmpty(body.email) && validator.isEmail(body.email);

    } catch (error) {
        return res.status(400).send({
            msg: 'Faltan datos por enviar',
        });
    }

    if (!validate_nombre || !validate_email) {
        return res.status(400).send({
            msg: 'Los Datos son incorrectos, revisar'
        })
    }

    if (body.passnew){
        if(body.passnew != body.retypePassword){
            return res.status(400).send({
                msg: 'No coinciden la contraseñas.. Revisar'
            })
        } else {
            body.password = body.passnew;
        } 
    }

    try {
        const exist = await User.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                status: 'error',
                msg: 'Usuario no existe'
            })
        }

        if(body.password && body.passnew){
            const salt = bcryptjs.genSaltSync();
            body.password = bcryptjs.hashSync(body.password, salt);
        }

        const user = await User.update(body,
            {where: 
                {id}
            });

        const event = {
            id: uuidv4(),
            user_id: body.admin_id,
            ip_solic: req.ip,
            solicitud: 'Put_User: ' + id,
            status: '200',
            response: 'Usuarios'
        }
        Evento.create(event);

        return res.status(200).json({
            status: 'success',
            msg: 'Usuario Actualizado',
            user
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
    }

}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {
        const exist = await User.findByPk(id);
        if(!exist) {
            return res.status(400).json({
                msg: 'Usuario no existe'
            })
        }

        //const user = await User.destroy({where: {id}});

        const user = await User.update({status: 0},{where: {id}});

        return res.status(200).json({
            msg: 'Usuario Borrado',
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
    const pathfile = './uploads/users/' + filename;
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

    /* console.log(req.body);
    console.log(req.file); */

    /* let file_name  = 'Avatar no subido';
    if(!req.files){
        return res.status(404).json({
            status: 'error',
            msg: file_name
        })
    }

    let file_path:any = req.file?.path;
    let file_split:any = file_path?.split('\\');

    file_name = file_split[2];

    let ext_split = file_name.split('\.');
    let file_ext = ext_split[1];

    if(!arrayImgExt.includes(file_ext)){
        fs.unlink(file_path, (err) => {
            return res.status(400).json({
                status: 'error',
                msg: 'Extension no es Valida'
            })
        })  
    } else {
        return res.status(200).json({
            status: 'success',
            msg: 'Archivo Subido',
            data: file_name
        })
    } */
    return res.status(200).json({
        status: 'success',
        msg: 'Archivo Subido',
        data: req.file?.filename
    })
}


export const updateImage = async(req: Request, res: Response) => {
    const { email, imagen } = req.body;
    
    const user:any = await User.update({imagen},{where:{email}});
    if(!user || user == 0) return res.status(400).json({ msg: 'Usuario no Existe'});
    return res.status(200).json({
        status: 'success',
        msg: 'Imagen Usuario Actualizado',
        user
    })
}


export const deleteAvatar = async (req: Request, res: Response) => {
    const { imagen } = req.params;
    const pathfile = './uploads/users/' + imagen;
    if(fs.existsSync(pathfile)) {
        await fs.unlink(path.resolve('uploads/users/' + imagen));
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
