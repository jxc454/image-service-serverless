import * as dynamoose from 'dynamoose'

const getConnectionsSchema = () =>
  new dynamoose.Schema({
    connectionId: {
      type: String,
      hashKey: true,
    },
    location: {
      type: String,
      index: {
        name: 'location-connectionId',
        global: true,
        rangeKey: 'connectionId',
        project: true,
      },
    },
    created: {
      type: Number,
    },
  })

export default getConnectionsSchema
