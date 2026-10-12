type EmptyListProps = {
  message?: string;
};

export const EmptyList = ({ message }: EmptyListProps) => {
  return (
    <div>
      <p>{message || 'Nie znaleziono żadnych elementów do wyświetlenia.'}</p>
    </div>
  );
};
