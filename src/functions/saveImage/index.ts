import { handlerPath } from '@libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.saveImage`,
  events: [
    {
      http: {
        method: 'post',
        // authorizer can also be another lambda
        authorizer: 'aws_iam',
        // this might help with swagger gen
        operationId: 'saveImage',
        path: 'image',
        private: true,
      },
    },
  ],
}
