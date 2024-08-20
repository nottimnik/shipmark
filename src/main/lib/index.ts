import { appDirectoryName } from '@shared/constants'
import { homedir } from 'os'

export const getRootDir = () => {
  return `${homedir()}/${appDirectoryName}`
}
