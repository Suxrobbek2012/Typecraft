import type { Language, Difficulty } from '@/types'

// ============================================================
// Massive common words pool for professional touch typing
// Provides random lowercase word flow like Monkeytype
// ============================================================

export const COMMON_WORDS: Partial<Record<Language, string[]>> = {
  en: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", 
    "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", 
    "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", 
    "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", 
    "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", 
    "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", 
    "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "are", "was",
    "were", "has", "had", "been", "said", "her", "him", "his", "hers", "mine", "yours", "their", "theirs", "ours",
    "some", "any", "every", "no", "one", "body", "thing", "where", "when", "why", "how", "who", "whom", "whose",
    "which", "what", "that", "this", "these", "those", "here", "there", "then", "now", "always", "never", "sometimes",
    "often", "rarely", "seldom", "usually", "generally", "normally", "frequently", "occasionally", "softly", "quickly"
  ],
  uz: [
    "va", "bu", "bilan", "uchun", "ham", "bir", "shu", "u", "ki", "kabi", "esa", "o'z", "shuningdek", "bo'lib", 
    "yoki", "ular", "emas", "biz", "deb", "o'sha", "xuddi", "yana", "hatto", "faqat", "agar", "bor", "yo'q", 
    "hozir", "ish", "kun", "yil", "vaqt", "yangi", "katta", "yaxshi", "ko'ra", "keyin", "barcha", "ammo", 
    "lekin", "boshqa", "avval", "so'ng", "kerak", "mumkin", "hamma", "yuz", "tomon", "bo'yicha", "qarab", 
    "o'rtasida", "orqali", "tufayli", "chunki", "bunda", "hamda", "ustida", "ichida", "tashqari", "oldin", 
    "orqa", "past", "yuqori", "kichik", "mana", "shunday", "qanday", "bunday", "hech", "kim", "nima", "qachon", 
    "qayerda", "qancha", "necha", "qaysi", "biri", "o'zi", "o'zbekiston", "dastur", "kod", "tizim", "veb",
    "sayt", "ilova", "foydalanuvchi", "tarmoq", "xavfsizlik", "ma'lumot", "aloqa", "texnologiya", "kompyuter",
    "ekran", "tugma", "so'z", "gap", "matn", "yozish", "tezlik", "aniqlik", "natija", "sinov", "mashq", "sanoat",
    "ta'lim", "maktab", "universitet", "ilm", "fan", "kitob", "daftar", "qalam", "yaxshi", "yomon", "chiroyli"
  ],
  ru: [
    "и", "в", "не", "на", "я", "быть", "он", "с", "что", "а", "по", "это", "она", "этот", "но", "они", "мы", 
    "всё", "у", "который", "мой", "за", "к", "тебе", "свой", "из", "же", "от", "ты", "бы", "о", "когда", 
    "только", "тоже", "себя", "уже", "для", "вот", "кто", "да", "говорить", "год", "знать", "вы", "или", 
    "если", "время", "рука", "нет", "самый", "ни", "один", "со", "хотеть", "делать", "надо", "глаз", "жизнь", 
    "первый", "день", "тут", "во", "ничто", "потом", "очень", "собой", "ли", "при", "новый", "слово", "идти", 
    "друг", "дом", "работа", "сейчас", "можно", "человек", "два", "под", "раз", "где", "то", "всех", "тогда", 
    "после", "хотя", "потому", "чтобы", "было", "были", "будет", "просто", "даже", "вдруг", "между", "перед",
    "через", "около", "вокруг", "после", "прежде", "опять", "снова", "быстро", "тихо", "громко", "красиво"
  ]
}

// ============================================================
// Millions of words — seeded text bank per language
// In production: load from MongoDB with pagination
// ============================================================

