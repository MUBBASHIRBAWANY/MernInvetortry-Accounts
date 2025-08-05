import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
Font.register({
  family: 'Helvetica',
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  clientInfo: {
    border: '1px solid #000',
    padding: 5,
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '7.69%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 2,
  },
  tableCol: {
    width: '7.69%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
  },
  tableColHeaderWide: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 2,
  },
  tableColWide: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  promotionsSection: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  promotionsTable: {
    width: '50%',
    border: '1px solid #000',
  },
  totalDiscount: {
    width: '80%',
    border: '1px solid #000',
    padding: 5,
    marginLeft: 10,
  },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  signature: {
    borderTop: '1px solid #000',
    width: 100,
    paddingTop: 4,
    textAlign: 'center',
  },
  footer: {
    borderTop: '1px solid #000',
    paddingTop: 10,
  },
});

// Create Document Component
const PdfDocument = ({ data }) => {
  // Function to handle null values
  const handleNull = (value) => {
    return value === null || value === undefined ? 'N/A' : value;
  };

  return (
    <Document>
      <Page size="A1"  style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{data.company.name}</Text>
          <Text>{data.company.address}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 4 }}>
            <Text>N.T.N No: {handleNull(data.company.ntn)}</Text>
            <Text style={{ marginLeft: 10 }}>Sales Tax #: {handleNull(data.company.salesTax)}</Text>
            <Text style={{ marginLeft: 10 }}>CNIC #: {handleNull(data.company.cnic)}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.clientInfo}>
          <Text style={{ fontWeight: 'bold' }}>{handleNull(data.client.name)}</Text>
          <Text>Address: {handleNull(data.client.address)}</Text>
        </View>

        {/* Products Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeaderWide}>
              <Text>Item / Product Name</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Unit / Carton</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>CTN Box Units</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Value Excl: Gst per Box</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Total Value Excl: GST</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>RP Value Excl: GST</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>GST on RP Value @ 18%</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>RP Value Incl: GST</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>GST @ 18% per Box</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Gross Amount Incl: GST</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Advance Tax</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Total Discount</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Net Amount</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>R F</Text>
            </View>
          </View>

          {/* Table Rows */}
          {data.products.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableColWide}>
                <Text>{handleNull(product.id)} {handleNull(product.name)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.unitCarton)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.ctnBoxUnits)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.valueExclGst)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.totalValueExclGst)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.rpValueExclGst)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.gstOnRp)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.rpValueInclGst)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.gstPerBox)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.grossAmount)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.advanceTax)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.totalDiscount)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.netAmount)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.textRight}>{handleNull(product.rf)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Promotions Section */}
        <View style={styles.promotionsSection}>
          <View style={styles.promotionsTable}>
            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Promotions Applied</Text>
            {data.promotions.map((promo, index) => (
              <View key={index} style={{ flexDirection: 'row', borderBottom: '1px solid #000', padding: 2 }}>
                <View style={{ width: '70%' }}>
                  <Text>{handleNull(promo.name)}</Text>
                </View>
                <View style={{ width: '30%' }}>
                  <Text style={styles.textRight}>{handleNull(promo.amount)}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.totalDiscount}>
            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Total Discount</Text>
            <Text style={{ fontWeight: 'bold' }}>Local Form # {handleNull(data.invoice.localForm)}</Text>
            <Text>Karachi</Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signatures}>
          <View style={styles.signature}>
            <Text>Checked By Order Booker</Text>
          </View>
          <View style={styles.signature}>
            <Text>Delivered By</Text>
          </View>
          <View style={styles.signature}>
            <Text>Shop Keeper</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>CASH MEMO / INVOICE</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 4 }}>
            <Text>Sales Tax No : {handleNull(data.company.cnic)}</Text>
            <Text style={{ marginLeft: 10 }}>N.T.N No: {handleNull(data.company.cnic)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Invoice No # : {handleNull(data.invoice.number)}</Text>
            <Text>Date/Day : {handleNull(data.invoice.date)}</Text>
            <Text>Route : {handleNull(data.invoice.route)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;