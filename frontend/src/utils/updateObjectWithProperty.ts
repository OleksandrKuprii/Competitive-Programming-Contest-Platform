interface StringIndexSignature {
  [key: string]: any;
}

function updateObjectWithProperty(
  arr: StringIndexSignature[],
  key: string,
  value: any,
  newObj: any,
) {
  const objWithProperty = arr.find((obj) => value.toString() === obj[key].toString());

  let changed = false;

  if (objWithProperty === undefined) {
    arr.push(newObj);
    return changed;
  }

  Object.keys(newObj).forEach((k) => {
    if (newObj[k] !== undefined) {
      objWithProperty[k] = newObj[k];
      changed = true;
    }
  });

  return changed;
}

export default updateObjectWithProperty;
