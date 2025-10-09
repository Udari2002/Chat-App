import mongoose from "mongoose";

//function to connect to mongoDB database
export const connectDB = async () => {
    try{
        mongoose.connection.on('connected', () => console.log('Database connected successfully'));
        await mongoose.connect(`${process.env.MONGO_URI}/chatApp`);
    }catch(error){
        console.log(error)

    }
}