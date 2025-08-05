import React, { useState, useEffect } from 'react';
import { getDataFundtion } from '../../../../Api/CRUD Functions';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useSelector } from 'react-redux';

const GenrallagerPopup = ({ data }) => {

  const [isLoading, setIsLoading] = useState(false);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(ledgerData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Ledger_Report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("PM MANAGEMENT", 14, 15);
    doc.setFontSize(10);
    doc.text(`Ledger Report: ${formatDate(data.startDate)} - ${formatDate(data.endDate)}`, 14, 22);

    const tableColumn = ["Date", "Voucher No", "Ref No", "Ref Date", "Description", "Debit", "Credit", "Balance"];
    const tableRows = ledgerData.map(row => [
      row.date,
      row.voucherNo,
      row.refNo,
      row.refDate,
      row.description,
      row.debit,
      row.credit,
      row.balance
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8 },
    });

    doc.save("Ledger_Report.pdf");
  };


  const exportToHTML = () => {
    const content = document.getElementById("ledger-content").innerHTML;
    const blob = new Blob([content], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Ledger_Report.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToWord = () => {
    const element = document.getElementById("ledger-content");
    if (!element) {
      alert("Ledger content not found.");
      return;
    }

    const content = element.innerHTML;
    const converted = htmlDocx.asBlob(`<html><body>${content}</body></html>`);
    saveAs(converted, "Ledger_Report.docx");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(",", "");
  };



  const getData = async () => {
    setIsLoading(true); // <-- Start loader
    try {
      const Accountdata = await getDataFundtion(
        `GernalLager?startDate=${data.startDate}&endDate=${data.endDate}&Account=${data.Account}&Store=${data.store}`
      );

      const sortedByDate = Accountdata.sort((a, b) => {
        const dateA = new Date(a.VoucherDate || 0);
        const dateB = new Date(b.VoucherDate || 0);
        return dateA - dateB;
      });

      const openingEntries = sortedByDate.filter(item => item.Type === "VoucherBefore");
      const mainEntries = sortedByDate.filter(item => item.Type !== "VoucherBefore");

      let openingDebit = 0;
      let openingCredit = 0;

      openingEntries.forEach(item => {
        openingDebit += item.Debit ? parseFloat(item.Debit) : 0;
        openingCredit += item.Credit ? parseFloat(item.Credit) : 0;
      });

      const openingBalance = openingDebit - openingCredit;
      let runningBalance = openingBalance;

      const formatAmount = (amount) =>
        amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      const prevDate = new Date(data.startDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const formattedPrevDate = formatDate(prevDate.toISOString());

      const transformedData = [];

      transformedData.push({
        date: formattedPrevDate,
        voucherNo: '',
        refNo: '',
        refDate: '',
        description: `OPENING BAL. AS ON : ${formattedPrevDate}`,
        debit: openingBalance > 0 ? formatAmount(openingBalance) : "",
        credit: openingBalance < 0 ? `(${formatAmount(Math.abs(openingBalance))})` : "",
        balance: openingBalance < 0 ? `(${formatAmount(Math.abs(openingBalance))})` : formatAmount(openingBalance),
      });

      let debitTotal = openingDebit;
      let creditTotal = openingCredit;

      mainEntries.forEach(item => {
        const debit = item.Debit ? parseFloat(item.Debit) : 0;
        const credit = item.Credit ? parseFloat(item.Credit) : 0;

        debitTotal += debit;
        creditTotal += credit;

        runningBalance += debit - credit;

        transformedData.push({
          date: formatDate(item.VoucherDate),
          voucherNo: item.VoucherNumber,
          refNo: item.Chq || '',
          refDate: '',
          description: item.VoucherNumber,
          debit: debit > 0 ? formatAmount(debit) : '',
          credit: credit > 0 ? formatAmount(credit) : '',
          balance: formatAmount(Math.abs(runningBalance)),
        });
      });

      setLedgerData(transformedData);
      setTotalDebit(debitTotal);
      setTotalCredit(creditTotal);
    } catch (err) {
      console.error("Error fetching ledger data:", err);
    } finally {
      setIsLoading(false); // <-- Stop loader
    }
  };



  const [backendData, setBackendData] = useState([])
  const [ledgerData, setLedgerData] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  useEffect(() => {
    getData()
  }, [data]);

  // Format totals with commas
  const formatTotal = (amount) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const now = new Date();
  const currentTime = now.toLocaleTimeString();
  console.log(currentTime);

  return (

    <div style={styles.container}>
      <div style={{ display: 'flex', gap: '10px', padding: '10px 30px' }}>
        <button onClick={exportToExcel}>Export Excel</button>
        <button onClick={exportToPDF}>Export PDF</button>
        <button onClick={exportToWord}>Export Word</button>
        <button onClick={exportToHTML}>Export HTML</button>
      </div>
      <div style={styles.ledgerHeader}>
        <div style={styles.headerTop}>
          <div style={styles.headerLeft}>
            <span style={styles.dateTime}>Date & Time:  {formatDate(Date.now())} {currentTime} </span>
            <h2 style={styles.companyName}>PM MANAGEMENT</h2>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.logoPlaceholder}>
              <img style={styles.logo} src="https://res.cloudinary.com/dmi26itgk/image/upload/v1746526783/ocfvq7hxb3lqrobtlrkp.png" alt="logo" />
            </div>
          </div>
        </div>

        <h3 style={styles.ledgerTitle}>LEDGER - FROM {formatDate(data.startDate)} TO {formatDate(data.endDate)}</h3>

        <div style={styles.accountInfo}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>A/C. CODE:</span>
            <span style={styles.infoValue}>{data.AcCode}</span>

          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>A/C. NAME:</span>
            <span style={styles.infoValue}>{data.AcName}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>ADDRESS:</span>
            <span style={styles.infoValue}>Company</span>
          </div>
        </div>
      </div>

      <div style={styles.ledgerTableContainer}>
        <table style={styles.ledgerTable}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>VOUCH DATE</th>
              <th style={styles.tableHeader}>VOUCHER NO.</th>
              <th style={styles.tableHeader}>CHO / BILL NO.</th>
              <th style={styles.tableHeader}>CHO / BILL DT.</th>
              <th style={styles.tableHeader}>ACCOUNT NAME / DESCRIPTION</th>
              <th style={styles.tableHeader}>DEBIT</th>
              <th style={styles.tableHeader}>CREDIT</th>
              <th style={styles.tableHeader}>BALANCE</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData.map((row, index) => (
              <tr
                key={index}
                style={{
                  ...styles.tableRow,
                  backgroundColor: index % 2 === 0 ? '#f9fafc' : '#ffffff'
                }}
              >
                <td style={styles.tableCell}>{row.date}</td>
                <td style={{ ...styles.tableCell, ...styles.voucherCell }}>{row.voucherNo}</td>
                <td style={styles.tableCell}>{row.refNo}</td>
                <td style={styles.tableCell}>{row.refDate}</td>
                <td style={{ ...styles.tableCell, ...styles.descriptionCell }}>{row.description}</td>
                <td style={{ ...styles.tableCell, ...styles.amount }}>{row.debit}</td>
                <td style={{ ...styles.tableCell, ...styles.amount }}>{row.credit}</td>
                <td style={{ ...styles.tableCell, ...styles.amount, ...styles.balance }}>{row.balance}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan="5"
                style={{
                  ...styles.tableCell,
                  ...styles.totalLabel,
                  textAlign: 'right',
                  fontWeight: 'bold'
                }}
              >
                TOTALS
              </td>
              <td style={{ ...styles.tableCell, ...styles.totalAmount }}>{formatTotal(totalDebit)}</td>
              <td style={{ ...styles.tableCell, ...styles.totalAmount }}>{formatTotal(totalCredit)}</td>
              <td style={styles.tableCell}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style={styles.ledgerFooter}>
        <div style={styles.footerItem}>
          <span>Prepared By:</span>
          <div style={styles.signature}>{data.PrintedBy}</div>
        </div>
        <div style={styles.footerItem}>
          <span>Reviewed By:</span>
          <div style={styles.signature}></div>
        </div>
        <div style={styles.footerItem}>
          <span>Date:</span>
          <div>{formatDate(Date.now())}</div>
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  logo :{
    height : "2vw",
    background : "white",
    padding : "1px"
  },
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1200px',
    margin: '20px auto',
    boxShadow: '0 5px 25px rgba(0, 0, 0, 0.15)',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#fff',
  },
  ledgerHeader: {
    background: 'linear-gradient(135deg, #2c3e50, #4a6491)',
    color: 'white',
    padding: '25px 30px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: '80px',
    height: '80px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  dateTime: {
    fontSize: '14px',
    opacity: '0.9',
    display: 'block',
    marginBottom: '5px',
  },
  companyName: {
    margin: '0',
    fontSize: '28px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  ledgerTitle: {
    margin: '0 0 25px 0',
    fontSize: '20px',
    fontWeight: '500',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.15)',
    padding: '10px',
    borderRadius: '6px',
  },
  accountInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '25px',
    paddingTop: '15px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoLabel: {
    fontWeight: '600',
    fontSize: '15px',
    opacity: '0.9',
  },
  infoValue: {
    fontWeight: '500',
    fontSize: '16px',
  },
  ledgerTableContainer: {
    overflowX: 'auto',
    maxHeight: '500px',
    position: 'relative',
  },
  ledgerTable: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1000px',
  },
  tableHeader: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '15px 18px',
    textAlign: 'left',
    fontWeight: '500',
    position: 'sticky',
    top: '0',
    zIndex: '10',
    fontSize: '15px',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tableRow: {
    borderBottom: '1px solid #e0e0e0',
    '&:hover': {
      backgroundColor: '#f1f5f9',
    },
  },
  tableCell: {
    padding: '12px 18px',
    fontSize: '14px',
  },
  amount: {
    textAlign: 'right',
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: '500',
    color: '#2d3748',
  },
  balance: {
    color: '#2c3e50',
    fontWeight: '600',
  },
  voucherCell: {
    fontWeight: '500',
    color: '#2c5282',
  },
  descriptionCell: {
    maxWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  totalLabel: {
    fontWeight: '600',
    color: '#2c3e50',
    paddingRight: '20px',
  },
  totalAmount: {
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: '700',
    color: '#2c3e50',
    fontSize: '15px',
  },
  ledgerFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '25px 30px',
    background: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
  },
  footerItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '150px',
  },
  signature: {
    height: '40px',
    width: '120px',
    borderBottom: '1px solid #cbd5e0',
    marginTop: '5px',
  }
};

export default GenrallagerPopup;