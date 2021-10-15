import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import schema from './schema'

const writeImageMetadata: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    console.dir(event)

    return formatJSONResponse({
      message: 'Hello, welcome to the exciting Serverless world!',
      event,
    })
  }

export const main = middyfy(writeImageMetadata)
