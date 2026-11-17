import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  columns?: string[];
  rows?: string[][];
  loading?: boolean;
}

export function DataTable({
  columns = [],
  rows = [],
  loading,
}: DataTableProps) {
  if (loading) {
    return (
      <Card className="my-3">
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-4 pb-3 border-b">
            <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
          </div>
          <div className="space-y-2 pt-1">
            <div className="h-8 bg-muted/60 animate-pulse rounded w-full" />
            <div className="h-8 bg-muted/40 animate-pulse rounded w-full" />
            <div className="h-8 bg-muted/20 animate-pulse rounded w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-3 overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rIdx) => (
              <TableRow key={rIdx}>
                {row.map((cell, cIdx) => (
                  <TableCell key={cIdx}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
