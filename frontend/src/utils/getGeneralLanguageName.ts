export default function (name?: string): string {
  if (!name) {
    return 'unknown';
  }

  if (['c++', 'c', 'pascal'].includes(name)) {
    return name;
  }

  if (name === 'python3' || name === 'python2') {
    return 'python';
  }

  return 'unknown';
}
