import { supabase } from '../../lib/supabase';
import { useAuth } from '../../auth/useAuth';
import { Navigate } from 'react-router';
import { useState } from 'react';

export const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  if (session) return <Navigate to="/" replace />;

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    });

    if (error) {
      setError('Nie udało się zalogować. Sprawdź swoje dane logowania.');
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div>
      <h1>Logowanie</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <div>
          <label htmlFor="password">Hasło</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Zaloguj się</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
