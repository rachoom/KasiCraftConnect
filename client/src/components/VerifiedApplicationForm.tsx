import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Upload, FileText } from "lucide-react";

const verifiedSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().min(2, "Please enter your location"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  description: z.string().min(50, "Please provide a detailed description (minimum 50 characters)"),
  yearsExperience: z.number().min(1, "Please enter years of experience").max(50, "Years of experience must be 50 or less"),
  subscriptionTier: z.enum(["verified", "premium"]),
  idDocument: z.string().optional(),
  qualificationDocuments: z.array(z.string()).optional(),
});

type VerifiedFormData = z.infer<typeof verifiedSchema>;

const serviceOptions = [
  { id: "builders", label: "Builder" },
  { id: "plumbers", label: "Plumber" },
  { id: "electricians", label: "Electrician" },
  { id: "carpenters", label: "Carpenter" },
  { id: "tilers", label: "Tiler" },
  { id: "cleaners", label: "Cleaner" },
  { id: "landscapers", label: "Landscaper" },
  { id: "painters", label: "Painter" },
  { id: "mechanics", label: "Mechanic" },
];

const locations = [
  "Springs, Ekurhuleni", "Alberton, Ekurhuleni", "Benoni, Ekurhuleni", "Daveyton, Ekurhuleni",
  "Germiston, Ekurhuleni", "Boksburg, Ekurhuleni", "Kempton Park, Ekurhuleni", "Edenvale, Ekurhuleni",
  "Brakpan, Ekurhuleni", "Nigel, Ekurhuleni", "Tembisa, Ekurhuleni", "Duduza, Ekurhuleni",
  "Thokoza, Ekurhuleni", "Katlehong, Ekurhuleni", "Vosloorus, Ekurhuleni"
];

