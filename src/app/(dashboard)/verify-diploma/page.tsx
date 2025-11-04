"use client";

import { useState } from "react";
import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { VerificationTable } from "@/components/Tables/verification-table";
import { DiplomaDetailModal } from "@/components/Modals/diploma-detail-modal";
import { Diploma, User } from "@/types/api";

// Mock data based on real API structure - replace with real API calls
const mockDiplomaRecords = [
  {
    id: "DIP001",
    submissionDate: "2024-01-15",
    applicantName: "Alice Johnson",
    documentType: "Bachelor's Degree",
    status: "pending" as const,
    priority: "medium" as const,
    details: {
      email: "alice.johnson@email.com",
      institution: "Harvard University",
      title: "Computer Science",
      modality: "on-campus",
      start_date: "2020-09-01",
      end_date: "2024-06-15",
      verification_status: "pending",
      is_current: false,
    }
  },
  {
    id: "DIP002",
    submissionDate: "2024-01-14",
    applicantName: "Bob Smith",
    documentType: "Master's Degree",
    status: "under_review" as const,
    priority: "high" as const,
    details: {
      email: "bob.smith@email.com",
      institution: "MIT",
      title: "Software Engineering",
      modality: "hybrid",
      start_date: "2022-09-01",
      end_date: "2024-06-15",
      verification_status: "under_review",
      is_current: false,
    }
  },
  {
    id: "DIP003",
    submissionDate: "2024-01-13",
    applicantName: "Carol White",
    documentType: "PhD Certificate",
    status: "approved" as const,
    priority: "low" as const,
    details: {
      email: "carol.white@email.com",
      institution: "Stanford University",
      title: "Data Science",
      modality: "on-campus",
      start_date: "2020-09-01",
      end_date: "2024-12-15",
      verification_status: "verified",
      is_current: true,
    }
  },
  {
    id: "DIP004",
    submissionDate: "2024-01-12",
    applicantName: "Daniel Green",
    documentType: "Associate Degree",
    status: "rejected" as const,
    priority: "medium" as const,
    details: {
      email: "daniel.green@email.com",
      institution: "Community College",
      title: "Business Administration",
      modality: "online",
      start_date: "2022-01-01",
      end_date: "2024-01-01",
      verification_status: "rejected",
      is_current: false,
    }
  },
  {
    id: "DIP005",
    submissionDate: "2024-01-11",
    applicantName: "Eva Davis",
    documentType: "Professional Certificate",
    status: "pending" as const,
    priority: "high" as const,
    details: {
      email: "eva.davis@email.com",
      institution: "Google Career Certificates",
      title: "UX Design",
      modality: "online",
      start_date: "2023-06-01",
      end_date: "2024-01-01",
      verification_status: "pending",
      is_current: false,
    }
  },
  {
    id: "DIP006",
    submissionDate: "2024-01-10",
    applicantName: "Frank Miller",
    documentType: "Bachelor's Degree",
    status: "under_review" as const,
    priority: "medium" as const,
    details: {
      email: "frank.miller@email.com",
      institution: "UC Berkeley",
      title: "Engineering",
      modality: "on-campus",
      start_date: "2019-09-01",
      end_date: "2023-06-15",
      verification_status: "under_review",
      is_current: false,
    }
  },
];

export default function VerifyDiplomaPage() {
  const [selectedDiploma, setSelectedDiploma] = useState<Diploma | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (recordId: string) => {
    const record = mockDiplomaRecords.find(r => r.id === recordId);
    if (record?.details) {
      // Create mock Diploma and User objects from the details
      const mockDiploma: Diploma = {
        id: parseInt(recordId.replace('DIP', '')),
        title: record.details.title,
        institution: record.details.institution,
        start_date: record.details.start_date,
        end_date: record.details.end_date,
        modality: record.details.modality,
        verification_status: record.details.verification_status,
        diploma_level: {
          id: 1,
          designation: record.documentType,
          diploma_type: {
            id: 1,
            designation: "Higher Education",
          },
        },
        description: `${record.documentType} in ${record.details.title}`,
        is_current: record.details.is_current,
      };

      const mockUser: User = {
        id: parseInt(recordId.replace('DIP', '')),
        uuid: recordId,
        email: record.details.email,
        first_name: record.applicantName.split(' ')[0],
        last_name: record.applicantName.split(' ')[1] || '',
        user_type: "individual",
        phone: "+1234567890",
        marital_status: "single",
        gender: "male",
        birth_date: "1990-01-01",
        street: "123 Main St",
        personal_form_filled: true,
        identity_verification_state: "verified",
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
        verify_identity_form_filled: true,
        verify_diploma_form_filled: true,
        years_of_experience: 5,
        profile_summary: "",
        has_driver_license: true,
        has_vehicle: false,
        cv: [],
        email_verified_at: "2024-01-01T00:00:00Z",
        completed_registration_at: "2024-01-01T00:00:00Z",
        completed_identity_at: "2024-01-01T00:00:00Z",
        completed_verification_at: "",
      };

      setSelectedDiploma(mockDiploma);
      setSelectedUser(mockUser);
      setIsModalOpen(true);
    }
  };

  const handleApprove = (diplomaId: number) => {
    console.log("Approve diploma:", diplomaId);
    setIsModalOpen(false);
    // TODO: Implement actual approval logic
  };

  const handleReject = (diplomaId: number) => {
    console.log("Reject diploma:", diplomaId);
    setIsModalOpen(false);
    // TODO: Implement actual rejection logic
  };

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="Verify Diploma" />
      
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Diploma Verification</h1>
          <p className="text-muted-foreground">
            Review and verify educational credentials and diplomas. Ensure authenticity and validity of submitted documents.
          </p>
        </div>

        <VerificationTable 
          title="Diploma Verification Requests"
          records={mockDiplomaRecords}
          type="diploma"
          onViewDetails={handleViewDetails}
        />
      </div>

      <DiplomaDetailModal
        diploma={selectedDiploma}
        user={selectedUser || undefined}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
