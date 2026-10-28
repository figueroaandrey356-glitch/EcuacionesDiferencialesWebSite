# 🚀 Roadmap Detallado - Paso a Paso

## BLOQUE 1: SETUP DEL PROYECTO (Día 1)

### Paso 1.1: Crear estructura base de React + Vite
- [ ] Inicializar proyecto React con Vite
- [ ] Instalar dependencias principales:
  - react
  - react-router-dom
  - tailwindcss
  - framer-motion
  - react-pdf
  - zustand (state management)
- [ ] Configurar Tailwind CSS
- [ ] Crear carpeta de estructura (components/, pages/, hooks/, utils/)

### Paso 1.2: Crear archivo de estilos globales
- [ ] Crear `src/styles/globals.css` con variables de color y temas
- [ ] Definir paleta de colores (azul TEC, grises, etc)
- [ ] Configurar tipografía base

### Paso 1.3: Setup de rutas base
- [ ] Crear `src/App.jsx` con React Router
- [ ] Definir rutas principales:
  - `/` (Home)
  - `/exams` (Browse Exams)
  - `/exams/:examId` (Exam Practice)
- [ ] Crear layout base con Header

---

## BLOQUE 2: COMPONENTES BÁSICOS (Día 1-2)

### Paso 2.1: Crear Header
- [ ] Componente `Header.jsx`
  - Logo "WebSiteEcuas"
  - Navegación principal
  - Breadcrumb dinámico
  - Botón de tema (light/dark - futuro)

### Paso 2.2: Crear página Home
- [ ] `pages/Home.jsx`
  - Descripción del proyecto
  - Botón grande "Ir a Exámenes"
  - Información sobre cómo usar
  - Diseño atractivo con Tailwind

### Paso 2.3: Crear página Browse Exams
- [ ] `pages/BrowseExams.jsx`
- [ ] `components/YearSelector.jsx` - Selector de año (2023, 2024, 2025, 2026)
- [ ] `components/SemesterSelector.jsx` - Selector de semestre (I, II)
- [ ] `components/ExamTypeList.jsx` - Lista de tipos de examen:
  - Primer Parcial (Ordinario/Extraordinario)
  - Segundo Parcial (Ordinario/Extraordinario)
  - Tercer Parcial (Ordinario/Extraordinario)
  - Examen de Reposición

### Paso 2.4: Crear QuestionCard (Componente clave)
- [ ] `components/QuestionCard.jsx`
  - Muestra enunciado de pregunta
  - Numera la pregunta
  - Contador: "Pregunta X de N"
  - Botón "Revelar siguiente paso →"
  - Área para mostrar pasos revelados

### Paso 2.5: Crear StepReveal (Componente clave)
- [ ] `components/StepReveal.jsx`
  - Título del paso: "Paso 1: Identificar tipo de ecuación"
  - Contenido del paso (con soporte para LaTeX)
  - Animación de entrada (Framer Motion)
  - Estilos visuales atractivos

### Paso 2.6: Crear SolutionViewer
- [ ] `components/SolutionViewer.jsx`
  - Modal que muestra solución completa
  - Botón "Cerrar"
  - Soporte para PDF o HTML

---

## BLOQUE 3: ESTRUCTURA DE DATOS Y STATE (Día 2)

### Paso 3.1: Crear archivo de datos mock
- [ ] `src/data/mockExams.js`
  - Estructura de datos para exámenes
  - Ejemplo: 1 examen completo (Primer Parcial S1 2023) con 3 preguntas

### Paso 3.2: Crear estructura mock de una pregunta
```javascript
{
  id: "q_2023_S1_P1_001",
  questionNumber: 1,
  statement: "Resolver: dy/dx + 2y = e^x",
  steps: [
    { stepNumber: 1, title: "Paso 1", content: "..." },
    { stepNumber: 2, title: "Paso 2", content: "..." },
    { stepNumber: 3, title: "Paso 3", content: "..." },
  ]
}
```

### Paso 3.3: Crear Zustand store para exámenes
- [ ] `src/store/examStore.js`
  - State: exámenes, examen actual, preguntas
  - Actions: setCurrentExam, getExamQuestions, etc

### Paso 3.4: Crear Zustand store para UI
- [ ] `src/store/uiStore.js`
  - State: revealedSteps (qué pasos están visibles)
  - Actions: revealNextStep(questionId)

