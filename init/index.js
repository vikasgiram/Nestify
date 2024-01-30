const mongoose=require("mongoose");
const Listing=require("../models/listings.js");
const initData = require("./data.js");

main().then(()=>{
    console.log("Connected to DB Sucess");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDb=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:"65b7c665a58505fd9ef8b586", }));
    console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDb();
