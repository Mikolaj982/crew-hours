import { Link, Outlet } from 'react-router';
import { supabase } from '../../lib/supabase';

export const Layout = () => {
  return (
    <>
      <nav>
        <Link to="/">Godziny</Link>
        <Link to="/summary">Podsumowanie</Link>
        <button onClick={() => supabase.auth.signOut()}>Wyloguj</button>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};
