/* ---------------------------------------------------------------------------
   Starter content for the studio.

   Every category opens with a complete, plausible page rather than a blank one.
   It is all editable — the point is that the customer edits real copy instead of
   staring at empty boxes.

   The second half is the offline writer's vocabulary: when the server has no AI
   key, the Generate button still has to do something honest, so it reads the
   brief for the things a regex can genuinely find — the trade, the city, the
   business name — and drops the owner's own words into the matching pack.
--------------------------------------------------------------------------- */

export const DEFAULT_PACK = {
  svcLabel: 'Services', cta: 'Enquire now',
  shots: [
    { title: 'Where we work', desc: 'The place itself. A phone photo in daylight beats any stock picture.' },
    { title: 'What we make', desc: 'Show the thing you are actually known for.' },
    { title: 'The team', desc: 'People buy from people. One face is enough.' },
  ],

  points: ['Family run', 'Fair, fixed prices', 'Open six days a week'],
  services: [
    { name: 'Our main service', desc: 'Say what it is and who it is for.', price: '₹—' },
    { name: 'Second service', desc: 'One line is enough.', price: '₹—' },
    { name: 'Third service', desc: 'Add or remove rows as you like.', price: '₹—' },
  ],
};

export const PACKS = {
  restaurants: {
  shots: [
    { title: 'The main room', desc: 'Say how many it seats and whether it is air conditioned.' },
    { title: 'What we are known for', desc: 'One dish. The one people come back for.' },
    { title: 'The kitchen', desc: 'Open kitchens sell themselves. Show it if you have one.' },
  ],
    svcLabel: 'Menu', cta: 'Book a table',
    points: ['Fresh every morning', 'Home delivery in 30 min', 'Pure veg kitchen'],
    services: [
      { name: 'Paneer tikka masala', desc: 'Clay oven paneer, tomato and cream gravy', price: '₹280' },
      { name: 'Veg biryani', desc: 'Long grain rice, fried onion, raita on the side', price: '₹240' },
      { name: 'Butter naan', desc: 'Tandoor fresh, two pieces', price: '₹60' },
      { name: 'Gulab jamun', desc: 'Warm, two pieces', price: '₹90' },
    ],
  },
  clinics: {
  shots: [
    { title: 'The treatment room', desc: 'Clean and calm does more work than any claim.' },
    { title: 'Reception', desc: 'Where insurance and paperwork get sorted.' },
    { title: 'Our equipment', desc: 'Name it if it is newer than what is down the road.' },
  ],
    svcLabel: 'Treatments', cta: 'Book appointment',
    points: ['Same-day appointments', 'Sterile, single-use kits', 'Cashless insurance'],
    services: [
      { name: 'General consultation', desc: '15–20 minutes with the doctor', price: '₹500' },
      { name: 'Full body check-up', desc: 'Blood work, reports same day', price: '₹2,400' },
      { name: 'Follow-up visit', desc: 'Within 15 days of your first visit', price: '₹200' },
    ],
  },
  salons: {
  shots: [
    { title: 'The chairs', desc: 'How many, and what a normal appointment looks like.' },
    { title: 'Recent work', desc: 'A before and after, if the client is happy for you to use it.' },
    { title: 'Products we use', desc: 'Say the brands. People search for them.' },
  ],
    svcLabel: 'Services', cta: 'Book a slot',
    points: ['Walk-ins welcome', 'Branded products only', 'Open till 9 pm'],
    services: [
      { name: 'Haircut & styling', desc: 'Consultation, wash, cut, blow-dry', price: '₹600' },
      { name: 'Hair colour', desc: 'Global or root touch-up', price: '₹2,200' },
      { name: 'Party makeup', desc: 'HD makeup, 90 minutes', price: '₹3,500' },
      { name: 'Bridal package', desc: 'Trial, mehendi day and wedding day', price: '₹18,000' },
    ],
  },
  gyms: {
  shots: [
    { title: 'The floor', desc: 'Show the space at a busy hour, not an empty one.' },
    { title: 'Class in progress', desc: 'A full class says more than a list of timings.' },
    { title: 'Equipment', desc: 'Name the makes if they are good.' },
  ],
    svcLabel: 'Programmes', cta: 'Claim free trial',
    points: ['Free trial session', 'Certified trainers', 'Open 5 am – 11 pm'],
    services: [
      { name: 'Monthly membership', desc: 'Full gym floor and cardio access', price: '₹1,500 / month' },
      { name: 'Personal training', desc: '12 sessions with a dedicated trainer', price: '₹8,000' },
      { name: 'Group classes', desc: 'Zumba, yoga, HIIT — six days a week', price: '₹1,200 / month' },
    ],
  },
  hotels: {
  shots: [
    { title: 'A room', desc: 'The actual room a guest gets, not the suite.' },
    { title: 'Reception', desc: 'First thing they see when they arrive.' },
    { title: 'Breakfast', desc: 'If it is included, show it.' },
  ],
    svcLabel: 'Rooms', cta: 'Check availability',
    points: ['Free breakfast', 'Free parking', '24-hour reception'],
    services: [
      { name: 'Deluxe double room', desc: 'AC, king bed, breakfast included', price: '₹2,800 / night' },
      { name: 'Family suite', desc: 'Two bedrooms, sleeps four', price: '₹4,500 / night' },
      { name: 'Day use room', desc: '9 am to 6 pm', price: '₹1,400' },
    ],
  },
  'real-estate': {
  shots: [
    { title: 'Current listing', desc: 'One property, photographed properly.' },
    { title: 'Areas we cover', desc: 'A street shot from the locality you know best.' },
    { title: 'Handover', desc: 'Keys, paperwork done, the part that matters.' },
  ],
    svcLabel: 'Listings', cta: 'Book a site visit',
    points: ['RERA registered', 'No brokerage on new projects', 'Loan help included'],
    services: [
      { name: '2 BHK, ready to move', desc: '850 sq ft, east facing, covered parking', price: '₹62 L' },
      { name: '3 BHK, under construction', desc: '1,240 sq ft, possession Dec 2027', price: '₹94 L' },
      { name: 'Commercial shop', desc: '420 sq ft on the main road', price: '₹48 L' },
    ],
  },
  'interior-designers': {
  shots: [
    { title: 'Finished project', desc: 'Wide shot of a room you are proud of.' },
    { title: 'Detail', desc: 'The joinery or the finish nobody else notices.' },
    { title: 'Before we started', desc: 'The contrast is the pitch.' },
  ],
    svcLabel: 'Services', cta: 'Book a consultation',
    points: ['Free first consultation', '45-day handover', '10-year warranty'],
    services: [
      { name: 'Full home interiors', desc: '2 BHK, modular kitchen and wardrobes', price: 'From ₹6.5 L' },
      { name: 'Modular kitchen', desc: 'Design, material, installation', price: 'From ₹1.8 L' },
      { name: 'Design consultation', desc: 'Drawings and 3D views only', price: '₹15,000' },
    ],
  },
  'coaching-classes': {
  shots: [
    { title: 'The classroom', desc: 'Batch size is the thing parents want to see.' },
    { title: 'Results', desc: 'Board, wall, or a photo of last year\'s toppers.' },
    { title: 'The library', desc: 'Where students actually sit between classes.' },
  ],
    svcLabel: 'Courses', cta: 'Book a demo class',
    points: ['Small batches of 15', 'Weekly tests', 'Doubt sessions daily'],
    services: [
      { name: 'Class 10 — all subjects', desc: 'Mon to Sat, 2 hours a day', price: '₹28,000 / year' },
      { name: 'JEE foundation', desc: 'Class 11 and 12, physics chem maths', price: '₹52,000 / year' },
      { name: 'Spoken English', desc: '3 months, weekend batch', price: '₹6,000' },
    ],
  },
  manufacturers: {
  shots: [
    { title: 'The shop floor', desc: 'Machines running, not standing idle.' },
    { title: 'Quality check', desc: 'Show that measuring happens.' },
    { title: 'Ready for dispatch', desc: 'Packed, labelled, going out.' },
  ],
    svcLabel: 'Products', cta: 'Get a quotation',
    points: ['ISO 9001 certified', 'Bulk orders welcome', 'Pan-India dispatch'],
    services: [
      { name: 'Precision machined parts', desc: 'CNC turning and milling, ±0.02 mm', price: 'On enquiry' },
      { name: 'Sheet metal fabrication', desc: 'Laser cutting, bending, powder coating', price: 'On enquiry' },
      { name: 'Assembly and testing', desc: 'Sub-assemblies with test reports', price: 'On enquiry' },
    ],
  },
  furniture: {
  shots: [
    { title: 'The showroom', desc: 'Wide enough to show the range.' },
    { title: 'A piece up close', desc: 'Grain, joint, finish.' },
    { title: 'The workshop', desc: 'If you make it yourself, that is the whole advantage.' },
  ],
    svcLabel: 'Categories', cta: 'Visit the showroom',
    points: ['Solid wood only', 'Free delivery in city', '5-year warranty'],
    services: [
      { name: 'Sofa sets', desc: '3+2 seater, fabric or leatherette', price: 'From ₹32,000' },
      { name: 'Dining tables', desc: '4, 6 and 8 seater in sheesham', price: 'From ₹24,000' },
      { name: 'Beds with storage', desc: 'Queen and king, hydraulic lift', price: 'From ₹28,000' },
    ],
  },
  boutiques: {
  shots: [
    { title: 'This week\'s rack', desc: 'New stock, dated. People check for updates.' },
    { title: 'A finished piece', desc: 'Styled the way you would wear it.' },
    { title: 'The fitting', desc: 'Stitching and alterations, if you do them.' },
  ],
    svcLabel: 'Collections', cta: 'Order on WhatsApp',
    points: ['New drops every Friday', 'Stitching in 5 days', 'Exchange in 7 days'],
    services: [
      { name: 'Festive lehengas', desc: 'Ready and made to measure', price: 'From ₹8,500' },
      { name: 'Cotton kurta sets', desc: 'Daily wear, sizes S to XXL', price: 'From ₹1,200' },
      { name: 'Blouse stitching', desc: 'Your fabric, our fit', price: '₹900' },
    ],
  },
  photographers: {
  shots: [
    { title: 'Recent work', desc: 'Your single best frame, first.' },
    { title: 'The studio', desc: 'Show the space if clients come to you.' },
    { title: 'The kit', desc: 'Only if it is genuinely a selling point.' },
  ],
    svcLabel: 'Packages', cta: 'Check my dates',
    points: ['Full-day coverage', 'Edited photos in 15 days', 'Album included'],
    services: [
      { name: 'Wedding, two days', desc: 'Two photographers, one cinematographer', price: '₹1,20,000' },
      { name: 'Pre-wedding shoot', desc: 'Half day, one location, 40 edited photos', price: '₹25,000' },
      { name: 'Portfolio shoot', desc: '3 hours, studio, 25 retouched images', price: '₹12,000' },
    ],
  },
  'event-planners': {
  shots: [
    { title: 'A finished setup', desc: 'Decor, lighting, the room full.' },
    { title: 'Behind the scenes', desc: 'Setting up. Clients like knowing what it takes.' },
    { title: 'The team on the day', desc: 'Who will actually be there.' },
  ],
    svcLabel: 'Services', cta: 'Check availability',
    points: ['End-to-end handling', 'Vendors on our panel', 'Fixed quotation'],
    services: [
      { name: 'Wedding planning', desc: 'Venue, decor, catering, coordination', price: 'From ₹3.5 L' },
      { name: 'Birthday parties', desc: 'Theme decor, games, cake, return gifts', price: 'From ₹35,000' },
      { name: 'Corporate events', desc: 'Conferences, launches, annual days', price: 'On enquiry' },
    ],
  },
  'lawyers-accountants': {
  shots: [
    { title: 'The office', desc: 'Quiet and ordinary is exactly right here.' },
    { title: 'Meeting room', desc: 'Where consultations happen.' },
    { title: 'The practice', desc: 'Certificates and credentials, if you have them.' },
  ],
    svcLabel: 'Practice areas', cta: 'Book a consultation',
    points: ['20 years of practice', 'Fixed fee, told upfront', 'Reply within 24 hours'],
    services: [
      { name: 'GST registration & filing', desc: 'Monthly and annual returns', price: '₹1,500 / month' },
      { name: 'Company incorporation', desc: 'Pvt Ltd or LLP, all documents', price: '₹12,000' },
      { name: 'Property documentation', desc: 'Sale deed, agreement, due diligence', price: 'On enquiry' },
    ],
  },
  travel: {
  shots: [
    { title: 'On a recent trip', desc: 'Your own photo from your own itinerary.' },
    { title: 'Where we go', desc: 'One destination, well shot.' },
    { title: 'The group', desc: 'Small groups are a selling point. Show the size.' },
  ],
    svcLabel: 'Packages', cta: 'Get an itinerary',
    points: ['IATA registered', 'Visa help included', '24×7 on trip'],
    services: [
      { name: 'Kerala, 5 nights', desc: 'Munnar, Alleppey houseboat, Kochi', price: '₹24,000 pp' },
      { name: 'Dubai, 4 nights', desc: 'Visa, flights, desert safari, hotel', price: '₹52,000 pp' },
      { name: 'Weekend getaways', desc: 'Within 300 km, hotel and cab', price: 'From ₹6,500 pp' },
    ],
  },
  contractors: {
  shots: [
    { title: 'A finished job', desc: 'Completed, cleaned up, handed over.' },
    { title: 'Work in progress', desc: 'Shows how you work, not just the result.' },
    { title: 'The crew', desc: 'Who turns up on site.' },
  ],
    svcLabel: 'Services', cta: 'Get a free estimate',
    points: ['Free site visit', 'Labour + material rates', 'Work on written contract'],
    services: [
      { name: 'Full house painting', desc: 'Putty, primer, two coats emulsion', price: '₹28 / sq ft' },
      { name: 'Bathroom renovation', desc: 'Plumbing, tiling, fittings', price: 'From ₹85,000' },
      { name: 'False ceiling', desc: 'Gypsum with lighting provision', price: '₹95 / sq ft' },
    ],
  },
  'local-services': {
  shots: [
    { title: 'On a job', desc: 'You, working. That is the trust signal.' },
    { title: 'Tools of the trade', desc: 'Says you came prepared.' },
    { title: 'Finished', desc: 'Tidy, tested, and left clean.' },
  ],
    svcLabel: 'Services', cta: 'Call now',
    points: ['Same-day service', 'Trained technicians', '30-day service warranty'],
    services: [
      { name: 'AC service & repair', desc: 'Deep clean, gas check, spare parts', price: '₹599' },
      { name: 'Plumbing', desc: 'Leaks, taps, fittings, blockages', price: '₹350 visit' },
      { name: 'Electrical work', desc: 'Wiring, switches, fans, lights', price: '₹350 visit' },
    ],
  },
};

