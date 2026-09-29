// Copy source: content/projects.md. Replace placeholder thumbnails in
// public/projects/ with real 5:4 visuals (e.g. 1200x960 PNG) and update paths.

export type Project = {
  slug: string;
  title: string;
  category: "Data/ML" | "Design";
  badge?: string;
  oneLiner: string;
  problem: string;
  approach: string;
  result: string;
  role: string;
  stack: string[];
  links?: { label: string; href: string }[];
  thumbnail: string;
  gallery?: GalleryImage[];
  /** App screenshots shown in a phone mockup beside the details (design projects). */
  phoneScreens?: { src: string; alt: string }[];
};

export type GalleryImage = {
  id: string;
  title: string;
  description: string;
  image: string;
  href?: string;
};

// Gallery images per project, served from public/projects/<slug>/.

const placeholderGallery: Record<string, GalleryImage[]> = {
  phishing: [
    { id: "p1", title: "Real-world audit", description: "97% accuracy on 100 phishing and 100 benign URLs; 2 of 100 benign flagged.", image: "/projects/phishing/e2e-performance.png" },
    { id: "p2", title: "Per-stage metrics", description: "96.43% F1 on SMS, 80.22% on URLs, 99.57% on HTML.", image: "/projects/phishing/per-stage-metrics.png" },
    { id: "p3", title: "Catching the data leakage", description: "With URLSimilarityIndex, one feature held about 98% of the model's importance.", image: "/projects/phishing/leakage-ablation.png" },
    { id: "p4", title: "Stage 3 confusion matrix", description: "3 false alarms and 40 misses out of 10,000 pages.", image: "/projects/phishing/stage3-confusion.png" },
    { id: "p5", title: "What the HTML model looks at", description: "Feature importance across the 28 HTML structure features.", image: "/projects/phishing/stage3-features.png" },
    { id: "p6", title: "Cascade routing", description: "Where each input gets decided; only 0.08% need an HTML fetch.", image: "/projects/phishing/stage-routing.png" },
  ],
  datafest: [
    { id: "d1", title: "The Economic Cliff", description: "Emergency admissions climb from 3.6% with no economic struggles to 81.8% with four.", image: "/projects/datafest/economic-cliff.png" },
    { id: "d2", title: "Hardship among dropouts", description: "Housing instability is 6.4x more common among dropouts than returning patients (24.5% vs 3.8%).", image: "/projects/datafest/hardship-dropout.png" },
    { id: "d3", title: "Dropout rate by county", description: "Douglas County hits 33.5% against an 8% average: mostly patients around 65 with chronic kidney disease.", image: "/projects/datafest/county-dropout.png" },
    { id: "d4", title: "Dropouts are alive", description: "99.12% of chronic patients who never came back are still alive: lost to the system, not to death.", image: "/projects/datafest/vital-status.png" },
    { id: "d5", title: "What drives dropout", description: "Being a chronic patient (32.2%) and MyChart activation (16.8%) are the strongest predictors.", image: "/projects/datafest/dropout-drivers.png" },
    { id: "d6", title: "No one follows up", description: "94.3% of 52,380 dropout patients received no outreach of any kind.", image: "/projects/datafest/outreach-coverage.png" },
  ],
  olist: [
    { id: "o5", title: "When Brazilians shop", description: "Monday is the busiest day and afternoons the busiest time.", image: "/projects/olist/purchase-pattern.png" },
    { id: "o2", title: "Delivery timing vs rating", description: "Early orders average 4.29 stars; 10+ days late drops to 1.69.", image: "/projects/olist/review-by-delay.png" },
    { id: "o1", title: "Late deliveries by state", description: "Northeastern states lead: AL 20.6% and MA 16.7% of orders arrive late.", image: "/projects/olist/late-rate-by-state.png" },
    { id: "o4", title: "Monthly order volume", description: "Orders roughly tripled from 2016 to mid-2018, peaking at Black Friday 2017.", image: "/projects/olist/monthly-orders.png" },
    { id: "o3", title: "Repeat purchase by category", description: "Home appliances retain best at about 18%; the platform overall at 3%.", image: "/projects/olist/repeat-categories.png" },
    { id: "o6", title: "Payment types over time", description: "Credit card about 74%, boleto bancário about 19%: a financial inclusion signal.", image: "/projects/olist/payment-trend.png" },
  ],
  bodyfat: [
    { id: "b1", title: "FatLens results", description: "Body fat %, BMI, waist-to-hip ratio, fat and lean mass and a health score.", image: "/projects/bodyfat/app-results.png" },
    { id: "b2", title: "Gauges and insights", description: "Body fat and BMI gauges, with tabs for health, impact, recommendations, nutrition and history.", image: "/projects/bodyfat/app-gauges.png" },
    { id: "b3", title: "Actual vs predicted", description: "Predictions track the ideal line: MAE 3.68 points, R² 0.653.", image: "/projects/bodyfat/actual-vs-predicted.png" },
    { id: "b4", title: "What drives the prediction", description: "Abdomen carries 46.8% of the model's weight, far ahead of wrist and neck.", image: "/projects/bodyfat/feature-importance.png" },
    { id: "b5", title: "Correlation heatmap", description: "Density correlates -0.99 with body fat, so it was dropped to avoid leakage.", image: "/projects/bodyfat/correlation-heatmap.png" },
    { id: "b6", title: "Abdomen vs body fat", description: "The strongest single signal: 0.81 correlation with body fat.", image: "/projects/bodyfat/abdomen-vs-bodyfat.png" },
  ],
  solutio: [
    { id: "s1", title: "Problem statement", description: "85.6% of Indonesian millennials are not financially healthy; only about 16% have an emergency fund.", image: "/projects/solutio/problem.jpg" },
    { id: "s2", title: "User persona", description: "Emma, the budgeting beginner: a 22-year-old student with her first part-time job.", image: "/projects/solutio/persona-emma.jpg" },
    { id: "s3", title: "Empathy map", description: "What young users hear, see, say, do, think and feel about managing money.", image: "/projects/solutio/empathy-map.jpg" },
    { id: "s4", title: "Perceptual map", description: "Solutio against Wallet, Money Manager and Smart Budget on ease of use and personalisation.", image: "/projects/solutio/perceptual-map.jpg" },
    { id: "s5", title: "Key features", description: "Automatic tracking, personalised budgets, education, AI advisor, alerts and investment tips.", image: "/projects/solutio/key-features.jpg" },
    { id: "s6", title: "Revenue streams", description: "Freemium subscription plus partnerships with banks, insurers and e-wallets.", image: "/projects/solutio/revenue-streams.jpg" },
  ],
  petpals: [
    { id: "pp1", title: "Pet search and match", description: "The main flow: favourites, filtered search, Match Pet and the pet detail page.", image: "/projects/petpals/design-search-match.png" },
    { id: "pp2", title: "Onboarding and login", description: "First-run screens and sign in.", image: "/projects/petpals/design-onboarding.png" },
    { id: "pp3", title: "Chat", description: "Talking directly with a shelter or pet owner before adopting.", image: "/projects/petpals/design-chat.png" },
    { id: "pp4", title: "Profile", description: "The user's profile and pets.", image: "/projects/petpals/design-profile.png" },
    { id: "pp5", title: "Wireframes", description: "Low-fidelity layouts before the visual design.", image: "/projects/petpals/wireframes.png" },
    { id: "pp6", title: "User testing", description: "9 of 10 testers rated the visual design 4 or 5 out of 5.", image: "/projects/petpals/survey-visual.png" },
  ],
};

