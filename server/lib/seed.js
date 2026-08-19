import { quote } from '../../shared/pricing.js';
/* Seed data. Runs once on first boot to create data/*.json.
   Delete the data folder and restart to reset everything. */

const CATEGORIES = [
  { slug: 'restaurants', name: 'Restaurants & Cafés', blurb: 'Show the menu, the room and the location. Built for hungry people on phones.' },
  { slug: 'clinics', name: 'Clinics & Healthcare', blurb: 'Calm, credible sites for doctors, dentists and diagnostic centres.' },
  { slug: 'salons', name: 'Salons & Beauty', blurb: 'Price lists, portfolios and one-tap booking for salons and spas.' },
  { slug: 'gyms', name: 'Gyms & Fitness', blurb: 'Class timetables, trainer profiles and membership enquiry forms.' },
  { slug: 'hotels', name: 'Hotels & Stays', blurb: 'Rooms, tariffs and photo galleries that make people want to book.' },
  { slug: 'real-estate', name: 'Real Estate Agents', blurb: 'Property listings with filters, floor plans and site-visit requests.' },
  { slug: 'interior-designers', name: 'Interior Designers', blurb: 'Project portfolios that put the work first and the pitch second.' },
  { slug: 'coaching-classes', name: 'Coaching Classes', blurb: 'Courses, batch timings, faculty and admission enquiry forms.' },
  { slug: 'manufacturers', name: 'Local Manufacturers', blurb: 'Product catalogues, capability pages and bulk-order enquiries.' },
  { slug: 'furniture', name: 'Furniture Stores', blurb: 'Room-by-room catalogues with prices and showroom directions.' },
  { slug: 'boutiques', name: 'Clothing Boutiques', blurb: 'Lookbooks, collections and WhatsApp ordering for local labels.' },
  { slug: 'photographers', name: 'Photographers', blurb: 'Gallery-led sites where the images fill the screen and load fast.' },
  { slug: 'event-planners', name: 'Event Planners', blurb: 'Past events, packages and date-availability enquiry forms.' },
  { slug: 'lawyers-accountants', name: 'Lawyers & Accountants', blurb: 'Practice areas, credentials and confidential consultation requests.' },
  { slug: 'travel', name: 'Travel Agencies', blurb: 'Tour packages, itineraries and seasonal offers with quick enquiry.' },
  { slug: 'contractors', name: 'Contractors', blurb: 'Completed projects, service areas and site-estimate requests.' },
  { slug: 'local-services', name: 'Local Services', blurb: 'Plumbers, electricians, tutors, cleaners — call and WhatsApp first.' },
];

const BESPOKE = [
  { slug: 'maison-noir', category: 'restaurants', name: 'Maison Noir', style: 'Fine dining', tags: ['dark', 'serif', 'editorial'], ink: '#12100E', accent: '#C6A15B', mode: 'dark', featured: true,
    description: 'Dark, serif and unhurried. For a tasting menu and two seatings a night, not a lunch rush.',
    sections: ['Navbar', 'Hero', 'Story', 'Signature dishes', 'Menu', 'Gallery', 'Reviews', 'Hours', 'Location', 'Reservations', 'Footer'] },
  { slug: 'urban-plate', category: 'restaurants', name: 'Urban Plate', style: 'Modern bistro', tags: ['light', 'airy', 'grid'], ink: '#14322A', accent: '#1F9D6B', mode: 'light', featured: false,
    description: 'Bright and photo-led. Menu, hours and a WhatsApp order button above the fold.',
    sections: ['Navbar', 'Hero', 'About', 'Popular plates', 'Full menu', 'Gallery', 'Hours', 'Map', 'WhatsApp order', 'Footer'] },
  { slug: 'tandoor-lane', category: 'restaurants', name: 'Tandoor Lane', style: 'Street food', tags: ['bold', 'mono', 'high-energy'], ink: '#1A1004', accent: '#F2541B', mode: 'light', featured: false,
    description: 'Loud and hard-edged, built like a menu board. For late nights and a queue on the pavement.',
    sections: ['Navbar', 'Hero', "Today's specials", 'Menu board', 'Gallery', 'Reviews', 'Timings', 'Find us', 'Order on WhatsApp', 'Footer'] },
  { slug: 'smilecare', category: 'clinics', name: 'SmileCare Dental', style: 'Medical professional', tags: ['clean', 'blue', 'trust'], ink: '#0B2B45', accent: '#1273C4', mode: 'light', featured: true,
    description: 'Calm blues and clear pricing. Made to settle nerves before someone books a chair.',
    sections: ['Navbar', 'Hero', 'Services', 'Doctors', 'Reviews', 'Appointment', 'Hours', 'Location', 'Footer'] },
  { slug: 'northline', category: 'clinics', name: 'Northline Family Practice', style: 'Minimal', tags: ['quiet', 'typographic', 'spacious'], ink: '#1C1C1A', accent: '#3A6B4C', mode: 'light', featured: false,
    description: 'Almost no decoration. Hours, doctors and directions, in the order a patient needs them.',
    sections: ['Navbar', 'Hero', 'Services', 'Doctors', 'How a visit works', 'Hours', 'Location', 'Footer'] },
  { slug: 'aurum-health', category: 'clinics', name: 'Aurum Health', style: 'Premium healthcare', tags: ['luxury', 'warm', 'concierge'], ink: '#241E2B', accent: '#8B6CC4', mode: 'light', featured: false,
    description: 'Concierge tone, annual plans up front. For a clinic selling a relationship, not a visit.',
    sections: ['Navbar', 'Hero', 'Specialities', 'Health plans', 'Hours', 'Location', 'Footer'] },
  { slug: 'velvet-studio', category: 'salons', name: 'Velvet Studio', style: 'Luxury beauty', tags: ['rose', 'serif', 'elegant'], ink: '#2A1620', accent: '#B4587A', mode: 'light', featured: true,
    description: 'Soft, roomy and rate-card first. Bridal packages get a section of their own.',
    sections: ['Navbar', 'Hero', 'Price list', 'Gallery', 'Team', 'Booking', 'Hours', 'Location', 'Footer'] },
  { slug: 'studio-ash', category: 'salons', name: 'Studio Ash', style: 'Modern minimal', tags: ['grey', 'swiss', 'restrained'], ink: '#191919', accent: '#6F7B75', mode: 'light', featured: false,
    description: 'Swiss and stone-grey. The work fills the screen and the words stay out of the way.',
    sections: ['Navbar', 'Hero', 'Services', 'Gallery', 'Stylists', 'Booking', 'Location', 'Footer'] },
  { slug: 'neon-rouge', category: 'salons', name: 'Neon Rouge', style: 'Bold fashion', tags: ['dark', 'neon', 'editorial'], ink: '#0D0D12', accent: '#FF2E63', mode: 'dark', featured: false,
    description: 'Dark with neon edges. Built as a lookbook for colour work and shoots.',
    sections: ['Navbar', 'Hero', 'Lookbook', 'Menu & rates', 'Reviews', 'Booking', 'Hours', 'Location', 'Footer'] },

  /* The last two are whole pages rather than fragments — they live as real
     files in public/sites and preview in an iframe. See "Self-contained sites"
     in the README. Their `template` key still has to match, because that is
     what routes them to the embedding renderer instead of `generic`. */
  { slug: 'setu-buildworks', category: 'contractors', name: 'Setu Buildworks', style: 'Civil & structural', tags: ['dark', 'hi-vis', '3d'], ink: '#15181B', accent: '#F5C518', mode: 'dark', featured: false, premium: true,
    description: 'A tower goes up as you scroll — frame, cladding, glazing, then dusk. For a contractor selling the programme, not the price.',
    sections: ['Navbar', 'Hero', 'Build sequence', 'Capability', 'The argument', 'Stats', 'FAQ', 'Contact', 'Footer'] },
  { slug: 'noor-kapadia', category: 'photographers', name: 'Noor Kapadia', style: 'Editorial photography', tags: ['dark', 'film', '3d'], ink: '#0B0B0C', accent: '#D93A2B', mode: 'dark', featured: false, premium: true,
    description: 'Opens on a shutter and walks through prints hanging in the dark before they settle into a grid. Built for a photographer whose work is the whole argument.',
    sections: ['Navbar', 'Hero', 'Selected frames', 'Process', 'Services', 'Stats', 'FAQ', 'Bookings', 'Footer'] },
  { slug: 'ninety-four', category: 'restaurants', name: 'Ninety-Four', style: 'Specialty coffee', tags: ['dark', 'copper', '3d'], ink: '#12161A', accent: '#D2762F', mode: 'dark', featured: false, premium: true,
    description: 'Scrolling brews the cup — dose, bloom, pour, with water and temperature counting up beside it. For a roaster selling the method.',
    sections: ['Navbar', 'Hero', 'The brew', 'Coffee', 'The argument', 'Stats', 'FAQ', 'Contact', 'Footer'] },
  { slug: 'rane-khosla', category: 'lawyers-accountants', name: 'Rane & Khosla', style: 'Advocates & solicitors', tags: ['dark', 'brass', '3d'], ink: '#0B0E14', accent: '#B08A4A', mode: 'dark', featured: false, premium: true,
    description: 'Papers stack and file themselves as you read, instruction through to execution. Brass on near-black for a practice that bills on judgement.',
    sections: ['Navbar', 'Hero', 'How we work', 'Practice', 'The argument', 'Stats', 'FAQ', 'Consultation', 'Footer'] },
  { slug: 'villa-seventeen', category: 'real-estate', name: 'Villa Seventeen', style: 'Off-plan villa', tags: ['dark', 'amber', '3d'], ink: '#0B0D10', accent: '#F2A93B', mode: 'dark', featured: false, premium: true,
    description: 'An empty plot builds itself into a 3 BHK as you scroll — slab, frame, envelope, pool, then dusk with every room lit. Three finish packages swap live. For a developer selling a villa a year before it exists.',
    sections: ['Hero', 'Build sequence', 'Floor plan', 'Finishes', 'Specification', 'Reservation', 'Footer'] },
  /* The only light one in this group, and the only one with no three.js in it —
     the room is CSS 3D, turned by scroll. Same embedding path all the same:
     it is a whole document with its own reset. */
  { slug: 'mirrorwork', category: 'salons', name: 'Mirrorwork', style: 'Unisex salon', tags: ['light', 'gold', '3d'], ink: '#15171A', accent: '#B4914F', mode: 'light', featured: false, premium: true,
    description: 'The room turns as you scroll — three arched stations, ten chairs, the mirrors catching the light. Priced by hair length rather than by gender, which is the whole argument.',
    sections: ['Navbar', 'Hero', 'The room', 'Services', 'Price list', 'Chairs', 'Visit', 'Footer'] },
];

