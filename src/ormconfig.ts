import {ConnectionOptions} from 'typeorm';

const config: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migrations: [
        __dirname + '/migrations/*{.ts,.js}'
    ],
    entityPrefix: "t_",
    entities: [
        __dirname + '/entities/*.entity{.ts,.js}',
    ],
    synchronize: false,
    logging : true
};

export default config;
