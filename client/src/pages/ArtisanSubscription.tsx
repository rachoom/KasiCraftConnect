import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Check, Star, Shield, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";

const subscriptionSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  location: z.string().min(2, "Please enter your location"),
  description: z.string().min(50, "Please provide a detailed description (minimum 50 characters)"),
  yearsExperience: z.number().min(1, "Please enter years of experience"),
  companyRegNumber: z.string().optional(),
  artisanRegNumber: z.string().optional(),
  subscriptionTier: z.enum(["premium", "enterprise"]),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

const services = [
  "Plumber", "Electrician", "Builder", "Painter", "Carpenter", "Tiler",
  "Roofer", "HVAC Technician", "Landscaper", "Cleaner", "Handyman",
  "Pool Maintenance", "Security System Installer", "Solar Panel Installer"
];

const locations = [
  "Springs, Ekurhuleni", "Alberton, Ekurhuleni", "Benoni, Ekurhuleni", "Daveyton, Ekurhuleni",
  "Germiston, Ekurhuleni", "Boksburg, Ekurhuleni", "Kempton Park, Ekurhuleni", "Edenvale, Ekurhuleni",
  "Brakpan, Ekurhuleni", "Nigel, Ekurhuleni", "Tembisa, Ekurhuleni", "Duduza, Ekurhuleni",
  "Thokoza, Ekurhuleni", "Katlehong, Ekurhuleni", "Vosloorus, Ekurhuleni"
];

export default function ArtisanSubscription() {
  const { toast } = useToast();
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      services: [],
      location: "",
      description: "",
      yearsExperience: 1,
      companyRegNumber: "",
      artisanRegNumber: "",
      subscriptionTier: "premium",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SubscriptionFormData & { documents: string[] }) => {
      return await apiRequest("POST", "/api/artisan-subscription", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted Successfully!",
        description: "Your subscription application has been received. We'll review it within 2-3 business days.",
      });
      form.reset();
      setUploadedDocuments([]);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleDocumentUpload = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await fetch("/api/objects/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error("Failed to get upload URL");
    const { uploadURL } = await response.json();
    return { method: "PUT" as const, url: uploadURL };
  };

  const handleDocumentComplete = (result: { successful: Array<{ uploadURL: string; name: string }> }) => {
    if (result.successful && result.successful.length > 0) {
      const newDocuments = result.successful.map(file => file.uploadURL || "");
      setUploadedDocuments(prev => [...prev, ...newDocuments]);
      toast({
        title: "Document Uploaded",
        description: `${result.successful.length} document(s) uploaded successfully`,
      });
    }
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    if (!data.companyRegNumber && !data.artisanRegNumber) {
      toast({
        title: "Registration Number Required",
        description: "Please provide either a Company Registration Number or Artisan Registration Number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitMutation.mutateAsync({
        ...data,
        documents: uploadedDocuments,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const subscriptionTiers = [
    {
      id: "premium",
      name: "Premium",
      price: "R99",
      period: "one-time",
      features: [
        "Up to 5 verified artisan contacts",
        "Enhanced profile visibility",
        "Customer review system",
        "Basic analytics dashboard"
      ],
      icon: Star,
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "R299",
      period: "monthly",
      features: [
        "Unlimited verified contacts",
        "Priority search placement",
        "Advanced analytics",
        "Direct customer messaging",
        "24/7 support"
      ],
      icon: Shield,
      color: "bg-gradient-to-r from-gold to-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-dark via-purple-900 to-cosmic-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Join as a <span className="text-gold">Premium Artisan</span>
          </h1>
          <p className="text-xl text-white/80">
            Get verified and connect with more customers through our subscription service
          </p>
        </div>

        {/* Subscription Tiers */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {subscriptionTiers.map((tier) => (
            <Card key={tier.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${tier.color}`}>
                      <tier.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{tier.name}</CardTitle>
                      <CardDescription className="text-white/80">
                        {tier.price} {tier.period}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gold text-black">
                    Popular
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-white/80">
                      <Check className="w-4 h-4 text-green mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Registration Form */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Artisan Registration
            </CardTitle>
            <CardDescription className="text-white/80">
              Complete your profile to get verified and start receiving job requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">First Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your first name"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                          />
                        </FormControl>
                        <FormMessage />
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
                            placeholder="Enter your last name"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
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
                            placeholder="your.email@example.com"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                          />
                        </FormControl>
                        <FormMessage />
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
                            placeholder="0XX XXX XXXX"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Service and Location */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Services Offered *</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              if (!field.value.includes(value)) {
                                field.onChange([...field.value, value]);
                              }
                            }}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Select services you offer" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service} value={service}>
                                  {service}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((service) => (
                            <Badge
                              key={service}
                              variant="secondary"
                              className="bg-gold text-black cursor-pointer"
                              onClick={() => {
                                field.onChange(field.value.filter(s => s !== service));
                              }}
                            >
                              {service} ×
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Location *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Select your location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Experience and Description */}
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
                          min="1"
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                        />
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
                      <FormLabel className="text-white">Service Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your services, specializations, and what makes you unique..."
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/70 min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Registration Numbers */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyRegNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Company Registration Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="XXXXXXX/XX"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="artisanRegNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Artisan Registration Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ARN-XXXXXXX"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Subscription Tier Selection */}
                <FormField
                  control={form.control}
                  name="subscriptionTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Subscription Tier *</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select subscription tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="premium">Premium - R99 one-time</SelectItem>
                            <SelectItem value="enterprise">Enterprise - R299/month</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Document Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Upload Documents
                  </h3>
                  <p className="text-white/80 text-sm">
                    Upload your ID, certificates, licenses, or any other relevant documents
                  </p>
                  
                  <ObjectUploader
                    maxNumberOfFiles={5}
                    maxFileSize={10485760}
                    onGetUploadParameters={handleDocumentUpload}
                    onComplete={handleDocumentComplete}
                    buttonClassName="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Documents
                    </div>
                  </ObjectUploader>

                  {uploadedDocuments.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-white/80">Uploaded documents:</p>
                      {uploadedDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center text-green text-sm">
                          <Check className="w-4 h-4 mr-2" />
                          Document {index + 1} uploaded successfully
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green hover:bg-green-dark text-white font-semibold py-3"
                  disabled={isSubmitting || submitMutation.isPending}
                >
                  {isSubmitting || submitMutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}