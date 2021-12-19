import { handlerPath } from '@libs/handlerResolver'
import { cdkOutput } from '../../../cdk/speed-camera'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    IMAGE_TABLE_NAME: cdkOutput.imagesTableName,
    IMAGE_BUCKET_NAME: cdkOutput.imagesBucket,
  },
  iamRoleStatementsInherit: true,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:CreateItem',
        'dynamodb:Describe*',
        'dynamodb:List*',
        'dynamodb:Get*',
        'dynamodb:UpdateItem',
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:PutItem',
      ],
      Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${cdkOutput.imagesTableName}`,
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
      http: {
        method: 'post',
        // this might help with swagger gen
        operationId: 'saveImage',
        path: 'image',
        private: true,
      },
    },
  ],
}
