import { handlerPath } from '@libs/handlerResolver'
import { cdkOutput } from '../../../cdk/speed-camera'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatementsInherit: true,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:CreateItem',
        'dynamodb:Describe*',
        'dynamodb:DeleteItem',
        'dynamodb:List*',
        'dynamodb:Get*',
        'dynamodb:UpdateItem',
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:PutItem',
      ],
      Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${cdkOutput.connectionsTableName}`,
    },
    {
      Effect: 'Allow',
      Action: ['s3:Get*', 's3:List*', 's3:PutObject'],
      Resource: [
        `arn:aws:s3:::${cdkOutput.imagesBucket}/*`,
        `arn:aws:s3:::${cdkOutput.imagesBucket}`,
      ],
    },
  ],
  events: [
    {
      websocket: '$connect',
    },
    {
      websocket: '$disconnect',
    },
    {
      websocket: '$default',
    },
  ],
}
