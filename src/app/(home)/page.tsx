"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  DonutChart,
  MetricCard,
  ProgressBar,
} from "@/components/Charts";
import { ColorPreview } from "@/components/ColorChart/ColorPreview";
import { UsersTable } from "@/components/Tables/users-table";
import { UserDetailModal } from "@/components/Modals/user-detail-modal";
import { Shield, GraduationCap, UserCheck, HelpCircle } from "lucide-react";
import { User } from "@/types/user";

interface ChartData {
  name: string;
  value: number;
}

const monthlyData: ChartData[] = [
  { name: "Jan", value: 456 },
  { name: "Feb", value: 578 },
  { name: "Mar", value: 642 },
  { name: "Apr", value: 598 },
  { name: "May", value: 734 },
  { name: "Jun", value: 856 },
];

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-foreground mb-2 text-2xl font-bold">
            Verification Statistics
          </h1>
          <p className="text-muted-foreground">
            Overview of verification activities and performance metrics.
          </p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border-border bg-background text-foreground rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Verifications"
          value="2,456"
          change={12.5}
          changeLabel="from last month"
          icon={<Shield className="h-6 w-6" />}
          variant="default"
        />
        <MetricCard
          title="Pending Reviews"
          value="142"
          change={-8.2}
          changeLabel="from last week"
          icon={<UserCheck className="h-6 w-6" />}
          variant="warning"
        />
        <MetricCard
          title="Approved Today"
          value="89"
          change={15.3}
          changeLabel="from yesterday"
          icon={<GraduationCap className="h-6 w-6" />}
          variant="success"
        />
        <MetricCard
          title="Active Users"
          value="1,789"
          change={3.1}
          changeLabel="from last week"
          icon={<HelpCircle className="h-6 w-6" />}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Verification Types Donut Chart */}
        <DonutChart
          title="Verifications by Type"
          data={[
            { label: "Identity", value: 856, percentage: 35 },
            { label: "Diploma", value: 654, percentage: 27 },
            { label: "User", value: 542, percentage: 22 },
          ]}
          centerValue="2,052"
          centerLabel="Total"
          showLegend={true}
          className="bg-card border-border rounded-lg border p-6"
        />

        {/* Monthly Trend Bar Chart */}
        <BarChart
          title="Monthly Verification Trend"
          data={monthlyData.map((item) => ({
            label: item.name,
            value: item.value,
          }))}
          showValues={true}
          className="bg-card border-border rounded-lg border p-6"
        />

        {/* Performance Progress */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-6 text-lg font-semibold">
            Performance Metrics
          </h3>
          <div className="space-y-6">
            <ProgressBar
              label="Approval Rate"
              value={89}
              color="chart-3"
              showValue={true}
            />
            <ProgressBar
              label="Processing Speed"
              value={76}
              color="chart-1"
              showValue={true}
            />
            <ProgressBar
              label="User Satisfaction"
              value={94}
              color="chart-4"
              showValue={true}
            />
            <ProgressBar
              label="System Uptime"
              value={99.8}
              color="chart-2"
              showValue={true}
            />
          </div>
        </div>
      </div>

      {/* Color System Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ColorPreview
          title="Brand Colors"
          colors={[
            { name: "Primary", hex: "#1A4381" },
            { name: "Primary Light", hex: "#718EBF" },
            { name: "Primary Bold", hex: "#092147" },
            { name: "Primary Button", hex: "#2C528B" },
          ]}
        />
        <ColorPreview
          title="Chart Colors"
          colors={[
            { name: "Chart 1", hex: "#1A4381" },
            { name: "Chart 2", hex: "#718EBF" },
            { name: "Chart 3", hex: "#22C55E" },
            { name: "Chart 4", hex: "#F59E0B" },
          ]}
        />
      </div>

      {/* Users Management */}
      <UsersTable onViewUser={handleViewUser} className="mt-6" />

      {/* Recent Activity */}
      <div className="bg-card border-border rounded-lg border p-6">
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              action: "Identity verified",
              user: "John Doe",
              time: "2 minutes ago",
              status: "approved",
            },
            {
              action: "Diploma submitted",
              user: "Jane Smith",
              time: "5 minutes ago",
              status: "pending",
            },
            {
              action: "User account created",
              user: "Mike Johnson",
              time: "10 minutes ago",
              status: "approved",
            },
            {
              action: "Support ticket opened",
              user: "Sarah Wilson",
              time: "15 minutes ago",
              status: "pending",
            },
            {
              action: "Identity rejected",
              user: "David Brown",
              time: "20 minutes ago",
              status: "rejected",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="border-border flex items-center justify-between border-b py-3 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    activity.status === "approved"
                      ? "bg-success"
                      : activity.status === "pending"
                        ? "bg-warning"
                        : "bg-destructive",
                  )}
                />
                <div>
                  <p className="text-foreground font-medium">
                    {activity.action}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    by {activity.user}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    activity.status === "approved"
                      ? "bg-success/10 text-success"
                      : activity.status === "pending"
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive",
                  )}
                >
                  {activity.status.toUpperCase()}
                </span>
                <p className="text-muted-foreground mt-1 text-xs">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        user={selectedUser}
      />
    </div>
  );
}
