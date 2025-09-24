// store.ts
import { atom } from "recoil";

export const textState = atom({
  key: "textState", // unique ID
  default: {message:""}, // initial value
});
