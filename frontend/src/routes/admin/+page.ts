import { pb } from "$lib/pb";

export async function load() {
  const settings = await pb
    .collection("Site_Settings")
    .getFirstListItem('key="main"');

  let items = [];
  try {
    items = await pb.collection("schedule").getFullList();
  } catch (e) {
    console.error("PB schedule error:", e);
    throw e;
  }

  return { settings, items };
}
