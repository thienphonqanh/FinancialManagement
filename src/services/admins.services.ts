import databaseService from './database.services'
import CashFlowCategory from '~/models/schemas/CashFlowCategory.schemas'
import { ObjectId } from 'mongodb'
import fsPromise from 'fs/promises'
import { Request } from 'express'
import { uploadFileToS3 } from '~/utils/s3'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { ADMINS_MESSAGES } from '~/constants/messages'
import CashFlow from '~/models/schemas/CashFlow.schemas'
import { Fields, File } from 'formidable'

class AdminsService {
  async addCashflow(req: Request) {
    const files = req.body.files as File[]
    const fields = req.body.fields as Fields<string>

    const url = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          filename: 'icons/cashflow/' + file.newFilename,
          contentType: (await import('mime')).default.getType(file.filepath) as string,
          filepath: file.filepath
        })
        fsPromise.unlink(file.filepath)
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string
        }
      })
    )
    // Lấy data từ fields đã parse từ form-data
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name
    const cashFlow = new CashFlow({
      _id: new ObjectId(),
      icon: url[0].url,
      name: name as string
    })

    await databaseService.cashFlows.insertOne(cashFlow)
    return ADMINS_MESSAGES.ADD_CASH_FLOW_SUCCESS
  }

  async addCashflowCategory(req: Request) {
    const files = req.body.files as File[]
    const fields = req.body.fields as Fields<string>

    const url = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          filename: 'icons/cashflow-category/' + file.newFilename,
          contentType: (await import('mime')).default.getType(file.filepath) as string,
          filepath: file.filepath
        })
        fsPromise.unlink(file.filepath)
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string
        }
      })
    )
    // Lấy data từ fields đã parse từ form-data
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name
    const cash_flow_id = Array.isArray(fields.cash_flow_id) ? fields.cash_flow_id[0] : fields.cash_flow_id
    const parent_id = Array.isArray(fields.parent_id) ? fields.parent_id[0] : fields.parent_id
    // Kiểm tra tồn tại của parent_id -> (sub_category)
    if (parent_id !== undefined && parent_id.trim() !== '') {
      await databaseService.cashFlowCategories.findOneAndUpdate({ _id: new ObjectId(parent_id as string) }, [
        {
          $set: {
            sub_category: {
              $concatArrays: [
                '$sub_category',
                [
                  {
                    _id: new ObjectId(),
                    icon: url[0].url,
                    name: name as string,
                    isChosen: 0 // Mặc định: không chọn
                  }
                ]
              ]
            }
          }
        }
      ])
      return ADMINS_MESSAGES.ADD_CASH_FLOW_CATEGORY_SUCCESS
    }

    const cashFlowCategory = new CashFlowCategory({
      _id: new ObjectId(),
      icon: url[0].url,
      name: name as string,
      cash_flow_id: new ObjectId(cash_flow_id as string)
    })
    await databaseService.cashFlowCategories.insertOne(cashFlowCategory)
    return ADMINS_MESSAGES.ADD_CASH_FLOW_CATEGORY_SUCCESS
  }
}

const adminsService = new AdminsService()
export default adminsService
