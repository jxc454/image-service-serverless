import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import httpMultipartBodyParser from '@middy/http-multipart-body-parser'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'

export const middyfy = <T>(handler: ValidatedEventAPIGatewayProxyEvent<T>) => {
  return middy(handler)
    .use(
      httpHeaderNormalizer({
        normalizeHeaderKey: (headerName) => {
          if (headerName.toLowerCase() === 'content-type') {
            return 'content-type'
          }
          return headerName
        },
      })
    )
    .use(httpMultipartBodyParser())
    .use(middyJsonBodyParser())
}
