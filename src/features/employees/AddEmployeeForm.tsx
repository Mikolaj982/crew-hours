import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addEmployeeSchema, type EmployeeData } from './addEmployeeSchema';
import { useCreateEmployee } from './useCreateEmployee';

export const AddEmployeeForm = () => {
  const { mutate, isPending } = useCreateEmployee();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<EmployeeData>({ resolver: yupResolver(addEmployeeSchema) });

  const onSubmit = (employee: EmployeeData) => {
    mutate(employee, {
      onSuccess: () => {
        reset();
      },
      onError: (error) => {
        setError('root', {
          message: 'Wystąpił błąd przy dodawaniu pracownika',
        });
        console.error('Error adding employee', error);
      },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="name">Imię i nazwisko:</label>
        <input type="text" id="name" {...register('name')} required />
        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
        <button type="submit" disabled={isPending}>
          Dodaj pracownika
        </button>
      </form>
      {errors.root && <p style={{ color: 'red' }}>{errors.root.message}</p>}
    </div>
  );
};