export default function VerifiedApplicationForm() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedIdDoc, setUploadedIdDoc] = useState<string>("");
  const [uploadedQualDocs, setUploadedQualDocs] = useState<string[]>([]);

  const form = useForm<VerifiedFormData>({
    resolver: zodResolver(verifiedSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      services: [],
      description: "",
      yearsExperience: 1,
      subscriptionTier: "verified",
      idDocument: "",
      qualificationDocuments: [],
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: VerifiedFormData) => {
      return await apiRequest("POST", "/api/artisans/verified", {
        ...data,
        verified: false, // Will be set to true upon admin approval
        approvalStatus: "pending",
        verificationStatus: "pending",
      });
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: "Application Submitted Successfully!",
        description: "We'll review your application within 2-3 business days and contact you via email.",
      });
      form.reset();
      setUploadedIdDoc("");
      setUploadedQualDocs([]);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VerifiedFormData) => {
    const submissionData = {
      ...data,
      idDocument: uploadedIdDoc,
      qualificationDocuments: uploadedQualDocs,
    };
    submitMutation.mutate(submissionData);
  };

  const handleFileUpload = async (file: File, type: 'id' | 'qualification') => {
    try {
      // Get upload URL from backend
      const response: any = await apiRequest("POST", "/api/documents/upload", { documentType: type });
      const { uploadURL } = response;

      // Upload file to the provided URL
      await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      // Extract the document path from the upload URL
      const urlParts = new URL(uploadURL);
      const documentPath = urlParts.pathname;

      if (type === 'id') {
        setUploadedIdDoc(documentPath);
        toast({
          title: "ID Document Uploaded",
          description: "Your ID document has been uploaded successfully.",
        });
      } else {
        setUploadedQualDocs([...uploadedQualDocs, documentPath]);
        toast({
          title: "Qualification Document Uploaded",
          description: "Your qualification document has been uploaded successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gold mb-4">Application Submitted!</h3>
        <p className="text-white/80 mb-4 max-w-md mx-auto">
          Thank you for applying to become a verified artisan. Our team will review your application and supporting documents within 2-3 business days.
        </p>
        <p className="text-white/80 mb-6 max-w-md mx-auto">
          We'll contact you via email with the next steps, including payment details once your application is approved.
        </p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-gold hover:bg-yellow-600 text-black"
          data-testid="button-back-home"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Tier Selection */}
        <FormField
          control={form.control}
          name="subscriptionTier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Select Your Tier *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <div className={`border border-gold/30 rounded-lg p-4 cursor-pointer transition-all ${
                    field.value === 'verified' ? 'bg-gold/10 shadow-lg' : ''
                  }`}>
                    <RadioGroupItem value="verified" id="tier-verified" className="sr-only" />
                    <label htmlFor="tier-verified" className="cursor-pointer" data-testid="radio-tier-verified">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gold">Verified</h4>
                        <span className="text-gold font-bold">R100/month</span>
                      </div>
                      <p className="text-sm text-white/80">Priority placement, verified badge, photo gallery, reviews</p>
                    </label>
                  </div>

                  <div className={`border border-gold/30 rounded-lg p-4 cursor-pointer transition-all ${
                    field.value === 'premium' ? 'bg-gold/10 shadow-lg' : ''
                  }`}>
                    <RadioGroupItem value="premium" id="tier-premium" className="sr-only" />
                    <label htmlFor="tier-premium" className="cursor-pointer" data-testid="radio-tier-premium">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-purple-400">Verified + Marketing</h4>
                        <span className="text-purple-400 font-bold">R299/month</span>
                      </div>
                      <p className="text-sm text-white/80">All Verified benefits + marketing support</p>
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">First Name *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-zinc-800 border border-gold/30 text-white"
                    data-testid="input-firstName"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Last Name *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-zinc-800 border border-gold/30 text-white"
                    data-testid="input-lastName"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email Address *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email"
                    className="bg-zinc-800 border border-gold/30 text-white"
                    data-testid="input-email"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Phone Number *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="tel"
                    className="bg-zinc-800 border border-gold/30 text-white"
                    data-testid="input-phone"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Location *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-zinc-800 border border-gold/30 text-white" data-testid="select-location">
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-800 border border-gold/30 text-white">
                  {locations.map((location) => (
                    <SelectItem key={location} value={location} className="text-white focus:bg-gold/20 focus:text-white">
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="services"
          render={() => (
            <FormItem>
              <FormLabel className="text-white">Services Offered *</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {serviceOptions.map((service) => (
                  <FormField
                    key={service.id}
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(service.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), service.id]
                                : (field.value || []).filter((val) => val !== service.id);
                              field.onChange(updatedValue);
                            }}
                            className="border border-gold/30"
                            data-testid={`checkbox-service-${service.id}`}
                          />
                        </FormControl>
                        <FormLabel className="text-sm text-white font-normal cursor-pointer">
                          {service.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearsExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Years of Experience *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number"
                  min={1}
                  max={50}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  className="bg-zinc-800 border border-gold/30 text-white"
                  data-testid="input-yearsExperience"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Detailed Description *</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  rows={6}
                  placeholder="Tell clients about your experience, specializations, and what makes you stand out..."
                  className="bg-zinc-800 border border-gold/30 text-white"
                  data-testid="textarea-description"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {/* Document Uploads */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gold">Supporting Documents</h3>
          
          <div className="space-y-2">
            <label className="text-white">ID Document (Optional)</label>
            <div className="flex items-center gap-4">
              <Input 
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'id');
                }}
                className="bg-zinc-800 border border-gold/30 text-white"
                data-testid="input-id-document"
              />
              {uploadedIdDoc && (
                <FileText className="w-6 h-6 text-green-500" />
              )}
            </div>
            <p className="text-xs text-white/60">Upload a copy of your ID (PDF, JPG, or PNG, max 5MB)</p>
          </div>

          <div className="space-y-2">
            <label className="text-white">Qualification Documents (Optional)</label>
            <div className="flex items-center gap-4">
              <Input 
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'qualification');
                }}
                className="bg-zinc-800 border border-gold/30 text-white"
                data-testid="input-qualification-documents"
              />
              {uploadedQualDocs.length > 0 && (
                <span className="text-green-500">{uploadedQualDocs.length} file(s) uploaded</span>
              )}
            </div>
            <p className="text-xs text-white/60">Upload certificates, licenses, or proof of past work</p>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <p className="text-sm text-yellow-200">
            <strong>Note:</strong> Once approved, payment details will be sent to you via email. All payments are handled offline for now.
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-3 text-lg"
          disabled={submitMutation.isPending}
          data-testid="button-submit-verified"
        >
          {submitMutation.isPending ? "Submitting Application..." : "Submit Application for Review"}
        </Button>
      </form>
    </Form>
  );
}
