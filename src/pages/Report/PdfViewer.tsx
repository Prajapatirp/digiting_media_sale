// PdfDocument.js
import React from "react";
import { Page, Document, StyleSheet, View, Text, Image } from "@react-pdf/renderer";
import logoImage from "../../assets/image/shivLogo.png";
import {
  ItemsTable,
  ItemsTable2,
  ItemsTable3,
  ItemsTable4,
  ItemsTable5,
} from "./ItemsTable";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    padding: "2%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    border: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#ddd",
    borderRadius: 4,
  },
  headerRow: {
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#ddd",
  },
  cell: {
    flex: 1,
    padding: 8,
    backgroundColor: "white",
    border: "1px solid #ddd",
  },
  cell1: {
    flex: 1,
    padding: 8,
    fontSize: "15px",
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 10,
    color: "grey",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 50,
    color: "rgba(0, 0, 0, 0.1)",
  },
});

const PdfDocument = ({ pdfData, date }:any) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.header} wrap={false}>
        <Image src={logoImage} style={styles.logo} />
        <Text style={styles.cell}>Aranath Enterprise</Text>
        <Text style={styles.cell}>Daily Report</Text>
        <View style={styles.headerRow}>
          <Text style={styles.cell}>Project Name</Text>
          <Text style={styles.cell}>Project Manager</Text>
          <Text style={styles.cell}>Date</Text>
          <Text style={styles.cell}>Day</Text>
          <Text style={styles.cell}>Time</Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.cell}>{pdfData?.taskDetails?.[0]?.projectName}</Text>
          <Text style={styles.cell}>{pdfData?.taskDetails?.[0]?.managerName}</Text>
          <Text style={styles.cell}>{moment(date).format("L")}</Text>
          <Text style={styles.cell}>{moment(date).format("dddd") || "-"}</Text>
          <Text style={styles.cell}>
            {pdfData?.taskDetails?.[0]?.descriptionOfWork?.start_time} to {pdfData?.taskDetails?.[0]?.descriptionOfWork?.end_time}
          </Text>
        </View>
      </View>

      <View>
        <Text style={styles?.cell1}>Vendor Details</Text>
        <ItemsTable data={pdfData?.taskDetails?.[0]} />
        <Text style={styles.cell1}>Description of work</Text>
        <ItemsTable2 data={pdfData?.taskDetails?.[0]} />
      </View>

      <View break>
        <Text style={styles.cell1}>Material Procurement</Text>
        <ItemsTable3 data={pdfData?.stockDetails} />
        <Text style={styles.cell1}>Inventory</Text>
        <ItemsTable4 data={pdfData} />
      </View>

      <View break>
        <Text style={styles.cell1}>Transaction</Text>
        <ItemsTable5 data={pdfData?.taskDetails?.[0]} />
      </View>

      <Text style={styles.footer}>Aranath Enterprise</Text>
    </Page>
  </Document>
);

export default PdfDocument;
