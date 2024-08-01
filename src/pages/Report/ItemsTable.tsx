import React from "react";
import { View, StyleSheet, Text, Image } from "@react-pdf/renderer";
import {TableRow, TableRow2, TableRow3, TableRow4, TableRow5} from "./TableRow";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
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
    flexWrap: "wrap",
    wordBreak: "break-all",
    borderLeft: "1px solid #ddd",
    textAlign: 'center'
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

const ItemsTable = ({ data }: any) => {
  return <View style={styles.page}>
    <View style={styles.table}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={styles.cell}>Vendor Name</Text>
        <Text style={styles.cell}>Type of Work</Text>
        <Text style={styles.cell}>Skilled Workers</Text>
        <Text style={styles.cell}>Unskilled Workers</Text>
        <Text style={styles.cell}>Total Workers</Text>
        <Text style={styles.cell}>Designation</Text>
        <Text style={styles.cell}>Exmployee Name</Text>
      </View>
      <TableRow items={data} />
    </View>
  </View>;
};
const ItemsTable2 = ({ data }: any) => {
  return <View style={styles.page}>
    <View style={styles.table}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={styles.cell}>Location</Text>
        <Text style={styles.cell}>Main Activity</Text>
        <Text style={styles.cell}>Sub Activity</Text>
        <Text style={styles.cell}>Vendor Name</Text>
        <Text style={styles.cell}>Start Time</Text>
        <Text style={styles.cell}>End Time</Text>
        <Text style={styles.cell}>Quantity</Text>
        <Text style={styles.cell}>Unit</Text>
        <Text style={styles.cell}>Total Menday</Text>
        <Text style={styles.cell}>Output</Text>
      </View>
      <TableRow2 items={data} />
    </View>
  </View>;
};
const ItemsTable3 = ({ data }: any) => {
  return <View style={styles.page}>
    <View style={styles.table}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={styles.cell}>Type</Text>
        <Text style={styles.cell}>Quantity Received</Text>
        <Text style={styles.cell}>Unit</Text>
        <Text style={styles.cell}>Acceptable Quantity</Text>
        <Text style={styles.cell}>Remarks</Text>
      </View>
      <TableRow3 items={data} />
    </View>
  </View>;
};
const ItemsTable4 = ({ data }: any) => {
  return <View style={styles.page}>
    <View style={styles.table}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={styles.cell}>Material Name</Text>
        <Text style={styles.cell}>Opening Stock</Text>
        <Text style={styles.cell}>Closing Stock</Text>
        <Text style={styles.cell}>Remaining</Text>
        <Text style={styles.cell}>Quantity</Text>
        <Text style={styles.cell}>Receiver Sign</Text>
      </View>
      <TableRow4 items={data} />
    </View>
  </View>;
};
const ItemsTable5 = ({ data }: any) => {
  return <View style={styles.page}>
    <View style={styles.table}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={styles.cell}>Paid to</Text>
        <Text style={styles.cell}>Mode</Text>
        <Text style={styles.cell}>Amount</Text>
        <Text style={styles.cell}>Purpose</Text>
        <Text style={styles.cell}>Sign of Payer</Text>
        <Text style={styles.cell}>Sign of Receiver</Text>
      </View>
      <TableRow5 items={data} />
    </View>
  </View>;
};

export { ItemsTable, ItemsTable2, ItemsTable3, ItemsTable4, ItemsTable5 };
