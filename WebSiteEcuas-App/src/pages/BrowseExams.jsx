import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import YearSelector from '../components/YearSelector';
import SemesterSelector from '../components/SemesterSelector';
import VariantSelector from '../components/VariantSelector';
import ExamTypeList from '../components/ExamTypeList';

export default function BrowseExams() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedSemester, setSelectedSemester] = useState('II');
  const [selectedVariant, setSelectedVariant] = useState('Todos');
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="grow">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Selecciona un examen
          </h1>
          <p className="mt-3 text-sand-600">
            Elige el año y el semestre para ver los exámenes disponibles.
          </p>

          {/* Filtros: año y semestre */}
          <div className="mt-8 rounded-panel border border-sand-200 bg-surface p-5">
            <div className="flex flex-wrap gap-x-10 gap-y-5">
              <YearSelector
                selectedYear={selectedYear}
                onSelectYear={setSelectedYear}
              />
              <SemesterSelector
                selectedSemester={selectedSemester}
                onSelectSemester={setSelectedSemester}
              />
            </div>

            {/* Filtros avanzados: tipo de examen */}
            <div className="mt-5 border-t border-sand-200 pt-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                aria-expanded={showAdvanced}
                className="flex items-center gap-2 text-sm font-semibold text-sand-600 transition hover:text-ink"
              >
                <span
                  aria-hidden="true"
                  className={`text-xs transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
                >
                  ▶
                </span>
                Filtros avanzados
                {selectedVariant !== 'Todos' && (
                  <span className="rounded-pill bg-accent/10 px-2 py-0.5 text-xs text-accent">
                    {selectedVariant}
                  </span>
                )}
              </button>

              {showAdvanced && (
                <div className="mt-4">
                  <VariantSelector
                    selectedVariant={selectedVariant}
                    onSelectVariant={setSelectedVariant}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Lista de exámenes */}
          <ExamTypeList
            year={selectedYear}
            semester={selectedSemester}
            variant={selectedVariant}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