const GENERATED = {
  gyms: [['Forge Fitness', 'Dark strength', '#0E0E10', '#E4FF3F', 'dark', 'Black and acid yellow, built for a floor full of iron. Timetable and trial signup lead.'], ['Aravind Wellness', 'Premium wellness', '#22302B', '#6FAF95', 'light', 'Quiet greens for yoga and recovery. Reads calm rather than shouty.'], ['Pulse 60', 'High energy', '#111827', '#FF5A1F', 'dark', 'High contrast and fast. For circuit classes sold by the hour.']],
  hotels: [['Casa Verde', 'Luxury hotel', '#1B2A22', '#C9A227', 'light', 'Gold on deep green. Room tariffs and a booking enquiry above everything else.'], ['The Wick House', 'Boutique stay', '#2B2320', '#A8705A', 'light', 'Warm and small. For six rooms and a host who answers the phone herself.'], ['Blue Lagoon Resort', 'Beach resort', '#0C3B4D', '#2BB3C0', 'light', 'Sea blues, big photographs. Built for a pool, a beach and a package rate.']],
  'real-estate': [['Keystone Realty', 'Corporate', '#132238', '#2D6BD8', 'light', 'Corporate blue and orderly. Listings with filters, floor plans and site-visit forms.'], ['Nest & Co.', 'Warm residential', '#2E2721', '#C98B3E', 'light', 'Warm and residential. Made for families buying their first home, not investors.'], ['Skyline Estates', 'Luxury listings', '#101014', '#D4C39A', 'dark', 'Dark and expensive-looking. Few listings, each given a full screen.']],
  'interior-designers': [['Studio Terra', 'Editorial portfolio', '#1E1B18', '#B08356', 'light', 'Editorial layout with generous margins. The portfolio carries the whole page.'], ['Form & Frame', 'Architectural', '#17181A', '#5E6C7A', 'dark', 'Architectural and grey. Drawings and details sit as comfortably as photographs.'], ['Chroma Interiors', 'Colourful', '#2A1A33', '#E0567B', 'light', 'Colour-forward and playful. For a studio that is not afraid of a pink wall.']],
  'coaching-classes': [['Vidya Point', 'Academic trust', '#12294A', '#F2A93B', 'light', 'Trust-first: results, faculty and batch timings before anything else.'], ['Rank Lab', 'Modern edtech', '#0F1E2D', '#20B486', 'light', 'Modern edtech feel. Courses, test series and an admission form that works on a phone.'], ['The Study Room', 'Friendly local', '#25211C', '#D06A3E', 'light', 'Friendly and local. For small batches and a teacher parents already know.']],
  manufacturers: [['Ironworks Industries', 'Industrial', '#15181B', '#F0A500', 'dark', 'Industrial dark with amber. Capabilities, certifications and a bulk enquiry form.'], ['Precision Polymers', 'Technical', '#0D2436', '#3A8DDE', 'light', 'Technical and clean. Tolerances and specifications get room to be read.'], ['Sunrise Textiles', 'Heritage mill', '#2B211C', '#9C6B3F', 'light', 'Heritage mill tone. Built for a company older than its buyers.']],
  furniture: [['Oak & Ash', 'Warm wood', '#2A211A', '#A9702F', 'light', 'Warm wood and roomy. Room-by-room catalogue with prices and showroom directions.'], ['Modula', 'Contemporary', '#1B1B1D', '#7A8B99', 'light', 'Contemporary and flat. For modular pieces sold on finish and dimension.'], ['Home Story', 'Family showroom', '#243027', '#5E9B6B', 'light', 'Family showroom feel. Offers and delivery terms sit where people look for them.']],
  boutiques: [['Indigo Thread', 'Handloom', '#1D2440', '#3F5BB0', 'light', 'Handloom blues. For weavers and labels selling the story behind the fabric.'], ['Maya Label', 'Contemporary', '#241A22', '#C25E86', 'light', 'Contemporary and clean. Lookbook first, WhatsApp ordering second.'], ['The Denim Room', 'Streetwear', '#0F0F0F', '#E5E5E5', 'dark', 'Monochrome streetwear. Drops, sizing and stock, nothing else.']],
  photographers: [['Frame & Light', 'Wedding', '#211C1A', '#BE8F63', 'light', 'Warm and wedding-led. Packages and availability sit under the portfolio.'], ['Noir Lens', 'Fashion', '#0B0B0C', '#EDEDED', 'dark', 'Black background, images full-bleed. For fashion and editorial work.'], ['Everyday Stories', 'Family & events', '#1F2A2E', '#4FA3A8', 'light', 'Softer and family-facing. Sittings, events and prints, priced plainly.']],
  'event-planners': [['Marigold Events', 'Wedding planning', '#2E1522', '#D9426B', 'light', 'Festive pinks and gold. Past weddings, packages and a date-availability form.'], ['Assemble', 'Corporate events', '#111827', '#4C6FFF', 'light', 'Corporate and restrained. Conferences, launches and annual days.'], ['Confetti Co.', 'Parties', '#241B33', '#F2B705', 'light', 'Bright and party-shaped. Themes, decor and return gifts, priced per head.']],
  'lawyers-accountants': [['Bhatt & Associates', 'Traditional practice', '#12212E', '#8C6A3E', 'light', 'Traditional and sober. Practice areas, credentials and a confidential enquiry.'], ['Ledger Partners', 'Modern accounting', '#0F1D2B', '#2F80ED', 'light', 'Modern accounting blue. GST, filings and fees stated up front.'], ['Wren Legal', 'Boutique firm', '#1A1A18', '#5D6B4E', 'light', 'Boutique and quiet. Two partners, a few practice areas, no stock handshakes.']],
  travel: [['Wander Route', 'Adventure', '#12281F', '#37A86B', 'light', 'Adventure greens with a full-bleed hero. Itineraries and per-head pricing.'], ['Blue Passport', 'Family tours', '#102A44', '#2E8BC0', 'light', 'Family tours, clearly priced. Visa help and inclusions listed, not implied.'], ['Heritage Trails', 'Cultural tours', '#2B1F17', '#B8763E', 'light', 'Earthy and cultural. For guided tours where the history is the product.']],
  contractors: [['BuildRight', 'Civil contracting', '#1A1A1C', '#FFB302', 'dark', 'Civil contracting in ochre. Completed projects, service areas and site estimates.'], ['Meridian Constructions', 'Corporate', '#132030', '#3E7CB1', 'light', 'Corporate contracting. Certifications, scale and a tender-ready enquiry form.'], ['Hammer & Co.', 'Home renovation', '#26201B', '#C4562F', 'light', 'Home renovation, room by room. Rates per square foot stated openly.']],
  'local-services': [['QuickFix Plumbing', 'Trades', '#10212E', '#1FA0D8', 'light', 'Call-first layout. Number in the header, visit charge stated, no hunting.'], ['Bright Home Cleaning', 'Home services', '#1D2A22', '#57B36A', 'light', 'Light and reassuring. Packages, service areas and same-day slots.'], ['SparkTech Electricals', 'Electrical', '#1B1B1F', '#F2C230', 'light', 'Practical blue. Rates, service areas and a WhatsApp button that follows you down.']],
};

