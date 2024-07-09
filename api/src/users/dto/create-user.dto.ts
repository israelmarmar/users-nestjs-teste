export class CreateUserDto {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  readonly zipCode: string;
  readonly number: string;
  readonly recoverToken?: string;
}
