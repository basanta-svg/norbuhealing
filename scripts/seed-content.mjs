// Seeds src/content/* with starter Markdown. Safe to re-run (overwrites). Edit the generated .md files afterwards.
import fs from 'node:fs';

const w = (dir, slug, fm, body) => {
  fs.mkdirSync(`src/content/${dir}`, { recursive: true });
  const y = Object.entries(fm).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n');
  fs.writeFileSync(`src/content/${dir}/${slug}.md`, `---\n${y}\n---\n\n${body.trim()}\n`);
};

const services = [
  ['mindful-vinyasa-flow', 'Mindful Vinyasa Flow', 'Breath-led movement that links each posture into one steady, flowing practice.', 'service-vinyasa', '60 min', 'Nu 900 / class', 'All levels',
    ['Builds strength and flexibility', 'Calms a busy mind', 'Improves posture and balance', 'Leaves you energised, not drained'],
    'Vinyasa means "to place in a special way". In this class every movement is matched to a breath, so the practice becomes a moving meditation. Our teachers keep the pace unhurried and offer options for every body, so you can explore without strain.'],
  ['private-yoga-sessions', 'Private Yoga Sessions', 'One-to-one guidance shaped around your body, your goals and your pace.', 'service-private', '75 min', 'Nu 2,200 / session', 'All levels',
    ['A plan built around your needs', 'Gentle correction and alignment', 'Ideal for injury recovery', 'Flexible time and place'],
    'Your teacher begins with a short conversation about how you feel and what you hope for. From there the session is entirely yours: therapeutic movement, breathwork, or a quiet practice for a stressful season.'],
  ['restorative-yoga-relaxation', 'Restorative Yoga & Relaxation', 'Supported, slow postures held long enough for the nervous system to truly settle.', 'service-restorative', '75 min', 'Nu 1,000 / class', 'All levels',
    ['Deep rest for body and mind', 'Eases tension and poor sleep', 'No flexibility needed', 'Props and blankets provided'],
    'Bolsters, blankets and blocks hold you so that effort can fall away. Each pose is held for several minutes while the teacher guides you through slow breathing and a closing relaxation.'],
  ['yoga-for-beginners', 'Yoga for Beginners', 'A friendly introduction to the basics: alignment, breath and how to listen to your body.', 'service-beginners', '60 min', 'Nu 800 / class', 'Beginner',
    ['Learn foundations safely', 'Small, supportive groups', 'No experience required', 'Take-home practice notes'],
    'New to yoga? Start here. We break down the essential postures, explain how to use props and show how to adapt each pose. You will leave knowing what to practise at home and feeling welcome in the studio.'],
  ['breathwork-meditation', 'Breathwork & Meditation', 'Simple breathing and sitting practices to steady attention and soften stress.', 'service-breathwork', '45 min', 'Nu 700 / class', 'All levels',
    ['Reduces everyday stress', 'Sharpens focus', 'Easy techniques to use anywhere', 'Rooted in Himalayan tradition'],
    'We teach practical pranayama and meditation in plain language. Expect guided breathing, a short sit in silence and time to reflect, drawing on contemplative traditions of the Himalayas.'],
  ['prenatal-yoga', 'Prenatal Yoga', 'Gentle, safe movement and breath for every stage of pregnancy.', 'service-prenatal', '60 min', 'Nu 900 / class', 'Pregnancy',
    ['Eases back and hip discomfort', 'Prepares breath for labour', 'Connects you with other parents-to-be', 'Taught by a trained specialist'],
    'Designed for the second and third trimesters, this class focuses on comfort, strength in the pelvic floor and calm breathing. Please check with your doctor or midwife before joining.'],
  ['sound-bowl-healing', 'Sound Bowl Healing', 'Lie back and let the resonance of hand-hammered bowls carry you into deep stillness.', 'service-sound-bowl', '60 min', 'Nu 1,200 / session', 'All levels',
    ['Profound relaxation', 'Supports restful sleep', 'No effort required', 'Traditional Himalayan bowls'],
    'Bowls, gongs and chimes create layers of sound that wash through the body. Most people drift into a meditative state within minutes. Bring a blanket and let the sound do the work.'],
  ['himalayan-herbal-therapy', 'Himalayan Herbal Therapy', 'Warm herbal compresses, teas and oils inspired by traditional Himalayan medicine.', 'service-herbal', '90 min', 'Nu 2,800 / session', 'All levels',
    ['Soothes tired muscles', 'Uses locally sourced herbs', 'Calming aromas and warmth', 'Includes a herbal tea ritual'],
    'Our therapists combine herbal compresses, gentle massage and a closing tea ceremony. The treatment draws on traditional knowledge of mountain plants valued for their grounding, warming qualities.'],
];
services.forEach(([slug, title, summary, image, duration, price, level, benefits, body], i) =>
  w('services', slug, { title, summary, image, order: i + 1, duration, price, level, benefits }, body));

