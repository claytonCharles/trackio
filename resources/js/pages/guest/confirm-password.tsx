import { Form, Head } from "@inertiajs/react";
import InputError from "@/components/default/input-error";
import { Button } from "@/components/default/button";
import { Input } from "@/components/default/input";
import { Label } from "@/components/default/label";
import { Spinner } from "@/components/default/spinner";
import SimpleLayout from "@/layouts/simple-layout";
import { store } from "@/routes/password/confirm";

export default function ConfirmPassword() {
  return (
    <SimpleLayout
      title="Confirm your password"
      description="This is a secure area of the application. Please confirm your password before continuing."
    >
      <Head title="Confirm password" />

      <Form {...store.form()} resetOnSuccess={["password"]}>
        {({ processing, errors }) => (
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                autoFocus
              />

              <InputError message={errors.password} />
            </div>

            <div className="flex items-center">
              <Button
                className="w-full"
                disabled={processing}
                data-test="confirm-password-button"
              >
                {processing && <Spinner />}
                Confirm password
              </Button>
            </div>
          </div>
        )}
      </Form>
    </SimpleLayout>
  );
}
