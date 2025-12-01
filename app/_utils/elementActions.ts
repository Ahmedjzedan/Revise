"use server";

import { db } from "@/app/_db";
import { nodes } from "@/app/_db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function addNodeAction(pageId: number, title: string, maxFullness: number = 5, parentId?: number) {
  try {
    await db.insert(nodes).values({
      pageId,
      title,
      maxfullness: maxFullness,
      fullness: 0,
      parentId,
    });
    revalidateTag(`nodes-${pageId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding node:", error);
    return { error: "Failed to add node" };
  }
}

export async function updateNodeAction(nodeId: number, data: { title?: string; content?: string; fullness?: number; maxfullness?: number }) {
  try {
    const result = await db.update(nodes)
      .set(data)
      .where(eq(nodes.id, nodeId))
      .returning({ pageId: nodes.pageId });
    
    if (result[0]) {
      revalidateTag(`nodes-${result[0].pageId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating node:", error);
    return { error: "Failed to update node" };
  }
}

export async function deleteNodeAction(nodeId: number) {
  try {
    const result = await db.delete(nodes)
      .where(eq(nodes.id, nodeId))
      .returning({ pageId: nodes.pageId });

    if (result[0]) {
      revalidateTag(`nodes-${result[0].pageId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting node:", error);
    return { error: "Failed to delete node" };
  }
}

export async function moveNodeAction(nodeId: number, direction: "up" | "down", pageId: number) {
  try {
    const node = await db.query.nodes.findFirst({
      where: eq(nodes.id, nodeId),
    });

    if (!node) return { error: "Node not found" };

    const currentPosition = node.position || 0;
    
    // Find adjacent node
    const adjacentNode = await db.query.nodes.findFirst({
      where: (nodes, { eq, and, gt, lt }) => 
        and(
          eq(nodes.pageId, pageId),
          direction === "up" 
            ? lt(nodes.position, currentPosition) 
            : gt(nodes.position, currentPosition)
        ),
      orderBy: (nodes, { asc, desc }) => [direction === "up" ? desc(nodes.position) : asc(nodes.position)],
    });

    if (adjacentNode) {
      await db.transaction(async (tx) => {
        await tx.update(nodes)
          .set({ position: currentPosition })
          .where(eq(nodes.id, adjacentNode.id));
        
        await tx.update(nodes)
          .set({ position: adjacentNode.position || 0 })
          .where(eq(nodes.id, nodeId));
      });
      revalidateTag(`nodes-${pageId}`);
    } else {
      return { success: false, message: "Cannot move further" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error moving node:", error);
    return { error: "Failed to move node" };
  }
}

export async function updateNodeFullnessAction(nodeId: number, newFullness: number) {
  try {
    const result = await db.update(nodes)
      .set({ fullness: newFullness })
      .where(eq(nodes.id, nodeId))
      .returning({ pageId: nodes.pageId });

    if (result[0]) {
      revalidateTag(`nodes-${result[0].pageId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating node fullness:", error);
    return { error: "Failed to update node fullness" };
  }
}

export async function reorderNodesAction(updates: { id: number; position: number }[]) {
  try {
    let pageId: number | null = null;
    for (const update of updates) {
      const result = await db
        .update(nodes)
        .set({ position: update.position })
        .where(eq(nodes.id, update.id))
        .returning({ pageId: nodes.pageId });
      
      if (result[0]) {
        pageId = result[0].pageId;
      }
    }
    if (pageId) {
      revalidateTag(`nodes-${pageId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error reordering nodes:", error);
    throw new Error("Failed to reorder nodes");
  }
}

export async function toggleNodeCompletion(nodeId: number, completed: boolean) {
  try {
    const updateData: { completed: boolean; completedAt: Date | null; fullness?: number } = { 
      completed, 
      completedAt: completed ? new Date() : null 
    };

    if (!completed) {
      updateData.fullness = 0;
    }

    const result = await db.update(nodes)
      .set(updateData)
      .where(eq(nodes.id, nodeId))
      .returning({ pageId: nodes.pageId });

    if (result[0]) {
      revalidateTag(`nodes-${result[0].pageId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error toggling node completion:", error);
    return { error: "Failed to toggle completion" };
  }
}