const events = [
  ['an-evening-of-wellness', 'An Evening of Wellness', 'A gentle flow, guided meditation and herbal tea by candlelight.', 'event-wellness', '2026-11-19', '5:30 PM – 8:00 PM'],
  ['sunset-yoga-session', 'Sunset Yoga Session', 'An open-air practice as the valley turns gold, finishing with a quiet sit.', 'event-sunset', '2026-12-05', '4:30 PM – 6:00 PM'],
  ['full-moon-sound-bath', 'Full Moon Sound Bath', 'Rest beneath the full moon while bowls and gongs fill the studio.', 'event-sound', '2026-12-24', '7:00 PM – 8:30 PM'],
  ['weekend-silent-retreat', 'Weekend Silent Retreat', 'Two days of yoga, meditation and mindful silence in the mountains.', 'event-retreat', '2027-01-16', 'Sat 8:00 AM – Sun 5:00 PM'],
];
events.forEach(([slug, title, summary, image, date, time]) =>
  w('events', slug, { title, summary, image, date, time, host: 'Norbu Healing' }, `${summary} Spaces are limited. Book early to reserve your mat and bring a blanket, water bottle and an open heart.`));

const blog = [
  ['finding-calm-in-five-minutes', 'Finding Calm in Five Minutes a Day', 'Yoga & Movement', 'blog-mat', '2026-10-12', 'Short, steady practices matter more than long, occasional ones. Here is how to begin.',
    ['Many of us believe that a meaningful practice needs an hour on the mat. In truth, five mindful minutes done daily can change how you meet your day. Consistency teaches the body that rest is available whenever it is needed.', 'Begin by choosing a fixed moment: after brushing your teeth, before your first cup of tea or just as you finish work. Anchoring practice to something you already do removes the need for willpower.', 'Start seated. Lengthen your spine, close your eyes and take five slow breaths, counting the exhale a little longer than the inhale. This lengthened exhale signals safety to the nervous system and gently lowers the heart rate.', 'Next, add two or three simple movements: a cat-cow to wake the spine, a seated twist on each side, and a forward fold to release the neck. Move slowly and let the breath set the pace.', 'Finish with thirty seconds of stillness. Notice how your body feels without trying to change it. That small act of noticing is the heart of mindfulness.', 'If you miss a day, simply begin again tomorrow. There is no streak to protect, only a relationship to nurture. Over weeks, these tiny pauses add up to a calmer baseline, better sleep and a kinder inner voice.', 'Our beginners classes at Norbu Healing teach exactly this kind of sustainable routine, so you can carry the studio home with you.']],
  ['why-we-breathe-the-way-we-do', 'Why We Breathe the Way We Do', 'Breathwork', 'blog-back', '2026-09-28', 'Breath is the one automatic function we can also steer. Learn how to use it.',
    ['Breathing is both automatic and voluntary, which makes it a rare doorway into the nervous system. When we are anxious, the breath becomes quick and high in the chest. When we are at ease, it slows and drops into the belly.', 'The good news is that the relationship works in reverse too. By slowing the breath on purpose, we can nudge the body toward calm. This is the foundation of pranayama, the breath practices that yoga has refined for centuries.', 'A simple place to begin is diaphragmatic breathing. Lie down with a hand on your belly. Inhale through the nose and feel the hand rise; exhale slowly and feel it fall. Aim for a smooth, unforced rhythm.', 'Once that feels natural, try an extended exhale: inhale for a count of four and exhale for a count of six. Repeat for two or three minutes. Most people notice a softening in the shoulders and jaw.', 'Avoid forcing or holding the breath in the beginning. Comfort is the goal. If you feel dizzy, return to normal breathing and rest.', 'In our Breathwork & Meditation classes we layer these techniques with gentle sitting practice, giving you tools you can use before a meeting, on a crowded bus or when sleep will not come.']],
  ['the-quiet-power-of-prayer-flags', 'The Quiet Power of Prayer Flags', 'Himalayan Wisdom', 'blog-bhutan-flags', '2026-09-10', 'Across Bhutan, coloured flags carry wishes for compassion on the wind.',
    ['Travel through Bhutan and you will see them everywhere: strings of coloured cloth fluttering from ridges, bridges and monastery roofs. Each flag is printed with prayers and mantras, and each carries a simple intention for the well-being of all beings.', 'The five colours represent the five elements: blue for sky, white for air, red for fire, green for water and yellow for earth. Together they express balance, the same balance we seek in our own bodies and minds.', 'The wind is believed to carry the blessings outward, so the flags are hung in high, open places. As the cloth fades and frays, the prayers are understood to dissolve into the world, a reminder that nothing is permanent and that giving is a natural motion.', 'You do not need to be in the mountains to borrow the idea. Try beginning your practice by setting an intention for someone other than yourself. Let it travel with each exhale.', 'At Norbu Healing we draw gently on this spirit of open-hearted generosity. It is a quiet thread that runs through our classes, our herbal therapies and the way we welcome every guest.']],
  ['a-mindful-cup-of-tea', 'A Mindful Cup of Tea', 'Mindful Living', 'blog-tea', '2026-08-22', 'Turn a daily habit into a small ritual of presence.',
    ['Tea is one of the simplest ways to practise mindfulness because the ritual is already built in. There is a kettle to watch, a cup to hold and warmth to feel. All you need to add is attention.', 'Begin by preparing the tea slowly. Notice the sound of the water, the colour of the leaves as they unfurl and the steam rising. Resist the urge to check your phone.', 'When you lift the cup, feel its weight and warmth in your hands. Take a moment to smell the tea before the first sip. Then drink slowly, noticing flavour, temperature and the sensation of swallowing.', 'You may notice your mind wandering to tasks and worries. That is perfectly normal. Each time you notice, gently return to the cup. The returning is the practice.', 'Even one mindful cup a day can create a pocket of calm in a busy schedule. After our Himalayan herbal therapy sessions we always finish with tea for exactly this reason: to help the body and mind integrate what they have received.']],
  ['journaling-for-a-quieter-mind', 'Journaling for a Quieter Mind', 'Mindful Living', 'blog-journal', '2026-08-04', 'Writing a few lines each evening can untangle racing thoughts.',
    ['When thoughts loop endlessly, getting them onto paper can ease the pressure. Journaling is not about beautiful writing. It is a way of letting the mind set down what it has been carrying.', 'Choose a notebook you enjoy and keep it by your bed. Each evening, spend five minutes writing without editing. You might list three things that went well, one thing that challenged you and one intention for tomorrow.', 'If you feel stuck, try a simple prompt: What does my body need right now? What am I grateful for? What can I let go of tonight?', 'Pairing journaling with a short breathing practice deepens the effect. Take five slow breaths before you write, and notice how the words change when you begin from stillness.', 'Over time, your pages become a map of patterns: what drains you, what restores you and where you are growing. That awareness is a quiet kind of healing.']],
  ['himalayan-stillness-in-everyday-life', 'Himalayan Stillness in Everyday Life', 'Himalayan Wisdom', 'blog-himalaya', '2026-07-15', 'The mountains teach patience. You can bring a little of that spaciousness home.',
    ['Standing before a vast Himalayan valley, many people feel their thoughts slow down. The scale of the landscape puts daily worries in perspective and invites a different kind of attention: wide, patient and unhurried.', 'You can recreate a little of this spaciousness anywhere. Sit comfortably and soften your gaze. Imagine your awareness expanding like the view from a high ridge, taking in sounds, sensations and thoughts without chasing any of them.', 'Notice that, like weather on a mountain, thoughts arrive and pass. You do not need to push them away. You are the sky, not the clouds.', 'Try this for five minutes after waking, or whenever you feel overwhelmed. Pair it with slow breathing to deepen the effect.', 'This idea of open, steady awareness is central to many contemplative traditions of the region, and it shapes the unhurried atmosphere of our studio in Thimphu.']],
];
blog.forEach(([slug, title, category, image, date, excerpt, paras]) =>
  w('blog', slug, { title, excerpt, image, category, date, author: 'Norbu Healing Team' }, paras.join('\n\n')));

