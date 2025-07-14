import mongoose from "mongoose"


const  connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://matheus:30117080@cluster0.pz0fzlj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log("MongoDB conectado")
    } catch (error) {
        console.error(error.message)
        console.log('Erro ao conectar no banco')
        process.exit(1)
    }
}

export default connectDB;
