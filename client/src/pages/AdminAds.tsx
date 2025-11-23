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
import { Plus, Edit, Trash2, Upload, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Advertisement, InsertAdvertisement } from "@shared/schema";
import { insertAdvertisementSchema } from "@shared/schema";

export default function AdminAds() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [pendingUpload, setPendingUpload] = useState(false);
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
      contactPhone: null,
      contactEmail: null,
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
    onSuccess: (newAd: Advertisement) => {
      toast({ title: "Success", description: "Advertisement created" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/advertisements"] });
      
      // Set the new ad as the editing ad so upload button shows
      setEditingAd(newAd);
      
      // If file is pending upload, upload it now
      if (pendingUpload && selectedFile) {
        setPendingUpload(false);
        // Upload will happen after state updates
        setTimeout(() => handleUploadImage(newAd.id), 100);
      } else {
        // No file to upload, close the dialog
        setTimeout(() => {
          setIsDialogOpen(false);
          form.reset();
        }, 500);
      }
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
      setUploadError(null);
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
    setUploadError(null);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        const errorMsg = "Ad image must be less than 5MB";
        setUploadError(errorMsg);
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: errorMsg,
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadImage = async (adId: number) => {
    if (!selectedFile) return;

    setUploadingImage(true);
    setUploadError(null);
    const formDataToSend = new FormData();
    formDataToSend.append('image', selectedFile);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/advertisement/${adId}/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      const data = await response.json();
      
      form.setValue("imageUrl", data.url);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploadError(null);

      toast({
        title: "Success",
        description: "Ad image uploaded successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/advertisements"] });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      const errorMessage = error.message || "Failed to upload ad image";
      setUploadError(errorMessage);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
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
    setUploadError(null);
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: InsertAdvertisement) => {
    if (editingAd) {
      updateMutation.mutate({ id: editingAd.id, data });
    } else {
      // If we have a pending upload and no ad created yet, mark it for upload
      if (selectedFile && !editingAd) {
        setPendingUpload(true);
      }
      createMutation.mutate(data);
    }
  };

  const handleUploadClick = () => {
    if (!selectedFile) return;
    
    // If we have an editing ad, upload directly
    if (editingAd) {
      handleUploadImage(editingAd.id);
    } else {
      // If no ad created yet, submit the form first, then upload will happen in onSuccess
      setPendingUpload(true);
      form.handleSubmit(onSubmit)();
    }
  };

  const handlePreviousAd = () => {
    setCarouselIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNextAd = () => {
    setCarouselIndex((prev) => (prev + 1) % ads.length);
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

        {/* Ad Carousel Viewer */}
        {ads.length > 0 && (
          <Card className="bg-zinc-900 border-green/30 mb-8" data-testid="card-ad-carousel">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Preview Ads Carousel</h2>
              
              <div className="relative bg-black rounded-lg overflow-hidden mb-6 h-80 flex items-center justify-center group">
                {ads[carouselIndex].imageUrl ? (
                  <img
                    src={ads[carouselIndex].imageUrl}
                    alt={ads[carouselIndex].title}
                    className="w-full h-full object-cover"
                    data-testid={`img-ad-carousel-${ads[carouselIndex].id}`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gold/10 to-gold-dark/10">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gold mb-2">{ads[carouselIndex].title}</h3>
                      <p className="text-white/80">{ads[carouselIndex].description}</p>
                    </div>
                  </div>
                )}

                {/* Overlay with text for image ads */}
                {ads[carouselIndex].imageUrl && (
                  <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gold mb-2">{ads[carouselIndex].title}</h3>
                      <p className="text-white/90">{ads[carouselIndex].description}</p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <button
                  onClick={handlePreviousAd}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-gold/80 hover:bg-gold text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  data-testid="button-carousel-prev"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNextAd}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-gold/80 hover:bg-gold text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  data-testid="button-carousel-next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {ads.map((ad, idx) => (
                    <button
                      key={ad.id}
                      onClick={() => setCarouselIndex(idx)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        idx === carouselIndex
                          ? "bg-gold text-black"
                          : "bg-zinc-800 text-white/80 hover:bg-zinc-700"
                      }`}
                      data-testid={`button-carousel-ad-${ad.id}`}
                    >
                      Ad {idx + 1}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => handleOpenDialog(ads[carouselIndex])}
                  className="bg-gold hover:bg-gold-dark text-black"
                  data-testid="button-edit-carousel-ad"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit This Ad
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {ads.map((ad) => (
            <Card key={ad.id} className="bg-zinc-900 border-green/30" data-testid={`card-ad-${ad.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {ad.imageUrl && (
                      <img src={ad.imageUrl} alt={ad.title} className="w-full h-48 object-cover rounded mb-4" />
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

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingAd(null);
          setUploadError(null);
          setSelectedFile(null);
          setCarouselIndex(0);
        }
      }}>
        <DialogContent className="bg-zinc-900 border-green/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gold text-2xl">
              {editingAd ? "Edit Advertisement" : "Create Advertisement"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {editingAd ? "Update ad details and image" : "Create a new featured advertisement"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-full">
                  <div className="w-full h-64 bg-gradient-to-br from-gold/20 to-gold-dark/20 rounded flex items-center justify-center text-white font-bold text-2xl overflow-hidden border border-gold/30">
                    {form.watch("imageUrl") ? (
                      <img 
                        src={form.watch("imageUrl") || ""} 
                        alt="Ad Preview" 
                        className="w-full h-full object-cover"
                        data-testid="img-ad-preview"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-5xl mb-2">🖼️</div>
                        <p className="text-white/60">Ad Image</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="ad-image-input"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white border border-green/30"
                        disabled={uploadingImage || createMutation.isPending}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </Button>
                      {selectedFile && (
                        <Button
                          type="button"
                          onClick={handleUploadClick}
                          className="bg-gold hover:bg-gold-dark text-black"
                          disabled={uploadingImage || createMutation.isPending}
                          data-testid="button-upload-image"
                        >
                          {uploadingImage ? "Uploading..." : "Upload"}
                        </Button>
                      )}
                    </div>
                    {selectedFile && (
                      <p className="text-white/70 text-sm">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                    {uploadError && (
                      <div className="p-4 rounded-md bg-gradient-to-r from-gold/10 to-gold-dark/10 border border-green/30">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-white font-semibold mb-1">Upload Error</p>
                            <p className="text-white/90 text-sm">{uploadError}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="text-white/60 text-xs">
                      Max 5MB • JPG, PNG, WebP, or GIF
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ad title" className="bg-zinc-800 border-green/30 text-white" data-testid="input-ad-title" />
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
                      <Textarea {...field} placeholder="Ad description" className="bg-zinc-800 border-green/30 text-white" data-testid="textarea-ad-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Business Website (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="https://..." className="bg-zinc-800 border-green/30 text-white" data-testid="input-ad-link" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Contact Phone (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="069 702 6088" className="bg-zinc-800 border-green/30 text-white" data-testid="input-ad-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Contact Email (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" value={field.value || ""} placeholder="business@example.com" className="bg-zinc-800 border-green/30 text-white" data-testid="input-ad-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Display Order</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        className="bg-zinc-800 border-green/30 text-white" 
                        data-testid="input-ad-order"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
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
                      <input 
                        type="checkbox" 
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4" 
                        data-testid="checkbox-ad-active" 
                      />
                    </FormControl>
                    <FormLabel className="text-white mb-0">Active</FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3 pt-4 border-t border-green/30">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-green/30 text-white hover:bg-zinc-800"
                  data-testid="button-cancel-ad"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gold hover:bg-gold-dark text-black"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-ad"
                >
                  {editingAd ? "Update Advertisement" : "Create Advertisement"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
