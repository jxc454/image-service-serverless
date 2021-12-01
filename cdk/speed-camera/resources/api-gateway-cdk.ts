import * as s3 from '@aws-cdk/aws-s3'
import { Construct, CfnOutput } from '@aws-cdk/core'
import { EndpointType, HttpIntegration, RestApi } from '@aws-cdk/aws-apigateway'
import { Certificate } from '@aws-cdk/aws-certificatemanager'
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53'
import { ApiGateway } from '@aws-cdk/aws-route53-targets'

const makeApiGateway: (
  cons: Construct,
  stage: string,
  bucket: s3.Bucket
) => RestApi = (cons, stage, bucket) => {
  const { domain, certArn, hostedZoneId } = cons.node.tryGetContext(stage)

  const api = new RestApi(cons, 'speed-camera-api', {
    deployOptions: { stageName: stage },
    endpointConfiguration: { types: [EndpointType.REGIONAL] },
  })

  // need a GET on / to proxy to s3/index.html
  const getMethod = new HttpIntegration(
    `${bucket.bucketWebsiteUrl}/index.html`,
    {
      httpMethod: 'GET',
      proxy: true,
    }
  )
  api.root.addMethod('GET', getMethod)

  // need an ANY with {proxy+} to get to the rest of the static files
  api.root.addProxy({
    defaultMethodOptions: {
      requestParameters: { 'method.request.path.proxy': true },
    },
    anyMethod: true,
    defaultIntegration: new HttpIntegration(
      `${bucket.bucketWebsiteUrl}/{proxy}`,
      {
        options: {
          requestParameters: {
            'integration.request.path.proxy': 'method.request.path.proxy',
          },
        },
        httpMethod: 'GET',
        proxy: true,
      }
    ),
  })

  // Custom Domain Name
  api.addDomainName('apiDomainName', {
    domainName: domain,
    certificate: Certificate.fromCertificateArn(
      cons,
      'acmCertificate',
      certArn
    ),
    endpointType: EndpointType.REGIONAL,
  })

  // DNS Record
  /* eslint-disable-next-line no-new */
  new ARecord(cons, 'aRecord', {
    recordName: domain,
    target: RecordTarget.fromAlias(new ApiGateway(api)),
    zone: HostedZone.fromHostedZoneAttributes(cons, 'hostedZone', {
      hostedZoneId,
      // zone name assumed to be sld.tld
      zoneName: domain.split('.').slice(-2).join('.'),
    }),
  })

  // outputs for the sls deploy
  const apiIdOutput = new CfnOutput(api, 'apiGatewayRestApiId', {
    value: api.restApiId,
  })
  apiIdOutput.overrideLogicalId('apiGatewayRestApiId')

  const rootResourceIdOutput = new CfnOutput(
    api,
    'apiGatewayRestApiRootResourceId',
    {
      value: api.restApiRootResourceId,
    }
  )
  rootResourceIdOutput.overrideLogicalId('apiGatewayRestApiRootResourceId')

  return api
}

export default makeApiGateway
