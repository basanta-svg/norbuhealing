// Single place to edit contact details, navigation and department basics.
// Content comes from "Norbu_Healing_Website_Content.docx". Items marked CONFIRM are awaiting client confirmation.
export const site = {
  name: 'Norbu Healing',
  tagline: 'Healing • Beauty • Hospitality • Education',
  url: 'https://norbuhealing.com',
  email: 'enquiry@norbuhealing.com',
  address: 'Changjalu, Olakha, Thimphu, Bhutan',
  addressShort: 'Changjalu, Olakha, Thimphu',
  // CONFIRM: general hours apply to every department? Add department-specific hours before launch.
  hours: '10:00 AM – 8:00 PM',
  mapEmbed: 'https://www.google.com/maps?q=Changjalu%2C%20Olakha%2C%20Thimphu%2C%20Bhutan&output=embed',
  // CONFIRM: replace with the exact map pin once supplied.
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Changjalu%2C%20Olakha%2C%20Thimphu%2C%20Bhutan',
  // CONFIRM: WhatsApp number in international format, digits only (975 = Bhutan). Currently the Healing Arts Centre line.
  whatsapp: '97517714050',
  whatsappText: 'Hello Norbu Healing, I would like to make an enquiry.',
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT ?? '',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about/' },
    { label: 'Healing', href: '/healing/' },
    { label: 'Hotel', href: '/hotel/' },
    { label: 'Salon', href: '/salon/' },
    { label: 'Institute', href: '/institute/' },
    { label: 'Offers', href: '/offers/' },
    { label: 'Contact', href: '/contact/' },
  ],
};

export type DeptKey = 'healing' | 'hotel' | 'salon' | 'institute';

export const departments: {
  key: DeptKey; name: string; short: string; href: string; image: string; blurb: string; cta: string; phones: string[]; icon: 'lotus' | 'candle' | 'sun' | 'leaf';
}[] = [
  {
    key: 'healing', name: 'Norbu Healing Arts Centre', short: 'Healing', href: '/healing/', image: 'spa-window', icon: 'lotus',
    blurb: 'A dedicated wellness and healing centre offering therapeutic treatments, Bhutanese-inspired healing practices, spa therapies and relaxation experiences designed to support well-being.',
    cta: 'Explore Healing', phones: ['17714050', '77714050', '02341192'],
  },
  {
    key: 'hotel', name: 'Norbu Healing Hotel', short: 'Hotel', href: '/hotel/', image: 'room-couple', icon: 'candle',
    blurb: 'A comfortable and welcoming hospitality destination offering accommodation, dining and convenient access to other experiences within the Norbu Healing ecosystem.',
    cta: 'Explore Hotel', phones: ['17534016'],
  },
  {
    key: 'salon', name: 'Norbu Healing Salon', short: 'Salon', href: '/salon/', image: 'salon-floor', icon: 'sun',
    blurb: 'A professional hair and beauty destination offering hair services, advanced hair treatments, skincare, facials, grooming and personalized self-care.',
    cta: 'Explore Salon', phones: ['17966100'],
  },
  {
    key: 'institute', name: 'Norbu International Wellness Institute', short: 'Institute', href: '/institute/', image: 'spa-twin-2', icon: 'leaf',
    blurb: 'A professional training institute focused on practical learning and skill development in spa, massage, hair and beauty, supporting learners as they prepare for career opportunities.',
    cta: 'Explore Institute', phones: ['77966100'],
  },
];

export const dept = (k: DeptKey) => departments.find((d) => d.key === k)!;

export const elements = [
  { name: 'Space', icon: 'figure', text: 'Room to pause, reflect and restore.' },
  { name: 'Earth', icon: 'mandala', text: 'Grounding, stability and connection with nature.' },
  { name: 'Fire', icon: 'fire', text: 'Warmth, energy and renewal.' },
  { name: 'Water', icon: 'water', text: 'Flow, refreshment and adaptability.' },
  { name: 'Wind', icon: 'wind', text: 'Movement, breath and a sense of lightness.' },
] as const;

export const featured = [
  { dept: 'healing' as DeptKey, title: 'Healing & Wellness', items: ['Norbu Arts of Healing / Signature Healing', 'Sports & Trekking Healing', 'Foot Reflexology', 'Sinusitis, Migraine & Headache Healing'] },
  { dept: 'salon' as DeptKey, title: 'Salon', items: ['Haircut & Styling', 'Hair Treatments', 'Nanoplastia', 'Hydrafacial', 'Japanese Head Spa', 'Grooming & Beauty Services'] },
  { dept: 'hotel' as DeptKey, title: 'Hotel & Dining', items: ['Deluxe Couple Room', 'Deluxe Twin Room', 'Norbu Healing Restaurant', 'Norbu Healing Bar', 'Green Cafe'] },
  { dept: 'institute' as DeptKey, title: 'Institute', items: ['Spa & Massage Therapy', 'Hair & Beauty Therapy', 'Cosmetology', 'Short-term professional beauty and wellness courses, when offered'] },
];

