// import { FieldValues } from "react-hook-form";
// import { useLoginMutation } from "../../redux/features/auth/authApi";
// import { useAppDispatch, useAppSelector } from "../../redux/hooks";
// import { selectCurrentUser, setUser, TUser, useCurrentToken } from "../../redux/features/auth/authSlice";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { message } from "antd";
// import { verifyToken } from "@/utils/verifyToken";
// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const token = useAppSelector(useCurrentToken); 
//   const currentUser = useAppSelector(selectCurrentUser); 

//   if(token&&currentUser) {
//     return <Navigate to={`/${currentUser.role}/dashboard`} replace={true}></Navigate>
//   }

//   const [login] = useLoginMutation();

//   const onSubmit = async (e: FieldValues) => {
//     e.preventDefault();
//     const form = e.target;
//     const email = form.email.value;
//     const password = form.password.value;
//     const hide = message.loading('processing...');

//     try {
//       const userInfo = {
//         email: email,
//         password: password,
//       };
      
//       const res = await login(userInfo).unwrap();
//       const user = verifyToken(res?.data?.accessToken) as TUser; 
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       dispatch(setUser({ user: user, token: res?.data?.accessToken }));
//       if( user?.role == "ADMIN" || user?.role == "SUPER_ADMIN"){
//         navigate(`/admin/dashboard`);
//       }
//       else if( user?.role == "VENDOR"){
//         navigate(`/vendor/setting`);
//       }
//       else if ( user?.role == "CUSTOMER" ){
//         navigate(`/`);
//       }
//       else{
//         message.warning(res?.data?.message);
//         navigate('/login');
//       }
//       message.success("Logged in Success!");
//       hide()
//     } catch (err: any) {
//        message.error(err?.data?.message || "Something went wrong");
//     }
//   };

//   const [show, setShow] = useState(false);

//   return (
//     <div className="relative py-10 bg-zinc-50 text-surface/75 " style={{ minHeight: "100vh" }}>
//       <div className="flex flex-col justify-center font-[sans-serif] ">
//         <div className="max-w-md w-full mx-auto border bg-white border-gray-200 rounded-md p-8">
//           {/* <div className="text-center mb-4">
//             <img src={logo} alt="logo" className="w-[100px] inline-block" />
//           </div> */}
//           <h2 className=" text-center text-2xl font-bold">
//             Sign In
//           </h2>
//           <form onSubmit={onSubmit} className=" space-y-4">
//             <div>
//               <label className=" text-sm mb-2 block">
//                 User Email
//               </label>
//               <div className="relative flex items-center">
//                 <input
//                   // onChange={(e)=>setLoginDetails({...loginDetails, email:e.target.value})}
//                   // value={loginDetails.email}
//                   name="email"
//                   type="email"
//                   required
//                   className="w-full  text-sm border border-gray-300 px-4 py-3 rounded-md outline-none  hover:border-blue-300"
//                   placeholder="Email"
//                 />
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="#bbb"
//                   stroke="#bbb"
//                   className="w-4 h-4 absolute right-4"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
//                   <path
//                     d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
//                     data-original="#000000"
//                   ></path>
//                 </svg>
//               </div>
//             </div>

//             <div>
//               <label className=" text-sm mb-2 block">Password</label>
//               <div className="relative items-center">
//                 <input
//                   // onChange={(e)=>setLoginDetails({...loginDetails, password:e.target.value})}
//                   // value={loginDetails.password}
//                   type={show ? "text" : "password"}
//                   name="password"
//                   placeholder="Password"
//                   className="w-full text-black text-sm px-4 my-3  rounded border py-3 outline-none  hover:border-blue-300"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShow(!show)}
//                   className="absolute inline-block bottom-7 right-5"
//                 >
//                   {!show ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="1.5"
//                        stroke="#bbb"
                      
//                       className="w-4 h-4 "

//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="1.5"
//                       stroke="currentColor"
//                       className="w-4 h-4"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label
//                   htmlFor="remember-me"
//                   className="ml-3 block text-sm "
//                 >
//                   Remember me
//                 </label>
//               </div>
//               <div className="text-sm">
//                 <Link
//                   to="/login"
//                   className="text-blue-600 hover:underline font-semibold"
//                 >
//                   Forgot your password?
//                 </Link>
//               </div>
//             </div>

//             <div className="!mt-8">
//               <button
//                 // onClick={handleSubmit}
//                 type="submit"
//                 className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
//               >
//                 Sign in
//               </button>
//             </div>
//             <p className=" text-sm !mt-8 text-center">
//               Don't have an account?{" "}
//               <Link
//                 to="/register"
//                 className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
//               >
//                 Register here
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
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
      className="flex items-center justify-center px-4 py-10 bg-gradient-to-br from-zinc-50 via-white to-blue-50"
      style={{ minHeight: "100vh" }}
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