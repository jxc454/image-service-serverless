import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { AttributeType, StreamViewType } from '@aws-cdk/aws-dynamodb'
import { Construct } from '@aws-cdk/core'

const makeTable: (cons: Construct, stage: string) => dynamodb.Table = (
  cons,
  stage
) => {
  const table = new dynamodb.Table(cons, 'imagesTable', {
    partitionKey: { name: 'location', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'timestamp', type: AttributeType.NUMBER },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    tableName: `${stage}-images`,
    stream: StreamViewType.NEW_IMAGE,
  })

  const cfnTable = table.node.defaultChild as dynamodb.CfnTable
  cfnTable.overrideLogicalId('imagesTable')

  return table
}

export default makeTable
