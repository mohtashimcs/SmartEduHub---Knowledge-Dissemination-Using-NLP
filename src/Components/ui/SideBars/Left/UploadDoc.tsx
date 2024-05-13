import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileForm } from "../../Files/FileForm";

export const UploadDoc = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="poppins-semibold bg-[#87CEEB] border-gray-600 border-2 poppins-semibold text-black hover:bg-slate-300 border-dashed hover:border-double"
        >
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#CDF5FD]">
        <DialogHeader>
          <DialogTitle
            className="poppins-bold"
            style={{ letterSpacing: "0.3px" }}
          >
            Upload Documents to Cloud
          </DialogTitle>
          <DialogDescription className="poppins-light">
            Upload your important documents so you never loss them.
          </DialogDescription>
        </DialogHeader>
        <FileForm />
      </DialogContent>
    </Dialog>
  );
};
