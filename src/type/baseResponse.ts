export interface BaseResponse<T> {
  timestamp?: Date
  statusCode: number
  errorMessage: string
  message: string
  data: T
}

export interface Meta {
  itemsPerPage: number
  totalItems: number
  currentPage: number
  totalPages: number
}
