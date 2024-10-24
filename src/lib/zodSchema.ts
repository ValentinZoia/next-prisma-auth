import {z} from "zod";

export const SignUpFormSchema =  z.object({
    email: z.string().min(1, { message: 'Email field must not be empty.' }).email({ message: 'Please enter a valid email.' }).trim(),
    password: z
      .string()
      .min(1, { message: 'Password field must not be empty.' })
      .min(8,{message:'Be at least 8 characters long'})
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .trim(),
  
    confirmPassword: z.string().trim(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  export const LogInFormSchema =  z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
      .string()
      .min(1, { message: 'Password field must not be empty.' })
      .trim(),
  
    
  });
  

  // create Post
  export const createPostSchema = z.object({
    content: z.string().min(1, { message: 'Content field must not be empty.' }).trim(),
  })



  export type FormState =
  | {
      errors?: {
        general?: string[] | undefined;
        email?: string[] | undefined;
        password?: string[] | undefined;
        confirmPassword?: string[] | undefined;
      };
      message?: string | undefined;
    }
  | undefined;