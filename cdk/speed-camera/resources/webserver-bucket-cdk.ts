import * as s3 from '@aws-cdk/aws-s3'
import { Construct, RemovalPolicy } from '@aws-cdk/core'

const makeBucket: (cons: Construct, stage: string) => s3.Bucket = (
  cons,
  stage
) => {
  const { domain } = cons.node.tryGetContext(stage)

  const bucket = new s3.Bucket(cons, 'webServerBucket', {
    versioned: false,
    publicReadAccess: true,
    removalPolicy: RemovalPolicy.DESTROY,
    websiteIndexDocument: 'index.html',
    autoDeleteObjects: true,
    bucketName: domain,
  })

  bucket.grantPublicAccess()
  return bucket
}

export default makeBucket
