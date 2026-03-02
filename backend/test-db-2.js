import mongoose from 'mongoose';

// improved URI
const uri = "mongodb+srv://22221a04c6_db_user:eJ8CHDt2L2xOB9FH@cluster0.nerowoj.mongodb.net/internvault?retryWrites=true&w=majority";

console.log("Connecting to internvault...");
mongoose.connect(uri)
    .then(async () => {
        console.log("✅ Custom URI Connected!");
        console.log("Database:", mongoose.connection.name);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ Connection failed!");
        console.error(err);
        process.exit(1);
    });
