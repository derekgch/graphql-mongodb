
 const typeDefs = [`
    type Query {
      hello(text: String): String
      buckets: [Bucket]
      fruits(bucketId: String): [Fruit]
      allFruits: [Fruit]
      fruit(_id: String): Fruit
      bucket(_id: String): Bucket
    }

    type Bucket {
      _id: String
      title: String
      description: String
      fruits: [Fruit]
    }
    
    type Fruit {
      _id: String
      bucketId: String
      description: String
      bucket: Bucket
    }

    type Mutation {
      change(text: String): String
      createBucket(title: String, description: String): Bucket
      createFruit(bucketId: String, description: String): Fruit
      updateFruit(_id: String, newBucketId: String): Fruit
      updateBucket(_id: String, description: String): Bucket
      deleteFruit(_id: String): Fruit
      deleteBucket(_id: String): Bucket 
      deleteAllFruit: String
      deleteAllBucket: String
    }

    schema {
      query: Query
      mutation: Mutation
    }
  `]

  module.exports = {
    typeDefs,
  }