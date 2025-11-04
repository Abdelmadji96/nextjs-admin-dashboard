"use client";

import { useState } from "react";
import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { VerificationTable } from "@/components/Tables/verification-table";
import { IdentityDetailModal } from "@/components/Modals/identity-detail-modal";
import { User } from "@/types/api";

// Mock data based on real API structure - replace with real API calls
const mockIdentityRecords = [
  {
    id: "ID001",
    submissionDate: "2024-01-15",
    applicantName: "John Doe",
    documentType: "Identity Card",
    status: "pending" as const,
    priority: "high" as const,
    details: {
      email: "john.doe@email.com",
      identity_verification_state: "pending",
      phone: "+1234567890",
      user_type: "individual",
      verify_identity_form_filled: true,
    },
  },
  {
    id: "ID002",
    submissionDate: "2024-01-14",
    applicantName: "Jane Smith",
    documentType: "Passport",
    status: "under_review" as const,
    priority: "medium" as const,
    details: {
      email: "jane.smith@email.com",
      identity_verification_state: "under_review",
      phone: "+1234567891",
      user_type: "business",
      verify_identity_form_filled: true,
    },
  },
  {
    id: "ID003",
    submissionDate: "2024-01-13",
    applicantName: "Mike Johnson",
    documentType: "Driver's License",
    status: "approved" as const,
    priority: "low" as const,
    details: {
      email: "mike.johnson@email.com",
      identity_verification_state: "verified",
      phone: "+1234567892",
      user_type: "individual",
      verify_identity_form_filled: true,
    },
  },
  {
    id: "ID004",
    submissionDate: "2024-01-12",
    applicantName: "Sarah Wilson",
    documentType: "Identity Card",
    status: "rejected" as const,
    priority: "medium" as const,
    details: {
      email: "sarah.wilson@email.com",
      identity_verification_state: "rejected",
      phone: "+1234567893",
      user_type: "individual",
      verify_identity_form_filled: true,
    },
  },
  {
    id: "ID005",
    submissionDate: "2024-01-11",
    applicantName: "David Brown",
    documentType: "Passport",
    status: "pending" as const,
    priority: "high" as const,
    details: {
      email: "david.brown@email.com",
      identity_verification_state: "pending",
      phone: "+1234567894",
      user_type: "individual",
      verify_identity_form_filled: false,
    },
  },
];

export default function VerifyIdentityPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (recordId: string) => {
    const record = mockIdentityRecords.find(r => r.id === recordId);
    if (record?.details) {
      // Create a mock User object from the details
      const mockUser: User = {
        id: parseInt(recordId.replace('ID', '')),
        uuid: recordId,
        email: record.details.email,
        first_name: record.applicantName.split(' ')[0],
        last_name: record.applicantName.split(' ')[1] || '',
        user_type: record.details.user_type,
        phone: record.details.phone,
        marital_status: "single",
        gender: "male",
        birth_date: "1990-01-01",
        street: "123 Main St",
        personal_form_filled: true,
        identity_verification_state: record.details.identity_verification_state,
        city: {
          id: 1,
          name: "Sample City",
          ar_name: "مدينة عينة",
          province: {
            id: 1,
            name: "Sample Province",
            ar_name: "مقاطعة عينة",
          },
        },
        nationality: {
          id: "US",
          name: "United States",
          code: "US",
        },
        portfolio_url: "",
        linkedin_url: "",
        academic_bg_form_filled: true,
        experience_form_filled: true,
        skills_form_filled: true,
        verify_identity_form_filled: record.details.verify_identity_form_filled,
        verify_diploma_form_filled: false,
        years_of_experience: 5,
        profile_summary: "",
        has_driver_license: true,
        has_vehicle: false,
        cv: [],
        email_verified_at: "2024-01-01T00:00:00Z",
        completed_registration_at: "2024-01-01T00:00:00Z",
        completed_identity_at: record.submissionDate,
        completed_verification_at: "",
      };
      setSelectedUser(mockUser);
      setIsModalOpen(true);
    }
  };

  const handleApprove = (userId: number) => {
    console.log("Approve user:", userId);
    setIsModalOpen(false);
    // TODO: Implement actual approval logic
  };

  const handleReject = (userId: number) => {
    console.log("Reject user:", userId);
    setIsModalOpen(false);
    // TODO: Implement actual rejection logic
  };

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="Verify Identity" />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-foreground mb-2 text-2xl font-bold">
            Identity Verification
          </h1>
          <p className="text-muted-foreground">
            Review and verify identity documents submitted by users. All
            submissions require careful verification.
          </p>
        </div>

        <VerificationTable
          title="Identity Verification Requests"
          records={mockIdentityRecords}
          type="identity"
          onViewDetails={handleViewDetails}
        />
      </div>

      <IdentityDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
