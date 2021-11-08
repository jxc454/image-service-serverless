import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { AttributeType, ProjectionType } from '@aws-cdk/aws-dynamodb'
import { Construct } from '@aws-cdk/core'

const makeTable: (cons: Construct, stage: string) => dynamodb.Table = (
  cons,
  stage
) => {
  const table = new dynamodb.Table(cons, 'connectionsTable', {
    partitionKey: { name: 'connectionId', type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    tableName: `${stage}-connections`,
  })

  table.addGlobalSecondaryIndex({
    indexName: 'location-connectionId',
    partitionKey: { name: 'location', type: AttributeType.STRING },
    sortKey: { name: 'connectionId', type: AttributeType.STRING },
    projectionType: ProjectionType.ALL,
  })

  const cfnTable = table.node.defaultChild as dynamodb.CfnTable
  cfnTable.overrideLogicalId('connectionsTable')

  return table
}

export default makeTable
