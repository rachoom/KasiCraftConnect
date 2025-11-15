import { useState, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Edit, User, Shield, CheckCircle, XCircle, Upload } from "lucide-react";
import { getInitials } from "@/lib/utils";
import type { Artisan } from "@shared/schema";

export default function AdminManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingArtisan, setEditingArtisan] = useState<Artisan | null>(null);
  const [formData, setFormData] = useState<Partial<Artisan>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: artisans = [], isLoading } = useQuery<Artisan[]>({
    queryKey: ["/api/admin/artisans"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/artisans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch artisans");
      return response.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Artisan> }) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/artisan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update artisan");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Artisan profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/artisans"] });
      setEditingArtisan(null);
      setFormData({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update artisan profile",
        variant: "destructive",
      });
    },
  });

  const filteredArtisans = useMemo(() => {
    return artisans.filter((artisan) => {
      const matchesSearch = 
        searchTerm === "" ||
        `${artisan.firstName} ${artisan.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTier = filterTier === "all" || artisan.subscriptionTier === filterTier;
      const matchesStatus = 
        filterStatus === "all" || 
        (filterStatus === "verified" && artisan.verified) ||
        (filterStatus === "unverified" && !artisan.verified);

      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [artisans, searchTerm, filterTier, filterStatus]);

  const handleEdit = (artisan: Artisan) => {
    setEditingArtisan(artisan);
    setFormData({ ...artisan });
  };

  const handleSave = () => {
    if (editingArtisan) {
      console.log("Saving artisan with formData:", { 
        id: editingArtisan.id, 
        profileImage: formData.profileImage,
        otherFields: Object.keys(formData).length
      });
      updateMutation.mutate({ id: editingArtisan.id, updates: formData });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Profile image must be less than 5MB",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile || !editingArtisan) return;

    setUploadingImage(true);
    const formDataToSend = new FormData();
    formDataToSend.append('image', selectedFile);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/artisan/${editingArtisan.id}/profile-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      const data = await response.json();
      
      setFormData(prev => ({ ...prev, profileImage: data.url }));
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: "Success",
        description: "Profile image uploaded successfully",
      });
      
      // Refresh artisan list to show new image
      queryClient.invalidateQueries({ queryKey: ["/api/admin/artisans"] });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload profile image",
      });
    } finally {
      setUploadingImage(false);
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">Artisan Management</h1>
          <p className="text-white/80">Manage all artisan profiles and information</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <Input
              placeholder="Search artisans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900 border-green/30 text-white"
              data-testid="input-search-artisans"
            />
          </div>

          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="bg-zinc-900 border-green/30 text-white" data-testid="select-filter-tier">
              <SelectValue placeholder="Filter by tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-zinc-900 border-green/30 text-white" data-testid="select-filter-status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-white/60 mb-4">
          Showing {filteredArtisans.length} of {artisans.length} artisans
        </div>

        <div className="space-y-4">
          {filteredArtisans.map((artisan) => (
            <Card key={artisan.id} className="bg-zinc-900 border-green/30" data-testid={`card-artisan-${artisan.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {artisan.profileImage ? (
                        <img src={artisan.profileImage} alt={`${artisan.firstName} ${artisan.lastName}`} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-8 h-8" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white" data-testid={`text-artisan-name-${artisan.id}`}>
                          {artisan.firstName} {artisan.lastName}
                        </h3>
                        
                        {artisan.subscriptionTier === "premium" && (
                          <Badge className="bg-gold text-black">Premium</Badge>
                        )}
                        {artisan.subscriptionTier === "verified" && (
                          <Badge className="bg-green text-white">Verified</Badge>
                        )}
                        {artisan.subscriptionTier === "unverified" && (
                          <Badge variant="outline" className="border-green/30 text-white/80">Unverified</Badge>
                        )}
                        
                        {artisan.verified ? (
                          <CheckCircle className="w-5 h-5 text-green" />
                        ) : (
                          <XCircle className="w-5 h-5 text-white/40" />
                        )}
                      </div>

                      <p className="text-gold mb-2">
                        {artisan.services.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                      </p>

                      <p className="text-white/60 text-sm mb-2">{artisan.location}</p>
                      <p className="text-white/60 text-sm">{artisan.email} • {artisan.phone}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleEdit(artisan)}
                    className="bg-gold hover:bg-gold-dark text-black"
                    data-testid={`button-edit-${artisan.id}`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArtisans.length === 0 && (
          <Card className="bg-zinc-900 border-green/30">
            <CardContent className="p-12 text-center">
              <p className="text-white/60">No artisans found matching your filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!editingArtisan} onOpenChange={(open) => !open && setEditingArtisan(null)}>
        <DialogContent className="bg-zinc-900 border-green/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gold text-2xl">Edit Artisan Profile</DialogTitle>
            <DialogDescription className="text-white/60">
              Update artisan information and profile picture
            </DialogDescription>
          </DialogHeader>

          {editingArtisan && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center text-white font-bold text-4xl overflow-hidden">
                    {formData.profileImage || editingArtisan.profileImage ? (
                      <img 
                        src={formData.profileImage || editingArtisan.profileImage || ""} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        data-testid="img-profile-preview"
                      />
                    ) : (
                      <User className="w-16 h-16" />
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profile-image-input"
                    />
                    <div className="flex items-center gap-2">
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
                    {selectedFile && (
                      <p className="text-white/70 text-sm">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                    <p className="text-white/60 text-xs">
                      Max 5MB • JPG, PNG, WebP, or GIF
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">First Name</Label>
                  <Input
                    value={formData.firstName || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="bg-zinc-800 border-green/30 text-white"
                    data-testid="input-first-name"
                  />
                </div>

                <div>
                  <Label className="text-white">Last Name</Label>
                  <Input
                    value={formData.lastName || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="bg-zinc-800 border-green/30 text-white"
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-zinc-800 border-green/30 text-white"
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label className="text-white">Phone</Label>
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-zinc-800 border-green/30 text-white"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Location</Label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-zinc-800 border-green/30 text-white"
                  data-testid="input-location"
                />
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-zinc-800 border-green/30 text-white min-h-[120px]"
                  data-testid="textarea-description"
                />
              </div>

              <div>
                <Label className="text-white">Subscription Tier</Label>
                <Select
                  value={formData.subscriptionTier || editingArtisan.subscriptionTier}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subscriptionTier: value as "unverified" | "verified" | "premium" }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-green/30 text-white" data-testid="select-subscription-tier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unverified">Unverified (Free)</SelectItem>
                    <SelectItem value="verified">Verified (R100/month)</SelectItem>
                    <SelectItem value="premium">Premium (R299/month)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Years of Experience</Label>
                <Input
                  type="number"
                  value={formData.yearsExperience || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
                  className="bg-zinc-800 border-green/30 text-white"
                  data-testid="input-years-experience"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-green/30">
                <Button
                  variant="outline"
                  onClick={() => setEditingArtisan(null)}
                  className="border-green/30 text-white hover:bg-zinc-800"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="bg-gold hover:bg-gold-dark text-black"
                  data-testid="button-save"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
