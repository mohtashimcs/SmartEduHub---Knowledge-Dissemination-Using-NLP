import { HomeSplash } from "./HomeSplash";
import { MenuScreen } from "./Menu";
import { SearchComponent } from "./SearchComponent";
export default function NavBar() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-[#89CFF3] h-fit shadow-xl rounded-b-lg border-b-4 border-blue-300">
        <nav className="flex justify-between items-center w-full px-4 lg:w-[92%] mx-auto">
          {/* Logo and Application Name */}
          <HomeSplash />
          {/* Search Bar */}
          <SearchComponent />
          {/* Profile and Settings Dropdown */}
          <MenuScreen />
        </nav>
      </header>
    </>
  );
}
