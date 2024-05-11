import { ChangeEvent, useEffect, useState } from "react";
import wah_university from "/wah_university.jpg";
import {
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db, storage } from "@/src/Firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { CircleUser, Eye, EyeOff, ImagePlus } from "lucide-react";
import { HashLoader } from "react-spinners";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAppDispatch } from "@/src/app/hooks";
import {
  updateCategory,
  updateName,
  updatePic,
  updateUserId,
} from "@/src/app/features/ProfileSlice";

function SignUpPage() {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPass, Cpassword] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [category, setCategory] = useState("cs");
  const Navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    // This function will be called after password or checkPass changes
    validatePasswords();
  }, [password, checkPass]); // Dependencies array, effect runs when these values change

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validatePasswords = () => {
    if (!password) {
      return;
    }
    if (password.length < 6) {
      setValidationMessage("Password must be at least 8 characters long.");
    } else {
      setValidationMessage("");
    }
  };
  const checkValidity = () => {
    if (password !== checkPass) {
      console.log(password + "asd" + checkPass);
      setValidationMessage("Passwords do not match.");
      toast({
        className: "poppins-bold",
        variant: "destructive",
        title: "Passwords do not match.",
      });
    } else if (password === checkPass) {
      toast({
        className: "bg-[#87CEEB] poppins-bold",
        variant: "default",
        title: "Password Matched!",
      });
    } else {
      setValidationMessage("");
    }
  };
  useEffect(() => {
    if (checkPass.length != 0) checkValidity();
  }, [checkPass]);
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
    // Delay validation to give user a chance to finish typing
    setTimeout(validatePasswords, 500);
  };

  const handleCheckPassChange = (e: any) => {
    Cpassword(e.target.value);
    // Delay validation to give user a chance to finish typing
    setTimeout(validatePasswords, 500);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files[0]) {
      setProfilePic(files[0]); // Set the selected file
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    if (profilePic == null) {
      alert("please select a user avatar");
      return;
    } else if (password != checkPass) {
      setValidationMessage("Passwords do not match.");
      return;
    } else {
      e.preventDefault();
      setIsLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await sendEmailVerification(user);
        alert("Please Verify Your Email.");
        // Function to periodically check if the email is verified
        const checkEmailVerified = async () => {
          let totalTimeElapsed = 0; // Track total time elapsed
          const maxWaitTime = 1200000; // Maximum wait time of 120 seconds

          const intervalId = setInterval(async () => {
            await reload(user); // Reload user to update emailVerified status
            if (user.emailVerified) {
              clearInterval(intervalId); // Stop the interval
              proceedAfterEmailVerification(user); // Proceed with post-verification logic
            } else {
              totalTimeElapsed += 3000; // Update the elapsed time by 3 seconds
              if (totalTimeElapsed >= maxWaitTime) {
                clearInterval(intervalId); // Stop the interval
                // Attempt to delete the user's account since they failed to verify in time
                user
                  .delete()
                  .then(() => {
                    alert(
                      "Email verification timeout. Your registration has been canceled. Please try registering again."
                    );
                    setIsLoading(false);
                    Navigate("/signup"); // Redirect to signup or the initial registration page
                  })
                  .catch((error) => {
                    // Handle any errors that occur during account deletion
                    console.error("Error removing user: ", error);
                    alert(
                      "An error occurred while canceling your registration. Please try again."
                    );
                    setIsLoading(false);
                  });
              }
            }
          }, 3000); // Check every 3 seconds
        };

        // Start checking
        checkEmailVerified();
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        toast({
          className: "poppins-bold",
          variant: "destructive",
          title: "Registration Failed!",
          description: (error as Error).message,
        });
      }
    }
  };

  const proceedAfterEmailVerification = async (user: any) => {
    let profilePicUrl = "";
    if (profilePic) {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      const uploadTask = await uploadBytes(storageRef, profilePic);
      profilePicUrl = await getDownloadURL(uploadTask.ref);
    }
    const lowercasedName = name.toLowerCase();
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      userName: userName,
      email: user.email,
      name: name,
      category: category,
      low_name: lowercasedName,
      ProfilePic: profilePicUrl,
      posts: [],
      groups: [],
      files: [],
    });
    localStorage.setItem("uid", user.uid);
    localStorage.setItem("category", category);
    localStorage.setItem("token", JSON.stringify(user.getIdToken));
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(updateCategory(category));
    dispatch(updateName(userName));
    dispatch(updateUserId(user.uid));
    dispatch(updatePic(profilePicUrl));
    alert("Registration Successful.");
    Navigate("/");
  };

  return (
    <>
      <section className="bg-transparent min-h-screen flex flex-col items-center justify-center poppins-regular bg-[#dfe3ee]">
        <div className="lg:flex pb-4 poppins-black md:block">
          <h1 className="text-sky-500 text-6xl">Smart</h1>
          <h1 className="text-black text-6xl">EduHub</h1>
        </div>
        {loading ? (
          <div className="fixed inset-0 flex justify-center items-center bg-[rgba(255,255,255,0.8)]">
            <HashLoader color="#36d7b7" />
          </div>
        ) : (
          <div className="bg-gray-100 flex rounded-3xl shadow-2xl max-w-3xl p-5 items-center">
            <div className="md:w-1/2 px-8 md:px-16">
              <h2 className="font-bold text-2xl text-[#002D74]">SignUp</h2>
              <p className="text-xs mt-4 text-[#002D74]">
                Create your space in a world where every voice matters. Sign up
                and make yours heard!
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                <input
                  //required
                  className="hidden"
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="profilePic"
                  className="flex items-center space-x-2 justify-center font-thin font-sans text-base mt-2 border-2 border-gray-400 rounded-full"
                >
                  <ImagePlus className="text-blue-300" />
                  <span>Add an avatar</span>
                </label>
                <div className="relative">
                  <input
                    required
                    id="userName"
                    type="text"
                    className="w-60 pl-10 pr-4 py-2 rounded-xl border-2 shadow-lg text-black dark:bg-gray-50"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <div
                    className="absolute inset-y-0 left-0 pl-3  
                    flex items-center  
                    pointer-events-none"
                  >
                    <CircleUser className="text-gray-600" />
                  </div>
                </div>

                <div className="relative">
                  <input
                    required
                    type="text"
                    id="Name"
                    className="w-60 pl-10 pr-4 py-2 rounded-xl border-2 shadow-lg text-black dark:bg-gray-50"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="relative">
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
                <div>
                  {validationMessage && (
                    <div className="text-red-500 text-sm mb-2">
                      {validationMessage}
                    </div>
                  )}
                  <div className="relative mb-1">
                    <input
                      required
                      id="pass"
                      type={isPasswordVisible ? "text" : "password"}
                      className="w-60 pl-10 pr-10 py-2 rounded-xl border shadow-lg text-black dark:bg-gray-50"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
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

                  <div className="relative">
                    <input
                      required
                      id="cpass"
                      type={isPasswordVisible ? "text" : "password"}
                      className="w-60 pl-10 pr-10 py-2 rounded-xl border shadow-lg text-black dark:bg-gray-50"
                      placeholder="Confirm Password"
                      value={checkPass}
                      onChange={handleCheckPassChange}
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
                </div>
                <div>
                  <span className="text-sm font-sans font-light">
                    Choose your department:
                  </span>
                  <RadioGroup
                    defaultValue="cs"
                    className="flex space-x-0"
                    onChange={(e) =>
                      setCategory((e.target as HTMLInputElement).value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cs" id="cs" />
                      <Label htmlFor="cs">CS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ee" id="ee" />
                      <Label htmlFor="ee">EE</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bba" id="bba" />
                      <Label htmlFor="bba">BBA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="civ" id="civ" />
                      <Label htmlFor="civ">CIV</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mec" id="mec" />
                      <Label htmlFor="mec">MEC</Label>
                    </div>
                  </RadioGroup>
                </div>
                <button
                  type="submit"
                  className="bg-[#002D74] rounded-xl poppins-semibold text-white py-2 hover:scale-105 duration-300"
                >
                  Sign Up
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
                  <button className="py-2 px-5 bg-sky-300 poppins-semibold border rounded-xl hover:scale-110 duration-300">
                    Sign in
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:block hidden w-1/2">
              <img className="rounded-2xl" src={wah_university}></img>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
export default SignUpPage;
