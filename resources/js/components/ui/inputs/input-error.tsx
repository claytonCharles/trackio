import { HTMLAttributes } from "react";

function InputError({
  message,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }
) {
  return message ? (
    <p
      className={
        " text-sm text-red-600 dark:text-red-400 " +
        className
      }
      {...props}
    >
      {message}
    </p>
  ) : null;
}

export { InputError }