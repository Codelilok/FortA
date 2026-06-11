import { useState } from "react";
import { useUser, useClerk, Show } from "@clerk/react";
import { Redirect, Link, Switch, Route, useLocation } from "wouter";
import { 
  useGetDashboardStats, 
  useListProjects, 
  useListGallery, 
  useListTeamMembers, 
  useListServices,
  useListSocialLinks,
  useGetCompanyInfo,
  useListContactMessages,
  useMarkMessageRead
} from "@workspace/api-client-react";
import { 
  LayoutDashboard, 
  Building2, 
  Image as ImageIcon, 
  Users, 
  Hammer, 
  Share2, 
  Info, 
  Mail, 
  LogOut,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit,
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function SidebarItem({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active: boolean }) {
  return (
    <Link href={href}>
      <button className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
        active 
          ? "bg-primary text-white shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-gray-100 hover:text-primary"
      )}>
        <Icon size={20} />
        <span>{label}</span>
        {active && <ChevronRight size={16} className="ml-auto" />}
      </button>
    </Link>
  );
}

function DashboardOverview() {
  const { data: stats, isLoading } = useGetDashboardStats();
  
  const cards = [
    { label: "Projects", value: stats?.projectCount, icon: Building2, color: "bg-blue-500" },
    { label: "Gallery Items", value: stats?.galleryCount, icon: ImageIcon, color: "bg-purple-500" },
    { label: "Team Members", value: stats?.teamCount, icon: Users, color: "bg-orange-500" },
    { label: "Unread Messages", value: stats?.unreadMessages, icon: Mail, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.label} className="border-0 shadow-sm overflow-hidden group">
            <div className={cn("h-1 w-full", card.color)} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">{card.label}</p>
                  <h3 className="text-3xl font-bold text-primary">
                    {isLoading ? <Skeleton className="h-8 w-12" /> : card.value}
                  </h3>
                </div>
                <div className={cn("p-4 rounded-2xl text-white group-hover:scale-110 transition-transform", card.color)}>
                  <card.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Projects by Category</CardTitle>
            <CardDescription>Visual breakdown of your architectural works</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="space-y-4">
                {stats?.projectsByCategory?.map((cat: any) => (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{cat.category}</span>
                      <span>{cat.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(cat.count / (stats.projectCount || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Quick Actions</CardTitle>
            <CardDescription>Manage your website content</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/admin/projects"><Button className="w-full justify-start gap-2" variant="outline"><Plus size={16} /> New Project</Button></Link>
            <Link href="/admin/team"><Button className="w-full justify-start gap-2" variant="outline"><Plus size={16} /> New Member</Button></Link>
            <Link href="/admin/gallery"><Button className="w-full justify-start gap-2" variant="outline"><Plus size={16} /> New Photo</Button></Link>
            <Link href="/admin/services"><Button className="w-full justify-start gap-2" variant="outline"><Plus size={16} /> New Service</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PlaceholderManagement({ title }: { title: string }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif font-bold text-primary">{title}</h2>
        <Button className="bg-primary gap-2"><Plus size={18} /> Add New</Button>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Edit className="text-muted-foreground" size={32} />
          </div>
          <h3 className="text-xl font-bold">Manage {title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This section allows you to create, edit, and delete {title.toLowerCase()}. Full CRUD functionality is coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function MessagesInbox() {
  const { data: messages, isLoading } = useListContactMessages();
  const markRead = useMarkMessageRead();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-3xl font-serif font-bold text-primary">Messages Inbox</h2>
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
        ) : messages?.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-border">
            <Mail className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-lg font-bold">No messages found</p>
          </div>
        ) : (
          messages?.map((msg) => (
            <Card key={msg.id} className={cn("border-0 shadow-sm transition-all", !msg.isRead && "bg-secondary/5 border-l-4 border-secondary")}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-lg text-primary">{msg.name}</h4>
                        {!msg.isRead && <Badge className="bg-secondary text-primary">New</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-primary">Subject: {msg.subject}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail size={12} /> {msg.email}</span>
                      {msg.phone && <span className="flex items-center gap-1"><ExternalLink size={12} /> {msg.phone}</span>}
                    </div>
                  </div>
                  <div className="flex md:flex-col justify-end gap-2">
                    {!msg.isRead && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-secondary hover:text-secondary hover:bg-secondary/10"
                        onClick={() => markRead.mutate({ id: msg.id })}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [location] = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const basePath = "/admin";

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/projects", icon: Building2, label: "Projects" },
    { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
    { href: "/admin/team", icon: Users, label: "Team" },
    { href: "/admin/services", icon: Hammer, label: "Services" },
    { href: "/admin/social", icon: Share2, label: "Social Links" },
    { href: "/admin/company", icon: Info, label: "Company Info" },
    { href: "/admin/messages", icon: Mail, label: "Messages" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-border p-6 fixed h-full z-30">
        <div className="flex items-center gap-3 mb-10 px-2">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          <h1 className="font-serif font-bold text-xl text-primary tracking-tight">Admin</h1>
        </div>
        
        <nav className="flex-grow space-y-2">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.href} 
              {...item} 
              active={location === item.href || (item.href !== "/admin" && location.startsWith(item.href))} 
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-primary">
              {user?.firstName?.[0] || "A"}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-bold text-primary truncate">{user?.fullName || "Admin User"}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Administrator</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
            onClick={() => signOut()}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-border p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-6 w-auto" />
          <h1 className="font-serif font-bold text-lg text-primary">Admin</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)}>
          <Menu />
        </Button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-primary/40 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}>
          <aside className="w-72 bg-white h-full p-6 space-y-8 animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
                <h1 className="font-serif font-bold text-xl text-primary">Admin</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(false)}>
                <X />
              </Button>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <SidebarItem 
                  key={item.href} 
                  {...item} 
                  active={location === item.href} 
                />
              ))}
            </nav>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => signOut()}
            >
              <LogOut size={20} />
              Sign Out
            </Button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow md:ml-72 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Switch>
            <Route path="/admin" component={DashboardOverview} />
            <Route path="/admin/projects" component={() => <PlaceholderManagement title="Projects" />} />
            <Route path="/admin/gallery" component={() => <PlaceholderManagement title="Gallery" />} />
            <Route path="/admin/team" component={() => <PlaceholderManagement title="Team Members" />} />
            <Route path="/admin/services" component={() => <PlaceholderManagement title="Services" />} />
            <Route path="/admin/social" component={() => <PlaceholderManagement title="Social Links" />} />
            <Route path="/admin/company" component={() => <PlaceholderManagement title="Company Info" />} />
            <Route path="/admin/messages" component={MessagesInbox} />
            <Route component={() => <Redirect to="/admin" />} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <>
      <Show when="signed-in">
        <AdminDashboardContent />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}