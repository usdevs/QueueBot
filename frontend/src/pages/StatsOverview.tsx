// import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
// import { Users, Camera, Clock, CheckCircle } from "lucide-react";
//
// interface StatsOverviewProps {
//   totalInQueue: number;
//   activeSessions: number;
//   completedToday: number;
//   averageWaitTime: number;
// }
//
// export function StatsOverview({
//   totalInQueue,
//   activeSessions,
//   completedToday,
//   averageWaitTime
// }: StatsOverviewProps) {
//   const stats = [
//     {
//       title: "In Queue",
//       value: totalInQueue,
//       icon: Users,
//       color: "text-blue-600",
//       bgColor: "bg-blue-100 dark:bg-blue-950",
//     },
//     {
//       title: "Active Sessions",
//       value: activeSessions,
//       icon: Camera,
//       color: "text-green-600",
//       bgColor: "bg-green-100 dark:bg-green-950",
//     },
//     {
//       title: "Completed Today",
//       value: completedToday,
//       icon: CheckCircle,
//       color: "text-purple-600",
//       bgColor: "bg-purple-100 dark:bg-purple-950",
//     },
//     {
//       title: "Avg Wait Time",
//       value: `${averageWaitTime}m`,
//       icon: Clock,
//       color: "text-orange-600",
//       bgColor: "bg-orange-100 dark:bg-orange-950",
//     },
//   ];
//
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       {stats.map((stat) => {
//         const Icon = stat.icon;
//         return (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm">{stat.title}</CardTitle>
//               <div className={`p-2 rounded-lg ${stat.bgColor}`}>
//                 <Icon className={`size-4 ${stat.color}`} />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-semibold">{stat.value}</div>
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }
