import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import { ConvetDate } from '../../Components/Global/getDate';
import { createDataFunction } from '../../Api/CRUD Functions';
import { validateSales } from '../Global/CheckUndefind';

const OpeningInventoryBulkAdd = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const Products = useSelector((state) => state.Product.product);
  const Store = useSelector((state) => state.Store.Store);
  const Location = useSelector((state) => state.Location.Location);

  const navigate = useNavigate()
  const [hide, setHide] = useState(false)


  const downloadExcel = (data, filename = 'data.xlsx') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
  };

  const findVendor = (id) => {
    console.log(id)
    const ven = Vendor.find((item) => item.salesFlowRef == id)?._id
    return (ven)
  }

  const onSubmit = async () => {
    const CHUNK_SIZE = 100;

    const mergedData = data.reduce((acc, entry) => {
      const key = "data";
      if (!acc[key]) {
        acc[key] = {
          DateStart: ConvetDate(entry.StartDate),
          DateEnd: ConvetDate(entry.EndDate),
          InvoetoryData: []
        };
      }
      acc[key].InvoetoryData.push({
        id: Date.now() + Math.random(),
        product: Products.find((item) => item.CodeRef == entry.Vendor + entry.SKU)?._id,
        Location: Location.find((item) => item.LocationName == entry.Location)?._id,
        Store: Store.find((item) => item.StoreName == entry.Store)?._id,
        Type : entry.Type,
        opneingQty: !isNaN(entry.Boxes)
          ? entry.Boxes
          : !isNaN(entry.TotalUnit)
            ? ((entry.TotalUnit ?? 0) / (Products.find((item) => item.CodeRef === entry.Vendor + entry.SKU)?.PcsinBox ?? 1))
            : !isNaN(entry.Carton)
              ? ((entry.Carton ?? 0) / (Products.find((item) => item.CodeRef === entry.Vendor + entry.SKU)?.BoxinCarton ?? 1))
              : entry.Pcs,


        opneingQtyValueExclGst: !isNaN(entry.Boxes)
          ? entry.Boxes !== 0 ? entry.ValueExclGst / entry.Boxes : 0
          :!isNaN(entry.TotalUnit) ?
           (entry.TotalUnit !== 0 ? (entry.ValueExclGst / entry.TotalUnit *  Products.find((item) => item.CodeRef == entry.Vendor + entry.SKU)?.PcsinBox) : 0) 
           : !isNaN(entry.Carton) ?
           (entry.TotalUnit !== 0 ? (entry.ValueExclGst / entry.TotalUnit *  Products.find((item) => item.CodeRef == entry.Vendor + entry.SKU)?.BoxinCarton) : 0)
           : entry.Pcs !== 0 ? entry.ValueExclGst / entry.Pcs : 0,


        opneingQtyValueInclGst: !isNaN(entry.Boxes)
          ? entry.Boxes !== 0 ? entry.ValueInclGst / entry.Boxes : 0
          :!isNaN(entry.TotalUnit) ?
           (entry.TotalUnit !== 0 ? (entry.ValueInclGst / entry.TotalUnit *  Products.find((item) => item.CodeRef == entry.Vendor + entry.SKU)?.PcsinBox) : 0) 
           : !isNaN(entry.Carton) ?
           (entry.TotalUnit !== 0 ? (entry.ValueInclGst / entry.TotalUnit *  Products.find((item) => item.CodeRef == entry.Vendor + entry.SKU)?.BoxinCarton) : 0)
           : entry.Pcs !== 0 ? entry.ValueInclGst / entry.Pcs : 0,
      });
      return acc;
    }, {});
    console.log(mergedData.data)
    const rus = validateSales([mergedData.data]);
    if (rus.length !== 0) {
      toast.error('Some Error found. Excel file has been downloaded.');
      return downloadExcel(rus);
    }

    const OpeningDataValid = validateSales(mergedData.data.InvoetoryData);
    if (OpeningDataValid.length !== 0) {
      toast.error('Some Error found. Excel file has been downloaded.');
      return downloadExcel(OpeningDataValid);
    }

    // 🧠 Chunk the data
    const fullData = mergedData.data;
    const chunks = [];

    for (let i = 0; i < fullData.InvoetoryData.length; i += CHUNK_SIZE) {
      const chunk = {
        ...fullData,
        InvoetoryData: fullData.InvoetoryData.slice(i, i + CHUNK_SIZE),
      };
      chunks.push(chunk);
    }


    try {
      console.log(chunks)
      for (const chunk of chunks) {
        await createDataFunction("/Openinginventory", chunk);
      }
      toast.success("All data submitted successfully!");
      setTimeout(() => navigate('/OpeningInventory'), 2000);
    } catch (err) {
      toast.error("Something went wrong during upload.");
      console.error(err);
    }
  };





  const handleFileUpload = (e) => {
    setHide(true)
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Get the first worksheet
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Get headers if needed
      const firstRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];

      setData(jsonData);
      setHeaders(firstRow);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <ToastContainer />
      <h2>Upload Excel File</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />



      {data.length > 0 && (
        <div>
          <h3>Data:</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {headers.map((header, colIndex) => (
                      <td
                        key={colIndex}
                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-700"
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}
      <br />

      {hide && <input type="submit" onClick={onSubmit} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5' />}
    </div>
  )
}

export default OpeningInventoryBulkAdd