const GENERIC_SECTIONS = {
  gyms: ['Programmes', 'Class timetable', 'Trainers', 'Membership plans', 'Gallery', 'Free trial', 'Location'],
  hotels: ['Rooms', 'Amenities', 'Gallery', 'Tariff', 'Reviews', 'Book a stay', 'Location'],
  'real-estate': ['Featured listings', 'Areas we cover', 'About', 'Reviews', 'Site visit request', 'Contact'],
  'interior-designers': ['Projects', 'Services', 'Process', 'About', 'Consultation', 'Contact'],
  'coaching-classes': ['Courses', 'Batch timings', 'Faculty', 'Results', 'Admission enquiry', 'Location'],
  manufacturers: ['Products', 'Capabilities', 'Certifications', 'Clients', 'Bulk enquiry', 'Location'],
  furniture: ['Categories', 'Bestsellers', 'Showroom', 'Offers', 'Reviews', 'Visit us'],
  boutiques: ['New arrivals', 'Collections', 'Lookbook', 'Sizing', 'Order on WhatsApp'],
  photographers: ['Portfolio', 'Services', 'Packages', 'About', 'Reviews', 'Enquire'],
  'event-planners': ['Services', 'Past events', 'Packages', 'Gallery', 'Check availability'],
  'lawyers-accountants': ['Practice areas', 'Team', 'Credentials', 'FAQ', 'Consultation request', 'Location'],
  travel: ['Packages', 'Destinations', 'Itineraries', 'Offers', 'Reviews', 'Enquire'],
  contractors: ['Services', 'Completed projects', 'Process', 'Service areas', 'Get an estimate'],
  'local-services': ['Services', 'Pricing', 'Service areas', 'Why us', 'Reviews', 'Call / WhatsApp'],
};

function buildDemos() {
  const now = new Date().toISOString();
  const out = BESPOKE.map((d, i) => ({
    id: 'dm_' + String(i + 1).padStart(3, '0'),
    ...d, template: d.slug, kind: 'bespoke', published: true, createdAt: now,
    description: d.description || `${d.style} template for ${d.category}.`,
  }));
  let n = out.length;
  for (const [category, list] of Object.entries(GENERATED)) {
    for (const [name, style, ink, accent, mode, description] of list) {
      n += 1;
      out.push({
        id: 'dm_' + String(n).padStart(3, '0'),
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        name, category, style, ink, accent, mode,
        tags: [style.split(' ')[0].toLowerCase(), mode, 'responsive'],
        sections: ['Navbar', 'Hero', ...GENERIC_SECTIONS[category], 'Footer'],
        template: 'generic', kind: 'generic', published: true, featured: false, premium: false,
        description: description || `${style} template for ${category}.`, createdAt: now,
      });
    }
  }
  return out;
}

