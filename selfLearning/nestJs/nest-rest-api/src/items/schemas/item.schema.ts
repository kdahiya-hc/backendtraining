import * as mongoose from "mongoose";

export const ItemSchema = new mongoose.Schema({
	id: { type: Number },
	name: { type: String },
	description: { type: String },
	qty: { type: Number },
})

export const Item = mongoose.model('Item', ItemSchema);
