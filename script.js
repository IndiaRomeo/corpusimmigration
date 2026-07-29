const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/jpeg';
favicon.href = 'images/logo.jpg';
document.head.append(favicon);

const button = document.querySelector('.menu-button');
const links = document.querySelector('.nav-links');
button?.addEventListener('click', () => {
  const isOpen = links.classList.toggle('open');
  button.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.portrait img').forEach((image) => {
  const fallback = image.nextElementSibling;
  const showPhoto = () => fallback?.remove();
  if (image.complete && image.naturalWidth) showPhoto();
  image.addEventListener('load', showPhoto, { once: true });
  image.addEventListener('error', () => image.remove(), { once: true });
});

const slider = document.querySelector('.team-grid');
const scrollCards = (direction) => slider?.scrollBy({ left: direction * slider.clientWidth, behavior: 'smooth' });
document.querySelector('.previous')?.addEventListener('click', () => scrollCards(-1));
document.querySelector('.next')?.addEventListener('click', () => scrollCards(1));
let autoplay;
const startAutoplay = () => {
  clearInterval(autoplay);
  autoplay = setInterval(() => {
    if (!slider) return;
    const atEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;
    slider.scrollTo({ left: atEnd ? 0 : slider.scrollLeft + slider.clientWidth, behavior: 'smooth' });
  }, 4800);
};
slider?.addEventListener('mouseenter', () => clearInterval(autoplay));
slider?.addEventListener('mouseleave', startAutoplay);
slider?.addEventListener('touchstart', () => clearInterval(autoplay), { passive: true });
slider?.addEventListener('touchend', startAutoplay, { passive: true });
startAutoplay();

document.querySelector('.hero-bottom span:first-child')?.remove();
const previous = document.querySelector('.previous');
const next = document.querySelector('.next');
previous?.replaceChildren(Object.assign(document.createElement('span'), { textContent: '←', ariaHidden: 'true' }), Object.assign(document.createElement('small'), { textContent: 'Anterior' }));
next?.replaceChildren(Object.assign(document.createElement('small'), { textContent: 'Siguiente' }), Object.assign(document.createElement('span'), { textContent: '→', ariaHidden: 'true' }));

