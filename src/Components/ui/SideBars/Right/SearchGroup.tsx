import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import { useState } from "react";

export const SearchGroup = () => {
  const [load, setLoad] = useState<Boolean>(false);
  return (
    <>
      <div className="flex space-x-2 items-center justify-center">
        {load && <SearchBar />}
        {load ? (
          <Button
            className="w-fit poppins-semibold border-dashed border-2 bg-[#87CEEB] border-gray-600 text-black hover:bg-slate-300 hover:border-double"
            onClick={() => setLoad(!load)}
          >
            Find Groups
          </Button>
        ) : (
          <Button
            className="w-full poppins-semibold border-dashed border-2 bg-[#87CEEB] border-gray-600 text-black hover:bg-slate-300 hover:border-double"
            onClick={() => setLoad(!load)}
          >
            Find Groups
          </Button>
        )}
      </div>
    </>
  );
};
