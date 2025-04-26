import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Label,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui";

// redux
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/redux/store";
import { useLoginUserMutation } from "@/redux/services/authApi";

// Icons
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { TiVendorApple } from "react-icons/ti";
import toast from "react-hot-toast";
import { login } from "@/redux/features/authSlice";

interface loginProps {
  email: string;
  role?: string;
  password: string;
}

export function LoginForm() {
  document.title = "Preskool - Login";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginProps>();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  // Submit function
  const submitData = async (data: loginProps) => {
    console.log(data, "login user data");
    await loginUser({ body: data })
      .unwrap()
      .then((response) => {
        dispatch(login(response.data));
        toast.success(response.message);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error?.data?.message);
      });
  };

  return (
    <div className="flex flex-col gap-6 ">
      <img src="/image/logo.svg" className="w-[150px] mx-auto block" alt="" />
      <form onSubmit={handleSubmit(submitData)}>
        <Card className="bg-white shadow-sm border rounded-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>
              Please enter your details to sign in
            </CardDescription>

            {/* social buttons */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <button className="w-full h-[50px] rounded-md bg-blue-700 text-white transition-all hover:scale-[1.05] cursor-pointer flex items-center justify-center text-xl">
                <FaFacebook />
              </button>
              <button className="w-full h-[50px] rounded-md bg-transparent border shadow-sm text-white transition-all hover:scale-[1.05] cursor-pointer flex items-center justify-center text-xl">
                <FcGoogle />
              </button>
              <button className="w-full h-[50px] rounded-md bg-blue-900 text-white transition-all hover:scale-[1.05] cursor-pointer flex items-center justify-center text-xl">
                <TiVendorApple />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="h-[45px] text-xs placeholder:text-xs border rounded-sm focus:outline-none focus:ring-0 focus:shadow-none"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 ps-2">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="forget-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="h-[45px] text-xs placeholder:text-xs border rounded-sm mb-0"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 ps-2">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full h-[45px] rounded-md text-sm font-semibold bg-blue-700 text-white transition-all hover:scale-[1.05] cursor-pointer flex items-center justify-center"
              >
                {isLoading ? " Loading..." : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
