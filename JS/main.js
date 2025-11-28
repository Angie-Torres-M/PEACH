// Inicializar los componentes html
// Incluir fragmentos HTML
async function includeHTML(selector, url) {
    const host = document.querySelector(selector);
    if (!host) return; // si no existe el contenedor, salimos

    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) {
        console.error(`No se pudo cargar ${url}`);
        return;
    }

    host.innerHTML = await res.text();
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1) Header y footer
    await includeHTML("#site-header", "./header.html");
    await includeHTML("#site-footer", "./footer.html");

    // aquí ya existen las cards en el DOM
    if (typeof initTeamCards === "function") {
        initTeamCards();
    }
});

// Si vas a incluir tu header con fetch:
fetch("./header.html")
    .then(res => res.text())
    .then(html => document.getElementById("header-placeholder").innerHTML = html);


// Heder dinamico
function initHeader() {
    const header = document.querySelector(".header-fijo");
    if (header) {
        let lastScroll = 0;

        window.addEventListener("scroll", () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > lastScroll && currentScroll > 80) {
                header.classList.add("header-hidden");
            } else {
                header.classList.remove("header-hidden");
            }

            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        });
    }

    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("site-header");
    if (!headerContainer) return;

    fetch("./header.html")
        .then(res => res.text())
        .then(html => {
            headerContainer.innerHTML = html;
            initHeader();    // Muy importante: aquí ya existen navToggle y navMenu
        })
        .catch(err => console.error("Error al cargar el header:", err));
});


// ===============================
// 1) FUNCIÓN DATO CURIOSO
// ===============================
function getFunFact(celsius) {
    if (celsius < -20) {
        return "Temperaturas tan bajas mantienen casi toda la vida en pausa. Solo algunos microbios extremófilos pueden resistir aquí.";
    } else if (celsius >= -20 && celsius < 0) {
        return "Algunas bacterias psicrófilas y organismos como los tardígrados pueden sobrevivir en estas condiciones si están deshidratados o protegidos.";
    } else if (celsius === 0) {
        return "El agua se congela. Muchas bacterias reducen casi por completo su metabolismo y pueden mantenerse viables por mucho tiempo.";
    } else if (celsius > 0 && celsius <= 10) {
        return "Este rango de temperatura es típico de ambientes fríos como océanos profundos o regiones polares, donde viven bacterias adaptadas al frío.";
    } else if (celsius > 10 && celsius < 30) {
        return "Temperatura templada donde prosperan muchas bacterias ambientales, algas y hongos saprófitos en suelos y cuerpos de agua.";
    } else if (celsius >= 30 && celsius <= 40) {
        return "Este es el rango favorito de muchas bacterias asociadas a animales de sangre caliente, incluyendo varios patógenos humanos (~37 °C).";
    } else if (celsius > 40 && celsius <= 60) {
        return "Aquí empiezan a aparecer organismos termófilos: microbios que aman el calor, como algunos que viven en aguas termales.";
    } else if (celsius > 60 && celsius <= 80) {
        return "En este rango varias bacterias ya no sobreviven, pero arqueas termófilas pueden seguir activas en fuentes calientes.";
    } else if (celsius > 80 && celsius <= 100) {
        return "Este rango se asocia con arqueas hipertermófilas que viven cerca de fumarolas hidrotermales y manantiales muy calientes.";
    } else if (celsius > 100 && celsius <= 121) {
        return "Temperaturas cercanas a estas se usan para esterilizar en autoclaves; solo algunos microorganismos hiperresistentes sobreviven muy poco tiempo.";
    } else if (celsius == 122) {
        return "Methanopyrus kandleri es un organismo que puede crecer a 122 °C, que se considera el límite superior de temperatura conocido para la vida.";
    } else if (celsius > 122) {
        return "Por encima de 122 °C casi ninguna forma de vida conocida puede mantenerse activa; estas condiciones se usan para asegurar esterilización.";
    }


    // Si no entra en ningún caso, devolvemos un texto general
    return "Esta temperatura puede tener efectos importantes en la estructura de las proteínas y en la viabilidad de los organismos.";
}

