enum errorCode {
    BAD_REQUEST = "BAD_REQUEST",
    UNAUTHORIZED = "UNAUTHORIZED",
    NOT_FOUND = "NOT_FOUND",
    FORBIDDEN = "FORBIDDEN",
    CONFLICT= "CONFLICT" 
 } 

 class AppError extends Error {

    public status:string 
    public statusCode:number
    public code: errorCode
    public isOperational:boolean

    constructor(message:string, statusCode: number, code:errorCode)
    {
        super(message)
        this.isOperational = true
        this.statusCode = statusCode
        this.code = code
        this.status =`${statusCode}`.startsWith('4') ? 'Error' : 'Fail'

    }
 }

 class BadreqError extends AppError  {

    constructor(message: string, statusCode: number = 400, code: errorCode= errorCode.BAD_REQUEST)   
    {
        super(message, statusCode, code)
    }
 }
  
  // CONFLICT ERROR
  export class ConflictError extends AppError {

    constructor(message: string, statusCode: number = 409, code: errorCode = errorCode.CONFLICT)
    {
        super(message, statusCode, code)
    }
  }
  
  // NOTFOUND ERROR
  export class NotFoundError extends AppError {
    constructor(message: string, statusCode: number = 404, code: errorCode = errorCode.NOT_FOUND)
    {
        super(message, statusCode, code)
    }
  }
  
  //UNAUTHORIZED ERROR
  export class UnauthorizedError extends AppError {
    constructor(message: string, statusCode: number = 401, code: errorCode = errorCode.UNAUTHORIZED)
    {
        super(message, statusCode, code) 
    }
  }
  
  //FORBIDDEN ERROR
  export class ForbiddenError extends AppError {
    constructor(message: string, statusCode: number = 403, code: errorCode = errorCode.FORBIDDEN)
    {
        super(message, statusCode, code)
    }
  }
export default AppError