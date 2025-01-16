const mongoose = require("mongoose");
const initData = require("../init/data");
const Listing = require("../models/listing");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'

main().then(()=>{
    console.log("Connected to DB");
})
.catch((err) =>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj , owner:"677f7a444ee65ffc96920474"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialize");
}

initDB();
