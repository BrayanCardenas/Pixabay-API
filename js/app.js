const resultado = document.querySelector("#resultado");
const paginacionDiv = document.querySelector("#paginacion");

let paginaActual = 1;
let totalPaginas;
let iteradorSiguiente;

window.onload = () => {
  const formulario = document.querySelector("#formulario");
  formulario.addEventListener("submit", validarFormulario);
  paginacionDiv.addEventListener("click", direccionPaginacion);
};

function validarFormulario(e) {
  e.preventDefault();

  const terminoBusqueda = document.querySelector("#termino").value;

  if (terminoBusqueda === "") {
    // mensaje de error
    mostrarAlerta("Agrega un término de búsqueda");
    return;
  }

  buscarImagenes();
}

// Muestra una alerta de error o correcto
function mostrarAlerta(mensaje) {
  const alerta = document.querySelector(".bg-red-100");
  if (!alerta) {
    const alerta = document.createElement("p");

    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

// Busca las imagenes en una API
function buscarImagenes() {
  const terminoBusqueda = document.querySelector("#termino").value;

  const key = "1732750-d45b5378879d1e877cd1d35a6";
  const url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&per_page=30&page=${paginaActual}`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      totalPaginas = calcularPaginas(resultado.totalHits);
      mostrarImagenes(resultado.hits);
    });
}

function mostrarImagenes(imagenes, paginas) {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  imagenes.map((imagen) => {
    const {
      likes,
      views,
      tags,
      largeImageURL,
      webformatURL,
      comments,
      downloads,
    } = imagen;


    const tagsArray = tags.split(",").slice(0, 2);

    resultado.innerHTML += `<div class="card">
                              <div class="card__img-wrapper">
                                <img class="card__img" src=${webformatURL} height="300"  loading="lazy" alt=${tags}/>
                              </div>
                              <div class="grid">
                                <div class="viewDownloads">
                                  <p class="card__p">Vistas: <span class="card__span">${views}</span></p>
                                  <p class="card__p">Descargas: <span class="card__span">${downloads}</span></p>
                                </div>
                                <div class="commentsLikes">
                                  <p class="card__p">Comentarios: <span class="card__span">${comments}</span></p>
                                  <p class="card__p">Me Gusta: <span class="card__span">${likes}</span></p>
                                </div>
                                <div class="tags">
                                  <p class="card__p">tags: <span class="card__span">${tagsArray}</span></p>
                                </div>
                              </div>
                              <a
                                href="${largeImageURL}"
                                rel="noopener noreferrer"
                                target="_blank"
                                class="card__a"
                                >Ver Imagen
                              </a>
                            </div>`;
  });

  if (!iteradorSiguiente) {
    mostrarPaginacion();
  }
}

function mostrarPaginacion() {
  // recorrer el iterador
  iteradorSiguiente = crearPaginacion(totalPaginas);
  while (true) {
    const { value, done } = iteradorSiguiente.next();

    if (done) return;

    // Crear botón de sig
    const botonSiguiente = document.createElement("a");
    botonSiguiente.href = "#";
    botonSiguiente.dataset.pagina = value;
    botonSiguiente.textContent = value;
    botonSiguiente.classList.add(
      "siguiente"
    );
    paginacionDiv.appendChild(botonSiguiente);
  }
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / 30));
}

// Crear el generador
function* crearPaginacion(total) {
  console.log(total);
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function direccionPaginacion(e) {
  if (e.target.classList.contains("siguiente")) {
    paginaActual = Number(e.target.dataset.pagina);
    buscarImagenes();
    formulario.scrollIntoView();
  }
}
