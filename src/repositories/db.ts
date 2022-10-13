import {MongoClient} from "mongodb";
import {Blog} from "./blogs-db-repositories";

const mongoAtlas = process.env.mongoUri;
console.log('mongoAtlas', mongoAtlas)

const mongoUri = mongoAtlas || "mongodb://0.0.0.0:27017";

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