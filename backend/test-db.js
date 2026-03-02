import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("Connecting...");

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected to:", mongoose.connection.name);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
