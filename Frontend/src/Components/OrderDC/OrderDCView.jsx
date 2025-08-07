import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';

const OrderDCView = () => {
    const { id } = useParams();
    const Client = useSelector((state) => state.Client.client);
    const Products = useSelector((state) => state.Product.product);
    const location = useSelector((state) => state.Location.Location);
    const loginVendor = useSelector((state) => state.LoginerReducer.userDetail);
    const Store = useSelector((state) => state.Store.Store);
    const OrderBooker = useSelector((state) => state.OrderBooker.OrderBooker);
    const OrderDc = useSelector((state) => state.OrderDc.OrderDc);

    const [poClient, setPoClient] = useState(null);
    const [formValues, setFormValues] = useState({
        salesInvoice: '',
        DcDate: '',
        Remarks: ''
    });
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const companyInfo = {
        name: "Premium Distributors Ltd",
        address: "123 Commerce Street, Business District",
        city: "New York, NY 10001",
        phone: "+1 (555) 123-4567",
        email: "orders@premiumdistributors.com",
        website: "www.premiumdistributors.com"
    };

    const Location = location.filter(item => loginVendor?.Location?.includes(item._id));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = OrderDc.find((item) => item._id === id);
                if (data) {
                    const client = Client.find((item) => item._id === data.Customer);
                    setPoClient(client || null);

                    setTableData(data.DcData || []);

                    setFormValues({
                        salesInvoice: data.DcNumber || '',
                        DcDate: data.DcDate || '',
                        Remarks: data.Remarks || ''
                    });
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading order data:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, OrderDc, Client]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading delivery order details...</p>
                </div>
            </div>
        );
    }

    if (!tableData.length) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The delivery order you requested could not be found. It may have been deleted or archived.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const totalCarton = tableData.reduce((sum, row) => sum + (parseInt(row.carton) || 0), 0);
    const totalDelivered = tableData.reduce((sum, row) => sum + (parseInt(row.Delivered) || 0), 0);
    const totalRemaining = totalCarton - totalDelivered;
 
   

