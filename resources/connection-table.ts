export default {
  Resources: {
    imageMeta: {
      Type: 'AWS::DynamoDB::Table',
      Properties: {
        tableName: '${self:custom.stage}-connections',
        attributeDefinitions: [
          {
            attributeName: 'location',
            attributeType: 'S',
          },
          {
            attributeName: 'connectionId',
            attributeType: 'S',
          },
          {
            attributeName: 'created',
            attributeType: 'N',
          },
        ],
        keySchema: [{ attributeName: 'connectionId', keyType: 'HASH' }],
        globalSecondaryIndexes: [
          {
            indexName: 'location-connectionId',
            keySchema: [
              { attributeName: 'location', keyType: 'HASH' },
              { attributeName: 'connectionId', keyType: 'RANGE' },
            ],
          },
        ],
        billingMode: 'PAY_PER_REQUEST',
      },
    },
  },
}