const baseProjects: Project[] = [
  {
    slug: "phishing",
    title: "Tri-Model Phishing Detection",
    category: "Data/ML",
    badge: "ICISS 2026",
    oneLiner:
      "A three-stage cascade that checks an Indonesian SMS, the link inside it and the page behind it, and only fetches the page when it has to.",
    problem:
      "Phishing now attacks through the message, the link and the web page at once, so single-signal detectors miss it, and very few are built for Indonesian-language scams.",
    approach:
      "A latency-aware cascade. Stage 1 reads the Indonesian SMS (TF-IDF + Logistic Regression), Stage 2 checks 19 URL structure features (XGBoost), and Stage 3 fetches the page and checks 28 HTML features (Random Forest). A stage only decides when it is at least 70% confident; otherwise the case moves on to the next, more expensive stage.",
    result:
      "97% end-to-end accuracy on a 200-sample real-world audit (96% phishing recall, 2% false positives), with only 0.08% of inputs needing an HTML fetch. Per stage: 96.43% F1 on Indonesian SMS, 80.22% on real-world URLs, 99.57% on HTML. An early 99.99% URL score turned out to be data leakage (one feature, URLSimilarityIndex, gave the answer away), so the URL model was retrained on a harder, more realistic dataset. Paper accepted at ICISS 2026 (IEEE); publication is still pending upload.",
    links: [{ label: "ICISS 2026", href: "https://iciss.goesmart.id/" }],
    role: "Group of 4, third author. Most active contributor: drove data loading, merging, cleaning and selection, the EDA and visualisations, choosing the right model, and the final documentation.",
    stack: ["Python", "Scikit-learn", "XGBoost", "Pandas", "BeautifulSoup", "Matplotlib"],
    thumbnail: "/projects/phishing.png",
  },
  {
    slug: "datafest",
    title: "ASA DataFest 2026: Patient Dropout",
    category: "Data/ML",
    badge: "DataFest 2026",
    oneLiner:
      "Why chronic patients visit a hospital once and never come back: a hackathon analysis of 7.7 million real patient encounters.",
    problem:
      "The dataset is real: privacy-protected patient records from Stormont Vail Health, a hospital network in Kansas, shared with DataFest teams by the hospital itself. It covers every encounter from January 2022 to December 2025, with diagnoses, providers, departments, census locations and a social needs survey. Chronic diseases need continuous care, yet many of these patients stop after a single visit. Dropout is rarely random, so the question was who drops out, and what hardship, digital and regional factors push them away.",
    approach:
      "Joined 7 hospital tables (7.7M encounters, 948k patients, 2022 to 2025) plus a chronic condition reference and county GDP, keyed on patient IDs. Cleaned it by standardising ICD-10 codes, filtering invalid encounter types and handling many kinds of missing codes. Defined dropout as a single recorded encounter, mapped about 300 chronic diagnoses, turned the social determinants survey into a per-patient hardship score, and ranked dropout drivers with a feature importance model.",
    result:
      "99.12% of chronic dropouts are still alive, so the hospital is losing living patients, not deceased ones. Housing instability is 6.4x more common among dropouts than returning patients, and emergency admissions climb from 3.6% with no economic struggles to 81.8% with four. Douglas County has a 33.5% dropout rate against an 8% average, mostly patients around 65 with chronic kidney disease, and 94.3% of dropouts never received any follow-up outreach.",
    role: "Team of 3, participant. Most active contributor: drove the insight ideas and story, merging and cleaning the 7 datasets, the chronic disease and dropout analysis, the hardship score, the visualisations, and the write-up and presentation.",
    stack: ["Python", "Pandas", "Matplotlib", "Seaborn"],
    links: [{ label: "View slides", href: "https://github.com/Data-Science-BINUS/asa-datafest/blob/main/2026/Slides%20(3%20content%20slides)/PenjelajahSejarah_ASA%20Datafest.pdf" }],
    thumbnail: "/projects/datafest-logo.png",
  },
  {
    slug: "olist",
    title: "Brazilian E-Commerce EDA",
    category: "Data/ML",
    oneLiner:
      "Only 3% of Brazilian e-commerce customers ever order again, and where you live decides how long you wait.",
    problem:
      "Brazilian e-commerce tripled in two years, but what structurally limits it as an engine of inclusive growth (SDG 8: Decent Work and Economic Growth)?",
    approach:
      "Merged and cleaned 9 raw Olist tables (about 100k orders, 2016 to 2018) into one 95,824-row dataset, then explored four questions: delivery timing vs satisfaction, late deliveries by state, repeat purchases by category, and growth and payment behaviour.",
    result:
      "Late orders average 2.27 stars vs 4.21 for on-time ones, and 10+ days late drops to 1.69. Late deliveries cluster in the Northeast (AL 20.6%, MA 16.7%). Only 3% of customers ever order again. Conclusion: regional logistics inequality and low retention are the two structural barriers.",
    role: "Group of 3. Most active contributor: drove data loading, merging and cleaning, the EDA and visualisations, and the final documentation.",
    stack: ["Python", "Pandas", "Matplotlib", "Seaborn", "Jupyter"],
    links: [{ label: "View slides", href: "/projects/olist/slides.pdf" }],
    thumbnail: "/projects/olist.png",
  },
  {
    slug: "bodyfat",
    title: "Body Fat Prediction App",
    category: "Data/ML",
    oneLiner:
      "FatLens: estimate body fat percentage from a scale and a tape measure, live in the browser.",
    problem:
      "BMI only uses weight and height, so it can't tell muscle from fat, while accurate methods like DEXA scans or hydrostatic weighing need expensive equipment and trained staff.",
    approach:
      "Cleaned 252 adult male records (duplicates removed, BodyFat outliers filtered with IQR) and framed it as a regression on 13 inputs: age, weight, height and 10 body circumferences. Dropped Density because body fat is calculated from it with Siri's equation, so keeping it would leak the answer. Tuned Linear Regression, Ridge, Lasso and Random Forest with GridSearchCV and 5-fold cross-validation, tracked the runs in MLflow, and deployed the model as a Streamlit app that redeploys on every push to GitHub.",
    result:
      "Chose Linear Regression (MAE 3.68 points, R² 0.653) over Lasso's slightly higher R² of 0.66, because explicit weights let the app explain each prediction and the model runs instantly. Abdomen size drives 46.8% of the prediction. The live app adds BMI, waist-to-hip ratio, lean and fat mass, recommendations and calorie targets, and 5 testers completed the full prediction flow and fed the UI/UX plans.",
    role: "Group of 3. Data preprocessing and regression model training.",
    stack: ["Python", "Pandas", "Scikit-learn", "MLflow", "Plotly", "Streamlit"],
    links: [{ label: "GitHub", href: "https://github.com/jamestiono19/Bodyfat-app" }, { label: "Live demo", href: "https://bodyfat-app.streamlit.app/" }],
    thumbnail: "/projects/bodyfat.png",
  },
  {
    slug: "solutio",
    title: "Solutio",
    category: "Design",
    oneLiner:
      "An AI personal finance assistant for students and young adults: track spending, get a personalised budget and ask an AI advisor, all in one app.",
    problem:
      "85.6% of Indonesian millennials are not financially healthy and only about 16% have an emergency fund, while the student financial literacy index sits at 47.56%. Young people lack the habits and guidance to manage money.",
    approach:
      "Built three user personas (a student budgeting beginner, a family CFO and a wealth builder) and an empathy map, then placed competitors like Wallet, Money Manager and Smart Budget on a perceptual map to find the gap: easy to use and highly personalised. Prototyped the full app in Figma: onboarding, sign-in, a 10-question personalisation flow, home dashboard, notes and budgeting, charts, AI chat and settings.",
    result:
      "A complete, clickable Figma prototype with automatic expense tracking, personalised budgets, over-budget alerts, financial education, an AI advisor and investment recommendations, plus a freemium business model (premium subscription and partnerships with banks, investment firms, insurers and e-wallets) aligned with SDG 8.",
    role: "Group of 5. Planned and conducted user interviews that shaped the UI/UX, and designed part of the app's UI.",
    stack: ["Figma", "User personas", "Empathy map", "Competitor analysis"],
    thumbnail: "/projects/solutio.png",
    // Screens cropped from the final project slides (Figma prototype).
    phoneScreens: [
      { src: "/projects/solutio/screen-welcome.png", alt: "Solutio welcome screen with Skip Guide and Quick Guide" },
      { src: "/projects/solutio/screen-home.png", alt: "Solutio home: quick summary of balance and spending, monthly report and transaction history" },
      { src: "/projects/solutio/screen-budgeting.png", alt: "Solutio budgeting: remaining budget and spending by category" },
      { src: "/projects/solutio/screen-chart.png", alt: "Solutio chart: spending split into primary, secondary and tertiary" },
      { src: "/projects/solutio/screen-ai-chat.png", alt: "Solutio AI chat helping plan this month's budget" },
    ],
  },
  {
    slug: "petpals",
    title: "PetPals",
    category: "Design",
    oneLiner:
      "A pet adoption and care app that matches people with shelter pets near them, then lets them chat with the owner and book care in one place.",
    problem:
      "More people treat pets as family, but there is no single place to find a trusted vet, groomer or adoption shelter, get reliable health guidance, or meet other owners.",
    approach:
      "Defined target users (18 to 45, working professionals, students and people at home, mostly city dwellers), then designed the app in Figma grouped by feature: onboarding and login, home, chat, profile, and the main pet search and match flow. Tested the prototype with a survey (1 to 5 ratings plus open questions) and by watching users try it.",
    result:
      "10 testers aged 18 to 21 rated visual appeal 4.2/5, ease of use 4.1/5 and likelihood to recommend 4.3/5. They singled out the detailed pet profiles (health and special needs), the pet match feature, chatting directly with shelter owners, and location-based search with age, sex and special-needs filters.",
    role: "Group of 5. Planned and conducted user interviews that shaped the UI/UX, and designed part of the app's UI.",
    stack: ["Figma", "User research", "Surveys", "Usability testing"],
    thumbnail: "/projects/petpals.png",
    // Screens exported from the Figma prototype (cropped to the screen area).
    phoneScreens: [
      { src: "/projects/petpals/screen-onboarding.png", alt: "PetPals onboarding screen: Find Your Little Pal Here" },
      { src: "/projects/petpals/screen-match-pet.png", alt: "PetPals Match Pet screen showing Mitsy, with pass, undo, chat and adopt buttons" },
      { src: "/projects/petpals/screen-home.png", alt: "PetPals home screen: pet categories and pets to adopt near Bandung" },
    ],
  },
];


// Order the projects appear in (cards and project details). Reorder here.
const ORDER = ["phishing", "datafest", "olist", "solutio", "petpals", "bodyfat"];

export const projects: Project[] = [...baseProjects]
  .sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug))
  .map((p) => ({
    ...p,
    gallery: p.gallery ?? placeholderGallery[p.slug],
  }));
