import config from 'config'
import { formatJSONResponse } from '@libs/apiGateway'
import { DynamoDBStreamEvent } from 'aws-lambda'
import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import { ApiGatewayManagementApi } from 'aws-sdk'
import { aws as dynamooseAws, model } from 'dynamoose'
import getConnectionsSchema from '../../entities/connection'
import S3, { ClientConfiguration } from 'aws-sdk/clients/s3'
import getS3UrlParser from '../../utils/s3_url_parser'

const AWS_REGION: string = config.get('aws.region')
const STAGE: string = config.get('stage')
const CONNECTION_TABLE_NAME: string = config.get('db.connectionTableName')
const S3_TEST_ENDPOINT = 'http://127.0.0.1:9000'

// websocket url
const API_URL = 'http://localhost:3001'

const pushImage: (event: DynamoDBStreamEvent) => void = async ({ Records }) => {
  const s3Options: ClientConfiguration = {
    region: AWS_REGION,
  }
  const s3UrlParser = getS3UrlParser(STAGE)

  if (process.env.STAGE !== 'production') {
    console.log(
      `PUSH IMAGE HANDLER, STAGE is ${STAGE}, USING LOCAL S3 AND DYNAMO DB`
    )

    // use local dynamoDB
    dynamooseAws.ddb.local()

    // use local minio instead of S3
    s3Options.endpoint = S3_TEST_ENDPOINT
    s3Options.s3ForcePathStyle = true
    s3Options.accessKeyId = config.get('aws.accessKeyId')
    s3Options.secretAccessKey = config.get('aws.secretAccessKey')
  }

  const manager = new ApiGatewayManagementApi({
    region: AWS_REGION,
    endpoint: API_URL,
  })

  const Connection = model(CONNECTION_TABLE_NAME, getConnectionsSchema())
  const s3 = new S3(s3Options)

  const connectionIdsMemo = new Map()
  const imageMemo: string[] = []

  for (const { eventName, dynamodb } of Records) {
    const {
      NewImage: { mph, location, timestamp, url },
    } = dynamodb
    console.log('Got dynamodb event', eventName, location, timestamp, url, mph)

    if (eventName === 'INSERT') {
      const connectionIds = connectionIdsMemo.has(location.S)
        ? connectionIdsMemo.get(location.S)
        : await Connection.query('location').eq(location.S).exec()
      connectionIdsMemo.set(location.S, connectionIds)

      const { bucket: Bucket, key: Key } = s3UrlParser.parse(url.S)

      // bytes were not passing through to client properly, for now convert to base64
      const image = imageMemo.length
        ? imageMemo[0]
        : (await s3.getObject({ Key, Bucket }).promise()).Body.toString(
            'base64'
          )
      imageMemo[0] = image

      for (const connectionId of connectionIds) {
        await manager
          .postToConnection({
            ConnectionId: connectionId.connectionId,
            Data: image,
          })
          .promise()
      }
    }
  }

  return formatJSONResponse({
    message: 'uploaded image and image metadata',
  })
}

export const main = middy(pushImage).use(middyJsonBodyParser())
