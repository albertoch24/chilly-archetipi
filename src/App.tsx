import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "@/contexts/QuizContext";
import { PasswordGate } from "@/components/PasswordGate";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WorkshopLanding } from "@/components/WorkshopLanding";
import { HomePage } from "@/components/HomePage";
import { QuizPage } from "@/components/QuizPage";
import { CompletePage } from "@/components/CompletePage";
import { ResultsPage } from "@/components/ResultsPage";
import { ArchetypePage } from "@/components/ArchetypePage";
import { ArchetypeDetailPage } from "@/components/ArchetypeDetailPage";
import { ArchetypesListPage } from "@/components/ArchetypesListPage";
import { ValuesExercisePage } from "@/components/values/ValuesExercisePage";
import { ValuesDashboardPage } from "@/components/values/ValuesDashboardPage";
import { ValuesMapPage } from "@/components/values/ValuesMapPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PasswordGate>
        <QuizProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Home del workshop */}
              <Route path="/" element={<WorkshopLanding />} />

              {/* Esercizio 1: archetipo */}
              <Route path="/archetypes" element={<HomePage />} />
              <Route path="/archetypes/quiz" element={<QuizPage />} />
              <Route path="/archetypes/complete" element={<CompletePage />} />
              <Route path="/archetypes/results" element={<ResultsPage />} />
              <Route path="/archetypes/archetype" element={<ArchetypePage />} />
              <Route path="/archetypes/list" element={<ArchetypesListPage />} />
              <Route path="/archetypes/:archetypeId" element={<ArchetypeDetailPage />} />

              {/* Esercizi 2 e 3: valori */}
              <Route path="/valori/attuali" element={<ValuesExercisePage key="current" exercise="current" />} />
              <Route path="/valori/obiettivo" element={<ValuesExercisePage key="target" exercise="target" />} />
              <Route path="/valori/facilitatore" element={<ValuesDashboardPage />} />
              <Route path="/valori/mappa" element={<ValuesMapPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </QuizProvider>
      </PasswordGate>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
