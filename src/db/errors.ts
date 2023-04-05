export class RowsNotFound extends Error {
  constructor (tableName: string) {
    super("rows not found for " + tableName)

    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);
  }
}
