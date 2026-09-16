import mongoose from 'mongoose';

const toySchema = new mongoose.Schema({
    toyId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    permalink: { type: String, required: true },
    description: { type: String, required: true },

    targetGroup: {
        type: String,
        enum: ['boys', 'girls', 'all'],
        default: 'all'
    },

    productionDate: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    active: { type: Boolean, default: true },

    ageGroup: {
        ageGroupId: { type: Number },
        name: { type: String },
        description: { type: String }
    },
    type: {
        typeId: { type: Number },
        name: { type: String },
        description: { type: String }
    }
});

export const Toy = mongoose.model('Toy', toySchema);