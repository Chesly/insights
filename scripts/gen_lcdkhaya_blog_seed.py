#!/usr/bin/env python3
"""
Generates supabase-lcdkhaya-blog-seed.sql from the POSTS list below.
Run once: python3 scripts/gen_lcdkhaya_blog_seed.py
Then paste the output SQL file into Supabase's SQL Editor and run it —
same workflow as the facts seed batches and supabase-content-seed.sql.

12 starter blog posts for LCD Khaya, in the "Quick Answer / Real
Answer / Key Factors / Common Mistakes / Expert Tip / FAQs / Key
Takeaways" style modelled on Chesly's existing "Ask CLYC" post style.
Reuses the shared posts table exactly like the main Insights blog —
tagged "lcdkhaya" (same tag name lcdKhayaConfig.blogTag expects), no
new table needed. category_id is left NULL since none of the site's
existing categories fit a driving-school post and it isn't required
for LCD Khaya's blog page (which filters by tag only).
"""
import html, json
from datetime import date, timedelta

def esc(t):
    return html.escape(t, quote=False)

def sql_str(v):
    if v is None:
        return "NULL"
    return "'" + str(v).replace("'", "''") + "'"

def build_body(p):
    parts = []
    parts.append(f"<p><strong>Quick answer:</strong> {esc(p['quick_answer'])}</p>")
    parts.append("<h2>The Real Answer</h2>")
    for para in p["real_answer_paras"]:
        parts.append(f"<p>{esc(para)}</p>")
    if p["key_factors"]:
        parts.append("<h2>Key Factors</h2>")
        parts.append("<ul>" + "".join(f"<li>{esc(i)}</li>" for i in p["key_factors"]) + "</ul>")
    if p["common_mistakes"]:
        parts.append("<h2>Common Mistakes</h2>")
        parts.append("<ul>" + "".join(f"<li>{esc(i)}</li>" for i in p["common_mistakes"]) + "</ul>")
    if p["expert_tip"]:
        parts.append("<h2>Expert Tip</h2>")
        parts.append(f"<p>{esc(p['expert_tip'])}</p>")
    if p["related_fact_topics"] or p["related_services"]:
        parts.append("<h2>Related Topics</h2>")
        if p["related_fact_topics"]:
            parts.append("<ul>" + "".join(f"<li>{esc(i)}</li>" for i in p["related_fact_topics"]) + "</ul>")
        if p["related_services"]:
            parts.append(f"<p><strong>Related services:</strong> {esc(', '.join(p['related_services']))}</p>")
    if p["faqs"]:
        parts.append("<h2>FAQs</h2>")
        for f in p["faqs"]:
            parts.append(f"<h3>{esc(f['question'])}</h3><p>{esc(f['answer'])}</p>")
    if p["key_takeaways"]:
        parts.append("<h2>Key Takeaways</h2>")
        parts.append("<ul>" + "".join(f"<li>{esc(i)}</li>" for i in p["key_takeaways"]) + "</ul>")
    return "\n".join(parts)

def word_count(p):
    total = len(p["quick_answer"].split())
    total += sum(len(x.split()) for x in p["real_answer_paras"])
    total += sum(len(x.split()) for x in p["key_factors"])
    total += sum(len(x.split()) for x in p["common_mistakes"])
    total += len(p["expert_tip"].split())
    total += sum(len(f["question"].split()) + len(f["answer"].split()) for f in p["faqs"])
    total += sum(len(x.split()) for x in p["key_takeaways"])
    return total

