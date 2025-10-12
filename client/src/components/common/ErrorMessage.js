const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
