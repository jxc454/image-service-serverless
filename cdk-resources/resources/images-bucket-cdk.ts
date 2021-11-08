import * as s3 from '@aws-cdk/aws-s3'
import { Construct } from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

const makeBucket: (cons: Construct, stage: string) => s3.Bucket = (
  cons,
  stage
) => {
  const bucket = new s3.Bucket(cons, 'imagesBucket', {
    bucketName: `${stage}-images`,
    versioned: false,
  })

  const cfnTable = bucket.node.defaultChild as dynamodb.CfnTable
  cfnTable.overrideLogicalId('imagesBucket')

  return bucket
}

export default makeBucket
