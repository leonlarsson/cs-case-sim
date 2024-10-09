"use server";

import { cookies } from "next/headers";

// Gets or creates unboxerId cookie
// First checks if the unboxerId cookie is a valid UUID
// If it is, it returns the value
// If it isn't, it generates a new UUID and sets it as the unboxerId cookie
// Returns the new unboxerId
export const getOrCreateUnboxerIdCookie = async (): Promise<string> => {
  const existingUnboxerId = cookies().get("unboxerId");

  if (existingUnboxerId) {
    const isValidUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        existingUnboxerId.value,
      );
    if (isValidUUID) return existingUnboxerId.value;
  }

  const newUnboxerId = crypto.randomUUID();

  cookies().set("unboxerId", newUnboxerId, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    httpOnly: true,
  });

  return newUnboxerId;
};
