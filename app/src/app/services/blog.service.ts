import { Injectable, signal } from '@angular/core';

export interface BlogArticle {
    id: string;
    date: string;
    readTime: string;
    title: string;
    excerpt: string;
    content: string; // The full html/markdown content
    tag: string;
    image: string;
}

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    // We use a signal to hold our list of articles for reactivity
    private articlesSignal = signal<BlogArticle[]>([
        {
            id: 'ai-tax-prep-paradigm',
            date: '15 de Enero, 2024',
            readTime: '6 min de lectura',
            title: 'Preparación de impuestos impulsada por IA: El nuevo paradigma',
            excerpt: 'Descubra cómo la inteligencia artificial está transformando radicalmente la preparación de impuestos en los EE. UU. Desde la automatización de la entrada de datos hasta la identificación predictiva de deducciones ocultas...',
            tag: 'TECNOLOGÍA IA',
            image: 'assets/news/ai-tech.png',
            content: `
                <p>La inteligencia artificial ha dejado de ser un concepto futurista para convertirse en una herramienta de uso diario en la preparación de impuestos. Según estudios recientes, la implementación de algoritmos de aprendizaje automático de lenguaje natural disminuye los errores matemáticos y de clasificación en declaraciones de impuestos complejos a cifras estadísticamente nulas.</p>
                
                <h3>La Automatización Inteligente del W-2 y Formas 1099</h3>
                <p>Mientras que la entrada de datos solía consumir el 60% del tiempo de un CPAs o de un individuo, las herramientas de Reconocimiento Óptico de Caracteres (OCR) ahora no solo "leen" documentos fiscales como formas W-2 o 1099-NEC, sino que <strong>entienden</strong> el contexto. Neuraltax, por ejemplo, utiliza IA para verificar automáticamente anomalías entre los ingresos brutos extraídos del documento frente a los reportados en sistemas bancarios interconectados.</p>
                
                <h3>Mitigación de Errores y Análisis de Riesgo</h3>
                <p>Las plataformas de tecnología tributaria ahora integran "puntuaciones de riesgo" en tiempo real antes del envío final al IRS («e-file»). Estas herramientas actúan como una pre-auditoría virtual, analizando proactivamente discrepancias comparando los hábitos de gasto del contribuyente en ciertas categorías frente a la media nacional reportada por el IRS para el mismo código postal y rango de ingresos.</p>

                <blockquote>
                "Implementar Inteligencia artificial no trata de desplazar a los contadores públicos; se trata de dotarlos a ellos o al individuo de superpoderes, convirtiendo semanas de organización contable en minutos de revisión estratégica."
                </blockquote>

                <h3>Hacia un Futuro Sin Papel</h3>
                <p>El IRS está implementando lentamente su estrategia de modernización, e iniciativas impulsadas por IA como la lectura masiva de archivos físicos históricos son clave. A medida que las regulaciones evolucionan, prepararse apoyándose en plataformas IA será mandatorio para maximizar los retornos con un 100% de confianza.</p>
            `
        },
        {
            id: 'tax-deductions-irs-2024',
            date: '12 de Enero, 2024',
            readTime: '8 min de lectura',
            title: 'Maximizando las deducciones fiscales de EE. UU.: Estrategias IRS 2024',
            excerpt: 'Conozca las últimas estrategias de deducción del IRS para la temporada 2024 y cómo los algoritmos de aprendizaje automático de Neuraltax están analizando miles de páginas del código tributario para identificar créditos...',
            tag: 'PAUTAS DEL IRS',
            image: 'assets/news/irs-guidelines.png',
            content: `
                <p>Para la temporada de impuestos de 2024 (presentada en 2025), el IRS ha ajustado numerosos límites de deducción y créditos fiscales para combatir la inflación. Navegar por los más de 75,000 folios del Código Tributario de los EE. UU. es casi imposible para un contribuyente común sin asistencia.</p>

                <h3>Créditos de Energía Limpia (Inflation Reduction Act)</h3>
                <p>Una de las áreas más ventajosas este año sigue siendo la <em>Ley de Reducción de la Inflación</em>. Las plataformas dotadas de IA, como Neuraltax, están programadas para escanear sus comprobantes de gastos en búsqueda de mejoras vehiculares o residenciales. Vehículos eléctricos (EVs) que califican pueden otorgar hasta $7,500 en crédito fiscal no reembolsable, y proyectos de eficiencia en la vivienda (paneles solares, bombas térmicas) recuperan un sólido 30% del costo incurrido.</p>

                <h3>El Complejo Mundo de los Gastos de Trabajo en Casa (Anexo C)</h3>
                <p>Desde la pandemia, la definición del lugar de trabajo se alteró permanentemente. Para los contratistas independientes o dueños de LLCs de un solo miembro, las reglas de "Oficina Principal" a veces son confusas.  El uso de calculadoras basadas en IA permite determinar con precisión milimétrica si conviene utilizar el método de tasa simplificada ($5 por pie cuadrado hasta 300 pies) o los gastos reales basados en recibos de amortización de hipoteca, gas e internet.</p>

                <h3>IA para el Desglose Fino</h3>
                <p>¿Tomaste un Uber para ir a una reunión de beneficencia? Las plataformas avanzadas detectan ese recibo como un gasto caritativo deducible de impuestos (si decide desglosar). Esa es la estrategia vital hoy: no perder ni el más mínimo detalle gracias a la categorización transaccional y aprendizaje automático.</p>
            `
        },
        {
            id: 'form-1040-simplified-ai',
            date: '8 de Enero, 2024',
            readTime: '7 min de lectura',
            title: 'Formulario 1040 simplificado: Navegando la complejidad con Inteligencia Artificial',
            excerpt: 'Navegar por las complejidades del Formulario 1040 del IRS, incluyendo el intrincado Anexo C y el Formulario 8829, nunca ha sido tan fluido. Exploramos cómo el asistente virtual Nerea clasifica automáticamente sus gastos...',
            tag: 'FORMULARIOS FISCALES',
            image: 'assets/news/tax-forms.png',
            content: `
                <p>El famoso <strong>Formulario 1040</strong> es el documento con base al cual todos los años los ciudadanos y residentes de EE. UU. liquidan cuentas con el "Tío Sam". Sin embargo, el reto nunca recae sobre sus dos páginas principales, sino en el abrumador laberinto de sus "Anexos" (Schedules) que lo respaldan.</p>

                <h3>Desmitificando el Anexo C y Formulario 8829</h3>
                <p>Quienes perciben ingresos de "economía gig" (Uber, Upwork, venta directa) o administran negocios pequeños operando como DBAs (Doing Business As), deben compilar sus ganancias en el Anexo C. Aquí, subestimar ingresos es letal, y sobre-estimar gastos activa campanas de auditoría. </p>
                <p>Un LLM moderno como el de Nerea es capaz de discernir entre la "depreciación de activos a través de la sección 179" frente a una amortización tradicional MACRS simplemente teniendo una conversación natural y deductiva con el usuario.  Luego rellena los cuadrantes específicos del Anexo C línea por línea.</p>

                <h3>Anexo A: Desglosando Deducciones vs El Estándar</h3>
                <p>Para la mayoría (cerca del 90%), tomar la <em>Deducción Estándar</em> ha sido la ruta elegida por defecto debido a sus incrementos masivos ($14,600 para solteros y $29,200 para casados para 2024). Sin embargo, un motor inteligente evaluará simultáneamente su historial de donaciones, intereses hipotecarios y altos gastos médicos (superando el 7.5% de su ingreso bruto ajustado) proyectándolos rápidamente en el <strong>Anexo A</strong>. El programa entonces elige de forma autónoma el mayor beneficio para usted sin intervención humana extensa.</p>

                <p>Con Neuraltax, la declaración tributaria deja de ser una tarea estresante anual y se transforma en un flujo de diálogo continuo.</p>
            `
        },
        {
            id: 'smart-tax-tech-future',
            date: '5 de Enero, 2024',
            readTime: '5 min de lectura',
            title: 'Tecnología fiscal inteligente: El futuro de la contabilidad predictiva',
            excerpt: 'Más allá de llenar planillas, la verdadera innovación ocurre cuando la IA predice sus escenarios fiscales futuros. Explore cómo la "preparación fiscal proactiva" utiliza datos financieros históricos para proyectar responsabilidades...',
            tag: 'INNOVACIÓN',
            image: 'assets/news/innovation.png',
            content: `
                <p>Escribir el pasado (declarar el año fiscal que ha cerrado) es el estatus quo de la industria. La tecnología fiscal inteligente avanza con rapidez hacia el diseño enfocado en la "proyección e ingeniería futura del patrimonio", también conocida como <strong>Contabilidad Predictiva</strong>.</p>
                
                <h3>El Salto Analítico</h3>
                <p>Integrando bancos comerciales con procesadores tributarios mediante APIs, un modelo predictivo analiza los flujos de caja y advierte a los pequeños empresarios si se están encaminando a sufrir "Penalizaciones por pago insuficiente" si sus retenciones no alcanzan y los ingresos han estado sobrepasando las estimaciones en julio o en septiembre. Es tener a un contador revisando las cuentas de banco cada 5 minutos de su vida.</p>

                <h3>Planeación Estructural Basada en Modelos Simulados</h3>
                <p>Si es usted un propietario de un negocio operando como una Sociedad Limitada, ¿en qué punto de sus ingresos netos debería realizar una "elección como corporación S" (Formulario 2553) para mitigar seriamente los impuestos de Seguridad Social y Medicare (15.3%)? Antes, se requería una larga (y costosa) asesoría de contabilidad.</p>
                <p>Hoy, el modelo dinámico te avisará push-notification al momento exacto en el ciclo de vida del negocio en el cual cruzar dicho umbral optimizará tus bolsillos de la forma más efectiva.</p>
            `
        },
        {
            id: 'crypto-nft-irs-guide',
            date: '2 de Enero, 2024',
            readTime: '9 min de lectura',
            title: 'Criptomonedas, NFTs y el IRS: La guía definitiva de rastreo automático',
            excerpt: 'El escrutinio del IRS sobre los activos digitales está en su punto más alto. Aprenda cómo las nuevas herramientas de integración de Neuraltax pueden conectarse directamente con sus billeteras y exchanges para calcular retroactivamente...',
            tag: 'CRYPTO & TAXES',
            image: 'assets/news/crypto-taxes.png',
            content: `
                <p>En el Formulario 1040, ahora aparece antes que todo lo demás: <em>«En algún momento durante el año de informe, ¿ha poseído criptomonedas...?»</em> El "Sí" es mandatorio y auditable. La contabilidad de blockchain, debido a su extrema fragmentariedad (múltiples casas de bolsa y finanzas descentralizadas o DeFi) es literalmente imposible para un humano cuando el nivel de trading es alto.</p>

                <h3>Integración Directa y Bases de Costo</h3>
                <p>La tecnología ha avanzado para conectar múltiples claves API de lectura desde exchanges (como Coinbase, Kraken o Binance) y agregar direcciones billeteras frías para rastrear hasta miles de operaciones. Aplicando algoritmos específicos (HIFO, LIFO o FIFO) para el cruce entre diferentes redes (ejem. cambiando Ethereum por Solana) detectan automáticamente el "Evento Tributable".</p>

                <h3>Pérdidas de capital por Venta Simulada (Wash Sales)</h3>
                <p>A diferencia de las acciones de valores bursátiles de Wall Street, para 2024 las criptomonedas <strong>aún no están</strong> sujetas a la estricta "Wash-sale rule" del IRS. Esto es una ventaja invaluable que pocos optimizan. En periodos bajistas, vender posiciones perdedoras para registrar el declive como "pérdidas de capital" limitando tu ingreso anual sujeto a impuesto hasta $3,000 dls por año, y recomprarlas inmediatamente, es una estrategia letal y totalmente válida para el <em>Tax-loss Harvesting</em> en cripto que la IA efectúa instantáneamente.</p>

                <p>Reportar tu cripto ya no tiene por qué involucrar incontables horas peleando contra hojas de cálculo extraídas de docenas de monederos DeFi.</p>
            `
        },
        {
            id: 'algo-shield-irs-audits',
            date: '28 de Diciembre, 2023',
            readTime: '10 min de lectura',
            title: 'El escudo algorítmico: Cómo la IA te prepara para (y evita) las auditorías del IRS',
            excerpt: 'Nadie quiere recibir una carta del IRS. Detallamos cómo nuestros sistemas analizan su declaración antes de enviarla buscando las mismas "banderas rojas" que activan los algoritmos de auditoría del gobierno (DIF scores)...',
            tag: 'AUDITORÍAS & PREVENCIÓN',
            image: 'assets/news/irs-audits.png',
            content: `
                <p>Menos del 1% de las declaraciones de impuestos presentadas anualmente por asalariados en los EE. UU. se audita. Sin embargo, para grupos de mayores ingresos (más de $1M) o trabajadores por cuenta propia altamente deducibles, ese factor explota hasta casi el 4 o 5%. Las auditorías muy raras veces se seleccionan "mágicamente o por personas"; en cambio, un sistema de puntuación secreto del IRS lanza una bandera computarizada.</p>

                <h3>Entendiendo el "Discriminant Inventory Function" (DIF)</h3>
                <p>El IRS califica cada declaración individual electrónicamente. Si su "Score DIF" es desproporcionadamente alto frente a contribuyentes similares, el "zumbador rojo" se enciende, enviando su declaración al buró humano.  ¿Qué causa un alto puntaje? Declaraciones con una alta correlación de gastos de vehículos exagerados, pérdidas de negocios constantes durante más de tres de cada cinco años (Hobby-loss rules), y números anormalmente redondos e inexactos.</p>

                <h3>Auditoría Artificial Preliminar</h3>
                <p>Las defensas como las de Neuraltax integran redes neuronales diseñadas para revertir la ingeniería del análisis DIF. El sistema audita primero. Si se encuentra un problema (por ejemplo, el usuario reclama uso corporativo al 100% en el kilometraje de su celular o de su vehículo general), la inteligencia advierte al usuario del alto porcentaje de riesgo.</p>

                <p>Mejor aún, el Asistente solicita adjuntar facturas digitales y almacena esos datos permanentemente. En caso de una infame carta "Notice CP2000" requeridora de explicaciones, Neuraltax empaca los archivos en un dossier digital impoluto en minutos para despejar interrogantes del IRS sin dolores de cabeza. La defensa nunca había sido tan ágil.</p>
            `
        }
    ]);



    /** Returns all available articles */
    getArticles() {
        return this.articlesSignal();
    }

    /** Finds a specific article by its route param ID */
    getArticleById(id: string): BlogArticle | undefined {
        return this.articlesSignal().find(a => a.id === id);
    }
}
