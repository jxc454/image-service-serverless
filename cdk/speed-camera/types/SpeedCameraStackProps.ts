import { StackProps } from '@aws-cdk/core'

export default interface SpeedCameraStackProps extends StackProps {
  readonly stage: 'prod' | 'qa'
}
