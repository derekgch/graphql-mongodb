let { buildSchema } = require('graphql');

 const schema = buildSchema(`
    type Query {
      hello(text: String): String
      buckets: [Bucket]
      fruits(bucketID: String): [Fruit]
      allFruits: [Fruit]
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
      bucketID: String
      description: String
    }

    type Mutation {
      change(text: String): String
      createBucket(title: String, description: String): Bucket
      createFruit(bucketID: String, description: String): Fruit
    }

  `);

  module.exports = {
    schema,
  }