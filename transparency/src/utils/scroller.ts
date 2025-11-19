const wait = async (delay: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const startScrolling = async () => {
  let index = 0;
  const elements1 = Array.from(document.querySelectorAll('.top'));
  const elements2 = Array.from(document.querySelectorAll('h2'));
  const elements = [...elements1,... elements2];
  while (index < elements.length) {
    const element = elements[index];
    element?.scrollIntoView({ behavior: "smooth"})
    await wait(6000);
    index++
    if (index >= elements.length) {
      index = 0;
    }
  }
}
