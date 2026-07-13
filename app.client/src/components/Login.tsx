import { i18n } from "@lingui/core";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Login = () => {
  return (
    <Card className="w-full max-w-sm mt-4 bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)] shadow-md">
      <CardHeader>
        <CardTitle>
          {i18n.t({id:"ui.Login to your account",message:"Login to your account"})}
        </CardTitle>
        <CardDescription>
                    {i18n.t({id:"ui.Enter your email below to login to your account",message:" Enter your email below to login to your account"})}

        </CardDescription>
        <CardAction>
          <Button
            variant="link"
            className="text-[var(--color-primary)] hover:underline"
          >
                      {i18n.t({id:"ui.Sign Up",message:"Sign Up"})}

          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">
                         {i18n.t({id:"ui.Email",message:"Email"})}

              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-[var(--color-input)] text-[var(--color-foreground)] border border-[var(--color-border)] placeholder:text-muted-foreground focus:ring-2 focus:ring-[var(--color-ring)]"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">
                           {i18n.t({id:"ui.Password",message:"Password"})}

                </Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm text-[var(--color-primary)] underline-offset-4 hover:underline"
                >
                           {i18n.t({id:"ui.Forgot Your Password?",message:"Forgot Your Password?"})}

                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="bg-[var(--color-input)] text-[var(--color-foreground)] border border-[var(--color-border)] placeholder:text-muted-foreground focus:ring-2 focus:ring-[var(--color-ring)]"
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
        >
                  {i18n.t({id:"ui.Login",message:"Login"})}

        </Button>

        <Button
          variant="outline"
          className="w-full border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
        >
          {i18n.t({id:"ui.Login with Google",message:"Login with Google"})}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