const reviews = [
  ['Sofía Ramírez', 'Me explicaron cada etapa de mi proceso con mucha paciencia. Me sentí acompañada y segura desde la primera consulta.'],
  ['Carlos Hernández', 'Un equipo serio, humano y muy profesional. Mi caso fue tratado con una atención excelente.'],
  ['Valentina Torres', 'La comunicación fue clara y constante. Recomiendo a Corpus Inmigración con toda confianza.'],
  ['Miguel Álvarez', 'Encontré abogados que realmente se preocuparon por mi familia y por alcanzar el mejor resultado.'],
  ['Andrea López', 'Excelente servicio. Siempre respondieron mis dudas y me dieron tranquilidad durante el proceso.'],
  ['José Martínez', 'Profesionales, organizados y cercanos. Estoy muy agradecido por el acompañamiento recibido.'],
  ['Daniela Cruz', 'El trato fue respetuoso y transparente. Se nota su experiencia en temas de inmigración.'],
  ['Roberto Silva', 'Desde la primera llamada recibí orientación honesta y clara. Una firma que inspira confianza.'],
  ['Paola Jiménez', 'Gracias por defender mi caso con tanta dedicación. La atención fue impecable de principio a fin.'],
  ['Luis García', 'Una experiencia excelente. Todo el equipo fue atento, puntual y comprometido con mi caso.']
];
const reviewsSection = document.createElement('section');
reviewsSection.className = 'reviews';
reviewsSection.id = 'resenas';
reviewsSection.innerHTML = `<div class="container"><div class="reviews-heading"><div><p class="eyebrow red">OPINIONES DE CLIENTES</p><h2>Historias de confianza</h2></div><div class="rating"><b>★ 4.9</b><span>Basado en reseñas de clientes</span></div></div><div class="reviews-grid">${reviews.map(([name, text]) => `<article class="review-card"><div class="review-top"><span class="review-avatar">${name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span><div><h3>${name}</h3><p>★★★★★</p></div></div><blockquote>“${text}”</blockquote><span class="review-source">Reseña de cliente</span></article>`).join('')}</div></div>`;
document.querySelector('.contact')?.before(reviewsSection);

const whatsapp = document.createElement('a');
whatsapp.className = 'whatsapp'; whatsapp.href = 'https://wa.me/12792051468'; whatsapp.target = '_blank'; whatsapp.rel = 'noopener'; whatsapp.setAttribute('aria-label', 'Contactar por WhatsApp');
whatsapp.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27.1 4.9A15.8 15.8 0 0 0 1.8 23.4L0 32l8.8-1.7A15.8 15.8 0 1 0 27.1 4.9ZM16 29.1c-2.4 0-4.8-.6-6.9-1.8l-.5-.3-5.2 1 1.1-5-.3-.5a13 13 0 1 1 12 6.6Zm7.1-9.8c-.4-.2-2.5-1.2-2.9-1.3-.4-.2-.7-.2-1 .2s-1.1 1.3-1.3 1.6c-.2.3-.5.3-.9.1-2.6-1.3-4.3-2.3-6-5.2-.4-.7.4-.6 1.2-2.1.1-.3 0-.6-.1-.8-.1-.2-1-2.3-1.3-3.2-.3-.8-.7-.7-1-.7h-.8c-.3 0-.8.1-1.2.6-.4.5-1.6 1.5-1.6 3.7s1.6 4.3 1.8 4.6c.2.3 3.1 4.7 7.5 6.6 2.8 1.2 3.8 1.3 5.1 1.1.8-.1 2.5-1 2.8-2 .4-1 .4-1.9.3-2.1-.1-.2-.4-.3-.8-.5Z"/></svg><span>WhatsApp</span>';
document.body.append(whatsapp);

const lawyerBios = {
  ginger: {
    name: 'Ginger Sia Marcos',
    role: 'Abogado Especialista en Derecho Migratorio',
    year: '2017',
    license: '245279',
    email: 'marcosgingersia@lawfirm.com',
    paragraphs: [
      'El Licenciado Ginger Sia Marcos es un abogado especializado en Derecho Migratorio con una destacada trayectoria profesional desde el año 2017, brindando asesoría y representación legal a personas, familias y empresas en una amplia variedad de asuntos relacionados con las leyes de inmigración de los Estados Unidos.',
      'Con más de ocho años de experiencia, ha representado exitosamente a clientes en procedimientos ante el Servicio de Ciudadanía e Inmigración de los Estados Unidos (USCIS), el Servicio de Inmigración y Control de Aduanas (ICE), los Tribunales de Inmigración (EOIR) y otras agencias federales. Su práctica profesional comprende peticiones familiares, ajustes de estatus, naturalización, permisos de trabajo, solicitudes de asilo, defensa en procesos de deportación, audiencias de fianza, perdones migratorios, visas humanitarias y otros procedimientos migratorios complejos.',
      'A lo largo de su carrera, el Licenciado Ginger Sia Marcos se ha distinguido por ofrecer una representación legal basada en la ética, el profesionalismo y la atención personalizada. Su compromiso es diseñar estrategias jurídicas sólidas para cada caso, manteniendo una comunicación clara con sus clientes y buscando siempre la mejor solución conforme a la legislación migratoria vigente.',
      'Su constante actualización sobre las reformas y políticas migratorias le permite brindar un servicio jurídico confiable, preciso y adaptado a las necesidades de cada cliente. Gracias a su experiencia y dedicación, se ha consolidado como un profesional comprometido con la protección de los derechos de la comunidad inmigrante y con la búsqueda de resultados favorables para quienes depositan su confianza en su representación.',
      'Asimismo, el Licenciado Ginger Sia Marcos entiende que cada caso migratorio representa una historia personal y familiar que merece ser tratada con responsabilidad y sensibilidad. Por ello, trabaja estrechamente con cada cliente para ofrecer una orientación clara durante todo el proceso, explicando cada etapa del procedimiento y proporcionando soluciones legales personalizadas que respondan a las necesidades específicas de cada situación.',
      'Su objetivo es ofrecer una representación jurídica de la más alta calidad, caracterizada por la transparencia, la excelencia profesional y un firme compromiso con la defensa de los derechos de los inmigrantes. Mediante un enfoque estratégico y una preparación meticulosa de cada expediente, busca facilitar el acceso de sus clientes a oportunidades migratorias legales que les permitan construir un futuro seguro y estable en los Estados Unidos.'
    ]
  },
  jendian: {
    name: 'Joshua Philip Jendian',
    role: 'Abogado Especialista en Derecho Migratorio',
    year: '2018',
    license: '357858',
    email: 'jjendian@sarabianlaw.com',
    paragraphs: [
      'El Licenciado Joshua Philip Jendian es un abogado especializado en Derecho Migratorio con una destacada trayectoria profesional desde el año 2018, dedicado a brindar asesoría y representación legal integral a personas, familias y empresas que buscan soluciones dentro del sistema migratorio de los Estados Unidos. Su práctica se caracteriza por un profundo compromiso con la excelencia jurídica, la ética profesional y la defensa de los derechos de la comunidad inmigrante.',
      'Desde el inicio de su carrera, el Licenciado Joshua Philip Jendian ha trabajado en una amplia variedad de asuntos migratorios, representando a clientes ante el Servicio de Ciudadanía e Inmigración de los Estados Unidos (USCIS), el Servicio de Inmigración y Control de Aduanas (ICE), la Oficina Ejecutiva para Revisión de Casos de Inmigración (EOIR) y otras autoridades federales competentes. Su experiencia abarca peticiones familiares, ajustes de estatus, procesos de naturalización, permisos de trabajo, solicitudes de asilo, defensa en procedimientos de deportación, audiencias de fianza, perdones migratorios, visas humanitarias y otros casos de alta complejidad.',
      'Con más de siete años de experiencia en el ejercicio del Derecho Migratorio, ha desarrollado una práctica basada en la preparación rigurosa de cada expediente y en la elaboración de estrategias legales adaptadas a las necesidades particulares de cada cliente. Su enfoque combina un análisis jurídico detallado con una atención personalizada, permitiendo que cada persona reciba orientación clara, honesta y profesional durante todas las etapas de su proceso migratorio.',
      'El Licenciado Joshua Philip Jendian considera que una representación legal efectiva va más allá de la presentación de documentos; implica comprender las circunstancias individuales de cada cliente y ofrecer soluciones que respondan a sus objetivos personales y familiares. Por ello, mantiene una comunicación cercana y transparente, asegurando que cada cliente conozca el desarrollo de su caso y las alternativas legales disponibles en todo momento.',
      'Su constante actualización respecto de las reformas legislativas, cambios regulatorios y políticas migratorias le permite ofrecer asesoría jurídica confiable y acorde con la normativa vigente. Gracias a su preparación y experiencia, ha logrado consolidarse como un profesional reconocido por su responsabilidad, integridad y capacidad para afrontar procedimientos migratorios complejos con seriedad y dedicación.',
      'Asimismo, el Licenciado Joshua Philip Jendian trabaja con la convicción de que cada proceso migratorio representa una oportunidad para mejorar la vida de una persona o de una familia. Esta visión le ha permitido desarrollar una práctica centrada en la protección de los derechos de sus clientes y en la búsqueda de soluciones legales que les permitan alcanzar estabilidad y seguridad dentro de los Estados Unidos.',
      'Como integrante de nuestro bufete, mantiene un firme compromiso con la excelencia profesional, ofreciendo representación jurídica de alto nivel y un acompañamiento constante desde la consulta inicial hasta la resolución de cada caso. Su objetivo es proporcionar un servicio legal basado en la confianza, la transparencia y el compromiso, ayudando a cada cliente a avanzar con seguridad hacia el cumplimiento de sus metas migratorias.'
    ]
  },
  cerna: {
    name: 'Marcos Cerna Gonzalez',
    role: 'Abogado Especialista en Derecho Migratorio',
    year: '2020',
    license: '330266',
    email: 'licenciadomarcosgonz@gmail.com',
    paragraphs: [
      'El Licenciado Marcos Cerna Gonzalez es un abogado dedicado al ejercicio del Derecho Migratorio, con una sólida trayectoria profesional desde el año 2020, enfocada en brindar asesoría jurídica y representación legal a personas que buscan alcanzar sus objetivos migratorios en los Estados Unidos. Su compromiso con la excelencia, la integridad y el servicio personalizado le ha permitido desarrollar una práctica orientada a ofrecer soluciones legales eficaces dentro del complejo sistema de inmigración estadounidense.',
      'Desde el inicio de su carrera profesional, ha trabajado en la preparación y representación de una amplia variedad de procedimientos migratorios ante el Servicio de Ciudadanía e Inmigración de los Estados Unidos (USCIS), el Servicio de Inmigración y Control de Aduanas (ICE), la Oficina Ejecutiva para Revisión de Casos de Inmigración (EOIR) y otras autoridades competentes. Su experiencia comprende peticiones familiares, solicitudes de residencia permanente, ajustes de estatus, permisos de trabajo, procesos de naturalización, solicitudes de asilo, visas humanitarias, perdones migratorios, audiencias de fianza y defensa en procedimientos de remoción.',
      'Durante su trayectoria, el Licenciado Marcos Cerna Gonzalez ha demostrado un firme compromiso con la defensa de los derechos de la comunidad inmigrante, ofreciendo una representación legal basada en el análisis detallado de cada caso y en la elaboración de estrategias jurídicas adaptadas a las necesidades particulares de cada cliente. Su enfoque profesional combina conocimientos técnicos con una atención cercana, permitiendo que quienes confían en sus servicios reciban orientación clara y acompañamiento constante durante todo el proceso migratorio.',
      'Consciente de que cada expediente representa una historia de vida y un proyecto familiar, el Licenciado Marcos Cerna Gonzalez trabaja con responsabilidad, dedicación y transparencia, procurando que cada cliente comprenda las alternativas legales disponibles y pueda tomar decisiones informadas. Su prioridad es construir relaciones de confianza mediante una comunicación abierta y un servicio jurídico caracterizado por la honestidad y el profesionalismo.',
      'Asimismo, mantiene una actualización permanente sobre los cambios en la legislación, regulaciones y políticas migratorias de los Estados Unidos, lo que le permite ofrecer asesoría precisa y estrategias legales acordes con las disposiciones vigentes. Esta preparación continua fortalece su capacidad para afrontar casos complejos y brindar soluciones oportunas dentro de un entorno jurídico en constante evolución.',
      'Como integrante de nuestro bufete, el Licenciado Marcos Cerna Gonzalez comparte el compromiso de proporcionar un servicio legal de la más alta calidad, basado en la excelencia profesional y en la protección de los derechos de cada cliente. Su objetivo es acompañar a individuos y familias durante cada etapa de su proceso migratorio, ofreciendo representación jurídica confiable y trabajando con dedicación para ayudarles a construir un futuro seguro y estable en los Estados Unidos.'
    ]
  },
  pacheco: {
    name: 'Anthony Marcos Pacheco',
    role: 'Abogado Especialista en Derecho Migratorio',
    year: '2021',
    license: '341355',
    email: 'licenciadomarcospacheco@gmail.com',
    paragraphs: [
      'El Licenciado Anthony Marcos Pacheco es un abogado especializado en Derecho Migratorio, con ejercicio profesional activo desde el año 2021, dedicado a brindar asesoría jurídica integral y representación legal a personas y familias que buscan regularizar su situación migratoria o acceder a los beneficios contemplados por la legislación de inmigración de los Estados Unidos. Su práctica se distingue por un enfoque responsable, estratégico y orientado a ofrecer soluciones legales adaptadas a las necesidades de cada cliente.',
      'Desde el comienzo de su carrera, ha desarrollado experiencia en la preparación, análisis y seguimiento de procedimientos migratorios ante el Servicio de Ciudadanía e Inmigración de los Estados Unidos (USCIS), el Servicio de Inmigración y Control de Aduanas (ICE), la Oficina Ejecutiva para Revisión de Casos de Inmigración (EOIR) y otras agencias federales relacionadas con la aplicación de las leyes migratorias. Su práctica profesional comprende peticiones familiares, ajustes de estatus, solicitudes de residencia permanente, permisos de trabajo, naturalización, solicitudes de asilo, visas humanitarias, perdones migratorios, audiencias de fianza y representación en procesos de remoción.',
      'A lo largo de su trayectoria, el Licenciado Anthony Marcos Pacheco ha consolidado una práctica jurídica basada en la preparación minuciosa de cada expediente y en la atención personalizada a cada cliente. Entiende que cada proceso migratorio presenta circunstancias particulares, por lo que analiza cuidadosamente cada caso para diseñar estrategias legales sólidas que maximicen las posibilidades de obtener un resultado favorable conforme a la legislación vigente.',
      'Su compromiso con la excelencia profesional lo impulsa a mantenerse en constante actualización sobre las reformas legislativas, cambios regulatorios y nuevas políticas migratorias que impactan los procedimientos de inmigración en los Estados Unidos. Esta preparación continua le permite ofrecer asesoría jurídica confiable, precisa y alineada con las disposiciones legales más recientes, brindando seguridad y confianza a quienes depositan en él la responsabilidad de su representación legal.',
      'El Licenciado Anthony Marcos Pacheco considera que una representación efectiva requiere no solo conocimiento técnico, sino también cercanía, honestidad y una comunicación transparente con cada cliente. Por ello, procura mantener un acompañamiento permanente durante todas las etapas del proceso migratorio, explicando de manera clara las alternativas legales disponibles y resolviendo las inquietudes que puedan surgir durante el desarrollo del caso.',
      'Como integrante de nuestro bufete, comparte el compromiso de ofrecer un servicio jurídico de excelencia, fundamentado en la ética, la responsabilidad y la defensa de los derechos de la comunidad inmigrante. Su objetivo es proporcionar representación legal de alta calidad, ayudando a personas y familias a alcanzar sus metas migratorias mediante soluciones legales seguras, eficientes y plenamente ajustadas al marco jurídico de los Estados Unidos.'
    ]
  },
  tarango: {
    name: 'Michael Marcos Tarango',
    role: 'Abogado Especialista en Derecho Migratorio',
    year: '2020',
    license: '215687',
    email: 'licenciadomarcostarango@gmail.com',
    paragraphs: [
      'El Licenciado Michael Marcos Tarango es un abogado especializado en Derecho Migratorio de los Estados Unidos, con una destacada trayectoria profesional desde el año 2020, dedicada a la representación y asesoría legal de personas, familias y empresas en una amplia variedad de asuntos relacionados con el sistema migratorio estadounidense. A lo largo de su carrera, se ha distinguido por su compromiso con la excelencia jurídica, la preparación estratégica de cada caso y la defensa de los derechos de quienes buscan construir un futuro legal y seguro en los Estados Unidos.',
      'Desde el inicio de su ejercicio profesional, ha intervenido en numerosos procedimientos migratorios ante el Servicio de Ciudadanía e Inmigración de los Estados Unidos (USCIS), el Servicio de Inmigración y Control de Aduanas (ICE), la Oficina Ejecutiva para Revisión de Casos de Inmigración (EOIR) y demás autoridades federales competentes. Su experiencia comprende peticiones familiares, ajustes de estatus, solicitudes de residencia permanente, procesos de naturalización, permisos de trabajo, solicitudes de asilo, visas humanitarias, perdones migratorios, procesos consulares, audiencias de fianza y representación en procedimientos de deportación y remoción.',
      'Durante estos años de práctica profesional, el Licenciado Michael Marcos Tarango ha desarrollado una sólida reputación por su capacidad para analizar casos complejos y diseñar estrategias legales eficaces, siempre orientadas a proteger los intereses de sus clientes. Su metodología de trabajo combina un estudio minucioso de la legislación migratoria, una preparación documental rigurosa y un seguimiento permanente de cada expediente, garantizando una representación jurídica de alto nivel en todas las etapas del procedimiento.',
      'Uno de los pilares de su ejercicio profesional es la atención personalizada. Comprende que cada proceso migratorio representa una decisión trascendental para la vida de una persona o de una familia, por lo que mantiene una comunicación cercana y transparente con sus clientes, explicando de forma clara cada paso del procedimiento y ofreciendo orientación jurídica basada en la normativa vigente y en las circunstancias particulares de cada caso.',
      'Su constante actualización en materia de legislación, reglamentos y políticas migratorias le permite responder con eficacia a los cambios que experimenta el sistema de inmigración de los Estados Unidos. Esta preparación continua fortalece su capacidad para ofrecer soluciones legales innovadoras, oportunas y adaptadas a los desafíos que presentan los procedimientos migratorios actuales.',
      'Gracias a su profesionalismo, dedicación y compromiso con la excelencia, el Licenciado Michael Marcos Tarango ha consolidado una trayectoria caracterizada por la confianza de sus clientes y por una práctica jurídica enfocada en obtener resultados favorables dentro del marco legal. Su experiencia le ha permitido participar en una amplia diversidad de casos, fortaleciendo su conocimiento y su capacidad para brindar representación en asuntos migratorios tanto rutinarios como de alta complejidad.',
      'Como integrante de nuestro bufete, comparte la misión de ofrecer servicios legales de la más alta calidad, fundamentados en la ética profesional, la responsabilidad y el respeto por los derechos de cada persona. Su objetivo es acompañar a sus clientes durante todo el proceso migratorio con un servicio cercano, eficiente y comprometido, proporcionando la tranquilidad de contar con un abogado que trabaja con dedicación para alcanzar las mejores soluciones legales posibles.'
    ]
  },
  socarras: {
    name: 'Peter Alexander Socarras',
    role: 'Abogado Especialista en Derecho Migratorio',
    year: '2018',
    license: '251880',
    email: 'peteralexandersocorras@gmail.com',
    paragraphs: [
      'El Licenciado Peter Alexander Socarras es un abogado especializado en Derecho Migratorio de los Estados Unidos, con una reconocida trayectoria profesional desde el año 2018, dedicada a la asesoría y representación legal de personas, familias y empresas que requieren soluciones jurídicas dentro del sistema de inmigración estadounidense. Su práctica profesional se distingue por la combinación de conocimiento técnico, planificación estratégica y un firme compromiso con la protección de los derechos de sus clientes.',
      'Desde el inicio de su ejercicio profesional, ha intervenido en una amplia variedad de procedimientos migratorios ante el Servicio de Ciudadanía e Inmigración de los Estados Unidos (USCIS), el Servicio de Inmigración y Control de Aduanas (ICE), la Oficina Ejecutiva para Revisión de Casos de Inmigración (EOIR) y otras autoridades federales competentes. Su experiencia comprende peticiones familiares, ajustes de estatus, solicitudes de residencia permanente, naturalización, permisos de trabajo, visas humanitarias, solicitudes de asilo, perdones migratorios, procesos consulares y representación en procedimientos de deportación y audiencias de fianza.',
      'Con más de siete años de experiencia en el ejercicio del Derecho Migratorio, el Licenciado Peter Alexander Socarras ha construido una sólida trayectoria basada en la preparación meticulosa de cada expediente y en la búsqueda constante de soluciones jurídicas eficaces. Su experiencia le ha permitido participar en casos con distintos niveles de complejidad, desarrollando estrategias legales personalizadas que responden a las circunstancias particulares de cada cliente y a las exigencias de la legislación migratoria vigente.',
      'Uno de los principios que caracteriza su práctica profesional es la atención personalizada. Considera que cada proceso migratorio representa una decisión trascendental para la vida de quienes depositan su confianza en su representación, razón por la cual mantiene una comunicación clara y permanente con sus clientes, ofreciendo orientación precisa sobre cada etapa del procedimiento y asegurando un acompañamiento jurídico responsable desde el inicio hasta la conclusión del caso.',
      'Además de su experiencia práctica, el Licenciado Peter Alexander Socarras mantiene una actualización constante respecto de las reformas legislativas, cambios regulatorios y nuevas políticas migratorias implementadas por las autoridades estadounidenses. Esta preparación continua fortalece su capacidad para ofrecer asesoría jurídica confiable y estrategias legales adaptadas a un sistema migratorio en constante evolución.',
      'Como integrante de nuestro bufete, comparte el compromiso de brindar servicios legales con los más altos estándares de calidad, ética y profesionalismo. Su objetivo es proporcionar una representación jurídica sólida, eficiente y transparente, ayudando a personas y familias a avanzar con seguridad en sus procesos migratorios y a alcanzar sus objetivos dentro del marco legal de los Estados Unidos.'
    ]
  },
  coleman: {
    name: 'Ellen Victoria Coleman',
    role: 'Abogada Especialista en Derecho Migratorio',
    year: '2020',
    email: 'Victoriacoleman771@gmail.com',
    paragraphs: [
      'La Licenciada Ellen Victoria Coleman es una abogada especializada en Derecho Migratorio de los Estados Unidos, con ejercicio profesional activo desde el año 2020. A lo largo de su carrera ha enfocado su labor en la representación y defensa de personas migrantes, ofreciendo asesoría jurídica integral a quienes enfrentan procesos migratorios complejos y requieren una defensa sólida, ética y comprometida con la protección de sus derechos.',
      'Su práctica profesional se centra en brindar soluciones legales eficaces a individuos y familias que buscan establecer su futuro en los Estados Unidos. Ha participado en la preparación y representación de casos relacionados con peticiones familiares, ajustes de estatus, solicitudes de residencia permanente, permisos de trabajo, naturalización, solicitudes de asilo, protección humanitaria, visas especiales, perdones migratorios, procesos de deportación y audiencias ante las autoridades de inmigración.',
      'Desde el inicio de su trayectoria, la Licenciada Ellen Victoria Coleman ha demostrado una profunda vocación de servicio hacia la comunidad inmigrante. Su compromiso con la defensa de los derechos humanos y el acceso a la justicia la ha convertido en una profesional reconocida por su dedicación, sensibilidad y capacidad para acompañar a sus clientes en momentos de gran importancia para sus vidas y las de sus familias.',
      'Uno de los aspectos que distingue su ejercicio profesional es la atención cercana y personalizada que brinda a cada persona. Considera que cada caso merece un análisis individual, una estrategia legal cuidadosamente diseñada y una comunicación transparente durante todo el procedimiento. Esta filosofía le ha permitido construir relaciones de confianza con sus clientes, quienes encuentran en ella una representante comprometida con la búsqueda de soluciones legales responsables y efectivas.',
      'La Licenciada Ellen Victoria Coleman mantiene una actualización permanente sobre las reformas legislativas y las políticas migratorias implementadas por las autoridades de los Estados Unidos, lo que le permite ofrecer asesoría jurídica fundamentada en la normativa vigente y responder con eficacia a los constantes cambios que experimenta el sistema migratorio.',
      'Como integrante de nuestro bufete, comparte la misión de ofrecer una representación legal de excelencia, basada en la ética, el profesionalismo y el respeto por la dignidad de cada persona. Su principal objetivo es defender los intereses de la comunidad inmigrante, proteger sus derechos y acompañar a cada cliente con dedicación, responsabilidad y compromiso, trabajando para que cada proceso migratorio sea atendido con el más alto nivel de calidad jurídica.'
    ]
  },
  nava: {
    name: 'Antonio Marcos Nava',
    role: 'Abogado Especialista en Derecho Migratorio',
    year: '2020',
    license: '24134964',
    email: 'info@navalawfirm.com',
    paragraphs: [
      'El Licenciado Antonio Marcos Nava es un abogado dedicado exclusivamente al Derecho Migratorio de los Estados Unidos, con una trayectoria profesional orientada a la representación legal de personas y familias que buscan regularizar su situación migratoria y ejercer sus derechos conforme a la legislación estadounidense. Desde el año 2020, ha desarrollado una práctica jurídica basada en la preparación estratégica de cada caso, el análisis detallado de la normativa aplicable y un firme compromiso con la excelencia profesional.',
      'Durante su ejercicio profesional ha asesorado a clientes en una amplia diversidad de procedimientos migratorios, ofreciendo representación ante el Servicio de Ciudadanía e Inmigración de los Estados Unidos (USCIS), el Servicio de Inmigración y Control de Aduanas (ICE), la Oficina Ejecutiva para Revisión de Casos de Inmigración (EOIR) y otras autoridades federales competentes. Su experiencia incluye peticiones familiares, solicitudes de residencia permanente, ajustes de estatus, procesos de naturalización, permisos de trabajo, solicitudes de asilo, visas humanitarias, procesos consulares, perdones migratorios y defensa en procedimientos de remoción.',
      'Su práctica profesional se distingue por un enfoque preventivo y estratégico, orientado a identificar las mejores alternativas legales para cada cliente antes de iniciar cualquier procedimiento. Considera que una correcta planificación jurídica y una preparación documental rigurosa constituyen elementos fundamentales para fortalecer cada expediente y ofrecer una representación eficaz dentro del sistema migratorio estadounidense.',
      'El Licenciado Antonio Marcos Nava ha construido una reputación basada en la confianza, la responsabilidad y el compromiso con quienes depositan en él la representación de asuntos que pueden definir el futuro de sus familias. Su capacidad para escuchar, comprender las circunstancias particulares de cada caso y ofrecer soluciones claras ha sido una de las principales fortalezas de su trayectoria profesional.',
      'Consciente de que las leyes migratorias evolucionan constantemente, mantiene una formación continua sobre las reformas legislativas, decisiones administrativas y cambios en las políticas de inmigración, permitiéndole brindar asesoría actualizada y estrategias jurídicas acordes con la normativa vigente. Este compromiso con la actualización permanente fortalece la calidad del servicio que ofrece a cada uno de sus clientes.',
      'Como miembro de nuestro bufete, el Licenciado Antonio Marcos Nava comparte la misión de proporcionar representación legal de alto nivel, caracterizada por la ética, el profesionalismo y el respeto por los derechos de cada persona. Su objetivo es acompañar a sus clientes durante todo el proceso migratorio con transparencia, dedicación y una defensa jurídica sólida, ayudándolos a alcanzar sus metas dentro del marco legal de los Estados Unidos.'
    ]
  }
};

const bioOverlay = document.createElement('div');
bioOverlay.className = 'bio-overlay';
bioOverlay.hidden = true;
bioOverlay.innerHTML = '<div class="bio-modal" role="dialog" aria-modal="true" aria-labelledby="bio-name"><button class="bio-close" type="button" aria-label="Cerrar">&times;</button><p class="bio-role" id="bio-role"></p><h2 class="bio-name" id="bio-name"></h2><p class="bio-meta" id="bio-meta"></p><div class="bio-body" id="bio-body"></div><ul class="bio-facts" id="bio-facts"></ul></div>';
document.body.append(bioOverlay);

let lastFocusedCard = null;

const openBio = (slug) => {
  const bio = lawyerBios[slug];
  if (!bio) return;
  bioOverlay.querySelector('#bio-role').textContent = bio.role;
  bioOverlay.querySelector('#bio-name').textContent = bio.name;
  bioOverlay.querySelector('#bio-meta').textContent = `Ejerciendo el Derecho Migratorio desde ${bio.year}`;
  bioOverlay.querySelector('#bio-body').innerHTML = bio.paragraphs.map((p) => `<p>${p}</p>`).join('');
  const facts = [['Especialidad', 'Derecho Migratorio de los Estados Unidos'], ['Año de inicio', bio.year]];
  if (bio.license) facts.push(['Número de licencia', bio.license]);
  facts.push(['Correo electrónico', `<a href="mailto:${bio.email}">${bio.email}</a>`]);
  bioOverlay.querySelector('#bio-facts').innerHTML = facts.map(([k, v]) => `<li><b>${k}:</b> ${v}</li>`).join('');
  lastFocusedCard = document.activeElement;
  bioOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  bioOverlay.querySelector('.bio-close').focus();
};

const closeBio = () => {
  bioOverlay.hidden = true;
  document.body.style.overflow = '';
  lastFocusedCard?.focus();
};

document.querySelectorAll('.lawyer-card[data-lawyer]').forEach((card) => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    openBio(card.dataset.lawyer);
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBio(card.dataset.lawyer);
    }
  });
});

