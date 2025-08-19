"use client";

import { User } from "@/types/user";
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

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (userId: number) => void;
  onReject?: (userId: number) => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: UserDetailModalProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  const getVerificationStatus = (status: string) => {
    const getVariant = (status: string) => {
      const variants = {
        verified: "success",
        pending: "pending",
        rejected: "rejected",
        not_started: "secondary",
      };
      return variants[status as keyof typeof variants] || "secondary";
    };

    return (
      <Badge variant={getVariant(status) as any}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        {user ? (
          <>
            <DialogHeader>
              <DialogTitle>
                User Details: {user.first_name} {user.last_name}
              </DialogTitle>
              <DialogDescription>
                ID: {user.uuid} • Email: {user.email}
              </DialogDescription>
            </DialogHeader>

            {/* Content */}
            <div className="space-y-6 p-6">
              {/* Personal Information */}
              <section>
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Full Name
                    </label>
                    <p className="text-foreground">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Email
                    </label>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Phone
                    </label>
                    <p className="text-foreground">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Gender
                    </label>
                    <p className="text-foreground capitalize">{user.gender}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Birth Date
                    </label>
                    <p className="text-foreground">
                      {formatDate(user.birth_date)}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Marital Status
                    </label>
                    <p className="text-foreground capitalize">
                      {user.marital_status}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      User Type
                    </label>
                    <p className="text-foreground capitalize">
                      {user.user_type}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Years of Experience
                    </label>
                    <p className="text-foreground">
                      {user.years_of_experience} years
                    </p>
                  </div>
                </div>
              </section>

              {/* Location Information */}
              <section>
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Location
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Street Address
                    </label>
                    <p className="text-foreground">
                      {user.street || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      City
                    </label>
                    <p className="text-foreground">
                      {user.city?.name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Province
                    </label>
                    <p className="text-foreground">
                      {user.city?.province?.name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Nationality
                    </label>
                    <p className="text-foreground">
                      {user.nationality?.name || "Not provided"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Verification Status */}
              <section>
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Verification Status
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Identity Verification
                    </label>
                    {getVerificationStatus(user.identity_verification_state)}
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Email Verified
                    </label>
                    {getVerificationStatus(
                      user.email_verified_at ? "verified" : "pending",
                    )}
                  </div>
                </div>
              </section>

              {/* Profile Completion Status */}
              <section>
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Profile Completion
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {[
                    {
                      label: "Personal Information",
                      completed: !!(
                        user.first_name &&
                        user.last_name &&
                        user.phone &&
                        user.birth_date
                      ),
                    },
                    {
                      label: "Location Details",
                      completed: !!(user.street && user.city?.name),
                    },
                    {
                      label: "Email Verification",
                      completed: !!user.email_verified_at,
                    },
                    {
                      label: "Identity Verification",
                      completed:
                        user.identity_verification_state === "verified",
                    },
                    {
                      label: "CV Creation",
                      completed: user.cv && user.cv.length > 0,
                    },
                    {
                      label: "Professional Profile",
                      completed: !!(
                        user.profile_summary && user.years_of_experience > 0
                      ),
                    },
                  ].map((form, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full",
                          form.completed ? "bg-success" : "bg-destructive",
                        )}
                      />
                      <span className="text-foreground text-sm">
                        {form.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Additional Information */}
              <section>
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Driver License
                    </label>
                    <p className="text-foreground">
                      {user.has_driver_license ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Vehicle
                    </label>
                    <p className="text-foreground">
                      {user.has_vehicle ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Portfolio URL
                    </label>
                    <p className="text-foreground">
                      {user.portfolio_url ? (
                        <a
                          href={user.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {user.portfolio_url}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      LinkedIn URL
                    </label>
                    <p className="text-foreground">
                      {user.linkedin_url ? (
                        <a
                          href={user.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {user.linkedin_url}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* Profile Summary */}
              {user.profile_summary && (
                <section>
                  <h3 className="text-foreground mb-4 text-lg font-semibold">
                    Profile Summary
                  </h3>
                  <p className="text-foreground bg-muted rounded-lg p-4">
                    {user.profile_summary}
                  </p>
                </section>
              )}

              {/* CVs */}
              {user.cv && user.cv.length > 0 ? (
                <section>
                  <h3 className="text-foreground mb-4 text-lg font-semibold">
                    CVs ({user.cv.length})
                  </h3>
                  <div className="space-y-3">
                    {user.cv.map((cv) => (
                      <div key={cv.id} className="bg-muted rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-foreground font-medium">
                              {cv.cv_title || "Untitled CV"}
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              State: {cv.state || "Unknown"}
                            </p>
                            {cv.last_published_at && (
                              <p className="text-muted-foreground mt-1 text-xs">
                                Last published:{" "}
                                {formatDate(cv.last_published_at)}
                              </p>
                            )}
                          </div>
                          {getVerificationStatus(cv.state || "not_started")}
                        </div>
                        <div className="text-muted-foreground mt-2 text-sm">
                          <span>Diplomas: {cv.diplomas?.length || 0}</span> •{" "}
                          <span>
                            Experiences: {cv.experiences?.length || 0}
                          </span>{" "}
                          • <span>Skills: {cv.cvSkills?.length || 0}</span> •{" "}
                          <span>Languages: {cv.cvLanguages?.length || 0}</span>{" "}
                          •{" "}
                          <span>
                            Certifications: {cv.certifications?.length || 0}
                          </span>
                        </div>
                        {cv.cv_update_count > 0 && (
                          <div className="text-muted-foreground mt-1 text-xs">
                            Updated {cv.cv_update_count} times
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <section>
                  <h3 className="text-foreground mb-4 text-lg font-semibold">
                    CVs
                  </h3>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-muted-foreground">No CVs created yet</p>
                  </div>
                </section>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {onReject && (
                <Button variant="destructive" onClick={() => onReject(user.id)}>
                  Reject
                </Button>
              )}
              {onApprove && (
                <Button variant="success" onClick={() => onApprove(user.id)}>
                  Approve
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <div className="p-6 text-center">
            <p>No user data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
