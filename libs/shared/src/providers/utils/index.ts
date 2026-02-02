import awsConfig from '@lib/config/aws'
import { utils } from 'techagr-utils'
import { InternalServerErrorException, Injectable } from '@nestjs/common'

@Injectable()
export class Utils {
  /**
   * Returns enum keys and values as string
   * @param enumType
   * @returns 'Key1 - 0,Key2 - 1,Key3 - 2'
   */
  static GetEnumKeysAndValuesAsString(enumType: any): string {
    return Object.keys(enumType)
      .filter(e => !Number.isNaN(Number(e)))
      .map(e => {
        return `${enumType[e]} - ${e}`
      })
      .toString()
  }

  async sendEmail(to: string, subject: string, body: string): Promise<any> {
    try {
      const sendInfo = await utils.aws.AwsSes.sendEmail(
        awsConfig.credentials.accessKeyId,
        awsConfig.credentials.secretAccessKey,
        awsConfig.services.ses.region,
        awsConfig.services.ses.from,
        to,
        subject,
        body
      )

      return sendInfo
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error to send email')
    }
  }
}
