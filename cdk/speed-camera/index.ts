import * as outputs from './outputs.json'
import * as Resources from './cdk.out/SpeedCameraStackQa.template.json'

interface CdkOutput {
  imagesTableName: string
  connectionsTableName: string
  apiGatewayRestApiId: string
  apiGatewayRestApiRootResourceId: string
}

// local dynamo plugin really wants there to be a TableName property
const connectionsKey: keyof typeof Resources.Resources = Object.keys(
  Resources.Resources
).find((key) =>
  key.startsWith('connectionsTable')
)! as keyof typeof Resources.Resources

// @ts-ignore
Resources.Resources[connectionsKey].Properties.TableName = connectionsKey

const imagesKey: keyof typeof Resources.Resources = Object.keys(
  Resources.Resources
).find((key) =>
  key.startsWith('imagesTable')
)! as keyof typeof Resources.Resources

// @ts-ignore
Resources.Resources[imagesKey].Properties.TableName = imagesKey

export default Resources

export const cdkOutput: CdkOutput = {
  ...outputs.SpeedCameraStackQa,
  imagesTableName: imagesKey,
  connectionsTableName: connectionsKey,
}
