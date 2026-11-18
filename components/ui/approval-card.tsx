import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface ApprovalCardProps {
  args: { to?: string; subject?: string; body?: string };
  onApprove: () => void;
  onDeny: () => void;
}

export function ApprovalCard({ args, onApprove, onDeny }: ApprovalCardProps) {
  return (
    <Card className="w-full max-w-md my-3 border-amber-500/50 bg-amber-500/5">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-amber-600 dark:text-amber-400">
          Approval Required: Send Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div><strong className="text-muted-foreground">To:</strong> {args.to}</div>
        <div><strong className="text-muted-foreground">Subject:</strong> {args.subject}</div>
        <div className="p-2 bg-muted/50 rounded-md whitespace-pre-wrap">{args.body}</div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <button
          onClick={onDeny}
          className="px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-muted"
        >
          Deny
        </button>
        <button
          onClick={onApprove}
          className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Approve & Send
        </button>
      </CardFooter>
    </Card>
  );
}