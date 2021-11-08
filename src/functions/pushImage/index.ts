import { handlerPath } from '@libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      stream: {
        enabled: true,
        type: 'dynamodb',
        batchSize: 10,
        startingPosition: 'TRIM_HORIZON',
        arn: {
          'Fn::GetAtt': ['imagesTable', 'StreamArn'],
        },
      },
    },
  ],
}
