/* ---------------------------------------------------------------------------
   The Frendzo's own interface, in more than one language.

   This is separate from the multi-language feature inside the studio. That one
   is about the website a customer is buying. This one is about the shop they
   are buying it in — a shopkeeper in Nashik should be able to read the
   catalogue, the studio and the checkout in Marathi.

   How it works: the English string is the key. Components call t('...') with
   the English copy and get the current language back; any string without a
   translation simply stays in English rather than breaking.

   Adding a language is this file and nothing else: add a code to LANGS and a
   dictionary to DICT. Untranslated keys fall back automatically, so a partial
   dictionary is a perfectly valid one.

   Not translated on purpose: the admin panel (internal tool, one operator),
   and the preview iframe (that is the customer's own site, with its own
   language switcher).
--------------------------------------------------------------------------- */

  var LANGS = [
    { code: 'en', label: 'EN', native: 'English' },
    { code: 'hi', label: 'हिं', native: 'हिन्दी' },
    { code: 'mr', label: 'मरा', native: 'मराठी' },
  ];

  /* Category names and blurbs live in data/categories.json, so they arrive as
     data rather than as code. Keying off the English string means they
     translate through the same pass, with no change to the data model — edit a
     category in the admin panel and the English simply stops matching, which
     is the correct outcome for a name someone typed themselves. */
  var CATEGORIES = {
    hi: {
      'Restaurants & Cafés': 'रेस्टोरेंट और कैफ़े',
      'Show the menu, the room and the location. Built for hungry people on phones.':
        'मेन्यू, माहौल और पता दिखाइए। भूखे ग्राहक के फ़ोन के लिए बनी।',
      'Clinics & Healthcare': 'क्लिनिक और स्वास्थ्य',
      'Calm, credible sites for doctors, dentists and diagnostic centres.':
        'डॉक्टर, दंत चिकित्सक और जाँच केंद्रों के लिए शांत, भरोसेमंद साइट।',
      'Salons & Beauty': 'सैलून और ब्यूटी',
      'Price lists, portfolios and one-tap booking for salons and spas.':
        'रेट लिस्ट, काम की तस्वीरें और एक टैप में बुकिंग।',
      'Gyms & Fitness': 'जिम और फ़िटनेस',
      'Class timetables, trainer profiles and membership enquiry forms.':
        'क्लास का समय, ट्रेनर की जानकारी और मेंबरशिप पूछताछ फ़ॉर्म।',
      'Hotels & Stays': 'होटल और ठहरने की जगह',
      'Rooms, tariffs and photo galleries that make people want to book.':
        'कमरे, रेट और तस्वीरें — जो बुकिंग करवाएँ।',
      'Real Estate Agents': 'प्रॉपर्टी एजेंट',
      'Property listings with filters, floor plans and site-visit requests.':
        'प्रॉपर्टी की सूची, फ़्लोर प्लान और साइट विज़िट की माँग।',
      'Interior Designers': 'इंटीरियर डिज़ाइनर',
      'Project portfolios that put the work first and the pitch second.':
        'ऐसा पोर्टफ़ोलियो जहाँ पहले काम दिखे, बात बाद में।',
      'Coaching Classes': 'कोचिंग क्लास',
      'Courses, batch timings, faculty and admission enquiry forms.':
        'कोर्स, बैच का समय, शिक्षक और एडमिशन पूछताछ फ़ॉर्म।',
      'Local Manufacturers': 'स्थानीय निर्माता',
      'Product catalogues, capability pages and bulk-order enquiries.':
        'प्रोडक्ट कैटलॉग, क्षमता की जानकारी और थोक ऑर्डर पूछताछ।',
      'Furniture Stores': 'फ़र्नीचर की दुकानें',
      'Room-by-room catalogues with prices and showroom directions.':
        'कमरे के हिसाब से कैटलॉग, क़ीमत और शोरूम का रास्ता।',
      'Clothing Boutiques': 'कपड़ों की बुटीक',
      'Lookbooks, collections and WhatsApp ordering for local labels.':
        'लुकबुक, कलेक्शन और व्हाट्सएप पर ऑर्डर।',
      'Photographers': 'फ़ोटोग्राफ़र',
      'Gallery-led sites where the images fill the screen and load fast.':
        'तस्वीरें पूरी स्क्रीन पर, और तेज़ी से खुलें।',
      'Event Planners': 'इवेंट प्लानर',
      'Past events, packages and date-availability enquiry forms.':
        'पिछले इवेंट, पैकेज और तारीख़ की उपलब्धता का फ़ॉर्म।',
      'Lawyers & Accountants': 'वकील और अकाउंटेंट',
      'Practice areas, credentials and confidential consultation requests.':
        'काम के क्षेत्र, योग्यता और गोपनीय सलाह की माँग।',
      'Travel Agencies': 'ट्रैवल एजेंसी',
      'Tour packages, itineraries and seasonal offers with quick enquiry.':
        'टूर पैकेज, कार्यक्रम और मौसमी ऑफ़र, तुरंत पूछताछ के साथ।',
      'Contractors': 'ठेकेदार',
      'Completed projects, service areas and site-estimate requests.':
        'पूरे किए काम, सेवा क्षेत्र और अनुमान की माँग।',
      'Local Services': 'स्थानीय सेवाएँ',
      'Plumbers, electricians, tutors, cleaners — call and WhatsApp first.':
        'प्लंबर, बिजली मिस्त्री, ट्यूटर, सफ़ाई — पहले कॉल और व्हाट्सएप।',
    },
    mr: {
      'Restaurants & Cafés': 'रेस्टॉरंट आणि कॅफे',
      'Show the menu, the room and the location. Built for hungry people on phones.':
        'मेनू, जागा आणि पत्ता दाखवा. भुकेल्या ग्राहकाच्या मोबाइलसाठी बनवलेली.',
      'Clinics & Healthcare': 'क्लिनिक आणि आरोग्य',
      'Calm, credible sites for doctors, dentists and diagnostic centres.':
        'डॉक्टर, दंतवैद्य आणि तपासणी केंद्रांसाठी शांत, विश्वासार्ह साइट.',
      'Salons & Beauty': 'सलून आणि ब्यूटी',
      'Price lists, portfolios and one-tap booking for salons and spas.':
        'दरपत्रक, कामाचे फोटो आणि एका टॅपमध्ये बुकिंग.',
      'Gyms & Fitness': 'जिम आणि फिटनेस',
      'Class timetables, trainer profiles and membership enquiry forms.':
        'क्लासच्या वेळा, ट्रेनरची माहिती आणि मेंबरशिप चौकशी फॉर्म.',
      'Hotels & Stays': 'हॉटेल आणि निवास',
      'Rooms, tariffs and photo galleries that make people want to book.':
        'खोल्या, दर आणि फोटो — जे बुकिंग करायला लावतील.',
      'Real Estate Agents': 'प्रॉपर्टी एजंट',
      'Property listings with filters, floor plans and site-visit requests.':
        'प्रॉपर्टीची यादी, फ्लोअर प्लॅन आणि साइट व्हिजिटची विनंती.',
      'Interior Designers': 'इंटीरियर डिझायनर',
      'Project portfolios that put the work first and the pitch second.':
        'आधी काम दिसेल, नंतर बोलणं — असा पोर्टफोलिओ.',
      'Coaching Classes': 'कोचिंग क्लास',
      'Courses, batch timings, faculty and admission enquiry forms.':
        'कोर्स, बॅचच्या वेळा, शिक्षक आणि प्रवेश चौकशी फॉर्म.',
      'Local Manufacturers': 'स्थानिक उत्पादक',
      'Product catalogues, capability pages and bulk-order enquiries.':
        'उत्पादन कॅटलॉग, क्षमतेची माहिती आणि मोठ्या ऑर्डरची चौकशी.',
      'Furniture Stores': 'फर्निचरची दुकानं',
      'Room-by-room catalogues with prices and showroom directions.':
        'खोलीनुसार कॅटलॉग, किंमती आणि शोरूमचा रस्ता.',
      'Clothing Boutiques': 'कपड्यांची बुटीक',
      'Lookbooks, collections and WhatsApp ordering for local labels.':
        'लुकबुक, कलेक्शन आणि व्हॉट्सअ‍ॅपवर ऑर्डर.',
      'Photographers': 'फोटोग्राफर',
      'Gallery-led sites where the images fill the screen and load fast.':
        'फोटो पूर्ण स्क्रीनवर, आणि पटकन उघडणारे.',
      'Event Planners': 'इव्हेंट प्लॅनर',
      'Past events, packages and date-availability enquiry forms.':
        'झालेले कार्यक्रम, पॅकेज आणि तारीख उपलब्धतेचा फॉर्म.',
      'Lawyers & Accountants': 'वकील आणि अकाउंटंट',
      'Practice areas, credentials and confidential consultation requests.':
        'कामाची क्षेत्रं, पात्रता आणि गोपनीय सल्ल्याची विनंती.',
      'Travel Agencies': 'ट्रॅव्हल एजन्सी',
      'Tour packages, itineraries and seasonal offers with quick enquiry.':
        'टूर पॅकेज, कार्यक्रम आणि हंगामी ऑफर, पटकन चौकशीसह.',
      'Contractors': 'कंत्राटदार',
      'Completed projects, service areas and site-estimate requests.':
        'पूर्ण झालेली कामं, सेवा क्षेत्रं आणि अंदाजपत्रकाची विनंती.',
      'Local Services': 'स्थानिक सेवा',
      'Plumbers, electricians, tutors, cleaners — call and WhatsApp first.':
        'प्लंबर, इलेक्ट्रिशियन, शिकवणी, साफसफाई — आधी कॉल आणि व्हॉट्सअ‍ॅप.',
    },
  };

  /* --- dictionaries ------------------------------------------------------- */
  var DICT = {
    hi: {
      /* chrome */
      'Designs': 'डिज़ाइन',
      'How it works': 'यह कैसे काम करता है',
      'Admin': 'एडमिन',
      'Get a website': 'वेबसाइट बनवाएँ',
      '💬 Talk to us': '💬 हमसे बात करें',
      'Popular': 'लोकप्रिय',
      'Contact': 'संपर्क',
      'All demo businesses shown are fictional.': 'यहाँ दिखाए गए सभी व्यवसाय काल्पनिक हैं।',

      /* home */
      'Professional websites for local businesses.': 'स्थानीय व्यवसायों के लिए पेशेवर वेबसाइट।',
      'Explore website designs →': 'डिज़ाइन देखें →',
      'See how it works': 'देखें यह कैसे काम करता है',
      'Live in about a week': 'लगभग एक हफ़्ते में लाइव',
      '✓ Live in about a week': '✓ लगभग एक हफ़्ते में लाइव',
      '✓ Built for phones first': '✓ सबसे पहले मोबाइल के लिए बनी',
      'Built for phones first': 'सबसे पहले मोबाइल के लिए बनी',
      'Step one': 'पहला कदम',
      'Choose your business': 'अपना व्यवसाय चुनें',
      'Every category has designs written for that trade — not one template recoloured.':
        'हर श्रेणी के लिए अलग डिज़ाइन बनाए गए हैं — एक ही टेम्पलेट का रंग बदलकर नहीं।',
      'Featured': 'विशेष',
      'Designs worth opening full-screen': 'पूरी स्क्रीन पर देखने लायक डिज़ाइन',
      'Premium': 'प्रीमियम',
      '✦ Premium': '✦ प्रीमियम',
      'Our most expensive work': 'हमारा सबसे महँगा काम',
      'Hand-built rather than recoloured: bespoke layouts, custom typography and photography direction.':
        'रंग बदलकर नहीं, हाथ से बनाई गई — अलग लेआउट, अपनी टाइपोग्राफ़ी और फ़ोटोग्राफ़ी की दिशा।',
      'See all premium designs': 'सभी प्रीमियम डिज़ाइन देखें',
      '✦ Premium designs': '✦ प्रीमियम डिज़ाइन',
      'How it works': 'यह कैसे काम करता है',
      'Browse': 'देखें',
      'Choose': 'चुनें',
      'Tell us': 'हमें बताएँ',
      'Go live': 'लाइव करें',
      'Why work with us': 'हमारे साथ क्यों',
      'Small studio. You get the person who builds it, on the phone.':
        'छोटा स्टूडियो। जो बनाता है, उसी से सीधे फ़ोन पर बात।',
      'Built for phones': 'मोबाइल के लिए बनी',
      'Fast to load': 'तेज़ी से खुलती है',
      'WhatsApp built in': 'व्हाट्सएप अंदर ही',
      'Ready for Google': 'गूगल के लिए तैयार',
      'Your branding': 'आपकी अपनी ब्रांडिंग',
      'Personal support': 'निजी सहायता',
      'Pricing': 'कीमत',
      'Explore designs': 'डिज़ाइन देखें',
      'Request a quote': 'क़ीमत पूछें',

      /* catalogue */
      'All website designs': 'सभी वेबसाइट डिज़ाइन',
      'Premium website designs': 'प्रीमियम वेबसाइट डिज़ाइन',
      'The top of the catalogue — each one hand-built for its business rather than recoloured from a template. They sit in their own trade too, so you will meet them again while browsing.':
        'कैटलॉग का सबसे ऊपरी हिस्सा — हर एक अपने व्यवसाय के लिए हाथ से बनाई गई, टेम्पलेट का रंग बदलकर नहीं। ये अपनी श्रेणी में भी दिखती हैं, इसलिए ब्राउज़ करते समय दोबारा मिलेंगी।',
      'Search designs, styles, tags': 'डिज़ाइन, स्टाइल, टैग खोजें',
      'All': 'सभी',
      'Live preview': 'लाइव देखें',
      'Customise this →': 'इसे अपना बनाएँ →',
      'Common questions': 'आम सवाल',
      'Can I change the colours and photos?': 'क्या मैं रंग और फ़ोटो बदल सकता हूँ?',
      'How long does it take?': 'कितना समय लगता है?',
      'Do I need to buy a domain?': 'क्या मुझे डोमेन ख़रीदना होगा?',
      'What happens after it is live?': 'लाइव होने के बाद क्या?',
      'Clear search': 'खोज हटाएँ',
      '/ designs': '/ डिज़ाइन',
      'Every design in the catalogue, across all 17 kinds of business. Open one full-screen to see it as your customers would.':
        'कैटलॉग के सारे डिज़ाइन, सभी 17 तरह के व्यवसायों के लिए। किसी एक को पूरी स्क्रीन पर खोलकर वैसे देखिए जैसे आपका ग्राहक देखेगा।',
      'Home': 'होम',

      /* preview overlay */
      '‹ Back': '‹ वापस',
      'Desktop': 'डेस्कटॉप',
      'Mobile': 'मोबाइल',
      'Phone': 'मोबाइल',
      'Like this design?': 'यह डिज़ाइन पसंद आया?',
      'Make it yours, then see the price.': 'इसे अपना बनाइए, फिर क़ीमत देखिए।',
      'Customise this design →': 'इस डिज़ाइन को अपना बनाएँ →',
      'I want this website': 'मुझे यह वेबसाइट चाहिए',

      /* lead form */
      'Request this website': 'यह वेबसाइट माँगें',
      'Takes a minute. No payment now.': 'एक मिनट लगेगा। अभी कोई पैसा नहीं।',
      'Your name': 'आपका नाम',
      'Business name': 'व्यवसाय का नाम',
      'Phone': 'फ़ोन',
      'WhatsApp number': 'व्हाट्सएप नंबर',
      'City': 'शहर',
      'Business category': 'व्यवसाय की श्रेणी',
      'Select a category': 'श्रेणी चुनें',
      'Email': 'ईमेल',
      'Instagram': 'इंस्टाग्राम',
      'Current website, if any': 'मौजूदा वेबसाइट, अगर हो',
      'Budget': 'बजट',
      'Features you need': 'ज़रूरी सुविधाएँ',
      'Anything else we should know': 'और कुछ बताना चाहेंगे',
      'Cancel': 'रद्द करें',
      'Send request →': 'भेजें →',
      'Selected design': 'चुना हुआ डिज़ाइन',
      'Request received': 'अनुरोध मिल गया',
      '💬 Message us on WhatsApp': '💬 व्हाट्सएप पर लिखें',
      'Keep browsing designs': 'और डिज़ाइन देखें',
      'Required': 'ज़रूरी',

      /* studio — chrome */
      'Customise': 'अपना बनाएँ',
      'Plan': 'प्लान',
      'Domain': 'डोमेन',
      'Payment': 'भुगतान',
      'Free to explore': 'देखना मुफ़्त है',
      'Step 1 of 4 · nothing charged yet': 'चरण 1 / 4 · अभी कोई शुल्क नहीं',
      'Step 2 of 4 · plan': 'चरण 2 / 4 · प्लान',
      'Step 3 of 4 · domain': 'चरण 3 / 4 · डोमेन',
      'Step 4 of 4 · payment': 'चरण 4 / 4 · भुगतान',
      'Make it yours': 'इसे अपना बनाएँ',
      'Every panel below changes the preview on the right. Nothing is sent anywhere until you place the order.':
        'नीचे का हर हिस्सा दाईं ओर के प्रीव्यू को बदलता है। ऑर्डर देने तक कुछ भी कहीं नहीं भेजा जाता।',
      'Save draft': 'ड्राफ़्ट सेव करें',
      'Back to designs': 'डिज़ाइन पर वापस',
      'Continue to plans →': 'प्लान देखें →',
      'Continue to domain →': 'डोमेन चुनें →',
      'Continue to payment →': 'भुगतान पर जाएँ →',
      '← Back to customising': '← वापस बदलाव पर',
      '← Back to plans': '← वापस प्लान पर',
      '← Back to domain': '← वापस डोमेन पर',
      'Open full size ↗': 'पूरे आकार में खोलें ↗',
      'See the original design': 'मूल डिज़ाइन देखें',
      'Live preview · your content, your colours': 'लाइव प्रीव्यू · आपका कंटेंट, आपके रंग',

      /* studio — panels */
      'Your business': 'आपका व्यवसाय',
      'Name, phone, address, hours': 'नाम, फ़ोन, पता, समय',
      'Words on the page': 'पेज के शब्द',
      'Headings, about text, selling points': 'शीर्षक, परिचय, ख़ास बातें',
      'Colours & type': 'रंग और टाइपफ़ेस',
      'Accent, background, typeface, corners, layout': 'रंग, बैकग्राउंड, टाइपफ़ेस, कोने, लेआउट',
      'Your photos': 'आपकी फ़ोटो',
      'Logo, main photo, gallery': 'लोगो, मुख्य फ़ोटो, गैलरी',
      'Names, prices, descriptions': 'नाम, क़ीमत, विवरण',
      'Reviews': 'समीक्षाएँ',
      'What your customers said': 'आपके ग्राहकों ने क्या कहा',
      'Sections': 'हिस्से',
      'Turn parts of the page on and off': 'पेज के हिस्से चालू या बंद करें',
      'Languages': 'भाषाएँ',
      'Hindi, Marathi, Tamil — a switcher on your site': 'हिन्दी, मराठी, तमिल — आपकी साइट पर भाषा बटन',
      'Pages & extras': 'पेज और अतिरिक्त',
      'How big the site is, what it must do': 'साइट कितनी बड़ी, क्या-क्या करे',
      'Shop / clinic address': 'दुकान / क्लिनिक का पता',
      'Opening hours': 'खुलने का समय',
      'Your title on the page': 'पेज पर आपका पद',
      'Small line above the heading': 'शीर्षक के ऊपर छोटी लाइन',
      'Main heading': 'मुख्य शीर्षक',
      'Line under the heading': 'शीर्षक के नीचे की लाइन',
      'Button text': 'बटन का टेक्स्ट',
      'Three short selling points': 'तीन ख़ास बातें',
      'About text': 'परिचय',
      'Main colour': 'मुख्य रंग',
      'Text / dark colour': 'टेक्स्ट / गहरा रंग',
      'Background': 'बैकग्राउंड',
      'Light': 'हल्का',
      'Dark': 'गहरा',
      'White page': 'सफ़ेद पेज',
      'Dark page': 'गहरा पेज',
      'Typeface': 'टाइपफ़ेस',
      'Corners': 'कोने',
      'Sharp': 'नुकीले',
      'Soft': 'हल्के गोल',
      'Round': 'गोल',
      'Top of the page': 'पेज का ऊपरी हिस्सा',
      'Text + photo': 'टेक्स्ट + फ़ोटो',
      'Centred': 'बीच में',
      'Big photo': 'बड़ी फ़ोटो',
      'Logo': 'लोगो',
      'Main photo': 'मुख्य फ़ोटो',
      'Upload': 'अपलोड करें',
      'Replace': 'बदलें',
      'Remove': 'हटाएँ',
      'Add photos': 'फ़ोटो जोड़ें',
      '+ Add a row': '+ एक पंक्ति जोड़ें',
      '+ Add a review': '+ समीक्षा जोड़ें',
      'Name': 'नाम',
      'Their name': 'उनका नाम',
      'What they said': 'उन्होंने क्या कहा',
      'How many pages do you want?': 'कितने पेज चाहिए?',
      'Extras you want quoted': 'जिन अतिरिक्त चीज़ों की क़ीमत चाहिए',
      'Gallery': 'गैलरी',
      'About us': 'हमारे बारे में',
      'Closing band': 'आख़िरी पट्टी',
      'Visit us': 'हमारे यहाँ आएँ',

      /* studio — plan, domain, payment */
      'Extras': 'अतिरिक्त',
      'Want more than a static site?': 'स्टैटिक साइट से ज़्यादा चाहिए?',
      '💬 Ask for a custom quote': '💬 अलग से क़ीमत पूछें',
      'Your domain name': 'आपका डोमेन नाम',
      'Register a new domain': 'नया डोमेन लें',
      'We buy it and set it up': 'हम ख़रीदकर सेट कर देंगे',
      'I already have one': 'मेरे पास पहले से है',
      'We point it at the new site — no extra cost': 'उसे नई साइट से जोड़ देंगे — कोई अतिरिक्त शुल्क नहीं',
      'Name you want': 'जो नाम चाहिए',
      'Extension': 'एक्सटेंशन',
      'Availability check': 'उपलब्धता जाँचें',
      'Check on GoDaddy ↗': 'GoDaddy पर जाँचें ↗',
      'Register for': 'कितने साल के लिए',
      'Privacy': 'गोपनीयता',
      'Hosting': 'होस्टिंग',
      'Your existing domain': 'आपका मौजूदा डोमेन',
      'Suggestions from your business name': 'आपके व्यवसाय के नाम से सुझाव',
      'Confirm and place the order': 'पुष्टि करें और ऑर्डर दें',
      'What you are ordering': 'आप क्या ले रहे हैं',
      'Subtotal': 'उप-योग',
      'Total': 'कुल',
      'Balance on handover': 'सौंपते समय बाक़ी',
      'How you want to pay': 'भुगतान कैसे करेंगे',
      'UPI': 'यूपीआई',
      'Bank transfer / NEFT': 'बैंक ट्रांसफ़र / NEFT',
      'Card or netbanking': 'कार्ड या नेटबैंकिंग',
      'Decide on the call': 'कॉल पर तय करें',
      'We will call this number': 'हम इसी नंबर पर कॉल करेंगे',
      'Email for the invoice': 'बिल के लिए ईमेल',
      'Order placed': 'ऑर्डर हो गया',
      'Reference': 'संदर्भ',
      '— quote it when you pay or when you message us.': '— भुगतान करते या मैसेज करते समय यही नंबर बताइए।',
      'Business': 'बिज़नेस',
      'Design': 'डिज़ाइन',
      'Pages': 'पेज',
      'What happens next': 'आगे क्या होगा',
      'Download order summary': 'ऑर्डर का विवरण डाउनलोड करें',
      'Open my website preview ↗': 'मेरी वेबसाइट देखें ↗',
      'Back to the catalogue': 'कैटलॉग पर वापस',
      'Your project': 'आपका प्रोजेक्ट',
      'Advance now': 'अभी अग्रिम',
      '← Change the design or content': '← डिज़ाइन या कंटेंट बदलें',

      /* longer copy */
      'Pick a design you like. Tell us about your business. We put your name, photos and prices on it and get it online.':
        'पसंद का डिज़ाइन चुनिए। अपने व्यवसाय के बारे में बताइए। हम आपका नाम, फ़ोटो और क़ीमतें डालकर उसे ऑनलाइन कर देते हैं।',
      'View designs ›': 'डिज़ाइन देखें ›',
      'Open the designs for your trade and view them full-screen, exactly as a customer would.':
        'अपने काम के डिज़ाइन खोलिए और पूरी स्क्रीन पर देखिए — बिलकुल जैसे ग्राहक देखेगा।',
      "Pick the one that fits. Hit 'I want this website' — the design comes with your request.":
        'जो सही लगे वो चुनिए। ‘मुझे यह वेबसाइट चाहिए’ दबाइए — डिज़ाइन आपकी माँग के साथ चला जाता है।',
      'Name, phone, city and what you need. We call you within a working day with a quote.':
        'नाम, फ़ोन, शहर और ज़रूरत बताइए। एक कार्यदिवस में क़ीमत के साथ कॉल करेंगे।',
      'We put in your content and photos, connect your domain, and hand over the keys.':
        'आपका कंटेंट और फ़ोटो डालते हैं, डोमेन जोड़ते हैं, और चाबी आपको सौंप देते हैं।',
      'Most of your customers arrive from WhatsApp or Instagram on a small screen. That is what we design for first.':
        'आपके ज़्यादातर ग्राहक व्हाट्सएप या इंस्टाग्राम से छोटी स्क्रीन पर आते हैं। हम पहले उसी के लिए बनाते हैं।',
      'Static pages, compressed images. Works on patchy mobile data.':
        'हल्के पेज, दबी हुई तस्वीरें। कमज़ोर मोबाइल डेटा पर भी चलती है।',
      'A floating button that opens a chat with your business, pre-filled.':
        'एक बटन, जो सीधे आपके व्यवसाय से चैट खोल देता है।',
      'Titles, descriptions, business schema and a sitemap set up before launch.':
        'टाइटल, विवरण, बिज़नेस स्कीमा और साइटमैप — लॉन्च से पहले ही तैयार।',
      'Your logo, colours and photos. Not a stock template with your name pasted on.':
        'आपका लोगो, रंग और फ़ोटो। किसी टेम्पलेट पर नाम चिपकाना नहीं।',
      'Text the person who built the site. Small changes are usually same-day.':
        'जिसने साइट बनाई, उसी को मैसेज कीजिए। छोटे बदलाव अक्सर उसी दिन।',
      'The final number depends on how many pages you need and whether you want booking, payments or a catalogue. Tell us what you are after and we will send a fixed quote — no hourly billing.':
        'आख़िरी क़ीमत इस पर है कि कितने पेज चाहिए और बुकिंग, पेमेंट या कैटलॉग चाहिए या नहीं। बताइए क्या चाहिए, हम पक्की क़ीमत भेजेंगे — घंटे के हिसाब से नहीं।',
      'Yes. The design is the starting point — your logo, colours, photos and text all go in during customisation.':
        'हाँ। डिज़ाइन सिर्फ़ शुरुआत है — आपका लोगो, रंग, फ़ोटो और टेक्स्ट सब बदलाव के समय जाते हैं।',
      'Usually five to seven working days once you send us your content.':
        'कंटेंट मिलने के बाद आम तौर पर पाँच से सात कार्यदिवस।',
      'If you do not have one, we will register it for you and add the cost to the quote.':
        'अगर नहीं है तो हम आपके नाम पर ले लेंगे और उसकी क़ीमत जोड़ देंगे।',
      'You get a WhatsApp line for changes. Small edits are usually done the same day.':
        'बदलाव के लिए एक व्हाट्सएप नंबर मिलता है। छोटे बदलाव अक्सर उसी दिन।',
      'This is not a website builder. You do not drag anything. You pick a finished design and we do the rest.':
        'यह वेबसाइट बिल्डर नहीं है। कुछ खींचना-जोड़ना नहीं। आप बनी-बनाई डिज़ाइन चुनिए, बाकी हम करते हैं।',
      'You browse': 'आप देखते हैं',
      'Open your trade — restaurants, clinics, salons and fourteen more. Each design opens full-screen with real sections: menu, prices, timings, map, reviews.':
        'अपना काम खोलिए — रेस्टोरेंट, क्लिनिक, सैलून और चौदह और। हर डिज़ाइन पूरी स्क्रीन पर असली हिस्सों के साथ खुलती है: मेन्यू, क़ीमत, समय, नक्शा, रिव्यू।',
      'You choose': 'आप चुनते हैं',
      "Hit 'I want this website'. The design you picked is attached to your request automatically, so there is no confusion later about which one you meant.":
        '‘मुझे यह वेबसाइट चाहिए’ दबाइए। चुनी हुई डिज़ाइन अपने आप आपकी माँग के साथ जुड़ जाती है, ताकि बाद में कोई उलझन न रहे।',
      'We call you': 'हम आपको कॉल करते हैं',
      'Within one working day. We ask what pages you need, whether you want booking or payments, and send a fixed quote.':
        'एक कार्यदिवस के भीतर। पूछते हैं कि कौन से पेज चाहिए, बुकिंग या पेमेंट चाहिए या नहीं, और पक्की क़ीमत भेजते हैं।',
      'You send content': 'आप कंटेंट भेजते हैं',
      'Logo, photos, prices, timings. If you do not have photos, we will tell you exactly what to shoot on your phone.':
        'लोगो, फ़ोटो, क़ीमत, समय। फ़ोटो न हों तो हम बता देंगे कि फ़ोन से क्या-क्या खींचना है।',
      'We build and launch': 'हम बनाते और लाइव करते हैं',
      'Five to seven working days. We connect your domain, set up Google, and walk you through it on a call.':
        'पाँच से सात कार्यदिवस। डोमेन जोड़ते हैं, गूगल सेट करते हैं, और कॉल पर सब समझा देते हैं।',
      'We stay reachable': 'हम बाद में भी उपलब्ध रहते हैं',
      'One WhatsApp number for changes. New menu, new prices, new offer — send it across.':
        'बदलाव के लिए एक व्हाट्सएप नंबर। नया मेन्यू, नई क़ीमत, नया ऑफ़र — बस भेज दीजिए।',
    },

    mr: {
      /* chrome */
      'Designs': 'डिझाइन',
      'How it works': 'हे कसं चालतं',
      'Admin': 'अ‍ॅडमिन',
      'Get a website': 'वेबसाइट बनवा',
      '💬 Talk to us': '💬 आमच्याशी बोला',
      'Popular': 'लोकप्रिय',
      'Contact': 'संपर्क',
      'All demo businesses shown are fictional.': 'इथे दाखवलेले सर्व व्यवसाय काल्पनिक आहेत.',

      /* home */
      'Professional websites for local businesses.': 'स्थानिक व्यवसायांसाठी व्यावसायिक वेबसाइट.',
      'Explore website designs →': 'डिझाइन बघा →',
      'See how it works': 'हे कसं चालतं बघा',
      'Live in about a week': 'साधारण आठवड्यात लाइव्ह',
      '✓ Live in about a week': '✓ साधारण आठवड्यात लाइव्ह',
      '✓ Built for phones first': '✓ आधी मोबाइलसाठी बनवलेली',
      'Built for phones first': 'आधी मोबाइलसाठी बनवलेली',
      'Step one': 'पहिली पायरी',
      'Choose your business': 'तुमचा व्यवसाय निवडा',
      'Every category has designs written for that trade — not one template recoloured.':
        'प्रत्येक प्रकारासाठी वेगळी डिझाइन — एकाच टेम्पलेटचा रंग बदलून नाही.',
      'Featured': 'खास',
      'Designs worth opening full-screen': 'पूर्ण स्क्रीनवर बघण्यासारखी डिझाइन',
      'Premium': 'प्रीमियम',
      '✦ Premium': '✦ प्रीमियम',
      'Our most expensive work': 'आमचं सर्वात महागडं काम',
      'Hand-built rather than recoloured: bespoke layouts, custom typography and photography direction.':
        'रंग बदलून नाही, हाताने बनवलेली — वेगळा लेआउट, स्वतःची टायपोग्राफी आणि फोटोग्राफीची दिशा.',
      'See all premium designs': 'सर्व प्रीमियम डिझाइन बघा',
      '✦ Premium designs': '✦ प्रीमियम डिझाइन',
      'Browse': 'बघा',
      'Choose': 'निवडा',
      'Tell us': 'आम्हाला सांगा',
      'Go live': 'लाइव्ह करा',
      'Why work with us': 'आमच्यासोबत का',
      'Small studio. You get the person who builds it, on the phone.':
        'छोटा स्टुडिओ. जो बनवतो, त्याच्याशीच थेट फोनवर बोलणं.',
      'Built for phones': 'मोबाइलसाठी बनवलेली',
      'Fast to load': 'पटकन उघडते',
      'WhatsApp built in': 'व्हॉट्सअ‍ॅप आतच',
      'Ready for Google': 'गूगलसाठी तयार',
      'Your branding': 'तुमचं स्वतःचं ब्रँडिंग',
      'Personal support': 'वैयक्तिक मदत',
      'Pricing': 'किंमत',
      'Explore designs': 'डिझाइन बघा',
      'Request a quote': 'किंमत विचारा',

      /* catalogue */
      'All website designs': 'सर्व वेबसाइट डिझाइन',
      'Premium website designs': 'प्रीमियम वेबसाइट डिझाइन',
      'The top of the catalogue — each one hand-built for its business rather than recoloured from a template. They sit in their own trade too, so you will meet them again while browsing.':
        'कॅटलॉगचा सर्वात वरचा भाग — प्रत्येक डिझाइन त्या व्यवसायासाठी हाताने बनवलेली, टेम्पलेटचा रंग बदलून नाही. ती त्यांच्या स्वतःच्या प्रकारातही दिसतात, त्यामुळे बघताना पुन्हा भेटतील.',
      'Search designs, styles, tags': 'डिझाइन, स्टाइल, टॅग शोधा',
      'All': 'सर्व',
      'Live preview': 'लाइव्ह बघा',
      'Customise this →': 'हे तुमचं बनवा →',
      'Common questions': 'नेहमीचे प्रश्न',
      'Can I change the colours and photos?': 'रंग आणि फोटो बदलता येतील का?',
      'How long does it take?': 'किती वेळ लागतो?',
      'Do I need to buy a domain?': 'डोमेन घ्यावं लागेल का?',
      'What happens after it is live?': 'लाइव्ह झाल्यावर पुढे काय?',
      'Clear search': 'शोध काढा',
      '/ designs': '/ डिझाइन',
      'Every design in the catalogue, across all 17 kinds of business. Open one full-screen to see it as your customers would.':
        'कॅटलॉगमधली सर्व डिझाइन, सर्व 17 प्रकारच्या व्यवसायांसाठी. एक पूर्ण स्क्रीनवर उघडून तुमचा ग्राहक जशी बघेल तशी बघा.',
      'Home': 'होम',

      /* preview overlay */
      '‹ Back': '‹ मागे',
      'Desktop': 'डेस्कटॉप',
      'Mobile': 'मोबाइल',
      'Phone': 'मोबाइल',
      'Like this design?': 'ही डिझाइन आवडली?',
      'Make it yours, then see the price.': 'ती तुमची बनवा, मग किंमत बघा.',
      'Customise this design →': 'ही डिझाइन तुमची बनवा →',
      'I want this website': 'मला ही वेबसाइट हवी',

      /* lead form */
      'Request this website': 'ही वेबसाइट मागवा',
      'Takes a minute. No payment now.': 'एक मिनिट लागेल. आत्ता पैसे नाहीत.',
      'Your name': 'तुमचं नाव',
      'Business name': 'व्यवसायाचं नाव',
      'Phone': 'फोन',
      'WhatsApp number': 'व्हॉट्सअ‍ॅप नंबर',
      'City': 'शहर',
      'Business category': 'व्यवसायाचा प्रकार',
      'Select a category': 'प्रकार निवडा',
      'Email': 'ईमेल',
      'Instagram': 'इन्स्टाग्राम',
      'Current website, if any': 'सध्याची वेबसाइट, असल्यास',
      'Budget': 'बजेट',
      'Features you need': 'लागणाऱ्या सुविधा',
      'Anything else we should know': 'आणखी काही सांगायचं आहे का',
      'Cancel': 'रद्द करा',
      'Send request →': 'पाठवा →',
      'Selected design': 'निवडलेली डिझाइन',
      'Request received': 'विनंती मिळाली',
      '💬 Message us on WhatsApp': '💬 व्हॉट्सअ‍ॅपवर मेसेज करा',
      'Keep browsing designs': 'आणखी डिझाइन बघा',
      'Required': 'आवश्यक',

      /* studio — chrome */
      'Customise': 'तुमचं बनवा',
      'Plan': 'प्लॅन',
      'Domain': 'डोमेन',
      'Payment': 'पेमेंट',
      'Free to explore': 'बघायला मोफत',
      'Step 1 of 4 · nothing charged yet': 'पायरी 1 / 4 · आत्ता कोणतंही शुल्क नाही',
      'Step 2 of 4 · plan': 'पायरी 2 / 4 · प्लॅन',
      'Step 3 of 4 · domain': 'पायरी 3 / 4 · डोमेन',
      'Step 4 of 4 · payment': 'पायरी 4 / 4 · पेमेंट',
      'Make it yours': 'हे तुमचं बनवा',
      'Every panel below changes the preview on the right. Nothing is sent anywhere until you place the order.':
        'खालचा प्रत्येक भाग उजवीकडचं प्रिव्ह्यू बदलतो. ऑर्डर देईपर्यंत काहीही कुठे पाठवलं जात नाही.',
      'Save draft': 'ड्राफ्ट सेव्ह करा',
      'Back to designs': 'डिझाइनकडे परत',
      'Continue to plans →': 'प्लॅन बघा →',
      'Continue to domain →': 'डोमेन निवडा →',
      'Continue to payment →': 'पेमेंटकडे जा →',
      '← Back to customising': '← बदलांकडे परत',
      '← Back to plans': '← प्लॅनकडे परत',
      '← Back to domain': '← डोमेनकडे परत',
      'Open full size ↗': 'पूर्ण आकारात उघडा ↗',
      'See the original design': 'मूळ डिझाइन बघा',
      'Live preview · your content, your colours': 'लाइव्ह प्रिव्ह्यू · तुमचा मजकूर, तुमचे रंग',

      /* studio — panels */
      'Your business': 'तुमचा व्यवसाय',
      'Name, phone, address, hours': 'नाव, फोन, पत्ता, वेळ',
      'Words on the page': 'पानावरचे शब्द',
      'Headings, about text, selling points': 'शीर्षकं, माहिती, खास मुद्दे',
      'Colours & type': 'रंग आणि टाइपफेस',
      'Accent, background, typeface, corners, layout': 'रंग, बॅकग्राउंड, टाइपफेस, कोपरे, मांडणी',
      'Your photos': 'तुमचे फोटो',
      'Logo, main photo, gallery': 'लोगो, मुख्य फोटो, गॅलरी',
      'Names, prices, descriptions': 'नावं, किंमती, माहिती',
      'Reviews': 'अभिप्राय',
      'What your customers said': 'तुमचे ग्राहक काय म्हणाले',
      'Sections': 'भाग',
      'Turn parts of the page on and off': 'पानाचे भाग चालू-बंद करा',
      'Languages': 'भाषा',
      'Hindi, Marathi, Tamil — a switcher on your site': 'हिंदी, मराठी, तमिळ — तुमच्या साइटवर भाषा बटण',
      'Pages & extras': 'पानं आणि जास्तीचं',
      'How big the site is, what it must do': 'साइट किती मोठी, तिने काय करावं',
      'Shop / clinic address': 'दुकान / क्लिनिकचा पत्ता',
      'Opening hours': 'उघडण्याची वेळ',
      'Your title on the page': 'पानावर तुमचं पद',
      'Small line above the heading': 'शीर्षकावरची छोटी ओळ',
      'Main heading': 'मुख्य शीर्षक',
      'Line under the heading': 'शीर्षकाखालची ओळ',
      'Button text': 'बटणावरचा मजकूर',
      'Three short selling points': 'तीन खास मुद्दे',
      'About text': 'माहिती',
      'Main colour': 'मुख्य रंग',
      'Text / dark colour': 'मजकूर / गडद रंग',
      'Background': 'बॅकग्राउंड',
      'Light': 'फिकट',
      'Dark': 'गडद',
      'White page': 'पांढरं पान',
      'Dark page': 'गडद पान',
      'Typeface': 'टाइपफेस',
      'Corners': 'कोपरे',
      'Sharp': 'टोकदार',
      'Soft': 'थोडे गोल',
      'Round': 'गोल',
      'Top of the page': 'पानाचा वरचा भाग',
      'Text + photo': 'मजकूर + फोटो',
      'Centred': 'मधोमध',
      'Big photo': 'मोठा फोटो',
      'Logo': 'लोगो',
      'Main photo': 'मुख्य फोटो',
      'Upload': 'अपलोड करा',
      'Replace': 'बदला',
      'Remove': 'काढा',
      'Add photos': 'फोटो जोडा',
      '+ Add a row': '+ एक ओळ जोडा',
      '+ Add a review': '+ अभिप्राय जोडा',
      'Name': 'नाव',
      'Their name': 'त्यांचं नाव',
      'What they said': 'ते काय म्हणाले',
      'How many pages do you want?': 'किती पानं हवीत?',
      'Extras you want quoted': 'ज्याची किंमत हवी ती जास्तीची कामं',
      'Gallery': 'गॅलरी',
      'About us': 'आमच्याविषयी',
      'Closing band': 'शेवटची पट्टी',
      'Visit us': 'आमच्याकडे या',

      /* studio — plan, domain, payment */
      'Extras': 'जास्तीचं',
      'Want more than a static site?': 'स्टॅटिक साइटपेक्षा जास्त हवंय?',
      '💬 Ask for a custom quote': '💬 वेगळी किंमत विचारा',
      'Your domain name': 'तुमचं डोमेन नाव',
      'Register a new domain': 'नवीन डोमेन घ्या',
      'We buy it and set it up': 'आम्ही घेऊन सेट करून देतो',
      'I already have one': 'माझ्याकडे आधीच आहे',
      'We point it at the new site — no extra cost': 'ते नव्या साइटला जोडतो — जास्तीचा खर्च नाही',
      'Name you want': 'हवं असलेलं नाव',
      'Extension': 'एक्सटेन्शन',
      'Availability check': 'उपलब्धता तपासा',
      'Check on GoDaddy ↗': 'GoDaddy वर तपासा ↗',
      'Register for': 'किती वर्षांसाठी',
      'Privacy': 'गोपनीयता',
      'Hosting': 'होस्टिंग',
      'Your existing domain': 'तुमचं सध्याचं डोमेन',
      'Suggestions from your business name': 'तुमच्या व्यवसायाच्या नावावरून सुचवलेली',
      'Confirm and place the order': 'खात्री करा आणि ऑर्डर द्या',
      'What you are ordering': 'तुम्ही काय घेताय',
      'Subtotal': 'उप-बेरीज',
      'Total': 'एकूण',
      'Balance on handover': 'सुपूर्द करताना उरलेले',
      'How you want to pay': 'पैसे कसे द्याल',
      'UPI': 'यूपीआय',
      'Bank transfer / NEFT': 'बँक ट्रान्सफर / NEFT',
      'Card or netbanking': 'कार्ड किंवा नेटबँकिंग',
      'Decide on the call': 'कॉलवर ठरवा',
      'We will call this number': 'आम्ही याच नंबरवर कॉल करू',
      'Email for the invoice': 'बिलासाठी ईमेल',
      'Order placed': 'ऑर्डर झाली',
      'Reference': 'संदर्भ',
      '— quote it when you pay or when you message us.': '— पैसे देताना किंवा मेसेज करताना हाच क्रमांक सांगा.',
      'Business': 'बिझनेस',
      'Design': 'डिझाइन',
      'Pages': 'पानं',
      'What happens next': 'पुढे काय होईल',
      'Download order summary': 'ऑर्डरचा तपशील डाउनलोड करा',
      'Open my website preview ↗': 'माझी वेबसाइट बघा ↗',
      'Back to the catalogue': 'कॅटलॉगकडे परत',
      'Your project': 'तुमचा प्रोजेक्ट',
      'Advance now': 'आत्ता आगाऊ',
      '← Change the design or content': '← डिझाइन किंवा मजकूर बदला',

      /* longer copy */
      'Pick a design you like. Tell us about your business. We put your name, photos and prices on it and get it online.':
        'आवडेल ती डिझाइन निवडा. तुमच्या व्यवसायाबद्दल सांगा. आम्ही तुमचं नाव, फोटो आणि किंमती टाकून ती ऑनलाइन करतो.',
      'View designs ›': 'डिझाइन बघा ›',
      'Open the designs for your trade and view them full-screen, exactly as a customer would.':
        'तुमच्या कामाच्या डिझाइन उघडा आणि पूर्ण स्क्रीनवर बघा — अगदी ग्राहकासारखं.',
      "Pick the one that fits. Hit 'I want this website' — the design comes with your request.":
        'जी योग्य वाटेल ती निवडा. ‘मला ही वेबसाइट हवी’ दाबा — डिझाइन तुमच्या विनंतीसोबत जाते.',
      'Name, phone, city and what you need. We call you within a working day with a quote.':
        'नाव, फोन, शहर आणि गरज सांगा. एका कामाच्या दिवसात किंमतीसह फोन करतो.',
      'We put in your content and photos, connect your domain, and hand over the keys.':
        'तुमचा मजकूर आणि फोटो टाकतो, डोमेन जोडतो, आणि चावी तुमच्या हातात देतो.',
      'Most of your customers arrive from WhatsApp or Instagram on a small screen. That is what we design for first.':
        'तुमचे बहुतेक ग्राहक व्हॉट्सअ‍ॅप किंवा इन्स्टाग्रामवरून छोट्या स्क्रीनवर येतात. आम्ही आधी त्यासाठीच बनवतो.',
      'Static pages, compressed images. Works on patchy mobile data.':
        'हलकी पानं, दाबलेले फोटो. कमकुवत मोबाइल डेटावरही चालते.',
      'A floating button that opens a chat with your business, pre-filled.':
        'एक बटण, जे थेट तुमच्या व्यवसायाशी चॅट उघडतं.',
      'Titles, descriptions, business schema and a sitemap set up before launch.':
        'टायटल, वर्णन, बिझनेस स्कीमा आणि साइटमॅप — लाँचच्या आधीच तयार.',
      'Your logo, colours and photos. Not a stock template with your name pasted on.':
        'तुमचा लोगो, रंग आणि फोटो. टेम्पलेटवर नाव चिकटवणं नाही.',
      'Text the person who built the site. Small changes are usually same-day.':
        'ज्याने साइट बनवली त्यालाच मेसेज करा. छोटे बदल बहुधा त्याच दिवशी.',
      'The final number depends on how many pages you need and whether you want booking, payments or a catalogue. Tell us what you are after and we will send a fixed quote — no hourly billing.':
        'शेवटची किंमत किती पानं लागतील आणि बुकिंग, पेमेंट किंवा कॅटलॉग हवं का यावर ठरते. काय हवंय ते सांगा, आम्ही ठरलेली किंमत पाठवतो — तासाच्या हिशोबाने नाही.',
      'Yes. The design is the starting point — your logo, colours, photos and text all go in during customisation.':
        'हो. डिझाइन ही फक्त सुरुवात — तुमचा लोगो, रंग, फोटो आणि मजकूर बदल करताना जातात.',
      'Usually five to seven working days once you send us your content.':
        'मजकूर मिळाल्यावर साधारण पाच ते सात कामाचे दिवस.',
      'If you do not have one, we will register it for you and add the cost to the quote.':
        'नसेल तर आम्ही तुमच्या नावावर घेतो आणि त्याची किंमत जोडतो.',
      'You get a WhatsApp line for changes. Small edits are usually done the same day.':
        'बदलांसाठी एक व्हॉट्सअ‍ॅप नंबर मिळतो. छोटे बदल बहुधा त्याच दिवशी.',
      'This is not a website builder. You do not drag anything. You pick a finished design and we do the rest.':
        'हा वेबसाइट बिल्डर नाही. काही ओढाओढ नाही. तुम्ही तयार डिझाइन निवडा, बाकी आम्ही करतो.',
      'You browse': 'तुम्ही बघता',
      'Open your trade — restaurants, clinics, salons and fourteen more. Each design opens full-screen with real sections: menu, prices, timings, map, reviews.':
        'तुमचं काम उघडा — रेस्टॉरंट, क्लिनिक, सलून आणि आणखी चौदा. प्रत्येक डिझाइन पूर्ण स्क्रीनवर खऱ्या भागांसह उघडते: मेनू, किंमती, वेळा, नकाशा, अभिप्राय.',
      'You choose': 'तुम्ही निवडता',
      "Hit 'I want this website'. The design you picked is attached to your request automatically, so there is no confusion later about which one you meant.":
        '‘मला ही वेबसाइट हवी’ दाबा. निवडलेली डिझाइन आपोआप तुमच्या विनंतीसोबत जोडली जाते, म्हणजे नंतर गोंधळ राहत नाही.',
      'We call you': 'आम्ही तुम्हाला फोन करतो',
      'Within one working day. We ask what pages you need, whether you want booking or payments, and send a fixed quote.':
        'एका कामाच्या दिवसात. कोणती पानं हवीत, बुकिंग किंवा पेमेंट हवं का विचारतो, आणि ठरलेली किंमत पाठवतो.',
      'You send content': 'तुम्ही मजकूर पाठवता',
      'Logo, photos, prices, timings. If you do not have photos, we will tell you exactly what to shoot on your phone.':
        'लोगो, फोटो, किंमती, वेळा. फोटो नसतील तर मोबाइलवर नेमकं काय काढायचं ते सांगतो.',
      'We build and launch': 'आम्ही बनवतो आणि लाइव्ह करतो',
      'Five to seven working days. We connect your domain, set up Google, and walk you through it on a call.':
        'पाच ते सात कामाचे दिवस. डोमेन जोडतो, गूगल सेट करतो, आणि कॉलवर सगळं समजावून सांगतो.',
      'We stay reachable': 'आम्ही नंतरही उपलब्ध राहतो',
      'One WhatsApp number for changes. New menu, new prices, new offer — send it across.':
        'बदलांसाठी एकच व्हॉट्सअ‍ॅप नंबर. नवा मेनू, नव्या किंमती, नवी ऑफर — पाठवून द्या.',
    },
  };

  /* Plans, add-ons, hosting and domain notes are seeded into settings.json and
     editable in the admin panel. They are translated here for the same reason
     as the categories: this is the screen where the money is discussed, and it
     is the last place a customer should have to guess. */
  var COMMERCE = {
    hi: {
      /* plans */
      'Starter': 'स्टार्टर',
      'Business': 'बिज़नेस',
      'Premium': 'प्रीमियम',
      'Starter plan': 'स्टार्टर प्लान',
      'Business plan': 'बिज़नेस प्लान',
      'Premium plan': 'प्रीमियम प्लान',
      'Choose Starter': 'स्टार्टर चुनें',
      'Choose Business': 'बिज़नेस चुनें',
      'Choose Premium': 'प्रीमियम चुनें',
      '✓ Selected': '✓ चुना गया',
      'Most picked': 'सबसे ज़्यादा चुना गया',
      '3–4 working days · up to 1 page': '3–4 कार्यदिवस · 1 पेज तक',
      '5–7 working days · up to 5 pages': '5–7 कार्यदिवस · 5 पेज तक',
      '8–12 working days · up to 10 pages': '8–12 कार्यदिवस · 10 पेज तक',
      'One long scrolling page. Enough for most shops, salons and small clinics.':
        'एक लंबा स्क्रॉल वाला पेज। ज़्यादातर दुकानों, सैलून और छोटे क्लिनिक के लिए काफ़ी।',
      'Separate pages for services, gallery and contact. The usual pick.':
        'सेवाओं, गैलरी और संपर्क के लिए अलग पेज। आम तौर पर यही चुना जाता है।',
      'For bigger catalogues, multi-branch businesses and heavier content.':
        'बड़े कैटलॉग, कई शाखाओं और ज़्यादा कंटेंट के लिए।',
      'One page, every section': 'एक पेज, सारे हिस्से',
      'Your photos and prices': 'आपकी फ़ोटो और क़ीमतें',
      'WhatsApp + call buttons': 'व्हाट्सएप + कॉल बटन',
      'Google Maps embed': 'गूगल मैप',
      'Mobile first': 'पहले मोबाइल',
      'Free SSL': 'मुफ़्त SSL',
      '1 round of changes': 'बदलाव का 1 दौर',
      'Up to 5 pages': '5 पेज तक',
      'Enquiry forms to your email': 'पूछताछ फ़ॉर्म सीधे आपके ईमेल पर',
      'Gallery with your photos': 'आपकी फ़ोटो की गैलरी',
      'Google Business + search setup': 'गूगल बिज़नेस + सर्च सेटअप',
      'Speed and SEO basics': 'स्पीड और SEO की बुनियाद',
      '3 rounds of changes': 'बदलाव के 3 दौर',
      '30 days support': '30 दिन सहायता',
      'Up to 10 pages': '10 पेज तक',
      'Catalogue or menu system': 'कैटलॉग या मेन्यू सिस्टम',
      'Multi-branch / multi-location': 'कई शाखाएँ / कई जगहें',
      'Blog or offers section': 'ब्लॉग या ऑफ़र सेक्शन',
      'Analytics dashboard set up': 'एनालिटिक्स डैशबोर्ड सेट',
      'Unlimited rounds for 2 weeks': '2 हफ़्ते तक असीमित बदलाव',
      '90 days support': '90 दिन सहायता',
      'Ticked here, itemised at checkout. Change your mind on the call and we re-issue the quote.':
        'यहाँ चुनिए, भुगतान पर अलग-अलग दिखेगा। कॉल पर मन बदले तो नई क़ीमत भेज देंगे।',

      /* add-ons */
      'Online booking / appointments': 'ऑनलाइन बुकिंग / अपॉइंटमेंट',
      'Slots, confirmation on WhatsApp': 'स्लॉट, व्हाट्सएप पर पुष्टि',
      'Online payments': 'ऑनलाइन भुगतान',
      'UPI, cards, netbanking': 'यूपीआई, कार्ड, नेटबैंकिंग',
      'Product / menu catalogue': 'प्रोडक्ट / मेन्यू कैटलॉग',
      'Up to 60 items': '60 चीज़ों तक',
      'Full online shop': 'पूरी ऑनलाइन दुकान',
      'Cart, orders, stock — up to 50 products': 'कार्ट, ऑर्डर, स्टॉक — 50 प्रोडक्ट तक',
      'Customer login area': 'ग्राहक लॉगिन',
      'Accounts, order history': 'अकाउंट, पुराने ऑर्डर',
      'Blog / offers you can update': 'ब्लॉग / ऑफ़र जो आप ख़ुद बदलें',
      'You post, no code': 'आप डालिए, कोडिंग नहीं',
      'Logo design': 'लोगो डिज़ाइन',
      '3 options, source files': '3 विकल्प, सोर्स फ़ाइल',
      'Photo shoot, half day': 'फ़ोटो शूट, आधा दिन',
      'Pune / Mumbai only': 'सिर्फ़ पुणे / मुंबई',
      'Google Business profile setup': 'गूगल बिज़नेस प्रोफ़ाइल सेटअप',
      'Maps, hours, photos, reviews link': 'मैप, समय, फ़ोटो, रिव्यू लिंक',

      /* hosting + domain notes */
      'I will arrange hosting myself': 'होस्टिंग मैं ख़ुद ले लूँगा',
      'Hosting + SSL + email, 1 year': 'होस्टिंग + SSL + ईमेल, 1 साल',
      'Hosting + SSL + email, 2 years': 'होस्टिंग + SSL + ईमेल, 2 साल',
      'No charge from us': 'हमारी ओर से कोई शुल्क नहीं',
      'Where the site actually lives. Skip it if you already pay for hosting somewhere.':
        'साइट असल में कहाँ रहेगी। कहीं और होस्टिंग है तो छोड़ दीजिए।',
      'Most trusted': 'सबसे भरोसेमंद',
      'India': 'भारत',
      'India, business': 'भारत, व्यवसाय',
      'Retail': 'दुकान',
      'Trusts, NGOs': 'ट्रस्ट, एनजीओ',
      'Cheap first year': 'पहला साल सस्ता',
      'This is the address people type. We register it in your name — you own it, we only manage it.':
        'यही पता लोग टाइप करेंगे। हम इसे आपके नाम पर लेते हैं — मालिक आप, हम सिर्फ़ देखभाल करते हैं।',
      'Letters and numbers only, no spaces. Shorter is better — people will say it over the phone.':
        'सिर्फ़ अक्षर और अंक, बिना स्पेस। छोटा बेहतर — लोग इसे फ़ोन पर बोलेंगे।',

      /* payment */
      'Everything you picked, added up once.': 'जो चुना, सब एक बार में जोड़ा हुआ।',
      'Card or netbanking': 'कार्ड या नेटबैंकिंग',
      'We send a payment link, valid 48 hours': 'भुगतान लिंक भेजेंगे, 48 घंटे तक चलेगा',
      'We email the account details and a GST invoice': 'खाते की जानकारी और जीएसटी बिल ईमेल करेंगे',
      'Nothing now. We confirm the scope first, then invoice': 'अभी कुछ नहीं। पहले काम तय, फिर बिल',
    },

    mr: {
      /* plans */
      'Starter': 'स्टार्टर',
      'Business': 'बिझनेस',
      'Premium': 'प्रीमियम',
      'Starter plan': 'स्टार्टर प्लॅन',
      'Business plan': 'बिझनेस प्लॅन',
      'Premium plan': 'प्रीमियम प्लॅन',
      'Choose Starter': 'स्टार्टर निवडा',
      'Choose Business': 'बिझनेस निवडा',
      'Choose Premium': 'प्रीमियम निवडा',
      '✓ Selected': '✓ निवडलं',
      'Most picked': 'सर्वात जास्त निवडलं जाणारं',
      '3–4 working days · up to 1 page': '3–4 कामाचे दिवस · 1 पानापर्यंत',
      '5–7 working days · up to 5 pages': '5–7 कामाचे दिवस · 5 पानांपर्यंत',
      '8–12 working days · up to 10 pages': '8–12 कामाचे दिवस · 10 पानांपर्यंत',
      'One long scrolling page. Enough for most shops, salons and small clinics.':
        'एकच लांब स्क्रोल होणारं पान. बहुतेक दुकानं, सलून आणि छोट्या क्लिनिकसाठी पुरेसं.',
      'Separate pages for services, gallery and contact. The usual pick.':
        'सेवा, गॅलरी आणि संपर्कासाठी वेगळी पानं. बहुतेकजण हेच निवडतात.',
      'For bigger catalogues, multi-branch businesses and heavier content.':
        'मोठे कॅटलॉग, अनेक शाखा आणि जास्त मजकुरासाठी.',
      'One page, every section': 'एक पान, सर्व भाग',
      'Your photos and prices': 'तुमचे फोटो आणि किंमती',
      'WhatsApp + call buttons': 'व्हॉट्सअ‍ॅप + कॉल बटणं',
      'Google Maps embed': 'गूगल मॅप',
      'Mobile first': 'आधी मोबाइल',
      'Free SSL': 'मोफत SSL',
      '1 round of changes': 'बदलांची 1 फेरी',
      'Up to 5 pages': '5 पानांपर्यंत',
      'Enquiry forms to your email': 'चौकशी फॉर्म थेट तुमच्या ईमेलवर',
      'Gallery with your photos': 'तुमच्या फोटोंची गॅलरी',
      'Google Business + search setup': 'गूगल बिझनेस + सर्च सेटअप',
      'Speed and SEO basics': 'वेग आणि SEO ची मूलतत्त्वं',
      '3 rounds of changes': 'बदलांच्या 3 फेऱ्या',
      '30 days support': '30 दिवस मदत',
      'Up to 10 pages': '10 पानांपर्यंत',
      'Catalogue or menu system': 'कॅटलॉग किंवा मेनू सिस्टम',
      'Multi-branch / multi-location': 'अनेक शाखा / अनेक ठिकाणं',
      'Blog or offers section': 'ब्लॉग किंवा ऑफर विभाग',
      'Analytics dashboard set up': 'अ‍ॅनालिटिक्स डॅशबोर्ड लावून देतो',
      'Unlimited rounds for 2 weeks': '2 आठवडे अमर्याद बदल',
      '90 days support': '90 दिवस मदत',
      'Ticked here, itemised at checkout. Change your mind on the call and we re-issue the quote.':
        'इथे निवडा, पेमेंटला वेगवेगळं दिसेल. कॉलवर विचार बदलला तर नवी किंमत पाठवतो.',

      /* add-ons */
      'Online booking / appointments': 'ऑनलाइन बुकिंग / अपॉइंटमेंट',
      'Slots, confirmation on WhatsApp': 'स्लॉट, व्हॉट्सअ‍ॅपवर खात्री',
      'Online payments': 'ऑनलाइन पेमेंट',
      'UPI, cards, netbanking': 'यूपीआय, कार्ड, नेटबँकिंग',
      'Product / menu catalogue': 'प्रॉडक्ट / मेनू कॅटलॉग',
      'Up to 60 items': '60 वस्तूंपर्यंत',
      'Full online shop': 'पूर्ण ऑनलाइन दुकान',
      'Cart, orders, stock — up to 50 products': 'कार्ट, ऑर्डर, स्टॉक — 50 प्रॉडक्टपर्यंत',
      'Customer login area': 'ग्राहक लॉगिन',
      'Accounts, order history': 'खातं, जुन्या ऑर्डर',
      'Blog / offers you can update': 'ब्लॉग / ऑफर तुम्हीच बदला',
      'You post, no code': 'तुम्ही टाका, कोडिंग नाही',
      'Logo design': 'लोगो डिझाइन',
      '3 options, source files': '3 पर्याय, सोर्स फाइल',
      'Photo shoot, half day': 'फोटो शूट, अर्धा दिवस',
      'Pune / Mumbai only': 'फक्त पुणे / मुंबई',
      'Google Business profile setup': 'गूगल बिझनेस प्रोफाइल सेटअप',
      'Maps, hours, photos, reviews link': 'मॅप, वेळा, फोटो, रिव्ह्यू लिंक',

      /* hosting + domain notes */
      'I will arrange hosting myself': 'होस्टिंग मी स्वतः घेईन',
      'Hosting + SSL + email, 1 year': 'होस्टिंग + SSL + ईमेल, 1 वर्ष',
      'Hosting + SSL + email, 2 years': 'होस्टिंग + SSL + ईमेल, 2 वर्षं',
      'No charge from us': 'आमच्याकडून काही शुल्क नाही',
      'Where the site actually lives. Skip it if you already pay for hosting somewhere.':
        'साइट प्रत्यक्षात कुठे राहते. दुसरीकडे होस्टिंग असेल तर हे सोडा.',
      'Most trusted': 'सर्वात विश्वासार्ह',
      'India': 'भारत',
      'India, business': 'भारत, व्यवसाय',
      'Retail': 'दुकान',
      'Trusts, NGOs': 'ट्रस्ट, एनजीओ',
      'Cheap first year': 'पहिलं वर्ष स्वस्त',
      'This is the address people type. We register it in your name — you own it, we only manage it.':
        'हाच पत्ता लोक टाइप करतात. आम्ही तो तुमच्या नावावर घेतो — मालक तुम्ही, आम्ही फक्त सांभाळतो.',
      'Letters and numbers only, no spaces. Shorter is better — people will say it over the phone.':
        'फक्त अक्षरं आणि आकडे, स्पेस नाही. छोटं बरं — लोक ते फोनवर सांगतील.',

      /* payment */
      'Everything you picked, added up once.': 'तुम्ही निवडलेलं सगळं, एकदाच बेरीज करून.',
      'Card or netbanking': 'कार्ड किंवा नेटबँकिंग',
      'We send a payment link, valid 48 hours': 'पेमेंट लिंक पाठवतो, 48 तास चालेल',
      'We email the account details and a GST invoice': 'खात्याची माहिती आणि जीएसटी बिल ईमेल करतो',
      'Nothing now. We confirm the scope first, then invoice': 'आत्ता काही नाही. आधी काम ठरवतो, मग बिल',
    },
  };

  /* The landing scenes brought a page of new copy with them — the stage, the
     turning box, the pinned steps, the labels tucked into the corners. Left in
     English they would have been the one part of the site that ignored the
     language switch, which is worse than not having translated them at all: it
     reads as the shop's own marketing being the bit nobody bothered with. */
  var LANDING = {
    hi: {
      'Brand direction': 'ब्रांड दिशा',
      'Formation': 'रचना',
      'Ready-made designs': 'बने-बनाए डिज़ाइन',
      'Your photos and words': 'आपकी तस्वीरें और शब्द',
      'Domain and hosting': 'डोमेन और होस्टिंग',
      'Live in about a week': 'लगभग एक हफ़्ते में लाइव',
      'Scroll to see the catalogue': 'कैटलॉग देखने के लिए स्क्रॉल करें',
      'Explore website designs →': 'वेबसाइट डिज़ाइन देखें →',
      'See how it works': 'यह कैसे काम करता है, देखें',
      'The catalogue': 'कैटलॉग',
      'Fifty-one designs, turned to the light': 'इक्यावन डिज़ाइन, रोशनी में घुमाकर',
      'Every face of this is a real design from the catalogue — not a mockup drawn for the homepage. Click it and the one facing you opens full-screen, exactly as your customer would see it on their phone.':
        'इसका हर हिस्सा कैटलॉग का असली डिज़ाइन है — होमपेज के लिए बनाया गया नमूना नहीं। क्लिक कीजिए और सामने वाला डिज़ाइन पूरे स्क्रीन पर खुलेगा, ठीक वैसे ही जैसे आपका ग्राहक अपने फ़ोन पर देखेगा।',
      'Open the catalogue →': 'कैटलॉग खोलें →',
      'How it works': 'यह कैसे काम करता है',
      'Four steps, and one of them is ours': 'चार क़दम, जिनमें एक हमारा है',
      'Pick a design': 'डिज़ाइन चुनिए',
      'Open the designs written for your trade and view them full-screen, on a phone if you like. Nothing is a placeholder — what you see is what gets built.':
        'अपने काम के लिए बने डिज़ाइन खोलिए और पूरे स्क्रीन पर देखिए, चाहें तो फ़ोन पर। कुछ भी नमूना नहीं है — जो दिख रहा है वही बनेगा।',
      'Make it yours': 'इसे अपना बनाइए',
      'Your name, your words, your photos, your colours. The studio previews it live as you type, so you approve a real page rather than a promise.':
        'आपका नाम, आपके शब्द, आपकी तस्वीरें, आपके रंग। लिखते ही स्टूडियो सामने दिखाता रहता है, तो आप वादे को नहीं, असली पेज को मंज़ूरी देते हैं।',
      'Choose a plan': 'प्लान चुनिए',
      'One page or ten, extra languages, a domain and hosting if you need them. The price adds up in front of you before you commit to anything.':
        'एक पेज या दस, और भाषाएँ, ज़रूरत हो तो डोमेन और होस्टिंग। कुछ भी तय करने से पहले क़ीमत आपके सामने जुड़ती जाती है।',
      'Go live': 'लाइव कीजिए',
      'We put your content in, connect the domain, set up Google, and hand over the keys. Usually inside a week, with one number to text afterwards.':
        'हम आपका कंटेंट डालते हैं, डोमेन जोड़ते हैं, गूगल सेट करते हैं, और चाबियाँ सौंप देते हैं। आम तौर पर एक हफ़्ते में, और बाद के लिए एक नंबर।',
      'Step one': 'पहला क़दम',
      'Featured': 'चुनिंदा',
      'Why us': 'हम क्यों',
      'Pricing': 'क़ीमत',
      'The catalogue': 'कैटलॉग',
      'All website designs': 'सभी वेबसाइट डिज़ाइन',
      'Order tracking': 'ऑर्डर ट्रैकिंग',
      'Licensing': 'लाइसेंस',
    },
    mr: {
      'Brand direction': 'ब्रँड दिशा',
      'Formation': 'रचना',
      'Ready-made designs': 'तयार डिझाइन',
      'Your photos and words': 'तुमचे फोटो आणि शब्द',
      'Domain and hosting': 'डोमेन आणि होस्टिंग',
      'Live in about a week': 'साधारण आठवडाभरात लाइव्ह',
      'Scroll to see the catalogue': 'कॅटलॉग बघण्यासाठी स्क्रोल करा',
      'Explore website designs →': 'वेबसाइट डिझाइन बघा →',
      'See how it works': 'हे कसं चालतं ते बघा',
      'The catalogue': 'कॅटलॉग',
      'Fifty-one designs, turned to the light': 'एक्कावन्न डिझाइन, उजेडात फिरवून',
      'Every face of this is a real design from the catalogue — not a mockup drawn for the homepage. Click it and the one facing you opens full-screen, exactly as your customer would see it on their phone.':
        'याची प्रत्येक बाजू कॅटलॉगमधलं खरं डिझाइन आहे — होमपेजसाठी काढलेला नमुना नाही. क्लिक करा आणि समोरचं डिझाइन पूर्ण स्क्रीनवर उघडेल, अगदी तुमचा ग्राहक फोनवर बघेल तसंच.',
      'Open the catalogue →': 'कॅटलॉग उघडा →',
      'How it works': 'हे कसं चालतं',
      'Four steps, and one of them is ours': 'चार पायऱ्या, त्यातली एक आमची',
      'Pick a design': 'डिझाइन निवडा',
      'Open the designs written for your trade and view them full-screen, on a phone if you like. Nothing is a placeholder — what you see is what gets built.':
        'तुमच्या व्यवसायासाठी बनवलेली डिझाइन उघडा आणि पूर्ण स्क्रीनवर बघा, हवं तर फोनवर. काहीही नमुना नाही — जे दिसतंय तेच बनतं.',
      'Make it yours': 'ते तुमचं करा',
      'Your name, your words, your photos, your colours. The studio previews it live as you type, so you approve a real page rather than a promise.':
        'तुमचं नाव, तुमचे शब्द, तुमचे फोटो, तुमचे रंग. लिहीत असतानाच स्टुडिओ समोर दाखवतो, त्यामुळे तुम्ही आश्वासनाला नाही तर खऱ्या पानाला मान्यता देता.',
      'Choose a plan': 'प्लान निवडा',
      'One page or ten, extra languages, a domain and hosting if you need them. The price adds up in front of you before you commit to anything.':
        'एक पान की दहा, आणखी भाषा, लागल्यास डोमेन आणि होस्टिंग. काहीही ठरवण्याआधी किंमत तुमच्यासमोरच बेरीज होत जाते.',
      'Go live': 'लाइव्ह करा',
      'We put your content in, connect the domain, set up Google, and hand over the keys. Usually inside a week, with one number to text afterwards.':
        'आम्ही तुमचा मजकूर टाकतो, डोमेन जोडतो, गूगल सेट करतो, आणि चाव्या देऊन टाकतो. साधारण आठवडाभरात, आणि नंतरसाठी एक नंबर.',
      'Step one': 'पहिली पायरी',
      'Featured': 'निवडक',
      'Why us': 'आम्हीच का',
      'Pricing': 'किंमत',
      'All website designs': 'सर्व वेबसाइट डिझाइन',
      'Order tracking': 'ऑर्डर ट्रॅकिंग',
      'Licensing': 'परवाना',
    },
  };

  /* categories, commerce and landing copy fold into the same lookup */
  [CATEGORIES, COMMERCE, LANDING].forEach(function (extra) {
    Object.keys(extra).forEach(function (code) {
      if (!DICT[code]) DICT[code] = {};
      Object.keys(extra[code]).forEach(function (k) { DICT[code][k] = extra[code][k]; });
    });
  });

  /* Strings built by joining a number to a word never match a plain key, so
     they get patterns instead. Kept few and obvious on purpose. */
  var PATTERNS = {
    hi: [
      [/^(\d+) designs$/, '$1 डिज़ाइन'],
      [/^(\d+) designs · (\d+) kinds of business$/, '$1 डिज़ाइन · $2 तरह के व्यवसाय'],
      [/^Browse all (\d+)$/, 'सभी $1 देखें'],
      [/^✓ Starts at (.+)$/, '✓ शुरुआत $1 से'],
      [/^Starts at (.+)$/, 'शुरुआत $1 से'],
      [/^Projects start at (.+)$/, 'प्रोजेक्ट $1 से शुरू'],
      [/^Step 0(\d)$/, 'चरण 0$1'],
      [/^Step (\d) of 4 · (.+)$/, 'चरण $1 / 4 · $2'],
      [/^GST @ (\d+)%$/, 'जीएसटी @ $1%'],
      [/^GST (\d+)%$/, 'जीएसटी $1%'],
      [/^Pick a plan for (.+)$/, '$1 के लिए प्लान चुनें'],
      [/^Priced for what you just built: (\d+) pages?(.*)\. One fixed price, no hourly billing\.$/, 'अभी जो बनाया उसके हिसाब से: $1 पेज$2। एक तय क़ीमत, घंटे के हिसाब से नहीं।'],
      [/^Advance to start \((\d+)%\)$/, 'शुरू करने के लिए अग्रिम ($1%)'],
      [/^(.+) websites$/, '$1 वेबसाइट'],
    ],
    mr: [
      [/^(\d+) designs$/, '$1 डिझाइन'],
      [/^(\d+) designs · (\d+) kinds of business$/, '$1 डिझाइन · $2 प्रकारचे व्यवसाय'],
      [/^Browse all (\d+)$/, 'सर्व $1 बघा'],
      [/^✓ Starts at (.+)$/, '✓ $1 पासून सुरू'],
      [/^Starts at (.+)$/, '$1 पासून सुरू'],
      [/^Projects start at (.+)$/, 'प्रोजेक्ट $1 पासून सुरू'],
      [/^Step 0(\d)$/, 'पायरी 0$1'],
      [/^Step (\d) of 4 · (.+)$/, 'पायरी $1 / 4 · $2'],
      [/^GST @ (\d+)%$/, 'जीएसटी @ $1%'],
      [/^GST (\d+)%$/, 'जीएसटी $1%'],
      [/^Pick a plan for (.+)$/, '$1 साठी प्लॅन निवडा'],
      [/^Priced for what you just built: (\d+) pages?(.*)\. One fixed price, no hourly billing\.$/, 'तुम्ही आत्ता बनवलं त्यानुसार: $1 पानं$2. एक ठरलेली किंमत, तासाच्या हिशोबाने नाही.'],
      [/^Advance to start \((\d+)%\)$/, 'सुरू करण्यासाठी आगाऊ ($1%)'],
      [/^(.+) websites$/, '$1 वेबसाइट'],
    ],
  };

/* --- lookup ---------------------------------------------------------------
   Pure: the language comes in as an argument, so React owns the state and this
   file stays a dictionary. Falls back to the English it was handed. */
export function lookup(s, lang) {
  if (!lang || lang === 'en') return s;
  const key = String(s == null ? '' : s).trim();
  if (!key) return s;
  const d = DICT[lang];
  if (d && d[key]) return String(s).replace(key, d[key]);
  const pats = PATTERNS[lang] || [];
  for (let i = 0; i < pats.length; i++) {
    if (pats[i][0].test(key)) return String(s).replace(key, key.replace(pats[i][0], pats[i][1]));
  }
  return s;
}

export const hasLanguage = (code) => code === 'en' || !!DICT[code];

export { LANGS, DICT, PATTERNS };
