import { Button } from "@/components/ui/button";
import pdfIcon from "/pdf.png";
import { Download, Link, View } from "lucide-react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/src/Firebase/firebase";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PdfView } from "./PdfView";
import { FileSearch } from "./FileSearch";
import { useAppSelector } from "@/src/app/hooks";

interface Props {
  showPersonal: boolean;
  fetchId: string;
}
export const FileView = ({ showPersonal, fetchId }: Props) => {
  interface File {
    id: string;
    publisher: string;
    title: string;
    downloadURL: string;
    description: string;
    size: string;
    // Add other properties as per your Firestore document structure
  }
  const [files, setFiles] = useState<File[]>([]);
  const userName = useAppSelector((state) => state.profile.name);

  useEffect(() => {
    const fetchData = async () => {
      if (showPersonal === true) {
        const querySnapshot = await getDocs(
          query(collection(db, "files"), where("publisher_uid", "==", fetchId))
        );
        const filesData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            downloadURL: data.downloadURL,
            description: data.description,
            size: data.size,
            publisher: data.publisher,
            // Add other properties as necessary
          };
        });
        setFiles(filesData);
      } else {
        const filesCollection = collection(db, "files");
        const filesSnapshot = await getDocs(
          query(filesCollection, orderBy("uploadedAt", "desc"))
        );
        const filesData = filesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            downloadURL: data.downloadURL,
            description: data.description,
            size: data.size,
            publisher: data.publisher,
            // Add other properties as necessary
          };
        });
        setFiles(filesData);
      }
    };

    fetchData();
  }, []);
  const copyToClipboard = (text: string) => {
    // Create a temporary input element to copy the text to clipboard
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.opacity = "0";
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    toast({
      className: "bg-[#87CEEB] poppins-bold",
      variant: "default",
      title: "Link Copied!",
      description: "Anyone with this link can view and download this file.",
    });
  };
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  // Filter files based on search term
  const filteredFiles = files.filter((file) => {
    return (
      file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  function downloadFile(url: string, filename: string) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary anchor element
        const anchor = document.createElement("a");
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = filename; // Set the download attribute with filename
        anchor.click(); // Simulate a click event to trigger the download
      })
      .catch((error) => console.error("Error downloading file:", error));
  }
  return (
    <>
      <div>
        <FileSearch onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 justify-center items-center py-4 max-h-[calc(100vh - 200px)] w-[92%] poppins-bold">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className="border-2 border-blue-300 shadow-xl rounded-3xl bg-[#cbe3ec]"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={pdfIcon}
                      alt="pdf Image"
                      className="h-10 w-auto"
                    />
                    <span className="poppins-extralight text-base text-slate-400 ml-2">
                      {parseFloat(file.size).toFixed(2)}MB
                    </span>
                  </div>
                  <div className="text-right">
                    {file.publisher && (
                      <span className="text-xs poppins-semibold text-gray-500">
                        Contributor:{" "}
                        {userName === file.publisher ? "You" : file.publisher}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h1 className="text-3xl poppins-semibold text-gray-900 truncate">
                    {file.title}
                  </h1>
                  <p className="line-clamp-2 text-base poppins-regular-italic text-gray-400 mt-2">
                    {file.description}
                  </p>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <Button
                    className="bg-[#87CEEB] w-32 border-gray-600 border-2 poppins-semibold text-black hover:bg-slate-300 border-dashed hover:border-double"
                    onClick={() => {
                      toast({
                        className: "bg-[#87CEEB] poppins-bold",
                        variant: "default",
                        title: "Downloading...",
                        description: "Your Download will start in a while.",
                      });
                      downloadFile(file.downloadURL, file.title); // Trigger file download
                    }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Download />
                      <span className="poppins-semibold">Download</span>
                    </div>
                  </Button>
                  <Dialog>
                    <DialogTrigger>
                      <Button className="bg-[#87CEEB] w-32 border-gray-600 border-2 poppins-semibold text-black hover:bg-slate-300 border-dashed hover:border-double">
                        <div className="flex items-center justify-center space-x-2">
                          <View />
                          <span className="poppins-semibold">View</span>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[800px] bg-[#CDF5FD] max-h-[600px] overflow-hidden flex justify-center-center">
                      <DialogTitle>{file.title}</DialogTitle>
                      <PdfView address={file.downloadURL} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    className="bg-[#87CEEB] w-32 border-gray-600 border-2 poppins-semibold text-black hover:bg-slate-300 border-dashed hover:border-double"
                    onClick={() => copyToClipboard(file.downloadURL)}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Link />
                      <span className="poppins-semibold">Copy Link</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-full">
            <p className="text-gray-600">No files found.</p>
          </div>
        )}
      </div>
    </>
  );
};
