// const axiosLocation = axios.create({
//   baseURL: 'https://provinces.open-api.vn/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
const axiosLocation = axios.create({
  baseURL: 'https://api.mysupership.vn/v1/partner/areas',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add a response interceptor
axiosLocation.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

// province;
// ward;
// district;

const locationApi = {
  getProvince() {
    const url = `/province`;
    return axiosLocation.get(url);
  },
  getDistrict(provinceValue) {
    const url = `/district?province=${provinceValue}`;
    return axiosLocation.get(url);
  },
  getWard(districtValue) {
    const url = `/commune?district=${districtValue}`;
    return axiosLocation.get(url);
  },
};
export default locationApi;
