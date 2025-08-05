import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import { ConvetDate } from '../Global/getDate';
import { createDataFunction } from '../../Api/CRUD Functions';
import { validateSales, validateSalesData } from '../Global/CheckUndefind';


const StockReplacementBullAdd = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const Customer = useSelector((state) => state.Client?.client)
  const location = useSelector((state) => state.Location.Location)
  const Store = useSelector((state) => state.Store.Store)
  const Products = useSelector((state) => state.Product.product);
  console.log(Customer)
  const navigate = useNavigate()
  const [hide, setHide] = useState(false)


  const downloadExcel = (data, filename = 'data.xlsx') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
  };




  const onSubmit = async () => {

    const mergedData = data.reduce((acc, entry) => {

      const key = entry.SalesFlowRef;
      if (!acc[key]) {
        acc[key] = {
          Customer: Customer.find((item) => item.SalesFlowRef == entry.Customer)?._id,
          SalesFlowRef: key,
          Store: Store.find((item) => item.StoreName == entry.Store)?._id,
          Location: location.find((item) => item.LocationName == entry.Location)?._id,
          ReplacementDate: ConvetDate(entry.Date),
          ReplacementData: [],
        };
      }
      acc[key].ReplacementData.push({
        id: Date.now() + Math.random(),
        productFrom: Products.find((item) => item.CodeRef == entry.Vendor + entry.DamgeSKU)?._id,
        productTo: Products.find((item) => item.CodeRef == entry.Vendor + entry.ReplaceSku)?._id,
        totalBoxesFrom: JSON.stringify(entry.SkuQtyReturn / Products.find((item) => item.CodeRef == entry.Vendor + entry.DamgeSKU)?.PcsinBox),
        totalBoxesTo: JSON.stringify(entry.SkuQtyIssue / Products.find((item) => item.CodeRef == entry.Vendor + entry.ReplaceSku)?.PcsinBox),
        unitFrom: entry.SkuQtyReturn,
        unitTo: entry.SkuQtyIssue,
        ToValue: entry.TotalReturnedValue,
        fromValue: entry.TotalReturnedValue,
        Reason: entry.Reason
      });
      return acc;
    }, {});
    const result = Object.values(mergedData);
    console.log(result)
    const rus = validateSales(result)
    console.log(result)
    if (rus.length !== 0) {
      toast.error('Some Error found Excal file Has been download')
      downloadExcel(rus)

    } else {
      const result1 = result.filter(obj =>
        Object.values(obj).some(value => value === undefined) ||
        (Array.isArray(obj.ReplacementData) &&
          obj.ReplacementData.some(innerObj =>
            Object.values(innerObj).some(value1 => value1 === undefined)
          )
        )
      )
console.log(result1)
      const postInChunks = async (data, chunkSize = 10) => {
        console.log(data)

        const chunks = [];
        for (let i = 0; i < data.length; i += chunkSize) {
          chunks.push(data.slice(i, i + chunkSize));
        }

        try {
          for (const chunk of chunks) {
            const res = await createDataFunction("/StockReplacement/PushinBulk", { replacements: chunk });
            console.log(res)
          }
          toast.success("All data added successfully");
          setTimeout(() => navigate('/StockReplacement'), 3000);
        } catch (err) {
          console.error("Error in chunk:", err);
          toast.error("Partial data added - some chunks failed");
        }
      };
      if (result1.length === 0) {
        postInChunks(result)

      } else {
        toast.error("some error forund excal dowmloaded")
         return downloadExcel(result1)
      }
    }
  }




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

export default StockReplacementBullAdd