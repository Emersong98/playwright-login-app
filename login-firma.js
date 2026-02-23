import { chromium } from "playwright";
import fs from "fs";
import { dni, password } from "./constants.js";

(async () => {
  if (!dni || !password) {
    console.log("Debe ingresar las credenciales");

    return;
  }

  // TODO: validar el formato del dni -> con punto y guión, 11.111.111-1

  console.log("Cargando firmas...");

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://firma.digital.gob.cl/ra/");
    await page.getByText("Iniciar sesión").click();
    await page.locator("#uname").fill(dni);
    await page.locator("#pword").fill(password);
    await page.keyboard.press("Shift+Tab"); // Mueve foco atrás, requerido al momento de autocompletar en el form de CU
    await page.click("#login-submit");

    const storageState = await context.storageState();

    const sessionCookie = storageState.cookies.find(
      (cookie) => cookie.name === "JSESSIONID",
    );

    const response = await fetch(
      "https://firma.digital.gob.cl/ra/system/admin/certificados/pListCertificados",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `JSESSIONID=${sessionCookie.value}; Expires=null; Path=/ra; Secure; HttpOnly; Domain=firma.digital.gob.cl`,
        },
        body: JSON.stringify({
          page: 1,
          pageSize: 1000,
          typeOrderBy: "",
          orderBy: "desc",
          filterStatus: 3, // 3: certificados; 1: pendientes; 8: cancelados; 6: revocados
          filterName: "",
          filterDni: "",
          filterEntidad: null,
          filterProposito: null,
          filterPropositoType: null,
          filterNextExpires: null,
        }),
      },
    );

    const data = await response.json();

    fs.mkdirSync("data", { recursive: true });

    fs.writeFileSync(
      "./data/usuarios-firma.json",
      JSON.stringify(data, null, 2),
    );

    console.log("Firmas cargadas correctamente!");

    await browser.close();
  } catch (e) {
    console.log("Error al obtener los datos");
    console.log(e);
  }
})();

// ---- Otras funciones interesantes ----

// 1.- Espera a que cargue una página específica
// await page.waitForURL("https://www.domain.com/some/path");

// 2.- Sirve para obtener la url de la pagina cargada
// await page.waitForLoadState("networkidle"); -> espera que deje de cargar
// console.log(page.url()); -> obtiene el valor de la url

// 3.- Sirve para obtener el contenido del DOM
// await page.waitForLoadState("networkidle"); -> espera que deje de cargar
// const html = await page.content();
// console.log(html);
