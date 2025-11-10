"use client";

import { useState, useEffect } from "react";
import { generateBackgroundImage } from "@/ai/flows/dynamic-background-image";
import { quotes } from "@/lib/quotes";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WelcomeWindow() {
  const [greeting, setGreeting] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [backgroundImage, setBackgroundImage] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      // Set greeting based on time
      const hours = new Date().getHours();
      if (hours < 12) {
        setGreeting("Good morning");
      } else if (hours < 18) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }

      // Set a random quote
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      
      // Update time every second
      const timerId = setInterval(() => setDateTime(new Date()), 1000);

      // Generate background image
      try {
        const result = await generateBackgroundImage();
        setBackgroundImage(result.backgroundImage);
      } catch (error) {
        console.error("Failed to generate background image:", error);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Could not generate a dynamic background. Using a fallback.",
        });
        // A nice fallback gradient
        setBackgroundImage(
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2387CEEB;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F0F8FF;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='100' height='100'/%3E%3C/svg%3E"
        );
      } finally {
        setLoading(false);
      }

      return () => clearInterval(timerId);
    };

    initialize();
  }, [toast]);

  const formattedDate = dateTime.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <main
      className="relative min-h-screen w-full flex items-center justify-center bg-background bg-cover bg-center transition-all duration-1000"
      style={{
        backgroundImage: backgroundImage ? `url('${backgroundImage}')` : "none",
      }}
    >
      {loading && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-20 flex-col space-y-4 text-center p-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="text-lg text-foreground font-headline">
            Crafting your personal welcome...
          </p>
        </div>
      )}

      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <div
        className={`relative z-10 max-w-4xl w-full text-center p-4 sm:p-8 md:p-12 transition-opacity duration-1000 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="bg-background/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 animate-in fade-in-0 zoom-in-95 duration-1000 delay-200">
          <div className="mb-4 animate-in fade-in-0 slide-in-from-top-4 duration-700 delay-300">
            <p className="text-lg md:text-xl font-medium text-muted-foreground">
              {formattedDate}
            </p>
            <p className="text-4xl md:text-5xl font-bold font-headline text-foreground tracking-tighter">
              {formattedTime}
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-headline text-primary mb-6 animate-in fade-in-0 slide-in-from-top-8 duration-700 delay-500">
            {greeting}
          </h1>

          <figure className="animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-700">
            <blockquote className="text-xl md:text-2xl italic text-foreground">
              “{quote.text}”
            </blockquote>
            <figcaption className="mt-4 text-lg text-muted-foreground">
              — {quote.author}
            </figcaption>
          </figure>
        </div>
      </div>
    </main>
  );
}
