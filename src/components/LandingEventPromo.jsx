import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./cards/EventCard";
import { eventService } from "../services/eventService";

export default function LandingEventPromo() {
  const [events, setEvents] = useState([]);

  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;

    const amount = sliderRef.current.clientWidth;

    sliderRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const dbEvents = await eventService.syncFromDb();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = (dbEvents || [])
          .filter(event => {
            const date = event.date || event.event_date;
            if (!date) return false;

            return new Date(date) >= today;
          })
          .sort((a, b) => {
            const dateA = new Date(a.date || a.event_date);
            const dateB = new Date(b.date || b.event_date);
            return dateA - dateB;
          })
          .slice(0, 9);

        setEvents(upcoming);
      } catch (error) {
        console.error("LANDING EVENTS FEHLER:", error);
      }
    };

    loadEvents();
  }, []);

  if (!events.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8">

      <div className="relative">

        <button
          onClick={() => scrollSlider("left")}
          className="
            absolute left-2 top-1/2 -translate-y-1/2 z-30
            w-10 h-10 rounded-full
            bg-slate-950/90 border border-cyan-500/40
            text-cyan-400
            flex items-center justify-center
            hover:bg-cyan-500 hover:text-black
            transition-all shadow-xl
          "
        >
          <ChevronLeft size={22} />
        </button>

        <div
          ref={sliderRef}
          className="
            flex gap-5
            overflow-x-auto
            pb-4
            snap-x snap-mandatory
            scroll-smooth
          "
        >
        {events.map((event, index) => (
          <div
            key={event.id || index}
            className="
              flex-none
              w-[85%]
              md:w-[calc(33.333%-14px)]
              snap-start
              no-scrollbar
            "
          >
          <EventCard
            event={{
              ...event,

              title:
                event.promotionData?.title ||
                event.title,

              category:
                event.promotionData?.category ||
                event.category,

              shortDescription:
                event.promotionData?.shortDescription,

              slide1_url:
                event.promotionData?.promoImage ||
                event.slide1_url,

              entryTime:
                event.promotionData?.entryTime,

              startTime:
                event.promotionData?.startTime,

              ticketPrice:
                event.promotionData?.ticketPrice,

              ticketStatus:
                event.promotionData?.ticketStatus,

              fsk:
                event.promotionData?.fsk,

              lineup:
                event.promotionData?.lineup,

              amenities:
                event.promotionData?.amenities,

              city:
                event.venue ||
                event.city
            }}
          />
          </div>
        ))}
      </div>
      <button
        onClick={() => scrollSlider("right")}
        className="
          absolute right-2 top-1/2 -translate-y-1/2 z-30
          w-10 h-10 rounded-full
          bg-slate-950/90 border border-cyan-500/40
          text-cyan-400
          flex items-center justify-center
          hover:bg-cyan-500 hover:text-black
          transition-all shadow-xl
        "
      >
        <ChevronRight size={22} />
      </button>

    </div>
    </div>
  );
}