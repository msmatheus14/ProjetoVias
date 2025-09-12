import mongoose from "mongoose";

const usuario = new mongoose.Schema({
    
    email: {

        type: String,
        unique: true,
        required: true,
        trim: true,
        uppercase: true,
    },

    senha: {
        
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    }
})

export default mongoose.model('Usuario', usuario)
