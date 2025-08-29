// app/utils/serverActions.ts
"use server"; // This directive marks the file as containing Server Actions

import { getChildrenForGroup } from "@/app/_utils/dbHelpers"; // Import the server function to fetch children
import { Node } from "@/app/_db/schema"; // Import the Node type
import { updateNode } from "@/app/_utils/dbHelpers"; // Import the function to update nodes

export async function updateNodeFullnessAction(
  nodeId: number,
  newFullness: number,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    console.log(
      `Server Action: Attempting to update fullness for node ID ${nodeId} to ${newFullness}`,
    );

    // Call the database helper function to perform the update
    // We only need to update the 'fullness' field
    await updateNode(nodeId, { fullness: newFullness });

    console.log(
      `Server Action: Fullness updated successfully for node ID ${nodeId}.`,
    );

    // Return success status
    return { success: true };
  } catch (error) {
    console.error(
      `Server Action: Error updating fullness for node ID ${nodeId}:`,
      error,
    );
    // Return an error status
    return { success: false, error: "Failed to update node fullness." };
  }
}
