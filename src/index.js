let express = require('express');
let graphqlHTTP = require('express-graphql');
let { buildSchema } = require('graphql');
let { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = 'mongodb://localhost:27017';


const initApp = async () => {

  const mongoClient = await MongoClient.connect(MONGO_URL, {useNewUrlParser: true});
  const Buckets = mongoClient.db('demo').collection('buckets');
  const Questions = mongoClient.db('demo').collection('questions');
  const schema = buildSchema(`
    type Query {
      hello(text: String): String
      buckets: [Bucket]
      fruit(_id: String): Fruit
      bucket(_id: String): Bucket
    }

    type Bucket {
      _id: String
      title: String
      description: String
      Fruits: [Fruit]
    }
    
    type Fruit {
      _id: String
      description: String
    }

    type Mutation {
      change(text: String): String
      createBucket(title: String, description: String): Bucket
    }

  `);

  const root = { 
      hello: ({text}) => {
        console.log(text)
        return `hello ${text}`;
      },
      change: ({text}) => `You have entered: ${text}`,
      createBucket: async ({title, description}) =>{
        const response = await Buckets.insertOne({title, description});
        return response;
      },
      buckets: async () => {
        const res = await Buckets.find({}).toArray();
        console.log( res );
        return res;
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

// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// var root = { hello: () => 'Hello world!' };

// var app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true,
// }));
// app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));