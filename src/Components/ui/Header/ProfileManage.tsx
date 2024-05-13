import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import useUserProfile from "./ProfileHook";
import { HashLoader } from "react-spinners";
export const ProfileManage = () => {
  const {
    isEditable,
    displayName,
    dP,
    loading,
    categ,
    toggleEdit,
    handleSave,
    handleProfilePictureUpload,
    setDisplayName,
    setCateg,
  } = useUserProfile();
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      handleProfilePictureUpload(file);
    }
  };
  const handleEditClick = () => {
    document.getElementById("profilePicInput")?.click();
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full pt-14">
        <HashLoader color="#36d7b7" />
      </div>
    );
  }
  return (
    <>
      <div className="poppins-regular">
        <div className="flex  space-x-4 h-fit items-center justify-start">
          <Avatar className="size-2/5 border-2 border-gray-600">
            <AvatarImage src={dP} />
            <AvatarFallback>
              {displayName ? displayName[0] : "U"}
            </AvatarFallback>
          </Avatar>

          <Button
            className="border-2 border-red-600 bg-transparent poppins-semibold text-black rounded-2xl px-7  hover:bg-red-400 hover:text-white"
            onClick={handleEditClick}
          >
            Change
          </Button>
          <input
            type="file"
            id="profilePicInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*" // Accept only images
          />
        </div>
        <div className="space-y-2 mt-4">
          <div>
            <span>Name: </span>
            <Input
              defaultValue={displayName}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={!isEditable}
              className="mt-2"
            ></Input>
          </div>
          <div>
            <span className="text-sm mt-4">Choose your department:</span>
            <RadioGroup
              defaultValue={categ}
              className="flex space-x-2 mt-2"
              disabled={!isEditable}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="cs"
                  id="cs"
                  onClick={() => setCateg("cs")}
                />
                <Label htmlFor="cs">CS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="ee"
                  id="ee"
                  onClick={() => setCateg("ee")}
                />
                <Label htmlFor="ee">EE</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="bba"
                  id="bba"
                  onClick={() => setCateg("bba")}
                />
                <Label htmlFor="bba">BBA</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="civ"
                  id="civ"
                  onClick={() => setCateg("civ")}
                />
                <Label htmlFor="civ">CIV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="mec"
                  id="mec"
                  onClick={() => setCateg("mec")}
                />
                <Label htmlFor="mec">MEC</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-4 space-x-2 flex justify-center items-end">
            <Button
              className="border-2 border-red-600 bg-transparent text-black rounded-2xl px-7 hover:bg-red-400 hover:text-white poppins-semibold"
              onClick={toggleEdit}
              disabled={isEditable}
            >
              Edit
            </Button>
            <Button
              className="border-2 border-blue-600 bg-blue-300 text-black rounded-2xl px-7 hover:bg-blue-400 hover:text-white poppins-semibold"
              onClick={() => {
                handleSave();
                toggleEdit();
              }}
              disabled={!isEditable}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
