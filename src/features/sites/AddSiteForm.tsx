import { useForm } from 'react-hook-form';
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
  } = useForm<SiteData>({
    resolver: yupResolver(addSiteSchema),
  });

  const onSubmit = (siteFormValues: SiteData) => {
    mutate(siteFormValues, {
      onSuccess: () => {
        reset();
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

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="siteName">Nazwa budowy</label>
        <input id="siteName" {...register('name')} required />
        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
        <button type="submit" disabled={isPending}>
          Zapisz
        </button>
      </form>
      {errors.root && <p style={{ color: 'red' }}>{errors.root.message}</p>}
    </div>
  );
};
