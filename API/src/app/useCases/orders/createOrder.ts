import { Request, Response } from 'express'

import { Order } from '../../models/Order'
import { io } from '../../..' // index

export async function createOrder(req: Request, res: Response) {
	try {
		const {table, products} = req.body
		const order = await Order.create({ table, products})
		const orderDetails = await order.populate('products.product')

		io.emit('orders@new', orderDetails) // (order) -> receber os detalhes do pedido
		res.status(201).json(order)
	} catch {
		res.status(500).json({
			error: 'Internal server error!',
		})
		//res.sendStatus(500)
	}
}