const LEADS = [
  { id: 'L-1042', owner: 'Rohit Kulkarni', business: 'Spice Junction', category: 'restaurants', demo: 'urban-plate', phone: '98220 11234', whatsapp: '98220 11234', email: 'rohit@example.com', city: 'Pune', website: '', instagram: '', budget: '₹25,000–₹50,000', features: ['WhatsApp chat', 'Google Maps', 'Gallery'], message: 'Need the menu updated every week.', status: 'Contacted', value: 38000, priority: 'High', notes: 'Called on 6 Aug, wants to see two more restaurant options.', date: '2026-08-06' },
  { id: 'L-1041', owner: 'Dr. Anjali Deshpande', business: 'SmileWell Dental', category: 'clinics', demo: 'smilecare', phone: '99700 88221', whatsapp: '99700 88221', email: 'anjali@example.com', city: 'Nashik', website: '', instagram: '', budget: '₹50,000–₹1,00,000', features: ['Appointment system', 'Contact forms'], message: 'Two branches, both should be listed.', status: 'Proposal Sent', value: 65000, priority: 'High', notes: 'Proposal emailed 5 Aug.', date: '2026-08-04' },
  { id: 'L-1040', owner: 'Farah Sheikh', business: 'Blush Salon', category: 'salons', demo: 'velvet-studio', phone: '90040 55112', whatsapp: '90040 55112', email: '', city: 'Mumbai', website: '', instagram: '@blushsalon', budget: '₹10,000–₹25,000', features: ['Online booking', 'Gallery'], message: '', status: 'New', value: 22000, priority: 'Medium', notes: '', date: '2026-08-08' },
  { id: 'L-1039', owner: 'Suresh Patil', business: 'Patil Fabricators', category: 'manufacturers', demo: 'ironworks-industries', phone: '98901 23344', whatsapp: '98901 23344', email: 'suresh@example.com', city: 'Pimpri', website: '', instagram: '', budget: '₹25,000–₹50,000', features: ['Product catalogue', 'Contact forms'], message: 'Need a PDF catalogue download.', status: 'Won', value: 45000, priority: 'High', notes: 'Advance received. Kickoff 12 Aug.', date: '2026-07-29' },
  { id: 'L-1038', owner: 'Meera Nair', business: 'Aster Yoga', category: 'gyms', demo: 'aravind-wellness', phone: '97600 44557', whatsapp: '97600 44557', email: 'meera@example.com', city: 'Pune', website: '', instagram: '', budget: 'Under ₹10,000', features: ['WhatsApp chat'], message: 'Very small budget for now.', status: 'Lost', value: 9000, priority: 'Low', notes: "Went with a friend's cousin.", date: '2026-07-22' },
  { id: 'L-1037', owner: 'Imran Qureshi', business: 'Qureshi Kababs', category: 'restaurants', demo: 'tandoor-lane', phone: '98330 71829', whatsapp: '98330 71829', email: '', city: 'Mumbai', website: '', instagram: '@qureshikababs', budget: '₹10,000–₹25,000', features: ['WhatsApp chat', 'Gallery', 'Google Maps'], message: 'Only open at night, want that clear on the site.', status: 'Qualified', value: 18000, priority: 'Medium', notes: 'Wants the menu board look. Call after 4 pm.', date: '2026-08-07' },
  { id: 'L-1036', owner: 'Pooja Reddy', business: 'Little Scholars Preschool', category: 'coaching-classes', demo: 'vidya-point', phone: '99490 30217', whatsapp: '99490 30217', email: 'pooja@example.com', city: 'Hyderabad', website: '', instagram: '', budget: '₹25,000–₹50,000', features: ['Contact forms', 'Gallery', 'Online booking'], message: 'Admissions open in December, need it live before that.', status: 'Proposal Sent', value: 42000, priority: 'High', notes: 'Sent Business + booking. Following up Monday.', date: '2026-08-06' },
  { id: 'L-1035', owner: 'Vikram Shetty', business: 'Coastal Trails', category: 'travel', demo: 'wander-route', phone: '90080 66214', whatsapp: '90080 66214', email: 'vikram@example.com', city: 'Mangaluru', website: 'coastaltrails.in', instagram: '@coastaltrails', budget: '₹50,000–₹1,00,000', features: ['Online payments', 'Product catalogue', 'Blog'], message: 'Have an old WordPress site that keeps going down.', status: 'Negotiation', value: 78000, priority: 'High', notes: 'Wants migration from the old host included.', date: '2026-08-05' },
  { id: 'L-1034', owner: 'Anita Joshi', business: 'Joshi Interiors', category: 'interior-designers', demo: 'studio-terra', phone: '98600 22119', whatsapp: '98600 22119', email: '', city: 'Nagpur', website: '', instagram: '@joshiinteriors', budget: '₹25,000–₹50,000', features: ['Gallery', 'Contact forms'], message: 'Portfolio is on Instagram, can you pull it in?', status: 'Contacted', value: 35000, priority: 'Medium', notes: 'Explained Instagram embed vs manual upload.', date: '2026-08-04' },
  { id: 'L-1033', owner: 'Rajesh Kumar', business: 'Kumar Electricals', category: 'local-services', demo: 'sparktech-electricals', phone: '97170 45520', whatsapp: '97170 45520', email: '', city: 'Delhi', website: '', instagram: '', budget: 'Under ₹10,000', features: ['WhatsApp chat', 'Google Maps'], message: 'Just need people to find my number.', status: 'Won', value: 9500, priority: 'Medium', notes: 'Starter plan. Paid in cash, receipt issued.', date: '2026-08-02' },
  { id: 'L-1032', owner: 'Sneha Kulkarni', business: 'Threadwork Boutique', category: 'boutiques', demo: 'indigo-thread', phone: '90280 17734', whatsapp: '90280 17734', email: 'sneha@example.com', city: 'Kolhapur', website: '', instagram: '@threadworkkop', budget: '₹25,000–₹50,000', features: ['Ecommerce', 'Online payments', 'Product catalogue'], message: 'Want to sell online, about 40 pieces to start.', status: 'Qualified', value: 46000, priority: 'High', notes: 'Ecommerce add-on quoted. Wants a demo of the cart.', date: '2026-08-01' },
  { id: 'L-1031', owner: 'Deepak Rao', business: 'Rao & Rao Chartered Accountants', category: 'lawyers-accountants', demo: 'ledger-partners', phone: '99860 51203', whatsapp: '99860 51203', email: 'deepak@example.com', city: 'Bengaluru', website: '', instagram: '', budget: '₹25,000–₹50,000', features: ['Contact forms', 'Blog'], message: 'Need something sober. No stock photos of handshakes.', status: 'New', value: 38000, priority: 'Medium', notes: '', date: '2026-07-31' },
  { id: 'L-1030', owner: 'Fatima Ansari', business: 'Ansari Photography', category: 'photographers', demo: 'frame-light', phone: '98920 63348', whatsapp: '98920 63348', email: '', city: 'Mumbai', website: '', instagram: '@ansariphoto', budget: '₹10,000–₹25,000', features: ['Gallery', 'Contact forms'], message: 'Photos must load fast, that is the whole thing.', status: 'Contacted', value: 22000, priority: 'Medium', notes: 'Warned about 4MB uploads. Will send compressed set.', date: '2026-07-30' },
  { id: 'L-1029', owner: 'Harpreet Singh', business: 'Singh Fitness Club', category: 'gyms', demo: 'forge-fitness', phone: '98140 90072', whatsapp: '98140 90072', email: '', city: 'Chandigarh', website: '', instagram: '@singhfitness', budget: '₹10,000–₹25,000', features: ['Online booking', 'WhatsApp chat'], message: 'Free trial signup form is the main thing.', status: 'New', value: 24000, priority: 'High', notes: '', date: '2026-07-28' },
  { id: 'L-1028', owner: 'Lakshmi Menon', business: 'Menon Diagnostics', category: 'clinics', demo: 'northline', phone: '94470 28816', whatsapp: '94470 28816', email: 'lakshmi@example.com', city: 'Kochi', website: '', instagram: '', budget: '₹50,000–₹1,00,000', features: ['Appointment system', 'Customer login', 'Contact forms'], message: 'Patients should download reports themselves.', status: 'Negotiation', value: 92000, priority: 'High', notes: 'Report login is a dynamic build — scoping call booked.', date: '2026-07-26' },
  { id: 'L-1027', owner: 'Gopal Verma', business: 'Verma Furniture House', category: 'furniture', demo: 'oak-ash', phone: '94250 71190', whatsapp: '94250 71190', email: '', city: 'Indore', website: '', instagram: '', budget: '₹10,000–₹25,000', features: ['Product catalogue', 'Google Maps'], message: 'Showroom directions must be very clear.', status: 'Lost', value: 16000, priority: 'Low', notes: 'Decided to wait until after Diwali.', date: '2026-07-20' },
];

