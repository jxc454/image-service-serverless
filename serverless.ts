import type { AWS } from '@serverless/typescript'

import saveImage from '@functions/saveImage'
import wsConnect from '@functions/webSocketConnect'
import pushImage from '@functions/pushImage'

import Resources, { cdkOutput } from './cdk/speed-camera'

const stage = process.env.STAGE

const serverlessConfiguration: AWS = {
  service: `SpeedCameraApi${stage}`,
  frameworkVersion: '2',
  resources: stage === 'local' ? Resources : undefined,
  package: {
    patterns: ['config/**', '!config/local.yaml', 'node_modules/js-yaml'],
  },
  custom: {
    stage: 'local',
    tableName: cdkOutput.imagesTableName,
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: false,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
    dynamodb: {
      stages: ['local', 'dev'],
      start: {
        migrate: true,
      },
    },
    'serverless-offline-dynamodb-streams': {
      apiVersion: '2013-12-02',
      endpoint: 'http://0.0.0.0:8000',
      region: 'local',
      accessKeyId: 'root',
      secretAccessKey: 'root',
      skipCacheInvalidation: false,
      readInterval: 500,
    },
  },
  plugins: [
    'serverless-dynamodb-local',
    'serverless-offline-dynamodb-streams',
    'serverless-offline',
    'serverless-esbuild',
    'serverless-iam-roles-per-function',
  ],
  provider: {
    stage,
    name: 'aws',
    // TODO - put region in one place
    region: 'us-east-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      binaryMediaTypes: ['*/*'],
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      // see https://github.com/serverless/serverless/issues/7922 for issue with sls remove and apiKeys: [...]
      apiKeys: ['saveImageApiKey'],
      // these should be populated after cdk deploy creates the apigw
      restApiId: cdkOutput.apiGatewayRestApiId,
      restApiRootResourceId: cdkOutput.apiGatewayRestApiRootResourceId,
    },
    websocketsApiName: 'SpeedCameraWebsocketsApi',
    websocketsApiRouteSelectionExpression: '$request.body.action',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=100',
      STAGE: stage,
      IMAGE_TABLE_NAME: cdkOutput.imagesTableName,
      CONNECTION_TABLE_NAME: cdkOutput.connectionsTableName,
      IMAGE_BUCKET_NAME: cdkOutput.imagesBucket,
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    saveImage,
    wsConnect,
    pushImage: pushImage(cdkOutput.imagesTableStreamArn),
  },
}

module.exports = serverlessConfiguration
