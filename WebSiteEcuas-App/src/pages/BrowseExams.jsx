import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import YearSelector from '../components/YearSelector';
import SemesterSelector from '../components/SemesterSelector';
import FilterSelector from '../components/FilterSelector';
import ExamTypeList from '../components/ExamTypeList';
import { EXAM_NAMES, hasVariant, VARIANTS } from '../data/examOptions';

export default function BrowseExams() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedSemester, setSelectedSemester] = useState('II');
  const [selectedName, setSelectedName] = useState('Todos');
  const [selectedVariant, setSelectedVariant] = useState('Todos');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // La reposición no tiene tipo: con ese examen elegido el filtro de tipo se esconde y no se aplica
  const showVariant = hasVariant(selectedName);
  const variant = showVariant ? selectedVariant : 'Todos';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="grow">
        <div className="mx-auto max-w-page px-gutter pb-section pt-section-sm">
          <h1 className="font-display text-title font-semibold text-ink">
            Selecciona un examen
          </h1>
          <p className="mt-3 max-w-prose text-neutral-600">
            Elige el año y el semestre para ver los exámenes disponibles.
          </p>

          {/* Filtros: año y semestre */}
          <div className="mt-10 border-y border-neutral-300 py-6">
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

            {/* Filtros avanzados: qué examen (parcial o reposición) y de qué tipo */}
            <div className="mt-5 border-t border-neutral-200 pt-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                aria-expanded={showAdvanced}
                className="flex items-center gap-2 text-small font-semibold text-neutral-600 transition-colors duration-150 hover:text-ink"
              >
                <span
                  aria-hidden="true"
                  className={`text-caption transition-transform duration-150 ${showAdvanced ? 'rotate-90' : ''}`}
                >
                  ▶
                </span>
                Filtros avanzados
                {[selectedName, variant]
                  .filter(choice => choice !== 'Todos')
                  .map(choice => (
                    <span key={choice} className="rounded-pill bg-accent/10 px-2 py-0.5 text-caption text-accent">
                      {choice}
                    </span>
                  ))}
              </button>

              {showAdvanced && (
                <div className="mt-4 flex flex-wrap gap-x-10 gap-y-5">
                  <FilterSelector
                    title="Examen"
                    options={EXAM_NAMES}
                    selected={selectedName}
                    onSelect={setSelectedName}
                  />
                  {showVariant && (
                    <FilterSelector
                      title="Tipo"
                      options={VARIANTS}
                      selected={selectedVariant}
                      onSelect={setSelectedVariant}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Lista de exámenes */}
          <ExamTypeList
            year={selectedYear}
            semester={selectedSemester}
            name={selectedName}
            variant={variant}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
