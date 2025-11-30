// app/utils/authHelpers.ts
"use server";

import { db } from "../_db/index"; // Make sure this path is correct
import { users, NewUser, User } from "../_db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto"; // Built-in Node.js module for UUIDs

/**
 * Creates a new user in the database with a securely hashed password.
 * Checks if a user with the same name already exists.
 * @param credentials An object containing the user's name and plaintext password.
 * @returns The newly created user object on success, or an object with an error message on failure.
 */
export async function getUserNameById(userId: string): Promise<string | null> {
  try {
    const id = Number(userId);
    if (isNaN(id)) return null;

    const result = await db
      .select({
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, id));

    // If a user was found, the result array will have one item
    if (result.length > 0) {
      return result[0].name;
    }

    // If no user was found, return null
    return null;
  } catch (error) {
    console.error(`Error fetching user name for ID ${userId}:`, error);
    // In case of a database error, it's safer to return null
    return null;
  }
}
