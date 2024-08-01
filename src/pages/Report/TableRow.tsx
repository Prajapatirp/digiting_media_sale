import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { handleResponse, noData } from "Components/constants/common";

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
    borderLeft: "1px solid #ddd",
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
});
const TableRow = ({ items }: any) => {
  return (
    <View style={styles.row} key={items?.id}>
      <Text style={styles.cell}>{items?.vendorDetails?.vendorName || noData}</Text>
      <Text style={styles.cell}>{items?.vendorDetails?.typeOfWork || noData}</Text>
      <Text style={styles.cell}>{items?.vendorDetails?.skilled_worker || noData}</Text>
      <Text style={styles.cell}>{items?.vendorDetails?.unskilled_worker || noData}</Text>
      <Text style={styles.cell}>{items?.vendorDetails?.total_worker || noData}</Text>
      <Text style={styles.cell}>{items?.vendorDetails?.designation || noData}</Text>
      <Text style={styles.cell}>{items?.vendorDetails?.employeeName || noData || noData}</Text>
    </View>
  );
};
const TableRow2 = ({ items }: any) => {
  return (
    <View style={styles.row}>
      <Text style={styles.cell}>{items?.descriptionOfWork?.location || noData}</Text>
      <Text style={styles.cell}>{items?.descriptionOfWork?.main_activity || noData}</Text>
      <Text style={styles.cell}>{items?.descriptionOfWork?.sub_activity || noData}</Text>
      <Text style={styles.cell}>{items?.descriptionOfWork?.vendorName || noData}</Text>
      <Text style={styles.cell}>{items?.descriptionOfWork?.start_time || noData}</Text>
      <Text style={styles.cell}>{items?.descriptionOfWork?.end_time || noData}</Text>
      <Text style={styles.cell}>{items?.descriptionOfWork?.quantity || noData}</Text>
      <Text style={styles.cell}>{items?.descriptionOfWork?.unit || noData}</Text>
      <Text style={styles.cell}>{items?.descriptionOfWork?.total_menday || noData}</Text>
      <Text style={styles.cell}>{items?.descriptionOfWork?.output || noData}</Text>
    </View>
  );
};
const TableRow3 = ({ items }: any) => {
  const rows =
  items?.length > 0 ? (
    items?.map((item: any) => (
      <>
          <View style={styles.row} key={items.id}>
            <Text style={styles.cell}>{item?.stock_type || noData}</Text>
            <Text style={styles.cell}>{item?.total_quantity || noData}</Text>
            <Text style={styles.cell}>
              {item?.descriptionOfWork?.unit || noData}
            </Text>
            <Text style={styles.cell}>
              {item?.used_quantity  || noData}
            </Text>
            <Text style={styles.cell}></Text>
          </View>
        </>
      ))
    ) : (
      <View style={styles.row}>
        <Text style={styles.cell}>{handleResponse?.dataNotFound}</Text>
      </View>
    );
  return <Fragment>{rows}</Fragment>;
};
const TableRow4 = ({ items }: any) => {
  return (
    <View style={styles.row}>
      <Text style={styles.cell}>-</Text>
      <Text style={styles.cell}>-</Text>
      <Text style={styles.cell}>-</Text>
      <Text style={styles.cell}>-</Text>
      <Text style={styles.cell}>-</Text>
      <Text style={styles.cell}>-</Text>
    </View>
  );
};
const TableRow5 = ({ items }: any) => {
  const rows =
  items?.project?.expense?.length >= 0 ? (
    items?.project?.expense?.map((item: any) => (
        <View style={styles.row} key={items.id}>
          <Text style={styles.cell}>{item?.paid_to || noData}</Text>
          <Text style={styles.cell}>{item?.payment_mode || noData}</Text>
          <Text style={styles.cell}>
            {item?.amount || noData}
          </Text>
          <Text style={styles.cell}>
            {item?.purpose || noData}
          </Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
        </View>
    ))
  ) : (
    <View style={styles.row}>
      <Text style={styles.cell}>{handleResponse?.dataNotFound}</Text>
    </View>
  );
return <Fragment>{rows}</Fragment>;
};

export { TableRow, TableRow2, TableRow3, TableRow4, TableRow5 };
