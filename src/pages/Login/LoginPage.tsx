import { supabase } from '../../lib/supabase';
import { useAuth } from '../../auth/useAuth';
import { Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormValues } from './loginSchema';
import { yupResolver } from '@hookform/resolvers/yup';

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({ resolver: yupResolver(loginSchema) });
  const { session } = useAuth();

  if (session) return <Navigate to="/" replace />;

  const onSubmit = async (data: LoginFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError('root', { message: 'Błąd logowania: ' + error.message });
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div>
      <h1>Logowanie</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register('email')} />
          {errors.email && (
            <p style={{ color: 'red' }}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Hasło</label>
          <input type="password" id="password" {...register('password')} />
          {errors.password && (
            <p style={{ color: 'red' }}>{errors.password.message}</p>
          )}
        </div>
        <button type="submit" disabled={isSubmitting}>
          Zaloguj się
        </button>
      </form>
      {errors.root && <p style={{ color: 'red' }}>{errors.root.message}</p>}
    </div>
  );
};
