import { Link, useNavigate } from "react-router-dom";
import wah_university from "/wah_university.jpg";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/src/Firebase/firebase";
export const ForgetPasswordScreen = () => {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert(
          "A password reset link has been sent to your email. Please, Check your mail"
        );
        history("/login");
      })
      .catch((err) => {
        alert(err.code);
      });
  };
  return (
    <>
      <section className="bg-transparent min-h-screen flex flex-col items-center justify-center">
        <div className="flex pb-4">
          <h1 className="font-sans font-semibold text-sky-500 text-6xl">
            Smart
          </h1>
          <h1 className="font-sans font-semibold text-black text-6xl">
            EduHub
          </h1>
        </div>
        <div className="bg-gray-100 flex rounded-3xl shadow-2xl max-w-3xl p-5 items-center">
          <div className="md:w-1/2 px-8 md:px-16">
            <h2 className="font-bold text-2xl text-[#002D74]">
              Reset Password
            </h2>
            <p className="text-xs mt-4 text-[#002D74]">
              Forgot your password? No worries, a fresh start is just a click
              away!
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
              <div className="relative mt-2 mb-2">
                <input
                  required
                  id="Email"
                  type="email"
                  className="w-60 pl-10 pr-4 py-2 rounded-xl border-2 shadow-lg text-black dark:bg-gray-50"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 left-0 pl-3  
                flex items-center  
                pointer-events-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
              >
                Reset
              </button>
            </form>

            <div className="mt-2 grid grid-cols-3 items-center text-gray-400">
              <hr className="border-gray-400" />
              <p className="text-center text-sm">OR</p>
              <hr className="border-gray-400" />
            </div>
            <div className="mt-2 text-xs flex justify-between items-center text-[#002D74]">
              <p>Have an account?</p>
              <Link to="/login">
                <button className="py-2 px-5 bg-sky-300 font-semibold border rounded-xl hover:scale-110 duration-300">
                  Sign in
                </button>
              </Link>
            </div>
            <div className="mt-2 text-xs flex justify-between items-center text-[#002D74]">
              <p>Don't have an account?</p>
              <Link to="/signup">
                <button className="py-2 px-5 bg-sky-300 font-semibold border rounded-xl hover:scale-110 duration-300">
                  Sign up
                </button>
              </Link>
            </div>
          </div>
          <div className="md:block hidden w-1/2">
            <img className="rounded-2xl" src={wah_university}></img>
          </div>
        </div>
      </section>
    </>
  );
};
