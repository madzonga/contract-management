import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './models/index';
import contractsRoutes from './routes/contractsRoutes';
import jobsRoutes from './routes/jobsRoutes';
import balancesRoutes from './routes/balancesRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use(contractsRoutes);
app.use(jobsRoutes);
app.use(balancesRoutes);
app.use(adminRoutes);

export default app;