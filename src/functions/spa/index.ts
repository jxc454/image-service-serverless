import { handlerPath } from '@libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'any',
        // authorizer can also be another lambda
        authorizer: 'aws_iam',
        // this might help with swagger gen
        operationId: 'getHtml',
        path: '',
        private: false,
      },
    },
  ],
}
