import { Links } from "./Links";
import { UploadDoc } from "./UploadDoc";
import { ProfileView } from "./profileView";

export default function LeftPane() {
  return (
    <div className="poppins-light flex flex-col w-full lg:w-1/4 xl:w-1/5 h-full px-4 py-2 mt-4 lg:px-5 lg:sticky lg:top-4">
      <div className="flex flex-col w-full h-full space-y-4 ">
        {/* Profile View */}
        <ProfileView />
        <UploadDoc />
        {/* Navigation Links */}
        <Links />
      </div>
    </div>
  );
}
