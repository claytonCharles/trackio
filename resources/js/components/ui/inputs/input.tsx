import React from "react"


function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      className={
        "px-3 py-2 border rounded bg-transparent" +
        className
      }
      {...props}
    />
  )
}

export { Input }