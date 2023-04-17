import { config } from './config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.NODE_ENV === 'docker-local' ? 'web3data-db' : 'localhost',
  port: 5432,
  username: config().db.username,
  password: config().db.password,
  database: config().db.dbName,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
};

export default ormConfig;
