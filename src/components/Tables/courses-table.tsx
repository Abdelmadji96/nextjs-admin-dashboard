"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Star,
  Users,
  MapPin,
  Calendar,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Course, CourseType, CourseTableFilters } from "@/types/course";

interface CoursesTableProps {
  courses: Course[];
  onView?: (course: Course) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (courseId: number) => void;
  className?: string;
}

export function CoursesTable({
  courses,
  onView,
  onEdit,
  onDelete,
  className,
}: CoursesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<CourseTableFilters>({
    search: "",
    type: "ALL",
    level: "ALL",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const courseTypes: { value: CourseType | "ALL"; label: string }[] = [
    { value: "ALL", label: "All Types" },
    { value: "ONLINE", label: "Online" },
    { value: "ONSITE", label: "On-site" },
    { value: "FULL-TIME", label: "Full-time" },
    { value: "PART-TIME", label: "Part-time" },
    { value: "HYBRID", label: "Hybrid" },
  ];

  const levels = [
    { value: "ALL", label: "All Levels" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

  // Filter and search logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search filter
      const searchMatch =
        filters.search === "" ||
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(filters.search.toLowerCase());

      // Type filter
      const typeMatch = filters.type === "ALL" || course.type === filters.type;

      // Level filter
      const levelMatch =
        filters.level === "ALL" || course.level === filters.level;

      return searchMatch && typeMatch && levelMatch;
    });
  }, [courses, filters.search, filters.type, filters.level]);

  // Sort and paginate
  const sortedAndPaginatedCourses = useMemo(() => {
    // Sort
    const sorted = [...filteredCourses].sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "price":
          aValue = parseFloat(a.price.replace(/[^\d.]/g, "")) || 0;
          bValue = parseFloat(b.price.replace(/[^\d.]/g, "")) || 0;
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "duration":
          aValue = a.duration.toLowerCase();
          bValue = b.duration.toLowerCase();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt || "").getTime();
          bValue = new Date(b.createdAt || "").getTime();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (aValue < bValue) return filters.sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Paginate
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sorted.slice(startIndex, endIndex);
  }, [
    filteredCourses,
    filters.sortBy,
    filters.sortOrder,
    currentPage,
    pageSize,
  ]);

  const totalPages = Math.ceil(filteredCourses.length / pageSize);

  const handleSort = (sortBy: CourseTableFilters["sortBy"]) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const updateFilter = (key: keyof CourseTableFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const getTypeVariant = (type: CourseType) => {
    const variants = {
      ONLINE: "bg-primary/10 text-primary",
      ONSITE: "bg-success/10 text-success",
      "FULL-TIME": "bg-warning/10 text-warning",
      "PART-TIME": "bg-chart-3/10 text-chart-3",
      HYBRID: "bg-chart-6/10 text-chart-6",
    };
    return variants[type] || "bg-muted text-muted-foreground";
  };

  const getLevelVariant = (level?: string) => {
    const variants = {
      Beginner: "bg-success/10 text-success",
      Intermediate: "bg-warning/10 text-warning",
      Advanced: "bg-destructive/10 text-destructive",
    };
    return (
      variants[level as keyof typeof variants] ||
      "bg-muted text-muted-foreground"
    );
  };

  const getSortIcon = (column: CourseTableFilters["sortBy"]) => {
    if (filters.sortBy !== column) return null;
    return filters.sortOrder === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating
                ? "fill-warning text-warning"
                : "text-muted-foreground",
            )}
          />
        ))}
        <span className="text-muted-foreground ml-1 text-sm">({rating})</span>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "bg-card border-border rounded-lg border shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="border-border border-b p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-foreground text-xl font-semibold">
              Sponsored Courses
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Total: {filteredCourses.length} courses • Manage and monitor all
              sponsored courses
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
              <input
                type="text"
                placeholder="Search courses, company, instructor..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="border-border bg-background w-full rounded-lg border py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-80"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => updateFilter("type", e.target.value)}
              className="border-border bg-background rounded-lg border px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {courseTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={filters.level}
              onChange={(e) => updateFilter("level", e.target.value)}
              className="border-border bg-background rounded-lg border px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {levels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-border bg-muted/30 border-b">
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                <button
                  onClick={() => handleSort("title")}
                  className="hover:text-foreground flex items-center"
                >
                  Course
                  {getSortIcon("title")}
                </button>
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                Type & Level
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                Company & Instructor
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                <button
                  onClick={() => handleSort("price")}
                  className="hover:text-foreground flex items-center"
                >
                  Price
                  {getSortIcon("price")}
                </button>
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                <button
                  onClick={() => handleSort("rating")}
                  className="hover:text-foreground flex items-center"
                >
                  Rating
                  {getSortIcon("rating")}
                </button>
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                Details
              </th>
              <th className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndPaginatedCourses.map((course) => (
              <tr
                key={course.id}
                className="border-border hover:bg-muted/20 border-b transition-colors"
              >
                {/* Course */}
                <td className="px-6 py-4">
                  <div>
                    <h3 className="text-foreground font-medium">
                      {course.title}
                    </h3>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {course.location}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Type & Level */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <Badge
                      className={cn("text-xs", getTypeVariant(course.type))}
                    >
                      {course.type}
                    </Badge>
                    {course.level && (
                      <Badge
                        className={cn("text-xs", getLevelVariant(course.level))}
                      >
                        {course.level}
                      </Badge>
                    )}
                  </div>
                </td>

                {/* Company & Instructor */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-foreground flex items-center gap-1 text-sm font-medium">
                      <Building className="h-3 w-3" />
                      {course.company}
                    </div>
                    {course.instructor && (
                      <div className="text-muted-foreground text-sm">
                        {course.instructor}
                      </div>
                    )}
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4">
                  <span className="text-foreground font-semibold">
                    {course.price}
                  </span>
                </td>

                {/* Rating */}
                <td className="px-6 py-4">{renderStars(course.rating)}</td>

                {/* Details */}
                <td className="px-6 py-4">
                  <div className="text-muted-foreground space-y-1 text-sm">
                    {course.maxStudents && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.currentStudents || 0}/{course.maxStudents}
                      </div>
                    )}
                    <div
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs",
                        course.isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(course)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(course)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(course.id)}
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="py-12 text-center">
            <Building className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="text-foreground mb-2 text-lg font-medium">
              No courses found
            </h3>
            <p className="text-muted-foreground">
              {filters.search ||
              filters.type !== "ALL" ||
              filters.level !== "ALL"
                ? "Try adjusting your search criteria"
                : "No courses have been added yet"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCourses.length > 0 && (
        <div className="border-border bg-muted/20 border-t px-6 py-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-muted-foreground text-sm">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredCourses.length)} of{" "}
              {filteredCourses.length} courses
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <Button
                      variant={
                        currentPage === totalPages ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="h-8 w-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
