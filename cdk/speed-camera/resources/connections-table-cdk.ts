import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { AttributeType, ProjectionType } from '@aws-cdk/aws-dynamodb'
import { CfnOutput, Construct } from '@aws-cdk/core'

const makeTable: (cons: Construct) => dynamodb.Table = (cons) => {
  const table = new dynamodb.Table(cons, 'connectionsTable', {
    partitionKey: { name: 'connectionId', type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  })

  table.addGlobalSecondaryIndex({
    indexName: 'location-connectionId',
    partitionKey: { name: 'location', type: AttributeType.STRING },
    sortKey: { name: 'connectionId', type: AttributeType.STRING },
    projectionType: ProjectionType.ALL,
  })

  const tableNameOutput = new CfnOutput(table, 'connectionsTableName', {
    value: table.tableName,
  })
  tableNameOutput.overrideLogicalId('connectionsTableName')

  return table
}

export default makeTable
