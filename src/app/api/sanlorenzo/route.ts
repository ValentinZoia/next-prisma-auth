// -----------WEB SCRAPPING-------------

import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { late } from "zod";

export async function GET(req: NextRequest) {
  try {
    //abrimos navegador, pero con la config de que no lo haga con la ventana
    const browser = await chromium.launch({ headless: true });

    //creamos nueva pagina
    const page = await browser.newPage();

    //establecemos url
    await page.goto("https://www.promiedos.com.ar/team/san-lorenzo/igf");

    // Selecciona todos los botones "VER MÁS"
    const buttons = await page.$$(".table_toggle_button__ZThKd");

    // Itera sobre los botones y haz clic en cada uno
    for (const button of buttons) {
      await button.click();

      // Espera a que el botón cambie a "VER MENOS" (clase activa)
      await page.waitForSelector(
        ".table_toggle_button__ZThKd.table_active__Mk7ov",
        {
          timeout: 500, // Tiempo máximo para esperar (5 segundos)
        }
      );
    }

    //obtener los partidos proximos
    const UpcomingMatches = await page.$$eval(
      ".tbody_tablebody__cDt0I", // Selecciona todas las tablas con la clase
      (tables) =>
        Array.from(tables) // Convierte NodeList a Array para manipulación
          .slice(0, 1) // Solo toma las primeras dos tablas
          .flatMap((table) =>
            Array.from(table.querySelectorAll("tr")).map((row) => {
              const cells = row.querySelectorAll("td");

              return {
                date: cells[0]?.textContent?.trim(),
                homeOrAway: cells[1]?.textContent?.trim(),
                opponent: cells[2]?.textContent?.trim(),
                opponentImage: `${cells[2]
                  ?.querySelector("img")
                  ?.getAttribute("src")
                  ?.trim()}`,
                time: cells[3]?.textContent?.trim(),
              };
            })
          )
    );

    //verificamos que haya Proximos partidos
    if (!UpcomingMatches.length)
      return NextResponse.json({
        error: "No se encontraron partidos",
        status: 500,
      });

    const LatestMatches = await page.$$eval(
      ".tbody_tablebody__cDt0I", // Selecciona todas las tablas con la clase
      (tables) =>
        Array.from(tables) // Convierte NodeList a Array para manipulación
          .slice(1, 2) // Solo toma las primeras dos tablas
          .flatMap((table) =>
            Array.from(table.querySelectorAll("tr")).map((row) => {
              const cells = row.querySelectorAll("td");

              return {
                date: cells[0]?.textContent?.trim(),
                homeOrAway: cells[1]?.textContent?.trim(),
                opponent: cells[2]?.textContent?.trim(),
                opponentImage: `${cells[2]
                  ?.querySelector("img")
                  ?.getAttribute("src")
                  ?.trim()}`,
                result: cells[3]?.textContent?.trim(),
              };
            })
          )
    );

    // buscamos el indice del proximo partido a jugar.
    // const FindIndexLastMatch = AllMatches.findIndex(
    //   (match) => match?.result === "-"
    // );

    //si no hay proximo partido a jugar, tomamos el ultimo partido
    // const lastMatchIndex =
    //   FindIndexLastMatch === -1 ? AllMatches.length - 1 : FindIndexLastMatch;

    //tomamos solo los ultimos dos partidos que se jugaron
    // const LastMatches = AllMatches.slice(
    //   Math.max(0, lastMatchIndex - 1),
    //   lastMatchIndex + 1
    // );

    //tomamos solo los proximos partidos que no se jugaron aun.
    // const UpcomingMatches = AllMatches.filter((match) => match?.result === "-");

    await browser.close();

    return NextResponse.json({ UpcomingMatches, LatestMatches, status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error, status: 500 });
  }
}
