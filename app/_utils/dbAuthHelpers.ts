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
export async function createUser(
  credentials: Pick<NewUser, "name"> & { password: string }
): Promise<User | { error: string }> {
  try {
    // 1. Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.name, credentials.name),
    });

    if (existingUser) {
      return { error: "Username is already taken." };
    }

    // 2. Hash the password
    // The second argument is the "salt rounds", 10 is a good default
    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    // 3. Generate a UUID for the user ID, as per your schema
    const userId = randomUUID();

    const newUser: NewUser = {
      id: userId,
      name: credentials.name,
      password: hashedPassword,
      // createdAt is handled by the database default
    };

    // 4. Insert the new user and return the created record
    const result = await db.insert(users).values(newUser).returning();

    if (result.length === 0) {
      return { error: "Failed to create user." };
    }

    // Drizzle's .returning() gives an array, we want the first element
    return result[0];
  } catch (error) {
    console.error("Error in createUser:", error);
    return { error: "An unexpected error occurred." };
  }
}

/**
 * Validates a user's credentials against the database.
 * @param credentials An object containing the user's name and plaintext password.
 * @returns The full user object if validation is successful, otherwise null.
 */
export async function validateUser(
  credentials: Pick<NewUser, "name"> & { password: string }
): Promise<User | null> {
  try {
    // 1. Find the user by their name
    const user = await db.query.users.findFirst({
      where: eq(users.name, credentials.name),
    });

    // 2. If no user is found, validation fails
    if (!user) {
      return null;
    }

    // 3. Securely compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    // 4. If passwords match, return the user object. Otherwise, return null.
    return isPasswordValid ? user : null;
  } catch (error) {
    console.error("Error in validateUser:", error);
    // In case of a database error, we should not leak details
    return null;
  }
}
