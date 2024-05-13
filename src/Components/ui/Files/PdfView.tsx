import { Worker, Viewer } from "@react-pdf-viewer/core";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
interface Props {
  address: string;
}
export const PdfView = ({ address }: Props) => {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
          height: "750px",
          width: "750px",
        }}
      >
        <Viewer fileUrl={address} />;
      </div>
    </Worker>
  );
};
