"use client";

export interface LocalPage {
  id: number;
  title: string;
  position: number;
  createdAt: number;
}

export interface LocalNode {
  id: number;
  pageId: number;
  title: string;
  fullness: number;
  maxfullness: number;
  position: number;
  content: string;
  parentId?: number;
  createdAt: number;
}

const PAGES_KEY = "revise_local_pages";
const NODES_KEY = "revise_local_nodes";

export const LocalDataManager = {
  getPages: (): LocalPage[] => {
    if (typeof window === "undefined") return [];
    const pages = localStorage.getItem(PAGES_KEY);
    return pages ? JSON.parse(pages) : [];
  },

  savePages: (pages: LocalPage[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
  },

  addPage: (title: string): LocalPage => {
    const pages = LocalDataManager.getPages();
    const newPage: LocalPage = {
      id: Date.now(),
      title,
      position: pages.length,
      createdAt: Date.now(),
    };
    pages.push(newPage);
    LocalDataManager.savePages(pages);
    return newPage;
  },

  updatePage: (id: number, data: Partial<LocalPage>) => {
    const pages = LocalDataManager.getPages();
    const index = pages.findIndex((p) => p.id === id);
    if (index !== -1) {
      pages[index] = { ...pages[index], ...data };
      LocalDataManager.savePages(pages);
    }
  },

  deletePage: (id: number) => {
    const pages = LocalDataManager.getPages();
    const newPages = pages.filter((p) => p.id !== id);
    LocalDataManager.savePages(newPages);
    
    // Also delete associated nodes
    const nodes = LocalDataManager.getAllNodes();
    const newNodes = nodes.filter((n) => n.pageId !== id);
    LocalDataManager.saveNodes(newNodes);
  },

  getAllNodes: (): LocalNode[] => {
    if (typeof window === "undefined") return [];
    const nodes = localStorage.getItem(NODES_KEY);
    return nodes ? JSON.parse(nodes) : [];
  },

  saveNodes: (nodes: LocalNode[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(NODES_KEY, JSON.stringify(nodes));
  },

  getNodes: (pageId: number): LocalNode[] => {
    const nodes = LocalDataManager.getAllNodes();
    return nodes.filter((n) => n.pageId === pageId).sort((a, b) => a.position - b.position);
  },

  addNode: (pageId: number, title: string, maxFullness: number = 5, parentId?: number): LocalNode => {
    const nodes = LocalDataManager.getAllNodes();
    const pageNodes = nodes.filter((n) => n.pageId === pageId);
    const newNode: LocalNode = {
      id: Date.now(),
      pageId,
      title,
      fullness: 0,
      maxfullness: maxFullness,
      position: pageNodes.length,
      content: "",
      parentId,
      createdAt: Date.now(),
    };
    nodes.push(newNode);
    LocalDataManager.saveNodes(nodes);
    return newNode;
  },

  updateNode: (id: number, data: Partial<LocalNode>) => {
    const nodes = LocalDataManager.getAllNodes();
    const index = nodes.findIndex((n) => n.id === id);
    if (index !== -1) {
      nodes[index] = { ...nodes[index], ...data };
      LocalDataManager.saveNodes(nodes);
    }
  },

  deleteNode: (id: number) => {
    const nodes = LocalDataManager.getAllNodes();
    const newNodes = nodes.filter((n) => n.id !== id);
    LocalDataManager.saveNodes(newNodes);
  },
  
  reorderPages: (newOrder: LocalPage[]) => {
    // Update positions based on index
    const updatedPages = newOrder.map((page, index) => ({
      ...page,
      position: index
    }));
    LocalDataManager.savePages(updatedPages);
  },
  
  reorderNodes: (newOrder: LocalNode[]) => {
     // This is tricky because we only have a subset of nodes (for one page).
     // We need to update the positions of these nodes in the main list.
     const allNodes = LocalDataManager.getAllNodes();
     const updatedNodes = allNodes.map(node => {
         const foundInNewOrder = newOrder.find(n => n.id === node.id);
         if (foundInNewOrder) {
             // Find index in newOrder to set position
             const index = newOrder.indexOf(foundInNewOrder);
             return { ...node, position: index };
         }
         return node;
     });
     LocalDataManager.saveNodes(updatedNodes);
  }
};
