const mongoose=require("mongoose");
const Listing=require("../models/listings.js");
const allListings=require("./data.js");

main().then(()=>{
    console.log("Connected to DB Sucess");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');

}

const initDb=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(allListings);
    console.log("Data was initialized");
};
