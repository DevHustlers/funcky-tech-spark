import PageTransition from "@/components/PageTransition";
import { StatGrid } from "./components/overview/StatGrid";
import { WeeklyActivityChart } from "./components/overview/WeeklyActivityChart";
import { ChallengeStatusPie } from "./components/overview/ChallengeStatusPie";
import { UpcomingTimeline } from "./components/overview/UpcomingTimeline";
import { RecentPointsActivity } from "./components/overview/RecentPointsActivity";
import { TopChallenges } from "./components/overview/TopChallenges";
import { LeaderboardSmall } from "./components/overview/LeaderboardSmall";

export default function Overview() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <StatGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <WeeklyActivityChart />
          <ChallengeStatusPie />
          <UpcomingTimeline />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <RecentPointsActivity />
          <TopChallenges />
          <LeaderboardSmall />
        </div>
      </div>
    </PageTransition>
  );
}
