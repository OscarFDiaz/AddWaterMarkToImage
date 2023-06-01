function loadWaterMark() {
  // Obtiene el elemento input
  const inputElement = document.getElementById('input_watermark');

  let pathWater = document.getElementById('input_watermark').value;

  if (pathWater == '' || pathWater == null) {
    pathWater = 'https://i.imgur.com/EtVXy17.png';
  }

  let img = document.createElement('img');
  img.classList.add('imageTag');
  img.src = pathWater;
  img.style.cssText = 'grid-column: 0;';

  let src = document.getElementById('watermark');
  src.innerHTML = '';
  src.appendChild(img);
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

  disabled
    ? button.removeAttribute('disabled')
    : button.setAttribute('disabled', 'disabled');

  // Añado el texto de imagenes
  const imagesText = (document.getElementById('watermark--text_images').innerHTML =
    'Imágenes');
}

function addWaterMark(inputImages) {
  // Momento de carga
  document.getElementById('loader_container').style.display = 'block';
  const gravity = document.getElementById('gravity').value;
  const opacity = document.getElementById('opacity').value;
  const margin = document.getElementById('margin').value;

  let pathWater = document.getElementById('input_watermark').value;

  // Marca de agua por defecto
  if (pathWater == '' || pathWater == null) {
    pathWater = 'https://i.imgur.com/EtVXy17.png';
  }

  let outputImages = [];

  // Cuando se procesan las imagenes:
  // - Activo el botón de descarga
  // - Cargo el preview
  let defer = $.Deferred();
  $.when(defer).done(function () {
    const button = document.getElementById('button_download');
    let disabled = button.getAttribute('disabled');

    disabled
      ? button.removeAttribute('disabled')
      : button.setAttribute('disabled', 'disabled');

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
      path: pathWater,
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
  document.getElementById('loader_container').style.display = 'block';

  let zip = new JSZip();
  outputImages.forEach((imagen, index) => {
    // Elimino lo innecesario de la base64 para que jsZip no lo tome como un dataURL
    let uri = imagen;
    let idx = uri.indexOf('base64,') + 'base64,'.length;
    let content = uri.substring(idx);

    zip.file(`imagen-${index}.jpg`, content, { base64: true });
  });

  zip.generateAsync({ type: 'blob' }).then(function (zip) {
    saveAs(zip, 'images.zip');
    document.getElementById('loader_container').style.display = 'none';
    resetGrids();
  });
}

function resetGrids() {
  document.getElementById('images').innerHTML = '';

  const button = document.getElementById('button_download');
  let disabled = button.getAttribute('disabled');

  disabled
    ? button.removeAttribute('disabled')
    : button.setAttribute('disabled', 'disabled');

  const button2 = document.getElementById('button_add');
  let disabled2 = button2.getAttribute('disabled');

  disabled2
    ? button2.removeAttribute('disabled')
    : button2.setAttribute('disabled', 'disabled');
}
