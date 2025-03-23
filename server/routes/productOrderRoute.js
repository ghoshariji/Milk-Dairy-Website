const express = require('express');
const { addOrder, getAllOrders, editOrder,getTodayProductData,createOrder,fetchMilkManNotification,fetchMilkManAcceptOrder,fetchOrdersByMilkman } = require('../controller/productOrdercontroller');
const authMiddleware = require("../middleware/authMiddleware"); // Middleware for token decoding

const router = express.Router();

router.post('/add', addOrder); // Add new order
router.get('/all', getAllOrders); // Get all orders
router.put('/edit/:orderId', editOrder); // Edit order
router.get('/get-total-product-data',getTodayProductData); // Edit order
router.post('/sell-milk-data-add',createOrder); // Edit order
router.get('/get-milkman-notification',fetchMilkManNotification); // Edit order
router.put('/milkman-accept-order',fetchMilkManAcceptOrder); // Edit order
router.get("/fetch-orders-accept-reject", authMiddleware, fetchOrdersByMilkman);

module.exports = router;
