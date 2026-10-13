import * as yup from 'yup';

export const addEmployeeSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .max(60, 'Imię i nazwisko przekraczają maksymalną liczbę znaków: 60')
    .required('Imię i nazwisko są wymagane'),
});

export type EmployeeData = yup.InferType<typeof addEmployeeSchema>;
