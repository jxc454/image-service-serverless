import { handlerPath } from '@libs/handlerResolver'
import { cdkOutput } from '../../../cdk/speed-camera'

const dynamoActions = [
  'dynamodb:CreateItem',
  'dynamodb:Describe*',
  'dynamodb:List*',
  'dynamodb:Get*',
  'dynamodb:UpdateItem',
  'dynamodb:Query',
  'dynamodb:Scan',
  'dynamodb:PutItem',
]

export default (streamArn: string) => ({
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    WS_API_ID: { Ref: 'WebsocketsApi' },
  },
  iamRoleStatementsInherit: true,
  iamRoleStatements: [
    // TODO - delete role for imagesTable?
    {
      Effect: 'Allow',
      Action: dynamoActions,
      Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${cdkOutput.imagesTableName}`,
    },
    {
      Effect: 'Allow',
      Action: dynamoActions,
      Resource: [
        `arn:aws:dynamodb:\${self:provider.region}:*:table/${cdkOutput.connectionsTableName}`,
        `arn:aws:dynamodb:\${self:provider.region}:*:table/${cdkOutput.connectionsTableName}/index/*`,
      ],
    },
    {
      Effect: 'Allow',
      Action: ['s3:Get*', 's3:List*'],
      Resource: [
        `arn:aws:s3:::${cdkOutput.imagesBucket}/*`,
        `arn:aws:s3:::${cdkOutput.imagesBucket}`,
      ],
    },
    {
      Effect: 'Allow',
      Action: ['execute-api:Invoke', 'execute-api:ManageConnections'],
      Resource: {
        'Fn::Join': [
          '',
          [
            /* eslint-disable-next-line no-template-curly-in-string */
            'arn:aws:execute-api:${self:provider.region}:*:',
            { Ref: 'WebsocketsApi' },
            '/qa/POST/@connections/*',
          ],
        ],
      },
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
