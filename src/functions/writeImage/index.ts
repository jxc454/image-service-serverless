import { handlerPath } from '@libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        // authorizer can also be another lambda
        authorizer: 'aws_iam',
        // this might help with swagger gen
        operationId: 'writeImage',
        path: 'image',
        private: true,
      },
    },
  ],
}
