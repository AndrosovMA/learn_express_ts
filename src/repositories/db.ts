import {MongoClient} from "mongodb";
import {Blog} from "./blogs-db-repositories";


const mongoUri = process.env.mongoUri || "mongodb://0.0.0.0:27017" || "mongodb+srv://cluster0.kc7nkis.mongodb.net/myFirstDatabase";

const client = new MongoClient(mongoUri);
const db = client.db("homeWorkDb")
export const collectionBlogs = db.collection<Blog>('blogs');


export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        //Establish and verify connection
        await client.db("homeWorkDb").command({ping: 1});
        console.log("Connected successfully to the mongo server");
    } catch {
        //Ensures that the client will close when you finish/error
        await client.close();
    }
}