/* Plans, add-ons and domain prices. These live in settings.json so the admin
   panel can change a number without touching code. Everything the checkout
   adds up comes from here — the client never invents a price. */
const PLANS = [
  {
    id: 'starter', name: 'Starter', price: 7999, pages: 1, delivery: '3–4 working days',
    blurb: 'One long scrolling page. Enough for most shops, salons and small clinics.',
    includes: ['One page, every section', 'Your photos and prices', 'WhatsApp + call buttons', 'Google Maps embed', 'Mobile first', 'Free SSL', '1 round of changes'],
  },
  {
    id: 'business', name: 'Business', price: 14999, pages: 5, delivery: '5–7 working days', popular: true,
    blurb: 'Separate pages for services, gallery and contact. The usual pick.',
    includes: ['Up to 5 pages', 'Enquiry forms to your email', 'Gallery with your photos', 'Google Business + search setup', 'Speed and SEO basics', '3 rounds of changes', '30 days support'],
  },
  {
    id: 'premium', name: 'Premium', price: 24999, pages: 10, delivery: '8–12 working days',
    blurb: 'For bigger catalogues, multi-branch businesses and heavier content.',
    includes: ['Up to 10 pages', 'Catalogue or menu system', 'Multi-branch / multi-location', 'Blog or offers section', 'Analytics dashboard set up', 'Unlimited rounds for 2 weeks', '90 days support'],
  },
];

const ADDONS = [
  { id: 'booking', name: 'Online booking / appointments', price: 3500, note: 'Slots, confirmation on WhatsApp' },
  { id: 'payments', name: 'Online payments', price: 4500, note: 'UPI, cards, netbanking' },
  { id: 'catalogue', name: 'Product / menu catalogue', price: 3000, note: 'Up to 60 items' },
  { id: 'ecommerce', name: 'Full online shop', price: 9500, note: 'Cart, orders, stock — up to 50 products' },
  { id: 'login', name: 'Customer login area', price: 6000, note: 'Accounts, order history' },
  { id: 'blog', name: 'Blog / offers you can update', price: 2500, note: 'You post, no code' },
  { id: 'logo', name: 'Logo design', price: 2500, note: '3 options, source files' },
  { id: 'shoot', name: 'Photo shoot, half day', price: 5000, note: 'Pune / Mumbai only' },
  { id: 'gmb', name: 'Google Business profile setup', price: 1500, note: 'Maps, hours, photos, reviews link' },
];

const DOMAINS = [
  { tld: '.com', price: 1099, note: 'Most trusted' },
  { tld: '.in', price: 699, note: 'India' },
  { tld: '.co.in', price: 599, note: 'India, business' },
  { tld: '.net', price: 1299, note: '' },
  { tld: '.org', price: 1199, note: 'Trusts, NGOs' },
  { tld: '.shop', price: 899, note: 'Retail' },
  { tld: '.store', price: 1499, note: 'Retail' },
  { tld: '.online', price: 799, note: 'Cheap first year' },
];

const HOSTING = [
  { id: 'none', name: 'I will arrange hosting myself', price: 0, years: 0 },
  { id: 'h1', name: 'Hosting + SSL + email, 1 year', price: 1499, years: 1, recommended: true },
  { id: 'h2', name: 'Hosting + SSL + email, 2 years', price: 2699, years: 2 },
];

/* Sample orders, so the admin desk, the order table and the tracking page all
   have something in them on first boot. Every one is fictional; the images are
   the generated placeholders from public/img. Delete them with `npm run reset`
   once you have real ones — or from the Orders tab, one at a time. */
const img = (slug, v) => `/img/${slug}-${v}`;

function sampleCustomisation(o) {
  return {
    owner: o.owner, ownerRole: 'Owner', business: o.business,
    phone: o.phone, whatsapp: o.phone, email: o.email || '',
    city: o.city, address: o.address, hours: o.hours,
    instagram: o.instagram || '', website: '', category: o.category,
    eyebrow: o.eyebrow, heroTitle: o.heroTitle, heroText: o.heroText, tagline: '',
    ctaLabel: o.cta, aboutLabel: 'About us', aboutTitle: o.aboutTitle, about: o.about,
    points: o.points,
    servicesLabel: o.servicesLabel, servicesTitle: o.servicesLabel, servicesText: '',
    galleryTitle: 'Have a look', reviewsTitle: 'What customers say', visitTitle: 'Where to find us',
    ctaTitle: `Ready to visit ${o.business}?`,
    ctaText: 'Send us a message on WhatsApp and we will reply the same day.',
    accent: o.accent, ink: '#101820', mode: o.mode || 'light',
    font: o.font || 'modern', radius: o.radius || 'soft', layout: o.layout || 'split', topbar: true,
    logo: '', hero: img(o.category, 'hero'),
    gallery: [img(o.category, 1), img(o.category, 2), img(o.category, 3)],
    galleryMeta: o.captions || [],
    sampleImages: true,
    services: o.services, reviews: o.reviews,
    sections: { about: true, services: true, gallery: true, reviews: true, hours: true, cta: true },
    languages: o.languages || ['en'], i18n: o.i18n || {},
  };
}

