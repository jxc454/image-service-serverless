import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { AttributeType, StreamViewType } from '@aws-cdk/aws-dynamodb'
import { Construct } from '@aws-cdk/core'

const makeTable: (cons: Construct) => dynamodb.Table = (cons) => {
  return new dynamodb.Table(cons, 'imagesTable', {
    partitionKey: { name: 'location', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'timestamp', type: AttributeType.NUMBER },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    stream: StreamViewType.NEW_IMAGE,
  })
}

export default makeTable
