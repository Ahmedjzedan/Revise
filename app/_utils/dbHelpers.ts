// app/utils/dbHelpers.ts
"use server"; // This file contains server-side database helper functions

import { db } from "../_db/index"; // ADJUST THIS PATH
import {
  users,
  pages,
  nodes,
  groupNodes,
  User,
  NewUser,
  Page,
  NewPage,
  Node,
  NewNode,
  GroupNode,
  NewGroupNode,
} from "../_db/schema"; 

import { eq, and, or, inArray, notInArray, sql } from "drizzle-orm";

type UpdateNodeData = Partial<Omit<Node, "id" | "createdAt">>;

/**
 * Fetches all top-level nodes (groups and standard) for a page
 * and eagerly loads the children for the group nodes.
 * @param pageId The ID of the page to fetch data for.
 * @returns A promise resolving to a structured object containing top-level standard nodes and groups with their children.
 */
export async function getPageDataEager(pageTitle: string) {
  try {
    // 1. Find the page ID from the provided page title
    const page = await db.query.pages.findFirst({
      where: (pages, { eq }) => eq(pages.title, pageTitle),
      columns: {
        id: true,
      },
    });

    // 2. If no page is found, return an empty structure
    if (!page) {
      console.warn(`Page with title "${pageTitle}" not found.`);
      return {
        topLevelStandardNodes: [],
        topLevelGroupsWithChildren: [],
      };
    }

    const pageId = page.id;

    // --- The rest of the logic remains the same, using the fetched pageId ---

    // Identify all node IDs that are children in any group on this page
    const childNodeIdsResult = await db
      .select({
        id: groupNodes.childrenNodeId,
      })
      .from(groupNodes)
      .innerJoin(nodes, eq(groupNodes.parentNodeId, nodes.id)) // Join to parent node to filter by page
      .where(eq(nodes.pageId, pageId));

    const childIds = childNodeIdsResult.map((row) => row.id);

    const nonChildCondition =
      childIds.length > 0 ? notInArray(nodes.id, childIds) : undefined;

    // Fetch top-level nodes (groups and standard) and eagerly load children for groups
    const topLevelNodes = await db.query.nodes.findMany({
      where: (nodes, { eq, and }) =>
        and(eq(nodes.pageId, pageId), nonChildCondition),
      with: {
        parentGroups: {
          with: {
            childrenNode: true,
          },
        },
      },
    });

    // Structure the data into top-level standard nodes and groups with children
    const structuredData: {
      topLevelStandardNodes: Node[];
      topLevelGroupsWithChildren: Array<Node & { children: Node[] }>;
    } = {
      topLevelStandardNodes: [],
      topLevelGroupsWithChildren: [],
    };

    for (const node of topLevelNodes) {
      if (node.group) {
        const children = Array.isArray(node.parentGroups)
          ? (node.parentGroups
              .map((rel) => rel.childrenNode)
              .filter(
                (child) => child !== null && child !== undefined,
              ) as Node[])
          : [];

        structuredData.topLevelGroupsWithChildren.push({
          ...node,
          children: children,
        });
      } else {
        structuredData.topLevelStandardNodes.push(node);
      }
    }

    return structuredData;
  } catch (error) {
    // Updated error log to be more specific
    console.error(
      `Error in getPageDataEager for page titled "${pageTitle}":`,
      error,
    );
    throw error;
  }
}
export async function getNonChildNodes(pageId: number): Promise<Node[]> {
  try {
    // Selecting all the children node IDs for the given page ID
    const childNodeIdsResult = await db
      .select({
        id: groupNodes.childrenNodeId,
      })
      .from(groupNodes)
      .innerJoin(nodes, eq(groupNodes.parentNodeId, nodes.id))
      .where(eq(nodes.pageId, pageId));

    const childIds = childNodeIdsResult.map((row) => row.id);

    const nonChildCondition =
      childIds.length > 0 ? notInArray(nodes.id, childIds) : undefined;

    const initialNodes: Node[] = await db.query.nodes.findMany({
      where: (nodes, { eq, and }) =>
        and(eq(nodes.pageId, pageId), nonChildCondition),
    });
    return initialNodes;
  } catch (error) {
    console.error(`Error fetching non-child nodes for page ${pageId}:`, error);
    throw error;
  }
}

export async function getChildrenForGroup(groupId: number): Promise<Node[]> {
  try {
    // Query the groupNodes table to find all relationships where this node is the parent.
    const groupRelationships = await db.query.groupNodes.findMany({
      where: (groupNodes, { eq }) => eq(groupNodes.parentNodeId, groupId),
      with: {
        childrenNode: true,
      },
    });

    const childNodes = groupRelationships.map(
      (relationship) => relationship.childrenNode,
    );
    return childNodes;
  } catch (error) {
    console.error(`Error fetching children for group ID ${groupId}:`, error);
    throw error;
  }
}

// UPDATED: userId type changed from String to string
export async function getPagesForUser(userId: string): Promise<Page[]> {
  try {
    const userPages: Page[] = await db.query.pages.findMany({
      where: (pages, { eq }) => eq(pages.userId, userId),
    });
    return userPages;
  } catch (error) {
    console.error(`Error fetching pages for user ID ${userId}:`, error);
    throw error;
  }
}
export async function deleteNode(nodeId: number): Promise<void> {
  await db.delete(nodes).where(eq(nodes.id, nodeId));
}

export async function deletePage(pageId: number): Promise<void> {
  await db.delete(pages).where(eq(pages.id, pageId));
}

// UPDATED: userId type changed from number to string
export async function addPage(
  userId: string,
  pageData: Omit<NewPage, "userId" | "createdAt" | "id">,
): Promise<number | bigint | undefined> {
  const result = await db.insert(pages).values({
    ...pageData,
    userId: userId,
  });
  return result.lastInsertRowid;
}

export async function addNode(
  pageId: number,
  nodeData: Omit<NewNode, "pageId" | "createdAt" | "id">,
): Promise<number | bigint | undefined> {
  const result = await db.insert(nodes).values({
    ...nodeData,
    pageId: pageId,
  });
  return result.lastInsertRowid;
}

export async function updateNode(
  nodeId: number,
  data: UpdateNodeData,
): Promise<void> {
  try {
    await db
      .update(nodes)
      .set(data) // Set the fields to update using the provided data object
      .where(eq(nodes.id, nodeId)); // Filter by the node ID
  } catch (error) {
    console.error(`Error updating node ID ${nodeId}:`, error);
    // Re-throw the error for handling in the calling code (e.g., Server Action)
    throw error;
  }
}
