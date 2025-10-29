let pantalla = '0';
let expresion = '';
let memoria = 0;
let ultimaRespuesta = 0;
let mostrarFraccion = false;

const elementoPantalla = document.getElementById('display');
const elementoFraccion = document.getElementById('fraction-display');
const elementoMemoria = document.getElementById('memory-display');

function actualizarPantalla() {
    elementoPantalla.textContent = pantalla;

    if (mostrarFraccion) {
        const fraccion = obtenerFraccion();
        elementoFraccion.textContent = fraccion || '';
    } else {
        elementoFraccion.textContent = '';
    }

    if (memoria !== 0) {
        elementoMemoria.textContent = `M: ${memoria.toFixed(4)}`;
    } else {
        elementoMemoria.textContent = '';
    }
}

function aFraccion(decimal) {
    const tolerancia = 1.0E-6;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;

    do {
        const a = Math.floor(b);
        let aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerancia);

    return { numerador: h1, denominador: k1 };
}

function obtenerFraccion() {
    const num = parseFloat(pantalla);
    if (!isNaN(num) && num !== 0) {
        const { numerador, denominador } = aFraccion(num);
        if (denominador !== 1 && denominador < 1000) {
            return `${numerador}/${denominador}`;
        }
    }
    return null;
}

function evaluarExpresion(expr) {
    try {
        let expresionProcesada = expr
            .replace(/sin\(/g, 'Math.sin((Math.PI/180)*')
            .replace(/cos\(/g, 'Math.cos((Math.PI/180)*')
            .replace(/tan\(/g, 'Math.tan((Math.PI/180)*')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/π/g, 'Math.PI')
            .replace(/ans/g, ultimaRespuesta.toString())
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/\^/g, '**');

        const resultado = eval(expresionProcesada);
        return resultado;
    } catch (error) {
        return 'Error';
    }
}

function manejarNumero(num) {
    if (pantalla === '0' || pantalla === 'Error') {
        pantalla = num;
        expresion = num;
    } else {
        pantalla += num;
        expresion += num;
    }
    mostrarFraccion = false;
    actualizarPantalla();
}

function manejarOperador(op) {
    if (pantalla === '0' || pantalla === 'Error') {
        pantalla = op;
        expresion = op;
    } else {
        expresion += op;
        pantalla += op;
    }
    mostrarFraccion = false;
    actualizarPantalla();
}

function manejarFuncion(func) {
    if (pantalla === '0' || pantalla === 'Error') {
        pantalla = func + '(';
        expresion = func + '(';
    } else {
        expresion += func + '(';
        pantalla += func + '(';
    }
    mostrarFraccion = false;
    actualizarPantalla();
}

function manejarRaizCuadrada() {
    if (pantalla === '0' || pantalla === 'Error') {
        pantalla = '√(';
        expresion = '√(';
    } else {
        expresion += '√(';
        pantalla += '√(';
    }
    mostrarFraccion = false;
    actualizarPantalla();
}

function manejarPotencia() {
    if (pantalla === '0' || pantalla === 'Error') {
        pantalla = '^';
        expresion = '^';
    } else {
        expresion += '^';
        pantalla += '^';
    }
    mostrarFraccion = false;
    actualizarPantalla();
}

function manejarParentesis(tipo) {
    if (pantalla === '0' || pantalla === 'Error') {
        pantalla = tipo;
        expresion = tipo;
    } else {
        expresion += tipo;
        pantalla += tipo;
    }
    mostrarFraccion = false;
    actualizarPantalla();
}

function manejarIgual() {
    const resultado = evaluarExpresion(expresion);
    if (resultado !== 'Error') {
        ultimaRespuesta = resultado;
        pantalla = resultado.toString();
        expresion = resultado.toString();

        if (resultado !== Math.floor(resultado) && Math.abs(resultado) < 1000) {
            mostrarFraccion = true;
        }
    } else {
        pantalla = 'Error';
        expresion = '';
    }
    actualizarPantalla();
}

function manejarLimpiar() {
    pantalla = '0';
    expresion = '';
    mostrarFraccion = false;
    actualizarPantalla();
}

function manejarBorrar() {
    if (pantalla.length > 1) {
        pantalla = pantalla.slice(0, -1);
        expresion = expresion.slice(0, -1);
    } else {
        pantalla = '0';
        expresion = '';
    }
    mostrarFraccion = false;
    actualizarPantalla();
}

function manejarMemoriaSumar() {
    const actual = parseFloat(pantalla);
    console.log('M+ presionado - Valor actual:', actual, 'Memoria antes:', memoria);
    if (!isNaN(actual)) {
        memoria += actual;
        console.log('Memoria después:', memoria);
        actualizarPantalla();
    }
}

function manejarMemoriaRestar() {
    const actual = parseFloat(pantalla);
    console.log('M- presionado - Valor actual:', actual, 'Memoria antes:', memoria);
    if (!isNaN(actual)) {
        memoria -= actual;
        console.log('Memoria después:', memoria);
        actualizarPantalla();
    }
}

function manejarMemoriaRecuperar() {
    console.log('M presionado - Recuperando memoria:', memoria);
    pantalla = memoria.toString();
    expresion = memoria.toString();
    mostrarFraccion = false;
    actualizarPantalla();
}

function manejarMemoriaLimpiar() {
    console.log('MC presionado - Limpiando memoria');
    memoria = 0;
    actualizarPantalla();
}

function manejarAns() {
    if (pantalla === '0' || pantalla === 'Error') {
        pantalla = 'ans';
        expresion = 'ans';
    } else {
        // Si la pantalla termina con un número, añadir un operador de multiplicación implícito
        const ultimoCaracter = pantalla[pantalla.length - 1];
        if (ultimoCaracter >= '0' && ultimoCaracter <= '9') {
            expresion += '×ans';
            pantalla += '×ans';
        } else {
            expresion += 'ans';
            pantalla += 'ans';
        }
    }
    mostrarFraccion = false;
    actualizarPantalla();
}

function manejarFraccion() {
    const actual = parseFloat(pantalla);
    if (!isNaN(actual) && actual !== 0) {
        const resultado = 1 / actual;
        pantalla = resultado.toString();
        expresion = resultado.toString();
        ultimaRespuesta = resultado;
        mostrarFraccion = true;
        actualizarPantalla();
    }
}


document.addEventListener('keydown', (event) => {
    const tecla = event.key;

    if (tecla >= '0' && tecla <= '9') {
        manejarNumero(tecla);
    } else if (tecla === '+') {
        manejarOperador('+');
    } else if (tecla === '-') {
        manejarOperador('-');
    } else if (tecla === '*') {
        manejarOperador('×');
    } else if (tecla === '/') {
        event.preventDefault();
        manejarOperador('÷');
    } else if (tecla === '(' || tecla === ')') {
        manejarParentesis(tecla);
    } else if (tecla === 'Enter' || tecla === '=') {
        event.preventDefault();
        manejarIgual();
    } else if (tecla === 'Escape') {
        manejarLimpiar();
    } else if (tecla === 'Backspace') {
        manejarBorrar();
    } else if (tecla === '.') {
        manejarNumero('.');
    } else if (tecla === '^') {
        manejarPotencia();
    }
});

// Inicializar pantalla
actualizarPantalla();