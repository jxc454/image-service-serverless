import * as s3 from '@aws-cdk/aws-s3'
import * as iam from '@aws-cdk/aws-iam'
import { Construct } from '@aws-cdk/core'
import * as apigw from '@aws-cdk/aws-apigateway'

const makeApiGateway: (
  cons: Construct,
  stage: string,
  bucket: s3.Bucket
) => apigw.RestApi = (cons, stage, bucket) => {
  const role = new iam.Role(cons, 'apigw-read-s3-role', {
    roleName: 'ApiGw-S3-ReadOnly',
    assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
  })

  role.addToPolicy(
    new iam.PolicyStatement({
      resources: [`${bucket.bucketArn}/*`],
      actions: ['s3:GetObject'],
    })
  )

  const api = new apigw.RestApi(cons, 'speed-camera-api', {
    deployOptions: { stageName: stage },
  })

  api.root.addMethod(
    'ANY',
    new apigw.AwsIntegration({
      service: 's3',
      integrationHttpMethod: 'GET',
      path: `${bucket.bucketName}/index.html`,
      options: {
        credentialsRole: role,
        integrationResponses: [
          {
            statusCode: '200',
            responseParameters: {
              // this should only work if the integrations-response content-type is text/html
              'method.response.header.Content-Type':
                'integration.response.header.Content-Type',
            },
          },
        ],
      },
    }),
    {
      requestParameters: {
        'method.request.path.file': true,
      },
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Content-Type': true,
          },
          // maybe this is necessary, maybe not...it seems like this is what worked in the console
          responseModels: {
            'text/html': { modelId: '1' },
          },
        },
      ],
    }
  )

  const cfnRestApi = api.node.defaultChild as apigw.CfnRestApi
  cfnRestApi.overrideLogicalId('speedCameraApiGateway')

  return api
}

export default makeApiGateway