const generatePDF = () => {
    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        // Company Info Header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(companyInfo.name || '', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(companyInfo.address || '', pageWidth / 2, 26, { align: 'center' });
        doc.text(companyInfo.city || '', pageWidth / 2, 32, { align: 'center' });
        doc.text(`${companyInfo.phone} | ${companyInfo.email} | ${companyInfo.website}`, pageWidth / 2, 38, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(15, 42, pageWidth - 15, 42);

        // Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('DELIVERY ORDER', pageWidth / 2, 52, { align: 'center' });

        // Delivery Info
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`DC Number: ${formValues.salesInvoice}`, 20, 62);
        doc.text(`Date: ${formValues.DcDate}`, 20, 68);
        doc.text(`Client: ${poClient?.CutomerName || 'N/A'}`, 20, 74);
        doc.text(`Remarks: ${formValues.Remarks || 'None'}`, pageWidth - 20, 62, { align: 'right' });

        // Prepare Table
        const tableBody = tableData.map((row) => {
            const product = Products.find(p => p._id === row.product);
            const orderBooker = OrderBooker.find(ob => ob._id === row.OrderBooker);
            return [
                product?.ProductName || 'N/A',
                row.carton || '0',
                row.Delivered || '0',
                row.Remaingcarton || '0',
                orderBooker?.OrderBookerName || 'N/A'
            ];
        });

        const headers = ['Product', 'CTN', 'Delivered', 'Remaining', 'Order Booker'];

        // Draw Table
        autoTable(doc, {
            head: [headers],
            body: tableBody,
            startY: 80,
            styles: {
                fontSize: 10,
                cellPadding: 3,
                valign: 'middle',
                halign: 'center'
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            columnStyles: {
                0: { halign: 'left', cellWidth: 60 },
                4: { halign: 'left', cellWidth: 40 }
            }
        });

        // Summary
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Summary:', 20, finalY);

        doc.setFont('helvetica', 'normal');
        doc.text(`Total Cartons: ${totalCarton}`, 40, finalY + 8);
        doc.text(`Total Delivered: ${totalDelivered}`, 40, finalY + 16);
        doc.text(`Total Remaining: ${totalRemaining}`, 40, finalY + 24);

        // Footer
        doc.setFontSize(9);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 280);
        doc.text(`© ${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.`, pageWidth / 2, 280, { align: 'center' });

        // Save File
        doc.save(`DeliveryOrder_${formValues.salesInvoice || 'Document'}.pdf`);
    } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF. Please try again.");
    }
};


    const generateWordDocument = async () => {
        try {
            // Prepare table rows
            const tableRows = tableData.map(row => {
                const product = Products.find(p => p._id === row.product);
                const orderBooker = OrderBooker.find(ob => ob._id === row.OrderBooker);

                return new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(product?.ProductName || 'N/A')] }),
                        new TableCell({ children: [new Paragraph(row.carton?.toString() || '0')] }),
                        new TableCell({ children: [new Paragraph(row.Delivered?.toString() || '0')] }),
                        new TableCell({ children: [new Paragraph(row.Remaingcarton?.toString() || '0')] }),
                        new TableCell({ children: [new Paragraph(orderBooker?.OrderBookerName || 'N/A')] })
                    ]
                });
            });

            // Add header row
            const headerRow = new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph('Product')], shading: { fill: 'DDEBF7' } }),
                    new TableCell({ children: [new Paragraph('CTN')], shading: { fill: 'DDEBF7' } }),
                    new TableCell({ children: [new Paragraph('Delivered')], shading: { fill: 'DDEBF7' } }),
                    new TableCell({ children: [new Paragraph('Remaining')], shading: { fill: 'DDEBF7' } }),
                    new TableCell({ children: [new Paragraph('Order Booker')], shading: { fill: 'DDEBF7' } })
                ]
            });

            // Create table
            const table = new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [headerRow, ...tableRows]
            });

            // Create document
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: companyInfo.name,
                                    bold: true,
                                    size: 28
                                })
                            ],
                            alignment: 'center',
                            spacing: { after: 200 }
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: companyInfo.address,
                                    size: 22
                                })
                            ],
                            alignment: 'center'
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: companyInfo.city,
                                    size: 22
                                })
                            ],
                            alignment: 'center'
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${companyInfo.phone} | ${companyInfo.email}`,
                                    size: 22
                                })
                            ],
                            alignment: 'center',
                            spacing: { after: 300 }
                        }),

                        // Title
                        new Paragraph({
                            text: "DELIVERY ORDER",
                            heading: HeadingLevel.HEADING_1,
                            alignment: 'center',
                            spacing: { after: 400 }
                        }),

                        // Order details
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `DC Number: ${formValues.salesInvoice}`,
                                    bold: true
                                })
                            ],
                            spacing: { after: 150 }
                        }),
                        new Paragraph({
                            text: `Date: ${formValues.DcDate}`,
                            spacing: { after: 150 }
                        }),
                        new Paragraph({
                            text: `Client: ${poClient?.CutomerName || 'N/A'}`,
                            spacing: { after: 150 }
                        }),
                        new Paragraph({
                            text: `Remarks: ${formValues.Remarks || 'None'}`,
                            spacing: { after: 300 }
                        }),

                        // Table
                        table,

                        // Totals
                        new Paragraph({
                            text: "Summary:",
                            bold: true,
                            spacing: { before: 300, after: 150 }
                        }),
                        new Paragraph({
                            children: [
                                new TextRun(`Total Cartons: ${totalCarton}`),
                                new TextRun({ break: 1 }),
                                new TextRun(`Total Delivered: ${totalDelivered}`),
                                new TextRun({ break: 1 }),
                                new TextRun(`Total Remaining: ${totalRemaining}`)
                            ],
                            spacing: { after: 300 }
                        }),

                        // Footer
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Generated on: ${new Date().toLocaleDateString()}`,
                                    size: 20,
                                    color: '7F8C8D'
                                }),
                                new TextRun({ break: 1 }),
                                new TextRun({
                                    text: `© ${new Date().getFullYear()} ${companyInfo.name}`,
                                    size: 20,
                                    color: '7F8C8D'
                                })
                            ]
                        })
                    ]
                }]
            });

            // Generate and save document
            Packer.toBlob(doc).then(blob => {
                saveAs(blob, `DeliveryOrder_${formValues.salesInvoice}.docx`);
            });
        } catch (error) {
            console.error("Word document generation failed:", error);
            alert("Failed to generate Word document. Please try again or contact support.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Document Header */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200">
                    <div className="bg-gradient-to-r from-blue-800 to-indigo-900 px-8 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-6 md:mb-0 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-white">{companyInfo.name}</h1>
                                <p className="text-blue-200 mt-2">{companyInfo.address}</p>
                                <p className="text-blue-200">{companyInfo.city}</p>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-800">DELIVERY ORDER</h2>
                                    <div className="mt-3 text-gray-600">
                                        <div>DC Number: <span className="font-semibold">{formValues.salesInvoice}</span></div>
                                        <div className="mt-1">Date: {formValues.DcDate}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-6">
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="mb-6 md:mb-0">
                                <h3 className="text-lg font-semibold text-gray-700">Client Information</h3>
                                <div className="mt-2 bg-blue-50 p-4 rounded-lg">
                                    <p className="font-medium text-gray-800">{poClient?.CutomerName || 'N/A'}</p>
                                    <p className="text-gray-600">{poClient?.Address || 'Address not available'}</p>
                                    <p className="text-gray-600">{poClient?.Phone || 'Phone not available'}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <div className="flex space-x-3 mb-4">
                                    <button
                                        onClick={generatePDF}
                                        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                        Export PDF
                                    </button>
                                    <button
                                        onClick={generateWordDocument}
                                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                        Export Word
                                    </button>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 w-full max-w-xs">
                                    <h4 className="font-semibold text-gray-700 mb-2">Order Summary</h4>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Total Items:</span>
                                        <span className="font-medium">{tableData.length}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Total Cartons:</span>
                                        <span className="font-medium">{totalCarton}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Delivered:</span>
                                        <span className="font-medium text-green-600">{totalDelivered}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Remarks</h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[60px]">
                                {formValues.Remarks || "No remarks provided"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800">Products Delivery Details</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Product</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">CTN</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Delivered</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Remaining</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">Order Booker</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">Location</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tableData.map((row) => {
                                    const product = Products.find((item) => item._id === row.product);
                                    const orderBooker = OrderBooker.find((item) => item._id === row.OrderBooker);
                                    const locationItem = Location.find((item) => item._id === row.Location);

                                    return (
                                        <tr key={row._id || row.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{product?.ProductName || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{product?.ProductCode || 'No code'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                {row.carton || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-green-600">
                                                {row.Delivered || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-3 py-1 ${row.Remaingcarton > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {row.Remaingcarton || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                                {orderBooker?.OrderBookerName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                                                {locationItem?.LocationName || 'N/A'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td className="px-6 py-3 text-sm font-bold text-gray-900">Total</td>
                                    <td className="px-6 py-3 text-center text-sm font-bold text-gray-900">{totalCarton}</td>
                                    <td className="px-6 py-3 text-center text-sm font-bold text-green-600">{totalDelivered}</td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`inline-flex text-xs leading-5 font-bold rounded-full px-3 py-1 ${totalRemaining > 0
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {totalRemaining}
                                        </span>
                                    </td>
                                    <td className="hidden md:table-cell"></td>
                                    <td className="hidden lg:table-cell"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Authorization Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">Prepared By</h4>
                        <div className="mt-8 pt-2 border-t border-gray-300">
                            <p className="text-sm text-gray-500">Signature:</p>
                            <div className="mt-6 h-0.5 bg-gray-200 w-full"></div>
                            <p className="mt-2 text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">Verified By</h4>
                        <div className="mt-8 pt-2 border-t border-gray-300">
                            <p className="text-sm text-gray-500">Signature:</p>
                            <div className="mt-6 h-0.5 bg-gray-200 w-full"></div>
                            <p className="mt-2 text-sm text-gray-500">Date: ___________</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">Received By</h4>
                        <div className="mt-8 pt-2 border-t border-gray-300">
                            <p className="text-sm text-gray-500">Signature:</p>
                            <div className="mt-6 h-0.5 bg-gray-200 w-full"></div>
                            <p className="mt-2 text-sm text-gray-500">Date: ___________</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>{companyInfo.name} | {companyInfo.address} | {companyInfo.city}</p>
                    <p className="mt-1">{companyInfo.phone} | {companyInfo.email} | {companyInfo.website}</p>
                    <p className="mt-2">Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDCView;