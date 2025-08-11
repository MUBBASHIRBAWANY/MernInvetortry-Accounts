import React, { useState, useEffect } from 'react';
import { getDataFundtion } from '../../../../Api/CRUD Functions';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useSelector } from 'react-redux';

const GenrallagerPopup = ({ data }) => {
console.log(data)
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [margeVoucher, setMargeVoucher] = useState([])
  const [ledgerData, setLedgerData] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [voucher, setVoucher] = useState("")
  

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || amount === '' || isNaN(Number(amount))  || amount === 0) {
      return ''
    }

    return Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(ledgerData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Ledger_Report.xlsx");
  };
  const openVoucherModal = async (voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
    const seletedVoucher = await getDataFundtion(`/Voucher/getVoucherByNumber/${voucher}`)
    console.log(voucher)

    setVoucher(seletedVoucher.data[0])
  };
  console.log(voucher)
  const closeVoucherModal = () => {
    setIsModalOpen(false);
    setSelectedVoucher(null);
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
      const mainEntries = sortedByDate.filter(item => item.Type === "Voucher");
      const modalEntry = Accountdata.filter(item => item.Type === "VoucherCheck");
      
      setMargeVoucher(modalEntry)
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
          debit: debit > 0 ? formatAmount(debit) : '',
          credit: credit > 0 ? formatAmount(credit) : '',
          balance: formatAmount(Math.abs(runningBalance)),
          Accountdata: item.VoucharData
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

console.log(data?.allstoreValue)
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
                <td
                  style={{
                    ...styles.tableCell,
                    ...styles.voucherCell,
                    cursor: "pointer",
                    textDecoration: "underline",   // ✅ fixed
                    color: "blue"
                  }}
                  onClick={() => openVoucherModal(row.voucherNo)}
                >{row.voucherNo}</td>
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
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={closeVoucherModal}>
          <div style={styles.modalContainer} onClick={e => e.stopPropagation()}>
            <div style={styles.header}>
              <h1 style={styles.headerTitle}>
                <i className="fas fa-file-invoice-dollar" style={{ marginRight: '10px' }}></i>
                Voucher Check Details
              </h1>
              <div style={styles.statusBadge}>Active</div>
              <button
                style={styles.closeButton}
                onClick={closeVoucherModal}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={styles.content}>
              <div style={styles.summaryCards}>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>CHECK NUMBER</h3>
                  <p style={styles.cardValue}>{voucher?.Chq}</p>
                </div>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>VOUCHER DATE</h3>
                  <p style={styles.cardValue}>{voucher?.VoucherDate}</p>
                </div>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>VOUCHER NUMBER</h3>
                  <p style={styles.cardValue}>{voucher?.VoucherNumber}</p>
                </div>
              </div>

              <div style={styles.sectionTitle}>
                <div style={styles.sectionIcon}>
                  <i className="fas fa-list"></i>
                </div>
                <h2 style={styles.sectionHeading}>Voucher Entries</h2>
              </div>

              <table style={styles.voucherTable}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Account</th>
                    <th style={styles.tableHeader}>Store</th>
                    <th style={styles.tableHeader}>Debit</th>
                    <th style={styles.tableHeader}>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {voucher?.VoucharData?.map((entry, index) => (
                    <tr key={entry.id}>
                      
                      <td style={styles.tableCell2}>{data.chartofAccount.find((item) => item._id === entry.Account).AccountName}</td>
                      <td style={styles.tableCell2}>{data?.allstoreValue?.find((item) => item.value === entry.store)?.label || "Head Office	"}</td>
                      {voucher.PaidFor === "vendor" ? <td style={styles.tableCell2}> { data.vendor.find((item) => item._id === entry.vendor)?.VendorName || '-'} </td> : ""}
                      <td style={{ ...styles.tableCell2, ...(entry.Debit !== '0' ? styles.debitCell : {}) }}>
                        {entry.Debit !== '0' || entry.Debit !== undefined ? (`${formatCurrency(entry.Debit)}` || "") : ''}
                      </td>
                      <td style={{ ...styles.tableCell2, ...(entry.Credit !== '0' ? styles.creditCell : {}) }}>
                        {entry.Credit !== '0' ? `${formatCurrency(entry.Credit)}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

             
            </div>

            <div style={styles.footer}>
              <div style={styles.timestamp}>
                <i className="fas fa-clock"></i>
                <span>Generated: {new Date().toLocaleString()}</span>
              </div>
              <div>PM Management System</div>
            </div>
          </div>
        </div>
      )}
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
  logo: {
    height: "2vw",
    background: "white",
    padding: "1px"
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
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    padding: '30px',
    borderRadius: '10px',
    width: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    border: 'none',
    background: 'transparent',
    fontSize: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '90%',
    maxWidth: '900px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #1a3a8f 0%, #2c5cc5 100%)',
    color: 'white',
    padding: '20px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusBadge: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 500,
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.3s',
  },
  closeButtonHover: {
    background: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    padding: '30px',
  },
  summaryCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    background: '#f8f9ff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    borderLeft: '4px solid #2c5cc5',
  },
  cardTitle: {
    color: '#5a6c90',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '10px',
  },
  cardValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1a3a8f',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    margin: '25px 0 15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e0e5f0',
  },
  sectionIcon: {
    background: '#eef2ff',
    color: '#2c5cc5',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
  },
  sectionHeading: {
    fontSize: '18px',
    color: '#1a3a8f',
    fontWeight: 600,
  },
  voucherTable: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    background: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  tableHeader: {
    background: '#f8f9ff',
    color: '#5a6c90',
    fontWeight: 600,
    textAlign: 'left',
    padding: '16px 20px',
    borderBottom: '2px solid #e0e5f0',
  },
  tableCell2: {
    paddingTop: '20px',
    paddingBottom : "20px",
    borderBottom: '1px solid #e0e5f0',
    color: '#4a5568',
  },
  debitCell: {
    color: '#f44336',
    fontWeight: 600,
  },
  creditCell: {
    color: '#4caf50',
    fontWeight: 600,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e0e5f0',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #1a3a8f 0%, #2c5cc5 100%)',
    color: 'white',
  },
  outlineButton: {
    background: 'transparent',
    border: '1px solid #d1d5db',
    color: '#4a5568',
  },
  footer: {
    background: '#f8f9ff',
    padding: '20px 30px',
    color: '#5a6c90',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  '@media (max-width: 768px)': {
    summaryCards: {
      gridTemplateColumns: '1fr',
    },
    actions: {
      flexDirection: 'column',
    },
    button: {
      width: '100%',
    },
  }

}

export default GenrallagerPopup;