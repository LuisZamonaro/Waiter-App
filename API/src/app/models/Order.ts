import { model, Schema } from 'mongoose'

export const Order = model('Order', new Schema({
	table: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ['WAITING', 'IN_PRODUCTION', 'DONE'], // não é pra ter nunhum valor diferente desses 3, por isso é usado o enum
		default: 'WAITING', // o padrão é esse
	},
	createdAt: {
		type: Date,
		default: Date.now, // não envocou a função, pq se não ela vai executar qnd o arquivo for carrago e não quando for preciso Date.now()
	},
	products: {
		required: true,
		type: [{
			product: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'Product' // referência do outro model
			},
			quantity: {
				type: Number,
				default: 1,
			},
		}],
	},
}))
