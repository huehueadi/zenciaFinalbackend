// services/dbConnection.mjs

import mongoose from 'mongoose'; // Use import for mongoose


const mongoToken = "mongodb+srv://zfintechpvtltd:sMCG5UFvbXzdHrVK@cluster0.zvosn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 "

const execute = async () => {
    let timeout = 25;
    let connected = false;

    // Loop until connection is established or timeout reaches 0
    while (timeout > 0 && !connected) {
        try {
            await mongoose.connect(mongoToken, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            
            if (mongoose.connection.readyState === 1) {
                connected = true;
                console.log('Database connected successfully');
            }
        } catch (error) {
            timeout--;
            console.log(`Connection attempt failed. Retries left: ${timeout}`);
        }
    }

    if (!connected) {
        console.log('timeout');
        throw new Error('Timeout occurred while attempting to connect to MongoDB.');
    }

    console.log('Database connection status:', mongoose.connection.readyState);
};

export default execute;  
