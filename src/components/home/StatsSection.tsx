import { Users, Trophy, Gavel, Shield } from "lucide-react";
import { mockStats } from "@/data/mockData";

const stats = [
  {
    icon: Users,
    value: mockStats.totalPlayers,
    label: "Registered Players",
    color: "text-primary",
  },
  {
    icon: Trophy,
    value: mockStats.activeTournaments,
    label: "Active Tournaments",
    color: "text-accent",
  },
  {
    icon: Gavel,
    value: mockStats.liveAuctions,
    label: "Live Auctions",
    color: "text-live",
  },
  {
    icon: Shield,
    value: mockStats.totalTeams,
    label: "Teams Formed",
    color: "text-success",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-card shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 ${stat.color} mb-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {stat.value.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
