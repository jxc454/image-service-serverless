import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload'
import config from 'config'
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import { aws as dynamooseAws, model } from 'dynamoose'
import S3, { ClientConfiguration } from 'aws-sdk/clients/s3'

import getImageSchema from '../../entities/image'
import schema from './schema'

const AWS_REGION: string = config.get('aws.region')
const IMAGE_TABLE_NAME: string = config.get('db.imageTableName')
const BUCKET_NAME: string = config.get('images.bucket')
const S3_TEST_ENDPOINT = 'http://127.0.0.1:9000'

// TODO - script to automatically create/verifyExistenceOf imagesBucket on npm start
const saveImage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const s3Options: ClientConfiguration = {
    region: AWS_REGION,
  }

  if (process.env.STAGE === 'local') {
    console.log(
      `SAVE IMAGE, STAGE is ${process.env.STAGE}, USING LOCAL S3 AND DYNAMO DB`
    )

    // use local dynamoDB
    dynamooseAws.ddb.local()

    // use local minio instead of S3
    s3Options.endpoint = S3_TEST_ENDPOINT
    s3Options.s3ForcePathStyle = true
    s3Options.accessKeyId = config.get('aws.accessKeyId')
    s3Options.secretAccessKey = config.get('aws.secretAccessKey')
  }

  const {
    body: { location, mph, timestamp, image },
  } = event

  let s3ImageUrl = ''
  // write to S3 first
  try {
    const s3 = new S3(s3Options)
    const { filename, content, mimetype } = image

    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: content,
      ContentType: mimetype,
    }

    const { Location } = await new Promise(function (resolve, reject) {
      s3.upload(params, function (error: Error, data: ManagedUpload.SendData) {
        if (error) {
          console.error('S3 upload error', error)
          reject(error)
          return
        }

        resolve(data)
      })
    })

    s3ImageUrl = Location
  } catch (error) {
    console.error(error)
  }

  const Image = model(IMAGE_TABLE_NAME, getImageSchema())

  const result = await Image.create({
    location,
    mph: Number(mph),
    timestamp: Number(timestamp),
    url: s3ImageUrl,
    created: new Date().getTime(),
  })

  return formatJSONResponse({
    message: 'uploaded image and image metadata',
    data: result,
  })
}

export const main = middyfy(saveImage)
