import { PDFViewer } from "@react-pdf/renderer";
import Table from "./Table";

const Pdf = ({data}: any) => {

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Table data={data} />
    </PDFViewer>
  );
};

export default Pdf;
