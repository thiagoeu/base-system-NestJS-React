import { JwtPayloadUser } from '../shared/interfaces/jwt-payload-user.type';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadUser;
    }
  }
}