POSTS = [
    {
        'title': 'How Long Does It Really Take to Learn to Drive in Daveyton?',
        'slug': 'how-long-does-it-really-take-to-learn-to-drive-in-daveyton',
        'quick_answer': 'Most learners in Daveyton need between 20 and 40 hours of supervised driving before they’re ready for a K53 test, depending on age, prior experience, lesson frequency and the type of roads they practise on. Structured lessons with a qualified instructor usually shorten this timeline compared to informal practice alone.',
        'real_answer_paras': ['There is no single “correct” number of hours to learn to drive. Some learners feel ready after 15 hours; others need 60+. The difference usually comes down to quality of practice, not just quantity. In and around Daveyton, Etwatwa, Benoni and Crystal Park, learners face a mix of quiet residential streets, busy taxi routes, informal trading zones and school traffic. A learner who only practises on one quiet road may feel confident there but struggle at a busy intersection near Benoni CBD or on a multi-lane road towards Springs. Structured K53 lessons accelerate learning because they: Focus on specific skills each session (e.g. intersections, lane changes, parking) Use routes that mimic real test conditions Provide immediate, specific feedback instead of “you’ll get it” Build observation and decision-making, not just vehicle control Learners who combine weekly lessons with supervised practice between lessons usually progress faster than those who rely only on one or the other. Age also matters: younger learners often need more time to develop hazard perception, while older learners may need to unlearn bad habits from years of informal driving. Rather than asking “How many hours?”, a better question is: “Am I consistently driving safely in the kinds of conditions I’ll face daily?”'],
        'key_factors': ['Age and prior experience (young first-time learners vs older second-language drivers)', 'Frequency of lessons (weekly vs once a month)', 'Type of roads used for practice (quiet streets vs mixed Ekurhuleni traffic)', 'Quality of instructor and lesson structure', 'Amount of supervised practice between lessons'],
        'common_mistakes': ['Counting hours instead of measuring skill growth', 'Only practising on one “safe” route', 'Rushing to book the test before handling busy intersections confidently', 'Using an unlicensed or inexperienced supervisor for most practice'],
        'expert_tip': 'Track your progress by situations, not hours: “Can I handle Daveyton taxi ranks, Benoni CBD traffic, and a multi-lane road safely?” When the answer is consistently yes, you’re closer to ready than any hour count.',
        'related_fact_topics': ['Did You Know? Your First 10 Hours Shape Your Long-Term Driving Habits', 'Did You Know? Choosing a Local Driving School Can Help With Area Familiarity'],
        'related_services': ['K53 Driving Lessons', 'Learner’s Licence Preparation'],
        'faqs': [{'question': 'Can I learn to drive in 10 hours?', 'answer': 'Some basic control is possible, but safe, independent driving in Ekurhuleni traffic usually requires more structured practice.'}, {'question': 'Is it better to do many lessons quickly or spread them out?', 'answer': 'A mix works best: regular lessons (e.g. weekly) plus practice in between to reinforce skills.'}, {'question': 'Do I need lessons if I already practise with a family member?', 'answer': 'Lessons add structure, correct bad habits and prepare you specifically for K53 test expectations.'}, {'question': 'How do I know I’m ready for the test?', 'answer': 'When you can handle busy intersections, lane changes, parking and varied roads safely without constant prompts.'}],
        'key_takeaways': ['20–40+ hours is typical, but skill matters more than time.', 'Structured K53 lessons shorten the learning curve.', 'Practise on varied Ekurhuleni roads, not just one quiet street.', 'Readiness is about consistent safe performance, not a magic hour number.'],
    },
    {
        'title': 'Manual vs Automatic: Which Should I Learn First in South Africa?',
        'slug': 'manual-vs-automatic-which-should-i-learn-first-in-south-africa',
        'quick_answer': 'Choose based on the vehicles you’ll actually drive, not on which is “easier”. If you’ll mostly drive automatics, learning in an automatic is sensible. If you may need to drive manuals (family cars, work vehicles), learning manual first keeps your options open. Your licence may be restricted if you test in an automatic.',
        'real_answer_paras': ['The manual vs automatic debate is often framed as “which is easier?” The more useful question is: “Which matches my real-life needs?” Manual vehicles dominate many South African households and workplaces. Bakkies, older cars and some fleet vehicles are still manual. If you learn only in an automatic, your licence may carry a restriction that prevents you from legally driving manual vehicles without further testing. Automatic vehicles are increasingly common, especially in newer cars and ride-hailing fleets. For some learners—particularly those with physical limitations, anxiety around clutch control, or a clear plan to only drive automatics—starting in an automatic makes sense.', 'From a K53 test perspective, both manual and automatic are assessed on the same core skills: observation, road rules, parking and safe decision-making. The main difference is vehicle control: clutch/gear coordination vs brake/accelerator modulation. If you’re unsure, consider: What cars are in your household? What might you drive for work in the next 5 years? Are you comfortable managing a clutch and gears? A good driving school will let you try both in early lessons before committing to one path.'],
        'key_factors': ['Vehicles available to you at home or work', 'Your long-term driving plans (only automatics vs mixed fleet)', 'Comfort with clutch and gear coordination', 'Any physical or anxiety-related considerations', 'Licence restrictions if you test in an automatic'],
        'common_mistakes': ['Choosing automatic just because it seems “easier” without checking licence restrictions', 'Learning manual when you’ll never drive one, adding unnecessary stress', 'Switching between manual and automatic lessons close to the test', 'Not confirming how your licence will be coded before booking the test'],
        'expert_tip': 'If you’re truly undecided, start with two manual lessons and two automatic lessons. See which feels more natural and realistic for your life, then commit.',
        'related_fact_topics': ['Did You Know? An Automatic Licence Restriction Can Affect What You May Drive', 'Did You Know? Automatic Does Not Mean “Easier to Learn Safely”'],
        'related_services': ['Manual Driving Lessons', 'Automatic Driving Lessons'],
        'faqs': [{'question': 'Will my licence say “automatic only” if I test in an automatic?', 'answer': 'Often yes. Confirm the current coding rules with your DLTC before booking.'}, {'question': 'Can I change from automatic to manual later?', 'answer': 'Yes, but you’ll need to pass a practical test in a manual vehicle.'}, {'question': 'Is manual harder to learn?', 'answer': 'It involves more coordination initially, but many learners adapt quickly with structured lessons.'}, {'question': 'Which is better for ride-hailing or delivery work?', 'answer': 'Check the vehicles used by the platform or employer; many are automatic, but not all.'}],
        'key_takeaways': ['Match your choice to the cars you’ll actually drive.', 'Automatic may restrict your licence to automatics only.', 'Manual keeps more options open but requires more coordination.', 'Try both early if you’re unsure.'],
    },
    {
        'title': 'What Exactly Is K53 and Why Do South African Tests Use It?',
        'slug': 'what-exactly-is-k53-and-why-do-south-african-tests-use-it',
        'quick_answer': 'K53 is South Africa’s standardised practical driving-test system. It assesses whether you can drive and park safely while following the rules of the road, using a structured approach to observation, vehicle control and decision-making. It’s used at DLTCs nationwide, including in Ekurhuleni.',
        'real_answer_paras': ['Many learners hear “K53” but don’t fully understand what it means. K53 refers to the official practical driving-test standard used in South Africa. It covers both a yard test (manoeuvres like parking and reversing) and a road test (driving in real traffic). The system is designed to: Ensure all licensed drivers meet a minimum safety standard Test observation habits, not just vehicle control Standardise testing across different provinces and centres In a K53 test, the examiner watches how you: Set up the vehicle (seat, mirrors, controls) Move off, stop and change gears smoothly Use mirrors and blind-spot checks before manoeuvres Handle intersections, lane changes and parking Respond to signs, signals and real-world hazards K53 is not about perfection. It’s about showing consistent safe habits under test conditions. Some people think K53 is just “parking and three-point turns”. In reality, the road portion is where most candidates are assessed on their everyday driving: speed choice, following distance, observation and rule compliance. Understanding K53 helps you prepare properly: you’re not just learning to move a car, but to think like a safe driver.'],
        'key_factors': ['Test centre and route (some include freeways, others don’t)', 'Vehicle type (manual vs automatic, vehicle condition)', 'Your observation and decision-making habits', 'How well your training matches K53 expectations'],
        'common_mistakes': ['Training only on one quiet route instead of varied conditions', 'Focusing only on parking and ignoring road driving', 'Treating K53 as a checklist instead of a safety framework', 'Not practising observation out loud or systematically'],
        'expert_tip': 'Ask your instructor to explain every K53 requirement in plain language: what they’ll watch for, how they record faults, and what “safe enough” looks like in real terms.',
        'related_fact_topics': ['Did You Know? K53 Is a Safety Framework, Not Just a Test Checklist', 'Did You Know? The K53 Test Includes Yard and Road Components'],
        'related_services': ['K53 Driving Lessons', 'Learner’s Licence Preparation'],
        'faqs': [{'question': 'Is K53 used everywhere in South Africa?', 'answer': 'Yes, it’s the national standard for practical driving tests.'}, {'question': 'Does K53 only test parking?', 'answer': 'No. It includes both yard manoeuvres and real-road driving.'}, {'question': 'Can I fail for small mistakes?', 'answer': 'Minor faults may be allowed if your overall driving is safe; serious or repeated faults can lead to failure.'}, {'question': 'Do automatic cars use K53 too?', 'answer': 'Yes. The test applies to both manual and automatic vehicles.'}],
        'key_takeaways': ['K53 is South Africa’s standard practical driving-test system.', 'It tests both yard manoeuvres and real-road driving.', 'Observation and safe habits matter more than perfection.', 'Understanding K53 helps you train purposefully, not randomly.'],
    },
    {
        'title': 'How to Choose a Driving School in Ekurhuleni (Without Wasting Money)',
        'slug': 'how-to-choose-a-driving-school-in-ekurhuleni-without-wasting-money',
        'quick_answer': 'Look beyond price and marketing. A good driving school in Ekurhuleni should offer structured K53-aligned lessons, qualified instructors, clear progress tracking and vehicles that match your intended test type. Local knowledge of Daveyton, Benoni and surrounding routes is a strong advantage.',
        'real_answer_paras': ['Driving schools in Ekurhuleni, Daveyton, Benoni and Springs vary widely in quality. Some focus on “passing the test”, others on building long-term safe drivers. Price alone is a poor indicator of quality. When comparing schools, consider: 1. Instructor qualifications and approach Are instructors registered and experienced? Do they explain the “why”, not just the “how”? Do they give specific feedback after each lesson? 2. Lesson structure Is there a clear plan for each lesson? Do they cover both yard and road skills progressively? Do they adapt to your weaknesses instead of repeating the same route? 3. Vehicles Are cars roadworthy, clean and similar to what you’ll test in? Do they offer both manual and automatic if you’re unsure? 4. Local knowledge Do they know common test routes around Benoni, Springs and Ekurhuleni DLTCs? Do they prepare you for real local conditions: taxi ranks, school zones, busy intersections? 5. Transparency Are prices, packages and policies clear in writing? Do they explain licence restrictions (e.g. automatic-only) upfront? A slightly higher fee for a structured, honest school often saves money in the long run by reducing retests, bad habits and post-licence accidents.'],
        'key_factors': ['Instructor quality and communication style', 'Lesson structure and progression', 'Vehicle condition and type', 'Local route knowledge', 'Pricing transparency and policies'],
        'common_mistakes': ['Choosing only on price or “cheapest package”', 'Not asking how lessons are structured', 'Ignoring vehicle condition and transmission type', 'Assuming all schools teach K53 properly'],
        'expert_tip': 'Book a single trial lesson before committing to a big package. Use it to assess instruction quality, vehicle condition and whether you feel safer afterwards.',
        'related_fact_topics': ['Did You Know? A Good Instructor Explains the “Why”, Not Just the “How”', 'Did You Know? Lesson Structure Matters More Than Lesson Length'],
        'related_services': ['K53 Driving Lessons', 'Defensive Driving Lessons'],
        'faqs': [{'question': 'Is the cheapest driving school the best option?', 'answer': 'Not usually. Quality instruction and structured lessons matter more than low price.'}, {'question': 'Should I choose a school near my home or near the DLTC?', 'answer': 'Both can work; local knowledge of your area and test routes is valuable.'}, {'question': 'How many lessons should I book at once?', 'answer': 'Start with a small package or trial lesson, then adjust based on progress.'}, {'question': 'Do I need a school if I can practise with family?', 'answer': 'School lessons add structure, K53 alignment and professional feedback that family practice often lacks.'}],
        'key_takeaways': ['Price is less important than instructor quality and structure.', 'Look for K53-aligned, progressive lessons.', 'Local Ekurhuleni knowledge is a real advantage.', 'Try a trial lesson before committing to large packages.'],
    },
    {
        'title': 'Why Passing Your Driving Test Doesn’t Mean You’re a Safe Driver',
        'slug': 'why-passing-your-driving-test-doesn-t-mean-you-re-a-safe-driver',
        'quick_answer': 'The K53 test assesses minimum competence under controlled conditions, not mastery of all real-world scenarios. Passing means you met the licensing standard on that day, not that you’re immune to risk. Continued learning and reflection after licensing are what build truly safe drivers.',
        'real_answer_paras': ['Many learners treat the driving test as the “final boss” of driving. Once passed, they assume they’ve “arrived”. In reality, the test is more like a driver’s licence to keep learning. The K53 practical test: Lasts 30–40 minutes Covers a limited set of routes and conditions Cannot simulate every hazard you’ll face over years of driving It’s designed to confirm you can: Control the vehicle safely Observe and follow road rules Handle basic traffic situations competently But real life adds: Long-distance fatigue Night driving in unfamiliar areas Aggressive drivers, impaired drivers and pedestrians Changing weather, load conditions and vehicle types Some of the most dangerous drivers are those who passed the test and stopped learning. They rely on luck, low mileage or “I’ve never had an accident” as proof of skill, instead of examining their habits. Safer drivers treat licensing as the start of ongoing improvement: occasional refresher lessons, defensive driving courses, honest self-review after near-misses, and staying updated on roadsafety information.'],
        'key_factors': ['How you view the test (end goal vs starting point)', 'Your willingness to reflect on mistakes and near-misses', 'Whether you continue learning after licensing', 'The complexity of roads and conditions you regularly face'],
        'common_mistakes': ['Treating the test as the final achievement', 'Ignoring bad habits that didn’t get penalised in the test', 'Assuming no accidents = high skill', 'Never revisiting your driving after licensing'],
        'expert_tip': 'Within 6–12 months of licensing, book a refresher or defensive driving lesson. It’s surprising how many hidden habits show up once test pressure is gone.',
        'related_fact_topics': ['Did You Know? Passing the Test Is Not the Same as Being a Safe Driver', 'Did You Know? “I’ve Never Had an Accident” Is Not Proof of Skill'],
        'related_services': ['Defensive Driving Lessons', 'K53 Driving Lessons'],
        'faqs': [{'question': 'If I passed K53, am I a good driver?', 'answer': 'You met minimum standards on test day; ongoing safety depends on your habits and continued learning.'}, {'question': 'Should I take more lessons after passing?', 'answer': 'Refresher or defensive lessons can reveal and correct habits the test didn’t expose.'}, {'question': 'How can I keep improving after licensing?', 'answer': 'Reflect on trips, consider advanced courses, and stay updated on road-safety guidance.'}, {'question': 'Do experienced drivers need refresher lessons?', 'answer': 'Yes, especially if they’ve developed complacent or risky habits over time.'}],
        'key_takeaways': ['The K53 test measures minimum competence, not mastery.', 'Real-world driving is more complex than test conditions.', 'Safe drivers keep learning after licensing.', 'Refresher lessons can uncover hidden bad habits.'],
    },
    {
        'title': 'What to Do If You Fail Your K53 Driving Test in Ekurhuleni',
        'slug': 'what-to-do-if-you-fail-your-k53-driving-test-in-ekurhuleni',
        'quick_answer': 'Failing your K53 test is common and not a disaster. Review your examiner’s feedback, identify specific weak areas, and adjust your training before rebooking. Most learners pass on their second or third attempt once they target the real issues instead of just “trying again”.',
        'real_answer_paras': ['Receiving a “fail” result at a DLTC in Benoni, Springs or another Ekurhuleni centre can feel discouraging. But a fail is better understood as diagnostic information, not a verdict on your ability. Examiners record faults in areas like: Observation (mirrors, blind spots, scanning) Vehicle control (clutch, braking, steering) Road-rule compliance (signs, signals, right of way) Decision-making (speed, gaps, lane choice) The first step is to get clear feedback. Some examiners explain briefly; others provide a fault sheet. Ask your instructor to help interpret this: “What exactly went wrong? Was it observation, control, or decision-making?” Common reasons for failure include: Inconsistent mirror and blind-spot checks Poor speed choice for conditions Unsafe lane changes or intersection handling Nerves leading to rushed decisions Instead of immediately rebooking, spend time: Practising the specific weak skills Driving on routes similar to your test area Simulating test conditions with your instructor Many learners pass on the second or third attempt once they address the root causes rather than hoping for a “better day”.'],
        'key_factors': ['Type and severity of faults recorded', 'How well you understand the feedback', 'Quality of post-fail training', 'Time between attempts (too soon vs well-prepared)'],
        'common_mistakes': ['Rebooking immediately without targeted practice', 'Blaming the examiner instead of reviewing your driving', 'Only practising the same route again', 'Ignoring observation and focusing only on control'],
        'expert_tip': 'Request a mock test with your instructor under realistic conditions before rebooking. Treat it like a real test, then analyse every fault in detail.',
        'related_fact_topics': ['Did You Know? Recovering Well From a Mistake Can Save Your Test', 'Did You Know? You Can Retake the Learner’s Test If You Fail'],
        'related_services': ['K53 Driving Lessons', 'Defensive Driving Lessons'],
        'faqs': [{'question': 'How soon can I rebook after failing?', 'answer': 'You can book as soon as you have a new appointment, but allow time for proper practice.'}, {'question': 'Do I need more lessons after failing?', 'answer': 'Usually yes, focused on your specific fault areas.'}, {'question': 'Will the same examiner test me again?', 'answer': 'Not necessarily. Examiners rotate, and routes may differ slightly.'}, {'question': 'Does a fail mean I’m a bad driver?', 'answer': 'No. It means you didn’t meet the standard on that day under those conditions.'}],
        'key_takeaways': ['A fail is diagnostic, not definitive.', 'Understand your specific faults before rebooking.', 'Targeted practice beats random repetition.', 'Many learners pass on their second or third attempt.'],
    },
    {
        'title': 'How to Practise Driving Between Lessons (Without Building Bad Habits)',
        'slug': 'how-to-practise-driving-between-lessons-without-building-bad-habits',
        'quick_answer': 'Practice between lessons is valuable, but only if it’s supervised, structured and aligned with your instructor’s methods. Random “extra drives” with different supervisors can reinforce bad habits. Use checklists, focus on specific skills and keep communication open with your instructor.',
        'real_answer_paras': ['Many learners in Daveyton, Benoni and Etwatwa supplement formal lessons with practice drives supervised by parents, siblings or friends. This can accelerate progress—if done well. The risk is that different supervisors often have different habits and advice. One may say “move off quickly”, another “wait longer”. One may ignore blind-spot checks; another may overemphasise them. The learner ends up confused, or worse, normalises unsafe shortcuts. To make between-lesson practice effective: 1. Align with your instructor Share what you’re working on in lessons (e.g. intersections, clutch control, parking). Ask your supervisor to support the same methods. 2. Use a simple checklist For each drive, focus on 2–3 skills: Mirror checks before slowing or turning Smooth clutch and accelerator use Proper stopping position at intersections 3. Keep conditions appropriate Early practice should be on quiet roads in daylight. Gradually introduce busier routes as skills improve. 4. Debrief afterwards Ask: What went well? What felt difficult? Share this with your instructor so they can adjust the next lesson. Practice is not about racking up hours. It’s about reinforcing correct patterns so they become automatic.'],
        'key_factors': ['Supervisor’s driving habits and understanding of K53', 'Clarity on which skills to practise', 'Road types and traffic conditions used', 'Communication between supervisor and instructor'],
        'common_mistakes': ['Allowing any licensed driver to supervise without guidance', 'Practising the wrong skills or on unsuitable roads', 'Ignoring observation and focusing only on control', 'Not debriefing or sharing feedback with your instructor'],
        'expert_tip': 'Give your supervisor a one-page summary from your instructor: “These are the 3 things we’re focusing on this month. Please support these specifically.”',
        'related_fact_topics': ['Did You Know? Practising With Different Supervisors Can Create Confusion', 'Did You Know? The Best Learner Practice Includes More Than Quiet Streets'],
        'related_services': ['Learner’s Licence Preparation', 'K53 Driving Lessons'],
        'faqs': [{'question': 'Can anyone with a licence supervise my practice?', 'answer': 'Legally, a licensed driver can, but they should understand safe driving and support your instructor’s methods.'}, {'question': 'How often should I practise between lessons?', 'answer': 'Regular, shorter sessions are better than rare, long drives.'}, {'question': 'Should I practise the same route every time?', 'answer': 'Start with familiar roads, then gradually add variety as confidence grows.'}, {'question': 'What if my supervisor disagrees with my instructor?', 'answer': 'Prioritise your instructor’s K53-aligned advice for test preparation and safety.'}],
        'key_takeaways': ['Between-lesson practice helps only if it’s aligned and structured.', 'Different supervisors can create conflicting habits.', 'Focus on specific skills, not just “more driving”.', 'Communicate clearly between supervisor and instructor.'],
    },
    {
        'title': 'Why Your First Driving Lessons Should Focus on Observation, Not Just Control',
        'slug': 'why-your-first-driving-lessons-should-focus-on-observation-not-just-control',
        'quick_answer': 'Beginners often want to master clutch, gears and steering first. But observation habits—mirror checks, scanning, blind-spot awareness—are harder to add later. Early lessons that prioritise observation build a safer foundation than those that focus only on vehicle control.',
        'real_answer_paras': ['New learners in Ekurhuleni and surrounding areas are often eager to “get moving”. They want to feel in control of the car: smooth moving off, gear changes, braking and steering. Vehicle control is important. But observation is the backbone of safe driving. Once bad observation habits form, they are difficult to unlearn. Observation includes: Checking mirrors before changing speed or direction Scanning ahead for hazards, signs and signals Blind-spot checks before lane changes and moving off Monitoring intersections, pedestrians and other road users If early lessons focus only on “don’t stall, don’t hit the curb”, learners may develop a tunnelvision style: great control in quiet areas, but poor awareness in traffic. A better approach: Introduce mirrors and scanning from the first lesson Practise observation out loud (“I’m checking my mirror, I’m looking left and right”) Combine control drills with simple observation tasks Gradually increase traffic complexity as observation improves This creates drivers who are not only smooth but aware and anticipatory.'],
        'key_factors': ['Instructor’s emphasis on observation from day one', 'Learner’s willingness to slow down and observe', 'Complexity of roads used in early lessons', 'Consistency of observation practice between lessons'],
        'common_mistakes': ['Focusing only on clutch and gears in early lessons', 'Postponing observation until “later”', 'Practising only on quiet roads with no traffic', 'Treating mirrors as an afterthought instead of a core habit'],
        'expert_tip': 'Ask your instructor: “How are you building my observation skills in the first 5 lessons?” If the answer is vague, consider whether they prioritise long-term safety.',
        'related_fact_topics': ['Did You Know? Learner Drivers Need to Build Observation Before Confidence', 'Did You Know? Your First 10 Hours Shape Your Long-Term Driving Habits'],
        'related_services': ['K53 Driving Lessons', 'Defensive Driving Lessons'],
        'faqs': [{'question': 'Should observation be taught from the first lesson?', 'answer': 'Yes. It’s easier to build good habits early than fix bad ones later.'}, {'question': 'Can I learn control first and observation later?', 'answer': 'You can, but observation habits are harder to add once control feels “automatic”.'}, {'question': 'How do I know if my observation is improving?', 'answer': 'You catch hazards earlier, feel less rushed and make fewer last-minute decisions.'}, {'question': 'Do automatic lessons focus on observation too?', 'answer': 'They should. Observation is independent of transmission type.'}],
        'key_takeaways': ['Observation is harder to learn later than control.', 'Early lessons should integrate mirrors, scanning and blind spots.', 'Good observation reduces last-minute decisions and stress.', 'Ask instructors how they build observation from the start.'],
    },
    {
        'title': 'How to Stay Calm During Your K53 Driving Test (Even If You’re Nervous)',
        'slug': 'how-to-stay-calm-during-your-k53-driving-test-even-if-you-re-nervous',
        'quick_answer': 'Nerves are normal and expected in a K53 test. Examiners are trained to ignore small signs of anxiety and focus on safe driving. Simple techniques—breathing, routine, self-talk and realistic expectations—can help you stay calm enough to show your true ability.',
        'real_answer_paras': ['Most learners in Daveyton, Benoni and Springs feel nervous before their test. Some worry about stalling, others about intersections or the examiner’s silence. Examiners see nervous candidates daily. They are trained to assess your driving, not your confidence level. Shaking hands, a dry mouth or a shaky voice will not fail you; unsafe decisions will. Practical ways to manage nerves: 1. Arrive early, not rushed Give yourself time to settle, use the restroom and breathe before the test. 2. Use a simple pre-drive routine Seat, mirrors, seatbelt, controls, deep breath. This signals to your brain: “I know what I’m doing.” 3. Focus on process, not outcome Instead of “I must pass”, think: “Check mirrors, signal, observe, then move.” 4. Accept imperfection A small stall or correction is not a failure if you handle it safely. 5. Use calm self-talk Replace “I can’t do this” with “I’ve practised this. I’ll take it one step at a time.” Nerves never disappear completely, but they can be managed enough to let your training show.'],
        'key_factors': ['Your preparation and familiarity with test routines', 'Sleep, food and stress levels on test day', 'Mindset (fear-based vs process-focused)', 'Support from your instructor before the test'],
        'common_mistakes': ['Trying to appear “super confident” instead of driving safely', 'Overthinking the examiner’s reactions', 'Rushing the pre-drive setup', 'Catastrophising small mistakes during the test'],
        'expert_tip': 'In your last few lessons, ask your instructor to simulate test conditions with minimal chat, so silence feels normal, not scary.',
        'related_fact_topics': ['Did You Know? Examiners Are Trained to Ignore Small Nerves', 'Did You Know? The First 2 Minutes Set the Tone for Your Test', 'Did You Know? Your Internal Monologue Affects Your Driving Performance'],
        'related_services': ['K53 Driving Lessons', 'Defensive Driving Lessons'],
        'faqs': [{'question': 'Will I fail if I’m very nervous?', 'answer': 'Not for nerves alone. You fail for unsafe decisions, not for feeling anxious.'}, {'question': 'What if I stall because of nerves?', 'answer': 'Recover safely: neutral, restart, observe, then continue. One stall is not automatic failure.'}, {'question': 'Does the examiner expect me to be calm?', 'answer': 'They expect some nerves. They focus on whether you drive safely despite them.'}, {'question': 'Can I ask the examiner to repeat instructions?', 'answer': 'Yes, if you didn’t hear or understand. It’s better to ask than guess.'}],
        'key_takeaways': ['Nerves are normal and expected.', 'Examiners assess driving, not confidence.', 'Simple routines and self-talk help manage anxiety.', 'Small mistakes are survivable if handled safely.'],
    },
    {
        'title': 'When Should You Book Your K53 Test After Getting Your Learner’s Licence?',
        'slug': 'when-should-you-book-your-k53-test-after-getting-your-learner-s-licence',
        'quick_answer': 'Book your K53 test once you can consistently handle busy intersections, lane changes, parking and varied roads safely—not just when your learner’s licence is close to expiry. Early booking can protect your timeline, but readiness matters more than dates.',
        'real_answer_paras': ['Many learners in Ekurhuleni ask: “When should I book my test?” The answer depends less on the calendar and more on skill consistency. Your learner’s licence is valid for 24 months and cannot be extended. This creates pressure to test before it expires. However, booking too early—before you’re truly ready—often leads to: Failed tests and extra costs Increased anxiety and loss of confidence Developing “test-focused” habits instead of safe ones A better approach: 1. Define “ready” in real terms Can you handle: Busy Daveyton or Benoni intersections? Multi-lane roads and lane changes? Different times of day and traffic conditions? Parking in various bays and parallel parking? 2. Use your instructor’s assessment Ask: “If this were a test, would I pass today?” If the answer is “maybe” or “not yet”, you’re not ready. 3. Book with buffer time Once you’re close, book a test date 4–8 weeks out. This gives you a deadline while allowing time to polish weak areas. 4. Protect your learner’s timeline Don’t wait until the last 2–3 months. DLTC slots can be limited, and rescheduling may push you past expiry. Readiness + sensible booking = higher pass rates and less stress.'],
        'key_factors': ['Your consistent performance in varied conditions', 'Instructor’s honest assessment', 'DLTC appointment availability', 'Learner’s licence expiry date'],
        'common_mistakes': ['Booking as soon as you get your learner’s “to be safe”', 'Waiting until the last few months before expiry', 'Ignoring instructor advice about readiness', 'Focusing on the date instead of skill level'],
        'expert_tip': 'Treat the test date as a target, not a guarantee. If you’re clearly not ready as it approaches, discuss postponing with your instructor rather than gambling.',
        'related_fact_topics': ['Did You Know? Booking Early Can Protect Your Learner’s Licence Timeline', 'Did You Know? A Valid Learner’s Licence Is Needed on Test Day'],
        'related_services': ['K53 Driving Lessons', 'Learner’s Licence Preparation'],
        'faqs': [{'question': 'Should I book my test immediately after getting my learner’s?', 'answer': 'Not necessarily. Book when you’re close to ready, with enough time before expiry.'}, {'question': 'How far in advance should I book?', 'answer': 'Typically 4–8 weeks ahead, depending on DLTC availability and your progress.'}, {'question': 'What if I’m not ready by the test date?', 'answer': 'Discuss postponing with your instructor and the DLTC rather than risking a likely fail.'}, {'question': 'Does booking early guarantee I’ll pass?', 'answer': 'No. It protects your timeline but doesn’t replace proper preparation.'}],
        'key_takeaways': ['Readiness matters more than the calendar.', 'Book once you can handle varied conditions consistently.', 'Use the test date as a target, not a fixed deadline.', 'Protect your learner’s licence timeline without rushing unprepared.'],
    },
    {
        'title': 'Why Defensive Driving Lessons Are Worth It After You Pass Your Test',
        'slug': 'why-defensive-driving-lessons-are-worth-it-after-you-pass-your-test',
        'quick_answer': 'Defensive driving lessons teach you to anticipate hazards, manage risk and handle complex conditions that the K53 test doesn’t fully cover. They’re valuable for new licence holders, experienced drivers with bad habits, and anyone who wants to reduce accident risk long-term.',
        'real_answer_paras': ['The K53 test confirms minimum competence. It does not cover: Advanced hazard perception Night and long-distance driving strategies Managing fatigue, distraction and pressure Complex multi-lane and freeway scenarios in depth Defensive driving lessons fill these gaps. They focus on: Seeing hazards earlier (pedestrians, side streets, aggressive drivers) Creating larger safety buffers (following distance, space around your vehicle) Adjusting speed and position for conditions, not just signs Managing your own state: fatigue, emotion, distraction This is useful for: Newly licensed drivers transitioning from learner to independent driving Experienced drivers who realise their habits have become complacent Fleet or work drivers responsible for passengers or valuable cargo Parents wanting to model safer driving for their children In areas like Ekurhuleni, with mixed traffic, pedestrians and varying road conditions, defensive skills directly reduce the likelihood of collisions and near-misses. Some insurers also offer premium discounts for accredited defensive driving courses, which can offset the cost over time.'],
        'key_factors': ['Your current driving experience and habits', 'Types of roads and conditions you regularly face', 'Whether you drive for work or carry passengers frequently', 'Your willingness to challenge existing habits'],
        'common_mistakes': ['Assuming passing the test means you’re “fully trained”', 'Waiting until after an accident to consider defensive training', 'Choosing cheap, unaccredited courses with little practical value', 'Treating defensive driving as “only for trucks or taxis”'],
        'expert_tip': 'Book a defensive course 6–12 months after licensing. By then, you have real-world experience but haven’t fully hardened bad habits yet.',
        'related_fact_topics': ['Did You Know? Defensive Driving Means Expecting the Unexpected', 'Did You Know? Passing the Test Is Not the Same as Being a Safe Driver'],
        'related_services': ['Defensive Driving Lessons', 'K53 Driving Lessons'],
        'faqs': [{'question': 'Do I need defensive driving if I passed K53?', 'answer': 'K53 covers basics; defensive driving adds advanced hazard and risk management.'}, {'question': 'Are defensive lessons only for new drivers?', 'answer': 'No. Experienced drivers often benefit from unlearning bad habits.'}, {'question': 'Can defensive driving reduce insurance costs?', 'answer': 'Some insurers offer discounts for accredited courses; check with your provider.'}, {'question': 'How many defensive lessons should I take?', 'answer': 'A structured course (often 1–2 days or several sessions) is typical; ask providers for details.'}],
        'key_takeaways': ['K53 is a minimum standard; defensive driving goes further.', 'Useful for new and experienced drivers alike.', 'Reduces long-term accident and risk exposure.', 'May offer insurance benefits in some cases.'],
    },
    {
        'title': 'How to Talk to Your Teen About Safe Driving (Without Sounding Like a Lecture)',
        'slug': 'how-to-talk-to-your-teen-about-safe-driving-without-sounding-like-a-lecture',
        'quick_answer': 'Teens respond better to conversations than lectures. Focus on real scenarios, share your own mistakes, involve them in choosing a driving school, and agree on clear rules (phones, passengers, night driving). Frame safety as independence and responsibility, not just restriction.',
        'real_answer_paras': ['For parents in Daveyton, Benoni, Etwatwa and surrounding areas, a teen getting their learner’s licence is a milestone—and a source of anxiety. Traditional “don’t drink and drive, don’t speed, don’t text” lectures often get tuned out. A more effective approach treats the teen as a partner in safety, not just a rule-follower. Practical strategies: 1. Use real stories, not scare tactics Share specific incidents you’ve seen or heard about locally: “Remember that accident near the taxi rank? Let’s talk about what happened there.” 2. Involve them in choosing a driving school Let them sit in on initial discussions with instructors. When they help choose, they’re more invested. 3. Agree on written rules Examples: No phones while driving, ever Limits on passengers in the first 6–12 months Night-driving restrictions unless necessary 4. Model the behaviour you expect If you use your phone while driving, your words lose credibility.', '5. Frame safety as freedom “Following these rules means we trust you to drive more, not less.” The goal is a teen who internalises safe habits, not one who only obeys when watched.'],
        'key_factors': ['Parent’s own driving behaviour', 'Quality of driving school and instructor', 'Clarity and consistency of household driving rules', 'Teen’s personality and risk perception'],
        'common_mistakes': ['Only lecturing, never listening', 'Setting rules you don’t follow yourself', 'Ignoring the influence of peers and social media', 'Treating licensing as the end instead of the start of ongoing guidance'],
        'expert_tip': 'Schedule a family driving meeting before the first lesson: agree on goals, rules and how you’ll review progress after the first 10 hours.',
        'related_fact_topics': ['Did You Know? Your First 10 Hours Shape Your Long-Term Driving Habits', 'Did You Know? Mobile Phones Are a Leading Cause of Accidents'],
        'related_services': ['Learner’s Licence Preparation', 'K53 Driving Lessons'],
        'faqs': [{'question': 'How can I get my teen to take driving seriously?', 'answer': 'Involve them in decisions, use real examples, and avoid pure lecture-style warnings.'}, {'question': 'Should I set strict rules for new drivers?', 'answer': 'Yes, especially around phones, passengers and night driving, but explain the reasons.'}, {'question': 'What if my teen says all their friends drive differently?', 'answer': 'Acknowledge peer pressure, but emphasise that your rules are about their safety, not control.'}, {'question': 'How often should we review their driving?', 'answer': 'Regular check-ins after early lessons, then periodically as they gain independence.'}],
        'key_takeaways': ['Conversations work better than lectures for teens.', 'Involve them in choosing a school and setting rules.', 'Model the safe behaviour you expect.', 'Treat licensing as the start of ongoing guidance, not the end.', 'If you’d like, I can next:', 'Adapt these 12 posts into your CMS format (with meta titles, descriptions, URL slugs and', 'internal links to your existing 175 “Did You Know?” facts), or', 'Generate matching social-media snippets and email newsletter versions for each post, or', 'Create the next batch of 12 blog posts focused on motorcycle training, heavy vehicle', 'licences, and fleet/worker driver safety in Ekurhuleni.', '⁂', '1. https://www.wix.com/blog/blog-format', '2. https://quillbot.com/blog/content-writing/how-to-write-a-blog/', '3. https://bdow.com/stories/blog-post-format/', '4. https://insights.chesly.tech/insights/ask-clyc-construction-ai-search-launch', '5. https://insights.chesly.tech/blog/purchase-order-funding-providers-south-africa', '6. https://www.eesel.ai/blog/how-to-format-a-blog-post', '7. https://alanajadestudio.com/blog/how-to-format-a-blog-post', '8. https://www.madmarketingpro.com/blog/blog-post-formats', '9. https://dev.to/blackgirlbytes/the-ultimate-guide-to-writing-technical-blog-posts-5464'],
    },
]

