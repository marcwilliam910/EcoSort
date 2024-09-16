import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../../../assets/iba-logo.png";
import deped from "../../../../assets/deped.png";

// Define styles
const styles = StyleSheet.create({
  header: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    paddingBottom: 20,
    borderBottom: "1px solid gray",
  },
  headerTextContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 13,
  },
  headerImg: {
    width: 80,
    height: 80,
    objectFit: "contain",
  },
  yesO: {
    marginTop: 10,
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  // table
  table: {
    borderCollapse: "collapse",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tableRowHeader: {
    border: "1px solid gray",
    padding: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  tableRowBody: {
    border: "1px solid gray",
    borderTop: "none",
    padding: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  tableHeader: {
    fontSize: 14,
    backgroundColor: "#22C55E",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  tableBody: {
    fontSize: 12,
  },
  total: {
    marginTop: 30,
    marginRight: 30,
    fontSize: 16,
    padding: "10px",
    alignSelf: "flex-end",
  },
  totalAmount: {
    color: "red",
  },
  // summary
  summaryText: {
    fontSize: 20,
    marginTop: 35,
    marginBottom: 15,
    textAlign: "left",
    marginLeft: 30,
  },
  summayTable: {
    width: "50%",
    marginLeft: 30,
  },
});

// Define the Document component
export default function PDF({
  data,
  month,
  year,
  totalSales,
  totalWeight,
}: Record) {
  // Aggregate totals
  const totals = data.reduce(
    (acc, item) => {
      acc.amount += parseFloat(item.amount);
      acc.weight += parseFloat(item.weight);
      return acc;
    },
    { amount: 0, weight: 0 }
  );

  const summaryData = [
    {
      label: "Metal Can",
      totalSale: 0,
      totalWeight: 0,
    },
    {
      label: "Paper",
      totalSale: 0,
      totalWeight: 0,
    },
    {
      label: "Plastic Bottle",
      totalSale: 0,
      totalWeight: 0,
    },
  ];

  totalSales.forEach((item) => {
    const currentWaste = summaryData.find(
      (sItem) => sItem.label.toLowerCase() === item.label.toLowerCase()
    );
    if (currentWaste) {
      currentWaste.totalSale += Number(item.value);
    }
  });

  totalWeight.forEach((item) => {
    const currentWaste = summaryData.find(
      (sItem) => sItem.label.toLowerCase() === item.label.toLowerCase()
    );
    if (currentWaste) {
      currentWaste.totalWeight += Number(item.value);
    }
  });

  return (
    <Document>
      <Page>
        {/* header */}
        <View style={styles.header}>
          <Image src={logo} style={styles.headerImg} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Department of Education</Text>
            <Text style={styles.headerText}>Iba National High School</Text>
            <Text style={styles.headerText}>Region III</Text>
            <Text style={[styles.headerText, styles.yesO]}>
              Youth for Environment in Schools Organization (YES-O)
            </Text>
          </View>
          <Image src={deped} style={styles.headerImg} />
        </View>
        {/* table */}
        <Text style={styles.titleText}>
          {month} {year} Waste Data
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRowHeader, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Type</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Amount</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Weight</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Date</Text>
          </View>
          {data.map((item, index) => {
            const date = new Date(item.date).toDateString();
            return (
              <View key={index} style={styles.tableRowBody}>
                <Text style={[styles.tableCell, styles.tableBody]}>
                  {item.type}
                </Text>
                <Text style={[styles.tableCell, styles.tableBody]}>
                  {item.amount} Php
                </Text>
                <Text style={[styles.tableCell, styles.tableBody]}>
                  {item.weight} kg
                </Text>
                <Text style={[styles.tableCell, styles.tableBody]}>{date}</Text>
              </View>
            );
          })}
        </View>
        {/* summary */}
        <Text style={styles.summaryText}>Summary</Text>
        <View style={styles.summayTable}>
          <View style={[styles.tableRowHeader, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Type</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Amount</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Weight</Text>
          </View>
          {summaryData.map((item, index) => (
            <View key={index} style={styles.tableRowBody}>
              <Text style={[styles.tableCell, styles.tableBody]}>
                {item.label}
              </Text>
              <Text style={[styles.tableCell, styles.tableBody]}>
                {item.totalSale} Php
              </Text>
              <Text style={[styles.tableCell, styles.tableBody]}>
                {item.totalWeight} kg
              </Text>
            </View>
          ))}
        </View>

        {/* total */}
        <View style={styles.total}>
          <Text>
            Total Sales:{" "}
            <Text style={styles.totalAmount}>{totals.amount} Php </Text>
          </Text>
          <Text>
            Total Weight:{" "}
            <Text style={styles.totalAmount}>{totals.weight} kg</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
}
interface RecordData {
  amount: string;
  date: string; // or Date if you’re using Date objects
  type: "Paper" | "Metal Can" | "Plastic Bottle";
  weight: string;
}

interface ChartData {
  label: string;
  value: number;
}

interface Record {
  data: RecordData[];
  month: string;
  year: string;
  totalSales: ChartData[];
  totalWeight: ChartData[];
}
