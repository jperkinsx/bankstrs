import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { config } from "./lib/wagmi";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/home";
import Auction from "@/pages/auction";
import Gallery from "@/pages/gallery";
import Agent from "@/pages/agent";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auction" component={Auction} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/agent" component={Agent} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "hsl(160 100% 42%)",
            accentColorForeground: "hsl(220 25% 5%)",
            borderRadius: "small",
          })}
        >
          <TooltipProvider>
            <Toaster />
            <Router hook={useHashLocation}>
              <Navbar />
              <main className="pt-16">
                <AppRouter />
              </main>
            </Router>
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
