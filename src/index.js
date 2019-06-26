let express = require('express');
let graphqlHTTP = require('express-graphql');
let { typeDefs } = require('./schema/schema')
let { makeExecutableSchema } = require('graphql-tools');
let { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = 'mongodb://localhost:27017';

const initApp = async () => {
  const mongoClient = await MongoClient.connect(MONGO_URL, {useNewUrlParser: true});
  const Buckets = mongoClient.db('demo').collection('buckets');
  const Fruits = mongoClient.db('demo').collection('fruits');

  const resolvers = { 
    Query: {
      hello: (root, {text}) => {
        console.log(text)
        return `hello ${text}`;
      },
      fruits: async (root, { bucketId }) =>{
        console.log("ID bukcet-fruits", typeof(bucketId), bucketId)

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
      bucket: async (root, { _id }) => {
        const response = await Buckets.findOne(ObjectId(_id));
        console.log(response);
        return response;
      },
    },
  
    Mutation:{
      change: (root, {text}) => `You have entered: ${text}`,
      createBucket: async (root, {title, description}) =>{
        const response = await Buckets.insertOne({title, description});
        console.log(response.ops[0]._id);
        return Buckets.findOne(ObjectId(response.ops[0]._id));
      },
      createFruit: async (root, args) => {
        const response = await Fruits.insertOne(args);
        console.log(response);
        const result = Fruits.findOne(ObjectId(response.ops[0]._id));
        Buckets.findOneAndUpdate(ObjectId(args.bucketId), { $push: {fruits: result._id } } )
        return result;
      },
      deleteFruit: async () =>{
        Fruits.remove( { } );
        return "All fruits are deleted.";
      },
      deleteBucket: async() =>{
        Buckets.remove( { } );
        return "All Buckets are deleted.";
      }
    },
    
    Bucket: {
      fruits: async ({ _id }) =>{
        console.log("ID bukcet-fruits", typeof(_id), _id);
        const response = await Fruits.find({ bucketId: _id.toString() }).toArray();
        console.log("bucket response", response);
        return response;
      }
    },
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

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