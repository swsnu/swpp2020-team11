export function endsWithAny(suffixes, string) {
  for (const suffix of suffixes) {
    if (string.endsWith(suffix)) {
      return true;
    }
  }
  return false;
}
