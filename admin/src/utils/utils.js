export const setImageQuality = (url = "", quality = 50) => {
  const parts = url.split("/");
  parts.splice(6, 0, `q_${quality}`); // Insert 'q_50' before the 7th part (v1696676279)
  const modifiedURL = parts.join("/");
  return modifiedURL;
};

export function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function replaceHyphens(str) {
  return str.split("-").join("_");
}
