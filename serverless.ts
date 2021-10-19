import type { AWS } from '@serverless/typescript'

import saveImage from '@functions/saveImage'
import wsConnect from '@functions/webSocketConnect'

import imageTable from 'resources/image-table'
import connectionTable from 'resources/connection-table'

const serverlessConfiguration: AWS = {
  service: 'image-service-serverless',
  frameworkVersion: '2',
  resources: {
    ...imageTable,
    ...connectionTable,
  },
  custom: {
    stage: '${self:provider.environment.STAGE}',
    tableName: '${self:custom.stage}-images',
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
    },
  },
  plugins: [
    'serverless-dynamodb-local',
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
    },
    websocketsApiName: 'image-ws',
    // shouldn't really need this since no messages will be incoming
    websocketsApiRouteSelectionExpression: '$request.body.action',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=100',
      STAGE: "${opt:stage, 'dev'}",
      IMAGE_TABLE_NAME: '${self:provider.environment.STAGE}-images',
      CONNECTION_TABLE_NAME: '${self:provider.environment.STAGE}-connections',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { saveImage, wsConnect },
}

module.exports = serverlessConfiguration
