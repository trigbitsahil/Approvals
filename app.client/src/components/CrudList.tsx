"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CrudDialog } from "./CrudDialog";
import { Trash2, Database, Sparkles } from "lucide-react";
import type { CrudConfig } from "@/types1/crud";

/* Guess the primary key: id → *ID → first string field */
/* Guess the primary key: id → *ID (case‑insensitive) */
const guessId = (item: Record<string, unknown>): string | undefined => {
  if (typeof item.id === "string" && item.id.trim()) return item.id.trim();

  const idLike = Object.keys(item).find(
    (k) =>
      /id$/i.test(k) &&
      typeof item[k] === "string" &&
      (item[k] as string).trim()
  );
  return idLike ? (item[idLike] as string).trim() : undefined;
};

export function CrudList<TCreate, TUpdate, TItem>({
  config,
}: {
  config: CrudConfig<TCreate, TUpdate, TItem>;
}) {
  const [items, setItems] = useState<TItem[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const refresh = () => config.getList().then(setItems);
  useEffect(() => {
    refresh();
  }, []);

  /* ----- helpers ----- */
  const getId = (item: any): string => {
    if (config.idKey) {
      return typeof config.idKey === "function"
        ? config.idKey(item)
        : item[config.idKey];
    }
    const id = guessId(item);
    if (!id) throw new Error("Cannot determine primary key");
    return id;
  };

  const handleSave = async (data: any) => {
    let id: string | undefined;
    try {
      id = getId(data);
    } catch {
      // This means it's a create operation (no ID yet)
    }

    if (id) {
      await config.update(data as TUpdate);
    } else {
      await config.create(data as TCreate);
    }

    refresh();
  };

  const handleDelete = async (item: any) => {
    const id = getId(item);
    setIsDeleting(id);
    try {
      await config.delete(id);
      refresh();
    } finally {
      setIsDeleting(null);
    }
  };

  /* ----- UI ----- */
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-xl border border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{config.title}</h1>
            <p className="text-sm">
              Manage your {config.title.toLowerCase()} efficiently
            </p>
          </div>
        </div>
        <CrudDialog<TCreate>
          title={`Add ${config.title}`}
          triggerLabel="Add New"
          fields={config.fields}
          initialValues={{}}
          onSubmit={handleSave}
          variant="add"
        />
      </div>

      {/* Card */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-0">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
                <Sparkles className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                No items yet
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                Get started by creating your first{" "}
                {config.title.slice(0, -1).toLowerCase()}
              </p>
              <CrudDialog<TCreate>
                title={`Add ${config.title.slice(0, -1)}`}
                triggerLabel="Create First Item"
                fields={config.fields}
                initialValues={{}}
                onSubmit={handleSave}
                variant="add"
              />
            </div>
          ) : (
            /* Table */
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {config.fields.map((f) => (
                      <TableHead key={f.name} className="font-semibold">
                        {f.label}
                      </TableHead>
                    ))}
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((item: any, idx) => {
                    const id = getId(item);
                    return (
                      <TableRow
                        key={id}
                        className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-slate-50/50 transition-all duration-200 group"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {config.fields.map((f, i) => (
                          <TableCell key={f.name} className="font-medium">
                            {i === 0 ? (
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                  {item[f.name]}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  #{id}
                                </Badge>
                              </div>
                            ) : (
                              <span>{item[f.name]}</span>
                            )}
                          </TableCell>
                        ))}

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <CrudDialog<TUpdate | TCreate>
                              title={`Edit ${config.title}`}
                              triggerLabel="Edit"
                              fields={config.fields}
                              initialValues={item}
                              onSubmit={handleSave}
                              variant="edit"
                            />

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item)}
                              disabled={isDeleting === id}
                              className="hover:text-red-700 cursor-pointer hover:border-red-300 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
