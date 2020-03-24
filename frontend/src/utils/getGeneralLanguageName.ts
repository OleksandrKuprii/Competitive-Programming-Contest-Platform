
export default function (name: string): string {
  if (name === 'python3' || name === 'python2') {
    return 'python';
  }

  return 'unknown';
}
