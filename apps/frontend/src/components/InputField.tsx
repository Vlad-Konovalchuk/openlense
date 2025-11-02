export type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
};

const InputField = ({
  label,
  error,
  className,
  id,
  name,
  type = 'text',
  ...rest
}: InputFieldProps) => {
  const inputId = id ?? (name as string) ?? undefined;

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className='block text-sm font-medium text-gray-700'
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2  ${className}`}
        {...rest}
      />

      {error && <p className='text-xs text-red-600 mt-1'>{error}</p>}
    </div>
  );
};

export default InputField;
