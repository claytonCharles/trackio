import { Spinner } from "@/components/icons/spinner";
import { Button } from "@/components/default/button";
import { Checkbox } from "@/components/default/checkbox";
import { Input } from "@/components/default/input";
import InputError from "@/components/default/input-error";
import { Label } from "@/components/default/label";
import SimpleLayout from "@/layouts/simple-layout";
import { store } from "@/routes/login";
import { Form, Head } from "@inertiajs/react";

export default function Login() {
  return (
    <SimpleLayout
      title="Faça login na sua conta"
      description="Digite seu e-mail e senha abaixo para fazer login"
    >
      <Head title="Log in" />

      <Form
        {...store.form()}
        resetOnSuccess={["password"]}
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

              <div className="flex items-center space-x-3">
                <Checkbox id="remember" name="remember" tabIndex={3} />
                <Label htmlFor="remember">Remember me</Label>
              </div>

              <Button
                type="submit"
                className="mt-4 w-full"
                tabIndex={4}
                disabled={processing}
                data-test="login-button"
              >
                {processing && <Spinner />}
                Log in
              </Button>
            </div>
          </>
        )}
      </Form>
    </SimpleLayout>
  );
}
