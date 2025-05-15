import { create } from "zustand";

const useStore = create((set) => ({
  phoneNumber: '',
  loginInfo:null,
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setLoginInfo: (loginInfo) => set({ loginInfo }),
}));

export default useStore;