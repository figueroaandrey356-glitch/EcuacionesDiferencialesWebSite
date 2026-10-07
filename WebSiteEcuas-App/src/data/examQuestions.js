export const examQuestions = {
  '2026_II_1': {
    title: 'Primer Parcial - Ordinario',
    year: 2026,
    semester: 'II',
    examId: 1,
    questions: [
      {
        id: 1,
        topic: 'Variables separables',
        statement: 'Resuelve la ecuación diferencial:\n\ndy/dx = 2x',
        steps: [
          'Separamos variables: dy = 2x dx',
          'Integramos ambos lados: ∫dy = ∫2x dx',
          'Lado izquierdo: y',
          'Lado derecho: 2x²/2 = x²',
          'Solución general: y = x² + C, donde C es una constante de integración'
        ],
        fullSolution: 'La ecuación diferencial dy/dx = 2x es una ecuación separable. Separando variables obtenemos dy = 2x dx. Integrando ambos lados:\n\n∫dy = ∫2x dx\ny = x² + C\n\nDonde C es una constante arbitraria determinada por las condiciones iniciales.'
      },
      {
        id: 2,
        topic: 'Problema de valor inicial',
        statement: 'Encuentra la solución particular de:\n\ndy/dx + 2y = 0, con condición inicial y(0) = 3',
        steps: [
          'Separamos variables: dy/y = -2 dx',
          'Integramos: ∫(1/y) dy = ∫-2 dx',
          'Obtenemos: ln|y| = -2x + C₁',
          'Exponenciamos: |y| = e^(-2x + C₁) = e^C₁ · e^(-2x)',
          'Solución general: y = Ce^(-2x)',
          'Aplicamos condición inicial y(0) = 3: 3 = Ce^0 = C, así C = 3',
          'Solución particular: y = 3e^(-2x)'
        ],
        fullSolution: 'Esta es una ecuación diferencial separable de primer orden.\n\nSeparando variables:\ndy/y = -2dx\n\nIntegrando:\nln|y| = -2x + C₁\n\nPor lo tanto:\ny = Ce^(-2x)\n\nAplicando la condición inicial y(0) = 3:\n3 = Ce^0 = C\n\nLa solución particular es: y = 3e^(-2x)'
      }
    ]
  },
  '2026_II_2': {
    title: 'Primer Parcial - Extraordinario',
    year: 2026,
    semester: 'II',
    examId: 2,
    questions: [
      {
        id: 1,
        topic: 'Variables separables',
        statement: 'Resuelve: (x² + 1) dy/dx = 2xy',
        steps: [
          'Separamos variables: dy/y = 2x/(x² + 1) dx',
          'Integramos ambos lados: ∫(1/y) dy = ∫2x/(x² + 1) dx',
          'Lado izquierdo: ln|y|',
          'Para el lado derecho, usamos sustitución: u = x² + 1, du = 2x dx',
          'Lado derecho: ∫(1/u) du = ln|u| = ln|x² + 1|',
          'Igualamos: ln|y| = ln|x² + 1| + C₁',
          'Solución general: y = C(x² + 1), donde C es una constante'
        ],
        fullSolution: 'Ecuación separable. Separamos variables:\n\ndy/y = 2x/(x² + 1) dx\n\nIntegramos:\nln|y| = ln(x² + 1) + C₁\n\nExponenciando:\ny = C(x² + 1)\n\nDonde C es una constante arbitraria.'
      }
    ]
  }
};
