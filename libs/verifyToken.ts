import { Request, Response, NextFunction } from "express"
import jwt, { TokenExpiredError } from "jsonwebtoken";

interface IPayload {
    _id: any;
    nombre: string;
    email: string;
    role: string;
    ceco_id: string;
    imagen: string;
    iat: number;
    exp: number;
}

export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).json('Acceso Denegado');

    //const payload:any = jwt.verify(token,process.env.TOKEN_SECRET || 'tokentest') as IPayload;

    /* if(TokenExpiredError){
        console.log('error');
        return false;
    }*/

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

            req.userId = payload._id;
            req.nombre = payload.nombre;
            req.email = payload.email;
            req.role = payload.role;
            req.ceco_id = payload.ceco_id;
            req.imagen = payload.imagen;


            next();
        }

    })

}