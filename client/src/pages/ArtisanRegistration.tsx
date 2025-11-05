import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { insertArtisanSchema, type InsertArtisan } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeInSection from "@/components/FadeInSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, MapPin, Locate, Upload, FileText, AlertCircle } from "lucide-react";

const serviceOptions = [
  { id: "builders", label: "Builder" },
  { id: "plumbers", label: "Plumber" },
  { id: "electricians", label: "Electrician" },
  { id: "carpenters", label: "Carpenter" },
  { id: "tilers", label: "Tiler" },
  { id: "cleaners", label: "Cleaner" },
  { id: "landscapers", label: "Landscaper" },
  { id: "mechanics", label: "Mechanic" },
];

const locations = [
  "Springs, Ekurhuleni", "Alberton, Ekurhuleni", "Benoni, Ekurhuleni", "Daveyton, Ekurhuleni",
  "Germiston, Ekurhuleni", "Boksburg, Ekurhuleni", "Kempton Park, Ekurhuleni", "Edenvale, Ekurhuleni",
  "Brakpan, Ekurhuleni", "Nigel, Ekurhuleni", "Tembisa, Ekurhuleni", "Duduza, Ekurhuleni",
  "Thokoza, Ekurhuleni", "Katlehong, Ekurhuleni", "Vosloorus, Ekurhuleni"
];

