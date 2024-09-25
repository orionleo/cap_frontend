/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Input from "./Input";
import { decodeToken } from "react-jwt";
import { toast } from "react-hot-toast";
import { DecodedToken } from "@/interaface/DecodedToken";

type Variant = "LOGIN" | "REGISTER";

const SubmitButtonValue = {
  LOGIN: "Login",
  REGISTER: "Register",
  FORGOTPASSWORD: "Send OTP",
  VERIFYOTP: "Verify OTP",
  NEWPASSWORD: "Update Password",
};

const AuthForm = () => {
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("authToken");
  if (token !== null) {
    const decodedToken: DecodedToken | null = decodeToken(token);
    const now = new Date().getTime() / 1000;
    if (
      decodedToken &&
      decodedToken.exp > now &&
      decodedToken.email &&
      decodedToken.userId
    ) {
      router.push("/me");
    } else {
      toast.error("Invalid authentication, please relogin");
      router.push("/auth");
      localStorage.removeItem("authToken");
    }
  }

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword && variant === "REGISTER") {
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }

    let res;
    try {
      if (variant === "REGISTER") {
        res = await axios.post("/api/register", {
          email,
          password,
          confirmPassword,
        });
      } else {
        res = await axios.post("/api/login", { email, password });
      }
      const token = res.data.data.token;
      localStorage.setItem("authToken", token);
      setIsLoading(false);
    } catch (error) {
      const e = error as unknown as any;
      if (e.status == 400 || e.status == 401) {
        toast.error("Invalid credentials entered");
      }

      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  // Function to check if the password is strong
  const isPasswordStrong = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough;
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        className="
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {(variant === "LOGIN" || variant === "REGISTER") && (
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              id="email"
              placeholder="Email"
              label="Email address"
              type="email"
            />
          )}
          {(variant === "LOGIN" || variant === "REGISTER") && (
            <div>
              <Input
                disabled={isLoading}
                register={register}
                errors={errors}
                placeholder="Password"
                id="password"
                label="Password"
                type="password"
              />
              {/* Password validation message */}
              {variant === "REGISTER" && password && !isPasswordStrong(password) && (
                <div className="text-red-500 text-sm mt-2">
                  Password must be at least 8 characters long, contain an uppercase, lowercase, number, and special character.
                </div>
              )}
            </div>
          )}
          {variant === "REGISTER" && (
            <div>
              <Input
                disabled={isLoading}
                register={register}
                errors={errors}
                placeholder="Confirm Password"
                id="confirmPassword"
                label="Confirm Password"
                type="password"
              />
              {/* Confirm Password validation message */}
              {confirmPassword && confirmPassword !== password && (
                <div className="text-red-500 text-sm mt-2">
                  Passwords do not match.
                </div>
              )}
            </div>
          )}
          <div className="flex items-center flex-col justify-center">
            <Button disabled={isLoading} type="submit">
              {SubmitButtonValue[variant]}
            </Button>
          </div>
          <div
            className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
            underline cursor-pointer
          "
          >
            <div onClick={toggleVariant} className="underline cursor-pointer">
              {variant === "LOGIN" ? "Create an account" : "Login"}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
