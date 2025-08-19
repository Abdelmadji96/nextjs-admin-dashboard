"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CoursesTable } from "@/components/Tables/courses-table";
import { AddCourseModal } from "@/components/Modals/add-course-modal";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { mockCourses } from "@/data/mockCourses";
import {
  GraduationCap,
  Plus,
  BookOpen,
  Users,
  TrendingUp,
  Building,
} from "lucide-react";

export default function SponsoredCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    // You could open a view modal here
    console.log("Viewing course:", course);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    // You could open an edit modal here
    console.log("Editing course:", course);
  };

  const handleDeleteCourse = (courseId: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses((prev) => prev.filter((course) => course.id !== courseId));
    }
  };

  // Calculate statistics
  const totalCourses = courses.length;
  const activeCourses = courses.filter((course) => course.isActive).length;
  const totalStudents = courses.reduce(
    (sum, course) => sum + (course.currentStudents || 0),
    0,
  );
  const averageRating =
    courses.reduce((sum, course) => sum + course.rating, 0) / courses.length;

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="Sponsored Courses" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-foreground mb-2 flex items-center gap-3 text-2xl font-bold">
              <GraduationCap className="h-8 w-8 text-primary" />
              Sponsored Courses Management
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor all sponsored courses on the platform. Add new
              courses, track enrollments, and analyze performance.
            </p>
          </div>

          {/* Add Course Button */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="hover:bg-primary-button gap-2 bg-primary"
          >
            <Plus className="h-4 w-4" />
            Add New Course
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card border-border rounded-lg border p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {totalCourses}
                </p>
                <p className="text-muted-foreground text-sm">Total Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-card border-border rounded-lg border p-6">
            <div className="flex items-center gap-4">
              <div className="bg-success/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <TrendingUp className="text-success h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {activeCourses}
                </p>
                <p className="text-muted-foreground text-sm">Active Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-card border-border rounded-lg border p-6">
            <div className="flex items-center gap-4">
              <div className="bg-warning/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <Users className="text-warning h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {totalStudents}
                </p>
                <p className="text-muted-foreground text-sm">Total Students</p>
              </div>
            </div>
          </div>

          <div className="bg-card border-border rounded-lg border p-6">
            <div className="flex items-center gap-4">
              <div className="bg-chart-6/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <Building className="text-chart-6 h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {averageRating.toFixed(1)}
                </p>
                <p className="text-muted-foreground text-sm">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <CoursesTable
          courses={courses}
          onView={handleViewCourse}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
        />

        {/* Add Course Modal */}
        <AddCourseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCourse}
        />
      </div>
    </div>
  );
}
