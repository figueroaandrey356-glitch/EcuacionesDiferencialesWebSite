# Plan del Proyecto: WebSiteEcuas - Banco de Exámenes

## 1. Visión del Proyecto

Banco de exámenes para estudiantes de Ecuaciones Diferenciales del TEC Costa Rica: exámenes de semestres anteriores (2023 en adelante) que se pueden ver dentro del sitio o descargar en PDF.

> **Cambio de alcance (27/10/2026):** se descartó la solución paso a paso. El sitio es solo un banco de exámenes en PDF (visor embebido + descarga). Más adelante se podrían agregar otros recursos. Las secciones de este documento que hablan de pasos, preguntas o `StepReveal` quedan como referencia histórica.

---

## 2. Stack Tecnológico

### Frontend
- **Framework:** React 18+
- **Styling:** Tailwind CSS
- **Animaciones:** Framer Motion
- **PDF Viewer:** react-pdf
- **State Management:** Context API o Zustand (simple)
- **Build:** Vite

### Backend
- **Base de datos:** Firebase Firestore (o Supabase PostgreSQL)
- **Hosting:** GitHub Pages (Frontend) + Firebase (Backend)
- **Storage:** Firebase Storage (PDFs)

### DevOps
- Git + GitHub
- GitHub Actions para deploy automático

---

## 3. Estructura de Datos (Schema)

### Colección: `exams`
```json
{
  "id": "2023_S1_P1_Ordinario",
  "year": 2023,
  "semester": "I",
  "examType": "Primer Parcial",
  "variant": "Ordinario",
  "date": "2023-03-15",
  "totalQuestions": 5,
  "pdfUrl": "gs://bucket/2023_S1_P1_Ordinario.pdf",
  "createdAt": "2026-10-06T00:00:00Z"
}
```

### Colección: `questions`
```json
{
  "id": "q_2023_S1_P1_Ordinario_001",
  "examId": "2023_S1_P1_Ordinario",
  "questionNumber": 1,
  "statement": "Resolver la ecuación diferencial...",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Identificar el tipo de ecuación",
      "content": "Esta es una ecuación diferencial lineal de primer orden..."
    },
    {
      "stepNumber": 2,
      "title": "Reescribir en forma estándar",
      "content": "dy/dx + P(x)y = Q(x)..."
    },
    {
      "stepNumber": 3,
      "title": "Hallar factor integrante",
      "content": "μ(x) = e^(∫P(x)dx)..."
    },
    {
      "stepNumber": 4,
      "title": "Solución final",
      "content": "y = ..."
    }
  ],
  "fullSolution": "Link a PDF o HTML con solución completa",
  "difficulty": "Medio"
}
```

---

## 4. Estructura de Carpetas (Frontend)

```
WebSiteEcuas/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   ├── YearSelector.jsx
│   │   ├── ExamList.jsx
│   │   ├── ExamDetail.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── StepReveal.jsx
│   │   └── SolutionViewer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── BrowseExams.jsx
│   │   └── ExamPractice.jsx
│   ├── hooks/
│   │   ├── useExams.js
│   │   └── useQuestions.js
│   ├── utils/
│   │   ├── firebaseConfig.js
│   │   ├── api.js
│   │   └── constants.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── public/
└── vite.config.js
```

---

## 5. Flujo de Usuario (UX)

### 5.1 Navegación Principal
```
Home
  ↓
Browse Exams (Selector de año/semestre)
  ↓
Exam List (Lista de tipos de parciales)
  ↓
Exam Practice (Dentro del examen)
  ├── Ver enunciado completo (PDF)
  ├── Ver preguntas en cajas
  └── Por cada pregunta:
      ├── Ver paso 1
      ├── Ver paso 2
      └── etc...
```

### 5.2 Dentro del Examen (Pantalla Principal)

**Arriba:**
- Título: "Primer Parcial Ordinario - Semestre I 2023"
- Breadcrumb: Home > 2023 > Semestre I > Primer Parcial

**Lado izquierdo (Sidebar):**
- Botón "Descargar Enunciado" (PDF)
- Botón "Ver Solución Completa" (con confirmación)
- Progreso: "Pregunta X de N"
- Lista de preguntas (clickeable)

**Centro (Main):**
- QuestionCard (enunciado)
- Contador de pasos: "Paso 2 de 4"
- Botón grande: "Revelar siguiente paso →"
- Botón secundario: "Ver solución completa de este ejercicio"

