import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Percent, ShieldCheck, Play, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SurveyMediaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find or fallback to mock details
  const mediaId = id || "MED-002";
  const mediaDetails = {
    id: mediaId,
    type: "LED Billboard",
    location: "Highway Flyover, Junction 4",
    coordinates: "30.7333° N, 76.7794° E",
    lastSurveyDate: "12 days ago (May 15, 2026)",
    compliance: "78%",
    status: "pending",
    inspector: "inspector_ops@outdoors.com",
    notes: "Requires night-time visibility inspection. Check LED brightness."
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 text-neutral-800 dark:text-neutral-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-4 py-4 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/survey")}
          className="hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold">{mediaDetails.type}</h1>
          <p className="text-xs font-mono text-neutral-500">{mediaDetails.id}</p>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6 max-w-lg mx-auto w-full space-y-6">
        {/* Map Preview Mock */}
        <div className="relative h-48 rounded-2xl overflow-hidden bg-neutral-200 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 flex flex-col items-center justify-center space-y-2">
            <MapPin className="h-10 w-10 text-primary animate-bounce" />
            <span className="text-sm font-semibold text-neutral-500">{mediaDetails.coordinates}</span>
            <span className="text-xs text-neutral-400">Map Preview Simulation</span>
          </div>
          <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-neutral-900/95 px-2.5 py-1 rounded-lg text-[10px] font-mono shadow-sm">
            GPS Locked
          </div>
        </div>

        {/* Media Stats Overview */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-1">
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Percent className="h-3.5 w-3.5" /> Prev Compliance
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-amber-500">{mediaDetails.compliance}</span>
              <span className="text-xs text-neutral-500">score</span>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-1">
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Last Survey
            </span>
            <div>
              <span className="text-sm font-semibold block truncate">{mediaDetails.lastSurveyDate.split(" ")[0]} d ago</span>
              <span className="text-[10px] text-neutral-500">weekly standard</span>
            </div>
          </div>
        </section>

        {/* Detailed Spec List */}
        <section className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Asset Specs</h2>
          
          <div className="space-y-3.5">
            <div>
              <span className="text-xs text-neutral-400 block">Address Location</span>
              <span className="text-sm font-medium">{mediaDetails.location}</span>
            </div>
            
            <div className="border-t border-neutral-100 dark:border-neutral-900 pt-3">
              <span className="text-xs text-neutral-400 block">Assigned Inspector</span>
              <span className="text-sm font-medium">{mediaDetails.inspector}</span>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-900 pt-3">
              <span className="text-xs text-neutral-400 block">Pre-survey Instructions</span>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 bg-amber-50/50 dark:bg-amber-950/10 p-2.5 rounded-lg border border-amber-100/50 dark:border-amber-900/20 mt-1 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                {mediaDetails.notes}
              </p>
            </div>
          </div>
        </section>

        {/* Start Survey CTA */}
        <Button 
          className="w-full py-6 text-base font-semibold rounded-xl gap-2 shadow-md bg-primary hover:bg-primary/95 text-primary-foreground"
          onClick={() => navigate(`/survey/wizard/${mediaDetails.id}`)}
        >
          <Play className="h-5 w-5 fill-current" /> Start Weekly Survey
        </Button>
      </div>
    </div>
  );
}
