import type { AWS } from '@serverless/typescript'

import writeImage from '@functions/writeImage'
import dynamoDbTable from 'resources/dynamo-db-table'

const serverlessConfiguration: AWS = {
  service: 'image-service-serverless',
  frameworkVersion: '2',
  resources: {
    ...dynamoDbTable,
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
  },
  plugins: ['serverless-esbuild', 'serverless-offline'],
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
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=100',
      STAGE: "${opt:stage, 'dev'}",
      IMAGE_TABLE_NAME: '${self:provider.environment.STAGE}-images',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { writeImage },
}

module.exports = serverlessConfiguration
