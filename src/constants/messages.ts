export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email không hợp lệ',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Mật khẩu phải từ 6 đến 50 ký tự',
  PASSWORD_MUST_BE_STRONG:
    'Mật khẩu phải từ 6 đến 50 ký tự và chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Mật khẩu phải từ 6 đến 50 ký tự',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Mật khẩu phải từ 6 đến 50 ký tự và chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Mật khẩu không trùng khớp',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  LOGOUT_SUCCESS: 'Logout success',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_NOT_FOUND: 'Người dùng không hợp lệ',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  USER_NOT_VERIFIED: 'User not verified',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  GET_ME_SUCCESS: 'Lấy thông tin người dùng thành công'
} as const

export const ADMINS_MESSAGES = {
  CASH_FLOW_NAME_IS_REQUIRED: 'Tên dòng tiền không được để trống',
  CASH_FLOW_NAME_IS_EXIST: 'Tên dòng tiền đã tồn tại',
  CASH_FLOW_CATEGORY_NAME_IS_REQUIRED: 'Tên hạng mục không được để trống',
  CASH_FLOW_CATEGORY_NAME_IS_EXIST: 'Tên hạng mục đã tồn tại',
  CASH_FLOW_CATEGORY_MUST_BELONG_TO_CASH_FLOW: 'Hạng mục phải thuộc về dòng tiền',
  CASH_FLOW_NOT_FOUND: 'Không tìm thấy dòng tiền',
  CASH_FLOW_PARENT_CATEGORY_NOT_FOUND: 'Không tìm thấy hạng mục cha',
  ADD_CASH_FLOW_SUCCESS: 'Thêm dòng tiền thành công',
  ADD_CASH_FLOW_CATEGORY_SUCCESS: 'Thêm hạng mục thành công',
  USER_IS_NOT_ADMIN: 'Bạn không có quyền này',
  MONEY_ACCOUNT_TYPE_ICON_IS_REQUIRED: 'Ảnh loại tài khoản không được để trống',
  MONEY_ACCOUNT_TYPE_ICON_MUST_BE_A_STRING: 'Ảnh loại tài khoản phải là chuỗi',
  MONEY_ACCOUNT_TYPE_ICON_IS_EXIST: 'Ảnh loại tài khoản đã tồn tại',
  MONEY_ACCOUNT_TYPE_NAME_IS_REQUIRED: 'Tên loại tài khoản được để trống',
  MONEY_ACCOUNT_TYPE_NAME_MUST_BE_A_STRING: 'Tên loại tài khoản phải là chuỗi',
  MONEY_ACCOUNT_TYPE_NAME_IS_EXIST: 'Tên loại tài khoản đã tồn tại',

  ADD_MONEY_ACCOUNT_TYPE_SUCCESS: 'Thêm loại tài khoản thành công'
} as const

export const APP_MESSAGES = {
  GET_CASH_FLOW_SUCCESS: 'Lấy dòng tiền thành công',
  GET_MONEY_ACCOUNT_SUCCESS: 'Lấy tài khoản tiền thành công',
  GET_MONEY_ACCOUNT_TYPE_SUCCESS: 'Lấy loại tài khoản tiền thành công',
  USER_ID_IS_REQUIRED: 'ID người dùng là bắt buộc',
  USER_ID_MUST_BE_A_STRING: 'ID người dùng phải là chuỗi',
  CREDIT_LIMIT_NUMBER_IS_REQUIRED: 'Hạn mức tín dụng là bắt buộc',
  CREDIT_LIMIT_NUMBER_MUST_BE_A_NUMBER: 'Hạn mức tín dụng phải là số',
  CREDIT_LIMIT_NUMBER_MUST_BE_GREATER_THAN_0: 'Hạn mức tín dụng phải lớn hơn 0',
  REPORT_MUST_BE_A_NUMBER: 'Bao gồm báo cáo phải là số',
  REPORT_MUST_BE_0_OR_1: 'Bao gồm báo cáo phải là 0 hoặc 1',
  ACCOUNT_BALANCE_MUST_IS_REQUIRED: 'Số dư tài khoản là bắt buộc',
  ACCOUNT_BALANCE_MUST_BE_A_NUMBER: 'Số dư tài khoản phải là số',
  ACCOUNT_BALANCE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0: 'Số dư tài khoản phải lớn hơn hoặc bằng 0',
  MONEY_ACCOUNT_NAME_IS_EXIST: 'Tên tài khoản đã tồn tại',
  MONEY_ACCOUNT_MUST_BELONG_TO_MONEY_ACCOUNT_TYPE: 'Phải có loại tài khoản đối với một tài khoản tiền',
  MONEY_ACCOUNT_IS_EXIST: 'Tài khoản tiền đã tồn tại',
  ADD_MONEY_ACCOUNT_SUCCESS: 'Thêm tài khoản tiền thành công',
  MONEY_ACCOUNT_NAME_IS_REQUIRED: 'Tên tài khoản được để trống',
  MONEY_ACCOUNT_NAME_MUST_BE_A_STRING: 'Tên tài khoản phải là chuỗi',
  MONEY_ACCOUNT_TYPE_ID_MUST_BE_A_STRING: 'Loại tài khoản phải là chuỗi',
  MONEY_ACCOUNT_TYPE_NOT_FOUND: 'Loại tài khoản không hợp lệ',
  EXPENSE_RECORD_AMOUNT_OF_MONEY_IS_REQUIRED: 'Số tiền ghi chép là bắt buộc',
  EXPENSE_RECORD_AMOUNT_OF_MONEY_MUST_BE_A_NUMBER: 'Số tiền ghi chép phải là số',
  EXPENSE_RECORD_AMOUNT_OF_MONEY_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0: 'Số tiền ghi chép phải lớn hơn hoặc bằng 0',
  CASH_FLOW_CATEGORY_ID_IS_REQUIRED: 'Hạng mục của dòng tiền là bắt buộc',
  CASH_FLOW_CATEGORY_ID_MUST_BE_A_STRING: 'Hạng mục của dòng tiền phải là chuỗi',
  CASH_FLOW_CATEGORY_NOT_FOUND: 'Hạng mục của dòng tiền không hợp lệ',
  MONEY_ACCOUNT_ID_IS_REQUIRED: 'Tài khoản tiền là bắt buộc',
  MONEY_ACCOUNT_ID_MUST_BE_A_STRING: 'Tài khoản tiền phải là chuỗi',
  MONEY_ACCOUNT_NOT_FOUND: 'Tài khoản tiền phải là chuỗi',
  ADD_EXPENSE_RECORD_SUCCESS: 'Thêm mới bản ghi chi tiêu thành công'
} as const
