const express = require('express');
const graphqlHTTP = require('express-graphql');
const { typeDefs } = require('./schema/schema')
const { makeExecutableSchema } = require('graphql-tools');
const { MongoClient, ObjectId } = require('mongodb');


const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = 'mongodb://localhost:27017';

const corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


const initApp = async () => {
  const mongoClient = await MongoClient.connect(MONGO_URL, {useNewUrlParser: true});
  const Buckets = mongoClient.db('demo').collection('buckets');
  const Fruits = mongoClient.db('demo').collection('fruits');

  const resolvers = { 
    Query: {
      fruits: async (root, { bucketId }) =>{

        const response = await Fruits.find( { bucketId } ).toArray();
        // console.log(response);
        return response;
      },
      allFruits: async () =>{
        const response = await Fruits.find({}).toArray();
        // console.log(response);
        return response;
      },
      buckets: async () => {
        const res = await Buckets.find({}).toArray();
        // console.log( res );
        return res;
      },
      bucket: async (root, { _id }) => {
        const response = await Buckets.findOne(ObjectId(_id));
        // console.log(response);
        return response;
      },
    },
  
    Mutation:{
      createBucket: async (root, {title, description}) =>{
        const response = await Buckets.insertOne({title, description});
        // console.log(response.ops[0]._id);
        return Buckets.findOne(ObjectId(response.ops[0]._id));
      },
      createFruit: async (root, args) => {
        const response = await Fruits.insertOne(args);
        // console.log(response);
        const result = Fruits.findOne(ObjectId(response.ops[0]._id));
        Buckets.findOneAndUpdate(ObjectId(args.bucketId), { $push: {fruits: result._id } } )
        return result;
      },
      updateFruit: async (root, { _id, newBucketId }) => {
        const response = await Fruits.findOneAndUpdate({_id: ObjectId(_id)}, {$set: { bucketId: newBucketId }})
        return Fruits.findOne(ObjectId(_id));
      },
      updateBucket: async (root, { _id, description }) =>{
        const response = await Buckets.findOneAndUpdate({_id: ObjectId(_id)}, {$set: { description }});
        // console.log(response);
        return Buckets.findOne(ObjectId(_id));
      },
      deleteFruit: async (root, { _id }) =>{
        const response = Fruits.remove( { _id: ObjectId(_id) });
        return response;
      },
      deleteBucket: async (root, { _id }) =>{
        const response = Buckets.remove( { _id: ObjectId(_id) });
        return response;
      },
      deleteAllFruit: async () =>{
        Fruits.remove( { } );
        return "All fruits are deleted.";
      },
      deleteAllBucket: async() =>{
        Buckets.remove( { } );
        return "All Buckets are deleted.";
      }
    },
    
    Bucket: {
      fruits: async ({ _id }) =>{
        const response = await Fruits.find({ bucketId: _id.toString() }).toArray();
        return response;
      }
    },
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  app.use(cors(corsOptions));

  app.use('/graphql', graphqlHTTP({
    schema: schema,
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