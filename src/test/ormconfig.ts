import { ConnectionOptions } from 'typeorm';
 
const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_DATABASE,
  entityPrefix : "t_",
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
  ],
  synchronize: true
};
 
export default config;