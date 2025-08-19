"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SupportTicket {
  id: string;
  submissionDate: string;
  applicantName: string;
  documentType: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  priority: "low" | "medium" | "high";
  details?: {
    email: string;
    phone?: string;
    issue_type: string;
    description: string;
    attachments?: string[];
    user_type?: string;
  };
}

interface SupportDetailModalProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve?: (ticketId: string) => void;
  onEscalate?: (ticketId: string) => void;
}

export function SupportDetailModal({
  ticket,
  isOpen,
  onClose,
  onResolve,
  onEscalate,
}: SupportDetailModalProps) {

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const getVariant = (status: string) => {
      const variants = {
        pending: "pending",
        approved: "approved",
        rejected: "rejected",
        under_review: "under-review",
        resolved: "success",
      };
      return variants[status as keyof typeof variants] || "secondary";
    };

    return (
      <Badge variant={getVariant(status) as any}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const getVariant = (priority: string) => {
      const variants = {
        low: "priority-low",
        medium: "priority-medium",
        high: "priority-high",
      };
      return variants[priority as keyof typeof variants] || "priority-low";
    };

    return (
      <Badge variant={getVariant(priority) as any}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {ticket ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Support Ticket Details
              </DialogTitle>
              <DialogDescription>
                Ticket ID: {ticket.id} • {ticket.documentType}
              </DialogDescription>
            </DialogHeader>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Ticket Overview */}
          <section>
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Ticket Overview
            </h3>
            <div className="bg-muted rounded-lg p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Submission Date
                  </label>
                  <p className="text-foreground font-medium">
                    {formatDate(ticket.submissionDate)}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Issue Type
                  </label>
                  <p className="text-foreground font-medium">{ticket.documentType}</p>
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Status
                  </label>
                  {getStatusBadge(ticket.status)}
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Priority
                  </label>
                  {getPriorityBadge(ticket.priority)}
                </div>
              </div>
            </div>
          </section>

          {/* Customer Information */}
          <section>
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-muted rounded-lg p-4">
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Customer Name
                </label>
                <p className="text-foreground font-medium">{ticket.applicantName}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Email Address
                </label>
                <p className="text-foreground font-medium">
                  {ticket.details?.email || "Not provided"}
                </p>
              </div>
              {ticket.details?.phone && (
                <div className="bg-muted rounded-lg p-4">
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Phone Number
                  </label>
                  <p className="text-foreground font-medium">{ticket.details.phone}</p>
                </div>
              )}
              {ticket.details?.user_type && (
                <div className="bg-muted rounded-lg p-4">
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    User Type
                  </label>
                  <p className="text-foreground font-medium capitalize">
                    {ticket.details.user_type}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Issue Details */}
          {ticket.details && (
            <section>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Issue Details
              </h3>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">
                    Issue Type
                  </label>
                  <p className="text-foreground font-medium">
                    {ticket.details.issue_type || ticket.documentType}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">
                    Description
                  </label>
                  <p className="text-foreground">
                    {ticket.details.description || "No description provided"}
                  </p>
                </div>

                {ticket.details.attachments && ticket.details.attachments.length > 0 && (
                  <div className="bg-muted rounded-lg p-4">
                    <label className="text-muted-foreground mb-2 block text-sm font-medium">
                      Attachments ({ticket.details.attachments.length})
                    </label>
                    <div className="space-y-2">
                      {ticket.details.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-3 bg-background rounded border p-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                            📎
                          </div>
                          <div className="flex-1">
                            <p className="text-foreground font-medium">
                              Attachment {index + 1}
                            </p>
                            <p className="text-muted-foreground text-sm">{attachment}</p>
                          </div>
                          <Button size="sm" className="bg-primary-button text-white">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Response History */}
          <section>
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Response History
            </h3>
            <div className="space-y-3">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    S
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-foreground font-medium">System</span>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(ticket.submissionDate)}
                      </span>
                    </div>
                    <p className="text-foreground text-sm">
                      Ticket created and assigned for review.
                    </p>
                  </div>
                </div>
              </div>

              {ticket.status === "under_review" && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-warning h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      A
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-foreground font-medium">Admin</span>
                        <span className="text-muted-foreground text-xs">
                          {formatDate(ticket.submissionDate)}
                        </span>
                      </div>
                      <p className="text-foreground text-sm">
                        Ticket is currently under review. Our team is investigating the issue.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Button variant="primary-button">
                Send Message
              </Button>
              <Button variant="outline">
                Request More Info
              </Button>
              <Button variant="warning">
                Escalate to Manager
              </Button>
              <Button variant="secondary">
                Assign to Specialist
              </Button>
            </div>
          </section>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {ticket.status === "pending" && onEscalate && (
            <Button
              variant="warning"
              onClick={() => onEscalate(ticket.id)}
            >
              Escalate
            </Button>
          )}
          {(ticket.status === "pending" || ticket.status === "under_review") && onResolve && (
            <Button
              variant="success"
              onClick={() => onResolve(ticket.id)}
            >
              Mark as Resolved
            </Button>
          )}
        </DialogFooter>
          </>
        ) : (
          <div className="p-6 text-center">
            <p>No ticket data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