const SAMPLE_ORDERS = [
  {
    id: 'SF-2401',
    captions: [
      { title: 'The main room', desc: 'Twenty tables, air conditioned, high chairs on request.' },
      { title: 'Sunday thali', desc: 'Seven items, unlimited rotis, served 12 to 3.' },
      { title: 'The tandoor', desc: 'Everything on the grill menu comes off this one.' },
    ], demo: 'urban-plate', demoName: 'Urban Plate', stage: 'Live',
    paymentStatus: 'Paid in full', method: 'upi', date: '2026-07-14',
    owner: 'Rohit Kulkarni', business: 'Spice Junction', phone: '98220 11234',
    email: 'rohit@example.com', city: 'Pune', address: '12 FC Road, Shivajinagar',
    hours: 'Tue – Sun · 11 am – 11 pm', instagram: '@spicejunctionpune',
    category: 'restaurants', accent: '#C2410C',
    eyebrow: 'Since 2011 · Pune', heroTitle: 'Pure veg, cooked to order',
    heroText: 'A family restaurant on FC Road. Thali at lunch, à la carte at night, delivery within five kilometres.',
    aboutTitle: 'Why people come back', cta: 'Book a table',
    about: 'Rohit\'s father opened this place with six tables in 2011. There are twenty now, the kitchen is still his, and the paneer tikka has not changed once.',
    points: ['Pure veg kitchen', 'Delivery in 30 minutes', 'Family tables'],
    servicesLabel: 'Menu',
    services: [
      { name: 'Paneer tikka masala', desc: 'Clay oven paneer, tomato and cream gravy', price: '₹280' },
      { name: 'Sunday thali', desc: 'Seven items, unlimited rotis', price: '₹320' },
      { name: 'Veg biryani', desc: 'Long grain rice, fried onion, raita', price: '₹240' },
      { name: 'Gulab jamun', desc: 'Warm, two pieces', price: '₹90' },
    ],
    reviews: [
      { text: 'Been coming here since college. Same taste, same uncle at the counter.', author: 'Sandeep J.' },
      { text: 'Ordered the thali for eight people at short notice. Ready in forty minutes.', author: 'Priya S.' },
    ],
    languages: ['en', 'mr'],
    i18n: { mr: { heroTitle: 'शुद्ध शाकाहारी, ताजं बनवलेलं', ctaLabel: 'टेबल बुक करा' } },
    selection: { planId: 'business', pages: 5, addons: ['booking', 'gmb'], extraLanguages: 1, hostingId: 'h1', domain: { mode: 'new', name: 'spicejunction', tld: '.in', years: 2, privacy: true, own: '' } },
  },
  {
    id: 'SF-2402',
    captions: [
      { title: 'Treatment room one', desc: 'Digital X-ray and a chair-side screen so you see what we see.' },
      { title: 'Reception', desc: 'Cashless insurance sorted here before you sit down.' },
      { title: 'Sterilisation bay', desc: 'Single-use kits, autoclaved instruments, logged daily.' },
    ], demo: 'smilecare', demoName: 'SmileCare', stage: 'Building',
    paymentStatus: 'Advance received', method: 'bank', date: '2026-07-29',
    owner: 'Dr. Anjali Deshpande', business: 'SmileWell Dental', phone: '99700 88221',
    email: 'anjali@example.com', city: 'Nashik', address: '4 College Road, Gangapur',
    hours: 'Mon – Sat · 9 am – 8 pm', category: 'clinics', accent: '#0E7490',
    mode: 'light', font: 'classic',
    eyebrow: 'Two dentists · Nashik', heroTitle: 'Root canals in a single sitting',
    heroText: 'Braces, implants and everyday dentistry on College Road. Cashless insurance accepted.',
    aboutTitle: 'A calm clinic', cta: 'Book appointment',
    about: 'Dr Anjali started with one chair in 2014. There are four now, and most patients still arrive because someone in their family sent them.',
    points: ['Same-day appointments', 'Cashless insurance', 'Sterile, single-use kits'],
    servicesLabel: 'Treatments',
    services: [
      { name: 'Consultation', desc: 'Twenty minutes, including X-ray if needed', price: '₹500' },
      { name: 'Root canal', desc: 'Single sitting, 45–60 minutes', price: '₹4,500' },
      { name: 'Braces & aligners', desc: 'Metal, ceramic and clear options', price: 'From ₹35,000' },
      { name: 'Implants', desc: 'Titanium, ten-year warranty', price: '₹28,000' },
    ],
    reviews: [
      { text: 'Quoted ₹18,000 for the implant and charged exactly that.', author: 'Feroz A.' },
      { text: 'Took my son in at 8 pm for a chipped tooth. Sorted in thirty minutes.', author: 'Rahul D.' },
    ],
    selection: { planId: 'business', pages: 6, addons: ['booking', 'gmb'], extraLanguages: 0, hostingId: 'h1', domain: { mode: 'new', name: 'smilewelldental', tld: '.in', years: 1, privacy: true, own: '' } },
  },
  {
    id: 'SF-2403',
    captions: [
      { title: 'The colour bar', desc: 'Four chairs, branded products only, no ammonia unless you ask.' },
      { title: 'Bridal room', desc: 'Private, seats six, for the trial and the day itself.' },
      { title: 'Wash station', desc: 'Where every appointment starts.' },
    ], demo: 'velvet-studio', demoName: 'Velvet Studio', stage: 'Content collected',
    paymentStatus: 'Advance received', method: 'upi', date: '2026-08-03',
    owner: 'Farah Sheikh', business: 'Blush Salon & Spa', phone: '90040 55112',
    city: 'Mumbai', address: 'Shop 3, Linking Road, Bandra West',
    hours: 'Tue – Sun · 10 am – 9 pm', instagram: '@blushsalonbandra',
    category: 'salons', accent: '#BE185D', radius: 'round',
    eyebrow: 'Bandra West', heroTitle: 'Colour, cuts and bridal',
    heroText: 'A small team on Linking Road. Walk in for a cut, book ahead for colour and bridal.',
    aboutTitle: 'The chair is yours', cta: 'Book a slot',
    about: 'Farah trained in Mumbai and London and opened Blush in 2018. Four chairs, branded products only, and nobody is rushed out.',
    points: ['Walk-ins welcome', 'Branded products only', 'Open till 9 pm'],
    servicesLabel: 'Services',
    services: [
      { name: 'Haircut & styling', desc: 'Consultation, wash, cut, blow-dry', price: '₹900' },
      { name: 'Global colour', desc: 'Ammonia-free, includes toner', price: '₹3,200' },
      { name: 'Bridal package', desc: 'Trial, mehendi day and wedding day', price: '₹24,000' },
    ],
    reviews: [
      { text: 'Asked for something between copper and pink. They got it first go.', author: 'Sanya M.' },
      { text: 'Booked for a 6 am shoot. They opened early without being asked twice.', author: 'Kabir S.' },
    ],
    selection: { planId: 'premium', pages: 8, addons: ['booking', 'payments', 'shoot'], extraLanguages: 0, hostingId: 'h2', domain: { mode: 'new', name: 'blushsalon', tld: '.com', years: 2, privacy: true, own: '' } },
  },
  {
    id: 'SF-2404',
    captions: [
      { title: 'CNC floor', desc: 'Nine machines across two shifts.' },
      { title: 'Inspection bench', desc: 'Every batch measured before it leaves.' },
      { title: 'Dispatch', desc: 'Packed and labelled for transport across India.' },
    ], demo: 'ironworks-industries', demoName: 'Ironworks Industries', stage: 'Order placed',
    paymentStatus: 'Awaiting advance', method: 'call', date: '2026-08-07',
    owner: 'Suresh Patil', business: 'Patil Fabricators', phone: '98901 23344',
    email: 'suresh@example.com', city: 'Pimpri', address: 'Plot 42, MIDC Bhosari',
    hours: 'Mon – Sat · 9 am – 6 pm', category: 'manufacturers', accent: '#3F4A5A',
    mode: 'dark', font: 'bold', radius: 'sharp', layout: 'image',
    eyebrow: 'MIDC Bhosari · Since 1998', heroTitle: 'Precision fabrication for auto parts',
    heroText: 'CNC machining and sheet metal work to ±0.02 mm. ISO 9001 certified, dispatching across India.',
    aboutTitle: 'Twenty-six years on the same plot', cta: 'Get a quotation',
    about: 'Suresh started with one lathe in 1998. The shop now runs nine machines across two shifts and supplies four tier-one auto suppliers.',
    points: ['ISO 9001 certified', 'Bulk orders welcome', 'Pan-India dispatch'],
    servicesLabel: 'Capabilities',
    services: [
      { name: 'CNC turning & milling', desc: 'Tolerances to ±0.02 mm', price: 'On enquiry' },
      { name: 'Sheet metal fabrication', desc: 'Laser cutting, bending, powder coating', price: 'On enquiry' },
      { name: 'Assembly & testing', desc: 'Sub-assemblies with test reports', price: 'On enquiry' },
    ],
    reviews: [
      { text: 'Held tolerance across a run of 4,000 parts. Two rejections total.', author: 'Purchase head, tier-1 supplier' },
    ],
    wantsDynamic: true,
    selection: { planId: 'premium', pages: 10, addons: ['catalogue', 'login'], extraLanguages: 0, hostingId: 'h1', domain: { mode: 'own', name: '', tld: '.com', years: 1, privacy: false, own: 'patilfabricators.com' } },
  },
  {
    id: 'SF-2405',
    captions: [
      { title: 'Gokarna, first light', desc: 'Day two of the coastal weekend, before the crowds.' },
      { title: 'The bus', desc: 'Twelve seats, and it leaves at 6 am sharp.' },
      { title: 'Agumbe ghats', desc: 'On the four-night Western Ghats route.' },
    ], demo: 'wander-route', demoName: 'Wander Route', stage: 'Review',
    paymentStatus: 'Advance received', method: 'card', date: '2026-08-01',
    owner: 'Vikram Shetty', business: 'Coastal Trails', phone: '90080 66214',
    email: 'vikram@example.com', city: 'Mangaluru', address: '2nd Floor, Balmatta Road',
    hours: 'Mon – Sat · 10 am – 7 pm', instagram: '@coastaltrails',
    category: 'travel', accent: '#0F766E', layout: 'image',
    eyebrow: 'Karnataka coast · Since 2016', heroTitle: 'Small groups, coastal roads',
    heroText: 'Weekend trips down the Karnataka coast and into the Western Ghats. Twelve people, one bus, no rush.',
    aboutTitle: 'How we run a trip', cta: 'Get an itinerary',
    about: 'Vikram drove these roads for eleven years before starting Coastal Trails. Every stop on every itinerary is somewhere he has actually eaten or slept.',
    points: ['Groups of twelve', 'All permits included', '24×7 on trip'],
    servicesLabel: 'Packages',
    services: [
      { name: 'Coastal weekend', desc: 'Two nights — Murudeshwar, Gokarna, Yana', price: '₹8,500 pp' },
      { name: 'Western Ghats, 4 nights', desc: 'Agumbe, Kudremukh, Sringeri', price: '₹18,000 pp' },
      { name: 'Custom private trip', desc: 'Your dates, your car, our route', price: 'On enquiry' },
    ],
    reviews: [
      { text: 'The homestay on night two was better than any hotel on the trip.', author: 'Sneha P.' },
      { text: 'Bus left at 6 am sharp, which never happens. Booked again.', author: 'Arun M.' },
    ],
    selection: { planId: 'business', pages: 6, addons: ['payments', 'gmb'], extraLanguages: 0, hostingId: 'h2', domain: { mode: 'own', name: '', tld: '.com', years: 1, privacy: false, own: 'coastaltrails.in' } },
    submissions: [
      { note: 'Attached the new monsoon rates and two photos from last week\'s Gokarna trip. Please swap the header picture.', images: 2, at: '2026-08-05T09:20:00.000Z' },
      { note: 'One correction — the Ghats trip is 4 nights now, not 3.', images: 0, at: '2026-08-07T17:41:00.000Z' },
    ],
  },
  {
    id: 'SF-2406',
    captions: [
      { title: 'This week\'s cottons', desc: 'New drop every Friday, one piece per size.' },
      { title: 'The stitching table', desc: 'Blouses back in five days, your fabric or ours.' },
      { title: 'Handloom sarees', desc: 'Ilkal, Paithani and Narayanpet, bought direct from weavers.' },
    ], demo: 'indigo-thread', demoName: 'Indigo Thread', stage: 'Advance received',
    paymentStatus: 'Advance received', method: 'upi', date: '2026-08-05',
    owner: 'Sneha Kulkarni', business: 'Threadwork Boutique', phone: '90280 17734',
    email: 'sneha@example.com', city: 'Kolhapur', address: 'Shop 8, Rajarampuri 5th Lane',
    hours: 'Mon – Sat · 11 am – 8 pm', instagram: '@threadworkkop',
    category: 'boutiques', accent: '#9D174D', font: 'editorial', radius: 'round',
    eyebrow: 'Handloom · Kolhapur', heroTitle: 'Cotton and silk, cut to fit',
    heroText: 'Handloom pieces from Maharashtra weavers, and stitching done in the shop. Ready in five days.',
    aboutTitle: 'Where the fabric comes from', cta: 'Order on WhatsApp',
    about: 'Sneha buys directly from weavers in Ichalkaranji and Guledgudda. Nothing is mass produced, so sizes run one at a time.',
    points: ['New drops every Friday', 'Stitching in 5 days', 'Exchange in 7 days'],
    servicesLabel: 'Collections',
    services: [
      { name: 'Cotton kurta sets', desc: 'Daily wear, sizes S to XXL', price: 'From ₹1,400' },
      { name: 'Handloom sarees', desc: 'Ilkal, Paithani and Narayanpet', price: 'From ₹4,200' },
      { name: 'Blouse stitching', desc: 'Your fabric, our fit', price: '₹900' },
    ],
    reviews: [
      { text: 'Blouse fit first time, no alteration needed. That never happens.', author: 'Manisha K.' },
    ],
    languages: ['en', 'mr'],
    i18n: { mr: { heroTitle: 'सुती आणि रेशमी, तुमच्या मापाचे', ctaLabel: 'व्हॉट्सअ‍ॅपवर ऑर्डर करा' } },
    selection: { planId: 'business', pages: 5, addons: ['ecommerce', 'payments'], extraLanguages: 1, hostingId: 'h1', domain: { mode: 'new', name: 'threadworkboutique', tld: '.in', years: 1, privacy: true, own: '' } },
    submissions: [
      { note: 'Sending 6 photos of the new cotton range. Prices are on the back of each tag in the photos.', images: 3, at: '2026-08-06T12:05:00.000Z' },
    ],
  },
  {
    id: 'SF-2407',
    captions: [
      { title: 'Studio at Aram Nagar', desc: 'Two hours, natural light until four.' },
      { title: 'Wedding, December', desc: 'Two days, two photographers, one cinematographer.' },
      { title: 'The kit', desc: 'Two bodies and four primes. Backups for everything.' },
    ], demo: 'frame-light', demoName: 'Frame & Light', stage: 'Order placed',
    paymentStatus: 'Awaiting advance', method: 'call', date: '2026-08-08',
    owner: 'Fatima Ansari', business: 'Ansari Photography', phone: '98920 63348',
    city: 'Mumbai', address: 'Studio 4, Aram Nagar, Versova',
    hours: 'By appointment', instagram: '@ansariphoto',
    category: 'photographers', accent: '#243244', mode: 'dark', font: 'classic', layout: 'image',
    eyebrow: 'Weddings & portraits · Mumbai', heroTitle: 'Photographs that still look right in ten years',
    heroText: 'Weddings, portraits and the occasional album for a restaurant. Fatima shoots, edits and delivers herself.',
    aboutTitle: 'How I work', cta: 'Check my dates',
    about: 'I shoot one wedding a weekend so nothing is rushed. Edited photographs are with you in fifteen days, and the raw files are yours if you want them.',
    points: ['One wedding a weekend', 'Edited in 15 days', 'Album included'],
    servicesLabel: 'Packages',
    services: [
      { name: 'Wedding, two days', desc: 'Two photographers, one cinematographer', price: '₹1,20,000' },
      { name: 'Pre-wedding shoot', desc: 'Half day, one location, 40 edited photos', price: '₹25,000' },
      { name: 'Portrait sitting', desc: 'Two hours in the studio, 15 retouched', price: '₹9,000' },
    ],
    reviews: [
      { text: 'She noticed my grandmother was tired and got the family shot done first. Small thing, meant a lot.', author: 'Zoya R.' },
      { text: 'Album arrived in twelve days. Quality is better than the sample.', author: 'Nikhil D.' },
    ],
    selection: { planId: 'starter', pages: 3, addons: ['logo'], extraLanguages: 0, hostingId: 'h1', domain: { mode: 'new', name: 'ansariphotography', tld: '.com', years: 2, privacy: true, own: '' } },
  },
  {
    id: 'SF-2408',
    captions: [
      { title: 'The showroom', desc: 'MG Road, open till 9, parking behind the building.' },
      { title: 'Sheesham dining', desc: 'Six and eight seaters, made in our own workshop.' },
      { title: 'The workshop', desc: 'Same joinery since 1974.' },
    ], demo: 'oak-ash', demoName: 'Oak & Ash', stage: 'Cancelled',
    paymentStatus: 'Refunded', method: 'bank', date: '2026-07-18',
    owner: 'Gopal Verma', business: 'Verma Furniture House', phone: '94250 71190',
    city: 'Indore', address: 'MG Road, near Palasia Square',
    hours: 'Mon – Sun · 10 am – 9 pm', category: 'furniture', accent: '#92400E',
    eyebrow: 'Solid wood · Indore', heroTitle: 'Sheesham and teak, made to last',
    heroText: 'Beds, dining sets and wardrobes built in our own workshop. Delivery and assembly across Indore.',
    aboutTitle: 'Three generations', cta: 'Visit the showroom',
    about: 'The workshop opened in 1974 and the joinery has not changed. What has changed is that people now want to see it online first.',
    points: ['Solid wood only', 'Free city delivery', '5-year warranty'],
    servicesLabel: 'Categories',
    services: [
      { name: 'Beds with storage', desc: 'Queen and king, hydraulic lift', price: 'From ₹28,000' },
      { name: 'Dining sets', desc: '4, 6 and 8 seater in sheesham', price: 'From ₹24,000' },
      { name: 'Wardrobes', desc: 'Two and three door, mirror optional', price: 'From ₹32,000' },
    ],
    reviews: [
      { text: 'Delivered and assembled the same day. No scratches.', author: 'Ramesh T.' },
    ],
    selection: { planId: 'starter', pages: 1, addons: ['gmb'], extraLanguages: 0, hostingId: 'none', domain: { mode: 'new', name: 'vermafurniture', tld: '.in', years: 1, privacy: false, own: '' } },
  },
];

