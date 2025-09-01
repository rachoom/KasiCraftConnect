import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeInSection from "@/components/FadeInSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function ArtisanLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await apiRequest("/api/artisan/login", data);
    },
    onSuccess: (data: any) => {
      if (data.success && data.token) {
        // Store the JWT token
        localStorage.setItem('artisan_token', data.token);
        localStorage.setItem('artisan_user', JSON.stringify(data.artisan));
        
        setIsSuccess(true);
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${data.artisan.firstName}!`,
        });

        // Redirect to artisan dashboard after a brief delay
        setTimeout(() => {
          setLocation('/artisan/dashboard');
        }, 2000);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your email and password and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-soft">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Login Successful!</h2>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-soft">
      <Header />
      
      <main className="py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mb-8">
              <Link href="/artisan">
                <Button variant="ghost" className="text-gold hover:text-gold-dark mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Artisan Options
                </Button>
              </Link>
            </div>

            <Card className="shadow-lg border-0">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-black-soft mb-2">
                  Artisan Login
                </CardTitle>
                <p className="text-gray-600">
                  Sign in to manage your Skills Connect profile
                </p>
              </CardHeader>
              
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black-soft">Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Enter your email"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black-soft">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="password"
                                placeholder="Enter your password"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-3 text-lg"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/register-artisan" className="text-gold hover:text-gold-dark font-medium">
                      Register as an Artisan
                    </Link>
                  </p>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">New to Skills Connect?</p>
                      <p>After registering, you'll receive an email verification link. Please check your email and verify your account before logging in.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInSection>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}