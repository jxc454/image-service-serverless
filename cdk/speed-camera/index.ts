import * as outputs from './outputs.json'
import * as Resources from './cdk.out/SpeedCameraStackQa.template.json'

interface CdkOutput {
  imagesTableName: string
  imagesTableStreamArn: string
  connectionsTableName: string
  apiGatewayRestApiId: string
  apiGatewayRestApiRootResourceId: string
  imagesBucket: string
}

// local dynamo plugin really wants there to be a TableName property
const connectionsKey: keyof typeof Resources.Resources = Object.keys(
  Resources.Resources
).find((key) =>
  key.startsWith('connectionsTable')
)! as keyof typeof Resources.Resources

// @ts-ignore
Resources.Resources[connectionsKey].Properties.TableName =
  outputs.SpeedCameraStackQa.connectionsTableName

const imagesKey: keyof typeof Resources.Resources = Object.keys(
  Resources.Resources
).find((key) =>
  key.startsWith('imagesTable')
)! as keyof typeof Resources.Resources

// @ts-ignore
Resources.Resources[imagesKey].Properties.TableName =
  outputs.SpeedCameraStackQa.imagesTableName

export default Resources

export const cdkOutput: CdkOutput = {
  ...outputs.SpeedCameraStackQa,
}