export const TEXT_BANK: Record<Language, Record<Difficulty, string[]>> = {
  en: {
    easy: [
      "the quick brown fox jumps over the lazy dog and runs away into the forest",
      "she sells seashells by the seashore and the shells are very beautiful",
      "to be or not to be that is the question we all must answer",
      "all that glitters is not gold but it can still be beautiful to see",
      "in the beginning there was light and the world was filled with wonder",
      "a journey of a thousand miles begins with a single step forward",
      "life is like a box of chocolates you never know what you will get",
      "the sun rises in the east and sets in the west every single day",
      "reading books is one of the best ways to expand your knowledge",
      "practice makes perfect and every expert was once a beginner",
      "music can move emotions and create memories that last for years",
      "a friendly smile can brighten someone else’s day and change the mood",
      "a small act of kindness can have a big impact on the people around you",
      "water is the source of life and we must protect our blue planet",
      "trees provide clean air shade and home for many lovely birds",
      "focus on your goals and work hard to make your dreams come true",
      "learning a new language opens up a whole new world of opportunities",
      "honesty is the best policy and builds trust between true friends",
      "time flies when you are having fun and enjoying the sweet moments",
      "the stars shine bright in the night sky and fill me with peace",
      "always believe in yourself and never give up on your path",
      "a warm cup of tea on a cold rainy day feels very comfortable",
      "laughter is the best medicine for a healthy and happy long life",
      "we should always be thankful for the good things in our lives",
      "simple things are often the most beautiful and bring the most joy",
      "traveling to new places helps us understand different cultures and people",
    ],
    medium: [
      "The programming language Python was created by Guido van Rossum and first released in 1991, emphasizing code readability.",
      "Machine learning algorithms can identify patterns in large datasets that would be impossible for humans to detect manually.",
      "The Internet of Things connects everyday devices to the internet, enabling them to send and receive data automatically.",
      "Artificial intelligence is transforming industries from healthcare to finance, creating both opportunities and challenges.",
      "Cloud computing allows businesses to store and process data on remote servers rather than local infrastructure.",
      "Cybersecurity professionals work tirelessly to protect sensitive information from malicious actors around the world.",
      "The blockchain technology underlying cryptocurrencies offers a decentralized and transparent ledger system.",
      "Quantum computing leverages quantum mechanical phenomena to perform calculations exponentially faster than classical computers.",
      "Sustainable cities depend on clean energy, public transit, and smart planning to reduce pollution.",
      "Remote work has changed the way teams collaborate, making communication tools more important than ever.",
      "The human brain contains about eighty-six billion neurons, forming a complex network of communication.",
      "Every year, millions of monarch butterflies migrate thousands of miles from North America to central Mexico.",
      "The Great Barrier Reef is the world's largest coral reef system, visible even from outer space.",
      "Developing good habits in the morning can significantly increase your productivity throughout the entire day.",
      "Space exploration helps us understand our place in the universe and inspires future generations of scientists.",
      "Deep learning is a subset of machine learning based on artificial neural networks with representation learning.",
      "Version control systems like Git allow multiple developers to work on the same codebase simultaneously without conflicts.",
      "The concept of open-source software promotes collaboration, transparency, and community-driven development.",
      "Effective time management is a critical skill that helps balance professional responsibilities and personal life.",
      "Healthy eating combined with regular exercise is the foundation of a long and energetic lifestyle.",
    ],
    hard: [
      "The philosophical implications of consciousness remain one of the most profound and unresolved questions in neuroscience, bridging empirical observation and subjective experience.",
      "Cryptographic hash functions transform arbitrary input data into fixed-size output strings through deterministic one-way computational processes.",
      "The thermodynamic principles governing entropy production in non-equilibrium systems have far-reaching implications for understanding complex biological organisms.",
      "Epistemological frameworks that prioritize empirical verification over rationalist deduction have shaped the development of modern scientific methodology.",
      "The juxtaposition of classical architectural elements with minimalist modern aesthetics creates a striking visual dichotomy in urban landscapes.",
      "Phenomenological analysis explores the structures of conscious experience from the first-person perspective, challenging traditional dualistic assumptions.",
      "Microeconomic models analyze the decision-making processes of individual consumer units and business firms within varying market structures.",
      "The synchronization of distributed database nodes requires sophisticated consensus algorithms like Paxos or Raft to guarantee consistency.",
      "Geopolitical stability is increasingly influenced by the intersection of resource scarcity, technological supremacy, and demographic transitions.",
      "Aesthetic appreciation of abstract expressionist art frequently relies on the viewer's capacity to interpret non-representational form and color.",
    ],
    extreme: [
      "The stochastic differential equations underlying Brownian motion describe the erratic random movement of particles suspended in a fluid medium, forming the mathematical foundation for both financial derivatives pricing and polymer physics.",
      "Gödel's incompleteness theorems demonstrate that within any consistent formal system powerful enough to express basic arithmetic, there exist true statements that cannot be proven within that system itself.",
      "The implementation of zero-knowledge succinct non-interactive arguments of knowledge enables verifiable computation without exposing sensitive input parameters to malicious verifiers.",
      "Electromagnetic radiation propagating through anisotropic crystalline structures exhibits birefringence, splitting incoming light rays into ordinary and extraordinary waves.",
    ],
  },
  uz: {
    easy: [
      "tez yuguruvchi qo'ng'ir tulki dangasa itdan oshib o'tdi va o'rmonga qochib ketdi",
      "kitob o'qish bilimingizni oshirishning eng yaxshi usullaridan biridir va sizni rivojlantiradi",
      "har kuni mashq qilish orqali siz o'z mahoratingizni oshirib borishingiz mumkin",
      "do'stlar hayotning eng qimmatli boyligidir va ularni asrash kerak",
      "o'zbekiston go'zal tabiatga ega mamlakat bo'lib tog'lar va tekisliklar bilan bezangan",
      "ilm olish uchun hech qachon kech emas chunki bilim insonni doimo boyitadi",
      "dastlabki qadamni tashlash qiyin bo'lishi mumkin lekin davom etish muhim",
      "har bir kichik g'alaba katta maqsadlarga bir qadam yaqinlashtiradi",
      "quyosh ertalab sharqdan chiqadi va butun olamni o'z nuri bilan yoritadi",
      "toza havo va jismoniy tarbiya inson salomatligi uchun juda foydalidir",
      "yaxshi so'z jon ozig'i deydilar shuning uchun odamlarga shirin so'z bo'ling",
      "vaqtingizni to'g'ri taqsimlashni o'rgansangiz hamma ishga ulgurishingiz mumkin",
      "daraxtlar bizga kislorod beradi va atrof-muhitni go'zallashtiradi",
      "yangi bilimlar olish har bir insonni kelajakda muvaffaqiyatga yetaklaydi",
      "samimiy kulgi inson umrini uzaytiradi va ko'ngillarni yaqinlashtiradi",
      "tabiatni asrash va suvni tejash kelajak avlod oldidagi burchimizdir",
    ],
    medium: [
      "Dasturlash tillari orasida Python o'zining oddiy sintaksisi va keng imkoniyatlari bilan alohida o'rin tutadi.",
      "Sun'iy intellekt texnologiyalari zamonaviy sanoatni tubdan o'zgartirmoqda va yangi imkoniyatlar yaratmoqda.",
      "Ma'lumotlar bazasi tizimlarini boshqarish uchun SQL tili dunyo bo'ylab keng qo'llaniladi.",
      "Kiberxavfsizlik mutaxassislari har kuni millionlab foydalanuvchilarning ma'lumotlarini himoya qiladi.",
      "Onlayn ta'lim platformalari bilimingizni istalgan vaqtda va istalgan joydan oshirishga yordam beradi.",
      "Haqiqiy jamoaviy ish muvaffaqiyatli loyiha natijalariga erishish uchun muhim omil hisoblanadi.",
      "Mobil ilovalar kundalik hayotimizni osonlashtirish va vaqtni tejash uchun xizmat qilmoqda.",
      "Startup loyihalarni boshlashda bozor ehtiyojlarini to'g'ri tahlil qilish juda muhimdir.",
      "Zamonaviy veb-saytlar tez yuklanishi va mobil qurilmalarga to'liq moslashgan bo'lishi kerak.",
      "Bulutli texnologiyalar ma'lumotlarni xavfsiz saqlash va jamoaviy ishlashni osonlashtirish imkonini beradi.",
      "Dasturiy ta'minotni ishlab chiqish jarayonida testlash bosqichi xatolarni kamaytirishga yordam beradi.",
      "Moliyaviy savodxonlik yoshlikdan shakllanishi kerak bo'lgan eng muhim ko'nikmalardan biridir.",
    ],
    hard: [
      "Kvant kompyuterlarining rivojlanishi kriptografiya sohasida inqilob qilishi mumkin va hozirgi shifrlash usullarini eskirtirib qo'yishi kutilmoqda.",
      "Neyron tarmoqlar insonning miyasidagi sinaptik aloqalardan ilhomlangan va murakkab vazifalarni hal qilishga mo'ljallangan.",
      "Iqtisodiy islohotlar samaradorligi bevosita qonun ustuvorligi va investitsion muhitning jozibadorligi bilan belgilanadi.",
      "Axborot texnologiyalari integratsiyasi ta'lim tizimini globallashuv sharoitida raqobatbardosh qilishning eng asosiy shartidir.",
      "Falsafiy dunyoqarash insonning borliq va jamiyatdagi o'rnini anglashga yordam beruvchi fundamental tizimdir.",
    ],
    extreme: [
      "Stokastik differensial tenglamalar moliyaviy derivativlar narxlashning matematik asosini tashkil etadi va Braun harakatini tavsiflaydi.",
      "Gedelning to'liqsizlik teoremalari shuni ko'rsatadiki, har qanday izchil rasmiy tizim ichida isbotlab bo'lmaydigan haqiqiy da'volar maqbul bo'ladi.",
      "Neyromorfik arxitekturaga asoslangan yarimo'tkazgichli chiplar an'anaviy fon Neyman arxitekturasidan farqli o'laroq, kam energiya sarfi bilan parallel hisoblashlarni amalga oshiradi.",
    ],
  },
  ru: {
    easy: [
      "быстрая коричневая лисица перепрыгнула через ленивую собаку и убежала в лес",
      "чтение книг является одним из лучших способов расширить свои знания и кругозор",
      "практика делает мастера и каждый эксперт когда-то был начинающим",
      "солнце встаёт на востоке и заходит на западе каждый день без исключения",
      "жизнь полна интересных моментов которые нужно ценить и запоминать навсегда",
      "утром свежий воздух наполняет город спокойствием и новой энергией",
      "музыка может поднять настроение и дарить вдохновение на весь день",
      "маленькая доброта иногда меняет целый день человека к лучшему",
      "звездное небо всегда притягивает взгляд своей бесконечной красотой и тайной",
      "чистая вода и здоровое питание помогают организму быть всегда в тонусе",
      "улыбка близкого человека может мгновенно поднять настроение в любой хмурый день",
      "упорный труд и вера в себя обязательно приведут к поставленной жизненной цели",
      "лес полон прекрасных звуков пения птиц и шелеста зеленых листьев на ветру",
      "простые радости жизни часто приносят нам самое большое и искреннее счастье",
    ],
    medium: [
      "Алгоритмы машинного обучения способны находить закономерности в больших массивах данных.",
      "Искусственный интеллект трансформирует отрасли от здравоохранения до финансового сектора.",
      "Квантовые вычисления используют квантовые явления для выполнения расчётов экспоненциально быстрее.",
      "Блокчейн технология предлагает децентрализованную и прозрачную систему учёта операций.",
      "Облачные сервисы помогают компаниям хранить данные на удалённых серверах, сокращая затраты.",
      "Успешная работа в команде требует доверия, общения и уважения к идеям других.",
      "Разработка современного программного обеспечения включает в себя постоянное тестирование и интеграцию.",
      "Кибербезопасность становится важнейшим фактором защиты личной информации в цифровую эпоху.",
      "Эффективное планирование своего времени позволяет достигать баланса между работой и отдыхом.",
      "Инновационные технологии в образовании открывают новые горизонты для студентов по всему миру.",
    ],
    hard: [
      "Философские последствия проблемы сознания остаются одним из наиболее глубоких неразрешённых вопросов в нейронауке.",
      "Криптографические хеш-функции преобразуют произвольные входные данные в строки фиксированного размера.",
      "Интеграция распределенных систем требует надежных алгоритмов консенсуса для обеспечения целостности данных.",
      "Эпистемологический подход к научному познанию акцентирует внимание на эмпирической проверяемости гипотез.",
      "Эстетическое восприятие абстрактного искусства зависит от способности зрителя интерпретировать нефигуративные формы.",
    ],
    extreme: [
      "Теоремы о неполноте Гёделя демонстрируют, что в любой непротиворечивой формальной системе существуют истинные утверждения, которые не могут быть доказаны внутри этой системы.",
      "Стохастические дифференциальные уравнения, описывающие броуновское движение, лежат в основе современных моделей ценообразования финансовых активов.",
    ],
  },
  de: {
    easy: [
      "der schnelle braune Fuchs springt über den faulen Hund und rennt in den Wald",
      "Bücher lesen ist eine der besten Möglichkeiten sein Wissen zu erweitern",
      "Übung macht den Meister und jeder Experte war einmal ein Anfänger",
      "ein sonniger Vormittag kann den ganzen Tag mit guter Laune erfüllen",
      "gute Gewohnheiten entstehen durch tägliche kleine Schritte und Geduld",
      "ein Spaziergang im Park bringt frische Luft und neue Motivation für den Tag",
    ],
    medium: [
      "Algorithmen des maschinellen Lernens können Muster in großen Datensätzen erkennen.",
      "Quantencomputer nutzen Quantenphänomene um Berechnungen exponentiell schneller durchzuführen.",
      "Cloud-Services ermöglichen den Zugriff auf Daten und Anwendungen von überall aus.",
      "Datenschutz und Sicherheit sind entscheidend für das Vertrauen der Benutzer.",
      "Effektive Teamarbeit basiert auf Kommunikation Respekt und gemeinsamen Zielen.",
    ],
    hard: [
      "Die philosophischen Implikationen des Bewusstseins bleiben eine der tiefgründigsten ungelösten Fragen der Neurowissenschaft.",
      "Kryptographische Hashfunktionen transformieren beliebige Eingabedaten in Zeichenketten fester Größe.",
    ],
    extreme: [
      "Gödels Unvollständigkeitssätze beweisen dass es in jedem konsistenten formalen System wahre Aussagen gibt die nicht bewiesen werden können.",
    ],
  },
  fr: {
    easy: [
      "le renard brun rapide saute par-dessus le chien paresseux et court dans la forêt",
      "lire des livres est l'une des meilleures façons d'élargir ses connaissances",
      "une promenade au bord de la mer peut calmer l'esprit et inspirer de nouvelles idées",
      "l'apprentissage quotidien aide à grandir et à atteindre des objectifs plus grands",
      "le soleil brille aujourd'hui et apporte de la joie dans toute la ville",
    ],
    medium: [
      "Les algorithmes d'apprentissage automatique peuvent identifier des modèles dans de grands ensembles de données.",
      "L'intelligence artificielle transforme les industries de la santé à la finance.",
      "Les technologies en nuage facilitent la collaboration et le partage de ressources.",
      "La cybersécurité est essentielle pour protéger les informations personnelles et professionnelles.",
      "Le travail d'équipe efficace repose sur la confiance et une communication ouverte.",
    ],
    hard: [
      "Les implications philosophiques de la conscience restent l'une des questions les plus profondes en neuroscience.",
      "Les fonctions de hachage cryptographiques transforment des données d'entrée en chaînes de taille fixe.",
    ],
    extreme: [
      "Les théorèmes d'incomplétude de Gödel démontrent que dans tout système formel cohérent il existe des énoncés vrais qui ne peuvent pas être prouvés.",
    ],
  },
  es: {
    easy: [
      "el rápido zorro marrón salta sobre el perro perezoso y corre hacia el bosque",
      "leer libros es una de las mejores maneras de ampliar tus conocimientos",
      "una tarde tranquila puede ser perfecta para practicar nuevas habilidades",
      "la amistad verdadera se basa en confianza respeto y apoyo mutuo",
      "el aire fresco de la mañana nos llena de energía para afrontar el nuevo día",
    ],
    medium: [
      "Los algoritmos de aprendizaje automático pueden identificar patrones en grandes conjuntos de datos.",
      "La inteligencia artificial está transformando industrias desde la salud hasta las finanzas.",
      "Los servicios en la nube permiten colaborar con equipos de todo el mundo.",
      "La privacidad y la seguridad digital son esenciales para usar la tecnología con confianza.",
      "El éxito de un proyecto depende de la planificación detallada y la ejecución constante.",
    ],
    hard: [
      "Las implicaciones filosóficas de la consciencia siguen siendo una de las preguntas más profundas en neurociencia.",
      "Las funciones hash criptográficas transforman datos de entrada en cadenas de tamaño fijo.",
    ],
    extreme: [
      "Los teoremas de incompletitud de Gödel demuestran que en cualquier sistema formal consistente existen enunciados verdaderos que no pueden ser probados.",
    ],
  },
  ja: {
    easy: [
      "速い茶色のキツネは怠け者の犬を飛び越えて森の中に走って行きました",
      "本を読むことは知識を広げる最良の方法の一つです",
      "朝の散歩は心を落ち着けて一日を始めるのに最適です",
      "毎日の練習が上達の鍵であり自信を育てます",
    ],
    medium: [
      "機械学習アルゴリズムは大規模なデータセットからパターンを識別することができます",
      "人工知能はヘルスケアから金融まであらゆる産業を変革しています",
      "クラウドコンピューティングはリモートでの作業を容易にします",
      "サイバーセキュリティはオンライン上のデータを守るために不可欠です",
    ],
    hard: [
      "意識の哲学的含意は神経科学において最も深遠で未解決な問題の一つです",
    ],
    extreme: [
      "ゲーデルの不完全性定理は算術を表現できる一貫した形式システムには証明できない真の命題が存在することを示している",
    ],
  },
  zh: {
    easy: [
      "快速的棕色狐狸跳过了懒惰的狗并跑进了森林",
      "读书是拓展知识的最佳方式之一",
      "清晨的阳光照亮了公园里的每一条小路",
      "每天坚持练习能让你更快地掌握新技能",
    ],
    medium: [
      "机器学习算法可以在大型数据集中识别人类无法手动检测的模式",
      "人工智能正在从医疗保健到金融的各个行业进行变革",
      "云计算使团队可以在世界任何地方进行协作",
      "网络安全对于保护个人和公司数据至关重要",
    ],
    hard: [
      "意识的哲学含义仍然是神经科学中最深刻和未解决的问题之一",
    ],
    extreme: [
      "哥德尔不完备定理证明在任何足够强大的一致形式系统中存在真实的但无法在系统内证明的命题",
    ],
  },
  ar: {
    easy: [
      "الثعلب البني السريع يقفز فوق الكلب الكسول ويجري إلى الغابة",
      "قراءة الكتب هي إحدى أفضل الطرق لتوسيع معرفتك",
      "الصباح الهادئ يساعد على بدء اليوم بطاقة جديدة",
      "التدريب اليومي يبني مهارات قوية وثقة متزايدة",
    ],
    medium: [
      "يمكن لخوارزميات التعلم الآلي تحديد الأنماط في مجموعات البيانات الكبيرة",
      "يحول الذكاء الاصطناعي الصناعات من الرعاية الصحية إلى المالية",
      "الحوسبة السحابية تتيح للأشخاص العمل معاً من أماكن مختلفة",
      "أمن المعلومات مهم لحماية البيانات الشخصية والمهنية",
    ],
    hard: [
      "تظل الآثار الفلسفية للوعي من أعمق الأسئلة غير المحلولة في علم الأعصاب",
    ],
    extreme: [
      "تثبت مبرهنات عدم الاكتمال لغودل أنه في أي نظام رسمي متسق يوجد عبارات صحيحة لا يمكن إثباتها داخل النظام",
    ],
  },
  tr: {
    easy: [
      "hızlı kahverengi tilki tembel köpeğin üzerinden atlayarak ormana kaçtı",
      "kitap okumak bilginizi genişletmenin en iyi yollarından biridir",
      "her sabah yapılan küçük alıştırmalar büyük gelişmelere yol açar",
      "güzel anılar sevdiklerinizle paylaşılan basit anlarda saklıdır",
    ],
    medium: [
      "Makine öğrenmesi algoritmaları büyük veri kümelerinde insan tarafından tespit edilemeyecek kalıpları tanımlayabilir",
      "Yapay zeka sağlık hizmetlerinden finansa kadar sektörleri dönüştürüyor",
      "Bulut hizmetleri ekiplerin her yerden birlikte çalışmasına yardımcı olur",
      "Siber breeding dijital bilgilerin korunması için hayati önem taşır",
    ],
    hard: [
      "Bilincin felsefi sonuçları nörobilimde en derin ve çözümsüz sorulardan biri olmaya devam ediyor",
    ],
    extreme: [
      "Gödel'in eksiklik teoremleri aritmetiği ifade edebilecek kadar güçlü herhangi bir tutarlı formal sistemde sistem içinde kanıtlanamayan doğru ifadeler bulunduğunu göstermektedir",
    ],
  },
}

