import { useForm } from 'react-hook-form';
import { Button, Stack, TextField } from '@mui/material';
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
    setFocus,
  } = useForm<EmployeeData>({ resolver: yupResolver(addEmployeeSchema) });

  const onSubmit = (employee: EmployeeData) => {
    mutate(employee, {
      onSuccess: () => {
        reset();
        setFocus('name');
      },
      onError: (error) => {
        setError('root', {
          message: 'Wystąpił błąd przy dodawaniu pracownika',
        });
        console.error('Error adding employee', error);
      },
    });
  };

  const { ref: nameRef, ...nameField } = register('name');
  const errorMessage = errors.name?.message ?? errors.root?.message;

  return (
    <Stack
      component="form"
      direction="row"
      spacing={1}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ alignItems: 'flex-start' }}
    >
      <TextField
        {...nameField}
        inputRef={nameRef}
        label="Imię i nazwisko"
        size="small"
        fullWidth
        error={errorMessage !== undefined}
        helperText={errorMessage}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isPending}
        sx={{ flexShrink: 0, height: 40 }}
      >
        Dodaj
      </Button>
    </Stack>
  );
};
