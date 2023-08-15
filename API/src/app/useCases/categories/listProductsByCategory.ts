import { Request, Response } from 'express'

import { Product } from '../../models/Product'

export async function listProductsByCategory(req: Request, res: Response) {
	try {
		const {categoryId} = req.params
		const products = await Product.find().where('category').equals(categoryId) // where -> listar todos os produtos onde a categoria for igual a categoria recebida nos valores enviados na URL

		res.json(products)
	} catch (error) {
		res.status(500).json({
			error: 'Internal server error!',
		})
	}
}

