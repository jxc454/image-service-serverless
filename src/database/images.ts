import * as dynamoose from 'dynamoose'

const getSchema = () =>
  new dynamoose.Schema({
    location: {
      type: String,
      hashKey: true,
    },
    mph: Number,
    timestamp: {
      type: Number,
      rangeKey: true,
    },
    created: Number,
    url: String,
  })

export default getSchema
