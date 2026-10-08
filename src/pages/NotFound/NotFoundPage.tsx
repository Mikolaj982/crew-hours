import { Link } from 'react-router';

export const NotFoundPage = () => {
  return (
    <div>
      <h1>Nie znaleziono strony</h1>
      <Link to="/">
        <button>Wróć do strony głównej</button>
      </Link>
    </div>
  );
};
