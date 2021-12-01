import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { AttributeType, StreamViewType } from '@aws-cdk/aws-dynamodb'
import { CfnOutput, Construct } from '@aws-cdk/core'

const makeTable: (cons: Construct) => dynamodb.Table = (cons) => {
  const table = new dynamodb.Table(cons, 'imagesTable', {
    partitionKey: { name: 'location', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'timestamp', type: AttributeType.NUMBER },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    stream: StreamViewType.NEW_IMAGE,
  })

  const streamArnOutput = new CfnOutput(table, 'imagesTableStreamArn', {
    value: table.tableStreamArn || '',
  })
  streamArnOutput.overrideLogicalId('imagesTableStreamArn')

  const tableNameOutput = new CfnOutput(table, 'imagesTableName', {
    value: table.tableName,
  })
  tableNameOutput.overrideLogicalId('imagesTableName')

  return table
}

export default makeTable