export default function ArtisanRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [uploadedIdDocument, setUploadedIdDocument] = useState<string>("");
  const [uploadedQualificationDocs, setUploadedQualificationDocs] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const locationInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (value: string) => {
    if (value.length > 0) {
      const filtered = locations.filter(l => 
        l.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocation = (selectedLocation: string) => {
    form.setValue("location", selectedLocation);
    setShowLocationSuggestions(false);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Fallback to Gauteng areas based on coordinates (no API key needed)
          if (latitude >= -26.5 && latitude <= -25.5 && longitude >= 27.5 && longitude <= 28.5) {
            form.setValue("location", "Johannesburg, Gauteng");
          } else if (latitude >= -26.3 && latitude <= -26.0 && longitude >= 28.0 && longitude <= 28.5) {
            form.setValue("location", "Ekurhuleni, Gauteng");
          } else if (latitude >= -25.9 && latitude <= -25.6 && longitude >= 28.1 && longitude <= 28.4) {
            form.setValue("location", "Pretoria, Gauteng");
          } else {
            form.setValue("location", "Gauteng, South Africa");
          }
          
          toast({
            title: "Location Set",
            description: "Your location has been automatically detected",
          });
        } catch (error) {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Could not detect your location",
            variant: "destructive",
          });
        } finally {
          setIsGeolocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsGeolocating(false);
        toast({
          title: "Location Error",
          description: "Could not access your location",
          variant: "destructive",
        });
      }
    );
  };

  const form = useForm<InsertArtisan>({
    resolver: zodResolver(insertArtisanSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      services: [],
      description: "",
      yearsExperience: 1,
      profileImage: "",
      portfolio: [],
      idDocument: "",
      qualificationDocuments: [],
    },
  });

  // Document upload handlers (for now, just simulate upload)
  const handleIdDocumentUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const fileName = `id_${Date.now()}_${file.name}`;
      setUploadedIdDocument(fileName);
      form.setValue("idDocument", fileName);
      toast({
        title: "ID Document Selected",
        description: "Your ID document is ready for upload. It will be processed when you submit the form.",
      });
    }
  };

  const handleQualificationDocUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const fileNames = fileList.map(file => `qualification_${Date.now()}_${file.name}`);
      const newDocs = [...uploadedQualificationDocs, ...fileNames];
      setUploadedQualificationDocs(newDocs);
      form.setValue("qualificationDocuments", newDocs);
      toast({
        title: "Qualification Documents Selected",
        description: `${fileList.length} document(s) selected and ready for upload.`,
      });
    }
  };

  const registerMutation = useMutation({
    mutationFn: async (data: InsertArtisan) => {
      const response = await fetch("/api/artisans", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${response.status}: ${JSON.stringify(errorData)}`);
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      setErrorMessage(""); // Clear any previous errors
      queryClient.invalidateQueries({ queryKey: ["/api/artisans"] });
      toast({
        title: "Registration Successful!",
        description: "Your profile has been submitted and we'll contact you with login details via email.",
      });
    },
    onError: (error: any) => {
      let parsedErrorMessage = "There was an error creating your profile. Please try again.";
      
      // Parse error message from API response
      if (error.message) {
        try {
          const match = error.message.match(/^\d+:\s*(.+)/);
          if (match) {
            const responseText = match[1];
            const errorData = JSON.parse(responseText);
            parsedErrorMessage = errorData.error || errorData.message || parsedErrorMessage;
          }
        } catch (parseError) {
          console.error("Error parsing error message:", parseError);
        }
      }
      
      // Set error message for display in the form
      setErrorMessage(parsedErrorMessage);
      
      // Also show toast notification
      toast({
        title: "Registration Failed",
        description: parsedErrorMessage,
        variant: "destructive",
      });
      console.error("Registration error:", error);
    },
  });

  const onSubmit = (data: InsertArtisan) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", form.formState.errors);
    // Clear any existing error messages when submitting
    setErrorMessage("");
    registerMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-black-soft mb-4">
                Registration Successful!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for joining Kasi Connect! Your profile has been submitted for review. 
                We'll contact you within 2-3 business days once your profile is verified.
              </p>
              <div className="space-y-3">
                <Link href="/">
                  <Button className="bg-green hover:bg-green-dark text-white w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/artisan">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Artisan Options
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-black-soft">
              Join Skills Connect as an Artisan
            </CardTitle>
            <p className="text-gray-600">
              Fill out this form to create your artisan profile and start connecting with customers.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Error Message Display */}
                {errorMessage && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 font-medium" style={{fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"}}>
                      <strong className="font-semibold">Registration Failed:</strong>
                      <div className="mt-1 text-sm leading-relaxed">
                        {errorMessage}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black-soft">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
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
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+27 XX XXX XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative" ref={locationInputRef}>
                            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                            <Input 
                              placeholder="City, Province" 
                              className="pl-12 pr-16"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleLocationChange(e.target.value);
                              }}
                              onFocus={() => setShowLocationSuggestions(field.value.length > 0)}
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="p-2 hover:bg-gold/10"
                                onClick={handleGeolocation}
                                disabled={isGeolocating}
                              >
                                <Locate className={`w-4 h-4 text-gold ${isGeolocating ? 'animate-pulse' : ''}`} />
                              </Button>
                            </div>
                            
                            {showLocationSuggestions && locationSuggestions.length > 0 && (
                              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                                {locationSuggestions.map((suggestion, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    className="w-full text-left px-4 py-3 hover:bg-gold/10 transition-colors first:rounded-t-lg last:rounded-b-lg text-gray-900"
                                    onClick={() => selectLocation(suggestion)}
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3">Account Security</h4>
                    <div>
                      <Label htmlFor="account-email" className="text-sm font-medium text-blue-900">Email Address</Label>
                      <Input
                        id="account-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={form.watch("email") || ""}
                        disabled
                        className="mt-1 bg-gray-100"
                      />
                      <p className="text-xs text-blue-700 mt-2">
                        Your profile will be created and we'll send you login instructions via email.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black-soft">Professional Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="services"
                    render={() => (
                      <FormItem>
                        <FormLabel>Services You Offer</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-3">
                            {serviceOptions.map((service) => (
                              <div key={service.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={service.id}
                                  checked={form.watch("services").includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    const currentServices = form.getValues("services");
                                    if (checked) {
                                      form.setValue("services", [...currentServices, service.id]);
                                    } else {
                                      form.setValue("services", currentServices.filter(s => s !== service.id));
                                    }
                                  }}
                                />
                                <Label htmlFor={service.id}>{service.label}</Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearsExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="50" 
                            placeholder="5" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
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
                        <FormLabel>Professional Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your skills, experience, and what makes you unique..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Verification Documents */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black-soft">Verification Documents</h3>
                  <p className="text-sm text-gray-600">
                    Upload verification documents to become eligible for premium tier listings. 
                    These documents will be reviewed by our team for verification.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">ID Document (Optional)</Label>
                      <div className="mt-2">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> your ID document
                              </p>
                              <p className="text-xs text-gray-500">JPG, PNG or PDF (max 5MB)</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleIdDocumentUpload(e.target.files)}
                              disabled={registerMutation.isPending}
                            />
                          </label>
                        </div>
                        {uploadedIdDocument && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-green">
                            <CheckCircle className="w-4 h-4" />
                            <span>ID document selected: {uploadedIdDocument.split('_').pop()}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload your South African ID document for identity verification. Accepted formats: JPG, PNG, PDF (max 5MB).
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Qualification Documents (Optional)</Label>
                      <div className="mt-2">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FileText className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> qualification documents
                              </p>
                              <p className="text-xs text-gray-500">JPG, PNG or PDF (max 5MB each, up to 5 files)</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.jpg,.jpeg,.png"
                              multiple
                              onChange={(e) => handleQualificationDocUpload(e.target.files)}
                              disabled={registerMutation.isPending}
                            />
                          </label>
                        </div>
                        {uploadedQualificationDocs.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-sm text-green mb-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>{uploadedQualificationDocs.length} document(s) selected</span>
                            </div>
                            {uploadedQualificationDocs.slice(0, 3).map((doc, index) => (
                              <p key={index} className="text-xs text-gray-600">
                                • {doc.split('_').pop()}
                              </p>
                            ))}
                            {uploadedQualificationDocs.length > 3 && (
                              <p className="text-xs text-gray-600">
                                • And {uploadedQualificationDocs.length - 3} more...
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload trade certificates, licenses, or relevant qualifications. Accepted formats: JPG, PNG, PDF (max 5MB each, up to 5 files).
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Verification Benefits</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Access to premium tier listings (R99 per search)</li>
                      <li>• Higher visibility in search results</li>
                      <li>• Verified badge on your profile</li>
                      <li>• Access to enterprise clients</li>
                    </ul>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green hover:bg-green-dark text-white"
                  disabled={registerMutation.isPending}
                  onClick={(e) => {
                    console.log("Button clicked");
                    console.log("Form valid:", form.formState.isValid);
                    console.log("Form errors:", form.formState.errors);
                    // Don't prevent default - let the form handle submission
                  }}
                >
                  {registerMutation.isPending ? "Creating Profile..." : "Create Artisan Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
