import { JwtPayloadUser } from '../auth/types/jwt-payload-user.type';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadUser;
    }
  }
}
