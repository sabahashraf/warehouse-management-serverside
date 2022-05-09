const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const {
  MongoClient,
  ServerApiVersion,
  MongoRuntimeError,
  ObjectId,
} = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfiue.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client
      .db("warehouseManagement")
      .collection("product");

    //getting all products
    //http://localhost:5000/product
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    //getting one product by id
    app.get("/product/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });
    //geting items
    app.get("/item", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = productCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    //posting one product
    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });
    //updating one product
    app.put("/product/:inventoryId", async (req, res) => {
      const { inventoryId } = req.params;
      console.log(inventoryId);
      const updatedProduct = req.body;
      console.log(updatedProduct);

      const filter = { _id: ObjectId(inventoryId) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: { quantity: updatedProduct.quantity },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //deleting one product by id
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
    //deleting one item by id
    app.delete("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(port, () => {
  console.log("listening from port", port);
});
