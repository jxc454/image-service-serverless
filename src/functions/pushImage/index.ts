import { handlerPath } from '@libs/handlerResolver'
import { cdkOutput } from '../../../cdk/speed-camera'

export default (streamArn: string) => ({
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    WS_API_ID: { Ref: 'WebsocketsApi' },
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:CreateItem',
        'dynamodb:CreateTable',
        'dynamodb:GetItem',
      ],
      Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${cdkOutput.imagesTableName}`,
    },
    {
      Effect: 'Allow',
      Action: ['dynamodb:GetItem'],
      Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${cdkOutput.connectionsTableName}`,
    },
    {
      Effect: 'Allow',
      Action: ['s3:Get*', 's3:List*'],
      Resource: [
        `arn:aws:s3:::${cdkOutput.imagesBucket}/*`,
        `arn:aws:s3:::${cdkOutput.imagesBucket}`,
      ],
    },
  ],
  events: [
    {
      stream: {
        enabled: true,
        type: 'dynamodb',
        batchSize: 10,
        startingPosition: 'TRIM_HORIZON',
        arn: streamArn,
      },
    },
  ],
})
