import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";

const unverifiedSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().min(2, "Please enter your location"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  description: z.string().min(20, "Please provide a brief description (minimum 20 characters)"),
  yearsExperience: z.number().min(0, "Please enter years of experience").max(50, "Years of experience must be 50 or less"),
});

type UnverifiedFormData = z.infer<typeof unverifiedSchema>;

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

export default function UnverifiedRegistrationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<UnverifiedFormData>({
    resolver: zodResolver(unverifiedSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      services: [],
      description: "",
      yearsExperience: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: UnverifiedFormData) => {
      return await apiRequest("POST", "/api/artisans/unverified", {
        ...data,
        verified: false,
        subscriptionTier: "unverified",
        approvalStatus: "approved", // Unverified profiles are auto-approved
      });
    },
    onSuccess: (response) => {
      setIsSuccess(true);
      toast({
        title: "Profile Created Successfully!",
        description: "Your unverified artisan profile is now live. You can start receiving inquiries from clients.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/artisans"] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UnverifiedFormData) => {
    createMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green" />
        </div>
        <h3 className="text-2xl font-bold text-gold mb-4">Profile Created Successfully!</h3>
        <p className="text-white/80 mb-6 max-w-md mx-auto">
          Your unverified artisan profile is now live. Clients can find you and contact you directly.
        </p>
        <Button 
          onClick={() => window.location.href = '/profiles'}
          className="bg-gold hover:bg-yellow-600 text-black"
          data-testid="button-view-profile"
        >
          View All Profiles
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    className="bg-zinc-800 border border-green/30 text-white"
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
                    className="bg-zinc-800 border border-green/30 text-white"
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
                    className="bg-zinc-800 border border-green/30 text-white"
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
                    className="bg-zinc-800 border border-green/30 text-white"
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
                  <SelectTrigger className="bg-zinc-800 border border-green/30 text-white" data-testid="select-location">
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-800 border border-green/30 text-white">
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
                            className="border border-green/30"
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
                  min={0}
                  max={50}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  className="bg-zinc-800 border border-green/30 text-white"
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
              <FormLabel className="text-white">Brief Description *</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  rows={4}
                  placeholder="Tell clients about yourself and your services..."
                  className="bg-zinc-800 border border-green/30 text-white"
                  data-testid="textarea-description"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-3 text-lg"
          disabled={createMutation.isPending}
          data-testid="button-submit-unverified"
        >
          {createMutation.isPending ? "Creating Profile..." : "Create Free Profile"}
        </Button>
      </form>
    </Form>
  );
}
