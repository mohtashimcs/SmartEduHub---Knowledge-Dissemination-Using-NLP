import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { GroupForm } from "./GroupForm";

//---------------------------------------------
export const CreateGroup = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className="bg-[#87CEEB] poppins-semibold border-gray-600 border-2 font-semibold text-black hover:bg-slate-300 border-dashed hover:border-double"
          >
            Create Discussion Group
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#CDF5FD]">
          <DialogHeader>
            <DialogTitle
              className="poppins-bold"
              style={{ letterSpacing: "0.3px" }}
            >
              Create a Group
            </DialogTitle>
            <DialogDescription className="poppins-light">
              Create a group and get in touch with people.
            </DialogDescription>
          </DialogHeader>
          <GroupForm />
        </DialogContent>
      </Dialog>
    </>
  );
};
