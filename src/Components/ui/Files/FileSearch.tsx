import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  onSearch: any;
}
export const FileSearch = ({ onSearch }: Props) => {
  const handleSearchChange = (e: any) => {
    const searchTerm = e.target.value;
    // Call the onSearch callback function with the search term
    onSearch(searchTerm);
  };
  return (
    <div className="w-full flex justify-center mt-6 mb-6">
      <div className="absolute w-[45%]">
        <div className="absolute left-3 top-2 pointer-events-none">
          <Search className="text-gray-600" />
        </div>
        <Input
          className="bg-slate-300 rounded-full overflow-hidden px-10 text-black poppins-semibold focus:bg-slate-200 border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus-visible:border-blue-700"
          placeholder="Search documents..."
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};
