import type { UserRole } from '@/features/users/constants';

export {
  UserDto as User,
  BookDto as Book,
  LoanDto as Loan,
  ProfileImageDto as ProfileImage,
  SystemNotificationDto as SystemNotification,
  UserDto,
  BookDto,
  LoanDto,
  ProfileImageDto,
  SystemNotificationDto,
  CreateUserDto,
  UpdateUserDto,
  CreateBookDto,
  UpdateBookDto,
  CreateLoanDto,
  UpdateLoanDto,
  CreateProfileImageDto,
  CreateSystemNotificationDto,
  UpdateSystemNotificationDto,
  LoginRequest,
  LoginResponse,
} from '@kniho-hlod/kniho-hlod-service';

export type { UserRole };

export type Entity = import('@kniho-hlod/kniho-hlod-service').UserDto
  | import('@kniho-hlod/kniho-hlod-service').BookDto
  | import('@kniho-hlod/kniho-hlod-service').LoanDto;
