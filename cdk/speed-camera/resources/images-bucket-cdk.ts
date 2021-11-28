import * as s3 from '@aws-cdk/aws-s3'
import { Construct, RemovalPolicy } from '@aws-cdk/core'

const makeBucket: (cons: Construct) => s3.Bucket = (cons) => {
  return new s3.Bucket(cons, 'imagesBucket', {
    versioned: false,
    publicReadAccess: false,
    removalPolicy: RemovalPolicy.DESTROY,
  })
}

export default makeBucket
