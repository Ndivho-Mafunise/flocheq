import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({ className, ...props }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await login(form);

    if (res && res.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <Button type="button" variant="outline">
                  Login with Apple
                </Button>

                <Button type="button" variant="outline">
                  Login with Google
                </Button>
              </Field>

              <FieldSeparator>Or continue with</FieldSeparator>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <Link
                    className="ml-auto text-sm underline hover:underline"
                    to="/forgot-password"
                  >
                    {" "}
                    Forgot password?{" "}
                  </Link>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <Button type="submit">Login</Button>

                <FieldDescription className="text-center">
                  Don’t have an account? <Link to="/register">Sign Up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="text-center px-6">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </FieldDescription>
    </div>
  );
}
