import logo from "/logo.png";
import { useNavigate } from "react-router-dom";

export const HomeSplash = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-4">
      <img
        className="w-14 cursor-pointer"
        src={logo}
        alt="LOGO"
        onClick={() => navigate("/")}
      />
      <div>
        <h1 className="text-sky-700 text-2xl poppins-bold">Smart</h1>
        <h1 className="text-black text-xl poppins-semibold">EduHub</h1>
      </div>
    </div>
  );
};
