let express = require('express');
let graphqlHTTP = require('express-graphql');
let { MongoClient, ObjectId } = require('mongodb');
let { schema } = require('./schema/schema')

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = 'mongodb://localhost:27017';


const initApp = async () => {

  const mongoClient = await MongoClient.connect(MONGO_URL, {useNewUrlParser: true});
  const Buckets = mongoClient.db('demo').collection('buckets');
  const Fruits = mongoClient.db('demo').collection('fruits');
  
  const root = { 
      hello: ({text}) => {
        console.log(text)
        return `hello ${text}`;
      },
      change: ({text}) => `You have entered: ${text}`,
      createBucket: async ({title, description}) =>{
        const response = await Buckets.insertOne({title, description});
        console.log(response.ops[0]._id);
        return Buckets.findOne(ObjectId(response.ops[0]._id));
      },
      createFruit: async (args) => {
        const response = await Fruits.insertOne(args);
        console.log(response.ops[0]);
        const result = Fruits.findOne(ObjectId(response.ops[0]._id));
        Buckets.findOneAndUpdate(ObjectId(args.bucketId), { $push: {Fruits: result } } )
        return result;
      },
      fruits: async (bucketId) =>{
        const response = await Fruits.find( { bucketId } ).toArray();
        console.log(response);
        return response;
      },
      allFruits: async () =>{
        const response = await Fruits.find({}).toArray();
        console.log(response);
        return response;
      },
      buckets: async () => {
        const res = await Buckets.find({}).toArray();
        console.log( res );
        return res;
      },
      bucket: async ({ _id }) => {
        const response = await Buckets.findOne(ObjectId(_id));
        console.log(response);
        return response;
      }
  };

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    pretty: true
  }))

  app.listen( PORT, () => console.log(`Listening on ${PORT}`))
}

try {
  initApp()
} catch (error) {
  console.log(error)
}