---

## 6. Componentes Principales

### QuestionCard
```jsx
<QuestionCard
  questionNumber={1}
  statement="Resolver: dy/dx + 2y = e^x"
  maxSteps={4}
  currentStep={currentStep}
  onRevealStep={handleRevealStep}
  onViewFullSolution={handleViewFullSolution}
/>
```

### StepReveal
```jsx
<StepReveal
  step={2}
  title="Reescribir en forma estándar"
  content="dy/dx + P(x)y = Q(x)..."
  isRevealed={true}
  onClickNext={handleNext}
/>
```

---

## 7. Fases de Implementación

### **FASE 1: MVP (2-3 semanas)**
- [ ] Setup del proyecto (React + Vite + Tailwind)
- [ ] Estructura base de componentes
- [ ] Mockup de datos (JSON local)
- [ ] Navegación: Home → Seleccionar año → Seleccionar semestre
- [ ] Página de práctica con 1-2 exámenes completos
- [ ] Sistema de desbloqueo de pasos
- [ ] Descargar enunciado (PDF)
- [ ] Deploy inicial

### **FASE 2: Data Population (1-2 semanas)**
- [ ] Integración con Firebase Firestore
- [ ] Cargar todos los exámenes (2023-2026 S2)
- [ ] Cargar todas las preguntas con pasos
- [ ] Cargar PDFs a Storage

### **FASE 3: UX/Diseño Mejorado (1 semana)**
- [ ] Animaciones con Framer Motion
- [ ] Dark mode
- [ ] Responsive design (mobile)
- [ ] Loading states y error handling

### **FASE 4: Características Adicionales (Futuro)**
- [ ] Filtros avanzados (por dificultad, tema)
- [ ] Búsqueda de preguntas
- [ ] Modo sin conexión (PWA)

---

## 8. Detalles de Implementación Importante

### 8.1 Sistema de Pasos
```javascript
// Estado local de un examen
const [revealedSteps, setRevealedSteps] = useState({
  q1: 1,  // Solo primer paso visible
  q2: 0,  // Sin pasos visibles
  q3: 3   // Tres pasos visibles
});
```

### 8.2 Desbloqueo de Pasos
```javascript
const handleRevealNextStep = (questionId) => {
  const currentStep = revealedSteps[questionId] || 0;
  const maxSteps = questions[questionId].steps.length;
  
  if (currentStep < maxSteps) {
    setRevealedSteps({
      ...revealedSteps,
      [questionId]: currentStep + 1
    });
  }
};
```

### 8.3 Descarga de PDFs
```javascript
// Botón "Descargar Enunciado"
const downloadPDF = async (examId) => {
  const exam = await fetchExam(examId);
  const link = document.createElement('a');
  link.href = exam.pdfUrl;
  link.download = `${examId}.pdf`;
  link.click();
};
```

---

## 9. Estructura de Años/Semestres

### Años disponibles: 2023, 2024, 2025, 2026

### Semestres (por año):
- **Semestre I** (Marzo - Julio)
  - Primer Parcial (Ordinario, Extraordinario)
  - Segundo Parcial (Ordinario, Extraordinario)
  - Tercer Parcial (Ordinario, Extraordinario)
  - Examen de Reposición

- **Semestre II** (Agosto - Noviembre)
  - Primer Parcial (Ordinario, Extraordinario)
  - Segundo Parcial (Ordinario, Extraordinario) ← **ESTAMOS AQUÍ** (no realizado aún)
  - Tercer Parcial (Ordinario, Extraordinario)
  - Examen de Reposición

---

## 10. Criterios de Éxito

- ✅ Estudiantes pueden navegar fácilmente a cualquier examen
- ✅ Sistema de pasos funciona sin bugs
- ✅ Descargar PDFs funciona en todos los navegadores
- ✅ Página carga en < 2 segundos
- ✅ Responsive en móvil y desktop
- ✅ Al menos 50 exámenes cargados inicialmente

---

## 11. Próximos Pasos

1. **Crear repositorio + setup del proyecto**
2. **Diseñar mockups de UI/UX**
3. **Comenzar con Fase 1 (MVP)**
4. **Recolectar exámenes en formato digital**
5. **Estructurar las soluciones paso a paso**

