import type { AWS } from '@serverless/typescript'

import writeImage from '@functions/writeImage'

const serverlessConfiguration: AWS = {
  service: 'image-service-serverless',
  frameworkVersion: '2',
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
  },
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
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
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { writeImage },
}

module.exports = serverlessConfiguration
