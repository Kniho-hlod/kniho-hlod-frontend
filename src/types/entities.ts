import type { UserRole } from '@/features/users/constants';

export {
  UserDto as User,
  BookDto as Book,
  LoanDto as Loan,
  ProfileImageDto as ProfileImage,
  UserDto,
  BookDto,
  LoanDto,
  ProfileImageDto,
  CreateUserDto,
  UpdateUserDto,
  CreateBookDto,
  UpdateBookDto,
  CreateLoanDto,
  UpdateLoanDto,
  CreateProfileImageDto,
  LoginRequest,
  LoginResponse,
} from '@kniho-hlod/kniho-hlod-service';

export type { UserRole };

export type Entity = import('@kniho-hlod/kniho-hlod-service').UserDto
  | import('@kniho-hlod/kniho-hlod-service').BookDto
  | import('@kniho-hlod/kniho-hlod-service').LoanDto;

export interface EntityWithIndex {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
