import { object, string } from "yup";

const UserValidationSchema = object().shape({
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
  email: string().email("Invalid email").required("Email is required"),
   age: string()
    .matches(/^\d+$/, "Age must be a number")
    .required("Age is required"),
  gender: string().required("Gender is required"),
  phone: string()
    .matches(/^\d{10}$/, "Phone must be exactly 10 digits")
    .required("Phone is required"),
 
});

export default UserValidationSchema;
