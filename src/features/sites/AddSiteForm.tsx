import { useForm } from 'react-hook-form';
import { Button, Stack, TextField } from '@mui/material';
import { addSiteSchema, type SiteData } from './addSiteSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateSite } from './useCreateSite';
import { PostgrestError } from '@supabase/supabase-js';
import { PG_ERROR } from '../../lib/pgError';

export const AddSiteForm = () => {
  const { mutate, isPending } = useCreateSite();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setFocus,
  } = useForm<SiteData>({
    resolver: yupResolver(addSiteSchema),
  });

  const onSubmit = (siteFormValues: SiteData) => {
    mutate(siteFormValues, {
      onSuccess: () => {
        reset();
        setFocus('name');
      },
      onError: (error) => {
        if (
          error instanceof PostgrestError &&
          error.code === PG_ERROR.UNIQUE_VIOLATION
        ) {
          setError('name', {
            message: 'Taka nazwa już istnieje.',
          });
        } else {
          setError('root', {
            message: 'Wystąpił błąd przy dodawaniu budowy',
          });
          console.error('Error adding site', error);
        }
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
        label="Nazwa budowy"
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