// ---------- Healing Arts Centre services (CONFIRM duration / price with the centre; 60 or 90 min suggested) ----------
export const healingServices = [
  { title: 'Norbu Arts of Healing / Signature Healing', text: 'A signature wellness experience shaped around the Norbu Healing Arts Centre philosophy. Enquire with our team about the available treatment options and the experience best suited to your preferences.' },
  { title: 'Sports & Trekking Healing', text: 'A wellness treatment option for sportspeople, active individuals and trekkers seeking care before or after physical activity. Let our team know about your activity and preferences when enquiring.' },
  { title: 'Foot Reflexology', text: 'A focused foot treatment designed to provide a relaxing pause and a sense of comfort after a busy day or physical activity.' },
  { title: 'Sinusitis, Migraine & Headache Healing', text: 'Ask our team about available comfort-focused wellness sessions for clients experiencing tension or seeking relaxation around the head and sinus area. Persistent, severe or unusual symptoms should be assessed by a qualified healthcare professional.' },
  { title: 'Back & Neck Healing', text: 'A targeted wellness experience for people seeking relaxation around the back, shoulders and neck. Treatment suitability and pressure should be discussed with the therapist before the session.' },
  { title: 'Frozen Shoulder, Myofascial & Trigger Point Services', text: 'Enquire about the centre’s available focused bodywork options. The team can discuss whether a session is appropriate for your needs; persistent pain or restricted movement should be assessed by a healthcare professional.' },
  { title: 'Personalized Healing Experiences', text: 'Speak with our team about your preferences, comfort and wellness goals so we can help you choose an appropriate experience.' },
  { title: 'Wellness Packages', text: 'Ask about current wellness packages and combined experiences. Available packages and prices are updated by the Norbu Healing team.' },
];

// ---------- Salon ----------
export const salonGroups = [
  { title: 'Hair', icon: 'sun', text: 'Haircuts, styling and hair colouring tailored to the client’s desired look and personal style.', items: ['Haircuts', 'Hair styling', 'Hair colouring', 'Highlights and other colour services, where available'] },
  { title: 'Advanced hair treatments', icon: 'leaf', text: 'Treatment options for clients seeking smoother-looking, more manageable or cared-for hair. A consultation helps determine which treatment is suitable for the client’s hair condition.', items: ['Nanoplastia', 'Hair repair treatments', 'Keratin or other smoothing treatments, where currently offered'] },
  { title: 'Skincare & facial treatments', icon: 'lotus', text: 'Facial and skincare services designed around individual preferences and skin-care goals.', items: ['Hydrafacial', 'Other facial treatments currently offered'] },
  { title: 'Wellness & beauty', icon: 'water', text: 'Services that make time for self-care, grooming and personal presentation.', items: ['Japanese Head Spa', 'Grooming services', 'Manicure', 'Pedicure', 'Other beauty services currently offered'] },
];

// ---------- Hotel (CONFIRM rates, occupancy and amenities before showing them) ----------
export const rooms = [
  { title: 'Deluxe Couple Room', text: 'A room option designed for couples or guests who prefer a shared bed. Contact our team for current rates, availability, room details and confirmed amenities.', image: 'room-couple' },
  { title: 'Deluxe Twin Room', text: 'A room option featuring separate beds, suitable for guests who prefer twin accommodation. Contact our team for current rates, availability, room details and confirmed amenities.', image: 'room-twin' },
];

export const dining = [
  { title: 'Norbu Healing Restaurant', image: 'restaurant',
    text: 'Enjoy a welcoming dining experience at Norbu Healing Restaurant. The restaurant offers guests and visitors a place to enjoy a meal as part of the Norbu Healing hospitality experience.',
    note: 'Featured dishes may include selected house specials such as chicken or vegetable pulao, chicken masala, paneer masala, biryani, grilled cheese sandwiches and fresh vegetables with rice. Please confirm the current menu and availability with the restaurant.',
    cta: 'Enquire About Dining', href: '/contact/' },
  { title: 'Norbu Healing Bar', image: 'reception',
    text: 'Norbu Healing Bar forms part of the hotel’s hospitality offering, providing a place for guests to unwind. Current details, service hours and offerings are available from the hotel team.',
    cta: 'Contact the Hotel', href: '/contact/' },
  { title: 'Green Cafe', image: 'corridor-2',
    text: 'Green Cafe is part of the Norbu Healing dining experience. Ask the hotel team about the cafe’s menu, atmosphere, opening hours and special offerings.',
    cta: 'Explore Green Cafe', href: '/contact/' },
];

// ---------- Institute (CONFIRM duration, level, fees, certification, intakes before showing them) ----------
export const primaryCourses = [
  { title: 'Spa & Massage Therapy', text: 'A professional learning pathway focused on spa and massage therapy skills. Course outline, duration, level, entry requirements, fees and certification details are shared by the institute on enquiry.' },
  { title: 'Hair & Beauty Therapy', text: 'A practical learning pathway for individuals interested in hair and beauty services. Curriculum, duration, level, entry requirements, fees and certification details are shared by the institute on enquiry.' },
];

export type CourseStatus = 'Enrolling Now' | 'Upcoming' | 'Not Currently Available' | 'Ask About Availability';
export const additionalCourses: { title: string; status: CourseStatus }[] = [
  'Microblading', 'Eyelash extensions', 'Lip shading', 'Eyeliner tattoo', 'Lash lifting', 'Advanced haircut', 'Professional cosmetology',
].map((title) => ({ title, status: 'Ask About Availability' as CourseStatus }));

// Course details shown on every course card. Replace 'To be confirmed' once the institute verifies each value.
export const courseFields = ['Duration', 'Level', 'Certification', 'Course fee', 'Upcoming intake', 'Entry requirements', 'Application deadline'];

// Training schedule rows (admin-editable). Empty until the institute publishes intakes.
export const schedule: { course: string; trainer: string; dates: string; time: string; fee: string; seats: string; deadline: string; status: 'Enrolling' | 'Upcoming' | 'Full' | 'Closed' }[] = [];

export const trainers: { name: string; title: string; qualifications: string; experience: string; specialization: string; image?: string }[] = [];

export const healingServiceNames = healingServices.map((s) => s.title);
export const salonServiceNames = salonGroups.flatMap((g) => g.items.filter((i) => !/where|currently|other/i.test(i)));
export const courseNames = [...primaryCourses.map((c) => c.title), ...additionalCourses.map((c) => c.title)];
