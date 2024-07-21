import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import ReviewsDAO from "./dao/reviewsDAO.js";

dotenv.config();

const MongoClient = mongodb.MongoClient;
const mongo_username = process.env.MDB_USERNAME;
const mongo_password = process.env.MDB_PASSWORD;
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.x0rox8c.mongodb.net/?retryWrites=true&w=majority`;
const port = 3000;

MongoClient.connect(uri, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
})
  .catch((err) => {
    console.error(`ERROR HERE: ${err.stack}`);
    process.exit(1);
  })
  .then(async (client) => {
    await ReviewsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  });
