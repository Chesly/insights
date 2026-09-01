-- ============================================================
-- LCD KHAYA "DID YOU KNOW?" FACTS SEED — batch 2 (50 facts)
-- LCD-DYK-026 to LCD-DYK-075 — category: Driving
-- Run in Supabase SQL Editor, same as supabase-content-seed.sql
-- ============================================================

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'learners-licence-vehicle-category-south-africa',
  'Did You Know? Your Learner’s Licence Must Match the Vehicle You Practise In',
  'A learner’s licence is issued for a vehicle category, so it is important to apply for the category that matches the type of vehicle you intend to learn to drive.',
  'A learner’s licence is issued for a vehicle category, so it is important to apply for the category that matches the type of vehicle you intend to learn to drive. South Africa issues different learner’s licences for different categories of motor vehicle, including motorcycles, light motor vehicles and heavier vehicles. For most people learning to drive a car, bakkie or small SUV, the relevant category is usually the light motor vehicle category. Someone planning to ride a motorcycle needs the relevant motorcycle learner’s licence instead. The category matters because it determines the type of vehicle for which you are legally authorised to practise under supervision. Before booking, think about your practical goal. If you want to drive a manual vehicle, training in a manual vehicle can give you broader practical experience; if you intend to drive an automatic, ensure the training vehicle and licence process match that plan. Confirm the appropriate code and vehicle category with the DLTC or a qualified driving school before applying.',
  'South African Department of Transport: learner’s licence application information.',
  'https://www.transport.gov.za/?page_id=1176',
  'Driving',
  '[{"question": "Can I use a car learner’s licence to practise on a motorcycle?", "answer": "No. A learner’s licence is linked to a vehicle category. You need the appropriate learner’s licence category for the vehicle you are learning to ride or drive."}, {"question": "Which learner’s licence do I need for a normal car?", "answer": "Most private cars fall within the light motor vehicle category. Confirm the specific code and vehicle details with a DLTC or reputable driving school before you apply."}, {"question": "Can I choose a licence category after passing my learner’s test?", "answer": "You should choose the appropriate category when applying because the learner’s test and eventual practical test must align with the vehicle category you intend to drive."}, {"question": "Can a driving school help me choose the right category?", "answer": "Yes. A reputable school can explain the practical differences between vehicle categories, although the DLTC remains the authority for official applications and testing."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'what-is-in-learners-licence-test-south-africa',
  'Did You Know? A Learner’s Licence Test Checks More Than Road Signs',
  'Passing a learner’s licence test requires more than recognising a stop sign or memorising speed-limit signs.',
  'Passing a learner’s licence test requires more than recognising a stop sign or memorising speed-limit signs. NaTIS provides official study material across three connected knowledge areas: rules of the road, road traffic signs and vehicle controls. Together, these topics help establish the knowledge needed before a person begins practical driving under supervision. Road signs tell you what hazards, restrictions and directions may apply. Rules of the road explain how drivers must behave around intersections, other vehicles and vulnerable road users. Vehicle-control knowledge helps a learner understand basic instruments and controls before operating a vehicle. A strong study plan therefore combines all three. Instead of only repeating mock-test answers, learn the reason behind each answer. For example, do not merely identify a yield sign— understand what yielding requires in a real intersection. That approach makes the learner’s test easier to understand and builds safer habits for later K53 lessons.',
  'NaTIS learner-driver manual and general K53/learner resources.',
  'https://www.natis.gov.za/index.php/downloads/learner-driver-manual/rules-of-the-road',
  'Driving',
  '[{"question": "What subjects are covered in the learner’s licence test?", "answer": "Official learner resources cover rules of the road, road traffic signs and vehicle controls."}, {"question": "Are road signs the only important part of the learner’s test?", "answer": "No. Signs are important, but you also need to understand road rules and basic vehicle controls."}, {"question": "Where can I find official learner study material?", "answer": "NaTIS provides learner-driver material, including resources on rules of the road and other test topics."}, {"question": "Are mock tests enough to prepare?", "answer": "Mock tests are useful for practice, but understanding why an answer is correct helps you apply the knowledge safely on the road."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'valid-learners-licence-driving-test-south-africa',
  'Did You Know? A Valid Learner’s Licence Is Needed on Test Day',
  'You need a valid learner’s licence when applying for and taking a practical driving licence test in South Africa.',
  'You need a valid learner’s licence when applying for and taking a practical driving licence test in South Africa. The government’s driving-licence application guidance lists a learner’s licence among the documents applicants must take to a Driving Licence Testing Centre when booking a driving test. This is why your learner’s licence expiry date matters. A learner’s licence is valid for 24 months and cannot be extended. If it has expired by the time you are due to take your practical test, you are not legally eligible to drive as a learner and should not assume an old booking will solve the problem. Confirm requirements with the DLTC where you booked. Practical planning is as important as theory preparation. Check your licence expiry date before paying for lessons, arranging a test car or confirming a test booking. Aim to complete your training and test while there is still enough time to handle a rescheduled appointment if necessary.',
  'South African Government: apply for a driving licence.',
  'https://www.gov.za/services/driving-licence/apply-driving-licence',
  'Driving',
  '[{"question": "Can I take my driving test with an expired learner’s licence?", "answer": "No. Your learner’s licence needs to be valid. Confirm your documents with the DLTC before test day."}, {"question": "How long is a learner’s licence valid in South Africa?", "answer": "It is valid for 24 months and cannot be extended."}, {"question": "Should I book a driving test near my learner’s licence expiry date?", "answer": "It is safer to book well before expiry, because test appointments and rescheduling can take time."}, {"question": "What documents should I take when booking a driving test?", "answer": "Government guidance lists your learner’s licence, identity document and photographs among the items required; check directly with your DLTC for its current requirements."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'book-k53-driving-test-early-south-africa',
  'Did You Know? Booking Early Can Protect Your Learner’s Licence Timeline',
  'A learner’s licence has a fixed 24-month validity period and cannot be extended, so waiting until the final weeks to arrange a practical driving test creates unnecessary risk.',
  'A learner’s licence has a fixed 24-month validity period and cannot be extended, so waiting until the final weeks to arrange a practical driving test creates unnecessary risk. Booking early gives you more room to complete lessons, practise under supervision, deal with a missed appointment or respond to a test-centre scheduling delay. The driving-licence process is practical as well as administrative. Government guidance directs applicants to book a test date through a Driving Licence Testing Centre, while the practical test uses the K53 method. Test availability can differ between centres and can change over time, so it is unwise to rely on an assumed waiting period. A sensible plan is to check your expiry date first, build consistent practice time, begin structured K53 preparation, and book once you can reasonably be ready. Early booking is not about rushing the test. It is about giving yourself enough flexibility to arrive prepared and legally eligible.',
  'South African Government: learner’s licence validity and driving-licence application.',
  'https://www.gov.za/services/driving-licence/apply-driving-licence',
  'Driving',
  '[{"question": "How early should I book my practical driving test?", "answer": "Book once your training plan is taking shape and well before your learner’s licence expires. Ask your local DLTC about current availability."}, {"question": "Can I book before I feel fully ready?", "answer": "You can use a future booking as a deadline for structured practice, but do not rely on a date if you have not planned enough lessons and supervised practice."}, {"question": "What happens if I miss my driving test?", "answer": "Rules and fees can vary by test centre. Contact the DLTC as soon as possible to confirm your options."}, {"question": "Why should I avoid waiting until the final month?", "answer": "Your learner’s licence cannot be extended, and an unavailable or rescheduled test date could leave you without a valid licence."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'south-african-road-sign-shapes-meanings',
  'Did You Know? Learning Road Signs by Shape Helps You React Faster',
  'Road-sign shape and colour give drivers quick clues about the kind of message a sign carries. This is useful because drivers often need to understand a sign before they are close enough to read every detail.',
  'Road-sign shape and colour give drivers quick clues about the kind of message a sign carries. This is useful because drivers often need to understand a sign before they are close enough to read every detail. NaTIS lists road traffic signs as a core learner-driver study area, alongside rules of the road and vehicle controls. As a learning method, grouping signs by their visual design can improve recall. For example, triangular signs commonly warn of hazards ahead, circular signs often communicate prohibitions or mandatory instructions, and rectangular signs commonly provide information, directions or services. You should still learn each sign individually because exceptions and additional symbols matter. In real traffic, early recognition gives you more time to reduce speed, choose a lane or prepare for a hazard. That is particularly valuable around busy intersections, pedestrian activity and unfamiliar routes in Ekurhuleni. Learn signs as instructions for safe decisions—not as isolated pictures to memorise for a test.',
  'NaTIS learner-driver manual and road-traffic-sign resources.',
  'https://www.natis.gov.za/index.php/downloads/learner-driver-manual/rules-of-the-road',
  'Driving',
  '[{"question": "Why do road signs have different shapes?", "answer": "Shapes help drivers identify the general type of information quickly, even before reading symbols or words."}, {"question": "Are all triangular signs warning signs?", "answer": "Triangular signs are generally used to warn of hazards, but learners should study the official sign meaning rather than relying only on shape."}, {"question": "Are road signs included in the learner’s licence test?", "answer": "Yes. Road traffic signs are one of the core learner-driver study areas."}, {"question": "How can I study road signs effectively?", "answer": "Group them by purpose, practise identifying them in real driving environments with a supervisor, and use official learner resources for their exact meanings."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'applying-rules-of-the-road-while-driving',
  'Did You Know? Knowing the Rule Is Different From Applying It in Traffic',
  'A learner can know the answer to a rules-of-the-road question and still find it difficult to apply the rule in real traffic. This is normal: practical driving requires observation, judgement, timing and vehicle control at the same time.',
  'A learner can know the answer to a rules-of-the-road question and still find it difficult to apply the rule in real traffic. This is normal: practical driving requires observation, judgement, timing and vehicle control at the same time. The official K53 driving test is practical and assesses the ability to drive, park and follow the rules of the road. For example, knowing that you must yield does not automatically teach you how to judge an approaching vehicle’s speed, locate pedestrians, select a safe gap and move off smoothly. Those skills improve through supervised practice and structured lessons. Use theory as a foundation, then reinforce it in real situations. After seeing a sign or approaching an intersection, ask yourself: What does this rule require me to do now? What could another road user do? Where is my safe stopping option? This links learner knowledge to defensive driving and helps prepare a learner for the K53 road test.',
  'City of Cape Town: driving test and K53 overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Why can I pass mock tests but struggle on the road?", "answer": "Mock tests assess knowledge, while driving requires you to apply that knowledge while observing traffic and controlling the vehicle."}, {"question": "What is the best way to apply road rules in practice?", "answer": "Practise with a qualified instructor or suitable licensed supervisor, then discuss decisions after each manoeuvre."}, {"question": "Does K53 assess rules of the road?", "answer": "Yes. The practical test assesses safe driving, parking and following the rules of the road."}, {"question": "Should I memorise answers or learn the reasons behind rules?", "answer": "Learn the reasons. Understanding the rule makes it easier to make safe decisions when the situation looks different from a practice question."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'learner-driver-restrictions-can-you-drive-alone',
  'Did You Know? A Learner’s Licence Lets You Practise—Not Drive Independently',
  'A learner’s licence is permission to learn under the required supervision; it is not the same as a full driving licence.',
  'A learner’s licence is permission to learn under the required supervision; it is not the same as a full driving licence. South African government guidance states that a learner’s licence holder may drive only when supervised by a licensed driver. The purpose is safety. A learner is still building the ability to observe hazards, control the vehicle, understand road rules and make decisions under pressure. A suitable supervisor can guide the learner, help assess risky situations and intervene where necessary. Treat each supervised trip as deliberate practice. Short journeys to shops, school or work can help, but they should be planned around the learner’s current skill level. Start with quieter routes and daylight where possible, then progress to traffic, intersections, parking and different weather conditions as ability improves. A learner should never be pressured to drive alone merely because a route feels familiar. Familiar roads can still contain pedestrians, taxis, sudden stops and unexpected hazards.',
  'South African Government: learner’s licence supervision requirement.',
  'https://www.gov.za/services/driving-licence/apply-learners-licence',
  'Driving',
  '[{"question": "Can I drive alone with a learner’s licence in South Africa?", "answer": "No. You may drive only when supervised by a licensed driver who meets the applicable requirements."}, {"question": "Can I practise driving to the shops with my learner’s licence?", "answer": "Yes, if you have the correct learner’s licence and proper supervision, and the route is suitable for your skill level."}, {"question": "Does a learner’s licence allow me to drive at night?", "answer": "The key legal requirement is proper supervision. However, learners should build skills gradually and avoid conditions beyond their ability."}, {"question": "Is a learner’s licence the same as a temporary driver’s licence?", "answer": "No. A learner’s licence authorises supervised practice; it does not authorise independent driving."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'learner-driver-practice-different-supervisors',
  'Did You Know? Practising With Different Supervisors Can Create Confusion',
  'Learning with family members or friends can give a learner valuable extra time behind the wheel, but different supervisors may have different habits and advice. Not every habit reflects safe, current or K53-aligned driving practice.',
  'Learning with family members or friends can give a learner valuable extra time behind the wheel, but different supervisors may have different habits and advice. Not every habit reflects safe, current or K53-aligned driving practice. The practical driving test uses the K53 method, which evaluates safe driving, parking and following road rules. A learner can become confused when one person says “move off quickly” while another says “wait longer,” or when different people use different mirror-check routines. The answer is not to avoid extra practice. Instead, establish a consistent method with a qualified instructor, then ask other supervisors to support that same sequence. Keep a simple practice checklist: seat and mirror setup, observation, signalling, speed control, following distance, parking and post-drive feedback. After each practice session, identify one skill to improve next time. Consistency helps you build reliable habits rather than switching techniques every time you enter a different car.',
  'City of Cape Town: K53 driving-test overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Is it good to practise with more than one supervisor?", "answer": "It can be helpful for gaining experience, provided each supervisor is properly licensed and supports consistent safe-driving methods."}, {"question": "Why do family members teach different driving methods?", "answer": "Drivers develop personal habits over time. Some may be safe, while others may not match structured K53 training."}, {"question": "How can I prevent conflicting advice?", "answer": "Ask your instructor to explain the recommended process, then share that process with the people who supervise your practice."}, {"question": "Should I copy everything an experienced driver does?", "answer": "No. Experience does not automatically mean every habit is correct or suitable for a learner. Focus on lawful, safe and structured driving methods."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'after-passing-learners-licence-test-south-africa',
  'Did You Know? Your Learner’s Test Is the Start of Driving Knowledge, Not the Finish',
  'Passing the learner’s licence test confirms that you have met the required knowledge standard at that stage, but it does not mean you have mastered driving.',
  'Passing the learner’s licence test confirms that you have met the required knowledge standard at that stage, but it does not mean you have mastered driving. The learner’s test covers foundational areas such as road signs, rules of the road and vehicle controls. Practical driving then requires you to apply that knowledge in changing conditions. For example, recognising a slippery-road warning sign is only the first step. The real skill is reducing speed early, increasing following distance, avoiding harsh inputs and watching how other road users react. The same applies to intersections, pedestrian crossings, lane changes and parking. The best learners treat their learner’s licence as a licence to begin structured experience. Build skills in layers: vehicle familiarisation, moving off and stopping, steering and gear selection, traffic observation, intersections, parking, and eventually more complex routes. This gradual progression gives confidence a safer foundation than rushing into busy roads too early.',
  'NaTIS learner-driver manual resources.',
  'https://www.natis.gov.za/index.php/downloads/general-documents',
  'Driving',
  '[{"question": "Does passing the learner’s test mean I am ready to drive alone?", "answer": "No. A learner’s licence requires supervision, and practical skills still need to be developed."}, {"question": "What should I learn first after getting my learner’s licence?", "answer": "Start with vehicle familiarisation, safe moving off, stopping, steering, observation and basic low-traffic driving."}, {"question": "How can I improve after passing my learner’s test?", "answer": "Practise regularly with proper supervision and take structured driving lessons that build skills progressively."}, {"question": "Why are practical lessons still important after the learner’s test?", "answer": "They help you turn theory into safe decisions, accurate observation and controlled vehicle handling."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'choose-correct-south-african-driving-licence-code',
  'Did You Know? Choosing the Correct Licence Code Starts Before You Book a Test',
  'The right licence code depends on the type of vehicle you plan to drive, not simply on the biggest vehicle you hope to drive one day.',
  'The right licence code depends on the type of vehicle you plan to drive, not simply on the biggest vehicle you hope to drive one day. South Africa separates licence categories for motorcycles, light motor vehicles, heavy vehicles and combinations. Choosing correctly matters because the learner’s licence, training vehicle and practical test should align with the relevant category. A person who mainly intends to drive a private car should start by confirming the light motor vehicle requirements. Someone seeking work that involves heavy goods vehicles, buses or trailers may need a different category and, in some circumstances, further authorisations such as a professional driving permit. Do not rely solely on older “code number” terminology or social-media advice. Licensing categories and their practical implications can be misunderstood. Confirm the current requirement with a DLTC and use the official Department of Transport and NaTIS information as your starting point.',
  'Department of Transport: learner’s licence vehicle categories.',
  'https://www.transport.gov.za/?page_id=1176',
  'Driving',
  '[{"question": "What licence code do I need for a private car?", "answer": "Most private cars fall within the light motor vehicle category. Confirm the current code and test requirement with your DLTC."}, {"question": "Is a trailer licence different from a car licence?", "answer": "It can be. The required category depends on the vehicle and trailer combination, including the trailer’s mass. Confirm this before booking."}, {"question": "Do I need a different licence for a motorcycle?", "answer": "Yes. Motorcycle licensing is separate from ordinary light motor vehicle licensing."}, {"question": "Why should I confirm my category with a DLTC?", "answer": "The DLTC administers official licensing and can confirm the current category, application and test requirements for your planned vehicle."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'learner-driving-lessons-k53-preparation',
  'Did You Know? Driving Lessons Can Turn Theory Knowledge Into Safer Habits',
  'Theory knowledge is essential, but driving lessons help learners practise that knowledge in real time.',
  'Theory knowledge is essential, but driving lessons help learners practise that knowledge in real time. The K53 practical test assesses your ability to drive and park safely while following the rules of the road; it is not merely a written knowledge test. A structured lesson can break complex driving into manageable skills. An instructor may focus one lesson on moving off and stopping, another on mirror routines and observation, then build toward intersections, lane changes, parking and independent decision-making. This progression is particularly useful for learners who feel overwhelmed by busy traffic or struggle to coordinate steering, pedals and observation at once. Lessons do not remove the need for legal supervision during private practice. Instead, they can give your practice a clearer purpose. Ask for specific feedback: What should I repeat? What should I avoid? Which skill needs more work before I attempt more difficult routes? Over time, repeated correct actions become habits that support safer driving and stronger K53 readiness.',
  'City of Cape Town: practical driving test and K53 overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Are driving lessons useful after I pass my learner’s test?", "answer": "Yes. They help turn theory into practical habits, vehicle control and safer decisions in traffic."}, {"question": "Can lessons help with K53 preparation?", "answer": "Yes. K53 lessons can focus on the observation, vehicle-control, parking and road-driving skills assessed in the practical test."}, {"question": "Do I still need practice outside lessons?", "answer": "Where appropriate and legally supervised, extra practice helps reinforce skills learned in lessons."}, {"question": "How do I know what lesson type I need?", "answer": "Tell the instructor your experience level, whether you drive manual or automatic, and which situations feel difficult. A good instructor can build a suitable plan."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'driving-for-conditions-rain-fog-visibility',
  'Did You Know? Road Rules Change Meaning When Weather and Visibility Change',
  'A posted speed limit remains a maximum limit, but safe driving always depends on conditions.',
  'A posted speed limit remains a maximum limit, but safe driving always depends on conditions. Government road-safety guidance advises drivers to obey speed limits, avoid cellphone use, ensure vehicles are roadworthy and maintain a safe following distance. K53 guidance also requires longer following distance in adverse conditions such as rain, slippery surfaces and poor visibility. For a learner, this means the “correct” speed is not always the number on the sign. Heavy rain, glare, darkness, fog, standing water, pedestrians near the road or congested traffic may require you to slow down and create a larger safety buffer. Use visibility as a practical guide. If you cannot see far enough ahead to identify a hazard and stop safely, reduce speed. If another driver is following too closely, avoid sudden braking and increase your own gap ahead where safe. Good driving is not about maintaining a fixed speed— it is about matching speed and space to what is happening around you.',
  'Government road-safety guidance.',
  'https://www.vukuzenzele.gov.za/road-safety-tips',
  'Driving',
  '[{"question": "Should I always drive at the posted speed limit?", "answer": "No. The limit is a maximum. You must reduce speed when rain, visibility, traffic or road conditions make the maximum unsafe."}, {"question": "How should rain change my driving?", "answer": "Increase following distance, reduce speed, brake gently and avoid sudden steering or acceleration."}, {"question": "Does fog affect following distance?", "answer": "Yes. Poor visibility and slippery surfaces require a larger following gap and lower speed."}, {"question": "What should I do when another driver tailgates me in bad weather?", "answer": "Stay calm, avoid sudden braking, increase your space ahead and allow the driver to pass when it is safe."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'learner-driver-practice-quiet-streets-real-traffic',
  'Did You Know? The Best Learner Practice Includes More Than Quiet Streets',
  'Quiet streets are useful for learning the basics, but a learner eventually needs controlled exposure to the kinds of situations faced in everyday driving.',
  'Quiet streets are useful for learning the basics, but a learner eventually needs controlled exposure to the kinds of situations faced in everyday driving. The practical K53 test includes both a yard test and a road test, so learners need vehicle-control practice as well as roaddriving experience. A gradual approach works best. Begin with basic controls in a low-risk environment: seating position, mirror setup, moving off, stopping, steering and smooth braking. Progress to quiet roads, then practise at intersections, traffic circles, parking areas, busier streets and different times of day when you are ready. The aim is not to expose a learner to the hardest conditions too early. It is to build competence step by step. In Daveyton, Benoni, Etwatwa and surrounding Ekurhuleni areas, everyday driving can involve pedestrians, minibus taxis, changing traffic flow and busy intersections. Structured practice helps a learner observe these conditions without becoming overloaded.',
  'Ekurhuleni: K53 yard and road test information.',
  'https://www.ekurhuleni.gov.za/press-releases/community-empowerment/tips-for-learner-drivers-on-the-road/',
  'Driving',
  '[{"question": "Should a beginner learner start in busy traffic?", "answer": "No. Start in a safe, low-pressure environment and progress to more complex traffic as control and confidence improve."}, {"question": "Why is parking practice important for learners?", "answer": "Parking builds steering, observation, clutch or speed control, and spatial awareness. It is also part of practical test preparation."}, {"question": "Do learners need to practise intersections?", "answer": "Yes. Intersections require observation, speed control, signalling and correct application of right-of-way rules."}, {"question": "How often should a learner practise?", "answer": "Regular, focused sessions are generally more useful than rare, very long sessions. Build practice around specific skills."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'learner-driver-supervisor-valid-licence',
  'Did You Know? Your Supervisor’s Licence Must Be Valid Too',
  'A learner driver needs a properly licensed supervisor, and that supervisor’s licence must be valid for the vehicle category being driven.',
  'A learner driver needs a properly licensed supervisor, and that supervisor’s licence must be valid for the vehicle category being driven. South African government guidance states that a learner’s licence holder may drive only under supervision by a licensed driver. NaTIS further notes specific supervision requirements where a vehicle requires a professional driving permit. This rule matters because the supervisor is not simply a passenger. They are responsible for guiding a learner who has not yet qualified to drive independently. Before a practice session, confirm that the supervising driver is licensed for the relevant vehicle and is fit to supervise: sober, alert, familiar with the vehicle and willing to give calm directions. A valid licence alone does not necessarily make someone a good teacher. Choose a supervisor who will not distract, shout or encourage risky shortcuts. If private practice is stressful or inconsistent, a professional instructor can provide a structured environment while the learner continues to gain supervised experience legally.',
  'South African Government: learner-driver supervision rule.',
  'https://www.gov.za/services/driving-licence/apply-learners-licence',
  'Driving',
  '[{"question": "Must my learner-driver supervisor have a valid licence?", "answer": "Yes. The supervisor must be properly licensed for the vehicle category being driven."}, {"question": "Can an expired licence holder supervise a learner?", "answer": "No. The supervisor needs a valid licence."}, {"question": "Does the supervisor need to sit in front?", "answer": "The supervisor should sit where they can properly observe and guide the learner, normally in the front passenger seat. Confirm any special requirements with the DLTC for your situation."}, {"question": "Can a supervisor use alcohol before a learner practice session?", "answer": "No. A supervisor should be sober, alert and capable of responsibly guiding the learner."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'learner-driver-observation-skills-k53',
  'Did You Know? Learner Drivers Need to Build Observation Before Confidence',
  'Confidence can be useful only when it is built on reliable observation and safe decisions. In the K53 method, observation includes using mirrors and blind-spot checks to establish whether conditions are safe around the vehicle.',
  'Confidence can be useful only when it is built on reliable observation and safe decisions. In the K53 method, observation includes using mirrors and blind-spot checks to establish whether conditions are safe around the vehicle. This is why learners should focus on seeing, assessing and planning—not merely on making the car move. Good observation means looking well ahead, checking mirrors regularly, identifying hazards early and monitoring what is happening beside and behind you. It also means recognising when a situation is too complex for your current skill level and slowing down or waiting rather than forcing a decision. A learner may feel confident on a familiar route but still miss a pedestrian, motorcycle, cyclist or vehicle entering from a side street. Develop a simple routine: look far ahead, scan intersections, check mirrors before changing speed or direction, signal early, and do a proper blind-spot check before moving sideways. Confidence grows naturally when this routine becomes consistent.',
  'NaTIS K53 light motor vehicle combination documentation: observation, mirror and blindspot checks.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "What does observation mean in K53 driving?", "answer": "It means checking around the vehicle—using mirrors and blind-spot checks—to decide whether a manoeuvre is safe."}, {"question": "Why are blind-spot checks important?", "answer": "Mirrors do not show every area beside the vehicle. A blind-spot check helps detect road users that may be hidden."}, {"question": "How can a learner improve observation?", "answer": "Use a consistent routine: look ahead, scan for hazards, check mirrors before changing speed or direction, signal and check blind spots before moving sideways."}, {"question": "Is confidence enough to make someone a safe driver?", "answer": "No. Safe confidence is based on observation, vehicle control, judgement and respect for road rules."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'what-k53-driving-test-assesses-south-africa',
  'Did You Know? K53 Tests Safe Driving Habits, Not Just Vehicle Movement',
  'The South African practical driving test uses the K53 method. It is designed to assess whether a candidate can drive and park while following the rules of the road—not simply whether they can start a car and steer it.',
  'The South African practical driving test uses the K53 method. It is designed to assess whether a candidate can drive and park while following the rules of the road—not simply whether they can start a car and steer it. Ekurhuleni also describes the K53 test as incorporating a yard test and a road test. That is why K53 preparation includes much more than memorising manoeuvres. You need controlled use of the vehicle, consistent observation, correct signalling, safe speed choice, lane discipline and the ability to respond appropriately at intersections. A parking manoeuvre, for example, is not only about ending in the correct position; it also requires safe observation before and during movement. Approach K53 as a safety system. Practise the same habits during every lesson: seat and mirror setup, observation before moving, smooth control, lawful road positioning and calm decisionmaking. These habits help on test day, but more importantly, they remain useful after you receive your licence.',
  'City of Cape Town: K53 practical test overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What does K53 test?", "answer": "It tests practical ability to drive and park safely while following the rules of the road."}, {"question": "Is K53 only about parking?", "answer": "No. It includes both yard manoeuvres and road driving, as well as observation and safe decision-making."}, {"question": "Why are observation habits important in K53?", "answer": "Observation helps demonstrate that you are checking whether it is safe before changing direction, position or speed."}, {"question": "Can I prepare for K53 through normal driving practice?", "answer": "Yes, if your practice is structured around K53-safe habits rather than shortcuts or inconsistent routines."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-observation-mirrors-blind-spots',
  'Did You Know? Observation Is a Continuous Part of the K53 Test',
  'Observation is not a single glance before you move. In K53 material, observation includes mirrors and blind-spot checks to determine whether the area behind, ahead and beside the vehicle is safe.',
  'Observation is not a single glance before you move. In K53 material, observation includes mirrors and blind-spot checks to determine whether the area behind, ahead and beside the vehicle is safe. The driver must keep reassessing conditions as a manoeuvre develops because traffic and pedestrians can change position quickly. In practical terms, this means checking before moving off, before changing lanes, before turning, before pulling away from the kerb and while reversing. The exact observation needed depends on the manoeuvre, but the purpose remains the same: do not move into space you have not checked. Many learners focus so heavily on clutch control, steering or the test examiner that they forget to observe naturally. Build observation into every practice session until it becomes automatic. Before any change in direction or position, ask: What could be beside me? What is approaching? What is behind me? That mindset supports both K53 performance and lifelong defensive driving.',
  'NaTIS K53 light motor vehicle combination documentation on observation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "What is observation in the K53 test?", "answer": "It is the process of checking mirrors, blind spots and surrounding traffic to make sure a manoeuvre is safe."}, {"question": "When should I observe during a driving lesson?", "answer": "Before moving off, changing lanes, turning, stopping at the kerb, reversing or changing road position."}, {"question": "Are mirrors enough for K53 observation?", "answer": "No. Mirrors help, but blind-spot checks are needed when the mirrors cannot show the whole area beside the vehicle."}, {"question": "How do I make observation a habit?", "answer": "Link it to every manoeuvre: observe first, signal when required, then move only when safe."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-mirror-checks-vs-blind-spot-checks',
  'Did You Know? Mirror Checks and Blind-Spot Checks Do Different Jobs',
  'Mirrors and blind-spot checks work together, but they are not interchangeable. Mirrors help you monitor traffic behind and alongside the vehicle, while a blind-spot check helps you see areas that mirrors cannot cover.',
  'Mirrors and blind-spot checks work together, but they are not interchangeable. Mirrors help you monitor traffic behind and alongside the vehicle, while a blind-spot check helps you see areas that mirrors cannot cover. K53 documentation defines observation as including mirror use and blind-spot checks to establish whether it is safe to the rear, front and sides. Before changing lanes or moving away from the kerb, use your mirrors to assess the overall traffic situation. Then check the blind spot on the side you plan to move toward. This quick shoulder check is especially important for motorcycles, cyclists and smaller vehicles that can be hidden from mirror view. Do not turn your head away from the road for too long. The goal is a brief, purposeful check followed by a smooth manoeuvre only if the space is clear. Repeating this sequence during lessons builds a reliable habit: mirrors, appropriate signal, blind spot, then move when safe.',
  'NaTIS K53 light motor vehicle documentation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "Why is a blind-spot check needed if I used my mirrors?", "answer": "Mirrors cannot show every area beside the vehicle. A blind-spot check helps identify vehicles or road users hidden from view."}, {"question": "When should I check my blind spot?", "answer": "Before changing lanes, moving away from the kerb, merging or making a sideways movement."}, {"question": "Which blind spot should I check?", "answer": "Check the side you intend to move toward. For example, check right before moving or changing lanes to the right."}, {"question": "Can motorcycles be hidden in a blind spot?", "answer": "Yes. Their smaller profile makes careful mirror and blind-spot observation especially important."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-moving-off-procedure-safely',
  'Did You Know? Moving Off Safely Starts Before the Vehicle Moves',
  'Moving off safely begins with preparation and observation, not with releasing the clutch or pressing the accelerator.',
  'Moving off safely begins with preparation and observation, not with releasing the clutch or pressing the accelerator. K53 guidance treats observation as the use of mirrors and blind-spot checks to determine whether it is safe around the vehicle. Before pulling away from a kerb, parking bay or stopped position, a learner should be properly seated, have mirrors adjusted, select the appropriate gear and check for approaching traffic or vulnerable road users. The exact sequence can differ slightly depending on whether the vehicle is manual or automatic and where it is positioned. However, the principle is consistent: prepare the vehicle, communicate your intention where required, observe thoroughly and move only when safe. Rushing the move-off is a common beginner mistake. A learner may focus entirely on preventing a stall and fail to see a cyclist, pedestrian or passing vehicle. Practise slowly at first. Make correct observation the priority, then develop smoother clutch, brake and accelerator control through repetition.',
  'NaTIS K53 documentation on observation and safe manoeuvres.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "What should I do before moving off from the kerb?", "answer": "Prepare the vehicle, check mirrors and the relevant blind spot, signal where required, and move only when the area is safe."}, {"question": "Why do learners stall when moving off?", "answer": "Stalling usually comes from releasing the clutch too quickly, not finding the biting point, or not using enough controlled accelerator input."}, {"question": "Should I move off quickly if traffic is waiting behind me?", "answer": "No. Safety and proper observation come first. With practice, smooth controlled moving-off becomes quicker naturally."}, {"question": "Do automatic cars need the same observation before moving off?", "answer": "Yes. Pedal operation differs, but checking mirrors, blind spots and surrounding traffic remains essential."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-controlled-stop-smooth-braking',
  'Did You Know? Smooth Stops Show More Than Brake Control',
  'A controlled stop demonstrates more than the ability to press the brake pedal.',
  'A controlled stop demonstrates more than the ability to press the brake pedal. It shows that a driver can identify a suitable stopping place, check surrounding traffic, reduce speed progressively, position the vehicle correctly and stop without creating unnecessary risk. The K53 practical test evaluates the ability to drive safely and follow road rules. Learners often focus only on preventing a stall in a manual vehicle. Although clutch timing matters, safe observation and a gradual, well-planned stop matter too. Look ahead early, decide where to stop, check mirrors before reducing speed, signal if required and brake smoothly. In a manual vehicle, coordinate the clutch near the end of the stop to maintain control and avoid stalling. Avoid harsh late braking unless there is an emergency. Sudden braking can surprise drivers behind you and make your passenger uncomfortable. Good controlled stops come from looking further ahead and planning earlier—not simply from having a sensitive foot on the brake.',
  'City of Cape Town: K53 practical driving-test overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What is a controlled stop in driving?", "answer": "It is a planned, smooth stop made with proper observation, safe positioning and progressive braking."}, {"question": "Why should I check mirrors before slowing down?", "answer": "Checking mirrors helps you understand what is behind you before you change speed, particularly if a vehicle is following closely."}, {"question": "How can I stop without stalling a manual car?", "answer": "Brake progressively, then press the clutch near the end of the stop before the engine speed becomes too low. Practise with an instructor."}, {"question": "Is hard braking always wrong in K53?", "answer": "Hard braking may be necessary in a genuine emergency. For normal stops, aim for smooth, planned braking and controlled positioning."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-yard-test-road-test-explained',
  'Did You Know? The K53 Test Includes Yard and Road Components',
  'The K53 practical driving test is not limited to driving on public roads. Ekurhuleni explains that the K53 method incorporates a yard test for parking manoeuvres and a road test.',
  'The K53 practical driving test is not limited to driving on public roads. Ekurhuleni explains that the K53 method incorporates a yard test for parking manoeuvres and a road test. This structure allows the examiner to assess low-speed control and manoeuvring separately from real-road driving skills. The yard component is where learners practise controlled manoeuvres such as parking and reversing tasks. It demands precision, but it also demands observation and calm vehicle control. The road component assesses how you apply safe driving habits among other traffic, signs, intersections and changing conditions. Prepare for both sections. Learners sometimes spend all their time on yard manoeuvres because they feel predictable, then struggle with observation and decision-making on the road. Others are comfortable in traffic but have not practised slow-speed control enough. A balanced lesson plan gives attention to both, while always following the official K53 guidance used by the relevant test centre.',
  'Ekurhuleni: learner-driver information on K53 yard and road tests.',
  'https://www.ekurhuleni.gov.za/press-releases/community-empowerment/tips-for-learner-drivers-on-the-road/',
  'Driving',
  '[{"question": "Does the K53 test include parking?", "answer": "Yes. The practical test includes a yard component that assesses parking manoeuvres."}, {"question": "Does the K53 test include driving on public roads?", "answer": "Yes. The road component assesses practical driving and application of road rules."}, {"question": "Should I practise the yard test before road driving?", "answer": "Both are important. Beginners may start with basic yard control, then build road skills progressively while continuing to practise manoeuvres."}, {"question": "Can requirements differ between vehicle categories?", "answer": "Yes. K53 materials exist for different vehicle categories. Confirm the correct requirements for your test category with your instructor and DLTC."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-parking-manoeuvres-observation-control',
  'Did You Know? Parking Manoeuvres Test Observation as Well as Steering',
  'Parking manoeuvres are often seen as steering exercises, but safe parking depends equally on observation, speed control and awareness of the vehicle’s position.',
  'Parking manoeuvres are often seen as steering exercises, but safe parking depends equally on observation, speed control and awareness of the vehicle’s position. The K53 practical test includes a yard component for parking manoeuvres, while K53 observation guidance requires drivers to check mirrors and blind spots to establish whether it is safe around the vehicle. Whether you are parallel parking, bay parking or reversing into a space, move slowly enough to make corrections safely. Before reversing, check around the vehicle carefully for people, vehicles or obstacles. During the manoeuvre, use the appropriate mirrors and look in the direction of travel. Do not stare at one mirror so long that you stop monitoring the broader environment. A parking error is often recoverable if you remain calm and correct it safely. Rushing, oversteering or ignoring observation usually makes the situation worse. Practise using reference points as training aids, but focus on understanding the vehicle’s movement rather than memorising one exact parking space.',
  'Ekurhuleni: K53 yard test includes parking manoeuvres.',
  'https://www.ekurhuleni.gov.za/press-releases/community-empowerment/tips-for-learner-drivers-on-the-road/',
  'Driving',
  '[{"question": "Is parking included in the K53 driving test?", "answer": "Yes. The K53 practical test includes yard manoeuvres involving parking."}, {"question": "Why must I observe while parking slowly?", "answer": "Pedestrians, vehicles or obstacles can still enter the area around your vehicle, even at low speed."}, {"question": "Should I rely only on mirrors when reversing?", "answer": "Use mirrors as part of observation, but also look in the direction of travel and check around the vehicle as needed."}, {"question": "How can I improve parking confidence?", "answer": "Practise slowly in a safe area, learn how the vehicle responds to steering inputs, and ask an instructor for feedback on observation and positioning."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-hill-start-manual-car-control',
  'Did You Know? A Hill Start Is About Control, Not Speed',
  'A hill start tests whether a driver can coordinate the vehicle safely on an incline without rolling backward unnecessarily or rushing into traffic.',
  'A hill start tests whether a driver can coordinate the vehicle safely on an incline without rolling backward unnecessarily or rushing into traffic. In a manual vehicle, the main challenge is managing clutch engagement, brake control and enough accelerator input to move away smoothly. K53 practical testing evaluates safe driving ability and vehicle control, rather than speed alone. The key is preparation. Keep the vehicle secure while stopped, select the appropriate gear, observe properly and move only when it is safe. As you release the clutch toward the biting point, the engine and vehicle will begin to take up the load. Release the brake in a controlled way and add enough accelerator to move off smoothly. Different vehicles respond differently, so learners should practise in the actual type of car they are training in. Avoid trying to “race” the clutch or accelerator because this can lead to stalling, rolling or harsh movement. With repeated practice, a good hill start feels controlled and calm rather than dramatic.',
  'City of Cape Town: K53 practical driving-test overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Why do manual cars roll back on hills?", "answer": "They can roll if the brake is released before clutch engagement and engine power are sufficient to move the car forward."}, {"question": "What is the biting point?", "answer": "It is the point where the clutch begins to engage and transmit engine power to the wheels."}, {"question": "Can an automatic car roll back on a hill?", "answer": "Many automatics creep forward in Drive, but hill-start behaviour differs by vehicle. Keep the brake applied until it is safe to move and learn your vehicle’s controls."}, {"question": "How can I practise hill starts safely?", "answer": "Start on a gentle slope with a qualified instructor or licensed supervisor, use a quiet area and practise controlled movement before attempting steeper or busier roads."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-reversing-safely-observation-control',
  'Did You Know? Reversing Safely Requires Looking Where You Are Going',
  'Reversing is a low-speed manoeuvre, but it can still be high risk because the area behind a vehicle is harder to see.',
  'Reversing is a low-speed manoeuvre, but it can still be high risk because the area behind a vehicle is harder to see. K53 observation guidance emphasises using mirrors and blind-spot checks to determine whether it is safe around the vehicle. When reversing, a driver must actively monitor the direction of travel rather than relying on a single mirror or assuming the space will remain clear. Before reversing, check around the vehicle for pedestrians, children, cyclists, animals, other vehicles and obstacles. Reverse slowly enough to stop immediately if anything changes. Use mirrors to judge position and distance, but turn your head as necessary to look where the vehicle is travelling. For learners, reversing also teaches fine clutch control in a manual vehicle or careful brake modulation in an automatic. Speed should stay low. If you lose your reference point or feel uncertain, stop safely, reassess and correct. A calm reset is always safer than continuing a manoeuvre you cannot clearly see.',
  'NaTIS K53 documentation on observation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "Why is reversing dangerous even at low speed?", "answer": "The driver has less direct visibility behind the vehicle, and pedestrians or objects can be hidden in the reversing path."}, {"question": "Should I use mirrors when reversing?", "answer": "Yes, use mirrors to monitor position, but also look in the direction of travel and check around the vehicle properly."}, {"question": "How fast should I reverse?", "answer": "Reverse very slowly—at a speed that allows you to stop immediately if a hazard appears."}, {"question": "What should I do if I lose my position while reversing?", "answer": "Stop safely, observe again and correct slowly. Do not keep moving if you are unsure of the available space."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-driving-test-day-preparation',
  'Did You Know? Test-Day Preparation Can Help You Drive More Calmly',
  'Good test-day preparation does not guarantee a pass, but it can reduce avoidable stress and help you focus on safe driving.',
  'Good test-day preparation does not guarantee a pass, but it can reduce avoidable stress and help you focus on safe driving. Government guidance says applicants should take a valid learner’s licence when booking a driving test, while practical driving tests use the K53 method. Check the exact current document and vehicle requirements with your chosen DLTC before the appointment. The evening before, confirm your booking details, learner’s licence validity, identity document, transport plan and the condition of the vehicle you will use. Arrive early enough to settle yourself rather than rushing. Wear comfortable footwear that allows reliable pedal control, and avoid trying unfamiliar techniques on the morning of the test. During the test, focus on the next safe action rather than trying to predict the result. Set up your seat and mirrors, observe consistently, follow lawful instructions, and recover calmly from small errors where possible. A good test mindset is not “I must be perfect.” It is “I will show safe, controlled and observant driving.”',
  'South African Government: driving-licence application and learner’s licence requirement.',
  'https://www.gov.za/services/driving-licence/apply-driving-licence',
  'Driving',
  '[{"question": "What should I bring to my K53 driving test?", "answer": "Bring the documents required by your DLTC, including a valid learner’s licence as listed in government guidance. Confirm the current checklist directly with the centre."}, {"question": "Should I practise on the morning of my driving test?", "answer": "A short familiarisation drive may help if arranged safely, but avoid exhausting yourself or attempting new skills just before the test."}, {"question": "What if I make a small mistake during the K53 test?", "answer": "Stay calm, continue safely and follow the examiner’s instructions. Do not assume one moment automatically determines the entire result."}, {"question": "How early should I arrive at the DLTC?", "answer": "Arrive early enough to complete any administrative steps without rushing. Confirm the recommended arrival time with the DLTC."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-manoeuvre-sequence-safe-order',
  'Did You Know? K53 Uses a Structured Sequence for Every Manoeuvre',
  'K53 is built around repeatable sequences that help drivers perform manoeuvres safely and consistently. Observation is defined as the use of mirrors and blind-spot checks to determine whether it is safe to the rear, front and sides.',
  'K53 is built around repeatable sequences that help drivers perform manoeuvres safely and consistently. Observation is defined as the use of mirrors and blind-spot checks to determine whether it is safe to the rear, front and sides. Before any change in position or direction, a learner should prepare the vehicle, observe properly, signal where required, and only then move when safe. This structure matters because it reduces the chance of missing a critical check under pressure. For example, before moving off from the kerb, a driver should set up the vehicle, check mirrors and the relevant blind spot, signal if required, and then move only after confirming it is safe. The same principle applies to lane changes, turning, parking and reversing. During lessons, treat each manoeuvre as a sequence rather than a single action. Practise the same safe order until it becomes automatic. On test day, this helps you stay calm because you are repeating a familiar process rather than improvising under stress.',
  'NaTIS K53 light motor vehicle combination documentation on observation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "What is a K53 manoeuvre sequence?", "answer": "It is a structured order of preparation, observation, signalling (where required) and movement designed to keep driving safe and consistent."}, {"question": "Why does K53 use the same sequence for different manoeuvres?", "answer": "A consistent sequence helps drivers avoid missing important safety checks, especially under pressure."}, {"question": "Do I need to say the steps out loud during a test?", "answer": "Follow your instructor’s guidance and the examiner’s instructions. The focus is on performing safe actions, not reciting steps."}, {"question": "Can I change the K53 sequence if I feel more comfortable?", "answer": "No. Use the official K53 method taught by your instructor and aligned with test requirements."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'what-k53-examiners-look-for',
  'Did You Know? Examiners Watch How You Plan, Not Only What You Do',
  'The K53 practical driving test assesses whether you can drive and park safely while following the rules of the road. That means the examiner is observing your decision-making process as well as your vehicle control.',
  'The K53 practical driving test assesses whether you can drive and park safely while following the rules of the road. That means the examiner is observing your decision-making process as well as your vehicle control. A smooth manoeuvre that ignores observation or planning is less safe than a slightly slower manoeuvre that shows clear thought and awareness. Examiners look for evidence that you are scanning ahead, checking mirrors at appropriate times, anticipating hazards and choosing safe gaps. They also watch whether you adjust speed for conditions, maintain lane discipline and respond correctly to signs and signals. This is why K53 preparation should focus on safe habits, not “tricks” to pass. Practise explaining your decisions to your instructor: Why did you slow down there? What were you checking before you changed lanes? This builds the mindset that examiners expect: a driver who plans first, then acts.',
  'City of Cape Town: K53 practical test overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What do K53 examiners look for?", "answer": "They assess safe driving, parking and application of road rules, including observation, planning and vehicle control."}, {"question": "Can I pass if I make a small mistake?", "answer": "Yes. Examiners assess overall safe driving. A single minor error does not automatically mean failure if the rest of the drive is safe and controlled."}, {"question": "Should I talk during my K53 test?", "answer": "Follow the examiner’s instructions. Some communication may be necessary, but the focus is on safe driving, not conversation."}, {"question": "How can I show good planning during a test?", "answer": "Demonstrate early observation, appropriate speed choice, safe gaps and calm corrections when needed."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-signalling-indicator-use',
  'Did You Know? Signalling Early Helps Other Road Users Predict Your Actions',
  'Indicators are a communication tool, not just a test requirement. Signalling early and clearly helps other drivers, pedestrians and cyclists understand what you intend to do next.',
  'Indicators are a communication tool, not just a test requirement. Signalling early and clearly helps other drivers, pedestrians and cyclists understand what you intend to do next. K53 documentation emphasises observation and safe manoeuvres, and signalling fits into that sequence before changing position or direction. A good rule is to signal with enough time for others to notice and react, but not so early that the signal becomes misleading. For example, signal before changing lanes, before turning at an intersection and when pulling away from or toward the kerb where required. Cancel the signal once the manoeuvre is complete. Learners sometimes forget to signal when focused on clutch control or steering. Make signalling part of your routine: prepare, observe, signal, check again, then move when safe. Over time this becomes automatic and supports safer interaction with other road users in busy Ekurhuleni traffic.',
  'NaTIS K53 documentation on observation and safe manoeuvres.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "When should I signal during a K53 test?", "answer": "Signal before changing direction or position where required, with enough time for others to notice, and cancel once the manoeuvre is complete."}, {"question": "What if I signal too early?", "answer": "Signalling too early can confuse other road users. Signal at a point that clearly relates to your intended manoeuvre."}, {"question": "Do I need to signal in a quiet street?", "answer": "Yes. Signalling builds a consistent habit and communicates your intention even when traffic is light."}, {"question": "Can I fail for not signalling?", "answer": "Failing to signal where required can be recorded as a fault. Consistent, appropriate signalling is part of safe driving assessment."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-lane-discipline-position',
  'Did You Know? K53 Lane Discipline Is About Position, Not Just Staying in Lane',
  'Lane discipline in K53 is more than remaining between the lines. It includes choosing the correct lane for your intended direction, maintaining a safe position within the lane and avoiding unnecessary weaving.',
  'Lane discipline in K53 is more than remaining between the lines. It includes choosing the correct lane for your intended direction, maintaining a safe position within the lane and avoiding unnecessary weaving. K53 observation guidance requires drivers to check mirrors and blind spots before changing position. On multi-lane roads, stay in the left lane unless overtaking or preparing for a right turn where appropriate. Do not drift between lanes or “straddle” markings. Keep a steady position that gives you space on both sides and allows other drivers to predict your path. In Gauteng traffic, lane discipline also means anticipating taxis, buses and trucks that may need extra space. Give large vehicles room, avoid lingering in blind spots and signal early when you must change lanes. Good lane discipline reduces stress for you and everyone around you.',
  'NaTIS K53 documentation on observation and lane changes.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "What is lane discipline in K53?", "answer": "It means staying in the correct lane, maintaining a safe position within the lane and changing lanes only when necessary and safe."}, {"question": "Which lane should I use on a multi-lane road?", "answer": "Generally, use the left lane unless overtaking or preparing for a right turn, and follow road signs and markings."}, {"question": "Is it wrong to change lanes frequently?", "answer": "Frequent unnecessary lane changes can be unsafe. Plan your route and lane position in advance."}, {"question": "Do large vehicles affect lane discipline?", "answer": "Yes. Give trucks and buses extra space, avoid lingering beside them and check blind spots carefully before moving near them."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-intersections-observation-right-of-way',
  'Did You Know? Intersections Test Observation More Than Right-of-Way Knowledge',
  'Knowing right-of-way rules is important, but intersections test whether you can apply those rules while observing multiple hazards at once.',
  'Knowing right-of-way rules is important, but intersections test whether you can apply those rules while observing multiple hazards at once. K53 practical testing assesses safe driving and road-rule compliance, including behaviour at intersections. At any intersection, you may need to monitor traffic from multiple directions, pedestrians crossing, cyclists, motorcycles and vehicles turning across your path. A safe approach includes slowing early, checking mirrors, scanning left and right, confirming signals and signs, and proceeding only when the way is clear. Learners often focus so much on “who goes first” that they miss a pedestrian stepping off the curb or a motorcycle approaching quickly. Treat every intersection as a mini risk-assessment: What could go wrong here? Where is my safe stopping point? This mindset supports both K53 success and everyday safety in areas like Daveyton, Benoni and Springs.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What do examiners watch for at intersections?", "answer": "They assess observation, speed control, correct application of right-of-way rules and safe decision-making."}, {"question": "Should I stop at every intersection during a test?", "answer": "Follow the signs and signals. Stop where required, yield where required, and proceed only when safe."}, {"question": "How can I improve intersection safety?", "answer": "Slow early, scan all directions, check mirrors, watch for pedestrians and motorcycles, and be prepared to stop."}, {"question": "Do traffic lights make intersections safer?", "answer": "They help, but you still need to observe for vehicles running red lights, pedestrians and other hazards."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'controlled-stop-vs-emergency-stop-k53',
  'Did You Know? A Controlled Stop Is Different From an Emergency Stop',
  'A controlled stop is a planned, smooth stop made with proper observation and progressive braking. An emergency stop is a maximum-effort stop used only when a sudden hazard requires the shortest possible stopping distance.',
  'A controlled stop is a planned, smooth stop made with proper observation and progressive braking. An emergency stop is a maximum-effort stop used only when a sudden hazard requires the shortest possible stopping distance. K53 testing assesses safe driving and vehicle control, which includes appropriate braking for different situations. In normal driving and during most of the test, you should aim for controlled stops: look ahead early, decide where to stop, check mirrors before slowing, brake smoothly and position the vehicle correctly. Emergency stops are for genuine emergencies and require different technique, including firm braking and, in ABS vehicles, holding the brake firmly. Confusing the two can lead to harsh braking in normal traffic or inadequate braking in an emergency. Practise controlled stops regularly so they become your default. Understand emergency braking separately, and use it only when truly necessary.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What is a controlled stop?", "answer": "A planned, smooth stop made with proper observation, safe positioning and progressive braking."}, {"question": "When should I use an emergency stop?", "answer": "Only when a sudden hazard requires you to stop as quickly as possible to avoid a collision."}, {"question": "Can harsh braking in normal traffic be a fault?", "answer": "Yes. Unnecessary harsh braking can indicate poor planning and may be recorded as a fault."}, {"question": "Do ABS cars change how I emergency stop?", "answer": "In ABS vehicles, you generally press the brake firmly and hold it, allowing the system to prevent wheel lockup. Confirm the correct technique with your instructor."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-vehicle-setup-seat-mirrors',
  'Did You Know? K53 Preparation Includes Vehicle Setup Before the Engine Starts',
  'K53 preparation begins before the engine starts. Proper seat position, mirror adjustment and familiarisation with controls help you drive safely and comfortably.',
  'K53 preparation begins before the engine starts. Proper seat position, mirror adjustment and familiarisation with controls help you drive safely and comfortably. K53 observation requires effective use of mirrors and blind-spot checks, which depend on correct setup. Adjust the seat so you can reach pedals fully while keeping a slight bend in your knees and your back supported. Set mirrors to minimise blind spots while still allowing you to see the road edges and traffic behind. Ensure you understand the location of lights, indicators, wipers, demisters and the handbrake before moving off. A good setup reduces strain, improves control and makes observation easier. It also shows the examiner that you approach driving methodically. Make vehicle setup a fixed part of every lesson and test routine.',
  'NaTIS K53 documentation on observation and vehicle control.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "Why adjust mirrors before driving?", "answer": "Correct mirror adjustment improves your view of traffic behind and beside you, supporting safer observation."}, {"question": "How should I sit for safe driving?", "answer": "Sit upright with your back supported, knees slightly bent when pressing pedals, and arms slightly bent when holding the wheel."}, {"question": "Should I adjust mirrors during a test?", "answer": "Adjust mirrors before moving off. If you must adjust during the drive, do so only when it is safe and necessary."}, {"question": "Do automatic cars need the same setup?", "answer": "Yes. Seat, mirror and control familiarisation are important regardless of transmission type."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-test-mistakes-calm-corrections',
  'Did You Know? K53 Rewards Calm Corrections, Not Perfect First Attempts',
  'K53 assesses safe driving, not perfection. Examiners understand that learners may need to correct a position, adjust speed or reposition for a manoeuvre.',
  'K53 assesses safe driving, not perfection. Examiners understand that learners may need to correct a position, adjust speed or reposition for a manoeuvre. What matters is whether you recognise the issue and respond safely. The practical test evaluates your ability to drive and park while following road rules. For example, if you enter a parking bay slightly off-centre, a calm, well-observed correction is safer than forcing the vehicle into position without checking. Similarly, if you realise you are in the wrong lane, a safe correction at the next opportunity is better than a sudden, risky lane change. This is why panic is more dangerous than a small error. Breathe, observe, signal if required, and correct smoothly. Practise recovery techniques during lessons so you are not surprised if something does not go perfectly on test day.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Will I fail if I make a small mistake in K53?", "answer": "Not necessarily. Examiners assess overall safe driving. Calm, safe corrections can demonstrate good judgement."}, {"question": "What should I do if I misjudge a parking space?", "answer": "Stop safely, observe again and correct slowly if there is space and it is safe to do so."}, {"question": "Is it better to continue or correct a mistake?", "answer": "Correct only if it can be done safely. Do not make sudden or unsafe movements to “fix” an error."}, {"question": "How can I stay calm during a test?", "answer": "Practise recovery scenarios during lessons, focus on the next safe action and maintain steady breathing."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-test-route-everyday-hazards',
  'Did You Know? Your Test Route May Include Everyday Hazards, Not Just Quiet Roads',
  'K53 test routes are designed to assess real-world driving, not only ideal conditions. Ekurhuleni notes that the K53 method includes both a yard test and a road test.',
  'K53 test routes are designed to assess real-world driving, not only ideal conditions. Ekurhuleni notes that the K53 method includes both a yard test and a road test. That road component may include intersections, pedestrian activity, traffic calming, lane changes and varying traffic density. This does not mean you will be sent into impossible situations. It does mean you should be prepared for everyday conditions: pedestrians near the road, taxis stopping unexpectedly, vehicles entering from side streets, and changing traffic flow. Your task is to show safe observation, appropriate speed and lawful decisions. Prepare by driving in a range of conditions during lessons: different times of day, various road types and realistic traffic. Do not rely only on one “perfect” quiet route. Confidence comes from knowing you can handle normal hazards safely, not from avoiding them entirely.',
  'Ekurhuleni: K53 yard and road test information.',
  'https://www.ekurhuleni.gov.za/press-releases/community-empowerment/tips-for-learner-drivers-on-the-road/',
  'Driving',
  '[{"question": "Are K53 test routes always quiet?", "answer": "No. Routes may include everyday traffic, intersections and pedestrian activity to assess realworld driving."}, {"question": "Will the examiner put me in danger?", "answer": "No. The route is designed to assess safe driving within reasonable conditions."}, {"question": "How can I prepare for a realistic test route?", "answer": "Practise in varied conditions during lessons, including different road types and traffic levels."}, {"question": "What if traffic is heavier than expected on test day?", "answer": "Adjust your speed, increase following distance and focus on safe observation. The examiner expects you to drive for conditions."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'k53-safety-framework-not-just-test',
  'Did You Know? K53 Is a Safety Framework, Not Just a Test Checklist',
  'K53 is often described as a test method, but it is better understood as a safety framework. It structures observation, vehicle control and decision-making so that safe habits become consistent.',
  'K53 is often described as a test method, but it is better understood as a safety framework. It structures observation, vehicle control and decision-making so that safe habits become consistent. K53 documentation defines observation as using mirrors and blind-spot checks to determine whether it is safe around the vehicle. This framework remains useful after you pass your test. The same observation routines that help you pass K53 also help you avoid collisions, manage busy intersections and share the road with pedestrians and motorcycles. Approach K53 as training for lifelong safe driving, not just a hurdle to clear. Ask your instructor how each manoeuvre relates to real-world risk. For example, why is a blind-spot check important when changing lanes on a busy Gauteng highway? Understanding the “why” makes the “how” more meaningful.',
  'NaTIS K53 documentation on observation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "Is K53 only for passing a driving test?", "answer": "No. K53 is a safety framework that supports safe driving habits beyond the test."}, {"question": "Why does K53 emphasise observation?", "answer": "Observation helps drivers detect hazards early and make safer decisions in real traffic."}, {"question": "Can I use K53 habits after I get my licence?", "answer": "Yes. The same observation and control routines help you drive safely as a licensed driver."}, {"question": "How can I learn the “why” behind K53?", "answer": "Ask your instructor to explain how each routine reduces risk in real driving situations."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'manual-clutch-control-smooth-driving',
  'Did You Know? Clutch Control Is the Foundation of Smooth Manual Driving',
  'In a manual vehicle, the clutch connects and disconnects the engine from the wheels. Smooth clutch control allows you to move off, change gears and stop without jerking or stalling.',
  'In a manual vehicle, the clutch connects and disconnects the engine from the wheels. Smooth clutch control allows you to move off, change gears and stop without jerking or stalling. K53 practical testing assesses vehicle control as part of safe driving. Beginners often focus only on “not stalling,” but good clutch control is about coordination. You need to find the biting point, add appropriate accelerator input and release the clutch progressively. This is especially important when moving off on an incline, reversing or driving in slow traffic. Practise in a safe area until you can feel where the clutch begins to engage. Use small, controlled movements rather than rushing the pedal. Over time, smooth clutch work becomes automatic and makes every manoeuvre calmer.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What is clutch control?", "answer": "It is the ability to operate the clutch pedal smoothly to connect and disconnect engine power without jerking or stalling."}, {"question": "Why is clutch control important for learners?", "answer": "It affects moving off, gear changes, hill starts and low-speed manoeuvres, all of which are part of safe manual driving."}, {"question": "Can poor clutch control damage the car?", "answer": "Yes. Riding or slipping the clutch excessively can increase wear. Learn to use it smoothly and only as needed."}, {"question": "Do automatic cars have a clutch pedal?", "answer": "Conventional automatics do not have a clutch pedal operated by the driver. Clutch operation is handled by the transmission."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'manual-car-biting-point-explained',
  'Did You Know? The Biting Point Is Where Engine and Wheels Begin to Connect',
  'The biting point is the position where the clutch begins to engage and transmit engine power to the wheels. Finding and holding the biting point is essential for smooth moving off, especially on hills.',
  'The biting point is the position where the clutch begins to engage and transmit engine power to the wheels. Finding and holding the biting point is essential for smooth moving off, especially on hills. K53 vehicle-control assessment includes how learners manage manual transmissions during manoeuvres. To find the biting point, press the clutch fully, select first gear, then raise the clutch slowly until you feel the vehicle want to move or hear the engine note change. Hold it there briefly while adding a small amount of accelerator, then release the clutch further as the car moves. Different vehicles have different biting points. Practise in the actual car you will use for training and testing. Do not rush. A controlled biting point reduces stalling, rolling and jerky movement.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What is the biting point in a manual car?", "answer": "It is where the clutch begins to engage and the engine starts to move the vehicle."}, {"question": "How do I find the biting point?", "answer": "Raise the clutch slowly in first gear until you feel the car want to move or hear the engine change, then hold that position briefly."}, {"question": "Why is the biting point important on hills?", "answer": "It helps prevent rolling back by engaging enough drive before releasing the brake."}, {"question": "Does every car have the same biting point?", "answer": "No. The biting point varies by vehicle. Practise in the specific car you will use for lessons and tests."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'manual-gear-changes-matching-speed',
  'Did You Know? Changing Gears Is About Matching Speed, Engine and Road',
  'Gear changes are not only about shifting the lever. They are about matching engine speed, road speed and the demand of the situation.',
  'Gear changes are not only about shifting the lever. They are about matching engine speed, road speed and the demand of the situation. K53 vehicle-control assessment includes how smoothly and appropriately a learner changes gears. Upshift when the engine is working comfortably and you need more speed or efficiency. Downshift when you need more power, such as climbing a hill, overtaking or slowing for a hazard. Avoid “coasting” in neutral or holding a high gear at very low speed, which can strain the engine and reduce control. Smooth gear changes require coordinated clutch, accelerator and steering input. Practise until you can change gears without looking down and without jerking the vehicle. This improves passenger comfort, fuel efficiency and overall control.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "When should I change up a gear?", "answer": "When the engine is working comfortably and you need more speed or efficiency, without straining the engine."}, {"question": "When should I change down a gear?", "answer": "When you need more power, such as climbing, overtaking or slowing for a hazard, or when the engine feels strained in a high gear."}, {"question": "Is coasting in neutral safe?", "answer": "No. Coasting reduces control and is discouraged. Keep the vehicle in gear appropriate to your speed."}, {"question": "Can poor gear selection affect fuel use?", "answer": "Yes. Incorrect gears can increase fuel consumption and engine wear."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'manual-car-stalling-recovery',
  'Did You Know? Stalling Is Common for Beginners and Can Be Managed Safely',
  'Stalling happens when the engine stops because the clutch was released too quickly or engine speed was too low for the load. It is very common for new manual drivers and does not mean you cannot learn.',
  'Stalling happens when the engine stops because the clutch was released too quickly or engine speed was too low for the load. It is very common for new manual drivers and does not mean you cannot learn. K53 assessment focuses on overall safe driving and control, not on a single stall. If you stall, stay calm. Apply the handbrake if needed, return the gear lever to neutral, restart the engine, select first gear and prepare to move off again with proper observation. Check mirrors and blind spots before moving, especially if you stalled in traffic. Frequent stalling usually indicates a need for more clutch-control practice. Work with your instructor to find the biting point, use appropriate accelerator input and release the clutch progressively. With repetition, stalling becomes rare.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Is stalling dangerous?", "answer": "It can be if it happens in an unsafe location or causes panic. Manage it calmly and restart safely."}, {"question": "Will I fail my K53 test if I stall once?", "answer": "Not necessarily. Examiners assess overall safe driving. How you recover matters."}, {"question": "Why do I keep stalling at traffic lights?", "answer": "Often due to releasing the clutch too quickly or not using enough accelerator. Practise biting point and coordination."}, {"question": "How can I reduce stalling?", "answer": "Practise clutch control in a safe area, learn your vehicle’s biting point and use smooth, progressive movements."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'moving-off-manual-car-clutch-observation',
  'Did You Know? Moving Off Smoothly Requires More Than Clutch Skill',
  'Moving off smoothly in a manual car involves clutch control, but also seat and mirror setup, observation, signalling where required and appropriate accelerator input. K53 observation requires checking mirrors and blind spots before moving.',
  'Moving off smoothly in a manual car involves clutch control, but also seat and mirror setup, observation, signalling where required and appropriate accelerator input. K53 observation requires checking mirrors and blind spots before moving. A typical sequence: prepare the vehicle, check mirrors and blind spot, signal if required, find the biting point, add gentle accelerator, release the handbrake and move off smoothly while continuing to observe. Rushing any part can cause stalling, rolling or jerky movement. Practise this sequence until it feels natural. Focus on smoothness rather than speed. A calm, controlled move-off sets a positive tone for the rest of your drive and demonstrates safe habits to an examiner.',
  'NaTIS K53 documentation on observation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "What is the correct way to move off in a manual car?", "answer": "Prepare the vehicle, observe properly, signal where required, find the biting point, add gentle accelerator and move off smoothly."}, {"question": "Why do I jerk when moving off?", "answer": "Often due to releasing the clutch too quickly or using too much or too little accelerator. Practise coordination."}, {"question": "Should I use the handbrake when moving off on a hill?", "answer": "Yes, to prevent rolling. Release it as you engage the biting point and add enough power to move forward."}, {"question": "Do I need to check blind spots before moving off?", "answer": "Yes. Observation includes checking mirrors and blind spots to ensure it is safe to move."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'manual-hill-start-coordination',
  'Did You Know? Hill Starts Test Coordination, Not Courage',
  'Hill starts in a manual car are about coordination between clutch, brake, accelerator and handbrake, not about bravery. K53 practical testing assesses vehicle control, including how learners manage inclines.',
  'Hill starts in a manual car are about coordination between clutch, brake, accelerator and handbrake, not about bravery. K53 practical testing assesses vehicle control, including how learners manage inclines. A common method: stop securely using the foot brake and handbrake, select first gear, find the biting point while adding gentle accelerator, then release the handbrake as the car begins to take up the load. Move off smoothly without rolling back excessively. Different cars respond differently. Some hold well at the biting point; others need more accelerator. Practise on gentle slopes first, then progress as your control improves. Avoid rushing or “jumping” the clutch, which can cause stalling or harsh movement.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What is a hill start in a manual car?", "answer": "It is moving off from a stop on an incline without rolling back excessively or stalling."}, {"question": "Should I use the handbrake for hill starts?", "answer": "Yes. The handbrake helps hold the car while you prepare to move off."}, {"question": "How can I prevent rolling back?", "answer": "Find the biting point and add enough power before releasing the handbrake, then move off smoothly."}, {"question": "Do automatic cars need hill starts?", "answer": "Automatics behave differently, but you still need to control braking and acceleration on hills. Confirm the correct technique for your vehicle."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'manual-clutch-wear-riding-slipping',
  'Did You Know? Clutch Wear Increases With Riding and Slipping',
  'The clutch is a wear item. Excessive slipping or “riding” the clutch—keeping it partially engaged longer than necessary—increases wear and can lead to earlier replacement.',
  'The clutch is a wear item. Excessive slipping or “riding” the clutch—keeping it partially engaged longer than necessary—increases wear and can lead to earlier replacement. K53 vehicle-control assessment encourages smooth, appropriate clutch use rather than unnecessary slipping. Common causes of extra wear include resting your foot on the clutch pedal, holding the biting point for long periods without moving, and aggressive starts. In normal driving, fully release the clutch once you are moving and avoid using the clutch to hold the car on a hill for extended periods. Good clutch habits improve vehicle longevity and fuel efficiency. Practise smooth engagement, use the handbrake on inclines and avoid “revving and slipping” to launch the car. Your instructor can help you develop a gentle, efficient technique.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What is clutch riding?", "answer": "It is keeping the clutch partially engaged longer than needed, which increases wear."}, {"question": "How can I reduce clutch wear?", "answer": "Fully release the clutch when moving, avoid resting your foot on the pedal and use the handbrake on hills."}, {"question": "Does clutch wear affect fuel use?", "answer": "Yes. Slipping the clutch excessively can increase fuel consumption and reduce efficiency."}, {"question": "Can bad clutch technique damage the car?", "answer": "Over time, excessive slipping and harsh engagement can shorten clutch life."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'engine-braking-manual-downhills',
  'Did You Know? Engine Braking Helps Control Speed on Downhills',
  'Engine braking uses the engine’s resistance to help slow the vehicle when you lift off the accelerator in gear.',
  'Engine braking uses the engine’s resistance to help slow the vehicle when you lift off the accelerator in gear. This is particularly useful on downhills, where relying only on the foot brake can cause overheating and reduced braking effectiveness. K53 vehicle-control assessment includes appropriate speed and gear management. To use engine braking, select a lower gear before a long descent so the engine helps limit speed. This reduces the need for constant heavy braking. Combine engine braking with gentle footbrake use as needed. Engine braking does not replace proper braking, but it complements it. Practise downshifting smoothly before descents, not during them, to maintain control. Your instructor can show you how to match gear choice to slope and traffic conditions.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What is engine braking?", "answer": "It is using the engine’s resistance in gear to help slow the vehicle when you lift off the accelerator."}, {"question": "When should I use engine braking?", "answer": "On downhills and when approaching hazards where gradual slowing is appropriate."}, {"question": "Can engine braking replace foot brakes?", "answer": "No. Use engine braking to assist, but rely on foot brakes for full stopping."}, {"question": "Does engine braking work in automatic cars?", "answer": "Many automatics allow lower gear selection or “L/2/1” modes that provide similar enginebraking effect. Confirm for your vehicle."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'manual-gear-selection-control-fuel',
  'Did You Know? Selecting the Correct Gear Affects Control and Fuel Use',
  'Gear selection influences vehicle control, engine load and fuel consumption. Driving in too high a gear at low speed can cause strain and poor response, while driving in too low a gear at high speed increases engine revs and fuel use.',
  'Gear selection influences vehicle control, engine load and fuel consumption. Driving in too high a gear at low speed can cause strain and poor response, while driving in too low a gear at high speed increases engine revs and fuel use. K53 assessment includes appropriate vehicle control. Select gears to match your speed and the road situation. Use lower gears for climbing, overtaking or navigating hazards. Use higher gears for steady cruising where the engine is not strained. Avoid coasting in neutral and avoid “fighting” the engine in an incorrect gear. Good gear selection makes driving smoother, reduces wear and improves efficiency. Practise recognising when the engine feels comfortable versus strained, and adjust gears accordingly.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What happens if I drive in too high a gear?", "answer": "The engine can strain, response becomes poor and you may risk stalling when slowing."}, {"question": "What happens if I drive in too low a gear?", "answer": "Engine revs become unnecessarily high, increasing noise, wear and fuel consumption."}, {"question": "How do I know the correct gear?", "answer": "Choose a gear where the engine feels comfortable for your speed and the road demand."}, {"question": "Does gear selection affect fuel use?", "answer": "Yes. Appropriate gears improve fuel efficiency and reduce engine strain."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'reversing-manual-car-low-speed',
  'Did You Know? Reversing in a Manual Car Needs Very Low Speed Control',
  'Reversing in a manual car requires very low, controlled speed. K53 parking manoeuvres include reversing tasks that test observation and vehicle control.',
  'Reversing in a manual car requires very low, controlled speed. K53 parking manoeuvres include reversing tasks that test observation and vehicle control. Too much clutch slip or accelerator input can cause the vehicle to move too quickly, making corrections difficult. Use the clutch to control speed, with minimal accelerator. Keep your foot ready to cover the brake. Observe continuously: check around the vehicle before moving, use mirrors and look in the direction of travel. If you lose your reference point or feel uncertain, stop safely, reassess and correct. Practise reversing in a safe area until you can move slowly and accurately without stalling or jerking. This skill supports both K53 yard tests and everyday parking.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "How do I control speed when reversing in a manual car?", "answer": "Use the clutch to control very low speed, with minimal accelerator and your foot ready to brake."}, {"question": "Should I look behind when reversing?", "answer": "Yes. Use mirrors and look in the direction of travel while also checking around the vehicle."}, {"question": "What if I stall while reversing?", "answer": "Stay calm, restart safely, re-observe and continue slowly."}, {"question": "Is reversing part of the K53 test?", "answer": "Yes. K53 includes parking and reversing manoeuvres in the yard component."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'low-speed-control-manual-k53',
  'Did You Know? Low-Speed Control Is a Skill, Not a Natural Talent',
  'Low-speed control—moving slowly and accurately in tight spaces—is a learned skill. It is essential for parking, reversing, traffic queues and manoeuvring in confined areas.',
  'Low-speed control—moving slowly and accurately in tight spaces—is a learned skill. It is essential for parking, reversing, traffic queues and manoeuvring in confined areas. K53 yard tests assess controlled low-speed manoeuvres. Develop this skill by practising slow, precise movements in a safe area. Focus on smooth clutch and brake modulation, gentle steering and continuous observation. Avoid rushing. Accuracy at low speed builds confidence for more complex situations. Many learners improve faster when they separate skills: first practise straight-line slow control, then add steering, then combine with observation and signalling. Your instructor can structure exercises that build this skill progressively.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Why is low-speed control important?", "answer": "It is essential for parking, reversing, tight manoeuvres and safe driving in congested areas."}, {"question": "How can I improve low-speed control?", "answer": "Practise slow, precise movements in a safe area, focusing on smooth pedal and steering control."}, {"question": "Is low-speed control tested in K53?", "answer": "Yes. K53 yard manoeuvres assess controlled low-speed vehicle handling."}, {"question": "Can automatic drivers improve low-speed control too?", "answer": "Yes. Automatic drivers practise gentle brake and accelerator modulation for precise slow movements."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'manual-beginner-mistakes-pedal-rushing',
  'Did You Know? Common Beginner Mistakes Come From Rushing Pedal Work',
  'Many beginner manual-car mistakes—stalling, jerking, rolling—come from rushing pedal inputs. K53 assessment values smooth, controlled vehicle handling as part of safe driving.',
  'Many beginner manual-car mistakes—stalling, jerking, rolling—come from rushing pedal inputs. K53 assessment values smooth, controlled vehicle handling as part of safe driving. Typical rushing errors include releasing the clutch too quickly, pressing the brake abruptly, or adding too much accelerator at once. These make the vehicle lurch and can unsettle the driver. Slow, deliberate pedal movements produce smoother results. Practise each pedal separately at first: clutch engagement, gentle braking, progressive acceleration. Then combine them in moving off, gear changes and stopping. With repetition, smooth coordination becomes natural.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Why do I jerk when using the clutch?", "answer": "Often because the clutch is released too quickly. Practise slower, progressive engagement."}, {"question": "How can I stop stalling at every start?", "answer": "Find the biting point, use gentle accelerator and release the clutch more slowly."}, {"question": "Is harsh braking always wrong?", "answer": "Harsh braking is inappropriate in normal driving. Emergency situations may require firm braking."}, {"question": "Can rushing pedals affect passengers?", "answer": "Yes. Sudden inputs cause discomfort and can reduce confidence in your driving."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'manual-practice-areas-skill-level',
  'Did You Know? Practice Areas Should Match Your Current Skill Level',
  'Choosing appropriate practice areas helps learners build skills safely. Beginners benefit from quiet, low-risk environments for basic control, then gradually progress to more complex roads.',
  'Choosing appropriate practice areas helps learners build skills safely. Beginners benefit from quiet, low-risk environments for basic control, then gradually progress to more complex roads. K53 preparation includes both yard manoeuvres and road driving. Start with empty parking areas or quiet streets for moving off, stopping, steering and gear changes. As control improves, add intersections, busier roads, different times of day and varied conditions. Avoid jumping too quickly into heavy traffic before basic control is reliable. In Ekurhuleni, suitable practice locations might include quiet residential streets in Daveyton, Etwatwa or Crystal Park for early skills, then busier routes near Benoni or Springs as confidence grows. Always practise under proper supervision and within legal requirements.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Where should a beginner practise manual driving?", "answer": "In quiet, low-risk areas such as empty parking lots or residential streets with minimal traffic."}, {"question": "When can I move to busier roads?", "answer": "When basic control, observation and decision-making are consistent and calm."}, {"question": "Can I practise in my neighbourhood?", "answer": "Yes, if it is safe, legal and properly supervised. Choose times with lighter traffic for early practice."}, {"question": "Should I only practise on one route?", "answer": "No. Gradually introduce varied roads and conditions to build adaptable skills."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'smooth-gear-changes-passenger-comfort',
  'Did You Know? Smooth Gear Changes Reduce Passenger Discomfort',
  'Smooth gear changes improve comfort for everyone in the vehicle. Jerky shifts can cause passengers to lurch forward or sideways, reducing confidence in the driver.',
  'Smooth gear changes improve comfort for everyone in the vehicle. Jerky shifts can cause passengers to lurch forward or sideways, reducing confidence in the driver. K53 vehicle-control assessment includes how smoothly a learner operates the vehicle. Achieve smooth changes by coordinating clutch, accelerator and gear lever. Depress the clutch fully, change gear cleanly, release the clutch progressively and match accelerator input to the new gear. Avoid “snatching” the gear lever or releasing the clutch abruptly. Passenger comfort is not only about politeness. Smooth driving also reduces wear on the drivetrain and can improve fuel efficiency. Practise until gear changes feel fluid rather than mechanical.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Why do passengers feel jerks during gear changes?", "answer": "Often due to abrupt clutch release or mismatched accelerator input."}, {"question": "How can I make gear changes smoother?", "answer": "Depress the clutch fully, change gear cleanly and release the clutch progressively with appropriate accelerator."}, {"question": "Do smooth gear changes affect fuel use?", "answer": "Yes. Smooth, appropriate gear changes can improve fuel efficiency and reduce wear."}, {"question": "Are smooth gear changes part of K53 assessment?", "answer": "Yes. Vehicle control, including smooth operation, is assessed in the practical test."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'manual-driving-vehicle-awareness',
  'Did You Know? Manual Training Can Improve Overall Vehicle Awareness',
  'Learning to drive manually can improve overall vehicle awareness because it requires active management of clutch, gears, engine speed and road conditions.',
  'Learning to drive manually can improve overall vehicle awareness because it requires active management of clutch, gears, engine speed and road conditions. K53 vehicle-control assessment rewards drivers who demonstrate coordinated, attentive operation. Manual drivers must listen to the engine, feel the vehicle’s response and anticipate gear needs. This heightened awareness often carries over into better speed judgement, earlier hazard detection and smoother control, even in automatic vehicles later. This does not mean everyone must drive manual. It does mean that manual training, when done properly, can build a deeper understanding of how a car works. If you plan to drive manual regularly, invest time in quality instruction and structured practice.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Does learning manual improve driving awareness?", "answer": "It can, because it requires active management of clutch, gears and engine response."}, {"question": "Must I learn manual to be a good driver?", "answer": "No. Good drivers exist in both manual and automatic vehicles."}, {"question": "Will manual skills help if I switch to automatic later?", "answer": "Yes. Vehicle awareness, observation and control habits transfer between transmission types."}, {"question": "Is manual training harder than automatic?", "answer": "It involves more coordination initially, but structured lessons make it manageable for most learners."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;
