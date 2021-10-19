export default {
  Resources: {
    imageMeta: {
      Type: 'AWS::DynamoDB::Table',
      Properties: {
        tableName: '${self:custom.stage}-images',
        attributeDefinitions: [
          {
            attributeName: 'location',
            attributeType: 'S',
          },
          {
            attributeName: 'timestamp',
            attributeType: 'N',
          },
          {
            attributeName: 'mph',
            attributeType: 'N',
          },
          {
            attributeName: 'created',
            attributeType: 'N',
          },
          {
            attributeName: 'url',
            attributeType: 'S',
          },
        ],
        keySchema: [
          { attributeName: 'location', keyType: 'HASH' },
          { attributeName: 'timestamp', keyType: 'RANGE' },
        ],
        billingMode: 'PAY_PER_REQUEST',
      },
    },
  },
}
