import PocketBase from "pocketbase";

export const pb = new PocketBase("https://admin.lemoulinwindsor.ca");

export const url = "https://admin.lemoulinwindsor.ca";

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