'use client';

import { useState, useCallback, useMemo, useEffect } from "react";
import { Category } from "@/types/category";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { CategoryNode } from "./components/category-node";
import { CategorySheet } from "./components/category-sheet";

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

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 260;
const nodeHeight = 80;

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
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2 + (Math.random() * 0.01), // Slight randomness to prevent React Flow jitter
        };

        return node;
    });

    return { nodes, edges };
};

export default function CategoriesClient() {

    /* ------------------------ Search ------------------------ */
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    /* ------------------------ Flow State ------------------------ */
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([startNode]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    /* ------------------------ Side Sheet ------------------------ */
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    /* ------------------------ Fetch Categories ------------------------ */
    const [categories, setCategories] = useState<Category[]>([
        { id: '1', name: 'Electronics', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', name: 'Computers', parentId: '1', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '3', name: 'Smartphones', parentId: '1', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '4', name: 'Laptops', parentId: '1', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '5', name: 'Clothing', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '6', name: 'Men', parentId: '5', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '7', name: 'Women', parentId: '5', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]);

    const filteredCategories = useMemo(() => {
        if (!debouncedSearch) return categories;
        return categories.filter(c => c.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }, [categories, debouncedSearch]);

    /* ------------------------ Update Parent ------------------------ */
    const onUpdateParent = useCallback((id: string, parentId?: string) => {
        setCategories((prev) =>
            prev.map(c => (c.id === id ? { ...c, parentId: parentId || null } : c))
        );
        toast.success('Category hierarchy updated');
    }, []);

    /* ------------------------ Save Category ------------------------ */
    const onSaveCategory = useCallback((categoryData: Partial<Category>) => {
        if (categoryData.id && categoryData.id !== 'new') {
            setCategories((prev) =>
                prev.map((c) => (c.id === categoryData.id ? { ...c, ...categoryData } as Category : c))
            );
            toast.success('Category updated successfully');
        } else {
            const newCategory: Category = {
                id: Math.random().toString(36).substr(2, 9),
                name: categoryData.name!,
                description: categoryData.description || '',
                slug: categoryData.slug || '',
                isActive: categoryData.isActive ?? true,
                parentId: categoryData.parentId || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setCategories((prev) => [...prev, newCategory]);
            toast.success('Category created successfully');
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
            animated: true,
            style: { stroke: '#94a3b8', strokeWidth: 2 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#94a3b8',
            },
        }));

        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements([startNode, ...categoryNodes], categoryEdges);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [filteredCategories, onEditCategory, onCreateNew, setNodes, setEdges]);

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

            {/* Flow */}
            <div className="flex-1 rounded-xl border bg-slate-50 shadow-inner overflow-hidden">
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
