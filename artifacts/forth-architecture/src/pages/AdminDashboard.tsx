import { useState, useEffect } from "react";
import { useAdminAuth, adminLogout } from "@/lib/auth";
import { Link, Switch, Route, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetDashboardStats,
  useListProjects, useCreateProject, useUpdateProject, useDeleteProject,
  useListGallery, useCreateGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem,
  useListTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember,
  useListServices, useCreateService, useUpdateService, useDeleteService,
  useListSocialLinks, useCreateSocialLink, useUpdateSocialLink, useDeleteSocialLink,
  useGetCompanyInfo, useUpdateCompanyInfo,
  useListContactMessages, useMarkMessageRead, useDeleteContactMessage,
  useListTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial,
  useListProcessSteps, useCreateProcessStep, useUpdateProcessStep, useDeleteProcessStep,
  getListProjectsQueryKey, getListGalleryQueryKey, getListTeamMembersQueryKey,
  getListServicesQueryKey, getListSocialLinksQueryKey, getGetCompanyInfoQueryKey,
  getListContactMessagesQueryKey, getGetDashboardStatsQueryKey,
  getListTestimonialsQueryKey, getListProcessStepsQueryKey,
} from "@workspace/api-client-react";
import {
  LayoutDashboard, Building2, Image as ImageIcon, Users, Hammer, Share2,
  Info, Mail, LogOut, Plus, CheckCircle2, Trash2, Edit, ExternalLink,
  ChevronRight, Menu, X, Star, StarOff, Eye, EyeOff, Globe, Twitter,
  Linkedin, Instagram, Facebook, Youtube, Link2, Phone, MapPin,
  BarChart3, TrendingUp, Sofa, Leaf, Compass, MessageSquare, ListOrdered,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch as SwitchUI } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ADMIN_SERVICE_ICONS: Record<string, any> = {
  Building2, HardHat: Hammer, Sofa, Map: MapPin, BarChart3, Leaf, Hammer, Compass,
};

const PLATFORM_ICONS: Record<string, any> = {
  Facebook, Twitter, Instagram, LinkedIn: Linkedin, YouTube: Youtube, WhatsApp: Phone, Website: Globe,
};

function SidebarItem({ href, icon: Icon, label, active, badge }: { href: string; icon: any; label: string; active: boolean; badge?: number }) {
  return (
    <Link href={href}>
      <button className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm",
        active
          ? "bg-primary text-white shadow-lg shadow-primary/20"
          : "text-slate-600 hover:bg-slate-100 hover:text-primary"
      )}>
        <Icon size={18} />
        <span className="flex-grow text-left">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
        {active && <ChevronRight size={14} className="ml-auto shrink-0" />}
      </button>
    </Link>
  );
}

function ConfirmDelete({ open, onClose, onConfirm, name }: { open: boolean; onClose: () => void; onConfirm: () => void; name: string }) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the record from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SectionHeader({ title, onAdd, addLabel = "Add New" }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your {title.toLowerCase()} content</p>
      </div>
      {onAdd && (
        <Button onClick={onAdd} className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
          <Plus size={16} /> {addLabel}
        </Button>
      )}
    </div>
  );
}

const PROJECT_CATEGORIES = ["Commercial", "Residential", "Cultural", "Institutional", "General"];
const GALLERY_CATEGORIES = ["Architecture", "Interior", "Construction", "Exterior", "General"];
const ICON_OPTIONS = ["Building2", "HardHat", "Sofa", "Map", "BarChart3", "Leaf", "Hammer", "Compass"];
const SOCIAL_PLATFORMS = ["Facebook", "Twitter", "Instagram", "LinkedIn", "YouTube", "WhatsApp", "Website"];

