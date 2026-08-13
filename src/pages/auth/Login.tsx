
import { FieldValues } from "react-hook-form";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentUser, setUser, TUser, useCurrentToken } from "../../redux/features/auth/authSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { message } from "antd";
import { verifyToken } from "@/utils/verifyToken";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector(useCurrentToken);
  const currentUser = useAppSelector(selectCurrentUser);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [login] = useLoginMutation();

  // Hooks above; early return moved below all hook calls.
  if (token && currentUser) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace={true} />;
  }

  const onSubmit = async (e: FieldValues) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const hide = message.loading("processing...");
    setLoading(true);

    try {
      const userInfo = { email, password };
      const res = await login(userInfo).unwrap();
      const user = verifyToken(res?.data?.accessToken) as TUser;
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch(setUser({ user: user, token: res?.data?.accessToken }));
      if (user?.role == "ADMIN" || user?.role == "SUPER_ADMIN") {
        navigate(`/admin/dashboard`);
      } else if (user?.role == "VENDOR") {
        navigate(`/vendor/setting`);
      } else if (user?.role == "CUSTOMER") {
        navigate(`/`);
      } else {
        message.warning(res?.data?.message);
        navigate("/login");
      }
      message.success("Logged in Success!");
    } catch (err: any) {
      message.error(err?.data?.message || "Something went wrong");
    } finally {
      hide();
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center px-4 bg-gradient-to-br from-zinc-50 via-white to-blue-50"
      style={{ minHeight: "80vh" }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to continue to your account</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5" />
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full text-sm text-gray-900 border border-gray-300 pl-10 pr-4 py-3 rounded-lg outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full text-sm text-gray-900 border border-gray-300 pl-10 pr-11 py-3 rounded-lg outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link to="/login" className="text-sm text-blue-600 hover:underline font-medium">
                Forgot your password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-sm font-semibold tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-sm text-center text-gray-600 pt-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-semibold">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;