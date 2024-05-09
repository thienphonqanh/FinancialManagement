import { ADMINS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { getFields, handleUploadImage } from '~/utils/file'
import { Request, Response, NextFunction } from 'express'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { wrapRequestHandler } from '~/utils/handlers'
import fsPromise from 'fs/promises'

// Muốn sử dụng async await trong handler express thì phải có try catch
// Nếu không dùng try catch thì phải dùng wrapRequestHandler
const cashFlowAndCategoryValidator = (collection: string) =>
  wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Thực hiện việc upload file - parse dữ liệu từ form-data
    const files = await handleUploadImage(req)
    const fields = getFields() // Lấy các fields sau khi parse
    // Lấy fields name
    const nameValue = Array.isArray(fields.name) ? fields.name[0] : fields.name
    /*  
      Nếu là CashFlow thì kiểm tra name còn CashFlowCategory thì cash_flow_id và parent_id
      Lấy fields cash_flow_id -> id của dòng tiền
      Lấy fields parent_id -> id của hạng mục cha
    */
    const cashFlowIdValue = Array.isArray(fields.cash_flow_id) ? fields.cash_flow_id[0] : fields.cash_flow_id
    const parentIdValue = Array.isArray(fields.parent_id) ? fields.parent_id[0] : fields.parent_id
    // Kiểm tra rỗng tên
    if (nameValue === undefined || nameValue.trim() === '') {
      // Xoá file đã upload
      files.forEach((file) => {
        fsPromise.unlink(file.filepath)
      })
      return next(
        new ErrorWithStatus({
          message:
            collection === 'CashFlow'
              ? ADMINS_MESSAGES.CASH_FLOW_NAME_IS_REQUIRED
              : ADMINS_MESSAGES.CASH_FLOW_CATEGORY_NAME_IS_REQUIRED,
          status: HTTP_STATUS.UNPROCESSABLE_ENTITY
        })
      )
    }
    // Đối với CashFlowCategory
    if (collection === 'CashFlowCategory') {
      if (
        (cashFlowIdValue === undefined || cashFlowIdValue.trim() === '') &&
        (parentIdValue === undefined || parentIdValue.trim() === '')
      ) {
        // Xoá file đã upload
        files.forEach((file) => {
          fsPromise.unlink(file.filepath)
        })
        return next(
          new ErrorWithStatus({
            message: ADMINS_MESSAGES.CASH_FLOW_CATEGORY_MUST_BELONG_TO_CASH_FLOW,
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY
          })
        )
      }
    }
    const isExist =
      collection === 'CashFlow'
        ? await databaseService.cashFlows.findOne({ name: nameValue })
        : await databaseService.cashFlowCategories.findOne({
            $or: [{ name: nameValue }, { 'sub_category.name': nameValue }]
          })
    // Kiểm tra tồn tại
    if (isExist !== null) {
      // Xoá file đã upload
      files.forEach((file) => {
        fsPromise.unlink(file.filepath)
      })
      return next(
        new ErrorWithStatus({
          message:
            collection === 'CashFlow'
              ? ADMINS_MESSAGES.CASH_FLOW_NAME_IS_EXIST
              : ADMINS_MESSAGES.CASH_FLOW_CATEGORY_NAME_IS_EXIST,
          status: HTTP_STATUS.UNPROCESSABLE_ENTITY
        })
      )
    }
    // Gán giá trị vào req.body
    req.body = { files, fields }
    // Next errors
    next()
  })

// Validator cho thêm dòng tiền (addCashFlow)
export const cashFlowValidator = cashFlowAndCategoryValidator('CashFlow')
// Validator cho thêm hạng mục (addCashFlowCategory)
export const cashFlowCategoryValidator = cashFlowAndCategoryValidator('CashFlowCategory')
