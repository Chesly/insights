-- ============================================================
-- LCD KHAYA "DID YOU KNOW?" FACTS SEED — batch 4 (25 facts)
-- LCD-DYK-151 to LCD-DYK-175 — category: Driving
-- NOTE: LCD-DYK-076 to LCD-DYK-100 remain an open gap
-- Run in Supabase SQL Editor, same as supabase-content-seed.sql
-- ============================================================

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'nervous-learner-drivers-safer-decisions',
  'Did You Know? Nervous Learners Often Make Safer Decisions Than Overconfident Ones',
  'Nervousness is not always a weakness. Many nervous learners drive more cautiously, scan more carefully and avoid risky overtaking or speeding.',
  'Nervousness is not always a weakness. Many nervous learners drive more cautiously, scan more carefully and avoid risky overtaking or speeding. Overconfidence, on the other hand, can lead to underestimating hazards and taking unnecessary risks. A moderate level of nervousness keeps you alert. The goal is not to eliminate nerves, but to manage them so they sharpen your focus rather than freeze your decisions. Breathing techniques, familiar routes and realistic practice help convert nervous energy into careful observation. Instructors should not dismiss nervousness as “just nerves”. It is valuable information about how a learner perceives risk. Channel it into safer habits rather than trying to appear fearless.',
  'South African Government road-safety guidance on driver behaviour.',
  'https://www.gov.za/about-government/road-safety-arrive-alive',
  'Driving',
  '[{"question": "Is being nervous as a learner bad?", "answer": "No. Moderate nervousness can make you more cautious and observant."}, {"question": "What is more dangerous: nerves or overconfidence?", "answer": "Overconfidence often leads to riskier decisions and underestimating hazards."}, {"question": "How can I manage driving nerves?", "answer": "Use breathing techniques, practise on familiar routes and build skills gradually."}, {"question": "Should instructors ignore learner nervousness?", "answer": "No. It should be acknowledged and channelled into safer habits."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'first-10-driving-hours-habits',
  'Did You Know? Your First 10 Hours Shape Your Long-Term Driving Habits',
  'The first 10 hours of behind-the-wheel practice strongly influence long-term habits.',
  'The first 10 hours of behind-the-wheel practice strongly influence long-term habits. Early experiences teach your brain what “normal” driving feels like: how much space to leave, how to approach intersections, how to use mirrors and how to respond to hazards. If early practice is rushed, inconsistent or focused only on “passing the test”, bad habits can become automatic. Conversely, structured early lessons that emphasise observation, smooth control and hazard awareness build a safer foundation. This is why the quality of your first lessons matters more than the total number of hours later. Invest in good instruction from the start, even if progress feels slower initially.',
  'K53 practical driving-test emphasis on safe habits.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Why do the first 10 hours matter?", "answer": "They establish what your brain treats as “normal” driving behaviour and habits."}, {"question": "Can bad early habits be fixed later?", "answer": "Yes, but it takes more effort than building good habits from the start."}, {"question": "Should I rush to get many hours quickly?", "answer": "No. Structured, quality practice is more important than quantity alone."}, {"question": "What should early lessons focus on?", "answer": "Observation, smooth control, hazard awareness and safe decision-making."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'learning-from-driving-mistakes',
  'Did You Know? Mistakes Are Data, Not Failure, If You Review Them',
  'Every driving mistake contains information: what you missed, what you assumed, what you could have done differently. Treating mistakes as data rather than failure helps you improve instead of hiding errors.',
  'Every driving mistake contains information: what you missed, what you assumed, what you could have done differently. Treating mistakes as data rather than failure helps you improve instead of hiding errors. After a near-miss or error, ask: What did I not see? What did I assume? What would I do differently next time? This turns a scary moment into a learning opportunity. Instructors should encourage honest discussion about mistakes without shame. A learner who can analyse errors is more likely to correct them than one who pretends they did not happen.',
  'K53 focus on continuous observation and improvement.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "Should I be ashamed of driving mistakes?", "answer": "No. Mistakes are opportunities to learn if you review them honestly."}, {"question": "How do I learn from a mistake?", "answer": "Ask what you missed, what you assumed and what you would do differently."}, {"question": "Do good drivers make mistakes?", "answer": "Yes. The difference is how they respond and learn from them."}, {"question": "Should instructors punish mistakes?", "answer": "No. They should guide learners to understand and correct them."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'commentary-driving-observation',
  'Did You Know? Talking Through Your Actions Improves Observation',
  'Verbalising your actions—“I’m checking my mirror”, “I’m slowing for the intersection”, “I’m looking for pedestrians”—forces your brain to engage with what you are doing. This improves observation and reduces automatic, unthinking driving.',
  'Verbalising your actions—“I’m checking my mirror”, “I’m slowing for the intersection”, “I’m looking for pedestrians”—forces your brain to engage with what you are doing. This improves observation and reduces automatic, unthinking driving. Instructors often ask learners to “commentary drive” for this reason. It reveals gaps in observation and decision-making that silent driving can hide. You can use this technique in practice even without an instructor. Describe your actions out loud or in your head. It keeps you present and reduces the risk of drifting into autopilot.',
  'K53 emphasis on continuous observation.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Why talk while driving as a learner?", "answer": "It forces you to consciously process your actions and improves observation."}, {"question": "Is commentary driving only for tests?", "answer": "No. It is a training tool to build better observation habits."}, {"question": "Should I talk out loud or in my head?", "answer": "Either works. Out loud is stronger for early training; internal commentary works later."}, {"question": "Does this help experienced drivers too?", "answer": "Yes. It can break autopilot habits and refresh observation skills."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'driver-fatigue-feeling-fine-risk',
  'Did You Know? Fatigue Makes You a Risk Even If You Feel “Fine”',
  'Fatigue impairs reaction time, judgement and hazard perception, even if you feel “okay”. Many drivers underestimate how tired they are, especially after long days, night shifts or insufficient sleep.',
  'Fatigue impairs reaction time, judgement and hazard perception, even if you feel “okay”. Many drivers underestimate how tired they are, especially after long days, night shifts or insufficient sleep. Government road-safety campaigns highlight fatigue as a major risk factor, comparable in some ways to alcohol impairment. Micro-sleeps of a few seconds at highway speeds mean travelling over 100 metres unconscious. If you feel drowsy, yawn repeatedly, struggle to focus or miss exits, you are already too tired to drive safely. The only real cure is rest, not coffee, loud music or open windows.',
  'South African Government road-safety campaigns on fatigue.',
  'https://www.vukuzenzele.gov.za/road-safety-tips',
  'Driving',
  '[{"question": "Can I drive if I feel a bit tired?", "answer": "If you notice drowsiness signs, you are already too tired to drive safely."}, {"question": "Does coffee fix fatigue?", "answer": "No. It may briefly mask symptoms but does not restore alertness."}, {"question": "What are signs of dangerous fatigue?", "answer": "Yawning, heavy eyelids, missed exits, daydreaming and difficulty focusing."}, {"question": "How can I prevent fatigue on long trips?", "answer": "Plan breaks every 2 hours or 200 km, share driving if possible and prioritise sleep."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'driving-instructor-explains-why',
  'Did You Know? A Good Instructor Explains the “Why”, Not Just the “How”',
  'Anyone can show you how to move off or park. A good instructor explains why you do it that way: why observation comes before movement, why following distance matters, why certain habits reduce risk.',
  'Anyone can show you how to move off or park. A good instructor explains why you do it that way: why observation comes before movement, why following distance matters, why certain habits reduce risk. Understanding the “why” helps you adapt to new situations, not just repeat memorised actions. It also helps you recognise when a shortcut is actually dangerous. When choosing an instructor, ask: Do they explain reasons? Do they connect actions to realworld risk? If lessons feel like “do this because I said so”, you may not be building deep understanding.',
  'K53 emphasis on safe driving principles, not just manoeuvres.',
  'https://www.westerncape.gov.za/mobility/service/driving-licence',
  'Driving',
  '[{"question": "Why does the “why” matter in lessons?", "answer": "It helps you understand risk and adapt to new situations, not just copy actions."}, {"question": "How can I tell if my instructor explains well?", "answer": "They connect actions to reasons, hazards and real-world scenarios."}, {"question": "Is “do this because I said so” good teaching?", "answer": "No. It creates rote learning without understanding."}, {"question": "Should I ask my instructor to explain more?", "answer": "Yes. Good instructors welcome questions and explain reasoning."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'driving-lesson-structure-matters',
  'Did You Know? Lesson Structure Matters More Than Lesson Length',
  'A well-structured 45-minute lesson can be more valuable than a disorganised 90-minute session. Structure includes clear objectives, progressive skill-building, feedback and reflection.',
  'A well-structured 45-minute lesson can be more valuable than a disorganised 90-minute session. Structure includes clear objectives, progressive skill-building, feedback and reflection. Good lessons start with a brief plan, focus on specific skills (e.g. intersections, lane changes, parking), and end with a summary of what went well and what to improve. Random “just driving around” builds mileage, not necessarily skill. When booking lessons, ask about structure: What will we focus on? How will progress be measured? A clear plan shows professional instruction, not just time-for-money driving.',
  'K53 training principles emphasising structured skill development.',
  'https://www.westerncape.gov.za/mobility/service/driving-licence',
  'Driving',
  '[{"question": "Are longer lessons always better?", "answer": "No. Well-structured shorter lessons are often more effective."}, {"question": "What should a good lesson include?", "answer": "Clear objectives, focused skill practice, feedback and reflection."}, {"question": "Is “just driving around” good practice?", "answer": "Not as a primary method. It builds mileage but not necessarily skill."}, {"question": "Should I ask about lesson structure?", "answer": "Yes. Professional instructors plan lessons with clear goals."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'driving-lesson-feedback-specific',
  'Did You Know? Feedback Should Be Specific, Not Just “You’ll Get It”',
  'Vague feedback like “you’ll get it” or “it was fine” does not help you improve. Specific feedback identifies what you did well, what needs work and how to adjust.',
  'Vague feedback like “you’ll get it” or “it was fine” does not help you improve. Specific feedback identifies what you did well, what needs work and how to adjust. Examples: “Your mirror checks were good, but you signalled too late at that intersection,” or “Your clutch control is improving; next time focus on earlier observation before moving off.” If your instructor cannot give specific feedback, you may not be progressing efficiently. Ask for concrete points to work on after each lesson.',
  'K53 emphasis on continuous improvement and observation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "What is good driving feedback?", "answer": "Specific, actionable points about what went well and what to improve."}, {"question": "Is “you’ll get it” helpful feedback?", "answer": "No. It is vague and does not guide improvement."}, {"question": "Should I ask for feedback after each lesson?", "answer": "Yes. Request specific points to focus on next time."}, {"question": "Can feedback be positive and corrective?", "answer": "Yes. Good feedback highlights strengths and areas to improve."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'multiple-driving-instructors-benefits',
  'Did You Know? The Same Instructor Should Not Teach Every Single Lesson',
  'While consistency is important, exposure to different instructors can reveal blind spots. One instructor may focus heavily on observation, another on vehicle control, another on complex traffic.',
  'While consistency is important, exposure to different instructors can reveal blind spots. One instructor may focus heavily on observation, another on vehicle control, another on complex traffic. Different teaching styles can highlight habits you have normalised with one instructor. This is particularly useful before your test, to ensure your skills are robust, not tailored to one person’s cues. This does not mean constantly switching. A primary instructor is essential, but occasional sessions with another qualified instructor can strengthen your overall ability.',
  'K53 training principles on comprehensive skill development.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Should I change instructors often?", "answer": "No. A primary instructor is important, but occasional sessions with another can help."}, {"question": "Why use more than one instructor?", "answer": "Different perspectives reveal blind spots and strengthen overall skills."}, {"question": "Will this confuse me?", "answer": "If coordinated well, no. Core K53 principles remain the same."}, {"question": "When is this most useful?", "answer": "Before the test, or if progress has plateaued with one instructor."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'lesson-car-match-test-car',
  'Did You Know? Your Instructor’s Car Should Match Your Test Car Type',
  'If you plan to test in a manual car, most of your lessons should be in a manual. If you plan to test in an automatic, your lessons should reflect that.',
  'If you plan to test in a manual car, most of your lessons should be in a manual. If you plan to test in an automatic, your lessons should reflect that. Switching between transmission types can confuse pedal and gear habits close to the test. Some learners practise in one type and test in another, then struggle with different pedal feel, creep behaviour or gear expectations. Consistency reduces surprises. Discuss your test vehicle plans with your instructor early. Ensure your training aligns with your intended test category and transmission type.',
  'K53 practical test vehicle requirements.',
  'https://www.westerncape.gov.za/mobility/service/driving-licence',
  'Driving',
  '[{"question": "Should my lesson car match my test car?", "answer": "Yes, especially for transmission type (manual vs automatic)."}, {"question": "What if I switch between manual and automatic lessons?", "answer": "It can confuse habits. Consistency is better near test time."}, {"question": "Does the car model matter?", "answer": "Less than transmission type, but very different cars can feel unfamiliar."}, {"question": "Should I tell my instructor my test plans?", "answer": "Yes. They should align lessons with your intended test vehicle."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-examiner-nerves-test-day',
  'Did You Know? Examiners Are Trained to Ignore Small Nerves',
  'K53 examiners understand that candidates are nervous. They are trained to focus on safe driving, not on shaking hands, a shaky voice or minor hesitations.',
  'K53 examiners understand that candidates are nervous. They are trained to focus on safe driving, not on shaking hands, a shaky voice or minor hesitations. What matters is whether you drive safely, observe properly and follow road rules. Examiners expect some nerves; they do not expect perfection. Trying to “act confident” while driving unsafely is worse than being visibly nervous but driving correctly. Focus on the process: observation, control, decisions. Let nerves exist without letting them drive the car.',
  'City of Cape Town: K53 practical driving-test overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Do examiners care if I’m nervous?", "answer": "They expect nerves. They assess safe driving, not your confidence level."}, {"question": "Can nerves cause me to fail?", "answer": "Only if they lead to unsafe decisions or missed observations."}, {"question": "Should I try to hide my nerves?", "answer": "No. Focus on driving safely; nerves are normal."}, {"question": "What do examiners really watch?", "answer": "Observation, control, rule compliance and safe decision-making."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-test-first-minutes-calm-start',
  'Did You Know? The First 2 Minutes Set the Tone for Your Test',
  'The first two minutes of your K53 test—seat setup, mirror adjustment, initial moving off—set a psychological tone. A calm, methodical start signals to your brain that you are in control.',
  'The first two minutes of your K53 test—seat setup, mirror adjustment, initial moving off—set a psychological tone. A calm, methodical start signals to your brain that you are in control. Rushing these early steps can create a cascade of hurried decisions. Taking time to set up properly, breathe and observe before moving off helps you start from a place of control rather than panic. Examiners also note your initial setup and first manoeuvres. A composed start builds confidence for both you and the examiner.',
  'K53 practical test procedures and vehicle setup expectations.',
  'https://www.westerncape.gov.za/mobility/service/driving-licence',
  'Driving',
  '[{"question": "Why do the first minutes matter?", "answer": "They set your mental tone and establish early habits for the rest of the test."}, {"question": "What should I focus on first?", "answer": "Seat, mirrors, controls, observation, then a calm moving off."}, {"question": "Can a bad start ruin my test?", "answer": "Not necessarily, but it can increase stress and errors."}, {"question": "How can I start calmly?", "answer": "Arrive early, breathe, follow your setup routine and move off only when ready."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-examiner-silence-normal',
  'Did You Know? Silence From the Examiner Is Normal, Not a Bad Sign',
  'K53 examiners often say little during the test. Silence does not mean you are failing; it means they are observing and recording.',
  'K53 examiners often say little during the test. Silence does not mean you are failing; it means they are observing and recording. Some candidates become anxious when the examiner does not comment, assuming the worst. In reality, examiners are trained to minimise interaction to avoid distracting you. Focus on your driving, not on interpreting silence. If the examiner gives an instruction, follow it safely. If they say nothing, continue driving safely as trained.',
  'City of Cape Town: K53 practical driving-test overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Does examiner silence mean I’m failing?", "answer": "No. It usually means they are observing and recording."}, {"question": "Why don’t examiners talk much?", "answer": "To avoid distracting you and to maintain standardised testing conditions."}, {"question": "Should I try to make conversation?", "answer": "No. Focus on driving safely and following instructions."}, {"question": "What if I need clarification?", "answer": "Ask politely if an instruction is unclear, then continue driving."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-mistake-recovery-test',
  'Did You Know? Recovering Well From a Mistake Can Save Your Test',
  'Examiners assess how you respond to errors, not just whether you make them. A small mistake followed by calm, safe recovery often matters less than panicking or compounding the error.',
  'Examiners assess how you respond to errors, not just whether you make them. A small mistake followed by calm, safe recovery often matters less than panicking or compounding the error. If you stall, miss a lane or misjudge a manoeuvre, stop safely, observe, and correct calmly. Do not rush to “fix” it with a risky move. Show the examiner you can handle real-world imperfections safely. This is why recovery drills are important in lessons. Practise stalling, repositioning and correcting in safe environments so you are not surprised on test day.',
  'City of Cape Town: K53 practical driving-test assessment.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Can I still pass after a mistake?", "answer": "Yes, if you recover safely and continue driving correctly."}, {"question": "What should I do after an error?", "answer": "Stop safely if needed, observe, correct calmly and continue."}, {"question": "Should I apologise repeatedly?", "answer": "No. Acknowledge briefly if appropriate, then focus on safe driving."}, {"question": "How can I practise recovery?", "answer": "Ask your instructor to simulate minor errors and practise calm corrections."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'driving-self-talk-performance',
  'Did You Know? Your Internal Monologue Affects Your Driving Performance',
  'What you tell yourself while driving influences your decisions. Thoughts like “I can’t do this” or “Everyone is watching me” increase anxiety and can impair performance.',
  'What you tell yourself while driving influences your decisions. Thoughts like “I can’t do this” or “Everyone is watching me” increase anxiety and can impair performance. Replace catastrophic thoughts with process-focused ones: “Check mirrors, signal, observe, then move.” This shifts attention from fear to action. Practise positive, realistic self-talk during lessons. Over time, this becomes your default inner voice, supporting calmer, safer driving under pressure.',
  'K53 emphasis on structured processes and observation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "Does self-talk really affect driving?", "answer": "Yes. Negative thoughts increase anxiety and can impair decisions."}, {"question": "What should I tell myself while driving?", "answer": "Process-focused thoughts: “Observe, signal, check, then move.”"}, {"question": "How can I change negative self-talk?", "answer": "Practise replacing catastrophic thoughts with realistic, action-focused ones."}, {"question": "Does this help on test day?", "answer": "Yes. It keeps you focused on safe processes rather than fear."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'local-driving-bad-habits-myth',
  'Did You Know? “I Only Drive Locally” Is Not an Excuse for Bad Habits',
  'Many drivers believe short, local trips do not require full attention or proper habits. In reality, most accidents happen close to home, on familiar roads, at low speeds.',
  'Many drivers believe short, local trips do not require full attention or proper habits. In reality, most accidents happen close to home, on familiar roads, at low speeds. Local driving still involves intersections, pedestrians, cyclists and unexpected hazards. Bad habits formed on “easy” local routes become automatic and can cause serious accidents. Treat every drive, no matter how short, as an opportunity to practise safe habits. Observation, signalling and speed control matter just as much on a 2 km trip as on a 200 km journey.',
  'South African Government road-safety statistics and guidance.',
  'https://www.gov.za/about-government/road-safety-arrive-alive',
  'Driving',
  '[{"question": "Are local trips safer than long ones?", "answer": "No. Many accidents happen close to home on familiar roads."}, {"question": "Do I need full observation on short trips?", "answer": "Yes. Hazards exist on all trips, regardless of distance."}, {"question": "Can I relax my habits locally?", "answer": "No. Bad habits become automatic and dangerous everywhere."}, {"question": "Why do people underestimate local driving?", "answer": "Familiarity creates a false sense of safety and reduced attention."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'passing-k53-vs-safe-driver',
  'Did You Know? Passing the Test Is Not the Same as Being a Safe Driver',
  'The K53 test assesses minimum competence for licensing, not mastery of all possible situations. Passing means you demonstrated safe driving under test conditions, not that you are immune to risk.',
  'The K53 test assesses minimum competence for licensing, not mastery of all possible situations. Passing means you demonstrated safe driving under test conditions, not that you are immune to risk. Real-world driving includes complex scenarios, long distances, varied weather and fatigue that a 30–40 minute test cannot fully replicate. Safe drivers continue learning after passing, adapting to new conditions and reflecting on experiences. View your licence as a permission to keep learning, not a certificate of completion. The safest drivers remain humble and open to improvement long after test day.',
  'K53 practical test scope and limitations.',
  'https://www.westerncape.gov.za/mobility/service/driving-licence',
  'Driving',
  '[{"question": "Does passing K53 mean I’m a perfect driver?", "answer": "No. It means you met minimum standards for licensing under test conditions."}, {"question": "Should I keep learning after passing?", "answer": "Yes. Real-world driving presents new challenges beyond the test."}, {"question": "Can good drivers still make mistakes?", "answer": "Yes. Safe drivers acknowledge and learn from them."}, {"question": "How can I keep improving after the test?", "answer": "Reflect on trips, consider advanced courses and stay updated on road safety."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'automatic-learning-safety-myth',
  'Did You Know? Automatic Does Not Mean “Easier to Learn Safely”',
  'Automatic cars simplify gear operation, but they do not automatically make you a safer driver. Observation, speed choice, following distance and hazard perception remain the driver’s responsibility.',
  'Automatic cars simplify gear operation, but they do not automatically make you a safer driver. Observation, speed choice, following distance and hazard perception remain the driver’s responsibility. Some automatic learners become over-reliant on the vehicle’s simplicity and neglect core skills like mirror checks, planning and smooth pedal control. The car may be easier to operate, but the road is the same. Choose automatic for the right reasons (e.g. you will drive automatics long-term), not because you assume it removes the need for serious learning. Safe driving is about mindset and habits, not just transmission type.',
  'K53 practical test applies to both manual and automatic.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Are automatic cars easier to learn in?", "answer": "Operationally simpler, but safe driving skills are equally important."}, {"question": "Can automatic learners become lazy?", "answer": "Yes, if they neglect observation and planning because the car is “easy”."}, {"question": "Should I choose automatic for easier learning?", "answer": "Choose based on the vehicles you will drive, not assumed ease."}, {"question": "Do automatic drivers need K53 lessons?", "answer": "Yes. The test still assesses observation, control and road-rule compliance."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'older-driver-retraining-bad-habits',
  'Did You Know? Older Drivers Can Unlearn Bad Habits Too',
  'Many older drivers believe their long experience means their habits are fixed. In reality, drivers of any age can unlearn risky habits and adopt safer ones with structured retraining.',
  'Many older drivers believe their long experience means their habits are fixed. In reality, drivers of any age can unlearn risky habits and adopt safer ones with structured retraining. Common bad habits include minimal mirror use, tailgating, speeding on familiar roads and poor phone discipline. Defensive driving courses and refresher lessons can address these without judgement. Age is not a barrier to improvement. The willingness to reflect and adjust is. If you have been driving for decades, a fresh set of eyes from a qualified instructor can reveal blind spots you have normalised.',
  'South African Government road-safety guidance on driver improvement.',
  'https://www.vukuzenzele.gov.za/road-safety-tips',
  'Driving',
  '[{"question": "Can older drivers improve their habits?", "answer": "Yes. Structured retraining can help at any age."}, {"question": "What bad habits are common in experienced drivers?", "answer": "Minimal mirror use, tailgating, speeding on familiar roads, phone distraction."}, {"question": "Are refresher lessons only for new drivers?", "answer": "No. They are valuable for any driver wanting to improve."}, {"question": "How can an older driver start improving?", "answer": "Book a defensive driving or refresher course with a qualified instructor."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'no-accidents-not-skill-proof',
  'Did You Know? “I’ve Never Had an Accident” Is Not Proof of Skill',
  'Many drivers equate no accidents with high skill. In reality, luck, low mileage and limited exposure can also explain accident-free records.',
  'Many drivers equate no accidents with high skill. In reality, luck, low mileage and limited exposure can also explain accident-free records. Skill is better measured by consistent safe habits, not just outcomes. A driver with 20 years and no accidents but frequent speeding, tailgating and phone use is still high-risk. Conversely, a cautious driver with one minor incident but excellent habits may be safer long-term. Use your accident history as one data point, not the only measure. Focus on habits: observation, speed choice, following distance, distraction management. These predict future safety better than past luck.',
  'South African Government road-safety guidance on risk and behaviour.',
  'https://www.gov.za/about-government/road-safety-arrive-alive',
  'Driving',
  '[{"question": "Does no accidents mean I’m a good driver?", "answer": "Not necessarily. Luck and exposure also play a role."}, {"question": "What better measures driving skill?", "answer": "Consistent safe habits: observation, speed, following distance, distraction management."}, {"question": "Can a safe driver still have an accident?", "answer": "Yes. Other drivers, conditions and chance also matter."}, {"question": "How can I assess my real risk?", "answer": "Review your habits honestly, not just your accident history."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'defensive-driving-planning-ahead',
  'Did You Know? Good Drivers Plan Three Moves Ahead, Not One',
  'Safe driving is partly chess-like planning. Good drivers think several moves ahead: “If I change lane now, where will I need to be at the next intersection?',
  'Safe driving is partly chess-like planning. Good drivers think several moves ahead: “If I change lane now, where will I need to be at the next intersection? What if that vehicle speeds up? What is my escape route?” This forward planning reduces last-minute decisions, harsh braking and risky manoeuvres. It also makes you more predictable to other road users. Practise scanning further ahead and asking “what if” questions. Over time, this becomes automatic and significantly reduces your risk exposure.',
  'K53 emphasis on observation and planning.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "What does “three moves ahead” mean?", "answer": "Planning multiple steps: lane position, upcoming turns, potential hazards and escape routes."}, {"question": "How can I practise this?", "answer": "Scan further ahead and ask “what if” questions while driving."}, {"question": "Does this help in heavy traffic?", "answer": "Yes. It reduces last-minute decisions and risky manoeuvres."}, {"question": "Is this only for experienced drivers?", "answer": "No. Learners can start building this habit early."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'speed-choice-decision-not-limit',
  'Did You Know? Speed Choice Is a Decision, Not Just a Number',
  'Speed is not only about the limit on the sign. It is a continuous decision based on traffic, weather, visibility, road surface and your own condition.',
  'Speed is not only about the limit on the sign. It is a continuous decision based on traffic, weather, visibility, road surface and your own condition. Government guidance emphasises obeying limits and adjusting for conditions. Choosing a safe speed means asking: Can I stop within what I can see? Is this appropriate for rain, glare or pedestrians? Am I alert enough for this speed? This mindset shifts speed from “what can I get away with?” to “what is safe right now?”. That shift alone reduces risk significantly.',
  'South African Government road-safety guidance on speed and conditions.',
  'https://www.vukuzenzele.gov.za/road-safety-tips',
  'Driving',
  '[{"question": "Is speed only about the limit?", "answer": "No. It is also about conditions, visibility, traffic and your own state."}, {"question": "How do I choose a safe speed?", "answer": "Ask if you can stop within what you see, and adjust for conditions."}, {"question": "Can I drive below the limit?", "answer": "Yes, if conditions warrant it, without impeding traffic unreasonably."}, {"question": "Why is speed a decision?", "answer": "Because conditions change constantly, requiring ongoing judgement."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'following-distance-buffer-not-rule',
  'Did You Know? Following Distance Is a Buffer, Not a Rule to Game',
  'Following distance is not about meeting a minimum to avoid fines; it is a safety buffer that gives you time and space to react. K53 guidance recommends at least 2–3 seconds, more in adverse conditions.',
  'Following distance is not about meeting a minimum to avoid fines; it is a safety buffer that gives you time and space to react. K53 guidance recommends at least 2–3 seconds, more in adverse conditions. Treating it as a buffer means increasing it when tired, in rain, behind large vehicles or when visibility is poor. It also means not letting others tailgate you into reducing your own gap. This mindset shifts following distance from “what is the least I can do?” to “what gives me enough margin for error?”. That margin saves lives.',
  'K53 practical driving-test documentation on following distance.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=60:k53-light-motor-vehicle-part2-code-b',
  'Driving',
  '[{"question": "What is the purpose of following distance?", "answer": "To provide time and space to react to hazards and sudden stops."}, {"question": "Should I always use exactly 3 seconds?", "answer": "No. Increase it for poor conditions, fatigue or heavy traffic."}, {"question": "What if someone tailgates me?", "answer": "Maintain your safe gap ahead; do not let them pressure you into reducing it."}, {"question": "Is following distance only for highways?", "answer": "No. It matters on all roads, especially urban areas with pedestrians."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'driving-assumptions-near-misses',
  'Did You Know? Most Near-Misses Are Caused by Assumptions, Not Ignorance',
  'Many near-misses happen not because drivers do not know the rules, but because they assume others will behave predictably: “They won’t pull out,” “They’ll stop at the stop sign,” “They see me.” Assumptions reduce observation and preparation.',
  'Many near-misses happen not because drivers do not know the rules, but because they assume others will behave predictably: “They won’t pull out,” “They’ll stop at the stop sign,” “They see me.” Assumptions reduce observation and preparation. Defensive driving assumes others may make mistakes and plans accordingly: “What if they do pull out? Where is my escape route?” Challenge your assumptions consciously. Treat every intersection, lane change and blind spot as a potential risk until proven safe by observation, not by assumption.',
  'South African Government road-safety guidance on hazard perception.',
  'https://www.gov.za/about-government/road-safety-arrive-alive',
  'Driving',
  '[{"question": "What causes most near-misses?", "answer": "Assumptions about other road users’ behaviour, not lack of rule knowledge."}, {"question": "How can I reduce assumptions?", "answer": "Treat every situation as potentially risky until observation confirms safety."}, {"question": "Does this make driving stressful?", "answer": "Initially, but it becomes automatic and actually reduces stress by preventing surprises."}, {"question": "Is this only for new drivers?", "answer": "No. Experienced drivers benefit from challenging long-held assumptions."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'boring-safe-driver-deliberate',
  'Did You Know? The Safest Drivers Are Boring on Purpose',
  'The safest drivers often appear “boring”: no sudden lane changes, no aggressive acceleration, no racing to beats. This is not lack of skill; it is deliberate risk management.',
  'The safest drivers often appear “boring”: no sudden lane changes, no aggressive acceleration, no racing to beats. This is not lack of skill; it is deliberate risk management. Boring driving means predictable movements, ample buffers and calm decisions. It reduces surprises for other road users and gives you more time to react when others are not boring. Embrace being boring on the road. Let others rush. Your goal is to arrive safely, not to impress anyone with aggressive manoeuvres.',
  'South African Government road-safety guidance on calm, predictable driving.',
  'https://www.gov.za/about-government/road-safety-arrive-alive',
  'Driving',
  '[{"question": "Is “boring” driving good?", "answer": "Yes. Predictable, calm driving reduces risk for everyone."}, {"question": "Does boring mean unskilled?", "answer": "No. It often reflects high skill and risk awareness."}, {"question": "What if others find me too slow?", "answer": "Let them pass. Your priority is safety, not their opinion."}, {"question": "How can I become “boring” on purpose?", "answer": "Focus on smooth inputs, ample buffers and avoiding unnecessary risks."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;
