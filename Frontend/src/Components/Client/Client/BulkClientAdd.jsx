import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { generateNextCodeForCat } from '../../Global/GenrateCode';
import { toast, ToastContainer } from 'react-toastify';
import { createDataFunction } from '../../../Api/CRUD Functions';
import { ConvetDate } from '../../Global/getDate';

const BulkClientAdd = () => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const navigate = useNavigate()
    const [hide, setHide] = useState(false)
    const Vendor = useSelector((state) => state.Vendor.state)
    const Channel = useSelector((state) => state.Channel.channel)
    const SubChannel = useSelector((state) => state.subChannel.subChannel)
    const ChannelType = useSelector((state) => state.ChannelType.channelType)
    const Region = useSelector((state) => state.Region.Region)
    const Terrotory = useSelector((state) => state.Terrotory.Terrotory)
    console.log(Region , Terrotory)

    const onSubmit = async () => {
        
        const Values = data.map((item, index) => ({
            CutomerName: item.StoreName,
            phone: item.phone,
            email: item.email,
            SalesFlowRef: item.SalesFlowRef,
            Address: item.Address,
            NTN: item.NTN,
            STN: item.STN,
            Fax: item.Fax,
            WebSite: item.WebSite,
            ShopOwner: item.ShopOwner,
            ShopRegisterDate: ConvetDate(item.ShopRegisterDate),
            Vendor: Vendor.find((item1) => item1.salesFlowRef == item.Vendor)?._id,
            ChannelType: ChannelType.find((item1)=> item1.ChanneTypeName == item.ChannelType)?._id,
            Chanel: Channel.find((item1) => item1.ChanneName === item.ChannelName)?._id,
            SubChannel: SubChannel.find((item1) => item1.SubChanneName == item.SubChannelName)?._id,
            Region : `${Region.find((Region)=>Region.RegionName == item.Region)?._id}`,
            Terrotory : Terrotory.find((item1) => item1.TerrotoryName == item.Territory)?._id,
            AdvanceTaxApply: item.AdvanceTaxApply == "Yes" ? "1" : "2",
            Filler: item.Filler == "Filer" ? "1" : "2",
            Registered: item.Registered == "Registered" ? "1" : "2",
            TTS: item.TTS,
            TradeActivity: item.TradeActivity,
            VDS: item.VDS,
            Tradeoffer: item.Tradeoffer,
            JBP: item.JBP,
            OwnerCnic: item.OwnerCnic,
            Status: item.Status == "Active" ? "1" : "2", 
            mastercode :Vendor.find((item1) => item1.salesFlowRef == item.Vendor)?.code,

        }));
        
        const postInChunks = async (data, chunkSize = 20) => {
            console.log(data)

            const chunks = [];
            for (let i = 0; i < data.length; i += chunkSize) {
                chunks.push(data.slice(i, i + chunkSize));
            }

            try {
                for (const chunk of chunks) {
                    await createDataFunction("/customer/AddinBulk", chunk);
                }
                toast.success("All data added successfully");
                setTimeout(() => navigate('/ClientList'), 2000);
            } catch (err) {
                console.error("Error in chunk:", err);
                toast.error("Partial data added - some chunks failed");
            }
        };
       postInChunks(Values)
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



            
            <br />
            {hide && <input type="submit" onClick={onSubmit} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5' />}
        </div>
    )
}

export default BulkClientAdd