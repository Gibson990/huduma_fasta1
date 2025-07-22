import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/hooks/use-toast";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ProviderServiceManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceForm, setServiceForm] = useState({ serviceId: "", customPrice: "", notes: "" });
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/providers/${user.id}/services`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setServices([]);
      });
  }, [user]);

  // Fetch all available services for selection
  useEffect(() => {
    fetch("/api/services")
      .then(res => res.ok ? res.json() : [])
      .then(data => setAllServices(data));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4 bg-white shadow-sm animate-pulse">
            <div className="flex-1 min-w-0">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
              <div className="h-4 bg-gray-100 rounded w-1/4" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-gray-200 rounded" />
              <div className="h-8 w-16 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const openAddDialog = () => {
    setEditingService(null);
    setServiceForm({ serviceId: "", customPrice: "", notes: "" });
    setSelectedService(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: any) => {
    setEditingService(service);
    setServiceForm({
      serviceId: service.id,
      customPrice: service.custom_price || service.base_price || "",
      notes: service.notes || ""
    });
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setServiceForm(prev => ({ ...prev, [field]: value }));
    if (field === "serviceId") {
      const found = allServices.find(s => s.id === value);
      setSelectedService(found || null);
    }
  };

  const handleSave = async () => {
    if (!serviceForm.serviceId || !serviceForm.customPrice) {
      toast({ title: "Error", description: "Service and price are required.", variant: "destructive" });
      return;
    }
    const method = editingService ? "PATCH" : "POST";
    const url = editingService
      ? `/api/services/${editingService.id}`
      : `/api/providers/${user.id}/services`;
    const body = JSON.stringify({
      serviceId: serviceForm.serviceId,
      customPrice: serviceForm.customPrice,
      notes: serviceForm.notes
    });
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (res.ok) {
      toast({ title: "Success", description: `Service ${editingService ? "updated" : "added"} successfully.`, variant: "success" });
      setIsDialogOpen(false);
      setEditingService(null);
      setServiceForm({ serviceId: "", customPrice: "", notes: "" });
      setSelectedService(null);
      // Refresh services
      fetch(`/api/providers/${user.id}/services`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setServices(data));
    } else {
      toast({ title: "Error", description: "Failed to save service.", variant: "destructive" });
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    const res = await fetch(`/api/services/${serviceId}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Deleted", description: "Service deleted successfully.", variant: "success" });
      setServices(prev => prev.filter(s => s.id !== serviceId));
    } else {
      toast({ title: "Error", description: "Failed to delete service.", variant: "destructive" });
    }
  };

  return (
    <Card className="border-0 shadow-sm mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#212121] flex items-center gap-2">
          Manage Services
        </CardTitle>
        <Button onClick={openAddDialog} variant="outline" size="sm">Add Service</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.length === 0 ? (
            <p className="text-gray-600">No services found. Click "Add Service" to create one.</p>
          ) : (
            services.map(service => (
              <div key={service.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#212121]">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <span className="font-medium text-[#2E7D32]">TSh {service.price}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(service)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>Delete</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="service-select">Select Service</Label>
              <select
                id="service-select"
                value={serviceForm.serviceId}
                onChange={e => handleFormChange("serviceId", e.target.value)}
                className="mt-1 w-full border rounded px-2 py-2"
              >
                <option value="">-- Select a service --</option>
                {allServices.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name_en} ({service.category_name})
                  </option>
                ))}
              </select>
            </div>
            {selectedService && (
              <div className="bg-gray-50 p-2 rounded border text-sm">
                <div><b>Description:</b> {selectedService.description_en}</div>
                <div><b>Category:</b> {selectedService.category_name}</div>
                <div><b>Base Price:</b> TSh {selectedService.base_price}</div>
              </div>
            )}
            <div>
              <Label htmlFor="service-custom-price">Custom Price (TSh)</Label>
              <Input
                id="service-custom-price"
                type="number"
                min="0"
                value={serviceForm.customPrice}
                onChange={e => handleFormChange("customPrice", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="service-notes">Notes (optional)</Label>
              <Textarea
                id="service-notes"
                value={serviceForm.notes}
                onChange={e => handleFormChange("notes", e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <Button onClick={handleSave} className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]">
              {editingService ? "Update Service" : "Add Service"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 