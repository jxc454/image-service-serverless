import { Stack, Construct } from '@aws-cdk/core'
import connectionsTableCdk from '../resources/connections-table-cdk'
import imagesTableCdk from '../resources/images-table-cdk'
import imagesBucketCdk from '../resources/images-bucket-cdk'
import apiGatewayCdk from '../resources/api-gateway-cdk'
import webServerBucketCdk from '../resources/webserver-bucket-cdk'
import SpeedCameraStackProps from '../types/SpeedCameraStackProps'

export class SpeedCameraStack extends Stack {
  constructor(scope: Construct, id: string, props: SpeedCameraStackProps) {
    super(scope, id, props)

    connectionsTableCdk(this)
    imagesTableCdk(this)
    imagesBucketCdk(this)
    const webServerBucket = webServerBucketCdk(this, props.stage)
    apiGatewayCdk(this, props.stage, webServerBucket)
  }
}
