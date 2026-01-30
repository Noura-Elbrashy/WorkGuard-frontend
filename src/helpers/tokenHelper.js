// // حفظ التوكن
// export const saveToken = (token) => {
//   localStorage.setItem("token", token);
// };

// // جلب التوكن
// export const getToken = () => {
//   return localStorage.getItem("token");
// };

// // حذف التوكن (عند تسجيل الخروج)
// export const removeToken = () => {
//   localStorage.removeItem("token");
// };


//src/helpers/tokenHelper.js
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// جلب التوكن
export const getToken = () => {
  return localStorage.getItem("token");
};

// حذف التوكن (عند تسجيل الخروج)
export const removeToken = () => {
  localStorage.removeItem("token");
};