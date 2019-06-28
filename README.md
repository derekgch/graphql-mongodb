# graphql-mongodb

## graphql - mongodb CRUD operation

#### https://github.com/graphql/graphql-js/blob/master/docs/Tutorial-Mutations.md
#### buckets and fruits 
#### Bucket contains many fruits, one-to-many
## Schema:
```
type Query {
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
    
