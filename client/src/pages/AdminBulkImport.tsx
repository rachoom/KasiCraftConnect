import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, Download, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertArtisan } from "@shared/schema";

export default function AdminBulkImport() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csvData, setCsvData] = useState("");
  const [importResults, setImportResults] = useState<{ success: number; errors: string[] } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Simple admin authentication
  const handleAdminAuth = () => {
    if (adminKey === "kasi-admin-2024") {
      setIsAuthenticated(true);
      toast({
        title: "Admin Access Granted",
        description: "You can now access the bulk import functionality.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin key.",
        variant: "destructive",
      });
    }
  };

  const importMutation = useMutation({
    mutationFn: async (artisans: InsertArtisan[]) => {
      const results = { success: 0, errors: [] as string[] };
      
      for (let i = 0; i < artisans.length; i++) {
        try {
          await apiRequest("POST", `/api/artisans`, artisans[i]);
          results.success++;
        } catch (error) {
          results.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      return results;
    },
    onSuccess: (results) => {
      setImportResults(results);
      queryClient.invalidateQueries({ queryKey: ["/api/artisans"] });
      
      if (results.success > 0) {
        toast({
          title: "Import completed",
          description: `Successfully imported ${results.success} artisan(s)`,
        });
      }
      
      if (results.errors.length > 0) {
        toast({
          title: "Some imports failed",
          description: `${results.errors.length} artisan(s) failed to import`,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Import failed",
        description: "There was an error processing the bulk import",
        variant: "destructive",
      });
    },
  });

  const parseCsvData = (csv: string): InsertArtisan[] => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const artisan: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        switch (header.toLowerCase()) {
          case 'firstname':
          case 'first_name':
            artisan.firstName = value;
            break;
          case 'lastname':
          case 'last_name':
            artisan.lastName = value;
            break;
          case 'email':
            artisan.email = value;
            break;
          case 'phone':
            artisan.phone = value;
            break;
          case 'location':
            artisan.location = value;
            break;
          case 'services':
            artisan.services = value.split(';').map(s => s.trim()).filter(Boolean);
            break;
          case 'description':
            artisan.description = value;
            break;
          case 'yearsexperience':
          case 'years_experience':
            artisan.yearsExperience = parseInt(value) || 0;
            break;
          case 'profileimage':
          case 'profile_image':
            artisan.profileImage = value || null;
            break;
          case 'portfolio':
            artisan.portfolio = value ? value.split(';').map(s => s.trim()).filter(Boolean) : [];
            break;
          case 'iddocument':
          case 'id_document':
            artisan.idDocument = value || null;
            break;
          case 'qualificationdocuments':
          case 'qualification_documents':
            artisan.qualificationDocuments = value ? value.split(';').map(s => s.trim()).filter(Boolean) : [];
            break;
        }
      });
      
      return artisan as InsertArtisan;
    });
  };

  const handleImport = () => {
    if (!csvData.trim()) {
      toast({
        title: "No data provided",
        description: "Please paste CSV data before importing",
        variant: "destructive",
      });
      return;
    }

    try {
      const artisans = parseCsvData(csvData);
      if (artisans.length === 0) {
        toast({
          title: "No valid data",
          description: "No artisan records found in the CSV data",
          variant: "destructive",
        });
        return;
      }

      importMutation.mutate(artisans);
    } catch (error) {
      toast({
        title: "Invalid CSV format",
        description: "Please check your CSV data format",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-gold" />
            </div>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              Enter the admin key to access bulk import functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAdminAuth()}
              />
              <Button 
                onClick={handleAdminAuth}
                className="w-full bg-gold hover:bg-gold-dark text-black cosmic-glow-static"
              >
                Authenticate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const downloadTemplate = () => {
    const template = `firstName,lastName,email,phone,location,services,description,yearsExperience,profileImage,portfolio,idDocument,qualificationDocuments
John,Doe,john.doe@email.com,+27 82 123 4567,"Cape Town, Western Cape",builders;carpenters,"Experienced builder with 10+ years in residential construction",10,JD,"project1.jpg;project2.jpg",id_001.pdf,"cert1.pdf;cert2.pdf"
Jane,Smith,jane.smith@email.com,+27 83 456 7890,"Johannesburg, Gauteng",electricians,"Certified electrician specializing in smart home installations",8,JS,portfolio1.jpg,id_002.pdf,electrical_cert.pdf`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'artisan_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black-soft mb-4">Admin - Bulk Artisan Import</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Administrative access to bulk import artisan data.
          </p>
        </div>

        <div className="space-y-8">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Import Instructions</span>
              </CardTitle>
              <CardDescription>
                Follow these steps to import artisan data successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Required Fields:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• firstName</li>
                    <li>• lastName</li>
                    <li>• email (must be unique)</li>
                    <li>• phone</li>
                    <li>• location</li>
                    <li>• services (semicolon separated)</li>
                    <li>• description</li>
                    <li>• yearsExperience (number)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Optional Fields:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• profileImage</li>
                    <li>• portfolio (semicolon separated)</li>
                    <li>• idDocument</li>
                    <li>• qualificationDocuments (semicolon separated)</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={downloadTemplate}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Template</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CSV Input */}
          <Card>
            <CardHeader>
              <CardTitle>CSV Data</CardTitle>
              <CardDescription>
                Paste your CSV data below (include headers in the first row)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="firstName,lastName,email,phone,location,services,description,yearsExperience
John,Doe,john.doe@email.com,+27 82 123 4567,Cape Town,builders,Experienced builder,10"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              
              <div className="mt-4">
                <Button 
                  onClick={handleImport}
                  disabled={importMutation.isPending || !csvData.trim()}
                  className="bg-gold hover:bg-gold-dark text-black cosmic-glow-static"
                >
                  {importMutation.isPending ? "Importing..." : "Import Artisans"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {importResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {importResults.errors.length === 0 ? (
                    <CheckCircle className="w-5 h-5 text-green" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                  <span>Import Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green/10 text-green-dark px-3 py-1 rounded-full text-sm">
                      ✓ {importResults.success} successful
                    </div>
                    {importResults.errors.length > 0 && (
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        ✗ {importResults.errors.length} failed
                      </div>
                    )}
                  </div>
                  
                  {importResults.errors.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-red-800">Errors:</h4>
                      <ul className="text-sm text-red-600 space-y-1">
                        {importResults.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}