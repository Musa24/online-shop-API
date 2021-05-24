import { json } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//@Desc   Create new order
//@route POST /api/orders
// @access public
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    taxPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order Items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      taxPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

//@Desc  Get Order By ID
//@route GET /api/orders/:id
// @access private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'email name'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order Not Found');
  }
});

//@Desc Update order to Pay
//@route PUT /api/orders/:id/pay
// @access private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { id, status, update_time, payer } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // From PayPal
    order.paymentResult = {
      id,
      status,
      update_time,
      email_address: payer.email_address,
    };
    //save the update order
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order Not Found');
  }
});

//@Desc Update order to delivered
//@route PUT /api/orders/:id/deliver
// @access private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    //save the update order
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order Not Found');
  }
});

//@Desc   get logged In user orders
//@route GET /api/orders/myorders
// @access private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error('Orders Not Found');
  }
});

//@Desc   get all orders by Admin
//@route GET /api/orders
// @access private/admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name id');
  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error('Orders Not Found');
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
