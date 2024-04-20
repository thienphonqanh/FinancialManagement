export enum UserVerifyStatus {
  Unverified, // Chưa xác thực email, mặc định = 0
  Verified, // Đã xác thực email
  Banned // Bị khoá
}

export enum GenderType {
  Male, // Nam, mặc định = 0
  Female, // Nữ
  Another // Khác
}

export enum IncludedReport {
  NotIncluded, // Không bao gồm, mặc định = 0
  Included // Bao gồm
}

export enum Role {
  Admin, // Quản trị viên, mặc định = 0
  User // Người dùng
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  EmailVerifyToken,
  ForgotPasswordToken
}
