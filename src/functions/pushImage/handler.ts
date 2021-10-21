import config from 'config'
import { formatJSONResponse } from '@libs/apiGateway'
import { DynamoDBStreamEvent } from 'aws-lambda'
import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import { ApiGatewayManagementApi } from 'aws-sdk'
import { aws as dynamooseAws, model } from 'dynamoose'
import getConnectionsSchema from '../../entities/connection'

const AWS_REGION: string = config.get('aws.region')
const STAGE: string = config.get('stage')
const CONNECTION_TABLE_NAME: string = config.get('db.connectionTableName')

// websocket url
const API_URL = 'http://localhost:3001'

const pushImage: (event: DynamoDBStreamEvent) => void = async ({ Records }) => {
  console.log('IN PUSH IMAGE', `table name ${CONNECTION_TABLE_NAME}`)

  console.dir(Records)

  if (process.env.STAGE !== 'production') {
    console.log(`STAGE is ${STAGE}, USING LOCAL S3 AND DYNAMO DB`)

    // use local dynamoDB
    dynamooseAws.ddb.local()

    // use local minio instead of S3
    // s3Options.endpoint = S3_TEST_ENDPOINT
    // s3Options.s3ForcePathStyle = true
    // s3Options.accessKeyId = config.get('aws.accessKeyId')
    // s3Options.secretAccessKey = config.get('aws.secretAccessKey')
  }

  const manager = new ApiGatewayManagementApi({
    region: AWS_REGION,
    endpoint: API_URL,
  })

  const Connection = model(CONNECTION_TABLE_NAME, getConnectionsSchema())

  for (const { eventName, dynamodb } of Records) {
    const {
      NewImage: { mph, location, timestamp, url },
    } = dynamodb

    console.log('Got dynamodb event', eventName, location, timestamp, url, mph)

    if (eventName === 'INSERT') {
      const connectionIds = await Connection.query('location')
        .eq(location.S)
        .exec()

      console.log(`connectionIds length ${connectionIds.length}`, connectionIds)

      for (const connectionId of connectionIds) {
        const res = await manager
          .postToConnection({
            ConnectionId: connectionId.connectionId,
            Data: url.S,
          })
          .promise()

        console.dir(res)
      }
    }
  }

  return formatJSONResponse({
    message: 'uploaded image and image metadata',
  })
}

export const main = middy(pushImage).use(middyJsonBodyParser())
