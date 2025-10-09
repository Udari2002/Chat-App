import mongoose from "mongoose";


//Function to connect to MongoDB database
export const connectDB = async () => {
    try {
        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('✅ Database connected successfully');
        });
        
        mongoose.connection.on('error', (err) => {
            console.log('❌ Database connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ Database disconnected');
        });

        console.log('🔄 Attempting to connect to database...');
        console.log('Connection string:', `${process.env.MONGO_URI}/chatApp`);
        await mongoose.connect(`${process.env.MONGO_URI}/chatApp`);
        console.log('🔄 Attempting to connect to database...');
        
    } catch (error) {
        console.log('❌ Database connection failed:', error);
        process.exit(1); // Exit if database connection fails
    }
}

// Function to check database connection status
export const getDatabaseStatus = () => {
    const state = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected', 
        2: 'connecting',
        3: 'disconnecting'
    };
    return {
        status: states[state],
        state: state,
        host: mongoose.connection.host,
        name: mongoose.connection.name
    };
}