function zip<T, K>(arr1: Array<T>, arr2: Array<K>) {
  return arr1.map((item, i) => [item, arr2[i]]);
}

export default zip;
