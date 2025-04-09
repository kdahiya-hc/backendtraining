import * as mongoose from 'mongoose';

export const ItemSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String },
  description: { type: String },
  qty: { type: Number },
});

// export const Item = mongoose.model('Item', ItemSchema);
// not needed a nest handles the model injectetion internally when i wrote MongooseModule.forFeature()