export function getRandomText(language: Language, difficulty: Difficulty, count = 1): string[] {
  const pool = TEXT_BANK[language]?.[difficulty] || TEXT_BANK.en.easy
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function getTextForMode(
  language: Language,
  difficulty: Difficulty,
  wordCount: number
): string {
  // If we have a common words bank for this language and the difficulty is easy,
  // we generate pure random lowercase word flow (Monkeytype-like)
  const useWordsOnly = (difficulty === 'easy') && COMMON_WORDS[language]
  
  if (useWordsOnly) {
    const wordList = COMMON_WORDS[language]!
    const resultWords: string[] = []
    
    for (let i = 0; i < wordCount; i++) {
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)]
      resultWords.push(randomWord)
    }
    
    return resultWords.join(' ')
  }

  // Otherwise, use sentence bank
  const pool = TEXT_BANK[language]?.[difficulty] || TEXT_BANK.en.easy
  if (pool.length === 0) return ''

  const shuffledPool = [...pool].sort(() => Math.random() - 0.5)
  const resultWords: string[] = []
  let index = 0
  let lastSentence = ''

  while (resultWords.length < wordCount) {
    if (index >= shuffledPool.length) {
      const refill = [...pool].sort(() => Math.random() - 0.5)
      shuffledPool.push(...refill)
    }

    let sentence = shuffledPool[index++]
    if (sentence === lastSentence && index < shuffledPool.length) {
      sentence = shuffledPool[index++]
    }

    lastSentence = sentence
    const words = sentence.split(' ')
    const remaining = wordCount - resultWords.length
    const sliceCount = Math.min(words.length, remaining)

    resultWords.push(...words.slice(0, sliceCount))
  }

  return resultWords.slice(0, wordCount).join(' ')
}

export const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English',    flag: '🇺🇸' },
  { code: 'uz', name: "O'zbek",     flag: '🇺🇿' },
  { code: 'ru', name: 'Русский',    flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch',    flag: '🇩🇪' },
  { code: 'fr', name: 'Français',   flag: '🇫🇷' },
  { code: 'es', name: 'Español',    flag: '🇪🇸' },
  { code: 'ja', name: '日本語',      flag: '🇯🇵' },
  { code: 'zh', name: '中文',        flag: '🇨🇳' },
  { code: 'ar', name: 'العربية',    flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe',     flag: '🇹🇷' },
]
