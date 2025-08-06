export const generateNextCode = (lastCode, prefix, padLength = 6) => {
  const nextNumber = parseInt(lastCode, 10) + 1;
  const nextCode = nextNumber.toString().padStart(2, '0');
  return nextCode
}

export const generateNextCodeForCat = (code) => {
  console.log(code)
  const nextNumber = parseInt(code, 10) + 1;
  const nextCode = nextNumber.toString().padStart(2, '0');
  return nextCode
}

export const generateNextCodeForMsku = (code) => {
  console.log(code)
  const nextNumber = parseInt(code, 10) + 1;
  const nextCode = nextNumber.toString().padStart(3, '0');
  return nextCode
}

export const generateNextCodeForProduct = (code) => {
  console.log(code)
  const nextNumber = parseInt(code, 10) + 1;
  const nextCode = nextNumber.toString().padStart(4, '0');
  return nextCode
}

export const generateNextCodeForCustomer = (code) => {
  console.log(code)
  const nextNumber = parseInt(code, 10) + 1;
  const nextCode = nextNumber.toString().padStart(4, '0');
  return nextCode
}
export const generateNextCodeForOrder = (code) => {
  console.log(code)
  const nextNumber = parseInt(code, 10) + 1;
  const nextCode = nextNumber.toString().padStart(6, '0');
  return nextCode
}
export const rangeBetween = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}