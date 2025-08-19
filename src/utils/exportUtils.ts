import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { User } from "@/types/user";

export interface ExportUserData {
  name: string;
  email: string;
  phone: string;
  uuid: string;
  userType: string;
  city: string;
  nationality: string;
  registrationDate: string;
  emailVerified: string;
  identityVerified: string;
  cvCount: number;
}

// Transform user data for export
export const transformUserDataForExport = (users: User[]): ExportUserData[] => {
  return users.map((user) => ({
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    phone: user.phone || "Not provided",
    uuid: user.uuid,
    userType: user.user_type,
    city: user.city?.name || "Not provided",
    nationality: user.nationality?.name || "Not provided",
    registrationDate: user.completed_registration_at
      ? new Date(user.completed_registration_at).toLocaleDateString()
      : "Not provided",
    emailVerified: user.email_verified_at ? "Yes" : "No",
    identityVerified:
      user.identity_verification_state === "verified" ? "Yes" : "No",
    cvCount: user.cv?.length || 0,
  }));
};

// Export to Excel
export const exportToExcel = (
  users: User[],
  filename: string = "users_export",
) => {
  try {
    const exportData = transformUserDataForExport(users);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData, {
      header: [
        "name",
        "email",
        "phone",
        "uuid",
        "userType",
        "city",
        "nationality",
        "registrationDate",
        "emailVerified",
        "identityVerified",
        "cvCount",
      ],
    });

    // Set column headers
    const headers = [
      "Full Name",
      "Email Address",
      "Phone Number",
      "UUID",
      "User Type",
      "City",
      "Nationality",
      "Registration Date",
      "Email Verified",
      "Identity Verified",
      "CV Count",
    ];

    // Update header row
    headers.forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      if (ws[cellAddress]) {
        ws[cellAddress].v = header;
      }
    });

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Name
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 36 }, // UUID
      { wch: 12 }, // User Type
      { wch: 15 }, // City
      { wch: 15 }, // Nationality
      { wch: 15 }, // Registration Date
      { wch: 12 }, // Email Verified
      { wch: 15 }, // Identity Verified
      { wch: 10 }, // CV Count
    ];
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    // Generate file and download
    const timestamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);

    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};

// Export to PDF
export const exportToPDF = (
  users: User[],
  filename: string = "users_export",
) => {
  try {
    const exportData = transformUserDataForExport(users);

    // Create new PDF document
    const doc = new jsPDF("l", "mm", "a4"); // landscape orientation

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Users Export Report", 14, 22);

    // Add metadata
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Users: ${users.length}`, 14, 36);

    // Prepare table data
    const headers = [
      "Full Name",
      "Email",
      "Phone",
      "UUID",
      "Type",
      "City",
      "Nationality",
      "Registered",
      "Email Ver.",
      "ID Ver.",
      "CVs",
    ];

    const rows = exportData.map((user) => [
      user.name,
      user.email,
      user.phone,
      user.uuid,
      user.userType,
      user.city,
      user.nationality,
      user.registrationDate,
      user.emailVerified,
      user.identityVerified,
      user.cvCount.toString(),
    ]);

    // Add table
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 45,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [26, 67, 129], // Primary color
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Name
        1: { cellWidth: 35 }, // Email
        2: { cellWidth: 20 }, // Phone
        3: { cellWidth: 20 }, // UUID
        4: { cellWidth: 15 }, // Type
        5: { cellWidth: 20 }, // City
        6: { cellWidth: 20 }, // Nationality
        7: { cellWidth: 20 }, // Registered
        8: { cellWidth: 15 }, // Email Ver.
        9: { cellWidth: 15 }, // ID Ver.
        10: { cellWidth: 10 }, // CVs
      },
      margin: { top: 45, left: 14, right: 14 },
    });

    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10,
      );
    }

    // Generate file and download
    const timestamp = new Date().toISOString().slice(0, 10);
    doc.save(`${filename}_${timestamp}.pdf`);

    return true;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    return false;
  }
};

// Combined export function
export const exportUsers = async (
  users: User[],
  format: "excel" | "pdf",
  filename: string = "users_export",
): Promise<boolean> => {
  try {
    if (format === "excel") {
      return exportToExcel(users, filename);
    } else if (format === "pdf") {
      return exportToPDF(users, filename);
    }
    return false;
  } catch (error) {
    console.error("Error exporting users:", error);
    return false;
  }
};
