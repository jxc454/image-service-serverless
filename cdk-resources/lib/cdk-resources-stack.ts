import * as cdk from '@aws-cdk/core'
import connectionsTableCdk from '../resources/connections-table-cdk'
import imagesTableCdk from '../resources/images-table-cdk'
import imagesBucketCdk from '../resources/images-bucket-cdk'

const STAGE = process.env.STAGE || 'local'

console.log('STAGE', STAGE)

export class CdkResourcesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    connectionsTableCdk(this, STAGE)
    imagesTableCdk(this, STAGE)
    imagesBucketCdk(this, STAGE)
  }
}
