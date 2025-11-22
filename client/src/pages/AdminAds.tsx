import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import type { Advertisement, InsertAdvertisement } from "@shared/schema";
import { insertAdvertisementSchema } from "@shared/schema";

export default function AdminAds() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertAdvertisement>({
    resolver: zodResolver(insertAdvertisementSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: null,
      linkUrl: null,
      displayOrder: 0,
      isActive: true,
    },
  });

  const { data: ads = [], isLoading } = useQuery<Advertisement[]>({
    queryKey: ["/api/admin/advertisements"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/advertisements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch ads");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAdvertisement) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/advertisements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create ad");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Advertisement created" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/advertisements"] });
      setIsDialogOpen(false);
      form.reset();
      setSelectedFile(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create ad",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Advertisement> }) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/advertisements/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update ad");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Advertisement updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/advertisements"] });
      setIsDialogOpen(false);
      setEditingAd(null);
      form.reset();
      setSelectedFile(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update ad",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/advertisements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete ad");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Advertisement deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/advertisements"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete ad",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Error",
        description: "File must be less than 5MB",
        variant: "destructive",
      });
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/artisan/0/profile-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      form.setValue("imageUrl", data.url);
      setSelectedFile(null);
      toast({ title: "Success", description: "Image uploaded" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Upload failed",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenDialog = (ad?: Advertisement) => {
    if (ad) {
      setEditingAd(ad);
      form.reset(ad);
    } else {
      setEditingAd(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: InsertAdvertisement) => {
    if (editingAd) {
      updateMutation.mutate({ id: editingAd.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-white text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gold mb-2">Featured Ads Manager</h1>
            <p className="text-white/80">Manage promotional advertisements</p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-gold hover:bg-gold-dark text-black"
            data-testid="button-create-ad"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Advertisement
          </Button>
        </div>

        <div className="space-y-4">
          {ads.map((ad) => (
            <Card key={ad.id} className="bg-zinc-900 border-green/30" data-testid={`card-ad-${ad.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {ad.imageUrl && (
                      <img src={ad.imageUrl} alt={ad.title} className="w-full h-32 object-cover rounded mb-4" />
                    )}
                    <h3 className="text-xl font-semibold text-gold mb-2">{ad.title}</h3>
                    <p className="text-white/80 mb-2">{ad.description}</p>
                    {ad.linkUrl && (
                      <p className="text-white/60 text-sm mb-2">Link: {ad.linkUrl}</p>
                    )}
                    <div className="flex gap-2 items-center">
                      <span className="text-white/60 text-sm">Order: {ad.displayOrder}</span>
                      <span className={`text-xs px-2 py-1 rounded ${ad.isActive ? "bg-green/20 text-green" : "bg-red-500/20 text-red-400"}`}>
                        {ad.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpenDialog(ad)}
                      className="bg-gold hover:bg-gold-dark text-black"
                      data-testid={`button-edit-ad-${ad.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteMutation.mutate(ad.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      data-testid={`button-delete-ad-${ad.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {ads.length === 0 && (
          <Card className="bg-zinc-900 border-green/30">
            <CardContent className="p-12 text-center">
              <p className="text-white/60">No advertisements yet. Create one to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-green/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gold text-2xl">
              {editingAd ? "Edit Advertisement" : "Create Advertisement"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {editingAd ? "Update ad details" : "Create a new featured ad"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ad title" className="bg-zinc-800 border-green/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Ad description" className="bg-zinc-800 border-green/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label className="text-white">Image</Label>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white border border-green/30"
                    disabled={uploadingImage}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                  {selectedFile && (
                    <Button
                      type="button"
                      onClick={handleUploadImage}
                      className="bg-gold hover:bg-gold-dark text-black"
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="linkUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Link URL (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="https://..." className="bg-zinc-800 border-green/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Display Order</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="bg-zinc-800 border-green/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input type="checkbox" {...field} className="w-4 h-4" />
                    </FormControl>
                    <FormLabel className="text-white mb-0">Active</FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold-dark text-black"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingAd ? "Update Advertisement" : "Create Advertisement"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
