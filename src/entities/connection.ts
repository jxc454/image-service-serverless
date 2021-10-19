import * as dynamoose from 'dynamoose'

const getSchema = () =>
  new dynamoose.Schema({
    connectionId: { type: String, hashKey: true },
    location: {
      type: String,
    },
    created: {
      type: Number,
    },
  })

export default getSchema
