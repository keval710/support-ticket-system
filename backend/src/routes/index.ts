import express from 'express';
import authRoute from './auth.route';
import statusRoute from './status.route';
import departmentRoute from './department.route';
import ticketRoute from './ticket.route';
import userRoute from './user.route';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/user',
        route: userRoute
    },
    {
        path: '/ticket',
        route: ticketRoute
    },
    {
        path: '/status',
        route: statusRoute
    },
    {
        path: '/department',
        route: departmentRoute
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
