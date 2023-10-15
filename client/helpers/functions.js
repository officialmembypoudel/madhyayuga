export const textTrimmer = (text, length) => {
  if (text.length > length) {
    return `${text.slice(0, length)}...`;
  } else if (!text) {
    return "Something Went Wrong...";
  } else {
    return text;
  }
};

export const getFirstName = (fullName) => {
  if (fullName) {
    const nameArray = fullName.split(" ");
    const firstName = nameArray[0];
    return firstName;
  } else {
    return "User";
  }
};

export const getCategoryName = (categories = [], id = "") => {
  if (id && categories.length) {
    return categories.filter((category) => category._id === id)[0].name;
  }
};

export const setImageQuality = (url = "", quality = 50) => {
  const parts = url.split("/");
  parts.splice(6, 0, `q_${quality}`); // Insert 'q_50' before the 7th part (v1696676279)
  const modifiedURL = parts.join("/");
  return modifiedURL;
};
