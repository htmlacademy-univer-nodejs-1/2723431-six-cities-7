export type UserType = 'ordinary' | 'pro';

export type User = {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  type: UserType;
};
