export default {
  Resources: {
    imageMeta: {
      Type: 'AWS::DynamoDB::Table',
      Properties: {
        TableName: '${self:custom.stage}-connections',
        AttributeDefinitions: [
          {
            AttributeName: 'location',
            AttributeType: 'S',
          },
          {
            AttributeName: 'connectionId',
            AttributeType: 'S',
          },
          {
            AttributeName: 'created',
            AttributeType: 'N',
          },
        ],
        KeySchema: [{ AttributeName: 'connectionId', KeyType: 'HASH' }],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'location-connectionId',
            KeySchema: [
              { AttributeName: 'location', KeyType: 'HASH' },
              { AttributeName: 'connectionId', KeyType: 'RANGE' },
            ],
            Projection: {
              ProjectionType: 'ALL',
            },
          },
        ],
        BillingMode: 'PAY_PER_REQUEST',
      },
    },
  },
}
