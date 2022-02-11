declare namespace Express {
    export interface Request {
        userId: any;
        nombre: string,
        email: string,
        role: string,
        ceco_id: number,
        imagen: string
    }
}