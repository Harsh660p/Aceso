import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Shield, ArrowLeft, AlertCircle, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Connect() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredContact: "email" as "email" | "phone",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Request sent",
      description: "A therapist will contact you within 24 hours.",
    });
  };

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7 free and confidential support",
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Free, 24/7 crisis support via text",
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Treatment referral and information service",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
          <h2 className="text-2xl font-semibold">Request Submitted</h2>

          <Card data-testid="card-submission-confirmation">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Request Submitted</CardTitle>
              <CardDescription>
                We've received your request for professional support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>What happens next?</AlertTitle>
                <AlertDescription className="space-y-2 mt-2">
                  <p>1. A licensed therapist will review your request</p>
                  <p>2. You'll receive a response within 24 hours</p>
                  <p>3. They'll schedule an initial consultation</p>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h3 className="font-medium">Your Contact Information:</h3>
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <p><span className="font-medium">Name:</span> {formData.name}</p>
                  <p><span className="font-medium">Email:</span> {formData.email}</p>
                  {formData.phone && (
                    <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                  )}
                  <p><span className="font-medium">Preferred Contact:</span> {formData.preferredContact}</p>
                </div>
              </div>

              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full"
                data-testid="button-new-request"
              >
                Submit Another Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Connect with a Therapist</h1>
          <p className="text-muted-foreground leading-relaxed">
            Professional mental health support is just a message away
          </p>
        </div>

        <Alert variant="destructive" className="border-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>If you're in crisis</AlertTitle>
          <AlertDescription>
            If you're experiencing a mental health emergency, please contact one of the crisis resources below immediately or call 911.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Request a Consultation</CardTitle>
              <CardDescription>
                Fill out this form and a licensed therapist will contact you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    required
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    data-testid="input-phone"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Tell us about your needs *
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="What brings you here? What kind of support are you looking for?"
                    className="min-h-[120px] resize-none"
                    required
                    data-testid="input-message"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Preferred Contact Method
                  </label>
                  <div className="flex gap-3" data-testid="toggle-contact-method">
                    <Button
                      type="button"
                      variant={formData.preferredContact === "email" ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, preferredContact: "email" })}
                      className="flex-1"
                      data-testid="button-toggle-email"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={formData.preferredContact === "phone" ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, preferredContact: "phone" })}
                      className="flex-1"
                      data-testid="button-toggle-phone"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Phone
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Your privacy is protected</AlertTitle>
                  <AlertDescription>
                    All information is encrypted and HIPAA compliant. Only licensed professionals will access your data.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" size="lg" data-testid="button-submit-therapist-request">
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Crisis Resources
                </CardTitle>
                <CardDescription>
                  Immediate help is available 24/7
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {crisisResources.map((resource) => (
                  <div key={resource.name} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                    <h3 className="font-medium">{resource.name}</h3>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-primary">{resource.phone}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-medium">Response Time</h3>
                    <p className="text-sm text-muted-foreground">
                      A therapist will reach out within 24 hours to schedule your first session
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-medium">Privacy & Security</h3>
                    <p className="text-sm text-muted-foreground">
                      All sessions are confidential and comply with HIPAA regulations
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-medium">Online or In-Person</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose between virtual sessions or in-person appointments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href="https://www.mentalhealth.gov" target="_blank" rel="noopener noreferrer">
                    Mental Health Resources
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href="https://www.samhsa.gov" target="_blank" rel="noopener noreferrer">
                    SAMHSA Treatment Locator
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