### Paso 3.5: Crear hook personalizado
- [ ] `src/hooks/useExamPractice.js`
  - Hook que maneja la lógica de práctica
  - Retorna: currentExam, questions, revealNextStep, etc

---

## BLOQUE 4: PÁGINA DE PRÁCTICA (Día 2-3)

### Paso 4.1: Crear página ExamPractice
- [ ] `pages/ExamPractice.jsx`
- [ ] Layout: Sidebar izquierdo + Main derecha
- [ ] Obtener examId de URL params
- [ ] Cargar examen y preguntas

### Paso 4.2: Implementar Sidebar
- [ ] Mostrar título del examen
- [ ] Mostrar año/semestre/tipo
- [ ] Botón "Descargar Enunciado" (por ahora dummy)
- [ ] Botón "Ver Solución Completa" (por ahora dummy)
- [ ] Lista de preguntas (con números, navegable)
- [ ] Mostrar progreso: "Pregunta 1 de 3"

### Paso 4.3: Implementar Main Content
- [ ] Renderizar QuestionCard actual
- [ ] Mostrar contador: "Paso 2 de 4"
- [ ] Botón grande: "Revelar siguiente paso →"
- [ ] Mostrar pasos revelados con animación
- [ ] Botones de navegación: "Pregunta anterior" / "Siguiente pregunta"

### Paso 4.4: Conectar lógica de desbloqueo
- [ ] Al hacer click en "Revelar siguiente paso":
  - Incrementar revealedSteps del store
  - Animar entrada del nuevo paso
  - Desabilitar botón si es último paso

### Paso 4.5: Implementar navegación entre preguntas
- [ ] Botón "← Pregunta anterior" (desabilitado si es la primera)
- [ ] Botón "Siguiente pregunta →" (desabilitado si es la última)
- [ ] Al cambiar pregunta: resettear revealedSteps a 0

---

## BLOQUE 5: ESTILOS Y ANIMACIONES (Día 3)

### Paso 5.1: Estilos de QuestionCard
- [ ] Fondo blanco/gris claro
- [ ] Borde izquierdo de color (azul)
- [ ] Padding generoso
- [ ] Sombra suave
- [ ] Enunciado en tipografía clara

### Paso 5.2: Estilos de StepReveal
- [ ] Cada paso con fondo ligeramente diferente
- [ ] Número del paso en círculo azul
- [ ] Título en negrita
- [ ] Contenido indentado

### Paso 5.3: Animaciones con Framer Motion
- [ ] Entrada de pasos: slideInUp + fadeIn
- [ ] Cambio de pregunta: fadeOut + fadeIn
- [ ] Hover en botones: scale + shadow
- [ ] Reveal de pasos: smooth expansion

### Paso 5.4: Responsive design
- [ ] En móvil: Sidebar colapsable (hamburger menu)
- [ ] En tablet: Sidebar a lado
- [ ] Asegurar QuestionCard se adapte bien

### Paso 5.5: Modo Dark (Opcional para MVP)
- [ ] Alternar entre light/dark tema
- [ ] Usar Tailwind dark: classes
- [ ] Persistir preferencia en localStorage

---

## BLOQUE 6: DATOS DE PRUEBA REALISTAS (Día 3-4)

### Paso 6.1: Crear 1 examen completo de ejemplo
- [ ] Examen: "Primer Parcial Ordinario - Semestre I 2023"
- [ ] 5 preguntas reales de ecuaciones diferenciales
- [ ] Cada pregunta con 4-5 pasos de solución

### Paso 6.2: Crear contenido de pasos
- [ ] Paso 1: Identificación del tipo de ecuación
- [ ] Paso 2: Transformación/reescritura
- [ ] Paso 3: Aplicación del método
- [ ] Paso 4: Solución final
- [ ] Incluir pasos con LaTeX cuando sea necesario

### Paso 6.3: Validar estructura de datos
- [ ] Todas las preguntas tienen stepCount correcto
- [ ] No hay stepNumber duplicados
- [ ] Todos los pasos tienen content

---

## BLOQUE 7: FUNCIONALIDADES SECUNDARIAS (Día 4)

### Paso 7.1: Implementar "Descargar Enunciado"
- [ ] Botón que descarga mock PDF (o imagen)
- [ ] Usar librería adecuada para generar PDF
- [ ] Nombre: `{examId}_enunciado.pdf`

### Paso 7.2: Implementar "Ver Solución Completa"
- [ ] Modal que muestra todas las soluciones
- [ ] Botón con confirmación: "¿Ver solución completa?"
- [ ] Cerrar modal con X o ESC

