import { config } from 'dotenv'
import { env } from 'process';
config()
export const jwtConstants = {
  secret: env.JWT_SECRET,
};