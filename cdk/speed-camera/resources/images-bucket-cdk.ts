import * as s3 from '@aws-cdk/aws-s3'
import { CfnOutput, Construct, RemovalPolicy } from '@aws-cdk/core'

const makeBucket: (cons: Construct) => s3.Bucket = (cons) => {
  const bucket = new s3.Bucket(cons, 'imagesBucket', {
    versioned: false,
    publicReadAccess: false,
    removalPolicy: RemovalPolicy.DESTROY,
  })

  const bucketNameOutput = new CfnOutput(bucket, 'imagesBucket', {
    value: bucket.bucketName,
  })
  bucketNameOutput.overrideLogicalId('imagesBucket')

  return bucket
}

export default makeBucket