### Paso 7.3: Implementar búsqueda rápida (Opcional)
- [ ] Campo de búsqueda en sidebar
- [ ] Filtrar preguntas por número o palabra clave

### Paso 7.4: Indicador visual de progreso
- [ ] Mostrar qué preguntas han sido practicadas
- [ ] Mostrar badge cuando todas las preguntas tienen ≥3 pasos revelados

---

## BLOQUE 8: TESTING Y PULIDO (Día 4-5)

### Paso 8.1: Testing manual
- [ ] Probar flujo completo en navegadores (Chrome, Firefox, Safari)
- [ ] Probar en móvil (responsive)
- [ ] Verificar animations suave
- [ ] Verificar sin errores en console

### Paso 8.2: Error handling
- [ ] Manejar caso donde examId no existe
- [ ] Manejar caso donde no hay preguntas
- [ ] Mostrar mensajes amigables de error

### Paso 8.3: Performance
- [ ] Verificar que página carga en < 2s
- [ ] Verificar que no hay memory leaks en componentes

### Paso 8.4: Accesibilidad básica
- [ ] Agregar alt text a imágenes
- [ ] Verificar contraste de colores
- [ ] Asegurar navegación por teclado funciona

### Paso 8.5: UX Polish
- [ ] Agregar micro-interacciones (hover effects)
- [ ] Mejorar spacing y padding
- [ ] Asegurar tipografía es consistente

---

## BLOQUE 9: SETUP DE FIREBASE (Día 5)

### Paso 9.1: Crear proyecto Firebase
- [ ] Crear cuenta/proyecto en Firebase
- [ ] Obtener credenciales
- [ ] Crear archivo `src/utils/firebaseConfig.js`

### Paso 9.2: Preparar Firestore
- [ ] Crear colecciones:
  - `exams`
  - `questions`
- [ ] Definir índices si es necesario

### Paso 9.3: Crear API service
- [ ] `src/utils/api.js`
- [ ] Funciones: getExams(), getQuestions(examId), etc
- [ ] Por ahora: retorna datos mock
- [ ] Futuro: conecta a Firestore

---

## BLOQUE 10: DEPLOY (Día 5)

### Paso 10.1: Build y test de producción
- [ ] `npm run build`
- [ ] Verificar que build no tiene errores
- [ ] Probar build localmente: `npm run preview`

### Paso 10.2: Deploy a GitHub Pages
- [ ] Configurar `vite.config.js` para GitHub Pages
- [ ] Crear GitHub Action para auto-deploy
- [ ] Push a main y verificar que aparece en URL

### Paso 10.3: Verificar en producción
- [ ] Abrir https://figueroaandrey356-glitch.github.io/EcuacionesDiferencialesWebSite/
- [ ] Probar flujo completo en producción
- [ ] Verificar que no hay errores

---

## 📊 Timeline Estimado

| Bloque | Descripción | Tiempo | Día |
|--------|-------------|--------|-----|
| 1 | Setup proyecto | 30 min | 1 |
| 2 | Componentes básicos | 2-3 h | 1-2 |
| 3 | Data y State | 1 h | 2 |
| 4 | Página de práctica | 2-3 h | 2-3 |
| 5 | Estilos y animaciones | 2 h | 3 |
| 6 | Datos realistas | 1.5 h | 3-4 |
| 7 | Features secundarias | 1.5 h | 4 |
| 8 | Testing y pulido | 2 h | 4-5 |
| 9 | Firebase setup | 1 h | 5 |
| 10 | Deploy | 30 min | 5 |
| **TOTAL** | **MVP Completo** | **~14-16 h** | **5 días** |

---

## ✅ Checklist de Completitud MVP

- [ ] Home page funcional
- [ ] Browse exams funcional
- [ ] 1 examen completo con 5 preguntas
- [ ] Sistema de desbloqueo de pasos funcionando
- [ ] Descargar enunciado funcionando
- [ ] Ver solución completa funcionando
- [ ] Navegación entre preguntas funcionando
- [ ] Responsive design funcional
- [ ] Sin errores en console
- [ ] Deploy en GitHub Pages
- [ ] URL pública accesible

---

## 🎯 Inicio Inmediato

**Vamos a comenzar con:**

1. **Paso 1.1** → Crear estructura React + Vite
2. **Paso 1.2** → Estilos globales
3. **Paso 1.3** → Setup de rutas

¿Empezamos ahora?