const SETTINGS = {
  brand: 'The Frendzo',
  startingPrice: 7999,
  whatsapp: '+91 98765 43210',
  email: 'hello@example.com',
  city: 'Pune, Maharashtra',
  adminPassword: 'admin',
  tagline: 'Pick a design you like. Tell us about your business. We put your name, photos and prices on it and get it online.',
  plans: PLANS,
  addons: ADDONS,
  domains: DOMAINS,
  hosting: HOSTING,
  extraPagePrice: 1500,
  extraLanguagePrice: 2000,
  domainPrivacyPrice: 299,
  gstPercent: 18,
  advancePercent: 50,
  upiId: 'thefrendzo@upi',
  dynamicNote: 'Everything above is a fast static website — perfect if your content changes now and then and we make the edits for you. If you want a dynamic system instead — your own admin panel, customer logins, live stock and prices, bookings with a calendar, dashboards, reports, an app-style backend — we build that too. It is quoted per project because no two are the same. Talk to us and we will scope it on a call.',
};

/* Quotes are computed with the same pricing function the checkout uses, so the
   sample orders add up exactly like a real one and stay correct if you edit a
   price in settings. */
function buildProjects() {
  return SAMPLE_ORDERS.map((o) => {
    const q = quote(o.selection, SETTINGS);
    const stamp = new Date(o.date + 'T10:00:00.000Z').toISOString();
    return {
      id: o.id, demo: o.demo, demoName: o.demoName,
      customer: {
        owner: o.owner, business: o.business, phone: o.phone, whatsapp: o.phone,
        email: o.email || '', city: o.city, category: o.category,
        address: o.address, instagram: o.instagram || '', website: '',
      },
      customisation: sampleCustomisation(o),
      selection: o.selection,
      quote: q,
      payment: {
        method: o.method,
        status: o.paymentStatus,
        advance: q.advance,
        balance: o.paymentStatus === 'Paid in full' ? 0 : q.balance,
      },
      wantsDynamic: !!o.wantsDynamic,
      // Content the customer sent in after ordering. Seeded ones point at the
      // sample photography rather than carrying data URLs, so the demo data
      // stays small — the admin panel renders either.
      submissions: (o.submissions || []).map((sub, n) => ({
        id: `sub_seed_${o.id}_${n}`,
        at: sub.at,
        note: sub.note,
        images: Array.from({ length: sub.images || 0 }, (_, k) => ({
          name: `${o.category}-photo-${k + 1}.jpg`,
          data: img(o.category, (k % 5) + 1),
        })),
      })),
      notes: '', status: 'New', stage: o.stage,
      date: o.date, createdAt: stamp, updatedAt: stamp,
      sample: true,
    };
  });
}

export {
  CATEGORIES, buildDemos, buildProjects, LEADS, SETTINGS,
  GENERIC_SECTIONS, PLANS, ADDONS, DOMAINS, HOSTING, SAMPLE_ORDERS,
};
