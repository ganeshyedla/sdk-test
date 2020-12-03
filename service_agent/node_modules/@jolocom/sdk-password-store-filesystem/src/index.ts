import { writeFileSync, readFileSync } from 'fs'
import { IPasswordStore } from '@jolocom/sdk/js/src/lib/storage'

export class FilePasswordStore implements IPasswordStore {
  private filePath: string

  constructor(filePath = './password.txt') {
    this.filePath = filePath
  }

  public async getPassword() {
    try {
      return readFileSync(this.filePath).toString()
    } catch (err) {
      console.error('Error reading password file', err, '\n\n')
      throw err
    }
  }

  public async savePassword(pass: string) {
    console.log('Saving password to: ', this.filePath)
    return writeFileSync(this.filePath, pass)
  }
}
