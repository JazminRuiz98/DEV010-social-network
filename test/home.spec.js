import home from '../src/routes/home';

describe('home', () => {
  it('debería ser una función', () => {
    expect(typeof home).toBe('function');
  });

  it('returns `La función devuelve un elemento HTML`', () => {
    const result = home(() => {});
    /* deseo pasar una función vacía como argumento para verificar el comportamiento de home */
    expect(result instanceof HTMLElement).toBe(true);
    /* Al ejecutar la función home se crea un elemento HTML */
  });

  it('returns `Se crea el botón`', () => {
    const resultado = home(() => {});
    const button = resultado.querySelector('button');
    const imgHome = resultado.querySelector('img');
    /* Busca el elemento botón, img dentro del elemento resultado */

    expect(button).toBeTruthy(); // Verifica que el botón exista
    expect(resultado.tagName).toBe('SECTION'); // La sección  se comprueba así, porque es el contenedor
    expect(imgHome).toBeTruthy();
    expect(button.textContent).toBe('EMPEZAR'); // Verifica el texto del botón
    expect(imgHome.alt).toBe('New Wave Logo');
  });

  it('click en botón dirige a /login', () => {
    let dirige = '';
    function navigateTo(ruta) {
      // Define una función simulada para navigateTo que almacene la ruta a la que se dirigió.
      dirige = ruta;
    }
    const component = home(navigateTo);
    component.querySelector('#btnHome').click();
    expect(dirige).toBe('/login');
  });
});