// PLACEHOLDER testimonials: replace with real client reviews before launch.
const testimonials = [
  ['sonam', 'Sonam P.', 'Paro', true, 'I came for the sound bath and stayed for the community. Everyone here is warm, unhurried and genuinely kind.'],
  ['tenzin', 'Tenzin D.', 'Thimphu', false, 'The Tuesday evening flow has become the calmest hour of my week. I walk in carrying the day and walk out feeling light. The teachers are patient, kind and never rush you.'],
  ['emma', 'Emma R.', 'Sydney', false, 'I joined a retreat while travelling and it was the highlight of my trip. Thoughtful teaching, a beautiful setting and a real sense of calm that stayed with me long after I flew home.'],
  ['pema', 'Pema W.', 'Thimphu', false, 'Joining Norbu Healing has been one of the best decisions I have made for my wellbeing. The classes give me a chance to step away from my busy routine and focus on myself.'],
  ['james', 'James L.', 'London', false, 'Private sessions helped me recover from a back injury and rebuild confidence in my body. Truly personal care, and I leave every session with a clearer mind.'],
  ['karma', 'Karma T.', 'Paro', true, 'Every class feels planned with care. I have noticed real improvements in my flexibility and my sleep.'],
];
testimonials.forEach(([slug, name, location, video, quote], i) =>
  w('testimonials', slug, { name, location, order: i + 1, video, ...(video ? { image: slug === 'sonam' ? 'testimonial-video-1' : 'testimonial-video-2' } : {}) }, quote));
console.log('seeded');
