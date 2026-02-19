import { Spinner } from "@/components/icons/spinner";
import { Input } from "@/components/ui/inputs/input";
import { InputError } from "@/components/ui/inputs/input-error";
import { Label } from "@/components/ui/label";
import GuestLayout from "@/layouts/guest-layout";
import { store } from "@/routes/login";
import { Form, Head } from "@inertiajs/react";

export default function Login() {
  return (
    <GuestLayout
      title="Faça login na sua conta"
      description="Digite seu e-mail e senha abaixo para fazer login"
    >
      <Head title="Log in" />
      <Form
        {...store.form()}
        resetOnSuccess={['password']}
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  placeholder="email@example.com"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  tabIndex={2}
                  autoComplete="current-password"
                  placeholder="Password"
                />
                <InputError message={errors.password} />
              </div>

              <button
                type="submit"
                className="mt-4 w-full border px-3 py-2 rounded bg-foreground text-background cursor-pointer"
                tabIndex={4}
                disabled={processing}
                data-test="login-button"
              >
                {processing && <Spinner />}
                Log in
              </button>
            </div>
          </>
        )}
      </Form>
    </GuestLayout>
  )
}