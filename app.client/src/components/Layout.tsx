// "use client";

// import AppSidebar from "./Sidebar";
// import {Navigation} from "./NavigationMenu";
// import { SidebarProvider } from "@/components/ui/sidebar";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <SidebarProvider>
//       <div className="flex flex-col min-h-screen">
//         {/* Fixed Top Navbar */}
//         <Navigation />

//         {/* Sidebar + Content */}
//         <div className="flex flex-1 pt-16">
//           <AppSidebar />

//           {/* Main Content */}
//           <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4">
//             {children}
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }
