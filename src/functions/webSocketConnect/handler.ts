import config from 'config'
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import { aws as dynamooseAws, model } from 'dynamoose'

import schema from './schema'
import getConnectionSchema from '../../entities/connection'

const CONNECTION_TABLE_NAME: string = config.get('db.connectionTableName')

// might have to do something like this when deploying for real
// AWS.config.update(config);

const wsConnect: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  if (process.env.STAGE === 'local') {
    console.log(`STAGE is ${process.env.STAGE}, USING LOCAL DYNAMO DB`)

    // use local dynamoDB
    dynamooseAws.ddb.local()
  }

  const {
    requestContext: { connectionId, routeKey },
  } = event

  const Connection = model(CONNECTION_TABLE_NAME, getConnectionSchema())

  console.log(CONNECTION_TABLE_NAME, connectionId, routeKey)

  const location = event.queryStringParameters?.location
  switch (routeKey) {
    case '$connect':
      // write to connections DB
      console.log('IN $CONNECT')
      await Connection.create({
        connectionId,
        location,
        created: new Date().getTime(),
      })
      break
    case '$disconnect':
      console.log('IN $DISCONNECT')
      // delete from connections DB

      try {
        await Connection.delete(connectionId)
      } catch (e) {
        console.log(`COULDNT DELETE ${connectionId}`)
        console.dir(e)
      }
      break

    case '$default':
    default:
      console.log('IN DEFAULT')
      // no-op
      break
  }

  return formatJSONResponse({
    statusCode: 200,
  })
}

export const main = middyfy(wsConnect)
