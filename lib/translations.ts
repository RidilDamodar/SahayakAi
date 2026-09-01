export type LanguageCode = "en" | "hi" | "ml";

type Translations = {
  [key in LanguageCode]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.explore": "Explore Schemes",
    "nav.find": "Find My Scheme",
    "nav.simulator": "What-If Simulator",
    "nav.calculator": "EMI Calculator",
    "nav.partners": "Partner Locator",
    "nav.login": "LOG IN / SIGN UP",
    "nav.logout": "Log Out",
    "nav.dashboard": "My Dashboard",
    "nav.updateProfile": "Update Business Profile",

    // Home Page Hero
    "home.hero.tag": "Institutional Financial Intelligence",
    "home.hero.title1": "Find the right government ",
    "home.hero.title2": "Scheme",
    "home.hero.title3": " for your ",
    "home.hero.title4": "Business",
    "home.hero.desc": "Sahayak AI understands your unique financial needs, matches you with relevant national & state government schemes, explains why they fit, and guides you step-by-step to approval.",
    "home.hero.btnFind": "Find My Scheme",
    "home.hero.btnExplore": "Explore All Schemes",
    "home.hero.tag1": "100% Free Service",
    "home.hero.tag2": "Direct Govt Portals",
    "home.hero.tag3": "Instant Match Scores",
    "home.cta.title": "Ready to unlock government capital for your enterprise?",
    "home.cta.desc": "Log in or sign up to complete your business profile and unlock personalized scheme matches, readiness scores, and instant document OCR verification.",
    "home.cta.btnLoggedIn": "Go To My Dashboard",
    "home.cta.btnLoggedOut": "LOG IN / SIGN UP NOW",
  },
  hi: {
    // Navbar
    "nav.home": "होम",
    "nav.explore": "योजनाएं खोजें",
    "nav.find": "मेरी योजना खोजें",
    "nav.simulator": "सिम्युलेटर",
    "nav.calculator": "ईएमआई कैलकुलेटर",
    "nav.partners": "पार्टनर लोकेटर",
    "nav.login": "लॉग इन / साइन अप",
    "nav.logout": "लॉग आउट",
    "nav.dashboard": "मेरा डैशबोर्ड",
    "nav.updateProfile": "प्रोफ़ाइल अपडेट करें",

    // Home Page Hero
    "home.hero.tag": "संस्थागत वित्तीय बुद्धिमत्ता",
    "home.hero.title1": "अपने ",
    "home.hero.title2": "व्यवसाय",
    "home.hero.title3": " के लिए सही सरकारी ",
    "home.hero.title4": "योजना",
    "home.hero.desc": "सहायक AI आपकी वित्तीय जरूरतों को समझता है, आपको उपयुक्त सरकारी योजनाओं से मिलाता है, और मंजूरी के लिए चरण-दर-चरण मार्गदर्शन करता है।",
    "home.hero.btnFind": "मेरी योजना खोजें",
    "home.hero.btnExplore": "सभी योजनाएं देखें",
    "home.hero.tag1": "100% मुफ्त सेवा",
    "home.hero.tag2": "सीधे सरकारी पोर्टल",
    "home.hero.tag3": "त्वरित मैच स्कोर",
    "home.cta.title": "क्या आप अपने उद्यम के लिए सरकारी पूंजी अनलॉक करने के लिए तैयार हैं?",
    "home.cta.desc": "अपनी व्यवसाय प्रोफ़ाइल पूरी करने और व्यक्तिगत योजना मिलान अनलॉक करने के लिए लॉग इन या साइन अप करें।",
    "home.cta.btnLoggedIn": "मेरे डैशबोर्ड पर जाएं",
    "home.cta.btnLoggedOut": "अभी लॉग इन / साइन अप करें",
  },
  ml: {
    // Navbar
    "nav.home": "ഹോം",
    "nav.explore": "പദ്ധതികൾ പര്യവേക്ഷണം ചെയ്യുക",
    "nav.find": "എന്റെ പദ്ധതി കണ്ടെത്തുക",
    "nav.simulator": "സിമുലേറ്റർ",
    "nav.calculator": "ഇഎംഐ കാൽക്കുലേറ്റർ",
    "nav.partners": "പാർട്ണർ ലൊക്കേറ്റർ",
    "nav.login": "ലോഗിൻ / സൈൻ അപ്പ്",
    "nav.logout": "ലോഗൗട്ട്",
    "nav.dashboard": "എന്റെ ഡാഷ്ബോർഡ്",
    "nav.updateProfile": "പ്രൊഫൈൽ അപ്ഡേറ്റ് ചെയ്യുക",

    // Home Page Hero
    "home.hero.tag": "സ്ഥാപന സാമ്പത്തിക ഇന്റലിജൻസ്",
    "home.hero.title1": "നിങ്ങളുടെ ",
    "home.hero.title2": "ബിസിനസ്സിന്",
    "home.hero.title3": " അനുയോജ്യമായ സർക്കാർ ",
    "home.hero.title4": "പദ്ധതി",
    "home.hero.desc": "സഹായക് AI നിങ്ങളുടെ സാമ്പത്തിക ആവശ്യങ്ങൾ മനസ്സിലാക്കുകയും അനുയോജ്യമായ സർക്കാർ പദ്ധതികളുമായി നിങ്ങളെ ബന്ധിപ്പിക്കുകയും ചെയ്യുന്നു.",
    "home.hero.btnFind": "എന്റെ പദ്ധതി കണ്ടെത്തുക",
    "home.hero.btnExplore": "എല്ലാ പദ്ധതികളും കാണുക",
    "home.hero.tag1": "100% സൗജന്യ സേവനം",
    "home.hero.tag2": "നേരിട്ടുള്ള സർക്കാർ പോർട്ടലുകൾ",
    "home.hero.tag3": "തൽക്ഷണ മാച്ച് സ്കോറുകൾ",
    "home.cta.title": "നിങ്ങളുടെ സംരംഭത്തിനായി സർക്കാർ മൂലധനം അൺലോക്ക് ചെയ്യാൻ തയ്യാറാണോ?",
    "home.cta.desc": "നിങ്ങളുടെ ബിസിനസ്സ് പ്രൊഫൈൽ പൂർത്തിയാക്കുന്നതിനും അനുയോജ്യമായ പദ്ധതികൾ കണ്ടെത്തുന്നതിനും ലോഗിൻ ചെയ്യുക അല്ലെങ്കിൽ സൈൻ അപ്പ് ചെയ്യുക.",
    "home.cta.btnLoggedIn": "എന്റെ ഡാഷ്ബോർഡിലേക്ക് പോകുക",
    "home.cta.btnLoggedOut": "ഇപ്പോൾ ലോഗിൻ / സൈൻ അപ്പ് ചെയ്യുക",
  }
};
