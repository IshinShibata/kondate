export const useCounter = (initialValue: number) => {
  const count = ref(initialValue);
  const inc = () => (count.value += 1);
  const dec = () => (count.value -= 1);
  return { count, inc, dec };
}
