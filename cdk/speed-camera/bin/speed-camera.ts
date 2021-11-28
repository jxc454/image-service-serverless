#!/usr/bin/env node

import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { SpeedCameraStack } from '../lib/speed-camera-stack'

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}

const app = new cdk.App()

// QA stage
/* eslint-disable-next-line no-new */
new SpeedCameraStack(app, 'SpeedCameraStackQa', {
  ...env,
  stage: 'qa',
})

// production stage
// new SpeedCameraStack(app, 'SpeedCameraStackProd', {
//   ...env,
//   stage: 'prod',
// })
