import { useState } from "react";
import wah_university from "/wah_university.jpg";
import { auth, db } from "@/src/Firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAppDispatch } from "@/src/app/hooks";
import {
  updateCategory,
  updateName,
  updatePic,
  updateUserId,
} from "@/src/app/features/ProfileSlice";
export default function LoginPage() {
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const dispatch = useAppDispatch();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const handleChange = (e: any) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setIsValid(validateEmail(emailValue));
  };
  const fetchUserById = async (userId: string) => {
    try {
      // Create a query to find the document with the specified UID
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", userId)
      );

      // Execute the query and get the result
      const userSnapshot = await getDocs(userQuery);

      // Check if there is a matching document
      if (!userSnapshot.empty) {
        // Access the first document in the result set
        const userData = userSnapshot.docs[0].data();
        const profilePicUrl = userData.ProfilePic;
        const userName = userData.userName;
        const catg = userData.category;
        localStorage.setItem("category", catg);
        localStorage.setItem("userName", userName);
        localStorage.setItem("PicUrl", profilePicUrl);
        dispatch(updateName(userName));
        dispatch(updateCategory(catg));
        dispatch(updatePic(profilePicUrl));
        return userData;
      } else {
        console.error("User document not found in Firestore");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
      return null;
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredentials.user;
      if (user.uid) {
        await fetchUserById(user.uid);
        dispatch(updateUserId(user.uid));
        //localStorage.setItem("category", us?.catg);
        //localStorage.setItem("PicUrl", us?.profilePicUrl);
      }
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("token", JSON.stringify(user.getIdToken));
      localStorage.setItem("user", JSON.stringify(user));
      Navigate("/");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        //title: "Oh! Invalid userCredentials",
        description: (error as Error).message,
      });
    }
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <>
      <section className="bg-transparent min-h-screen flex flex-col items-center justify-center bg-[#dfe3ee]">
        <div className="lg:flex pb-4 poppins-black md:block">
          <h1 className="text-sky-500 text-6xl">Smart</h1>
          <h1 className="text-black text-6xl">EduHub</h1>
        </div>
        {loading ? (
          <div className="fixed inset-0 flex justify-center items-center bg-[rgba(255,255,255,0.8)]">
            <HashLoader color="#36d7b7" />
          </div>
        ) : (
          <div className="bg-gray-100 flex rounded-3xl shadow-2xl max-w-3xl p-5 items-center poppins-regular">
            <div className="md:w-1/2 px-8 md:px-16">
              <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
              <p className="text-xs mt-4 text-[#002D74]">
                Welcome back! Let's dive in and explore what's new.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="relative mt-6">
                  {!isValid && (
                    <div className="text-red-500 mb-2">
                      Please enter a valid email.
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="email"
                      className={`w-64 pl-10 pr-4 py-2 rounded-xl border shadow-lg text-black dark:bg-gray-50 ${
                        !isValid ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                </div>

                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    className="w-64 pl-10 pr-10 py-2 rounded-xl border shadow-lg text-black dark:bg-gray-50"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {isPasswordVisible ? (
                      <Eye className="w-6 h-6 text-gray-600" />
                    ) : (
                      <EyeOff className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                      />
                    </svg>
                  </div>
                </div>
                <button className="bg-[#002D74] poppins-semibold rounded-xl text-white py-2 hover:scale-105 duration-300">
                  Login
                </button>
              </form>

              <div className="mt-4 grid grid-cols-3 items-center text-gray-400">
                <hr className="border-gray-400" />
                <p className="text-center text-sm">OR</p>
                <hr className="border-gray-400" />
              </div>

              <div className="mt-2 text-xs border-b border-[#002D74] py-3 text-[#002D74] text-center">
                <Link to="/forgotPassword">
                  <p>Forgot your password?</p>
                </Link>
              </div>

              <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
                <p>Don't have an account?</p>
                <Link to="/signup">
                  <button className="py-2 px-6 bg-sky-300 poppins-semibold border rounded-xl hover:scale-110 duration-300">
                    Register
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:block hidden w-1/2">
              <img
                className="rounded-2xl"
                src={wah_university}
                alt="Image Load Error"
              ></img>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
