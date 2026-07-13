import { object, date, string } from "yup";

const validationSchema = object().shape({
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
  password: string().required("Password is required"),
  dob: date().required("Date of Birth is required"),
});

export default validationSchema;
