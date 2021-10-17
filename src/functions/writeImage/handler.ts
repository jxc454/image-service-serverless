import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload'

import config from 'config'
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import * as dynamoose from 'dynamoose'
import S3 from 'aws-sdk/clients/s3'

import getImageSchema from '../../database/images'
import schema from './schema'

const AWS_REGION: string = config.get('aws.region')
const IMAGE_TABLE_NAME: string = config.get('db.imageTableName')
const BUCKET: string = config.get('images.bucket')

const writeImageMetadata: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('USING LOCAL DYNAMO DB')
      dynamoose.aws.ddb.local()
    }

    const {
      body: { location, mph, timestamp, image },
    } = event

    let s3Url = 'https://fakeurl.url'
    // write to S3 first
    if (image) {
      try {
        const s3 = new S3({
          region: AWS_REGION,
        })
        const { filename, content, mimetype } = image

        const params = {
          Bucket: BUCKET,
          Key: filename,
          Body: content,
          ContentType: mimetype,
        }

        const { Location } = await new Promise(function (resolve, reject) {
          s3.upload(
            params,
            function (error: Error, data: ManagedUpload.SendData) {
              if (error) {
                // console.error('S3 upload error', error)
                reject(error)
                return
              }

              resolve(data)
            }
          )
        })

        s3Url = Location
      } catch (error) {
        console.error(error)
      }
    }

    const Image = dynamoose.model(IMAGE_TABLE_NAME, getImageSchema(), {})

    const result = await Image.create({
      location,
      mph: Number(mph),
      timestamp: Number(timestamp),
      url: s3Url,
      created: new Date().getTime(),
    })

    return formatJSONResponse({
      message: 'uploaded image and image metadata',
      data: result,
    })
  }

export const main = middyfy(writeImageMetadata)
