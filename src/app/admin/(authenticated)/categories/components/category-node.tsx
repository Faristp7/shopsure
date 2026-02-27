import { Handle, Position } from '@xyflow/react';
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/category";

interface CategoryNodeProps {
    data: {
        category: Category;
        onEdit: (category: Category) => void;
    };
    isConnectable: boolean;
}

export function CategoryNode({ data, isConnectable }: CategoryNodeProps) {
    const { category, onEdit } = data;

    return (
        <div
            className="flex items-center p-3 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer w-[260px] relative group"
            onClick={() => onEdit(category)}
        >
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                className="w-3 h-3 bg-slate-300 border-2 border-white hover:bg-blue-500 hover:scale-125 transition-transform"
            />

            <div className="flex items-center gap-3 w-full">
                {category.imageUrl ? (
                    <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-medium">
                        No Img
                    </div>
                )}

                <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="font-semibold text-slate-800 text-sm truncate">{category.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge
                            variant={category.isActive ? "default" : "secondary"}
                            className="h-5 text-[10px] px-1.5 font-medium"
                        >
                            {category.isActive ? "Active" : "Hidden"}
                        </Badge>
                        <span className="text-[10px] text-slate-400 flex-1 truncate">
                            ID: {category.id.substring(0, 8)}
                        </span>
                    </div>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                className="w-3 h-3 bg-blue-500 border-2 border-white hover:scale-125 transition-transform opacity-0 group-hover:opacity-100"
            />
        </div>
    );
}