// ==================================================
// 2) LÓGICA PRINCIPAL
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("tempInput");
    const btn = document.getElementById("convertBtn");
    const resultsDiv = document.getElementById("results");
    const funFactDiv = document.getElementById("funFact");

    if (!input || !btn || !resultsDiv || !funFactDiv) {
        console.error("No se encontraron los elementos necesarios en el DOM");
        return;
    }

    btn.addEventListener("click", () => {
        const value = input.value.trim();

        // 1) Validación: que no esté vacío y sea número
        if (value === "" || isNaN(value)) {
            resultsDiv.className = "alert alert-danger text-center";
            resultsDiv.textContent = "⚠️ Error: ingresa un número válido en °C.";
            resultsDiv.classList.remove("d-none");

            funFactDiv.classList.add("d-none");
            funFactDiv.textContent = "";
            return;
        }

        const celsius = Number(value);
        const kelvinRaw = celsius + 273.15;   // sin redondear para validar

        // 2) Restricción de cero absoluto
        if (kelvinRaw < 0) {
            resultsDiv.className = "alert alert-danger text-center";
            resultsDiv.textContent = "⚠️ Error: esa temperatura está por debajo del cero absoluto (0 K). No existe físicamente.";
            resultsDiv.classList.remove("d-none");

            funFactDiv.classList.add("d-none");
            funFactDiv.textContent = "";
            console.warn("Intento de temperatura menor al cero absoluto:", celsius, "°C");
            return;
        }

        // 3) Conversiones
        const kelvin = kelvinRaw.toFixed(2);
        const fahrenheit = (celsius * 9 / 5 + 32).toFixed(2);

        // 4) Mostrar resultados numéricos
        resultsDiv.className = "alert alert-secondary text-center";
        resultsDiv.innerHTML = `
            🌡️ <strong>${celsius} °C</strong><br>
            🔥 Fahrenheit: <strong>${fahrenheit} °F</strong><br>
            ❄️ Kelvin: <strong>${kelvin} K</strong>
        `;
        resultsDiv.classList.remove("d-none");

        // 5) Dato curioso según el rango de temperatura
        const fact = getFunFact(celsius);

        if (fact) {
            funFactDiv.className = "alert alert-info mt-2";
            funFactDiv.innerHTML = `🧬 <strong>Dato curioso:</strong> ${fact}`;
            funFactDiv.classList.remove("d-none");
        } else {
            funFactDiv.classList.add("d-none");
            funFactDiv.textContent = "";
        }
        updateThermometer(celsius);

        // 6) También a la consola
        console.log("Grados Kelvin:", kelvin);
        console.log("Grados Fahrenheit:", fahrenheit);
    });
});

// ==================================================
// 3) Función para actualizar el termómetro
// ==================================================
function updateThermometer(celsius) {
    const level = document.getElementById("thermoLevel");
    const label = document.getElementById("thermoLabel");

    // Ya no usamos bulb porque lo quitaste del HTML
    if (!level || !label) return;

    // Definimos el rango que queremos mapear visualmente
    const minC = -273.15; // cero absoluto
    const maxC = 100;     // punto de ebullición del agua

    // Clampeamos la temperatura al rango [minC, maxC]
    const clamped = Math.max(minC, Math.min(maxC, celsius));

    // Convertimos a porcentaje de altura (0% a 100%)
    const percent = ((clamped - minC) / (maxC - minC)) * 100;
    level.style.height = `${percent}%`;

    // Colores según temperatura:
    // ≤ -200 → azul muy fuerte
    // -200 a 0 → azul medio
    // 0 a 100 → gradiente hacia rojo
    let color;

    if (celsius <= -200) {
        color = "#0B1B3B"; // azul muy fuerte
    } else if (celsius <= 0) {
        color = "#1565C0"; // azul medio
    } else if (celsius >= 122) {
        color = "#C62828"; // rojo fuerte
    } else {
        // Interpolación simple entre azul (0°C) y rojo (100°C)
        const t = celsius / 100; // 0 a 1
        const r = Math.round(21 + t * (198 - 21));   // 0x15 -> 0xC6
        const g = Math.round(101 + t * (40 - 101));  // 0x65 -> 0x28
        const b = Math.round(192 + t * (40 - 192));  // 0xC0 -> 0x28
        color = `rgb(${r}, ${g}, ${b})`;
    }

    // Solo cambiamos el color del nivel, ya no hay bulbo
    level.style.backgroundColor = color;

    // Texto de apoyo
    label.textContent = `Visualización aprox.: ${celsius.toFixed(2)} °C`;
}
