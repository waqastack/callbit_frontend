export class User {
  expiration:string
  username: string;
  token?: string;
  type?: number;
  id: number;
  fullName: string;
  stepWizard: boolean;
}
export class SignUpRequest {
  username: string;
  email: string;
  password: string;
  type: number;
  linkedin: boolean;
  google: boolean;
  stepWizard: boolean;
}
export class SignUpRequest2 {
  id:number;
  username: string;
  email: string;
  password: string;
  type: number;
  linkedin: boolean;
  google: boolean;
  stepWizard: boolean;
}
