"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter,
  Eye,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

interface Report {
  id: string;
  reportType: "provider" | "service" | "booking";
  targetId: string;
  targetName: string;
  targetPhone?: string;
  reason: string;
  description: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  reporterName: string;
  reporterPhone?: string;
}

export function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports");
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();
      setReports(data);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: string, notes?: string) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: notes }),
      });

      if (!response.ok) throw new Error("Failed to update report");
      
      toast.success("Report status updated");
      fetchReports();
      setSelectedReport(null);
      setAdminNotes("");
    } catch (error) {
      toast.error("Failed to update report status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      investigating: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      dismissed: "bg-gray-100 text-gray-800",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "investigating": return <AlertTriangle className="w-4 h-4" />;
      case "resolved": return <CheckCircle className="w-4 h-4" />;
      case "dismissed": return <MessageSquare className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    const matchesSearch = (report.targetName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (report.reason?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (report.reporterName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Reports Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {report.reportType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{report.targetName || 'N/A'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {report.reason}
                    </TableCell>
                    <TableCell>{report.reporterName}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(report.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(report.status)}
                          {report.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No reports found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Review and manage this report
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Report Type</Label>
                  <p className="text-sm text-gray-600 capitalize">{selectedReport.reportType}</p>
                </div>
                <div>
                  <Label>Target</Label>
                  <p className="text-sm text-gray-600">{selectedReport.targetName || 'N/A'}</p>
                  {selectedReport.targetPhone && (
                    <p className="text-xs text-gray-500">{selectedReport.targetPhone}</p>
                  )}
                </div>
                <div>
                  <Label>Reason</Label>
                  <p className="text-sm text-gray-600">{selectedReport.reason}</p>
                </div>
                <div>
                  <Label>Reporter</Label>
                  <p className="text-sm text-gray-600">{selectedReport.reporterName}</p>
                  {selectedReport.reporterPhone && (
                    <p className="text-xs text-gray-500">{selectedReport.reporterPhone}</p>
                  )}
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusBadge(selectedReport.status)}>
                    {selectedReport.status}
                  </Badge>
                </div>
                <div>
                  <Label>Date Reported</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.adminNotes && (
                <div>
                  <Label>Admin Notes</Label>
                  <p className="text-sm text-gray-600 mt-1 p-3 bg-blue-50 rounded-md">
                    {selectedReport.adminNotes}
                  </p>
                </div>
              )}

              <div>
                <Label>Update Status</Label>
                <div className="flex gap-2 mt-2">
                  <Select 
                    value={selectedReport.status} 
                    onValueChange={(value) => {
                      setSelectedReport(prev => prev ? { ...prev, status: value as any } : null);
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  placeholder="Add notes about this report..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedReport(null);
                    setAdminNotes("");
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => updateReportStatus(selectedReport.id, selectedReport.status, adminNotes)}
                  disabled={updatingStatus}
                >
                  {updatingStatus ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 