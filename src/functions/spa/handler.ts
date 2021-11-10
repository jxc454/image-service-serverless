import { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

const getHtml: ValidatedEventAPIGatewayProxyEvent<string> = async (event) => {
  console.dir(event)

  const r = Math.random()

  const html = `
  <html>
    <style>
      h1 { color: #73757d; }
    </style>
    <body>
      <h1>Landing Page</h1>
      ${r}
    </body>
  </html>`
  return {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html',
    },
  }
}

export const main = middyfy(getHtml)