OUT_FILE = "supabase-lcdkhaya-blog-seed.sql"
START_DATE = date(2026, 8, 30)  # most recent post; each earlier post staggered 5 days back

lines = [
    "-- ============================================================",
    f"-- LCD KHAYA BLOG SEED — {len(POSTS)} starter posts, tag: lcdkhaya",
    "-- Run in Supabase SQL Editor, same as supabase-content-seed.sql",
    "-- ============================================================",
    "",
    "INSERT INTO public.tags (name, slug) VALUES ('lcdkhaya', 'lcdkhaya') ON CONFLICT (slug) DO NOTHING;",
    ""
]

for i, p in enumerate(POSTS):
    published = START_DATE - timedelta(days=i * 5)
    read_time = max(1, round(word_count(p) / 200))
    body = build_body(p)
    excerpt = p["quick_answer"]
    lines.append("DO $$")
    lines.append("DECLARE new_post_id UUID;")
    lines.append("BEGIN")
    lines.append("  INSERT INTO public.posts (")
    lines.append("    title, slug, excerpt, body, author_name, author_slug,")
    lines.append("    status, published_at, read_time")
    lines.append("  ) VALUES (")
    lines.append(f"    {sql_str(p['title'])}, {sql_str(p['slug'])}, {sql_str(excerpt)}, {sql_str(body)},")
    lines.append("    'LCD Khaya Driving School', 'lcd-khaya-driving-school',")
    lines.append(f"    'published', {sql_str(published.isoformat())}::timestamptz, {read_time}")
    lines.append("  )")
    lines.append("  ON CONFLICT (slug) DO NOTHING")
    lines.append("  RETURNING id INTO new_post_id;")
    lines.append("")
    lines.append("  IF new_post_id IS NOT NULL THEN")
    lines.append("    INSERT INTO public.post_tags (post_id, tag_id)")
    lines.append("    SELECT new_post_id, t.id FROM public.tags t WHERE t.slug = 'lcdkhaya'")
    lines.append("    ON CONFLICT DO NOTHING;")
    lines.append("  END IF;")
    lines.append("END $$;")
    lines.append("")

with open(OUT_FILE, "w") as fh:
    fh.write("\n".join(lines))

print(f"Wrote {OUT_FILE} with {len(POSTS)} posts")
