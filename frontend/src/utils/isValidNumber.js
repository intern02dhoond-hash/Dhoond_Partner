export default const isValidNumber = (str) => {
  if (typeof str !== "string") return false; // Handle empty strings
  if (str.trim() === "") return true;
  return !isNaN(Number(str));
};
