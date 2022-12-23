import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import {Path} from "typescript-rest";

const SECRET_JWT: string = 'mysecretpasswordforjwt';

@Path('/auth')
class Auth {
  // TODO: Implement all methods
}

interface JwtExtendedPayload extends JwtPayload {
  foo: string;
}

const token = jwt.sign({ foo: 'bar' }, SECRET_JWT);

console.log(token);

try {
  let { foo } = <JwtExtendedPayload>jwt.verify(token, SECRET_JWT);
  console.log(foo);
  
} catch(JsonWebTokenError) {
  console.log("Indeed, wrong secret password");
}
