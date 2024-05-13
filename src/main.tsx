import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import LoginPage from "./Components/auth/LoginPage.tsx";
import Protected from "./Components/auth/Protected.tsx";
import { ForgetPasswordScreen } from "./Components/auth/ForgetPassword.tsx";
import Chats from "./Components/ui/ChatBot/chats.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { ProfileHome } from "./Components/ui/Profile/ProfileHome.tsx";
import { FileMain } from "./Components/ui/Files/FileMain.tsx";
import MainPage from "./Components/ui/home.tsx";
import Posts from "./Components/ui/Posts/posts.tsx";
import SignUpPage from "./Components/auth/SignUpPage.tsx";
import { Members } from "./Components/ui/Members/Members.tsx";
// const LazyLoadSignUp = React.lazy(() => import("./Components/auth/SignUpPage"));
// const LazyLoadPosts = React.lazy(
//   () => import("./Components/ui/Posts/posts.tsx")
// );
//const LazyLoadChatBot = React.lazy(
// () => import("./Components/ui/ChatBot/chats.tsx")
//);
// const LazyLoadHome = React.lazy(() => import("./Components/ui/home.tsx"));
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgotPassword" element={<ForgetPasswordScreen />} />
      <Route path="/" element={<Protected />}>
        <Route path="/" element={<MainPage />}>
          <Route index element={<Posts />} />
          <Route path="/Chats" element={<Chats />}></Route>
          <Route path="/Members" element={<Members />}></Route>
          <Route path="/Files" element={<FileMain />}></Route>
          <Route path="/Profile/:queryUserId" element={<ProfileHome />}></Route>
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
