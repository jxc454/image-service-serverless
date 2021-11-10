import { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import config from 'config'
import S3, { ClientConfiguration } from 'aws-sdk/clients/s3'
import getS3UrlParser from '../../utils/s3_url_parser'

const AWS_REGION: string = config.get('aws.region')
const STAGE: string = config.get('stage')
const BUCKET: string = config.get('images.bucket')
const S3_TEST_ENDPOINT = 'http://127.0.0.1:9000'

// TODO - need to read path and pull that from s3
//  should also add a second separate bucket to hold static files
const getHtml: ValidatedEventAPIGatewayProxyEvent<string> = async () => {
  const s3Options: ClientConfiguration = {
    region: AWS_REGION,
  }
  const s3UrlParser = getS3UrlParser(STAGE)

  if (process.env.STAGE !== 'production') {
    // use local minio instead of S3
    s3Options.endpoint = S3_TEST_ENDPOINT
    s3Options.s3ForcePathStyle = true
    s3Options.accessKeyId = config.get('aws.accessKeyId')
    s3Options.secretAccessKey = config.get('aws.secretAccessKey')
  }

  const s3 = new S3(s3Options)
  const { bucket: Bucket, key: Key } = s3UrlParser.parse(
    `${S3_TEST_ENDPOINT}/${BUCKET}/index.html`
  )

  return {
    statusCode: 200,
    body: (await s3.getObject({ Key, Bucket }).promise()).Body.toString(),
    headers: {
      'Content-Type': 'text/html',
    },
  }
}

export const main = middyfy(getHtml)
