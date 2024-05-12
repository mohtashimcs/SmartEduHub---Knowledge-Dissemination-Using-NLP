import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";

export const RequestInfo = () => {
  return (
    // <Dialog>
    //   <DialogTrigger>
    <Button className="bg-[#87CEEB] border-gray-400 text-black hover:bg-slate-300 hover:border-double hover:border-black border-2">
      <Handshake />
    </Button>
    //   </DialogTrigger>
    //   <DialogContent>
    //     <DialogHeader className="poppins-regular">
    //       <DialogTitle>Group Join Requests</DialogTitle>
    //       <DialogDescription>
    //         <div className="flex space-x-4 items-center border-t-2 border-b-2 border-gray-300 p-2 mt-2">
    //           <div>
    //             <Avatar>
    //               <AvatarImage src="https://github.com/shadcn.png" />
    //               <AvatarFallback>CN</AvatarFallback>
    //             </Avatar>
    //           </div>
    //           <div className="flex text-wrap">
    //             <span>
    //               <strong>Mohtashim</strong>&nbsp;requested to join your group{" "}
    //               <strong>ABC.</strong>
    //             </span>
    //           </div>
    //           <div className="flex space-x-2 poppins-semibold">
    //             <Button className="bg-[#87CEEB] border-2 border-blue-200 hover:bg-[#bde1ef] hover:text-black hover:border-gray-500">
    //               Accept
    //             </Button>
    //             <Button
    //               className="border-2 border-red-100 hover:bg-red-300 hover:text-black"
    //               variant={"destructive"}
    //             >
    //               Reject
    //             </Button>
    //           </div>
    //         </div>
    //       </DialogDescription>
    //     </DialogHeader>
    //   </DialogContent>
    // </Dialog>
  );
};
