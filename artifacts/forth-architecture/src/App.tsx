import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, Redirect, useLocation, Router as WouterRouter } from 'wouter';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import PortfolioPage from "@/pages/PortfolioPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import GalleryPage from "@/pages/GalleryPage";
import TeamPage from "@/pages/TeamPage";
import ContactPage from "@/pages/ContactPage";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: { 
    logoPlacement: "inside" as const, 
    logoLinkUrl: basePath || "/", 
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg` 
  },
  variables: {
    colorPrimary: "#1a2744",
    colorForeground: "#0d1117",
    colorMutedForeground: "#6b7280",
    colorDanger: "#ef4444",
    colorBackground: "#ffffff",
    colorInput: "#f9f8f6",
    colorInputForeground: "#0d1117",
    colorNeutral: "#e8e4dc",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white shadow-xl rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#0d1117] font-semibold",
    headerSubtitle: "text-[#6b7280]",
    socialButtonsBlockButtonText: "text-[#0d1117]",
    formFieldLabel: "text-[#0d1117] font-medium",
    footerActionLink: "text-[#1a2744] hover:text-[#c9a84c]",
    footerActionText: "text-[#6b7280]",
    dividerText: "text-[#6b7280]",
    identityPreviewEditButton: "text-[#1a2744]",
    formFieldSuccessText: "text-green-600",
    alertText: "text-[#ef4444]",
    logoBox: "mb-4",
    logoImage: "h-12 w-auto",
    socialButtonsBlockButton: "border border-[#e8e4dc] hover:bg-[#f9f8f6]",
    formButtonPrimary: "bg-[#1a2744] hover:bg-[#0d1117] text-white",
    formFieldInput: "border-[#e8e4dc] bg-[#f9f8f6] text-[#0d1117]",
    footerAction: "bg-[#f9f8f6]",
    dividerLine: "bg-[#e8e4dc]",
    alert: "bg-red-50 border-red-200",
    otpCodeFieldInput: "border-[#e8e4dc]",
    formFieldRow: "gap-3",
    main: "gap-4",
  }
};

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/admin" />
      </Show>
      <Show when="signed-out">
        <HomePage />
      </Show>
    </>
  );
}

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to access your account",
          },
        },
        signUp: {
          start: {
            title: "Create your account",
            subtitle: "Get started today",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <ScrollToTop />
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/portfolio" component={PortfolioPage} />
            <Route path="/portfolio/:id" component={ProjectDetailPage} />
            <Route path="/gallery" component={GalleryPage} />
            <Route path="/team" component={TeamPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/*" component={AdminDashboard} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;