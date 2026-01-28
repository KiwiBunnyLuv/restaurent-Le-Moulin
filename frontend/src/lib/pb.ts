import PocketBase from "pocketbase";

export const pb = new PocketBase(import.meta.env.VITE_PB_URL);

export interface SiteSettings {
  id: string;
  key: string;
  siteName: string;
  phone: string;
  email: string;
  address: string;
  logo?: string;
  social_instagram?: string;
}