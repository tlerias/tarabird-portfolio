const SEQUENCE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export function createKonamiMatcher(): (key: string) => boolean {
  let index = 0;
  return (key: string) => {
    if (key === SEQUENCE[index]) {
      index++;
      if (index === SEQUENCE.length) {
        index = 0;
        return true;
      }
    } else {
      // Restart from this key if it could be the start
      index = key === SEQUENCE[0] ? 1 : 0;
    }
    return false;
  };
}
