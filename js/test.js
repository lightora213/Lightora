import { addProduct } from "./services/productService.js";

await addProduct({

name:"Luxury Perfume",

description:"Premium perfume",

price:12000,

stock:25,

category:"Perfume",

brand:"SD",

status:"active",

createdAt:new Date()

});

console.log("Product Saved");