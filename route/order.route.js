import {Router} from "express";
import { addOrder, dashboardOrders, deleteOrder, updateOrderStatus, userOrder } from "../controller/order.contrller.js";
import {verifyToken} from '../middleware/auth.js'
const orderRouter = Router();

orderRouter.get("/yourOrders",verifyToken,userOrder);

orderRouter.post("/orders",verifyToken,addOrder);

orderRouter.get("/dashboard/orders/:orderStatus",verifyToken,dashboardOrders);

orderRouter.post("/dashboard/updateOrderStatus",verifyToken,updateOrderStatus);

orderRouter.post("/dashboard/deleteOrder",verifyToken,deleteOrder);



export {orderRouter};