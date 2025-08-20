// import type {
//   PaymentData,
//   RequestData,
//   ResponseData,
// } from "../types/data.types.js";

export const isTesterService = async (token: string): Promise<boolean> => {
  if (token === process.env.TEST_TOKEN) {
    return true;
  } else {
    return false;
  }
};

export default {
  isTesterService,
};
