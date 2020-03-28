
export default function (name: string | undefined): string {
  if (name === undefined) {
    return 'unknown';
  }

  if (name === 'python3' || name === 'python2') {
    return 'python';
  }

  return 'unknown';
}
