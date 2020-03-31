interface StringIndexSignature {
  [key: string]: any
}

function updateObjectWithProperty(arr: StringIndexSignature[],
  key: string, value: any, newObj: any) {
  const objWithProperty = arr.find((obj) => value === obj[key]);

  if (objWithProperty === undefined) {
    arr.push(newObj);
    return;
  }

  Object.keys(newObj).forEach((k) => {
    if (newObj[k] !== undefined) {
      objWithProperty[k] = newObj[k];
    }
  });
}

export default updateObjectWithProperty;
