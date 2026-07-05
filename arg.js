// ARG — validación lado cliente
// cada capa tiene una clave correcta

const CLAVES = {
  origen: "sidi slimane",
  versiones: "leyenda",
  simbolos: "un europeo sin pasado",
  biografia: "presencia"
};

const HASHES = {};

async function sha256(texto) {
  const buffer = new TextEncoder().encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generarHashes() {
  for (const [capa, clave] of Object.entries(CLAVES)) {
    HASHES[capa] = await sha256(clave);
  }
}

async function verificar(capa) {
  const input = document.getElementById('clave').value.trim().toLowerCase();
  const msg = document.getElementById('msg');

  if (!input) {
    msg.textContent = '// introduce algo, manín.';
    msg.className = 'error';
    return;
  }

  const hash = await sha256(input);

  if (hash === HASHES[capa]) {
    msg.textContent = '// acceso concedido. redirigiendo...';
    msg.className = 'ok';
    setTimeout(() => { window.location.href = 'ep.html'; }, 1200);
  } else {
    msg.textContent = '// clave incorrecta. la leyenda no te reconoce.';
    msg.className = 'error';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await generarHashes();
  const input = document.getElementById('clave');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const capa = window.location.pathname.split('/').pop().replace('.html', '');
        verificar(capa);
      }
    });
  }
});