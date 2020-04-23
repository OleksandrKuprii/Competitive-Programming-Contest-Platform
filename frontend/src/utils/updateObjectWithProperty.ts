import shallowEqual from 'shallowequal';

interface StringIndexSignature {
  [key: string]: any;
}

function updateObjectWithProperty(
  arr: StringIndexSignature[],
  key: string,
  value: any,
  newObj: any,
  prepend?: boolean,
) {
  const objWithProperty = arr.find((obj) => shallowEqual(value, obj[key]));

  let changed = false;

  if (objWithProperty === undefined) {
    if (prepend) {
      arr.unshift(newObj);
      return changed;
    }

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
