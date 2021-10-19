import { handlerPath } from '@libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
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
