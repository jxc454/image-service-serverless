export default {
  Resources: {
    imageMeta: {
      Type: 'AWS::DynamoDB::Table',
      Properties: {
        TableName: '${self:custom.stage}-images',
        AttributeDefinitions: [
          {
            AttributeName: 'location',
            AttributeType: 'S',
          },
          {
            AttributeName: 'timestamp',
            AttributeType: 'N',
          },
          {
            AttributeName: 'mph',
            AttributeType: 'N',
          },
          {
            AttributeName: 'created',
            AttributeType: 'N',
          },
          {
            AttributeName: 'url',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          { AttributeName: 'location', KeyType: 'HASH' },
          { AttributeName: 'timestamp', KeyType: 'RANGE' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        StreamSpecification: {
          StreamViewType: 'KEYS_ONLY',
        },
      },
    },
  },
}
