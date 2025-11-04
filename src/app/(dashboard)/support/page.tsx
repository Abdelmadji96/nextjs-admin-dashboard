"use client";

import { useState } from "react";
import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { VerificationTable } from "@/components/Tables/verification-table";
import { SupportDetailModal } from "@/components/Modals/support-detail-modal";

// Mock data - replace with real API calls
const mockSupportRecords = [
  {
    id: "SUP001",
    submissionDate: "2024-01-15",
    applicantName: "Helen Rodriguez",
    documentType: "Technical Issue",
    status: "pending" as const,
    priority: "high" as const,
    details: {
      email: "helen.rodriguez@email.com",
      phone: "+1234567890",
      issue_type: "Technical Issue",
      description: "Unable to upload identity documents. The system shows an error message when trying to submit files.",
      attachments: ["screenshot_error.png", "system_log.txt"],
      user_type: "individual",
    },
  },
  {
    id: "SUP002",
    submissionDate: "2024-01-14",
    applicantName: "Kevin Moore",
    documentType: "Account Problem",
    status: "under_review" as const,
    priority: "medium" as const,
    details: {
      email: "kevin.moore@business.com",
      phone: "+1234567891",
      issue_type: "Account Problem",
      description: "Cannot access my business account dashboard. Login credentials are correct but getting access denied.",
      attachments: ["login_attempt.png"],
      user_type: "business",
    },
  },
  {
    id: "SUP003",
    submissionDate: "2024-01-13",
    applicantName: "Nancy Clark",
    documentType: "Verification Help",
    status: "approved" as const,
    priority: "low" as const,
    details: {
      email: "nancy.clark@email.com",
      issue_type: "Verification Help",
      description: "Need assistance with diploma verification process. What documents are required?",
      attachments: [],
      user_type: "individual",
    },
  },
  {
    id: "SUP004",
    submissionDate: "2024-01-12",
    applicantName: "Steven Adams",
    documentType: "Document Issue",
    status: "rejected" as const,
    priority: "medium" as const,
    details: {
      email: "steven.adams@email.com",
      phone: "+1234567893",
      issue_type: "Document Issue",
      description: "My diploma verification was rejected. Need clarification on the rejection reason.",
      attachments: ["diploma_scan.pdf"],
      user_type: "individual",
    },
  },
  {
    id: "SUP005",
    submissionDate: "2024-01-11",
    applicantName: "Patricia Hall",
    documentType: "General Inquiry",
    status: "pending" as const,
    priority: "low" as const,
    details: {
      email: "patricia.hall@email.com",
      issue_type: "General Inquiry",
      description: "How long does the verification process typically take?",
      attachments: [],
      user_type: "individual",
    },
  },
  {
    id: "SUP006",
    submissionDate: "2024-01-10",
    applicantName: "Charles Young",
    documentType: "Technical Issue",
    status: "under_review" as const,
    priority: "high" as const,
    details: {
      email: "charles.young@email.com",
      phone: "+1234567895",
      issue_type: "Technical Issue",
      description: "Website is very slow and times out during document upload. This has been happening for 3 days.",
      attachments: ["network_test.png", "browser_console.txt"],
      user_type: "premium",
    },
  },
];

export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (recordId: string) => {
    const record = mockSupportRecords.find(r => r.id === recordId);
    if (record) {
      setSelectedTicket(record);
      setIsModalOpen(true);
    }
  };

  const handleResolve = (ticketId: string) => {
    console.log("Resolve ticket:", ticketId);
    setIsModalOpen(false);
    // TODO: Implement actual resolve logic
  };

  const handleEscalate = (ticketId: string) => {
    console.log("Escalate ticket:", ticketId);
    setIsModalOpen(false);
    // TODO: Implement actual escalation logic
  };

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="Support" />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-foreground mb-2 text-2xl font-bold">
            Support Management
          </h1>
          <p className="text-muted-foreground">
            Manage support tickets and user inquiries. Provide assistance and
            resolve user issues efficiently.
          </p>
        </div>

        <VerificationTable
          title="Support Tickets"
          records={mockSupportRecords}
          type="support"
          onViewDetails={handleViewDetails}
        />
      </div>

      <SupportDetailModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onResolve={handleResolve}
        onEscalate={handleEscalate}
      />
    </div>
  );
}
