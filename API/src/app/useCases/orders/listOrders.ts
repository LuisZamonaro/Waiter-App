import { Request, Response } from 'express'


import { Order } from '../../models/Order'

export async function listOrders(req: Request, res: Response) {
	try {									//  o pedido mais antigo vai estar no topo
		const orders = await Order.find().sort({createAt: 1}).populate('products.product')

		res.json(orders)
	} catch (error) {
		res.status(500).json({
			error: 'Internal server error!',
		})
	}
}

