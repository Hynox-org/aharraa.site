import { create } from "zustand";
import {
  Store,
} from "./types";

export const useStore = create<Store>((set) => ({
  returnUrl: "/",
  setReturnUrl: (url: string | null) => set({ returnUrl: url }),
}));