function ProjectsManagement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: projects, isLoading } = useListProjects({ limit: 50 });
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const blank = { title: "", description: "", category: "Commercial", location: "", completionDate: "", featured: false };
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(blank);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
  };

  const openCreate = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ title: p.title, description: p.description || "", category: p.category, location: p.location || "", completionDate: p.completionDate || "", featured: p.featured, coverImage: p.coverImage || "" }); setOpen(true); };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editing) {
      updateProject.mutate({ id: editing.id, data: form }, {
        onSuccess: () => { toast({ title: "Project updated" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Update failed", variant: "destructive" }),
      });
    } else {
      createProject.mutate({ data: form }, {
        onSuccess: () => { toast({ title: "Project created" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Create failed", variant: "destructive" }),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProject.mutate({ id: deleteTarget.id }, {
      onSuccess: () => { toast({ title: "Project deleted" }); invalidate(); setDeleteTarget(null); },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <SectionHeader title="Projects" onAdd={openCreate} />
      <div className="space-y-3">
        {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />) :
          projects?.data?.map((p) => (
            <Card key={p.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  {p.coverImage ? (
                    <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <Building2 size={20} className="text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-primary truncate">{p.title}</h4>
                    {p.featured && <Badge className="bg-secondary text-primary text-[10px]">Featured</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.category} {p.location && `· ${p.location}`} {p.completionDate && `· ${p.completionDate}`}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(p)} className="text-primary hover:bg-primary/10">
                    <Edit size={15} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(p)} className="text-red-500 hover:bg-red-50">
                    <Trash2 size={15} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        {!isLoading && !projects?.data.length && (
          <div className="text-center py-16 text-muted-foreground">
            <Building2 size={40} className="mx-auto mb-4 opacity-20" />
            <p>No projects yet. Add your first project.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle>
            <DialogDescription>Fill in the project details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Skyline Tower" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PROJECT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Accra, Ghana" /></div>
              <div><Label>Completion Date</Label><Input value={form.completionDate} onChange={e => setForm({ ...form, completionDate: e.target.value })} placeholder="e.g. 2024" /></div>
            </div>
            <div><Label>Cover Image URL</Label><Input value={form.coverImage || ""} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." /></div>
            {form.coverImage && <img src={form.coverImage} alt="preview" className="w-full h-32 object-cover rounded-lg" />}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <SwitchUI checked={form.featured} onCheckedChange={v => setForm({ ...form, featured: v })} />
              <Label className="cursor-pointer">Featured on homepage</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createProject.isPending || updateProject.isPending} className="bg-primary">
              {editing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name="project" />
    </div>
  );
}

function GalleryManagement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: items, isLoading } = useListGallery();
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem();
  const deleteItem = useDeleteGalleryItem();

  const blank = { title: "", imageUrl: "", category: "Architecture", description: "" };
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(blank);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListGalleryQueryKey() });
  const openCreate = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ title: item.title, imageUrl: item.imageUrl, category: item.category, description: item.description || "" }); setOpen(true); };

  const handleSave = () => {
    if (!form.title.trim() || !form.imageUrl.trim()) return;
    if (editing) {
      updateItem.mutate({ id: editing.id, data: form }, {
        onSuccess: () => { toast({ title: "Photo updated" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Update failed", variant: "destructive" }),
      });
    } else {
      createItem.mutate({ data: form }, {
        onSuccess: () => { toast({ title: "Photo added" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Create failed", variant: "destructive" }),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteItem.mutate({ id: deleteTarget.id }, {
      onSuccess: () => { toast({ title: "Photo deleted" }); invalidate(); setDeleteTarget(null); },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <SectionHeader title="Gallery" onAdd={openCreate} addLabel="Add Photo" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? Array(8).fill(0).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />) :
          items?.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                <p className="text-white text-xs font-bold text-center line-clamp-2">{item.title}</p>
                <Badge className="bg-secondary text-primary text-[10px]">{item.category}</Badge>
                <div className="flex gap-2 mt-1">
                  <Button size="sm" variant="secondary" onClick={() => openEdit(item)} className="h-7 px-2 text-xs">
                    <Edit size={12} className="mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(item)} className="h-7 px-2 text-xs">
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {!isLoading && !items?.length && (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon size={40} className="mx-auto mb-4 opacity-20" />
          <p>No gallery photos yet.</p>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Photo" : "Add Photo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Image URL *</Label><Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></div>
            {form.imageUrl && <img src={form.imageUrl} alt="preview" className="w-full h-40 object-cover rounded-lg" />}
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GALLERY_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createItem.isPending || updateItem.isPending} className="bg-primary">
              {editing ? "Save Changes" : "Add Photo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name="photo" />
    </div>
  );
}

function TeamManagement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: members, isLoading } = useListTeamMembers();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();

  const blank = { name: "", position: "", bio: "", email: "", linkedinUrl: "", twitterUrl: "", photo: "" };
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(blank);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
    qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
  };
  const openCreate = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (m: any) => { setEditing(m); setForm({ name: m.name, position: m.position, bio: m.bio || "", email: m.email || "", linkedinUrl: m.linkedinUrl || "", twitterUrl: m.twitterUrl || "", photo: m.photo || "" }); setOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      updateMember.mutate({ id: editing.id, data: form }, {
        onSuccess: () => { toast({ title: "Team member updated" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Update failed", variant: "destructive" }),
      });
    } else {
      createMember.mutate({ data: form }, {
        onSuccess: () => { toast({ title: "Team member added" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Create failed", variant: "destructive" }),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMember.mutate({ id: deleteTarget.id }, {
      onSuccess: () => { toast({ title: "Team member removed" }); invalidate(); setDeleteTarget(null); },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <SectionHeader title="Team Members" onAdd={openCreate} addLabel="Add Member" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />) :
          members?.map((m) => (
            <Card key={m.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-gray-100">
                  {m.photo ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" /> : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 font-bold text-primary text-xl">
                      {m.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-primary truncate">{m.name}</h4>
                  <p className="text-xs text-muted-foreground">{m.position}</p>
                  {m.email && <p className="text-xs text-muted-foreground/70">{m.email}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(m)} className="text-primary hover:bg-primary/10"><Edit size={15} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(m)} className="text-red-500 hover:bg-red-50"><Trash2 size={15} /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        {!isLoading && !members?.length && (
          <div className="col-span-2 text-center py-16 text-muted-foreground">
            <Users size={40} className="mx-auto mb-4 opacity-20" />
            <p>No team members yet.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Full Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Position / Role *</Label><Input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} /></div>
            </div>
            <div><Label>Photo URL</Label><Input value={form.photo} onChange={e => setForm({ ...form, photo: e.target.value })} placeholder="https://..." /></div>
            {form.photo && <img src={form.photo} alt="preview" className="w-20 h-20 rounded-full object-cover" />}
            <div><Label>Bio</Label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
            <div><Label>Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>LinkedIn URL</Label><Input value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." /></div>
              <div><Label>Twitter URL</Label><Input value={form.twitterUrl} onChange={e => setForm({ ...form, twitterUrl: e.target.value })} placeholder="https://twitter.com/..." /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createMember.isPending || updateMember.isPending} className="bg-primary">
              {editing ? "Save Changes" : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name="team member" />
    </div>
  );
}

function ServicesManagement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: services, isLoading } = useListServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const blank = { title: "", description: "", icon: "Building2", imageUrl: "" };
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(blank);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListServicesQueryKey() });
  const openCreate = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (s: any) => { setEditing(s); setForm({ title: s.title, description: s.description, icon: s.icon, imageUrl: s.imageUrl || "" }); setOpen(true); };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editing) {
      updateService.mutate({ id: editing.id, data: form }, {
        onSuccess: () => { toast({ title: "Service updated" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Update failed", variant: "destructive" }),
      });
    } else {
      createService.mutate({ data: form }, {
        onSuccess: () => { toast({ title: "Service created" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Create failed", variant: "destructive" }),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteService.mutate({ id: deleteTarget.id }, {
      onSuccess: () => { toast({ title: "Service deleted" }); invalidate(); setDeleteTarget(null); },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <SectionHeader title="Services" onAdd={openCreate} addLabel="Add Service" />
      <div className="space-y-3">
        {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />) :
          services?.map((s) => {
            const SIcon = ADMIN_SERVICE_ICONS[s.icon] || Building2;
            return (
            <Card key={s.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <SIcon size={20} className="text-primary" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-primary">{s.title}</h4>
                    <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">{s.icon}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(s)} className="text-primary hover:bg-primary/10"><Edit size={15} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(s)} className="text-red-500 hover:bg-red-50"><Trash2 size={15} /></Button>
                </div>
              </CardContent>
            </Card>
            );
          })}
        {!isLoading && !services?.length && (
          <div className="text-center py-16 text-muted-foreground">
            <Hammer size={40} className="mx-auto mb-4 opacity-20" />
            <p>No services yet.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description *</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} /></div>
            <div><Label>Icon Name</Label>
              <Select value={form.icon} onValueChange={v => setForm({ ...form, icon: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ICON_OPTIONS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Image URL (optional)</Label><Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createService.isPending || updateService.isPending} className="bg-primary">
              {editing ? "Save Changes" : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name="service" />
    </div>
  );
}

function SocialLinksManagement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: links, isLoading } = useListSocialLinks();
  const createLink = useCreateSocialLink();
  const updateLink = useUpdateSocialLink();
  const deleteLink = useDeleteSocialLink();

  const blank = { platform: "Facebook", url: "" };
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(blank);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListSocialLinksQueryKey() });
  const openCreate = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (l: any) => { setEditing(l); setForm({ platform: l.platform, url: l.url }); setOpen(true); };

  const handleSave = () => {
    if (!form.url.trim()) return;
    if (editing) {
      updateLink.mutate({ id: editing.id, data: form }, {
        onSuccess: () => { toast({ title: "Link updated" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Update failed", variant: "destructive" }),
      });
    } else {
      createLink.mutate({ data: form }, {
        onSuccess: () => { toast({ title: "Link added" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Create failed", variant: "destructive" }),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteLink.mutate({ id: deleteTarget.id }, {
      onSuccess: () => { toast({ title: "Link removed" }); invalidate(); setDeleteTarget(null); },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <SectionHeader title="Social Links" onAdd={openCreate} addLabel="Add Link" />
      <div className="space-y-3">
        {isLoading ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />) :
          links?.map((l) => {
            const Icon = PLATFORM_ICONS[l.platform] || Link2;
            return (
              <Card key={l.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-primary">{l.platform}</h4>
                    <p className="text-xs text-muted-foreground truncate">{l.url}</p>
                  </div>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-secondary transition-colors">
                    <ExternalLink size={15} />
                  </a>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(l)} className="text-primary hover:bg-primary/10"><Edit size={15} /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(l)} className="text-red-500 hover:bg-red-50"><Trash2 size={15} /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        {!isLoading && !links?.length && (
          <div className="text-center py-16 text-muted-foreground">
            <Share2 size={40} className="mx-auto mb-4 opacity-20" />
            <p>No social links yet.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Platform</Label>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  {(() => { const PI = PLATFORM_ICONS[form.platform] || Link2; return <PI size={18} className="text-primary" />; })()}
                </div>
                <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                  <SelectTrigger className="flex-grow"><SelectValue /></SelectTrigger>
                  <SelectContent>{SOCIAL_PLATFORMS.map(p => {
                    const PI = PLATFORM_ICONS[p] || Link2;
                    return <SelectItem key={p} value={p}><span className="flex items-center gap-2"><PI size={14} />{p}</span></SelectItem>;
                  })}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>URL *</Label><Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createLink.isPending || updateLink.isPending} className="bg-primary">
              {editing ? "Save Changes" : "Add Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name="social link" />
    </div>
  );
}

function CompanyInfoManagement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: company, isLoading } = useGetCompanyInfo();
  const updateCompany = useUpdateCompanyInfo();

  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (company) {
      setForm({
        companyName: company.companyName || "",
        slogan: company.slogan || "",
        about: company.about || "",
        mission: company.mission || "",
        vision: company.vision || "",
        values: company.values || "",
        phone: company.phone || "",
        email: company.email || "",
        address: company.address || "",
        whatsapp: company.whatsapp || "",
        mapEmbedUrl: company.mapEmbedUrl || "",
        heroTitle: company.heroTitle || "",
        heroSubtitle: company.heroSubtitle || "",
        ctaTitle: company.ctaTitle || "",
        ctaSubtitle: company.ctaSubtitle || "",
        workingHours: company.workingHours || "",
        projectsCompleted: company.projectsCompleted ?? 120,
        yearsOfExperience: company.yearsOfExperience ?? 15,
        teamMembersCount: company.teamMembersCount ?? 25,
        awardsWon: company.awardsWon ?? 12,
      });
    }
  }, [company]);

  const handleSave = () => {
    updateCompany.mutate({ data: form }, {
      onSuccess: () => {
        toast({ title: "Company info saved" });
        qc.invalidateQueries({ queryKey: getGetCompanyInfoQueryKey() });
      },
      onError: () => toast({ title: "Save failed", variant: "destructive" }),
    });
  };

  if (isLoading) return <div className="space-y-4">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>;

  return (
    <div className="animate-in fade-in duration-300">
      <SectionHeader title="Company Info" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="font-serif text-lg">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Company Name</Label><Input value={form.companyName || ""} onChange={e => setForm({ ...form, companyName: e.target.value })} /></div>
            <div><Label>Slogan / Tagline</Label><Input value={form.slogan || ""} onChange={e => setForm({ ...form, slogan: e.target.value })} /></div>
            <div><Label>About</Label><Textarea value={form.about || ""} onChange={e => setForm({ ...form, about: e.target.value })} rows={4} /></div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="font-serif text-lg">Contact Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Phone</Label><Input value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} type="email" /></div>
            <div><Label>WhatsApp</Label><Input value={form.whatsapp || ""} onChange={e => setForm({ ...form, whatsapp: e.target.value })} /></div>
            <div><Label>Address</Label><Textarea value={form.address || ""} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} /></div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="font-serif text-lg">Mission & Vision</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Mission</Label><Textarea value={form.mission || ""} onChange={e => setForm({ ...form, mission: e.target.value })} rows={3} /></div>
            <div><Label>Vision</Label><Textarea value={form.vision || ""} onChange={e => setForm({ ...form, vision: e.target.value })} rows={3} /></div>
            <div><Label>Values</Label><Textarea value={form.values || ""} onChange={e => setForm({ ...form, values: e.target.value })} rows={3} placeholder="Enter core values, one per line" /></div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="font-serif text-lg">Map Embed</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Google Maps Embed URL</Label><Input value={form.mapEmbedUrl || ""} onChange={e => setForm({ ...form, mapEmbedUrl: e.target.value })} placeholder="https://www.google.com/maps/embed?..." /></div>
            {form.mapEmbedUrl && (
              <iframe src={form.mapEmbedUrl} className="w-full h-40 rounded-lg border border-border" allowFullScreen loading="lazy" title="Map" />
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader><CardTitle className="font-serif text-lg">Hero Section</CardTitle><CardDescription>The big banner text visitors see first on the homepage</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Hero Title (use a comma to split into two lines)</Label><Input value={form.heroTitle || ""} onChange={e => setForm({ ...form, heroTitle: e.target.value })} placeholder="Building Visions, Crafting Excellence" /></div>
            <div><Label>Hero Subtitle</Label><Textarea value={form.heroSubtitle || ""} onChange={e => setForm({ ...form, heroSubtitle: e.target.value })} rows={2} placeholder="Professional architecture and construction services..." /></div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader><CardTitle className="font-serif text-lg">Call-to-Action Section</CardTitle><CardDescription>The "Ready to start?" banner at the bottom of the homepage</CardDescription></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>CTA Title</Label><Input value={form.ctaTitle || ""} onChange={e => setForm({ ...form, ctaTitle: e.target.value })} placeholder="Ready to Start Your Next Project?" /></div>
            <div><Label>CTA Subtitle</Label><Input value={form.ctaSubtitle || ""} onChange={e => setForm({ ...form, ctaSubtitle: e.target.value })} placeholder="Join hundreds of satisfied clients..." /></div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="font-serif text-lg">Working Hours</CardTitle><CardDescription>Shown on the Contact page. Use a new line for each entry.</CardDescription></CardHeader>
          <CardContent>
            <div><Label>Working Hours</Label><Textarea value={form.workingHours || ""} onChange={e => setForm({ ...form, workingHours: e.target.value })} rows={3} placeholder={"Mon - Fri: 9:00 AM - 6:00 PM\nSat - Sun: Closed"} /></div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Site Statistics</CardTitle>
            <CardDescription>Numbers displayed on the homepage stats bar</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Projects Completed</Label>
              <Input type="number" min={0} value={form.projectsCompleted ?? 120} onChange={e => setForm({ ...form, projectsCompleted: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Years of Experience</Label>
              <Input type="number" min={0} value={form.yearsOfExperience ?? 15} onChange={e => setForm({ ...form, yearsOfExperience: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Team Members</Label>
              <Input type="number" min={0} value={form.teamMembersCount ?? 25} onChange={e => setForm({ ...form, teamMembersCount: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Awards Won</Label>
              <Input type="number" min={0} value={form.awardsWon ?? 12} onChange={e => setForm({ ...form, awardsWon: Number(e.target.value) })} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} disabled={updateCompany.isPending} className="bg-primary px-8 gap-2 shadow-lg shadow-primary/20">
          <CheckCircle2 size={16} />
          {updateCompany.isPending ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}

function MessagesInbox() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: messages, isLoading } = useListContactMessages();
  const markRead = useMarkMessageRead();
  const deleteMessage = useDeleteContactMessage();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getListContactMessagesQueryKey() });
    qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
  };

  const handleMarkRead = (id: number) => {
    markRead.mutate({ id }, {
      onSuccess: () => { invalidate(); toast({ title: "Message marked as read" }); },
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMessage.mutate({ id: deleteTarget }, {
      onSuccess: () => { invalidate(); toast({ title: "Message deleted" }); setDeleteTarget(null); },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary">Messages Inbox</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {messages?.filter(m => !m.isRead).length || 0} unread messages
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {isLoading ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />) :
          messages?.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Mail size={40} className="mx-auto mb-4 opacity-20" />
              <p>No messages yet.</p>
            </div>
          ) : (
            messages?.map((msg) => (
              <Card key={msg.id} className={cn("border-0 shadow-sm transition-all", !msg.isRead && "border-l-4 border-l-secondary bg-secondary/5")}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {msg.name[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-primary">{msg.name}</h4>
                            <p className="text-xs text-muted-foreground">{msg.email}</p>
                          </div>
                          {!msg.isRead && <Badge className="bg-secondary text-primary text-[10px] font-bold">New</Badge>}
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-primary mb-2">{msg.subject}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
                      </div>
                      {msg.phone && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone size={11} /> {msg.phone}
                        </p>
                      )}
                    </div>
                    <div className="md:ml-4 flex items-start gap-2">
                      {!msg.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0 text-secondary border-secondary hover:bg-secondary hover:text-primary"
                          onClick={() => handleMarkRead(msg.id)}
                          disabled={markRead.isPending}
                        >
                          <CheckCircle2 size={14} className="mr-1" /> Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setDeleteTarget(msg.id)}
                        disabled={deleteMessage.isPending}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
      </div>

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        name="message"
      />
    </div>
  );
}

function DashboardOverview() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const { data: messages } = useListContactMessages();
  const unread = messages?.filter(m => !m.isRead).length || 0;

  const cards = [
    { label: "Total Projects", value: stats?.projectCount, icon: Building2, color: "bg-blue-500", href: "/admin/projects" },
    { label: "Gallery Photos", value: stats?.galleryCount, icon: ImageIcon, color: "bg-purple-500", href: "/admin/gallery" },
    { label: "Team Members", value: stats?.teamCount, icon: Users, color: "bg-emerald-500", href: "/admin/team" },
    { label: "Unread Messages", value: unread, icon: Mail, color: "bg-amber-500", href: "/admin/messages" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <Link href={card.href} key={card.label}>
            <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-all group overflow-hidden">
              <div className={cn("h-1.5 w-full", card.color)} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{card.label}</p>
                    <h3 className="text-4xl font-bold text-primary">
                      {isLoading ? <Skeleton className="h-10 w-14" /> : (card.value ?? 0)}
                    </h3>
                  </div>
                  <div className={cn("p-4 rounded-2xl text-white group-hover:scale-110 transition-transform duration-300", card.color)}>
                    <card.icon size={22} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif flex items-center gap-2"><BarChart3 size={18} className="text-secondary" /> Projects by Category</CardTitle>
            <CardDescription>Breakdown of architectural works</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[160px]" /> : (
              <div className="space-y-4 pt-2">
                {(stats?.projectsByCategory as any[] ?? []).map((cat: any) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-primary">{cat.category}</span>
                      <span className="font-bold text-secondary">{cat.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                        style={{ width: `${(cat.count / Math.max(stats?.projectCount || 1, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif flex items-center gap-2"><TrendingUp size={18} className="text-secondary" /> Quick Actions</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 pt-2">
            {[
              { href: "/admin/projects", label: "New Project", icon: Building2 },
              { href: "/admin/team", label: "Add Member", icon: Users },
              { href: "/admin/gallery", label: "Upload Photo", icon: ImageIcon },
              { href: "/admin/services", label: "New Service", icon: Hammer },
              { href: "/admin/social", label: "Social Links", icon: Share2 },
              { href: "/admin/company", label: "Company Info", icon: Info },
            ].map(({ href, label, icon: Icon }) => (
              <Link href={href} key={href}>
                <Button variant="outline" className="w-full justify-start gap-2 border-border hover:border-secondary hover:text-secondary transition-all text-sm h-10">
                  <Icon size={15} /> {label}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent messages preview */}
      {messages && messages.filter(m => !m.isRead).length > 0 && (
        <Card className="border-0 shadow-sm border-l-4 border-l-amber-400">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif flex items-center gap-2">
              <Mail size={18} className="text-amber-500" />
              Unread Messages
              <Badge className="bg-amber-500 text-white ml-1">{messages.filter(m => !m.isRead).length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.filter(m => !m.isRead).slice(0, 3).map(msg => (
              <div key={msg.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
                  {msg.name[0]}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-primary truncate">{msg.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            <Link href="/admin/messages">
              <Button variant="link" className="text-secondary p-0 h-auto font-semibold text-sm">
                View all messages →
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TestimonialsManagement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: testimonials, isLoading } = useListTestimonials();
  const create = useCreateTestimonial();
  const update = useUpdateTestimonial();
  const remove = useDeleteTestimonial();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const emptyForm = { quote: "", authorName: "", authorRole: "", avatarUrl: "", active: true, sortOrder: 0 };
  const [form, setForm] = useState<any>(emptyForm);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (t: any) => { setEditing(t); setForm({ quote: t.quote, authorName: t.authorName, authorRole: t.authorRole, avatarUrl: t.avatarUrl || "", active: t.active, sortOrder: t.sortOrder }); setShowForm(true); };

  const handleSave = () => {
    if (!form.quote || !form.authorName) { toast({ title: "Quote and name are required", variant: "destructive" }); return; }
    const payload = { data: { ...form, sortOrder: Number(form.sortOrder) || 0 } };
    if (editing) {
      update.mutate({ id: editing.id, ...payload }, { onSuccess: () => { invalidate(); setShowForm(false); toast({ title: "Testimonial updated" }); } });
    } else {
      create.mutate(payload, { onSuccess: () => { invalidate(); setShowForm(false); toast({ title: "Testimonial added" }); } });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    remove.mutate({ id: deleteTarget }, { onSuccess: () => { invalidate(); setDeleteTarget(null); toast({ title: "Testimonial deleted" }); } });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <SectionHeader title="Testimonials" onAdd={openAdd} addLabel="Add Testimonial" />
      <div className="space-y-4">
        {isLoading ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />) :
          testimonials?.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground"><MessageSquare size={40} className="mx-auto mb-4 opacity-20" /><p>No testimonials yet.</p></div>
          ) : (
            testimonials?.map(t => (
              <Card key={t.id} className="border-0 shadow-sm">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                    {t.authorName[0]}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="italic text-muted-foreground text-sm mb-2 line-clamp-2">"{t.quote}"</p>
                    <p className="font-bold text-primary text-sm">{t.authorName}</p>
                    <p className="text-xs text-muted-foreground">{t.authorRole}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={t.active ? "default" : "outline"} className={t.active ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>{t.active ? "Active" : "Hidden"}</Badge>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(t)}><Edit size={15} /></Button>
                    <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-600" onClick={() => setDeleteTarget(t.id)}><Trash2 size={15} /></Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Quote *</Label><Textarea value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} rows={3} placeholder="What the client said..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Author Name *</Label><Input value={form.authorName} onChange={e => setForm({ ...form, authorName: e.target.value })} placeholder="Jane Smith" /></div>
              <div><Label>Author Role</Label><Input value={form.authorRole} onChange={e => setForm({ ...form, authorRole: e.target.value })} placeholder="CEO, Company" /></div>
            </div>
            <div><Label>Avatar URL</Label><Input value={form.avatarUrl} onChange={e => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://..." /></div>
            <div className="flex items-center gap-3">
              <SwitchUI checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} id="active-switch" />
              <Label htmlFor="active-switch">Show on website</Label>
            </div>
            <div><Label>Sort Order</Label><Input type="number" min={0} value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={create.isPending || update.isPending} className="bg-primary">
              {(create.isPending || update.isPending) ? "Saving..." : editing ? "Save Changes" : "Add Testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name="this testimonial" />
    </div>
  );
}

function ProcessStepsManagement() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: steps, isLoading } = useListProcessSteps();
  const create = useCreateProcessStep();
  const update = useUpdateProcessStep();
  const remove = useDeleteProcessStep();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const emptyForm = { stepNumber: "", title: "", description: "", sortOrder: 0 };
  const [form, setForm] = useState<any>(emptyForm);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListProcessStepsQueryKey() });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (s: any) => { setEditing(s); setForm({ stepNumber: s.stepNumber, title: s.title, description: s.description, sortOrder: s.sortOrder }); setShowForm(true); };

  const handleSave = () => {
    if (!form.stepNumber || !form.title) { toast({ title: "Step number and title are required", variant: "destructive" }); return; }
    const payload = { data: { ...form, sortOrder: Number(form.sortOrder) || 0 } };
    if (editing) {
      update.mutate({ id: editing.id, ...payload }, { onSuccess: () => { invalidate(); setShowForm(false); toast({ title: "Step updated" }); } });
    } else {
      create.mutate(payload, { onSuccess: () => { invalidate(); setShowForm(false); toast({ title: "Step added" }); } });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    remove.mutate({ id: deleteTarget }, { onSuccess: () => { invalidate(); setDeleteTarget(null); toast({ title: "Step deleted" }); } });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <SectionHeader title="Process Steps" onAdd={openAdd} addLabel="Add Step" />
      <div className="space-y-4">
        {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />) :
          steps?.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground"><ListOrdered size={40} className="mx-auto mb-4 opacity-20" /><p>No steps yet.</p></div>
          ) : (
            steps?.map((s, index) => (
              <Card key={s.id} className="border-0 shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-full flex items-center justify-center text-lg font-bold shrink-0">
                    {s.stepNumber}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-primary">{s.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{s.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Edit size={15} /></Button>
                    <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-600" onClick={() => setDeleteTarget(s.id)}><Trash2 size={15} /></Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Step" : "Add Process Step"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Step Number *</Label><Input value={form.stepNumber} onChange={e => setForm({ ...form, stepNumber: e.target.value })} placeholder="01" /></div>
              <div><Label>Sort Order</Label><Input type="number" min={0} value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} /></div>
            </div>
            <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Consultation" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief description of this step..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={create.isPending || update.isPending} className="bg-primary">
              {(create.isPending || update.isPending) ? "Saving..." : editing ? "Save Changes" : "Add Step"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name="this step" />
    </div>
  );
}

function AdminDashboardContent() {
  const { username } = useAdminAuth();
  const [location] = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { data: messages } = useListContactMessages();
  const unread = messages?.filter(m => !m.isRead).length || 0;

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/projects", icon: Building2, label: "Projects" },
    { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
    { href: "/admin/team", icon: Users, label: "Team" },
    { href: "/admin/services", icon: Hammer, label: "Services" },
    { href: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
    { href: "/admin/process-steps", icon: ListOrdered, label: "Process Steps" },
    { href: "/admin/social", icon: Share2, label: "Social Links" },
    { href: "/admin/company", icon: Info, label: "Company Info" },
    { href: "/admin/messages", icon: Mail, label: "Messages", badge: unread },
  ];

  const closeSidebar = () => setIsMobileSidebarOpen(false);

  const SidebarContent = () => (
    <>
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => (
          <div key={item.href} onClick={closeSidebar}>
            <SidebarItem
              {...item}
              active={location === item.href || (item.href !== "/admin" && location.startsWith(item.href))}
            />
          </div>
        ))}
      </nav>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-4 mb-2">View Site</p>
        <div className="space-y-0.5">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/services", label: "Services" },
            { href: "/portfolio", label: "Portfolio" },
            { href: "/gallery", label: "Gallery" },
            { href: "/team", label: "Team" },
            { href: "/contact", label: "Contact" },
          ].map((page) => (
            <a
              key={page.href}
              href={page.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-slate-50 rounded-xl transition-colors"
            >
              <ExternalLink size={12} className="shrink-0" />
              {page.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
            {username?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-sm font-bold text-primary truncate">{username || "Admin"}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Administrator</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm"
          onClick={async () => { await adminLogout(); window.location.href = "/admin/login"; }}
        >
          <LogOut size={16} /> Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar — fixed, visible md+ */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 p-5 fixed top-0 left-0 h-full z-30 shadow-sm">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-serif font-black text-secondary text-xl shrink-0">F</div>
          <div className="min-w-0">
            <h1 className="font-serif font-bold text-sm text-primary leading-tight">FORTH ARCHITECTURE &amp;</h1>
            <p className="text-[8px] text-secondary/70 uppercase tracking-wider mt-0.5 font-medium">CONSULTING CONSTRUCTION LTD</p>
          </div>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" onClick={closeSidebar}>
          <aside className="w-72 bg-white h-full p-5 flex flex-col animate-in slide-in-from-left duration-200 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-serif font-black text-secondary text-xl shrink-0">F</div>
                <div>
                  <h1 className="font-serif font-bold text-sm text-primary leading-tight">FORTH ARCHITECTURE &amp;</h1>
                  <p className="text-[8px] text-secondary/70 uppercase tracking-wider mt-0.5 font-medium">CONSULTING CONSTRUCTION LTD</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={closeSidebar}><X size={18} /></Button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Right column: mobile header + main */}
      <div className="flex flex-col flex-grow md:ml-64 min-h-screen min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center font-serif font-black text-secondary text-lg shrink-0">F</div>
            <div>
              <h1 className="font-serif font-bold text-sm text-primary leading-tight">FORTH ARCHITECTURE &amp;</h1>
              <p className="text-[8px] text-secondary/70 uppercase tracking-wider font-medium">CONSULTING CONSTRUCTION LTD</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)}>
            <Menu size={20} />
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-grow w-full">
          <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <Switch>
              <Route path="/admin" component={DashboardOverview} />
              <Route path="/admin/projects" component={ProjectsManagement} />
              <Route path="/admin/gallery" component={GalleryManagement} />
              <Route path="/admin/team" component={TeamManagement} />
              <Route path="/admin/services" component={ServicesManagement} />
              <Route path="/admin/testimonials" component={TestimonialsManagement} />
              <Route path="/admin/process-steps" component={ProcessStepsManagement} />
              <Route path="/admin/social" component={SocialLinksManagement} />
              <Route path="/admin/company" component={CompanyInfoManagement} />
              <Route path="/admin/messages" component={MessagesInbox} />
              <Route component={() => <Redirect to="/admin" />} />
            </Switch>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return <AdminDashboardContent />;
}
