import express, { Application } from 'express';
import morgan from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRoutes from '../routes/users';
import cecoRoutes from '../routes/cecos';
import ctagastoRoutes from '../routes/ctagastos';
import tpogastoRoutes from '../routes/tpogastos';
import tpocuentaRoutes from '../routes/tpocuentas';
import trxcurrencyRoutes from "../routes/trxcurrency";
import providerRoutes from "../routes/providers";
import categoryRoutes from "../routes/category";
import subcategoryRoutes from "../routes/subcategory";
import subcategory2Routes from "../routes/subcategory2";
import estimateRoutes from "../routes/estimates";
import expenseRoutes from "../routes/expenses";
import projectRoutes from "../routes/projects";
import paymentRoutes from "../routes/payments";

import db from '../db/connections';

class Server {

    private app: Application;
    private port: string;
    private apiPaths = {
        users: '/api/users',
        cecos: '/api/cecos',
        ctagastos: '/api/ctagastos',
        tpogastos: '/api/tpogastos',
        tpocuentas: '/api/tpocuentas',
        trxcurrency: '/api/trxcurrency',
        providers: '/api/providers',
        categories: '/api/categories',
        subcategories: '/api/subcategories',
        subcategories2: '/api/subcategories2',
        estimates: '/api/estimates',
        expenses: '/api/expenses',
        projects: '/api/projects',
        payments: '/api/payments'
    }

    constructor() {
        this.app = express();
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.port = process.env.PORT || '4100';

        //Folder Uplodas
        this.app.use('/uploads', express.static(path.resolve('uploads')));

        //Metodos Iniciales
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        try {
            
            await db.authenticate();
            console.log('Database online');

        } catch (error: any) {
            throw new Error(error);
        }
    }

    middlewares() {
        this.app.use(morgan('dev'));

        //cors
        this.app.use(cors({
            allowedHeaders: ['Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, auth-token'],
            methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
            exposedHeaders: ['auth-token']
        }));

        //lect body
        this.app.use(express.json());

        //Carpeta Pub
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.apiPaths.users, userRoutes);
        this.app.use(this.apiPaths.cecos, cecoRoutes);
        this.app.use(this.apiPaths.ctagastos, ctagastoRoutes);
        this.app.use(this.apiPaths.tpogastos, tpogastoRoutes);
        this.app.use(this.apiPaths.tpocuentas, tpocuentaRoutes);
        this.app.use(this.apiPaths.trxcurrency, trxcurrencyRoutes);
        this.app.use(this.apiPaths.providers, providerRoutes);
        this.app.use(this.apiPaths.categories, categoryRoutes);
        this.app.use(this.apiPaths.subcategories, subcategoryRoutes);
        this.app.use(this.apiPaths.subcategories2, subcategory2Routes);
        this.app.use(this.apiPaths.estimates, estimateRoutes);
        this.app.use(this.apiPaths.expenses, expenseRoutes);
        this.app.use(this.apiPaths.projects, projectRoutes);
        this.app.use(this.apiPaths.payments, paymentRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        })
    }

}

export default Server;