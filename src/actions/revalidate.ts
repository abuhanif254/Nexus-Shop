"use server";

import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Revalidates a specific cache tag on-demand.
 * Used for Zero Waste ISR when content is updated from the CMS.
 */
export async function revalidateCacheTag(tag: string, profile: string = "default") {
  revalidateTag(tag, profile);
}

/**
 * Revalidates a specific path on-demand.
 * Used for Zero Waste ISR when content is updated from the CMS.
 */
export async function revalidateCachePath(path: string, type?: "page" | "layout") {
  if (type) {
    revalidatePath(path, type);
  } else {
    revalidatePath(path);
  }
}
