import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js to use public DNS servers to resolve MongoDB SRV records on Windows
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongoDB connected');

    }catch(err){
        console.error(err);
        process.exit(1);
    }

};

export default connectDB;