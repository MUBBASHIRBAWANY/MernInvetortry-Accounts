import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { getDataFundtion, updateDataFunction } from '../../../Api/CRUD Functions';
import ChartofAccountsTreeView from './ChartofAccountsView';

const ChartofAccountsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const Accounts = useSelector((state) => state.ChartofAccounts.ChartofAccounts);

  const [stage1, setStage1] = useState('');
  const [stage2, setStage2] = useState('');
  const [stage3, setStage3] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [defaultValues, setDefaultValues] = useState(null);
  console.log(stage2)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const stage = Number(watch("Stage", 1));

  useEffect(() => {
    const tree = buildTree(Accounts);
    setTreeData(tree);
  }, [Accounts]);

  useEffect(() => {

    try {
      const res = Accounts.find((item) => item._id == id)
      setDefaultValues(res);
      reset(res);
      // Set Select states for parent stages
      setStage1(res.Stage1)
      setStage2(res.Stage2)
      setStage3(res.Stage3)

    } catch {
      toast.error("Failed to load account data");
    }


  }, [id]);

  const buildTree = (data) => {
    const map = {};
    const tree = [];

    data.forEach(item => {
      map[item._id] = { ...item, children: [] };
    });

    data.forEach(item => {
      const stage = parseInt(item.Stage);
      if (stage === 1) {
        tree.push(map[item._id]);
      } else {
        const parentId = item[`Stage${stage - 1}`];
        if (parentId && map[parentId]) {
          map[parentId].children.push(map[item._id]);
        }
      }
    });

    return tree;
  };

  const stage1Accounts = Accounts.filter((item) => item.AccountCode.length === 1).map((Ac) => ({ label: Ac.AccountName, value: Ac._id }));
  const stage2Accounts = Accounts.filter((item) => item.AccountCode.length === 3).map((Ac) => ({ label: Ac.AccountName, value: Ac._id }));
  const stage3Accounts = Accounts.filter((item) => item.AccountCode.length === 5).map((Ac) => ({ label: Ac.AccountName, value: Ac._id }));

  const TreeNode = ({ node }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <li className="mb-2">
        <div className="flex items-center">
          {hasChildren && (
            <button onClick={() => setExpanded(!expanded)} className="mr-2 font-bold text-black">
              {expanded ? '−' : '+'}
            </button>
          )}
          <span className="text-black text-[18px] hover:underline cursor-pointer">
            {node.AccountName} <span className="text-sm text-gray-500">({node.AccountCode})</span>
          </span>
        </div>
        {expanded && hasChildren && (
          <ul className="ml-6 mt-1">
            {node.children.map(child => (
              <TreeNode key={child._id} node={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  const onSubmit = async (data) => {
    try {
      console.log(data)
      const res = await updateDataFunction(`/ChartofAccounts/updatChartofAccounts/${id}`, data);
      toast.success("Chart of Account updated successfully");
      navigate('/ChartofAccounts');
    } catch (err) {
      toast.error("Something went wrong while updating");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Chart of Accounts Edit</h1>
      <ToastContainer />
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Stage</label>
          <select disabled className="w-full bg-gray-200 px-4 py-2 border rounded-lg" {...register("Stage")}>
            <option value="1">Stage 1</option>
            <option value="2">Stage 2</option>
            <option value="3">Stage 3</option>
            <option value="4">Stage 4</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700  font-semibold mb-2">Account Code</label>
          <input type="text" {...register("AccountCode")} disabled className="w-full bg-gray-100 px-4 py-2 border rounded-lg" />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Account Name</label>
          <input type="text" {...register("AccountName")} className="w-full px-4 py-2 border rounded-lg" required />
        </div>

        {stage === 2 && (
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Stage 1</label>
            <Select isDisabled={true} value={stage1Accounts.find(opt => opt.value === stage1)} />
          </div>
        )}
        {stage === 3 && (
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Stage 2</label>
            <Select isDisabled={true} value={stage2Accounts.find(opt => opt.value === stage2)} />
          </div>
        )}
        {stage === 4 && (
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Stage 3</label>
            <Select isDisabled={true} value={stage3Accounts.find(opt => opt.value === stage3)} />
          </div>
        )}

        <div className="col-span-5 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Update Chart of Accounts
          </button>
        </div>
      </form>
      <ChartofAccountsTreeView />


    </div>
  );
};

export default ChartofAccountsEdit;