export const pack = (slug) => PACKS[slug] || DEFAULT_PACK;

const TRADE_WORDS = {
  restaurants: ['restaurant', 'cafe', 'café', 'dhaba', 'biryani', 'pizza', 'bakery', 'kitchen', 'tiffin', 'mess', 'canteen', 'chai', 'coffee', 'food'],
  clinics: ['clinic', 'doctor', 'dentist', 'dental', 'hospital', 'physio', 'diagnostic', 'pathology', 'ayurved', 'homeopath'],
  salons: ['salon', 'parlour', 'parlor', 'beauty', 'spa', 'hair', 'makeup', 'bridal', 'nail'],
  gyms: ['gym', 'fitness', 'yoga', 'crossfit', 'zumba', 'workout', 'trainer'],
  hotels: ['hotel', 'lodge', 'resort', 'homestay', 'guest house', 'rooms'],
  'real-estate': ['real estate', 'property', 'builder', 'flats', 'plots', 'broker', 'realty'],
  'interior-designers': ['interior', 'modular kitchen', 'wardrobe', 'furnishing', 'decor'],
  'coaching-classes': ['coaching', 'classes', 'tuition', 'academy', 'institute', 'jee', 'neet', 'spoken english'],
  manufacturers: ['manufactur', 'fabrication', 'industries', 'engineering works', 'cnc', 'factory'],
  furniture: ['furniture', 'sofa', 'mattress', 'carpenter'],
  boutiques: ['boutique', 'saree', 'lehenga', 'tailor', 'clothing', 'garments', 'fashion'],
  photographers: ['photograph', 'photo studio', 'candid', 'videograph'],
  'event-planners': ['event', 'wedding planner', 'decorat', 'catering', 'banquet'],
  'lawyers-accountants': ['lawyer', 'advocate', 'legal', 'chartered accountant', 'gst', 'audit', 'tax'],
  travel: ['travel', 'tour', 'holiday', 'ticket', 'visa', 'cab service'],
  contractors: ['contractor', 'painting', 'construction', 'civil work', 'renovation', 'plumbing work'],
  'local-services': ['repair', 'service centre', 'ac service', 'electrician', 'plumber', 'cleaning', 'pest control'],
};

