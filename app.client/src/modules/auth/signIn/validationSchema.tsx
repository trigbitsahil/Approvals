// signInValidationSchema.ts
import { object, string } from "yup";

const SignInValidationSchema = object().shape({
  email: string().email("Invalid email").required("Email is required"),
  password: string().required("Password is required"),
});

export default SignInValidationSchema;
