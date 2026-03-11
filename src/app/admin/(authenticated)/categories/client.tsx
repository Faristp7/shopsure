'use client';

import { useState, useCallback, useMemo, useEffect } from "react";
import { Category } from "@/types/category";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2, LayoutGrid } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { CategoryNode } from "./components/category-node";
import { CategorySheet } from "./components/category-sheet";
import { adminCategoryService } from "@/services/admin-category";
import { isAxiosError } from "axios";

import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    MarkerType,
    Position,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

const nodeTypes = {
    category: CategoryNode,
};

const NODE_WIDTH = 260;
const NODE_HEIGHT = 80;

/* ------------------------------------------------------------------ */
/* Constants */
/* ------------------------------------------------------------------ */

const ROOT_NODE_ID = 'root';

/* ------------------------------------------------------------------ */
/* Root Node */
/* ------------------------------------------------------------------ */

const startNode: Node = {
    id: ROOT_NODE_ID,
    type: 'start',
    position: { x: 0, y: 0 },
    data: { label: 'All Categories' },
    draggable: false,
    deletable: false,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === 'LR';
    g.setGraph({
        rankdir: direction,
        nodesep: 40,
        ranksep: 80,
        marginx: 20,
        marginy: 20,
    });

    nodes.forEach((node) => {
        g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    edges.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    const layoutedNodes = nodes.map((node) => {
        const pos = g.node(node.id);
        return {
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            // Shift dagre center-anchor to React Flow top-left anchor
            position: {
                x: pos.x - NODE_WIDTH / 2,
                y: pos.y - NODE_HEIGHT / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

export default function CategoriesClient() {

    /* ------------------------ Search ------------------------ */
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    /* ------------------------ Flow State ------------------------ */
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([startNode]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [layoutDirection, setLayoutDirection] = useState<'TB' | 'LR'>('TB');

    /* ------------------------ Side Sheet ------------------------ */
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    /* ------------------------ Fetch Categories ------------------------ */
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await adminCategoryService.getCategories({
                limit: 100,
                rootsOnly: false,
                isActive: true,
                sortBy: 'sortOrder',
                sortDirection: 'asc'
            }); // Fetching all for the tree visually
            setCategories(response.items || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            toast.error("Failed to load categories.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const filteredCategories = useMemo(() => {
        if (!debouncedSearch) return categories;
        return categories.filter(c => c.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }, [categories, debouncedSearch]);

    /* ------------------------ Update Parent ------------------------ */
    const onUpdateParent = useCallback(async (id: string, parentId?: string) => {
        // Optimistic update
        const previousCategories = [...categories];
        setCategories((prev) =>
            prev.map(c => (c.id === id ? { ...c, parentId: parentId || null } : c))
        );

        try {
            await adminCategoryService.updateCategory(id, { parentId: parentId || null });
            toast.success('Category hierarchy updated');
        } catch (error) {
            console.error("Failed to update hierarchy", error);
            toast.error("Failed to update hierarchy. Reverting.");
            setCategories(previousCategories);
        }
    }, [categories]);

    /* ------------------------ Save Category ------------------------ */
    const onSaveCategory = useCallback(async (categoryData: Partial<Category>) => {
        try {
            if (categoryData.id && categoryData.id !== 'new') {
                const updatedCategory = await adminCategoryService.updateCategory(categoryData.id, categoryData);
                setCategories((prev) =>
                    prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
                );
                toast.success('Category updated successfully');
                return true;
            } else {
                const newCategoryData = {
                    name: categoryData.name!,
                    description: categoryData.description || '',
                    slug: categoryData.slug || '',
                    isActive: categoryData.isActive ?? true,
                    imageUrl: categoryData.imageUrl || '',
                    sortOrder: categoryData.sortOrder || 0,
                    metadata: categoryData.metadata,
                    parentId: categoryData.parentId || null,
                };

                const newCategory = await adminCategoryService.createCategory(newCategoryData);
                setCategories((prev) => [...prev, newCategory]);
                toast.success('Category created successfully');
                return true;
            }
        } catch (error) {
            console.error("Error saving category", error);
            if (isAxiosError(error)) {
                const message = error.response?.data?.message || error.response?.data?.error || "Validation failed";
                toast.error(message);
            } else {
                toast.error("Failed to save category. Please try again.");
            }
            return false;
        }
    }, []);

    /* ------------------------ Edit Category ------------------------ */
    const onEditCategory = useCallback((category: Category) => {
        setSelectedCategory(category);
        setIsSheetOpen(true);
    }, []);

    /* ------------------------ Create Category ------------------------ */
    const onCreateNew = useCallback((parentId?: string) => {
        setSelectedCategory({
            id: 'new',
            parentId,
        } as Category);
        setIsSheetOpen(true);
    }, []);

    /* ------------------------------------------------------------------ */
    /* Build Nodes + Edges from Backend */
    /* ------------------------------------------------------------------ */

    useEffect(() => {
        if (!filteredCategories) return;

        const categoryNodes: Node[] = filteredCategories.map((cat) => ({
            id: cat.id,
            type: 'category',
            position: { x: 0, y: 0 },
            data: {
                category: cat,
                onEdit: onEditCategory,
                onAddChild: () => onCreateNew(cat.id),
            },
        }));

        const categoryEdges: Edge[] = filteredCategories.map((cat) => ({
            id: `e-${cat.parentId ?? ROOT_NODE_ID}-${cat.id}`,
            source: cat.parentId ?? ROOT_NODE_ID,
            target: cat.id,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#94a3b8', strokeWidth: 2 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#94a3b8',
            },
        }));

        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements([startNode, ...categoryNodes], categoryEdges, layoutDirection);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [filteredCategories, onEditCategory, onCreateNew, setNodes, setEdges, layoutDirection]);

    /* ------------------------------------------------------------------ */
    /* Connect Existing Categories */
    /* ------------------------------------------------------------------ */

    const onConnect = useCallback(
        (params: Connection) => {
            if (!params.source || !params.target) return;
            if (params.source === params.target) return;
            if (params.target === ROOT_NODE_ID) return;

            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        type: 'smoothstep',
                        animated: true,
                        style: { stroke: '#3b82f6', strokeWidth: 2 },
                        markerEnd: { type: MarkerType.ArrowClosed },
                    },
                    eds
                )
            );

            onUpdateParent(
                params.target,
                params.source === ROOT_NODE_ID ? undefined : params.source
            );
        },
        [onUpdateParent]
    );

    /* ------------------------------------------------------------------ */
    /* Drag From Root → Create Category */
    /* ------------------------------------------------------------------ */

    const onConnectEnd = useCallback(
        (event: MouseEvent | TouchEvent, connectionState: any) => {
            if (!connectionState.isValid) {
                const target = event.target as HTMLElement;
                const targetIsPane = target?.classList?.contains('react-flow__pane');

                if (targetIsPane) {
                    const fromNodeId = connectionState.fromNode?.id;
                    const parentId = fromNodeId === ROOT_NODE_ID ? undefined : fromNodeId;
                    onCreateNew(parentId);
                }
            }
        },
        [onCreateNew]
    );

    /* ------------------------------------------------------------------ */
    /* UI */
    /* ------------------------------------------------------------------ */

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Category Tree</h2>
                    <p className="text-muted-foreground">
                        Drag categories to build hierarchy. Root represents all products.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLayoutDirection((d) => (d === 'TB' ? 'LR' : 'TB'))}
                        title={layoutDirection === 'TB' ? 'Switch to horizontal layout' : 'Switch to vertical layout'}
                    >
                        <LayoutGrid className="h-4 w-4 mr-1.5" />
                        {layoutDirection === 'TB' ? 'Vertical' : 'Horizontal'}
                    </Button>
                    <div className="relative w-[260px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* Flow */}
            <div className="flex-1 rounded-xl border bg-slate-50 shadow-inner overflow-hidden relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onConnectEnd={onConnectEnd}
                    nodeTypes={nodeTypes}
                    fitView
                    minZoom={0.2}
                    className="bg-slate-50"
                >
                    <Background gap={16} size={1} />
                    <Controls />
                    <MiniMap
                        nodeColor={() => '#cbd5e1'}
                        maskColor="rgba(248, 250, 252, 0.7)"
                    />
                </ReactFlow>
            </div>

            {/* Category Sheet */}
            <CategorySheet open={isSheetOpen} onOpenChange={setIsSheetOpen} category={selectedCategory} onSave={onSaveCategory} />
        </div>
    );
}