bioOverlay.addEventListener('click', (e) => { if (e.target === bioOverlay) closeBio(); });
bioOverlay.querySelector('.bio-close').addEventListener('click', closeBio);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !bioOverlay.hidden) closeBio(); });

const style = document.createElement('style');
style.textContent = `.hero-bottom{justify-content:flex-end!important}.portrait{height:260px!important;position:relative!important}.portrait img{height:100%!important;width:100%!important;object-fit:cover!important;object-position:center!important}.portrait span{height:100%;width:100%;display:grid;place-items:center}.lawyer-card{height:100%!important;display:flex!important;flex-direction:column!important}.card-info{min-height:191px!important;display:flex!important;flex-direction:column!important}.card-info a{margin-top:auto}.slider-control{min-width:118px!important;height:44px!important;display:flex!important;gap:8px!important;align-items:center!important;justify-content:center!important;color:#b10f1d!important;border:1px solid #d5c7c8!important;border-radius:999px!important;background:#fff!important;font-size:1.25rem!important;cursor:pointer}.slider-control small{font-family:"DM Sans",sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase}.slider-control:hover{background:#b10f1d!important;border-color:#b10f1d!important;color:#fff!important}.reviews{padding:105px 0;background-image:linear-gradient(rgba(14,11,10,.6),rgba(14,11,10,.6)),url("images/image_4.jpg");background-size:cover;background-position:center}.reviews-heading{display:flex;justify-content:space-between;align-items:end;margin-bottom:45px}.reviews-heading h2{font-size:clamp(2.25rem,4vw,4rem);letter-spacing:-.045em}.rating{display:flex;flex-direction:column;gap:5px;color:#a29da0;font-size:.8rem}.rating b{font-size:1.15rem;color:#e0a640}.reviews-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}.review-card{background:#1b191c;border:1px solid rgba(255,255,255,.07);padding:22px;min-height:232px;display:flex;flex-direction:column;box-shadow:0 8px 22px rgba(0,0,0,.35)}.review-top{display:flex;align-items:center;gap:11px}.review-avatar{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#262528,#7f1220);color:#fff;font-size:.7rem;font-weight:700}.review-top h3{font-family:"DM Sans",sans-serif;font-size:.87rem;line-height:1.2}.review-top p{margin:3px 0 0;color:#e39b16;font-size:.76rem;letter-spacing:.08em}.review-card blockquote{margin:19px 0;font-size:.84rem;line-height:1.62;color:#d3cecf}.review-source{margin-top:auto;color:#8f8a8c;font-size:.67rem}.whatsapp{position:fixed;right:24px;bottom:24px;z-index:20;display:flex;align-items:center;gap:9px;padding:13px 17px 13px 13px;border-radius:999px;background:#25d366;color:#fff;text-decoration:none;font-family:"DM Sans",sans-serif;font-weight:700;font-size:.82rem;box-shadow:0 8px 22px rgba(0,0,0,.28);transition:transform .2s,background .2s}.whatsapp:hover{background:#1ebe5b;transform:translateY(-3px)}.whatsapp svg{width:25px;height:25px;fill:currentColor}@media(max-width:850px){.reviews-grid{grid-template-columns:repeat(2,1fr)}.reviews-heading{align-items:start;flex-direction:column;gap:20px}}@media(max-width:600px){.slider-control{min-width:40px!important;width:40px!important;height:40px!important;padding:0!important;border-radius:50%!important}.slider-control small{display:none}.reviews{padding:72px 0}.reviews-grid{grid-template-columns:1fr}.review-card{min-height:0}}`;
document.head.append(style);
