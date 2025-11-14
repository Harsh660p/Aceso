import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { User, Star, MapPin, Clock, Video, IndianRupee, CheckCircle } from "lucide-react";

interface Therapist {
  id: string;
  name: string;
  initials: string;
  specialization: string[];
  experience: number;
  languages: string[];
  location: string;
  sessionType: string[];
  rating: number;
  totalReviews: number;
  pricePerSession: number;
  availability: string;
  bio: string;
}

const therapists: Therapist[] = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    initials: "PS",
    specialization: ["Anxiety", "Depression", "Stress Management"],
    experience: 12,
    languages: ["English", "Hindi", "Marathi"],
    location: "Mumbai, Maharashtra",
    sessionType: ["Video", "In-Person"],
    rating: 4.9,
    totalReviews: 156,
    pricePerSession: 1500,
    availability: "Mon-Sat, 9 AM - 6 PM",
    bio: "Clinical psychologist specializing in cognitive behavioral therapy and mindfulness-based interventions. Passionate about helping individuals overcome anxiety and depression."
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    initials: "RK",
    specialization: ["Relationship Counseling", "Family Therapy", "Trauma"],
    experience: 15,
    languages: ["English", "Hindi", "Tamil"],
    location: "Bangalore, Karnataka",
    sessionType: ["Video", "In-Person"],
    rating: 4.8,
    totalReviews: 203,
    pricePerSession: 1800,
    availability: "Tue-Sun, 10 AM - 7 PM",
    bio: "Marriage and family therapist with expertise in systemic therapy and trauma-informed care. Dedicated to helping couples and families build stronger relationships."
  },
  {
    id: "3",
    name: "Dr. Anjali Patel",
    initials: "AP",
    specialization: ["Work Stress", "Burnout", "Career Counseling"],
    experience: 8,
    languages: ["English", "Hindi", "Gujarati"],
    location: "Ahmedabad, Gujarat",
    sessionType: ["Video"],
    rating: 4.7,
    totalReviews: 98,
    pricePerSession: 1200,
    availability: "Mon-Fri, 6 PM - 10 PM",
    bio: "Organizational psychologist specializing in workplace mental health and career transitions. Helping professionals find work-life balance and career fulfillment."
  },
  {
    id: "4",
    name: "Dr. Vikram Mehta",
    initials: "VM",
    specialization: ["OCD", "Phobias", "Panic Disorders"],
    experience: 10,
    languages: ["English", "Hindi", "Punjabi"],
    location: "Delhi NCR",
    sessionType: ["Video", "In-Person"],
    rating: 4.9,
    totalReviews: 174,
    pricePerSession: 1600,
    availability: "Mon-Sat, 8 AM - 8 PM",
    bio: "Specialized in exposure and response prevention therapy for OCD and anxiety disorders. Evidence-based approach with compassionate care."
  },
  {
    id: "5",
    name: "Dr. Meera Reddy",
    initials: "MR",
    specialization: ["Teen Counseling", "Academic Stress", "Self-Esteem"],
    experience: 9,
    languages: ["English", "Hindi", "Telugu"],
    location: "Hyderabad, Telangana",
    sessionType: ["Video", "In-Person"],
    rating: 4.8,
    totalReviews: 142,
    pricePerSession: 1400,
    availability: "Mon-Sat, 3 PM - 9 PM",
    bio: "Child and adolescent psychologist passionate about supporting young people through academic pressures and identity development."
  },
  {
    id: "6",
    name: "Dr. Arjun Nair",
    initials: "AN",
    specialization: ["Addiction", "Substance Abuse", "Recovery Support"],
    experience: 14,
    languages: ["English", "Hindi", "Malayalam"],
    location: "Kochi, Kerala",
    sessionType: ["Video", "In-Person"],
    rating: 4.9,
    totalReviews: 189,
    pricePerSession: 1700,
    availability: "Daily, 9 AM - 6 PM",
    bio: "Addiction specialist with extensive experience in de-addiction programs and relapse prevention. Compassionate approach to recovery."
  }
];

export default function Therapists() {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const { toast } = useToast();

  const handleBookAppointment = () => {
    if (!selectedDate) {
      toast({
        title: "Select a date",
        description: "Please select a date for your appointment.",
        variant: "destructive",
      });
      return;
    }

    setIsBookingConfirmed(true);
    toast({
      title: "Appointment Requested",
      description: `Your appointment request with ${selectedTherapist?.name} has been sent. You'll receive confirmation shortly.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Find a Therapist</h1>
          <p className="text-muted-foreground leading-relaxed">
            Connect with licensed mental health professionals across India
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {therapists.map((therapist) => (
            <Card key={therapist.id} className="hover-elevate" data-testid={`card-therapist-${therapist.id}`}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {therapist.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{therapist.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{therapist.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({therapist.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {therapist.specialization.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{therapist.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{therapist.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    <span>₹{therapist.pricePerSession}/session</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {therapist.sessionType.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type === "Video" && <Video className="h-3 w-3 mr-1" />}
                      {type}
                    </Badge>
                  ))}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedTherapist(therapist);
                        setIsBookingConfirmed(false);
                        setSelectedDate(undefined);
                      }}
                      data-testid={`button-book-${therapist.id}`}
                    >
                      Book Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {isBookingConfirmed ? (
                      <div className="py-8 space-y-6 text-center">
                        <div className="flex justify-center">
                          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-semibold">Appointment Requested!</h3>
                          <p className="text-muted-foreground">
                            Your appointment request with {selectedTherapist?.name} has been sent.
                          </p>
                        </div>
                        <div className="bg-muted p-4 rounded-md space-y-2 text-left">
                          <p><span className="font-medium">Date:</span> {selectedDate?.toLocaleDateString()}</p>
                          <p><span className="font-medium">Therapist:</span> {selectedTherapist?.name}</p>
                          <p><span className="font-medium">Fee:</span> ₹{selectedTherapist?.pricePerSession}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You'll receive a confirmation email with payment details and session link within 24 hours.
                        </p>
                      </div>
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle>Book Appointment with {selectedTherapist?.name}</DialogTitle>
                          <DialogDescription>{selectedTherapist?.specialization.join(", ")}</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          <div className="space-y-3">
                            <h3 className="font-medium">About</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{selectedTherapist?.bio}</p>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <h3 className="font-medium text-sm">Experience</h3>
                              <p className="text-sm text-muted-foreground">{selectedTherapist?.experience} years</p>
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-medium text-sm">Languages</h3>
                              <p className="text-sm text-muted-foreground">{selectedTherapist?.languages.join(", ")}</p>
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-medium text-sm">Availability</h3>
                              <p className="text-sm text-muted-foreground">{selectedTherapist?.availability}</p>
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-medium text-sm">Session Fee</h3>
                              <p className="text-sm text-muted-foreground">₹{selectedTherapist?.pricePerSession} per session</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h3 className="font-medium">Select a Date</h3>
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date()}
                              className="rounded-md border"
                              data-testid="calendar-booking"
                            />
                          </div>

                          <Button
                            className="w-full"
                            size="lg"
                            onClick={handleBookAppointment}
                            data-testid="button-confirm-booking"
                          >
                            Confirm Appointment
                          </Button>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
