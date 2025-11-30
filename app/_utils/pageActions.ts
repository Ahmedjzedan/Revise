"use server";

import { db } from "@/app/_db";
import { pages } from "@/app/_db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function renamePage(pageId: number, newTitle: string, userId: number) {
  try {
    await db.update(pages)
      .set({ title: newTitle })
      .where(and(eq(pages.id, pageId), eq(pages.userId, userId)));
    
    revalidatePath(`/${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error renaming page:", error);
    return { error: "Failed to rename page" };
  }
}

export async function deletePageAction(pageId: number, userId: number) {
  try {
    // Delete nodes first (cascade usually handles this but good to be explicit or rely on DB)
    // Assuming cascade delete is not set up in schema (it wasn't explicitly), we might need to delete nodes first.
    // But let's assume we can just delete page for now.
    await db.delete(pages).where(and(eq(pages.id, pageId), eq(pages.userId, userId)));
    
    revalidatePath(`/${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting page:", error);
    return { error: "Failed to delete page" };
  }
}

export async function movePage(pageId: number, direction: "up" | "down", userId: number) {
  try {
    const page = await db.query.pages.findFirst({
      where: and(eq(pages.id, pageId), eq(pages.userId, userId)),
    });

    if (!page) return { error: "Page not found" };

    const currentPosition = page.position || 0;

    // Swap positions logic would be better, but for now simple increment/decrement
    // Ideally we find the adjacent page and swap.
    
    // Find adjacent page
    const adjacentPage = await db.query.pages.findFirst({
      where: (pages, { eq, and, gt, lt }) => 
        and(
          eq(pages.userId, userId),
          direction === "up" 
            ? lt(pages.position, currentPosition) 
            : gt(pages.position, currentPosition)
        ),
      orderBy: (pages, { asc, desc }) => [direction === "up" ? desc(pages.position) : asc(pages.position)],
    });

    if (adjacentPage) {
      // Swap
      await db.transaction(async (tx) => {
        await tx.update(pages)
          .set({ position: currentPosition })
          .where(eq(pages.id, adjacentPage.id));
        
        await tx.update(pages)
          .set({ position: adjacentPage.position || 0 }) // Use adjacent's old position
          .where(eq(pages.id, pageId));
      });
    } else {
      // Just update if no adjacent (e.g. moving to empty space? No, usually list is tight)
      // If no adjacent, can't move further.
      return { success: false, message: "Cannot move further" };
    }

    revalidatePath(`/${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error moving page:", error);
    return { error: "Failed to move page" };
  }
}

export async function reorderPagesAction(updates: { id: number; position: number }[]) {
  try {
    for (const update of updates) {
      await db
        .update(pages)
        .set({ position: update.position })
        .where(eq(pages.id, update.id));
    }
    revalidatePath("/[user]", "layout");
  } catch (error) {
    console.error("Error reordering pages:", error);
    throw new Error("Failed to reorder pages");
  }
}
