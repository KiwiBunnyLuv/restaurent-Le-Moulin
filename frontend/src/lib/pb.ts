import PocketBase from "pocketbase";
import { PUBLIC_POCKETBASE_URL } from "$env/static/public";

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

export const url = PUBLIC_POCKETBASE_URL;
//admin.lemoulinwindsor.ca
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