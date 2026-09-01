-- ============================================================
-- LCD KHAYA "DID YOU KNOW?" FACTS SEED — batch 5 (25 facts)
-- LCD-DYK-076 to LCD-DYK-100 — category: Driving
-- Fills the gap left by batches 2/3 (026-075, 101-150)
-- Run in Supabase SQL Editor, same as supabase-content-seed.sql
-- ============================================================

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'automatic-driving-control-braking-acceleration',
  'Did You Know? Automatic Cars Still Need Controlled Pedal Inputs',
  'Automatic vehicles remove the need for a clutch pedal and manual gear changes, but they do not remove the need for smooth vehicle control. A driver still needs to manage acceleration, braking, steering, observation and speed for conditions.',
  'Automatic vehicles remove the need for a clutch pedal and manual gear changes, but they do not remove the need for smooth vehicle control. A driver still needs to manage acceleration, braking, steering, observation and speed for conditions. The K53 practical driving test assesses safe driving and vehicle control, whether a candidate is using a manual or automatic vehicle. New automatic drivers sometimes press the accelerator too firmly because the vehicle feels easier to operate. This can cause sudden movement, especially in parking areas, traffic queues or when moving off from a stop. Use gentle, progressive pressure on the accelerator and brake. Automatic driving should feel calm and deliberate. Keep your right foot ready to move between the accelerator and brake, look well ahead and reduce speed early rather than braking sharply at the last moment. The lack of a clutch can free up attention, but that attention should go toward observation and safe decision-making.',
  'City of Cape Town: K53 practical driving-test overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Is driving an automatic easier than driving a manual?", "answer": "Many learners find the pedal and gear operation simpler, but safe observation, speed control and judgement are still essential."}, {"question": "Do automatic cars have a clutch pedal?", "answer": "No. Conventional automatic cars do not have a clutch pedal operated by the driver."}, {"question": "Why does an automatic car jerk when moving off?", "answer": "This can happen when the accelerator is pressed too firmly or braking is released abruptly. Use gradual pedal pressure."}, {"question": "Is K53 different in an automatic car?", "answer": "The transmission operation differs, but the practical test still assesses safe driving, observation, parking and road-rule compliance."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'automatic-gear-positions-p-r-n-d',
  'Did You Know? P, R, N and D Are Not Interchangeable',
  'Automatic gear selectors use letters to show the transmission mode. The most common positions are P for Park, R for Reverse, N for Neutral and D for Drive.',
  'Automatic gear selectors use letters to show the transmission mode. The most common positions are P for Park, R for Reverse, N for Neutral and D for Drive. Each position serves a specific purpose, so selecting the wrong one can create an unsafe situation, especially in a parking area or while waiting in traffic. Use P only when the vehicle is fully parked and secured. Use R only after the vehicle has stopped and you have checked that the area behind is clear. N disconnects engine drive from the wheels, so it is not a substitute for Park when leaving the vehicle. D is the normal forwarddriving position. Before selecting Reverse or Drive, keep your foot firmly on the brake and observe the relevant direction of travel. Automatic cars can move as soon as the brake is released because of creep, so selecting a gear should never be rushed. Safe operation remains part of the broader K53 focus on controlled driving and observation.',
  'City of Cape Town: K53 practical driving-test overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What does P mean in an automatic car?", "answer": "P means Park. Use it when the vehicle is fully stopped and secured for parking."}, {"question": "Can I select Reverse while the car is still moving forward?", "answer": "No. Bring the vehicle to a complete stop before selecting Reverse."}, {"question": "Is Neutral the same as Park?", "answer": "No. Neutral disengages drive but does not secure the vehicle like Park. Apply the parking brake when parking."}, {"question": "Should I keep my foot on the brake when selecting Drive?", "answer": "Yes. Keep the brake applied when selecting Drive or Reverse, then move only after observing and confirming it is safe."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'automatic-car-creep-explained',
  'Did You Know? Automatic Creep Can Surprise New Drivers',
  'Many automatic cars begin moving slowly forward in Drive or backward in Reverse when the brake pedal is released.',
  'Many automatic cars begin moving slowly forward in Drive or backward in Reverse when the brake pedal is released. This is commonly called “creep.” It can be useful for low-speed parking and traffic queues, but it can surprise new drivers who expect the car to remain still without the accelerator. Always keep your foot on the brake when selecting Drive or Reverse. Before releasing the brake, check mirrors, blind spots and the area in the direction you intend to travel. Move slowly enough to stop immediately if a person, vehicle or obstacle enters your path. Creep is not a reason to become casual about parking. In a confined space, use the brake gently to control speed and avoid pressing the accelerator unless necessary. This slow, deliberate approach supports the vehicle-control and observation principles assessed in practical K53 driving.',
  'City of Cape Town: K53 practical driving-test overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "What is automatic creep?", "answer": "It is the slow movement many automatic cars make when Drive or Reverse is selected and the brake is released."}, {"question": "Does every automatic car creep?", "answer": "Many do, but behaviour varies between vehicles. Learn how the specific vehicle responds before driving in tight spaces."}, {"question": "Should I use the accelerator while parking an automatic?", "answer": "Usually only very gently if needed. In many situations, brake control and creep provide enough low-speed movement."}, {"question": "Why is creep risky for beginners?", "answer": "A new driver may release the brake without checking surroundings or may be surprised by movement in a tight space."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'automatic-driving-right-foot-brake-accelerator',
  'Did You Know? Your Right Foot Should Operate Both Pedals in an Automatic',
  'In a conventional automatic vehicle, use your right foot for both the accelerator and brake pedal. Keep your left foot resting on the footrest rather than using it for braking.',
  'In a conventional automatic vehicle, use your right foot for both the accelerator and brake pedal. Keep your left foot resting on the footrest rather than using it for braking. This helps prevent sudden, overly hard braking caused by the left foot’s stronger clutch-driving habit. Using one foot for both pedals also reduces the risk of pressing the accelerator and brake together. Move your right foot deliberately between pedals and keep the heel positioned so you can pivot smoothly. For learners transitioning from manual vehicles, this adjustment can feel unusual at first because the left foot is used to operating the clutch. Practise in a safe, low-pressure environment until braking becomes smooth and natural. The goal is stable, predictable control —an essential part of safe driving and K53 readiness.',
  'City of Cape Town: K53 practical driving-test overview.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Which foot should brake in an automatic car?", "answer": "Use your right foot for both braking and accelerating."}, {"question": "Where should my left foot go in an automatic?", "answer": "Rest it on the designated footrest, away from the brake pedal."}, {"question": "Why is left-foot braking risky for beginners?", "answer": "Learners used to a clutch may press too hard with the left foot, causing abrupt braking."}, {"question": "Does this rule apply to all automatic cars?", "answer": "It applies to conventional automatic driving. Follow the vehicle manufacturer’s controls and your instructor’s guidance."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'automatic-driving-observation-mirrors-blind-spots',
  'Did You Know? Automatic Driving Does Not Remove the Need for Observation',
  'Automatic cars simplify gear operation, but they do not simplify the road around you. You still need to scan ahead, check mirrors, look over your shoulder for blind spots, signal where required and adjust speed for traffic and weather.',
  'Automatic cars simplify gear operation, but they do not simplify the road around you. You still need to scan ahead, check mirrors, look over your shoulder for blind spots, signal where required and adjust speed for traffic and weather. K53 observation includes the use of mirrors and blind-spot checks to determine whether it is safe around the vehicle. Because automatic drivers do not have to operate a clutch or shift gears manually, they can use more attention for hazard awareness. This can be particularly useful in busy urban driving, where pedestrians, cyclists, minibus taxis and motorcycles may appear unexpectedly. Avoid the mistake of treating an automatic as “easy enough to drive without concentration.” Every vehicle requires active decision-making. Before moving off, changing lanes, reversing or turning, carry out the appropriate observation sequence and move only when safe.',
  'NaTIS K53 documentation on mirrors and blind-spot checks.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "Do automatic drivers need blind-spot checks?", "answer": "Yes. Automatic transmission does not change the need for proper observation before manoeuvres."}, {"question": "Is automatic driving safer than manual driving?", "answer": "Safety depends mainly on the driver’s observation, decisions, speed and vehicle control—not transmission alone."}, {"question": "Do I still need to signal in an automatic?", "answer": "Yes. Indicators communicate your intentions regardless of the vehicle’s transmission."}, {"question": "Why do automatic learners still need K53 lessons?", "answer": "They still need to demonstrate observation, road-rule knowledge, parking and safe vehicle control."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'automatic-car-parking-park-brake-check',
  'Did You Know? Parking an Automatic Requires a Secure Final Check',
  'Parking an automatic vehicle is not finished when the car stops moving.',
  'Parking an automatic vehicle is not finished when the car stops moving. Once you are safely in the parking space or at the kerb, keep your foot on the brake, select Park, apply the parking brake and switch off only when the vehicle is secure. The exact order may differ slightly by vehicle, so follow the manufacturer’s handbook and the instructor’s method. Park is designed to lock the transmission, but the parking brake is an important additional safeguard, especially on slopes. Before opening a door, check mirrors and blind spots for passing cyclists, pedestrians or traffic. This is particularly important on busy streets and in parking areas. Safe parking combines vehicle security with awareness of others. Do not leave the vehicle in Neutral or rely only on the foot brake. Make parking a complete routine: stop safely, secure the vehicle, observe before opening the door and leave only when it is safe to do so.',
  'City of Cape Town: K53 practical test assesses safe parking and driving.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Should I apply the parking brake in an automatic car?", "answer": "Yes. Use the parking brake as an additional safeguard after selecting Park."}, {"question": "Is Park the same as applying the handbrake?", "answer": "No. Park locks the transmission; the parking brake helps hold the vehicle securely in place."}, {"question": "Why should I check before opening my door?", "answer": "A cyclist, pedestrian or vehicle may be passing close to your door."}, {"question": "Can I leave an automatic car in Neutral when parked?", "answer": "No. Use Park and apply the parking brake when leaving the vehicle."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'automatic-hill-start-safely',
  'Did You Know? Hill Starts in an Automatic Still Require Control',
  'Automatic cars can make hill starts easier because many vehicles creep forward in Drive and some have hill-hold assistance. However, the driver still needs to control braking, acceleration, observation and direction.',
  'Automatic cars can make hill starts easier because many vehicles creep forward in Drive and some have hill-hold assistance. However, the driver still needs to control braking, acceleration, observation and direction. Do not assume the vehicle will always hold itself on a slope. Keep your foot on the brake while stopped. Observe mirrors and the relevant blind spot, indicate if required, select Drive and move off only when it is safe. Release the brake smoothly and apply gentle accelerator input as needed. If your vehicle has hill-hold assistance, learn how it works before relying on it. Hill starts remain an important test of calm control. Avoid sudden acceleration, especially in traffic or on wet roads. Build confidence on gentle slopes before practising in steeper or busier locations. K53 practical testing remains focused on safe control and road-rule compliance.',
  'City of Cape Town: K53 practical driving test.',
  'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
  'Driving',
  '[{"question": "Can an automatic car roll backwards on a hill?", "answer": "Some can, depending on the vehicle, slope and use of hill-hold features. Keep the brake applied until ready to move."}, {"question": "What is hill-hold assist?", "answer": "It is a feature that may hold brake pressure briefly after you release the brake on an incline. Check your vehicle handbook for details."}, {"question": "Do I need to use the parking brake for an automatic hill start?", "answer": "It can be useful on steeper slopes. Learn the method recommended for your specific vehicle and instructor."}, {"question": "Is an automatic hill start easier than a manual hill start?", "answer": "Many learners find it simpler because there is no clutch pedal, but safe observation and controlled acceleration are still required."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'reversing-automatic-car-brake-control',
  'Did You Know? Reversing an Automatic Needs Gentle Brake Control',
  'Automatic cars can reverse slowly through creep once Reverse is selected and the brake pedal is released. This means careful brake control is often more important than accelerator use.',
  'Automatic cars can reverse slowly through creep once Reverse is selected and the brake pedal is released. This means careful brake control is often more important than accelerator use. In a confined area, release the brake gradually and keep your right foot ready to press it again immediately. Before reversing, check behind the vehicle and around both sides. Use mirrors to judge position, but also look in the direction of travel and remain alert for pedestrians, children and obstacles. K53 observation requires mirror and blind-spot checks to establish whether it is safe around the vehicle. If you feel rushed, uncertain or misaligned, stop safely and reassess. Reversing is not a race. The safest automatic reversing technique is slow, visible, controlled and continuously observed.',
  'NaTIS K53 documentation on observation and blind spots.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "Should I accelerate while reversing an automatic?", "answer": "Often only minimal accelerator is needed. In tight spaces, creep and gentle brake control may be enough."}, {"question": "How do I control reversing speed in an automatic?", "answer": "Release the brake slowly and use gentle brake pressure to regulate movement."}, {"question": "Should I use mirrors while reversing?", "answer": "Yes. Use mirrors with direct observation in the direction of travel."}, {"question": "What should I do if I cannot see clearly behind me?", "answer": "Stop. Reassess the area and do not continue until you can confirm the reversing path is clear."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'automatic-licence-restriction-south-africa',
  'Did You Know? An Automatic Licence Restriction Can Affect What You May Drive',
  'The vehicle used for your practical driving test matters. When a person is tested in an automatic vehicle, their driving licence may carry a restriction to automatic transmission vehicles.',
  'The vehicle used for your practical driving test matters. When a person is tested in an automatic vehicle, their driving licence may carry a restriction to automatic transmission vehicles. Before booking a test, confirm the current licence-code and transmission requirements with your Driving Licence Testing Centre. This is important if you expect to drive both automatic and manual vehicles in future. A person who plans to drive a family manual car, use a manual work vehicle or share vehicles with different transmission types should understand the implications before choosing a test vehicle. Automatic training remains a good fit for many learners, especially those who will drive automatics only. The key is making an informed decision. Official licensing rules and categories are administered through the Department of Transport and DLTC system, so use these sources rather than informal social-media advice.',
  'Department of Transport: learner’s licence and vehicle category information.',
  'https://www.transport.gov.za/?page_id=1176',
  'Driving',
  '[{"question": "Can I drive a manual car if I passed in an automatic?", "answer": "Your licence may be restricted to automatic vehicles. Confirm the restriction and current requirements with a DLTC."}, {"question": "Should I learn manual or automatic?", "answer": "Choose based on the vehicles you expect to drive, your needs and your learning goals."}, {"question": "Can I change from an automatic restriction later?", "answer": "You may need to pass the relevant practical test in a manual vehicle. Confirm the current process with a DLTC."}, {"question": "Where can I confirm licence restrictions?", "answer": "Contact a Driving Licence Testing Centre or use official Department of Transport and NaTIS information."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'automatic-driving-lessons-road-awareness',
  'Did You Know? Automatic Lessons Can Help Learners Focus on Road Awareness',
  'Automatic driving lessons can help some learners focus earlier on road awareness because they do not need to coordinate a clutch pedal and manual gear changes.',
  'Automatic driving lessons can help some learners focus earlier on road awareness because they do not need to coordinate a clutch pedal and manual gear changes. That extra attention can be directed toward observation, traffic signs, safe gaps, lane position and speed control. K53 observation includes mirrors and blind-spot checks to determine whether conditions are safe around the vehicle. This does not make automatic driving “effort-free.” Learners still need to control pedals smoothly, understand road rules and respond safely to changing traffic. Automatic lessons are often a practical option for people who plan to drive automatic vehicles or who want to build confidence in traffic before considering manual training. A good instructor will still teach the same safety foundation: correct seating, mirror setup, observation, signalling, hazard awareness and controlled parking. The transmission changes; the responsibility to drive safely does not.',
  'NaTIS K53 documentation on observation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "Are automatic driving lessons suitable for beginners?", "answer": "Yes. They can be suitable for beginners, particularly those who expect to drive automatic vehicles."}, {"question": "Will automatic lessons teach me road rules?", "answer": "Yes. Safe driving lessons should cover road rules, observation, signs, positioning and hazard awareness."}, {"question": "Are automatic lessons useful for nervous learners?", "answer": "They can help some learners focus on traffic awareness without managing a clutch and manual gear changes."}, {"question": "Can I later learn manual after automatic lessons?", "answer": "Yes. You can take manual lessons later, although you will need to develop clutch and gearcontrol skills."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'motorcycle-licence-category-south-africa',
  'Did You Know? Motorcycles Need Their Own Licence Category',
  'Motorcycle licensing is separate from ordinary car licensing in South Africa. A person who wants to ride a motorcycle needs the appropriate learner’s licence and driving-licence category for the motorcycle they intend to operate.',
  'Motorcycle licensing is separate from ordinary car licensing in South Africa. A person who wants to ride a motorcycle needs the appropriate learner’s licence and driving-licence category for the motorcycle they intend to operate. Official licence information distinguishes motorcycle categories from light motor vehicle categories. This matters because riding a motorcycle requires different skills from driving a car. Riders need to manage balance, braking, cornering, road position and protective equipment while remaining highly visible to other road users. A car licence should not be treated as proof of motorcycle competence. Before booking a learner’s test or training, confirm which motorcycle category applies to the bike you plan to ride. Start with structured instruction, suitable protective equipment and gradual practice in low-risk environments. Motorcycle riding can be rewarding, but the learning process should be deliberate and safety-focused.',
  'Department of Transport: learner’s licence categories.',
  'https://www.transport.gov.za/?page_id=1176',
  'Driving',
  '[{"question": "Can I ride a motorcycle with only a car licence?", "answer": "You need the appropriate motorcycle learner’s licence and driving-licence category to ride legally."}, {"question": "Is a motorcycle learner’s licence different from a car learner’s licence?", "answer": "Yes. Learner’s licences are issued for different vehicle categories."}, {"question": "Why is motorcycle training important?", "answer": "Motorcycles require specialised skills such as balance, cornering, braking and road positioning."}, {"question": "Where can I confirm the correct motorcycle licence category?", "answer": "Confirm with a DLTC and consult official Department of Transport or NaTIS licensing information."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'code-a1-vs-code-a-motorcycle-licence',
  'Did You Know? Code A1 and Code A Apply to Different Motorcycle Categories',
  'South African motorcycle licensing distinguishes between Code A1 and Code A. Governmentlinked transport information describes Code A1 as applying to motorcycles up to 125cc, while Code A applies to motorcycles more broadly.',
  'South African motorcycle licensing distinguishes between Code A1 and Code A. Governmentlinked transport information describes Code A1 as applying to motorcycles up to 125cc, while Code A applies to motorcycles more broadly. It also lists a minimum age of 16 for Code A1 and 18 for Code A. These distinctions are important for young riders and for anyone choosing a first motorcycle. The type and engine capacity of the motorcycle can affect which learner’s licence and eventual driving-licence category is appropriate. Do not assume a licence for one motorcycle automatically covers every motorcycle. Licensing requirements can be updated, and test-centre procedures can differ administratively. Before applying, verify the current category, age and test requirements with a DLTC. Use official sources first, then choose training that matches the motorcycle category you actually intend to ride.',
  'KwaZulu-Natal Transport: driving-licence category and age information.',
  'http://www.kzntransport.gov.za/rd_safety_ed/youth/rd_licn1.htm',
  'Driving',
  '[{"question": "What is a Code A1 motorcycle licence?", "answer": "Code A1 applies to motorcycles with an engine capacity of 125cc or less, according to government-linked transport guidance."}, {"question": "What is a Code A motorcycle licence?", "answer": "Code A applies to motorcycles beyond the Code A1 category. Confirm the current scope with your DLTC."}, {"question": "How old must I be for Code A1?", "answer": "Government-linked transport information lists 16 years for Code A1. Confirm current requirements with your DLTC."}, {"question": "How old must I be for Code A?", "answer": "Government-linked transport information lists 18 years for Code A. Confirm current requirements before applying."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'motorcycle-visibility-look-twice',
  'Did You Know? Motorcycle Visibility Is a Shared Responsibility',
  'Motorcycles are smaller and narrower than cars, so they can be harder for other drivers to see. They can disappear into blind spots, become hidden behind vehicle pillars or appear farther away than they really are.',
  'Motorcycles are smaller and narrower than cars, so they can be harder for other drivers to see. They can disappear into blind spots, become hidden behind vehicle pillars or appear farther away than they really are. K53 motorcycle material includes mirror and blind-spot observation, reflecting the importance of riders and drivers actively checking around them. Motorcyclists can improve visibility through suitable road position, effective lighting and predictable signalling. Car drivers also have an important role: check mirrors and blind spots carefully before changing lanes or turning, especially at intersections. Visibility is not about blaming one road user. It is about recognising that motorcycles require extra attention from everyone. Assume a motorcycle could be nearby, look twice before moving sideways and give riders adequate room to manoeuvre around road hazards.',
  'NaTIS K53 motorcycle practical-driving-test documentation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=56:k53-motor-cycles-part2',
  'Driving',
  '[{"question": "Why are motorcycles difficult to see?", "answer": "Their smaller size and narrow shape make them easier to miss in mirrors, blind spots and busy traffic."}, {"question": "How can car drivers avoid hitting motorcycles?", "answer": "Check mirrors and blind spots carefully, especially before changing lanes or turning."}, {"question": "How can riders make themselves more visible?", "answer": "Use appropriate lighting, wear visible protective gear, signal clearly and choose a road position where drivers can see them."}, {"question": "Are motorcycles often hidden in blind spots?", "answer": "Yes. Their small profile means they can be obscured beside larger vehicles."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'motorcycle-protective-gear-safety',
  'Did You Know? Protective Gear Helps Reduce Injury Risk',
  'Motorcycle riders have far less physical protection than occupants of cars.',
  'Motorcycle riders have far less physical protection than occupants of cars. Protective gear cannot remove all risk, but a properly fitted helmet, gloves, jacket, long trousers and suitable footwear can help reduce injury severity in a fall or collision. A helmet should fit securely and meet recognised safety standards. Gloves protect hands, while closed footwear that supports the ankle can help protect feet and improve control of the motorcycle’s pedals. Bright or reflective elements can also improve visibility, particularly in low light or wet weather. Protective gear works best with safe riding practices: correct licensing, training, speed appropriate to conditions, alert observation and a well-maintained motorcycle. Treat gear as essential riding equipment, not an optional extra for long trips.',
  'NaTIS K53 motorcycle practical-driving-test documentation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=56:k53-motor-cycles-part2',
  'Driving',
  '[{"question": "Is a helmet enough for motorcycle protection?", "answer": "A helmet is important, but gloves, jacket, trousers and suitable footwear also help reduce injury risk."}, {"question": "Why should motorcycle boots cover the ankle?", "answer": "They can provide additional protection and support while allowing proper control of the motorcycle."}, {"question": "Does bright gear improve safety?", "answer": "Bright or reflective gear can make a rider more noticeable, especially in poor light."}, {"question": "Can protective gear replace safe riding?", "answer": "No. Protective gear is one layer of protection; training, observation and safe speed remain essential."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'motorcycle-braking-balance-planning',
  'Did You Know? Motorcycle Braking Requires Balance and Planning',
  'Motorcycle braking requires smooth, balanced control because a rider must manage both the motorcycle’s speed and stability.',
  'Motorcycle braking requires smooth, balanced control because a rider must manage both the motorcycle’s speed and stability. Sudden, harsh inputs can reduce traction or unsettle the bike, particularly on wet roads, loose gravel or uneven surfaces. Good braking begins before you touch the controls: look ahead, identify hazards early, reduce speed progressively and leave enough following distance. Apply brakes smoothly and progressively rather than waiting until the last moment. Riders should learn the braking method appropriate to their motorcycle, including how its front and rear brakes, tyres and any ABS system respond. Practice should take place in a safe area with qualified instruction. The goal is not simply to stop quickly—it is to stop under control while maintaining a stable, predictable path. This is especially important in Gauteng traffic, where sudden stops, potholes and changing road surfaces can occur.',
  'NaTIS K53 motorcycle practical-driving-test documentation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=56:k53-motor-cycles-part2',
  'Driving',
  '[{"question": "Why is motorcycle braking different from car braking?", "answer": "A motorcycle rider must maintain balance and manage traction on two wheels, making smooth technique essential."}, {"question": "Should a rider brake suddenly on wet roads?", "answer": "Avoid sudden inputs where possible. Reduce speed early and use smooth, progressive braking."}, {"question": "Does ABS help motorcycles brake safely?", "answer": "ABS can help prevent wheel lock in some situations, but riders still need safe speed, good observation and correct technique."}, {"question": "How can beginners practise braking?", "answer": "Practise progressively in a safe, controlled environment with a qualified motorcycle instructor."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'motorcycle-cornering-look-ahead',
  'Did You Know? Cornering Starts With Looking Where You Want to Go',
  'Safe motorcycle cornering begins with observation and planning. Riders should look through the corner toward the path they intend to follow, rather than staring at the kerb, pothole or obstacle they want to avoid.',
  'Safe motorcycle cornering begins with observation and planning. Riders should look through the corner toward the path they intend to follow, rather than staring at the kerb, pothole or obstacle they want to avoid. Looking ahead supports smoother steering, more stable body position and better hazard awareness. Approach corners at a speed that allows you to maintain control. Slow down before entering rather than braking sharply while leaned over. Choose a road position that gives you the best available view while remaining in your lane and leaving a safety margin from oncoming traffic, loose gravel and road-edge hazards. Cornering improves with practice, but riders should not treat public roads as racetracks. Start with gentle bends, use suitable protective gear and develop skill through structured instruction. Conditions such as rain, glare, potholes and traffic require a slower, more cautious approach.',
  'NaTIS K53 motorcycle practical-driving-test documentation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=56:k53-motor-cycles-part2',
  'Driving',
  '[{"question": "Where should I look when cornering on a motorcycle?", "answer": "Look through the corner toward the path you want to take, while continuing to scan for hazards."}, {"question": "Should I brake hard while leaning into a corner?", "answer": "Avoid sudden braking while leaned over where possible. Reduce speed before entering the bend."}, {"question": "Why is road position important in corners?", "answer": "It affects visibility, available space and your safety margin from hazards and other vehicles."}, {"question": "Do wet roads change motorcycle cornering?", "answer": "Yes. Reduced traction means riders should slow down and use smoother inputs."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'motorcycle-road-position-visibility',
  'Did You Know? Road Position Can Make a Motorcycle Easier to See',
  'A motorcycle’s position within a lane can affect how visible it is to other road users and how much time the rider has to see hazards.',
  'A motorcycle’s position within a lane can affect how visible it is to other road users and how much time the rider has to see hazards. Motorcyclists should choose a position that helps them see ahead, be seen by drivers and maintain a space cushion from road edges, parked vehicles and larger vehicles. Do not ride unnecessarily close to the kerb, directly beside another vehicle or in a truck’s blind spot. Move within your lane when necessary to improve your view around traffic, but do not weave unpredictably. Clear signalling and stable positioning help other drivers understand what you are doing. Car drivers should also respect a motorcycle’s lane position. Do not assume a rider will remain in one narrow strip of road; riders may need room to avoid potholes, debris, standing water or uneven surfaces.',
  'NaTIS K53 motorcycle practical-driving-test documentation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=56:k53-motor-cycles-part2',
  'Driving',
  '[{"question": "Why do motorcycles move within their lane?", "answer": "Riders may adjust position to improve visibility, avoid hazards or maintain safety space."}, {"question": "Should a motorcycle ride close to the kerb?", "answer": "Not necessarily. Riding too close to the edge can reduce space and expose the rider to debris or poor road surfaces."}, {"question": "Can a car share a lane with a motorcycle?", "answer": "Give the motorcycle proper space. Do not crowd the rider or assume there is room to travel side by side."}, {"question": "Why should riders avoid truck blind spots?", "answer": "Large vehicles have major blind spots, and drivers may not see a motorcycle beside or behind them."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'motorcycle-road-hazards-potholes-gravel',
  'Did You Know? Motorcycles Need Extra Space Around Road Hazards',
  'Potholes, loose gravel, sand, standing water, painted markings and road debris can affect a motorcycle more severely than a car.',
  'Potholes, loose gravel, sand, standing water, painted markings and road debris can affect a motorcycle more severely than a car. Two wheels have a smaller contact area, so a rider may need room to avoid a hazard safely without sudden swerving. This is one reason riders need a safe following distance and a lane position that gives a clear view of the road ahead. If a rider is too close to the vehicle in front, they may not see a pothole or object until there is no safe way to avoid it. Car drivers can help by giving motorcycles space and avoiding aggressive overtakes or tailgating. Riders should scan ahead, reduce speed where surface conditions are poor and avoid abrupt steering or braking. Safe riding is largely about seeing hazards early enough to make calm decisions.',
  'NaTIS K53 motorcycle practical-driving-test documentation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=56:k53-motor-cycles-part2',
  'Driving',
  '[{"question": "Why are potholes dangerous for motorcycles?", "answer": "They can destabilise the motorcycle, damage tyres or rims, and cause loss of control."}, {"question": "Why should a motorcycle keep following distance?", "answer": "It gives the rider more time to see and avoid road hazards hidden by the vehicle ahead."}, {"question": "Should riders swerve sharply around debris?", "answer": "Avoid sudden movements where possible. Slow down, assess the space and manoeuvre smoothly."}, {"question": "How should drivers behave near motorcycles on damaged roads?", "answer": "Give riders more space and avoid crowding them, because they may need room to avoid hazards."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'motorcycle-following-distance-safe-space',
  'Did You Know? Following Distance Matters Even More on Two Wheels',
  'Motorcyclists need enough following distance to see ahead, react to sudden braking and identify road-surface hazards.',
  'Motorcyclists need enough following distance to see ahead, react to sudden braking and identify road-surface hazards. K53 guidance for motor vehicles calls for increased following distance in adverse conditions such as rain, slippery surfaces and poor visibility. The same safety principle is particularly important on a motorcycle because riders need time and space to manage braking and balance. A time-based following gap is more useful than counting car lengths because it adjusts naturally for speed. In wet weather, at night or behind large vehicles, increase the gap further. Large vehicles can block your view of the road ahead and spray water or debris in poor weather. Drivers behind motorcycles should also avoid tailgating. A rider may need to slow suddenly for surface hazards that are difficult for a car driver to see. Give the rider room and expect the motorcycle’s speed to change as conditions change.',
  'K53 practical-driving-test documentation on following distance.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=60:k53-light-motor-vehicle-part2-code-b',
  'Driving',
  '[{"question": "Why do motorcycles need more following distance?", "answer": "Riders need time to see surface hazards, brake progressively and maintain stability."}, {"question": "Should following distance increase in rain?", "answer": "Yes. Rain and slippery surfaces reduce traction and visibility, so leave more time and space."}, {"question": "Why should cars avoid tailgating motorcycles?", "answer": "Motorcyclists may slow for potholes, debris or poor road surfaces that are not obvious to drivers behind them."}, {"question": "Does following distance matter behind trucks?", "answer": "Yes. Trucks can block visibility and create spray or turbulence, so increase your gap."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'motorcycle-daytime-headlights-visibility',
  'Did You Know? Daytime Headlights Help Motorcyclists Be Seen',
  'Motorcycles can be difficult to notice because of their narrow profile, especially in busy traffic or changing light. Using headlights during the day can help make a motorcycle more noticeable to other road users.',
  'Motorcycles can be difficult to notice because of their narrow profile, especially in busy traffic or changing light. Using headlights during the day can help make a motorcycle more noticeable to other road users. K53 motorcycle documentation emphasises mirrors, blind-spot checks and observation, reflecting the importance of active visibility and awareness. Lighting does not replace road position, protective gear, signalling or defensive riding. Riders should still choose positions where they can see and be seen, avoid lingering in blind spots and make predictable movements. Drivers should never assume that a motorcycle without a visible light is not present. Before turning or changing lanes, check properly. A single headlight can look distant even when the motorcycle is approaching more quickly than expected. Treat every light and movement around you as information to assess, not something to ignore.',
  'NaTIS K53 motorcycle practical-driving-test documentation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=56:k53-motor-cycles-part2',
  'Driving',
  '[{"question": "Why do motorcyclists use headlights in daytime?", "answer": "Headlights can help make a motorcycle more noticeable to other road users."}, {"question": "Do daytime headlights make a rider completely safe?", "answer": "No. Riders still need defensive road position, signalling, speed control and protective gear."}, {"question": "Why can a motorcycle headlight look far away?", "answer": "A single light and a narrow vehicle profile can make it difficult for drivers to judge distance and speed accurately."}, {"question": "What should drivers do before turning across a motorcycle’s path?", "answer": "Check carefully, judge the motorcycle’s approach and wait until it is safe rather than assuming you have time."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'truck-stopping-distance-wide-turns',
  'Did You Know? Larger Vehicles Need More Space to Stop and Turn',
  'Large trucks, buses and vehicle combinations carry more mass and occupy more road space than ordinary cars. This means drivers must plan further ahead for braking, turning, lane changes and parking.',
  'Large trucks, buses and vehicle combinations carry more mass and occupy more road space than ordinary cars. This means drivers must plan further ahead for braking, turning, lane changes and parking. Their size also means other road users should avoid cutting in closely or assuming they can turn as tightly as a passenger car. Heavy-vehicle driving requires the appropriate licence category. South African licensing information distinguishes light motor vehicles from heavier categories such as C1, C, EC1 and EC. The correct category depends on the vehicle’s mass and whether it is a combination vehicle. When sharing the road with large vehicles, leave extra following distance, avoid blind spots and expect wide turns. Do not overtake a truck and immediately pull in front of it. Give its driver enough room to see you and enough stopping space to respond safely.',
  'South African Government: licence-category amendments and heavy-vehicle categories.',
  'https://www.gov.za/news/media-statements/transport-publishes-amendments-national-road-traffic-regulations-200014-nov',
  'Driving',
  '[{"question": "Why do trucks need more stopping distance?", "answer": "Their greater mass and size mean they generally need more space and planning to slow or stop safely."}, {"question": "Why do trucks make wide turns?", "answer": "Their length and turning geometry require more road space than a normal car, especially when towing."}, {"question": "Should I drive closely in front of a truck?", "answer": "No. Leave enough space so the truck driver can see you and has room to brake safely."}, {"question": "Do heavy vehicles require different licence categories?", "answer": "Yes. South Africa uses separate licence categories for different vehicle masses and combinations."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'truck-blind-spots-road-safety',
  'Did You Know? Heavy Vehicles Have Larger Blind Spots Than Cars',
  'Large vehicles have significant blind spots around the front, sides and rear. A truck driver may not be able to see a small car, motorcycle or cyclist travelling close beside the cab or directly behind the trailer.',
  'Large vehicles have significant blind spots around the front, sides and rear. A truck driver may not be able to see a small car, motorcycle or cyclist travelling close beside the cab or directly behind the trailer. This is why drivers should avoid lingering alongside heavy vehicles, particularly on the left side or near the rear. If you cannot see the truck driver’s mirrors, assume the driver may not be able to see you. Pass only when it is safe, do not cut in sharply after overtaking, and give the truck room to change lanes or turn. K53 observation guidance emphasises mirror and blind-spot checks for safe movement; these principles are even more important around larger vehicles. Truck drivers also need active mirror use and planned manoeuvres, because their blind spots are larger and their vehicles respond more slowly. Road safety depends on both drivers making space and remaining predictable.',
  'NaTIS K53 documentation on mirrors and blind-spot observation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "Where are a truck’s blind spots?", "answer": "They can be directly in front, along both sides and directly behind the vehicle or trailer."}, {"question": "How can I know if a truck driver can see me?", "answer": "If you cannot see the driver’s mirrors, assume the driver may not be able to see you."}, {"question": "Should I overtake a truck slowly?", "answer": "Overtake only when safe and complete the pass decisively without lingering beside the truck."}, {"question": "Why should I not cut in front of a truck?", "answer": "The truck needs more distance to stop, and cutting in reduces the driver’s time and space to react safely."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'trailer-reversing-slow-small-inputs',
  'Did You Know? Trailer Reversing Starts With Slow, Small Inputs',
  'Reversing with a trailer is more complex than reversing a car because the trailer responds in the opposite direction to the towing vehicle’s steering movement.',
  'Reversing with a trailer is more complex than reversing a car because the trailer responds in the opposite direction to the towing vehicle’s steering movement. Small steering inputs can create large changes in the trailer’s path, so slow speed and patience are essential. Before reversing, inspect the space and make sure it is clear of people, vehicles, walls, poles and other obstacles. Use mirrors, but do not rely only on them. Stop if you lose sight of the trailer’s path or become uncertain about clearance. It is safer to pull forward and realign than to continue with a poor angle. Training is particularly valuable for trailer reversing because it develops spatial awareness and controlled steering. Practise in a safe area, beginning with gentle corrections and wide spaces before attempting tighter bays or more complex manoeuvres.',
  'NaTIS K53 documentation on observation.',
  'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
  'Driving',
  '[{"question": "Why does a trailer move differently when reversing?", "answer": "The trailer pivots at the hitch, so steering input has the opposite effect on the trailer’s direction."}, {"question": "Should I reverse a trailer quickly?", "answer": "No. Reverse very slowly and use small steering corrections."}, {"question": "What should I do if the trailer starts turning too sharply?", "answer": "Stop safely, pull forward to straighten the combination and begin again with smaller steering input."}, {"question": "Is observation important while reversing a trailer?", "answer": "Yes. Check mirrors, look around the vehicle and stop if the space is not clearly safe."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'trailer-licence-code-eb-south-africa',
  'Did You Know? A Trailer Can Change Which Licence Category You Need',
  'Towing a trailer can affect the driving-licence category you need. South African licensing distinguishes between light motor vehicles and vehicle combinations, including Code EB and heavier combination categories such as EC1 and EC.',
  'Towing a trailer can affect the driving-licence category you need. South African licensing distinguishes between light motor vehicles and vehicle combinations, including Code EB and heavier combination categories such as EC1 and EC. The correct licence depends on the vehicle and trailer combination, including relevant mass limits and the type of vehicle being towed. Do not assume that every car licence automatically covers every trailer. A small trailer may fall within the permissions of a light motor vehicle licence, while a heavier trailer or combination may require an additional category. The most reliable way to confirm this is to contact a DLTC before buying, towing or booking a test. Beyond the licence category, trailers require safe coupling, lighting, tyres, load security and careful driving. A trailer changes braking, turning, reversing and lane-change behaviour, so training is valuable even where a person is already experienced in a car.',
  'South African Government: licence categories and amendments.',
  'https://www.gov.za/news/media-statements/transport-publishes-amendments-national-road-traffic-regulations-200014-nov',
  'Driving',
  '[{"question": "Do I need a special licence to tow a trailer?", "answer": "It depends on the vehicle and trailer combination. Confirm the required licence category with a DLTC."}, {"question": "What is Code EB used for?", "answer": "Code EB relates to certain light motor vehicle and trailer combinations. Confirm the current technical requirements with a DLTC."}, {"question": "Why are trailers harder to drive with?", "answer": "They change the vehicle’s turning, braking, reversing and stability characteristics."}, {"question": "Can I practise trailer reversing without training?", "answer": "You should first confirm legal requirements and practise only in a safe, suitable area. Structured training is strongly recommended."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (
  'professional-driving-permit-prdp-south-africa',
  'Did You Know? Professional Driving May Require More Than a Driving Licence',
  'Some commercial driving work requires more than an ordinary driving licence.',
  'Some commercial driving work requires more than an ordinary driving licence. South African professional driving permit rules apply to certain drivers, including those transporting passengers for reward and drivers in specified goods-vehicle categories. A Professional Driving Permit, commonly called a PrDP, is an additional authorisation and does not replace the need for the correct driving-licence category. The precise requirement depends on the type of vehicle, its use and the passengers or goods being transported. For example, passenger transport for reward may require a PrDP for passengers. Do not rely on informal advice if you plan to drive a taxi, bus, delivery vehicle or other commercial vehicle. Before applying for commercial work, confirm the applicable licence category and PrDP requirement through official provincial, Department of Transport or DLTC channels. Professional drivers also carry a heightened responsibility for vehicle condition, passenger safety, route planning and lawful driving behaviour.',
  'Western Cape Government: Professional Driving Permit service information.',
  'https://www.westerncape.gov.za/service/professional-driving-permit',
  'Driving',
  '[{"question": "What is a PrDP?", "answer": "A Professional Driving Permit is an additional authorisation required for certain professional driving activities in South Africa."}, {"question": "Do taxi drivers need a PrDP?", "answer": "Passenger transport for reward generally requires the appropriate PrDP. Confirm the current category and conditions with a DLTC."}, {"question": "Is a PrDP the same as a driving licence?", "answer": "No. A PrDP is additional to the correct driving-licence category."}, {"question": "Do all delivery drivers need a PrDP?", "answer": "Requirements depend on the vehicle category and use. Confirm directly with the relevant licensing authority before accepting commercial work."}]'::jsonb,
  'published'
) ON CONFLICT (slug) DO NOTHING;
