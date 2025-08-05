// import WFPUser from "src/models/wfpuser";
// import { IWFPUser } from "src/types/wfpuser.type";

// const migrateFromOldBase = async ({
//   email,
//   phone,
// }: {
//   email: string;
//   phone: string;
// }) => {
//   let userFromOldBase: IWFPUser;
//   try {
//     userFromOldBase = await WFPUser.findOne({ Email: email });
//     if (!userFromOldBase) {
//       userFromOldBase = await WFPUser.findOne({ Phone: phone });
//     }
//     if (!userFromOldBase) {
//       return null;
//     }
//     return userFromOldBase;
//   } catch (error) {
//     return null;
//   }
// };
// export { migrateFromOldBase };
