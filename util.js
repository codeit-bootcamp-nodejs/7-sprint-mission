export const logAndThrow = (message, error) => {
  console.error(`Error fetching :${message}, error`);
  throw error;
};
