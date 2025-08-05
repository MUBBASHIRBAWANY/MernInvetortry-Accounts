import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ChartofAccountsTreeView = () => {
  const accounts = useSelector((state) => state.ChartofAccounts.ChartofAccounts);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    if (accounts?.length) {
      setTreeData(buildTree(accounts));
    }
  }, [accounts]);

  const buildTree = (data) => {
    const map = {};
    const tree = [];

    // Create mapping for all nodes
    data.forEach(item => {
      map[item._id] = { ...item, children: [] };
    });

    // Build hierarchy
    data.forEach(item => {
      const stage = parseInt(item.Stage);
      if (stage === 1) {
        tree.push(map[item._id]);
      } else {
        const parentKey = `Stage${stage - 1}`;
        const parentId = item[parentKey];
        
        if (parentId && map[parentId]) {
          map[parentId].children.push(map[item._id]);
        }
      }
    });

    return tree;
  };

  const TreeNode = ({ node }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = node.children?.length > 0;

    return (
      <li className="mb-2 pl-4 py-1 hover:bg-gray-50 rounded transition-colors">
        <div className="flex items-start">
          {hasChildren ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mr-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors text-blue-600 font-bold"
              aria-label={`Toggle ${node.AccountName}`}
            >
              {expanded ? '−' : '+'}
            </button>
          ) : (
            <span className="mr-2 w-6 inline-block">•</span>
          )}
          
          <div className="flex-1">
            <span 
              className="text-gray-800 font-medium hover:text-blue-700 cursor-pointer text-base"
              onClick={() => hasChildren && setExpanded(!expanded)}
            >
              {node.AccountName}
              <span className="text-gray-500 text-sm ml-2 font-normal">
                ({node.AccountCode})
              </span>
            </span>
            
            {expanded && hasChildren && (
              <ul className="mt-2 ml-2 pl-4 border-l-2 border-gray-200">
                {node.children.map(child => (
                  <TreeNode key={child._id} node={child} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Chart of Accounts
          </h1>
          <p className="text-gray-600">
            Hierarchical view of your accounting structure
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Account Tree View
            </h2>
          </div>
          
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {treeData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                No chart of accounts data available
              </div>
            ) : (
              <ul className="space-y-1">
                {treeData.map(node => (
                  <TreeNode key={node._id} node={node} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartofAccountsTreeView;