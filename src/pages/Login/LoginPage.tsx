import { supabase } from '../../lib/supabase';
import { useAuth } from '../../features/auth/useAuth';
import { Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormValues } from './loginSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

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
      setError('root', {
        message:
          error.code === 'invalid_credentials'
            ? 'Nieprawidłowy e-mail lub hasło.'
            : 'Nie udało się zalogować. Spróbuj ponownie.',
      });
      console.error('Error logging in:', error.message);
    }
  };

  const { ref: emailRef, ...emailField } = register('email');
  const { ref: passwordRef, ...passwordField } = register('password');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card variant="outlined" sx={{ width: '100%', maxWidth: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Godzinówka
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Zaloguj się, aby wpisać godziny.
          </Typography>
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {errors.root && (
              <Alert severity="error">{errors.root.message}</Alert>
            )}
            <TextField
              {...emailField}
              inputRef={emailRef}
              type="email"
              label="E-mail"
              autoComplete="email"
              autoFocus
              error={errors.email !== undefined}
              helperText={errors.email?.message}
            />
            <TextField
              {...passwordField}
              inputRef={passwordRef}
              type="password"
              label="Hasło"
              autoComplete="current-password"
              error={errors.password !== undefined}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
            >
              Zaloguj się
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
