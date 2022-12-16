function loadWaterMark() {
  console.log('LOADWATERMARK');
  // Obtiene el elemento input
  const inputElement = document.getElementById('input_watermark');

  // Obtiene el arreglo de imágenes seleccionadas por el usuario
  const images = inputElement.files;

  let src = document.getElementById('watermark');
  let imgData = [];

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    let img = document.createElement('img');
    img.classList.add('imageTag');
    img.file = file;
    img.style.cssText = 'grid-column: 0;';
    src.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      imgData.push(img.src);
    };
    reader.readAsDataURL(file);
  }
}

function imagesLoaded() {
  // Obtiene el elemento input
  const inputElement = document.getElementById('input_images');

  // Obtiene el arreglo de imágenes seleccionadas por el usuario
  const images = inputElement.files;

  let src = document.getElementById('images');
  let imgData = [];

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    let img = document.createElement('img');
    img.classList.add('imageTag');
    img.file = file;
    src.appendChild(img);

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      imgData.push(img.src);
    };
    reader.readAsDataURL(file);
  }

  // Añado el listener al botón para descargar las imagenes
  const boton = document.getElementById('button_add');
  boton.addEventListener('click', () => {
    addWaterMark(imgData);
  });

  const button = document.getElementById('button_add');
  let disabled = button.getAttribute('disabled');

  if (disabled) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', 'disabled');
  }
}

function addWaterMark(inputImages) {
  // Momento de carga
  document.getElementById('loader_container').style.display = 'block';
  const gravity = document.getElementById('gravity').value;
  const opacity = document.getElementById('opacity').value;
  const margin = document.getElementById('margin').value;

  let outputImages = [];

  // Cuando se procesan las imagenes:
  // - Activo el botón de descarga
  // - Cargo el preview
  let defer = $.Deferred();
  $.when(defer).done(function () {
    const button = document.getElementById('button_download');
    let disabled = button.getAttribute('disabled');

    if (disabled) {
      button.removeAttribute('disabled');
    } else {
      button.setAttribute('disabled', 'disabled');
    }

    // Añado el listener al botón para descargar las imagenes
    const boton = document.getElementById('button_download');
    boton.addEventListener('click', () => {
      dowloadImages(outputImages);
    });

    // Pongo las imagenes en la página
    for (let i = 0; i < outputImages.length; i++) {
      let img = document.createElement('img');
      img.className = 'imageTag';
      img.src = `${outputImages[i]}`;
      if (i === 0) {
        img.style.cssText += 'grid-column: 1;';
      }
      let src = document.getElementById('images');
      src.appendChild(img);
    }

    document.getElementById('loader_container').style.display = 'none';
  });

  $.each(inputImages, function (i, v) {
    $('<img>', {
      src: v,
    }).watermark({
      gravity: gravity,
      opacity: opacity,
      margin: margin,
      done: function (imgURL) {
        outputImages[i] = imgURL;
        if (i + 1 === inputImages.length) {
          defer.resolve();
        }
      },
    });
  });
}

function dowloadImages(outputImages) {
  // Crear un elemento "a"
  const link = document.createElement('a');

  // Iterar sobre cada imagen
  outputImages.forEach((imagen, index) => {
    // Establecer la URL de la imagen como el enlace del elemento "a"
    link.href = imagen;

    // Establecer el nombre del archivo con la extensión JPEG
    link.download = `imagen-${index}.jpg`;

    // Simular un clic en el elemento "a"
    link.click();
  });
}
