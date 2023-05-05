import mongoose from "mongoose"

export const connectDb = () => {
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "todoapi",
    })
    .then((c) => console.log(`Datebase connected ${c.connection.host}`))
    .catch((e) => console.error(e))
}