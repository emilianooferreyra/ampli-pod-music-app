interface NewUserResponse {
  id: string;
  name: string;
  email: string;
}

export type AuthStackParamsList = {
  SignIn: undefined;
  SignUp: undefined;
  LostPassword: undefined;
  Verification: {userInfo: NewUserResponse};
};
