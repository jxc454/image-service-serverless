import type { AWS } from '@serverless/typescript'

import saveImage from '@functions/saveImage'
import wsConnect from '@functions/webSocketConnect'
import pushImage from '@functions/pushImage'
import spa from '@functions/spa'

import Resources from './cdk/speed-camera'

const serverlessConfiguration: AWS = {
  service: 'image-service-serverless',
  frameworkVersion: '2',
  resources: {
    Resources,
  },
  custom: {
    stage: 'local',
    tableName: 'local-images',
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
  ],
  provider: {
    stage: '${self:provider.environment.STAGE}',
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      binaryMediaTypes: ['*/*'],
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      apiKeys: ['dev-myFirstKey'],
      // these should be populated after cdk deploy creates the apigw
      restApiId: '3', // The resource ID of your API Gateway (can be found in the console in your API Gateway's base URL),
      restApiRootResourceId: '2', // Root resource ID- this is the ID of the existing root path where you want this service to be mounted (might be for the API Gateway's base root "/" or for some other base path you want to use in front of your functions' paths like "/subpath".)
    },
    websocketsApiName: 'image-ws',
    websocketsApiRouteSelectionExpression: '$request.body.action',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=100',
      STAGE: 'local',
      IMAGE_TABLE_NAME: 'local-images',
      CONNECTION_TABLE_NAME: 'local-connections',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { saveImage, wsConnect, pushImage, spa },
}

module.exports = serverlessConfiguration
