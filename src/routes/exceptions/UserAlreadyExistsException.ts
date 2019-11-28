import HttpException from './HTTPException';

class UserAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(409, `User with username ${name} already exists`);
  }
}

export default UserAlreadyExistsException;
