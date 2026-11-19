import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/dataTable";
import { Streamdown } from "streamdown";

interface Widget {
  type: "stat" | "text" | "table" | "markdown";
  label?: string;
  value?: string;
  delta?: string;
  markdown?: string;
  columns?: string[];
  rows?: string[][];
}

interface DashboardCardProps {
  title?: string;
  widgets?: Widget[];
  loading?: boolean;
}

export function DashboardCard({
  title,
  widgets = [],
  loading,
}: DashboardCardProps) {
  if (loading && (!title || widgets.length === 0)) {
    return (
      <Card className="w-full my-3">
        <CardHeader>
          <Skeleton className="h-7 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full my-4 border bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">
          {title || "Generating Dashboard..."}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {widgets.map((widget, index) => {
            if (!widget) return null;

            switch (widget.type) {
              case "stat":
                return (
                  <div key={index} className="w-full">
                    <StatCard
                      label={widget.label}
                      value={widget.value}
                      delta={widget.delta}
                    />
                  </div>
                );

              case "table":
                return (
                  <div key={index} className="col-span-full">
                    <DataTable
                      columns={widget.columns || []}
                      rows={widget.rows || []}
                    />
                  </div>
                );

              case "text":
                return (
                  <Card key={index} className="col-span-full bg-muted/30">
                    <CardContent className="pt-6">
                      <Streamdown>{widget.markdown || ""}</Streamdown>
                    </CardContent>
                  </Card>
                );

              case "markdown":
                return (
                  <Card key={index} className="col-span-full bg-muted/30">
                    <CardContent className="pt-6">
                      <Streamdown>{widget.markdown || ""}</Streamdown>
                    </CardContent>
                  </Card>
                );

              default:
                return null;
            }
          })}
        </div>
      </CardContent>
    </Card>
  );
}
