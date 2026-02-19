
function Label({ className, ...props}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={
        className
      }
      {...props}
    />
  )
}

export { Label }