const CITIES = ['Pune', 'Mumbai', 'Nashik', 'Nagpur', 'Thane', 'Delhi', 'Bengaluru', 'Bangalore', 'Hyderabad',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Surat', 'Jaipur', 'Indore', 'Lucknow', 'Kochi', 'Coimbatore',
  'Chandigarh', 'Bhopal', 'Patna', 'Kolhapur', 'Aurangabad', 'Solapur'];

export function guessCategory(text) {
  var t = String(text).toLowerCase(), best = '', score = 0;
  Object.keys(TRADE_WORDS).forEach(function (slug) {
    var n = TRADE_WORDS[slug].reduce(function (a, w) { return a + (t.indexOf(w) >= 0 ? 1 : 0); }, 0);
    if (n > score) { score = n; best = slug; }
  });
  return best;
}

export function guessName(text) {
  var t = String(text).trim(), m;
  m = t.match(/(?:we are|this is|called)\s+([A-Z][\w'&.-]*(?:\s+[A-Z][\w'&.-]*){0,3})/);
  if (m) return m[1].trim();
  m = t.match(/\b([A-Z][a-z][\w'&.-]*(?:\s+[A-Z][\w'&.-]*){0,3})\b\s+(?:is|has|serves|offers|opened)/);
  if (m) return m[1].trim();
  m = t.match(/^([A-Z][\w'&.-]*(?:\s+[A-Z][\w'&.-]*){0,3})/);
  return m ? m[1].trim() : '';
}

export function guessCity(text) {
  for (var i = 0; i < CITIES.length; i++) {
    if (new RegExp('\\b' + CITIES[i] + '\\b', 'i').test(text)) return CITIES[i];
  }
  return '';
}
