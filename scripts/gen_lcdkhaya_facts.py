#!/usr/bin/env python3
"""
Generates supabase-lcdkhaya-facts-seed.sql from the FACTS list below.
Run once: python3 scripts/gen_lcdkhaya_facts.py
Then paste the output SQL file into Supabase's SQL Editor and run it —
same workflow as supabase-content-seed.sql.

This is batch 1 of LCD Khaya's "Did You Know?" content (24 facts,
category "Driving"). Extend the FACTS list and re-run to add more
batches toward the full 150 described in the master content brief.
"""
import json

OUT_FILE = "supabase-lcdkhaya-facts-seed.sql"

def sql_str(v):
    if v is None:
        return "NULL"
    return "'" + str(v).replace("'", "''") + "'"

def sql_jsonb(v):
    return "'" + json.dumps(v, ensure_ascii=False).replace("'", "''") + "'::jsonb"

FACTS = [
    {
        "slug": "stopping-distance-reaction-time",
        "headline": "Did You Know? Your stopping distance keeps growing even after you've spotted the hazard.",
        "fact_text": "Stopping distance is reaction distance plus braking distance — and reaction distance alone can cover a surprising amount of road.",
        "context": "Most learners think braking starts the moment they see danger, but there's a delay first: the time it takes your brain to process the hazard and your foot to reach the brake. At 60 km/h, an average reaction time of about 1.5 seconds means the car has already travelled roughly 25 metres before the brakes even engage. Add the braking distance on top of that, and total stopping distance is often much longer than drivers expect. This is why following distance matters so much — it's the buffer that covers your reaction time, not just your braking. Fatigue, distraction and alcohol all lengthen reaction time, which is why they're so dangerous even at legal speeds.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "What is the difference between reaction distance and braking distance?", "answer": "Reaction distance is how far your car travels before you physically start braking, from the moment you notice a hazard. Braking distance is how far it travels once the brakes are applied. Stopping distance is the two added together."},
            {"question": "Does speed affect stopping distance?", "answer": "Yes, significantly. Braking distance increases roughly with the square of your speed, so doubling your speed can more than double how far it takes to stop."},
            {"question": "How can a learner improve reaction time?", "answer": "Staying well-rested, avoiding distractions like phones, and constantly scanning the road ahead for potential hazards all help you react sooner rather than later."},
            {"question": "Why does following distance matter if I brake in time?", "answer": "Following distance is your safety margin for exactly this reaction gap — if the car ahead stops suddenly, that gap is what stops you rear-ending them before your brakes even bite."}
        ]
    },
    {
        "slug": "three-second-following-distance",
        "headline": "Did You Know? The 3-second rule works at any speed, not just on the highway.",
        "fact_text": "Counting three seconds between you and the car ahead automatically scales your following distance to your current speed.",
        "context": "The 3-second rule is one of the simplest tools taught in K53 training: pick a fixed point on the road — a sign, a bridge, a pothole — and count the seconds between the car ahead passing it and you reaching the same spot. If it's less than three seconds, you're following too closely. What makes this rule useful is that it automatically adjusts for speed: the faster you're going, the more distance three seconds represents, so you don't need to memorise different following distances for town driving versus highway driving. In poor visibility, rain, or when following a large vehicle that blocks your view ahead, many instructors recommend extending this to four or five seconds.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "How do I measure the 3-second rule while driving?", "answer": "Watch the vehicle ahead pass a fixed point, then count 'one-thousand-one, one-thousand-two, one-thousand-three' — if you reach that same point before you finish counting, you're too close."},
            {"question": "Should the following distance change in the rain?", "answer": "Yes — wet roads reduce tyre grip and increase braking distance, so many instructors recommend doubling your following distance in rain."},
            {"question": "Does the 3-second rule apply in city traffic too?", "answer": "It does, though in slow, stop-start traffic it's often impossible to maintain a full three seconds — the key is closing the gap only when it's genuinely needed, not sitting on the bumper ahead of you."},
            {"question": "Why not just use a fixed distance in metres instead?", "answer": "A fixed distance doesn't scale with speed — the gap that's safe at 40 km/h is far too short at 100 km/h, which is exactly the problem the time-based rule solves."}
        ]
    },
    {
        "slug": "blind-spots-shoulder-check",
        "headline": "Did You Know? Your mirrors can't show you everything — that's what the shoulder check is for.",
        "fact_text": "Every vehicle has blind spots that mirrors alone can't cover, which is why a physical shoulder check before changing lanes is non-negotiable.",
        "context": "Side mirrors are angled to reduce blind spots, but they can't eliminate them entirely — there's almost always a zone just behind and to the side of the vehicle where another car, cyclist or motorcycle can sit invisibly. This is exactly why K53 training insists on a shoulder check (a quick glance over your shoulder) before changing lanes, not just a mirror check. Skipping the shoulder check is one of the most common reasons learners lose marks on the practical test, and it's also a genuine cause of real-world lane-change collisions. The habit only takes a second once it's built in, but it has to become automatic — checking mirrors, then blind spot, then signalling, then moving.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "Why isn't a mirror check enough before changing lanes?", "answer": "Mirrors have a fixed field of view and can't show the zone directly beside and slightly behind your vehicle, where a car or motorcycle can sit completely hidden."},
            {"question": "When exactly should I do a shoulder check?", "answer": "Just before you start moving into the new lane, after you've already checked your mirrors and signalled — it should be the last check before you commit to the manoeuvre."},
            {"question": "Do motorcycles have bigger blind-spot risks?", "answer": "Motorcycles are smaller and easier to lose in a car's blind spot, which is one reason riders are advised to avoid lingering in other vehicles' blind spots."},
            {"question": "Is skipping the shoulder check a common test mistake?", "answer": "Yes, it's one of the most frequently penalised observation errors in the K53 practical test, even among learners who otherwise drive well."}
        ]
    },
    {
        "slug": "wet-roads-braking-distance",
        "headline": "Did You Know? Wet roads can nearly double your braking distance.",
        "fact_text": "Rain reduces tyre grip enough that braking distances can increase dramatically compared to a dry road at the same speed.",
        "context": "Water on the road creates a thin film between your tyres and the tar, reducing the friction your brakes rely on to slow the car down. Depending on tyre condition and road surface, braking distance on a wet road can be significantly longer than on a dry one at the same speed — and in the first few minutes of rain, roads can be even more slippery as oil and dust rise to the surface before being washed away. This is why defensive driving recommends easing off the accelerator earlier, increasing following distance, and braking more gently and progressively in wet conditions rather than relying on hard, late braking the way you might on a dry road.",
        "source_name": "Arrive Alive Road Safety Initiative",
        "source_url": None,
        "faq": [
            {"question": "Why are the first few minutes of rain the most dangerous?", "answer": "Light rain lifts oil, dust and rubber residue off the road surface before washing it away, creating an especially slippery film until heavier rain rinses it clean."},
            {"question": "Should I brake differently in the rain?", "answer": "Yes — brake earlier and more gently rather than late and hard, since a wet road gives your tyres far less grip to work with."},
            {"question": "Do worn tyres make wet-weather driving more dangerous?", "answer": "Significantly so — tyre tread channels water away from the contact patch, and worn tread can't do this effectively, increasing the risk of aquaplaning."},
            {"question": "How much extra following distance should I leave in the rain?", "answer": "Many instructors recommend at least doubling your normal following distance in wet conditions to account for the longer braking distance."}
        ]
    },
    {
        "slug": "tyre-tread-and-safety",
        "headline": "Did You Know? Your tyres are the only part of the car actually touching the road.",
        "fact_text": "Every braking, steering and accelerating decision you make ultimately depends on a contact patch about the size of your hand, on each tyre.",
        "context": "It's easy to think of safe driving purely in terms of skill and judgement, but all of that is delivered to the road through your tyres. Tread patterns exist to channel water away and maintain grip; when tread wears down, that grip — especially in the wet — drops sharply, and stopping distances increase. Tyre pressure matters too: under-inflated tyres wear unevenly and can overheat, while over-inflated tyres reduce the size of the contact patch and can make the car feel less stable in corners. A simple visual and pressure check before a long trip, and paying attention to tread wear indicators built into most tyres, is one of the cheapest ways to reduce driving risk.",
        "source_name": "Arrive Alive Road Safety Initiative",
        "source_url": None,
        "faq": [
            {"question": "How can I tell if my tyre tread is too worn?", "answer": "Most tyres have built-in tread wear indicator bars — small raised bars in the grooves that become flush with the tread surface once it's worn down to the legal minimum."},
            {"question": "Does tyre pressure really affect handling?", "answer": "Yes — incorrect pressure changes the size and shape of the tyre's contact patch with the road, affecting grip, braking distance and even fuel consumption."},
            {"question": "How often should I check my tyres?", "answer": "A quick visual and pressure check monthly, and always before a long trip, is a reasonable habit for most drivers."},
            {"question": "Are worn tyres more dangerous in the rain than on a dry road?", "answer": "Considerably — tread is what channels water out from under the tyre, so worn tread loses effectiveness in the wet far more than it does on a dry surface."}
        ]
    },
    {
        "slug": "night-driving-glare-visibility",
        "headline": "Did You Know? Your eyes can take several seconds to recover from oncoming headlight glare.",
        "fact_text": "Bright oncoming headlights can temporarily impair your night vision, which is why where you look matters as much as how bright the lights are.",
        "context": "At night, your eyes adjust to low light by dilating your pupils — but a sudden bright light, like oncoming high beams, can overwhelm that adjustment and leave you seeing poorly for a few seconds afterwards. Defensive drivers deal with this by shifting their gaze slightly toward the left edge of their own lane when an oncoming vehicle's lights are glaring, rather than staring directly at the approaching headlights, which helps preserve enough vision to stay in lane. It's also worth remembering that pedestrians and cyclists are far harder to see at night, so reducing speed and increasing following distance after dark gives you more time to react to hazards you may only notice at the last moment.",
        "source_name": "Arrive Alive Road Safety Initiative",
        "source_url": None,
        "faq": [
            {"question": "Why do oncoming headlights affect my vision so much?", "answer": "Your eyes adapt to low-light conditions by dilating, and a sudden bright light overwhelms that adaptation temporarily, reducing your ability to see clearly for a few seconds."},
            {"question": "Where should I look when a car with bright lights approaches?", "answer": "Shift your gaze slightly toward the left edge of your own lane rather than looking directly at the oncoming lights, to help maintain your lane position without being blinded."},
            {"question": "Should I drive slower at night even on a familiar road?", "answer": "Yes — reduced visibility means hazards like pedestrians, animals or stationary vehicles are harder to spot in time, so a lower speed gives you more reaction room."},
            {"question": "Do clean headlights and windscreens make a real difference at night?", "answer": "Yes — dirty or hazy headlights and windscreens scatter light and reduce clarity, which can meaningfully worsen glare and reduce how far you can see."}
        ]
    },
    {
        "slug": "driver-fatigue-microsleeps",
        "headline": "Did You Know? A \"microsleep\" can last just a few seconds — long enough to be dangerous at speed.",
        "fact_text": "Fatigue doesn't always mean falling fully asleep; brief involuntary microsleeps of just a few seconds are enough to lose full control of a vehicle.",
        "context": "A microsleep is a very short, involuntary lapse into sleep, often lasting only a few seconds, that a fatigued person may not even be aware of afterwards. At highway speed, even a two- or three-second microsleep means travelling a considerable distance with no one actively steering or watching the road. Warning signs of driver fatigue include frequent yawning, heavy eyelids, drifting within your lane, and difficulty remembering the last few kilometres driven. The only reliable fix is rest — stopping to sleep, not just opening a window or turning up the radio, both of which offer only temporary and unreliable relief. Planning realistic rest stops on long trips is a genuine road-safety measure, not just a comfort choice.",
        "source_name": "Arrive Alive Road Safety Initiative",
        "source_url": None,
        "faq": [
            {"question": "What are early warning signs of driver fatigue?", "answer": "Frequent yawning, heavy or drooping eyelids, drifting out of your lane, and not remembering the last stretch of road you drove are all common early signs."},
            {"question": "Does opening a window or playing loud music prevent fatigue?", "answer": "These can offer brief, unreliable relief at best — they don't address the underlying need for sleep and shouldn't be relied on for long trips."},
            {"question": "How long is a microsleep?", "answer": "A microsleep typically lasts a few seconds, but that's enough time to travel a significant distance unsupervised at highway speed."},
            {"question": "What's the safest response to feeling fatigued while driving?", "answer": "Find a safe place to stop and actually sleep, even briefly — it's the only response that reliably restores alertness."}
        ]
    },
    {
        "slug": "distracted-driving-mobile-phones",
        "headline": "Did You Know? Glancing at your phone for five seconds at highway speed can mean travelling the length of a rugby field blind.",
        "fact_text": "Even a brief glance at a phone screen takes your eyes off the road for long enough to cover a significant distance without watching where you're going.",
        "context": "At 100 km/h, a car covers roughly 28 metres every second — so a five-second glance down at a phone means travelling well over a hundred metres without any eyes on the road. Distraction doesn't have to be visual, either: even hands-free conversations can pull cognitive attention away from driving, a phenomenon researchers call \"inattention blindness,\" where a driver can look directly at a hazard and still fail to consciously register it because their mind is elsewhere. Texting is particularly dangerous because it combines visual, manual and cognitive distraction all at once. The safest practice remains simple: phones out of reach or on silent while driving, with calls and messages left until you've safely stopped.",
        "source_name": "National Road Traffic Act 93 of 1996",
        "source_url": None,
        "faq": [
            {"question": "Is it legal to use a phone while driving in South Africa?", "answer": "Using a handheld phone while driving is prohibited under South African road traffic law — check current regulations for hands-free requirements, as rules can be updated."},
            {"question": "Are hands-free calls completely safe?", "answer": "They remove the physical handling risk, but research shows conversations can still cause cognitive distraction that reduces a driver's awareness of the road."},
            {"question": "What is 'inattention blindness'?", "answer": "It's when a driver's eyes are on the road but their attention is elsewhere, causing them to fail to consciously process a hazard even though they looked directly at it."},
            {"question": "What's a practical way to avoid phone distraction while driving?", "answer": "Put your phone on silent or do-not-disturb and out of easy reach before you start driving, so there's no temptation to glance at it."}
        ]
    },
    {
        "slug": "what-is-a-learners-licence",
        "headline": "Did You Know? A learner's licence tests your knowledge of the rules before you're ever tested on driving itself.",
        "fact_text": "The learner's licence is a theory test covering road signs, rules of the road and vehicle controls — it comes before any practical driving test.",
        "context": "Before anyone can book a practical driving test in South Africa, they first need to pass a learner's licence test, which is a theory-based assessment. It typically covers three broad areas: road signs and what they mean, the rules of the road (like right of way and speed limits), and general vehicle controls and safety knowledge. The idea is straightforward — you shouldn't be practising on public roads until you understand the rules that govern them. Many learners underestimate this stage and don't study seriously, then struggle with unfamiliar signs or scenarios on the day. Treating the learner's test as genuine preparation for real driving, rather than a formality to get past, tends to produce noticeably better and safer drivers later.",
        "source_name": "National Road Traffic Act 93 of 1996",
        "source_url": None,
        "faq": [
            {"question": "What does the learner's licence test actually cover?", "answer": "It generally covers road signs, the rules of the road, and knowledge of basic vehicle controls and safety requirements."},
            {"question": "Can I drive on my own once I have a learner's licence?", "answer": "No — a learner's licence permits driving only under specific supervision conditions; check current requirements with your local licensing department."},
            {"question": "How should I prepare for the learner's licence test?", "answer": "Studying official road sign charts and the rules of the road thoroughly, and practising with sample questions, is the most effective preparation."},
            {"question": "Is the learner's licence test the same for all vehicle categories?", "answer": "The core rules-of-the-road knowledge overlaps, but there are category-specific elements depending on whether you're learning for a motorcycle, light vehicle or heavier vehicle licence."}
        ]
    },
    {
        "slug": "supervising-driver-requirements",
        "headline": "Did You Know? Who sits next to you while you practise matters just as much as how much you practise.",
        "fact_text": "Learner drivers are required to be accompanied by a supervising licensed driver, not just any passenger, while practising on public roads.",
        "context": "A learner's licence typically comes with a condition that the learner must be accompanied by a supervising driver who holds a valid driving licence for that vehicle category — this isn't just a formality, since an inexperienced supervisor can reinforce bad habits or fail to intervene when it matters. A good supervising driver actively watches the road ahead, anticipates hazards, and calmly talks the learner through decisions rather than only reacting after something goes wrong. Learners who practise regularly with a patient, experienced supervisor in varied conditions — quiet streets, busier roads, different weather — tend to arrive at their practical test far more confident than those who only practise occasionally in easy conditions.",
        "source_name": "National Road Traffic Act 93 of 1996",
        "source_url": None,
        "faq": [
            {"question": "Does the supervising driver need a specific type of licence?", "answer": "Generally, the supervisor needs a valid licence for the same category of vehicle the learner is practising in — check current requirements with your local licensing department."},
            {"question": "Why does the supervisor's experience matter?", "answer": "An inexperienced or inattentive supervisor may not catch small mistakes early, or may model habits that aren't actually safe, undermining the learner's progress."},
            {"question": "Should learners practise in more than one type of condition?", "answer": "Yes — practising in varied traffic, weather and road types builds much more real confidence than only driving in easy, familiar conditions."},
            {"question": "What should a good supervising driver actually do during a lesson?", "answer": "Stay alert to the road ahead, anticipate hazards early, and give calm, clear guidance rather than sudden or panicked instructions."}
        ]
    },
    {
        "slug": "what-does-k53-mean",
        "headline": "Did You Know? K53 isn't a licence code — it's the name of South Africa's driver-testing and training system.",
        "fact_text": "K53 refers to the structured system used to teach and test driving skills in South Africa, not a category or level of licence.",
        "context": "New learners sometimes assume \"K53\" is a type of licence or a difficulty rating, but it's actually the name of the standardised system South Africa uses for driver training and testing, built around structured observation, vehicle control and defensive driving principles. The system emphasises habits like mirror checks, shoulder checks, correct signalling and controlled manoeuvres, precisely because these are the behaviours that reduce real-world crash risk, not just skills needed to pass a test. Because it's a structured system rather than a single event, learners benefit most from practising the same habits — observation, control, signalling — consistently every time they drive, rather than only sharpening them right before a test.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "Is K53 a type of driving licence?", "answer": "No — K53 is the name of the training and testing system used in South Africa, not a licence category or grade."},
            {"question": "What is K53 actually designed to teach?", "answer": "It's built around structured observation, vehicle control and defensive driving habits intended to reduce real-world crash risk, not just to pass a test."},
            {"question": "Why do instructors emphasise the same checks repeatedly?", "answer": "Because K53's core habits — mirror checks, shoulder checks, signalling — are meant to become automatic, which only happens with consistent repetition."},
            {"question": "Does K53 only apply to the practical test?", "answer": "The principles behind K53 are meant to carry into everyday driving long after the test is passed, not just apply on test day."}
        ]
    },
    {
        "slug": "observation-mirror-checks-k53",
        "headline": "Did You Know? Observation errors are one of the most common reasons learners lose marks on the K53 test.",
        "fact_text": "Forgetting a mirror check or shoulder check before a manoeuvre is a frequent, avoidable mistake on the practical driving test.",
        "context": "The K53 practical test places heavy weight on observation — checking mirrors, checking blind spots, and looking properly before moving off, changing lanes, turning or stopping. It's easy to understand why these checks matter, and still forget them in the moment, especially under the pressure of a test. Examiners are trained to watch specifically for these checks, sometimes more than for the smoothness of the manoeuvre itself, because in real driving, observation is what actually prevents collisions with vehicles, cyclists or pedestrians you might otherwise miss. Building a consistent routine before every manoeuvre — mirror, blind spot, signal, then act — during ordinary practice sessions, not just before a test, is the most reliable way to make these checks automatic.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "Why do observation checks carry so much weight in K53 testing?", "answer": "Because in real-world driving, proper observation is what actually prevents collisions — testing it heavily reflects its real safety importance, not just an arbitrary rule."},
            {"question": "What's a reliable routine for observation checks?", "answer": "A consistent sequence — mirror check, blind-spot check, signal, then manoeuvre — practised every single time builds the habit far more effectively than only remembering it occasionally."},
            {"question": "Can nerves on test day cause learners to forget observation checks?", "answer": "Yes, this is common — which is why practising the routine until it's automatic, rather than something you have to consciously remember, matters so much."},
            {"question": "Do observation mistakes only matter during lane changes?", "answer": "No — they matter before moving off, turning, stopping, and reversing as well, essentially any time the vehicle's position or direction is about to change."}
        ]
    },
    {
        "slug": "emergency-stop-technique",
        "headline": "Did You Know? A controlled emergency stop is about braking firmly without losing control, not just stopping fast.",
        "fact_text": "The emergency stop tests a driver's ability to brake firmly and safely, keeping the vehicle stable rather than skidding or swerving.",
        "context": "An emergency stop in driver training isn't simply about how quickly you can stop — it's about applying firm, controlled braking while keeping the vehicle stable and pointed in the right direction. Braking too hard and unevenly can lock wheels or cause a skid, especially on vehicles without advanced braking assistance, while braking too gently defeats the point of an emergency stop entirely. Learners are usually taught to keep both hands firmly on the wheel, apply steady and progressive brake pressure, and avoid unnecessary steering movements while stopping. Practising this manoeuvre in a controlled, safe environment — not for the first time on a busy road — builds the muscle memory needed to react correctly if a real emergency ever happens.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "What's the difference between an emergency stop and normal braking?", "answer": "An emergency stop requires a much firmer, immediate brake application in response to a sudden hazard, while still keeping the vehicle stable, rather than the gradual braking used in normal driving."},
            {"question": "Why is steering control important during an emergency stop?", "answer": "Unnecessary steering movements while braking hard can unbalance the vehicle or send it off its intended path, so keeping the wheel steady is part of doing it safely."},
            {"question": "Should learners practise emergency stops before their test?", "answer": "Yes, ideally in a safe, controlled environment with an instructor, so the technique becomes familiar rather than something attempted for the first time under real pressure."},
            {"question": "Does an emergency stop feel different on wet roads?", "answer": "Yes — reduced grip on wet roads means the vehicle takes longer to stop and is more prone to skidding, so braking needs to be even more controlled and progressive."}
        ]
    },
    {
        "slug": "parallel-parking-technique",
        "headline": "Did You Know? Parallel parking is less about steering speed and more about reference points.",
        "fact_text": "Successful parallel parking relies on consistent reference points and slow, controlled steering rather than quick reactions.",
        "context": "Many learners tense up at the idea of parallel parking, expecting it to require fast reflexes, when it's actually the opposite — slow, deliberate movement gives you time to check your position and correct it. Instructors teach the manoeuvre using consistent reference points, such as aligning your mirror with the rear corner of the vehicle you're parking next to, which gives a repeatable starting point for the turn rather than guessing. Because the manoeuvre happens at very low speed, there's usually time to stop, check your position through the mirrors and windows, and adjust before continuing, rather than committing to one continuous motion. Practising with the same reference points every time builds a feel for the car's turning circle that eventually makes the manoeuvre far less intimidating.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "Why do instructors teach parallel parking using reference points?", "answer": "Reference points give a repeatable, learnable starting position for the manoeuvre, instead of relying on guesswork that changes every time."},
            {"question": "Is parallel parking supposed to be done quickly?", "answer": "No — it should be done slowly and deliberately, which gives you time to check your position and correct your steering before continuing."},
            {"question": "Can I stop and adjust halfway through parallel parking?", "answer": "Generally yes, in real-world driving — the low speed of the manoeuvre means you usually have time to pause, check your position and correct it."},
            {"question": "What's a common mistake learners make when parallel parking?", "answer": "Turning the wheel too early or too late relative to their reference point, which throws off the whole angle of the manoeuvre from the start."}
        ]
    },
    {
        "slug": "hill-start-technique",
        "headline": "Did You Know? A hill start done badly can mean rolling backwards before you mean to move at all.",
        "fact_text": "Hill starts require coordinating the clutch, accelerator and handbrake precisely to avoid rolling back or stalling.",
        "context": "Starting from a stop on an incline adds a real challenge beyond flat-ground driving: gravity is actively pulling the car backwards while you try to move forward. In a manual vehicle, this typically means finding the clutch's biting point, adding a little more accelerator than usual, and releasing the handbrake at just the right moment so the car moves forward instead of rolling back or stalling. Some vehicles include hill-start assist, which briefly holds the brakes after you release the pedal to give you time to accelerate — but even with this assistance, understanding the manual technique matters, since not every vehicle a learner drives will have it. Practising hill starts on a range of gradients, from gentle slopes to steeper hills, builds the confidence to handle them smoothly wherever they come up.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "Why is a hill start harder than starting on flat ground?", "answer": "Gravity pulls the car backwards on an incline, so you need to coordinate the clutch, accelerator and handbrake carefully to move forward without rolling back or stalling."},
            {"question": "What is hill-start assist?", "answer": "It's a feature in some vehicles that briefly holds the brakes after you release the pedal on an incline, giving you a moment to apply the accelerator before the car can roll back."},
            {"question": "Should learners still practise manual hill starts if their car has hill-start assist?", "answer": "Yes — not every vehicle they may drive in future will have the feature, so understanding the manual technique remains valuable."},
            {"question": "What's a common hill-start mistake?", "answer": "Releasing the handbrake too early, before enough clutch and accelerator are applied, which causes the car to roll backwards."}
        ]
    },
    {
        "slug": "clutch-biting-point-manual",
        "headline": "Did You Know? Finding the \"biting point\" is the single skill that makes manual driving click.",
        "fact_text": "The clutch's biting point — where it starts to engage the engine with the wheels — is the foundation of smooth manual driving.",
        "context": "In a manual vehicle, the clutch's biting point is the specific position, somewhere in the pedal's travel, where the clutch plates begin to make contact and start transferring power from the engine to the wheels. Finding it consistently is what separates smooth pull-aways from stalling or jerky starts. Every vehicle's biting point sits slightly differently, and even the same vehicle can feel different when the clutch wears over time, which is why experienced drivers develop a feel for it in each car they drive rather than relying purely on memory. Learners often stall repeatedly at first simply because they release the clutch too far past the biting point before adding enough accelerator — with practice, this becomes an almost unconscious coordination between both feet.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "What exactly is the clutch biting point?", "answer": "It's the point in the clutch pedal's travel where the clutch plates start to engage, beginning to transfer power from the engine to the wheels."},
            {"question": "Why do learners stall so often when starting out?", "answer": "Usually because they release the clutch too quickly past the biting point without enough accelerator to compensate, causing the engine to lose power and stall."},
            {"question": "Does the biting point stay the same in every car?", "answer": "No — it varies between vehicles and can shift slightly as a clutch wears, so drivers need to feel for it in each car rather than assuming it's identical everywhere."},
            {"question": "How can a learner practise finding the biting point safely?", "answer": "Practising slow, controlled pull-aways on a flat, quiet stretch of road, focusing purely on the clutch-and-accelerator coordination, helps build the feel without other pressures."}
        ]
    },
    {
        "slug": "engine-braking-downhill-manual",
        "headline": "Did You Know? Selecting a lower gear downhill can save your brakes on a long descent.",
        "fact_text": "Engine braking — using a lower gear to slow the car naturally — reduces strain on your brakes during long or steep descents.",
        "context": "On a long downhill stretch, relying purely on the brakes can cause them to overheat, reducing their effectiveness right when you need them most — a phenomenon sometimes called brake fade. Selecting a lower gear allows the engine's natural resistance to help slow the vehicle, reducing how much work the brakes alone have to do. This technique, known as engine braking, is particularly useful on long mountain passes or steep hills where sustained braking would otherwise be needed. It doesn't replace the brakes entirely, but it works alongside them, letting you use light, controlled braking on top of the engine's resistance rather than heavy continuous braking that risks overheating.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "What is brake fade?", "answer": "It's a reduction in braking effectiveness caused by the brakes overheating from prolonged or repeated hard use, most commonly on long downhill descents."},
            {"question": "How does engine braking help on a downhill?", "answer": "Selecting a lower gear increases engine resistance, which helps slow the car naturally, reducing how much the brakes alone need to do."},
            {"question": "Does engine braking mean I don't need to use my brakes at all?", "answer": "No — it works alongside light, controlled braking, reducing the load on the brakes rather than eliminating the need for them entirely."},
            {"question": "Is engine braking only useful on steep mountain passes?", "answer": "It's most noticeable there, but the same principle applies on any sustained downhill where continuous heavy braking would otherwise be needed."}
        ]
    },
    {
        "slug": "automatic-gear-basics-prnd",
        "headline": "Did You Know? \"D\" doesn't mean the car only has one forward gear.",
        "fact_text": "An automatic gearbox in \"Drive\" still shifts through multiple gears on its own — the driver just isn't doing it manually.",
        "context": "New drivers sometimes assume an automatic car in \"Drive\" is somehow simpler mechanically than a manual, with just one gear doing everything — but the transmission is actually shifting through multiple gears automatically based on speed and engine load, exactly as a manual driver would with a gear lever. The main letters — Park, Reverse, Neutral and Drive — control which broad mode the transmission is in, while the automatic system handles the rest. Understanding what each position actually does still matters: Park locks the transmission and should only be selected when fully stopped, Neutral disengages drive entirely, and Reverse should only ever be selected from a stop. Treating these positions carelessly, like shifting into Park while still moving, can cause real mechanical damage.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "Does an automatic car really change gears on its own in Drive?", "answer": "Yes — it shifts through multiple gears automatically as speed and load change, the driver simply doesn't operate a gear lever to do it."},
            {"question": "Is it safe to shift into Park while the car is still moving?", "answer": "No — Park should only be selected once the vehicle has come to a complete stop, as engaging it while moving can cause serious mechanical damage."},
            {"question": "What does Neutral do in an automatic car?", "answer": "It disengages the transmission from the wheels entirely, meaning the car won't move under engine power even if you press the accelerator."},
            {"question": "Can I shift into Reverse while the car is still rolling forward?", "answer": "No — Reverse should only be selected once the vehicle is completely stopped, for the same mechanical-damage reasons as shifting into Park while moving."}
        ]
    },
    {
        "slug": "automatic-creep-and-braking",
        "headline": "Did You Know? Automatic cars can creep forward even with your foot off the accelerator.",
        "fact_text": "Automatic vehicles naturally roll forward at idle when in Drive, which is why learners must actively hold the brake at a stop.",
        "context": "One of the first things new automatic drivers notice is \"creep\" — the tendency of an automatic car in Drive to roll forward slowly at idle, even with no pressure on the accelerator, caused by the torque converter transmitting a small amount of engine power to the wheels. This means you can't simply take your foot off the pedals at a stop the way you might briefly in a manual with the clutch fully engaged in neutral; the brake pedal needs to be actively held down. Creep can actually be useful in slow, stop-start traffic, allowing very gentle forward movement without touching the accelerator at all, but it becomes a hazard if a driver isn't aware of it and lets the car drift forward unintentionally at a stop sign or in a parking situation.",
        "source_name": "K53 Defensive Driving Manual",
        "source_url": None,
        "faq": [
            {"question": "What causes creep in an automatic car?", "answer": "The torque converter transmits a small amount of engine power to the wheels even at idle, causing the car to roll forward gently in Drive unless the brake is held."},
            {"question": "Is creep dangerous?", "answer": "It can be if a driver isn't holding the brake at a stop and doesn't realise the car is slowly rolling forward, particularly in traffic or near pedestrians."},
            {"question": "Can creep be useful?", "answer": "Yes — in very slow, stop-start traffic it allows gentle forward movement without touching the accelerator, giving smoother, more controlled progress."},
            {"question": "Do all automatic cars creep the same amount?", "answer": "The exact amount varies between vehicles and transmission types, but the underlying behaviour is common to most conventional torque-converter automatics."}
        ]
    },
    {
        "slug": "motorcycle-visibility-gear",
        "headline": "Did You Know? A motorcycle can disappear into a car's blind spot far more easily than another car can.",
        "fact_text": "A motorcycle's narrow profile makes it easy for other drivers to miss, which is why riders are taught to actively manage their visibility.",
        "context": "Because motorcycles are so much narrower than cars, they can sit entirely within another vehicle's blind spot, or blend into a cluttered background, in a way a full-sized car rarely does. This is why defensive riding places such emphasis on positioning — riders are taught to avoid lingering in other vehicles' blind spots, to use lane position to maximise their visibility to drivers ahead, and to assume other road users simply haven't seen them until proven otherwise. Bright or reflective riding gear, and a headlight left on even during the day, both meaningfully improve how easily a rider is noticed. None of this replaces other drivers' responsibility to check properly, but riders who actively manage their own visibility measurably reduce their risk.",
        "source_name": "Arrive Alive Road Safety Initiative",
        "source_url": None,
        "faq": [
            {"question": "Why are motorcycles harder for drivers to see than cars?", "answer": "Their narrow profile means they can fit entirely within a blind spot or blend into background clutter far more easily than a full-sized vehicle."},
            {"question": "Does riding gear colour actually make a difference?", "answer": "Bright or reflective gear improves contrast against the road environment, making a rider meaningfully easier for other drivers to notice."},
            {"question": "Should motorcyclists ride with headlights on during the day?", "answer": "Many riders and safety programmes recommend it, since a lit headlight improves visibility to oncoming and crossing traffic even in daylight."},
            {"question": "What's the safest assumption for a motorcyclist to make about other drivers?", "answer": "That other drivers may not have seen them at all, which encourages proactive positioning and readiness to react, rather than assuming right of way will be respected."}
        ]
    },
    {
        "slug": "motorcycle-cornering-basics",
        "headline": "Did You Know? Looking through a corner, not at it, helps a motorcycle turn more smoothly.",
        "fact_text": "Where a rider looks strongly influences how the motorcycle turns, which is why instructors teach looking through the corner toward the exit.",
        "context": "On a motorcycle, the direction of a rider's gaze has a real physical effect on the bike's line through a corner — riders are taught to look through the turn toward where they want to exit, rather than fixating on the corner itself or, worse, on a hazard they're trying to avoid. This connects to a well-known phenomenon called \"target fixation,\" where riders who stare at an obstacle can unconsciously steer toward it. Combined with smooth, progressive braking before the turn rather than during it, and steady, controlled throttle through the corner, this looking technique helps produce a stable, predictable line rather than a wobbly or panicked one. It's a skill best built up gradually on quiet roads before it's needed on a tighter or faster corner.",
        "source_name": "Arrive Alive Road Safety Initiative",
        "source_url": None,
        "faq": [
            {"question": "What is target fixation on a motorcycle?", "answer": "It's the tendency to unconsciously steer toward whatever you're staring at — which is dangerous if a rider fixates on an obstacle instead of their intended path."},
            {"question": "Where should a rider look while going through a corner?", "answer": "Through the corner, toward the exit point, rather than down at the road immediately in front of the bike or at the apex itself."},
            {"question": "Should braking happen during a corner or before it?", "answer": "Generally before the corner — braking mid-turn can upset the bike's balance, so smooth braking beforehand and steady throttle through the turn is the safer technique."},
            {"question": "Is cornering technique something riders can practise safely?", "answer": "Yes — building the habit gradually on quiet, familiar roads before attempting tighter or faster corners is the recommended approach."}
        ]
    },
    {
        "slug": "four-way-stop-right-of-way",
        "headline": "Did You Know? At a four-way stop, arrival order decides who goes first — not vehicle size.",
        "fact_text": "The basic rule at an uncontrolled four-way stop is first to arrive, first to go — with a few extra rules for a tie.",
        "context": "At an intersection controlled by stop signs on all four approaches, the general principle is that the vehicle which arrives and stops first has the right of way to proceed first. When two vehicles arrive at roughly the same time, the usual rule is that the vehicle on the right is given way to by the vehicle on the left. Confusion at these intersections is common precisely because drivers hesitate, unsure who should move, which can be more dangerous than a clear, confident (but correct) decision. Larger vehicles have no special priority under this rule — a truck arriving second still waits for a smaller car that arrived first. Clear communication through steady, predictable movement, rather than waving other drivers through, tends to keep these intersections moving safely.",
        "source_name": "National Road Traffic Act 93 of 1996",
        "source_url": None,
        "faq": [
            {"question": "Who has right of way at a four-way stop if everyone stops at the same time?", "answer": "As a general rule, the vehicle to the right is given way to by the vehicle on its left — check specific local regulations for any variations."},
            {"question": "Does a bigger vehicle get priority at a four-way stop?", "answer": "No — vehicle size doesn't affect right of way; arrival order and position relative to other vehicles are what matter."},
            {"question": "Why do drivers sometimes hesitate at four-way stops?", "answer": "Uncertainty about who arrived first or who has right of way causes hesitation, which itself can create confusion or minor collisions if handled unpredictably."},
            {"question": "Is it safer to wave another driver through at a four-way stop?", "answer": "Generally no — following the standard right-of-way rules predictably is safer than informal hand signals, which other drivers may misinterpret."}
        ]
    },
    {
        "slug": "solid-yellow-line-overtaking",
        "headline": "Did You Know? A solid yellow line isn't just a suggestion — it marks where overtaking becomes genuinely dangerous.",
        "fact_text": "Solid yellow line markings indicate a section of road where limited visibility or other hazards make overtaking unsafe.",
        "context": "Road markings like a solid yellow (or white, depending on the road) line down the centre of the road aren't arbitrary — they're placed on sections where road authorities have identified limited sightlines, such as a blind rise or a tight bend, making it genuinely unsafe to see far enough ahead to overtake safely. Crossing a solid line to overtake removes your ability to judge whether an oncoming vehicle is hidden just beyond your sightline, which is exactly the scenario these markings are designed to prevent. Understanding the reasoning behind road markings, rather than just memorising them as rules, tends to make drivers far more likely to actually respect them in situations where the temptation to overtake is strong.",
        "source_name": "National Road Traffic Act 93 of 1996",
        "source_url": None,
        "faq": [
            {"question": "Why are solid line markings placed on certain sections of road?", "answer": "They mark sections where limited visibility, such as a blind rise or sharp bend, makes it unsafe to judge whether overtaking is genuinely clear."},
            {"question": "Is it ever acceptable to cross a solid line to overtake?", "answer": "As a general road rule, no — the marking exists specifically because visibility isn't sufficient to safely judge oncoming traffic on that stretch."},
            {"question": "What's the risk of overtaking on a blind rise?", "answer": "You can't see whether a vehicle is approaching from the other direction just beyond the rise, making a head-on collision a real risk if you commit to overtaking."},
            {"question": "Do road markings differ from one road to another?", "answer": "Yes — markings are placed based on the specific visibility and hazard conditions of that stretch, which is why the same road can switch between solid and broken lines."}
        ]
    },
]

sql_lines = [
    "-- ============================================================",
    f"-- LCD KHAYA \"DID YOU KNOW?\" FACTS SEED — batch 1 ({len(FACTS)} facts)",
    "-- category: Driving",
    "-- Run in Supabase SQL Editor, same as supabase-content-seed.sql",
    "-- ============================================================",
    ""
]

for f in FACTS:
    sql_lines.append(
        "INSERT INTO public.facts (slug, headline, fact_text, context, source_name, source_url, category, faq, status) VALUES (\n"
        f"  {sql_str(f['slug'])},\n"
        f"  {sql_str(f['headline'])},\n"
        f"  {sql_str(f['fact_text'])},\n"
        f"  {sql_str(f['context'])},\n"
        f"  {sql_str(f['source_name'])},\n"
        f"  {sql_str(f['source_url'])},\n"
        f"  {sql_str('Driving')},\n"
        f"  {sql_jsonb(f['faq'])},\n"
        f"  {sql_str('published')}\n"
        ") ON CONFLICT (slug) DO NOTHING;\n"
    )

with open(OUT_FILE, "w") as fh:
    fh.write("\n".join(sql_lines))

print(f"Wrote {OUT_FILE} with {len(FACTS)} facts")
