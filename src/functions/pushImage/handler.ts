import { formatJSONResponse } from '@libs/apiGateway'
import { DynamoDBStreamEvent } from 'aws-lambda'
import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'

// const AWS_REGION: string = config.get('aws.region')
// const IMAGE_TABLE_NAME: string = config.get('db.imageTableName')
// const BUCKET: string = config.get('images.bucket')
// const S3_TEST_ENDPOINT = 'http://127.0.0.1:9000'

const pushImage: (event: DynamoDBStreamEvent) => void = async ({ Records }) => {
  console.log('IN PUSH IMAGE')

  // console.dir(Records)

  for (const { eventName, dynamodb } of Records) {
    const {
      NewImage: { mph, location, timestamp, url },
    } = dynamodb

    console.log('Got dynamodb event', eventName, location, timestamp, url, mph)
  }

  return formatJSONResponse({
    message: 'uploaded image and image metadata',
  })
}

export const main = middy(pushImage).use(middyJsonBodyParser())
