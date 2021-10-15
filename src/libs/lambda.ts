import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import httpMultipartBodyParser from '@middy/http-multipart-body-parser'
import httpHeaderNormalizer from '@middy/http-header-normalizer'

export const middyfy = (handler) => {
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
