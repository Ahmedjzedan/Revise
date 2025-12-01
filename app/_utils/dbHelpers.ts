// app/utils/dbHelpers.ts
"use server";

import { db } from "../_db/index";
import { pages, nodes, Page, NewPage } from "../_db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Fetches all pages for a user.
 * @param userId The ID of the user to fetch pages for.
 * @returns A promise resolving to an array of pages for the user.
 */
export async function getPagesForUser(userId: string): Promise<Page[]> {
  try {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
        return [];
    }
    const userPages = await db.query.pages.findMany({
      where: (pages, { eq }) => eq(pages.userId, numericUserId),
    });
    return userPages;
  } catch (error) {
    console.error(`Error fetching pages for user ID ${userId}:`, error);
    throw error;
  }
}

/**
 * Deletes a node by its ID.
 * @param nodeId The ID of the node to delete.
 */
export async function deleteNode(nodeId: number): Promise<void> {
  await db.delete(nodes).where(eq(nodes.id, nodeId));
}

/**
 * Deletes a page by its ID.
 * @param pageId The ID of the page to delete.
 */
export async function deletePage(pageId: number): Promise<void> {
  await db.delete(pages).where(eq(pages.id, pageId));
}

/**
 * Adds a new page for a user.
 * @param userId The ID of the user creating the page.
 * @param pageData The data for the new page.
 * @returns The ID of the newly created page.
 */
export async function addPage(
  userId: string,
  pageData: Omit<NewPage, "userId" | "createdAt" | "id">
): Promise<number | bigint | undefined> {
  const numericUserId = parseInt(userId, 10);
  if (isNaN(numericUserId)) {
      throw new Error("Invalid user ID");
  }

  const exists = await checkPageExists(pageData.title, userId);
  if (exists) {
    throw new Error("Page with this title already exists");
  }

  const result = await db.insert(pages).values({
    ...pageData,
    userId: numericUserId,
  });
  return result.lastInsertRowid;
}

/**
 * Checks if a page exists for a given user by page title.
 * @param pageTitle The title of the page to check.
 * @param userId The ID of the user.
 * @returns True if the page exists, false otherwise.
 */
export async function checkPageExists(
  pageTitle: string,
  userId: string
): Promise<boolean> {
  try {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
        return false;
    }
    const page = await db.query.pages.findFirst({
      where: and(eq(pages.title, pageTitle), eq(pages.userId, numericUserId)),
      columns: {
        id: true,
      },
    });
    return !!page;
  } catch (error) {
    console.error(
      `Error checking if page "${pageTitle}" exists for user ${userId}:`,
      error
    );
    throw error;
  }
}

import { unstable_cache } from "next/cache";

/**
 * Gets a page ID by title and user ID.
 * @param pageTitle The title of the page.
 * @param userId The ID of the user.
 * @returns The page ID or null if not found.
 */
export async function getPageId(
  pageTitle: string,
  userId: string
): Promise<number | null> {
  return unstable_cache(
    async () => {
      try {
        const numericUserId = parseInt(userId, 10);
        if (isNaN(numericUserId)) {
            return null;
        }
        const page = await db.query.pages.findFirst({
          where: and(eq(pages.title, pageTitle), eq(pages.userId, numericUserId)),
          columns: {
            id: true,
          },
        });
        return page ? page.id : null;
      } catch (error) {
        console.error(
          `Error getting page ID for "${pageTitle}" and user ${userId}:`,
          error
        );
        return null;
      }
    },
    [`page-id-${userId}-${pageTitle}`],
    { tags: [`page-id-${userId}-${pageTitle}`] }
  )();
}

/**
 * Fetches all nodes for a given page.
 * @param pageId The ID of the page to fetch nodes for.
 * @returns An array of nodes for the page or null if error occurs.
 */
export async function getNodes(pageId: number | string) {
  const numericPageId = Number(pageId);
  if (isNaN(numericPageId)) {
    console.log("Invalid page ID provided:", pageId);
    // throw new Error("Invalid page ID provided: "); // Don't throw inside cache, return null or empty
    return null;
  }

  return unstable_cache(
    async () => {
      try {
        const pageNodes = await db
          .select()
          .from(nodes)
          .where(eq(nodes.pageId, numericPageId));

        return pageNodes;
      } catch (error) {
        console.error("Error fetching nodes:", error);
        return null;
      }
    },
    [`nodes-${numericPageId}`],
    { tags: [`nodes-${numericPageId}`] }
  )();
}

/**
 * Adds a new node to a page.
 * @param pageId The ID of the page to add the node to.
 * @param nodeData The data for the new node.
 * @returns The newly created node.
 */
export async function addNode(pageId: number, nodeData: { title: string }) {
  try {
    const result = await db
      .insert(nodes)
      .values({
        title: nodeData.title,
        pageId: pageId,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Error adding node:", error);
    throw error;
  }
}

/**
 * Updates the fullness of a node.
 * @param nodeId The ID of the node to update.
 * @param newFullness The new fullness value.
 * @returns The updated node.
 */
export async function updateNodeFullness(nodeId: number, newFullness: number) {
  try {
    const result = await db
      .update(nodes)
      .set({ fullness: newFullness })
      .where(eq(nodes.id, nodeId))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Error updating node fullness:", error);
    throw error;
  }
}
