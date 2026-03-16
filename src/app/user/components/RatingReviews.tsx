import { Star } from "lucide-react";

const ratingBars = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 14 },
  { stars: 3, pct: 5 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 1 },
];

const RatingReviews = () => (
  <div className="bg-card rounded-2xl shadow-card p-6">
    <h3 className="text-lg font-bold text-foreground mb-6">Rating & Reviews</h3>
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left: Rating summary */}
      <div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-5xl font-extrabold text-foreground">4.5</span>
          <span className="text-lg text-muted-foreground">/ 5</span>
        </div>
        <p className="text-sm text-muted-foreground mb-5">(50 New Reviews)</p>
        <div className="flex flex-col gap-2.5">
          {ratingBars.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-8">{stars} ★</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-star rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Review card */}
      <div className="bg-secondary rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground">
            AM
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Alex Mathio</p>
            <p className="text-xs text-muted-foreground">Oct 5, 2024</p>
          </div>
        </div>
        <div className="flex gap-0.5 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-4 h-4 fill-star text-star" />
          ))}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Amazing quality hoodie! The fabric feels premium and the fit is exactly as described — loose but not sloppy. Perfect for layering in cooler weather. Highly recommend!
        </p>
      </div>
    </div>
  </div>
);

export default RatingReviews;
