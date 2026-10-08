import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  password: yup.string().required('Hasło jest wymagane'),
  email: yup
    .string()
    .email('Nieprawidłowy email')
    .required('Email jest wymagany'),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
