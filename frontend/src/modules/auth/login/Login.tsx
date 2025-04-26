import { LoginForm } from "./components/LoginForm";

const Login = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-white">
      <div className="w-full max-w-[500px]">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
