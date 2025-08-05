export const validateArray = (arr) => {
  
    for (const obj of arr) {
        for (const key in obj) {
          console.log(obj)
            if (obj[key] === undefined) {
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                throw new Error(`${name} ${formattedKey} is undefined`);
            }
        }
    }
}

const hasInvalidValues = (obj) =>
  Object.values(obj).some(
    (val) => val === undefined || (typeof val === 'number' && isNaN(val))
  );

export const getInvalidObjects = (nestedData) => {
  return Object.values(nestedData).flat().filter(hasInvalidValues);
};



export const validateSales = (arr) => {
  const totalErrors = [];

  for (const obj of arr) {
    const name = obj.SalesFlowRef;
    for (const key in obj) {
      if (obj[key] === undefined || obj[key] === "NaN" ) {
        console.log(false)
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        totalErrors.push({
          Invoice: name,
          key: formattedKey,
          error: `${name} ${formattedKey} is undefined`
        });
      }
    }
  }

  return totalErrors;
};

export const validateSalesData = (arr) => {
  const totalErrors = [];
  console.log(arr)

  for (const record of arr) {
    const invoiceRef = record.SalesFlowRef;

    for (const item of record.SalesData || record.PurchaseReturnData ) {
      const productName = item.product || 'Unknown Product';


      for (const key in item) {
        if (item[key] === undefined) {
          const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
          totalErrors.push({
            Invoice: invoiceRef,
            Product: productName,
            Key: formattedKey,
            Error: `${invoiceRef} - ${productName}: ${formattedKey} is undefined`
          });
        }
      }
    }
  }

  return totalErrors;
};
