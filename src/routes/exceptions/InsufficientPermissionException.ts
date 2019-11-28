import HttpException from './HTTPException';

class InsufficientPermissionException extends HttpException {
  constructor() {
    super(401, 'Insufficient permissions');
  }
}

export default InsufficientPermissionException;
