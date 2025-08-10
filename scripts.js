// ==========================================================
// script.js
// Lógica para detectar números perfectos en un rango
// Optimización: uso de la fórmula de Euclides-Euler con primos de Mersenne
// Autor: Miguel Arcila
// ==========================================================

// -------------------- Elementos del DOM --------------------
const form = document.getElementById('rangeForm');
const minInput = document.getElementById('minInput');
const maxInput = document.getElementById('maxInput');
const resultsArea = document.getElementById('resultsArea');
const resultsTableBody = document.querySelector('#resultsTable tbody');
const summary = document.getElementById('summary');
const emptyState = document.getElementById('emptyState');
const clearBtn = document.getElementById('clearBtn');

// -------------------- Configuración --------------------
// Clave para guardar el último rango en localStorage
const STORAGE_KEY = 'perfectos_last_range';

// Exponentes p conocidos que generan números perfectos pares
// mediante la fórmula: Perfecto = 2^(p-1) * (2^p - 1)
// (p donde 2^p - 1 es un primo de Mersenne)
const mersenneExponents = [2, 3, 5, 7, 13, 17, 19, 31];

// ==========================================================
// FUNCIONES AUXILIARES
// ==========================================================

/**
 * Genera un número perfecto usando la fórmula de Euclides-Euler.
 * Use BigInt para soportar valores grandes sin perder precisión.
 */
function perfectFromP(p){
  const two = BigInt(2);
  const pBI = BigInt(p);
  const mersenne = (two ** pBI) - BigInt(1);      // (2^p - 1)
  const prefactor = two ** (pBI - BigInt(1));     // 2^(p-1)
  return prefactor * mersenne;                    // Número perfecto resultante
}

/**
 * Convierte un BigInt a cadena para mostrar en la tabla.
 */
function bigintToString(bi){
  return bi.toString();
}

/**
 * Devuelve un arreglo con los números perfectos que estén dentro del rango dado.
 * En lugar de revisar cada número del rango, solo genera los perfectos conocidos.
 */
function findPerfectsInRange(min, max){
  const results = [];
  const minBI = BigInt(min);
  const maxBI = BigInt(max);

  for (const p of mersenneExponents){
    const perf = perfectFromP(p);
    if (perf > maxBI) break; 
    
    if (perf >= minBI && perf <= maxBI){
      results.push({ value: perf, p });
    }
  }
  return results;
}

/**
 * Limpia el área de resultados y muestra el estado vacío.
 */
function clearResults(){
  resultsTableBody.innerHTML = '';
  resultsArea.classList.add('d-none');
  emptyState.classList.remove('d-none');
  summary.textContent = 'Aún no se ha realizado ningún cálculo.';
}

/**
 * Renderiza los resultados en la tabla.
 * Muestra forma matemática para que el resultado sea más ilustrativo.
 */
function renderResults(list, min, max){
  resultsTableBody.innerHTML = '';

  // Si no hay resultados, mostramos mensaje
  if (!list.length){
    resultsArea.classList.add('d-none');
    emptyState.classList.remove('d-none');
    summary.textContent = `En el rango [${min}, ${max}] no se encontraron números perfectos.`;
    return;
  }

  // Si hay resultados, los volcamos en la tabla
  emptyState.classList.add('d-none');
  resultsArea.classList.remove('d-none');

  list.forEach((item, idx) => {
    const tr = document.createElement('tr');

    // Columna índice
    const tdIndex = document.createElement('td');
    tdIndex.textContent = idx + 1;

    // Columna número perfecto
    const tdValue = document.createElement('td');
    tdValue.textContent = bigintToString(item.value);

    // Columna forma matemática
    const tdForm = document.createElement('td');
    tdForm.textContent = `2^(${item.p}-1)*(2^${item.p}-1)`;

    // Insertar en fila
    tr.appendChild(tdIndex);
    tr.appendChild(tdValue);
    tr.appendChild(tdForm);

    resultsTableBody.appendChild(tr);
  });

  // Actualizar resumen
  summary.textContent = `En el rango [${min}, ${max}] se encontraron ${list.length} número(s) perfecto(s).`;
}

/**
 * Guarda el último rango ingresado en localStorage.
 */
function persistRange(min, max){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ min, max }));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage:', e);
  }
}

/**
 * Carga rango previamente guardado desde localStorage.
 */
function loadPersistedRange(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Valida que las entradas sean números enteros positivos y que min < max.
 */
function validateInputs(minStr, maxStr){
  const errors = [];
  const min = Number(minStr);
  const max = Number(maxStr);

  if (!Number.isFinite(min) || min <= 0 || !Number.isInteger(min)) {
    errors.push('El rango inferior debe ser entero positivo.');
  }
  if (!Number.isFinite(max) || max <= 0 || !Number.isInteger(max)) {
    errors.push('El rango superior debe ser entero positivo.');
  }
  if (errors.length === 0 && max <= min) {
    errors.push('El rango superior debe ser mayor que el inferior.');
  }

  return { ok: errors.length === 0, errors, min, max };
}

// ==========================================================
// EVENTOS
// ==========================================================

// Cargar rango guardado al iniciar
window.addEventListener('load', () => {
  const saved = loadPersistedRange();
  if (saved){
    minInput.value = saved.min;
    maxInput.value = saved.max;
  }
});

// Al enviar el formulario, validar y calcular
form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  form.classList.remove('was-validated');
  const validation = validateInputs(minInput.value, maxInput.value);

  if (!validation.ok){
    form.classList.add('was-validated');
    alert(validation.errors[0]); // Mensaje rápido
    return;
  }

  const { min, max } = validation;

  persistRange(min, max);

  // Cálculo usando lista optimizada de perfectos
  const found = findPerfectsInRange(min, max);

  renderResults(found, min, max);
});

// Botón limpiar
clearBtn.addEventListener('click', () => {
  minInput.value = '';
  maxInput.value = '';
  clearResults();
  localStorage.removeItem(STORAGE_KEY);
});
