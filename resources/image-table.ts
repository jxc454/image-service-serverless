export default {
  images: {
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
      ],
      KeySchema: [
        { AttributeName: 'location', KeyType: 'HASH' },
        { AttributeName: 'timestamp', KeyType: 'RANGE' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      StreamSpecification: {
        StreamViewType: 'NEW_IMAGE',
      },
    },
  },
}
