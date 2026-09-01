#!/usr/bin/env python3
"""
Generates supabase-lcdkhaya-facts-seed-batch3.sql from the FACTS list below.
Run once: python3 scripts/gen_lcdkhaya_facts_batch3.py
Then paste the output SQL file into Supabase's SQL Editor and run it —
same workflow as supabase-content-seed.sql and the earlier
lcdkhaya facts batches.

Batch 3 of LCD Khaya's "Did You Know?" content: LCD-DYK-101 to
LCD-DYK-150 (50 facts) from the client-provided research batches,
covering South African Road Rules, K53 parking/test detail, and
Automatic Vehicles. Facts 076-100 have not been provided yet — this
batch picks up where batch 2 (026-075) left off, skipping that gap
intentionally rather than inventing content for it.
"""
import json

OUT_FILE = "supabase-lcdkhaya-facts-seed-batch3.sql"

def sql_str(v):
    if v is None:
        return "NULL"
    return "'" + str(v).replace("'", "''") + "'"

def sql_jsonb(v):
    return "'" + json.dumps(v, ensure_ascii=False).replace("'", "''") + "'::jsonb"

FACTS = [
    {
        'slug': 'overtaking-rules-south-africa-safe-passing',
        'headline': 'Did You Know? Overtaking Requires More Than Just Space',
        'fact_text': 'Overtaking is one of the most dangerous manoeuvres on South African roads. It requires adequate space, clear visibility, appropriate speed and correct application of road rules.',
        'context': 'Overtaking is one of the most dangerous manoeuvres on South African roads. It requires adequate space, clear visibility, appropriate speed and correct application of road rules. Government road-safety guidance emphasises obeying speed limits and avoiding reckless behaviour. Before overtaking, ask yourself: Is the road ahead clear for long enough? Can I see oncoming traffic? Are there intersections, pedestrian crossings or hidden hazards? Is overtaking legal at this location? Solid centre lines, no-overtaking signs and approaching bends often prohibit overtaking. Do not overtake if you must exceed the speed limit significantly, if you cannot complete the manoeuvre safely or if you are unsure. On rural roads, oncoming vehicles may approach faster than expected. In urban areas, pedestrians or vehicles may enter the road unexpectedly. Patience is safer than a risky pass.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'When is overtaking illegal?', 'answer': 'Overtaking is illegal where signs or road markings prohibit it, at intersections, pedestrian crossings, railway crossings and where visibility is insufficient.'},
            {'question': 'How much space do I need to overtake safely?', 'answer': 'Enough to complete the manoeuvre without cutting in sharply and without exceeding a safe speed for conditions.'},
            {'question': 'Should I overtake on a bend?', 'answer': 'No. Bends limit visibility and often have centre-line markings that prohibit overtaking.'},
            {'question': 'Can I overtake if the vehicle ahead is slow?', 'answer': 'Only if it is legal, safe and you can do so without dangerous speed or cutting in.'},
        ],
    },
    {
        'slug': 'yellow-road-markings-south-africa-meaning',
        'headline': 'Did You Know? Not All Yellow Lines Mean the Same Thing',
        'fact_text': 'Road markings communicate important rules about lane use, overtaking, stopping and parking. In South Africa, yellow lines are commonly used for edge markings, parking restrictions and centre-line markings on certain roads.',
        'context': 'Road markings communicate important rules about lane use, overtaking, stopping and parking. In South Africa, yellow lines are commonly used for edge markings, parking restrictions and centre-line markings on certain roads. The exact meaning depends on the pattern and location. A single solid yellow edge line often marks the edge of the carriageway. Double yellow lines along a curb typically indicate no parking or stopping restrictions. Yellow centre lines may be used on certain roads to separate traffic flowing in opposite directions. Drivers should learn to read these markings in combination with signs. Do not park where double yellow lines prohibit it, and do not cross centre lines where overtaking is restricted. Understanding markings helps you avoid fines and, more importantly, prevents unsafe manoeuvres.',
        'source_name': 'National Road Traffic Regulations and road-markings guidance.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=53:road-traffic-signs',
        'faq': [
            {'question': 'What do double yellow lines along a curb mean?', 'answer': 'They typically indicate no parking or stopping restrictions. Confirm local by-laws for specific rules.'},
            {'question': 'Can I cross a yellow centre line to overtake?', 'answer': 'It depends on whether the line is solid or broken and whether signs prohibit overtaking.'},
            {'question': 'Are yellow edge lines mandatory to follow?', 'answer': 'Yes. Edge lines mark the carriageway boundary and help define the legal driving area.'},
            {'question': 'Do road markings override signs?', 'answer': 'Signs and markings work together. Where they appear to conflict, follow the more restrictive instruction.'},
        ],
    },
    {
        'slug': 'traffic-island-right-of-way-rules',
        'headline': 'Did You Know? Traffic Islands Have Right-of-Way Rules Too',
        'fact_text': 'Traffic islands and pedestrian refuges are designed to manage traffic flow and protect pedestrians.',
        'context': 'Traffic islands and pedestrian refuges are designed to manage traffic flow and protect pedestrians. Drivers must yield to traffic approaching from the right when moving around traffic islands within junctions, unless signs or officials direct otherwise. When approaching a traffic circle or junction with an island, slow down, observe traffic from all directions and yield where required. Do not drive over raised islands or use them as a shortcut. Pedestrians may be using refuges to cross, and vehicles may be approaching from multiple directions. Traffic islands are common in urban areas, including parts of Ekurhuleni and Gauteng. Treat them as controlled zones where extra observation and patience are required. Following the correct right-of-way rules prevents confusion and collisions.',
        'source_name': 'Draft traffic by-law and right-of-way rules for traffic islands.',
        'source_url': 'https://lekwalm.gov.za/wp-content/uploads/2025/03/CCT-Traffic-bylaw-Draft-3-008-1.pdf',
        'faq': [
            {'question': 'Who has right of way at a traffic island?', 'answer': 'Generally, yield to traffic approaching from the right unless signs or officials direct otherwise.'},
            {'question': 'Can I drive over a raised traffic island?', 'answer': 'No. Raised islands are not for driving over.'},
            {'question': 'Are traffic islands the same as roundabouts?', 'answer': 'No. Traffic islands may be part of various junction designs, including roundabouts, but rules can differ.'},
            {'question': 'Should I stop at a traffic island?', 'answer': 'Stop or yield as required by signs, markings and right-of-way rules.'},
        ],
    },
    {
        'slug': 'emergency-vehicles-right-of-way-south-africa',
        'headline': 'Did You Know? You Must Yield to Emergency Vehicles With Sirens',
        'fact_text': 'Emergency vehicles such as ambulances, fire engines and police cars may need to pass quickly when responding to incidents.',
        'context': 'Emergency vehicles such as ambulances, fire engines and police cars may need to pass quickly when responding to incidents. Traffic by-laws require drivers to give immediate and absolute right of way to vehicles sounding sirens when necessary. When you hear or see an emergency vehicle approaching, check mirrors, signal if required, and move to the side of the road where safe to do so. Do not brake suddenly in a way that endangers traffic behind you. If you cannot move safely, maintain your position and allow the emergency vehicle to navigate around you. Never follow an emergency vehicle closely or use its presence to justify speeding or reckless driving. Emergency vehicles may stop suddenly or change direction. Your responsibility is to create space and drive predictably.',
        'source_name': 'Draft traffic by-law on emergency vehicle right of way.',
        'source_url': 'https://lekwalm.gov.za/wp-content/uploads/2025/03/CCT-Traffic-bylaw-Draft-3-008-1.pdf',
        'faq': [
            {'question': 'What should I do when I hear a siren?', 'answer': 'Check mirrors, signal, and move aside safely to give right of way.'},
            {'question': 'Can I break traffic rules to move out of the way?', 'answer': 'No. Move only when it is safe and legal to do so.'},
            {'question': 'Should I follow an ambulance that has passed me?', 'answer': 'No. Do not tailgate or use an emergency vehicle to justify speeding.'},
            {'question': 'Do emergency vehicles always have right of way?', 'answer': 'They have priority when using sirens and lights, but drivers must still respond safely and legally.'},
        ],
    },
    {
        'slug': 'railway-crossing-safety-trains-right-of-way',
        'headline': 'Did You Know? Railway Crossings Give Trains Absolute Right of Way',
        'fact_text': 'Trains legally have right of way at road/rail level crossings in South Africa. A full train can take up to 500 metres to stop under emergency conditions, so drivers must never assume a train will stop for them.',
        'context': 'Trains legally have right of way at road/rail level crossings in South Africa. A full train can take up to 500 metres to stop under emergency conditions, so drivers must never assume a train will stop for them. Always stop, look both ways and listen for trains before crossing tracks. Obey all traffic signs, signals and barriers. Where lights and barriers are present, lights start flashing about 30 seconds before a train enters, and barriers drop about 10 seconds before. Never drive around lowered gates—it is unlawful and deadly. Wait at least five metres behind the stop line when waiting for a train. Never stop on railway tracks. If your vehicle stalls on tracks, get out immediately and move away, then call for assistance. Trains have priority even over emergency vehicles.',
        'source_name': 'Government rail-safety and level-crossing information.',
        'source_url': 'https://www.vukuzenzele.gov.za/beware-when-crossing-railway-line',
        'faq': [
            {'question': 'Who has right of way at a railway crossing?', 'answer': 'Trains always have right of way at level crossings.'},
            {'question': 'How far should I stop from the tracks?', 'answer': 'Wait at least five metres behind the stop line.'},
            {'question': 'Can I drive around lowered barriers?', 'answer': 'No. It is illegal and extremely dangerous.'},
            {'question': 'What if my car stalls on the tracks?', 'answer': 'Get out immediately, move away from the tracks and call for assistance.'},
        ],
    },
    {
        'slug': 'stop-sign-rules-complete-stop-south-africa',
        'headline': 'Did You Know? Stop Signs Mean a Complete Stop, Not a Slow Roll',
        'fact_text': 'A stop sign requires a complete halt at the marked stop line or before entering the intersection. Rolling through a stop sign is illegal and dangerous.',
        'context': 'A stop sign requires a complete halt at the marked stop line or before entering the intersection. Rolling through a stop sign is illegal and dangerous. National road-traffic rules require drivers to stop fully and yield where required. After stopping, observe traffic from all directions, check for pedestrians and cyclists, and proceed only when safe. Do not stop in the middle of the intersection or block a pedestrian crossing. Many accidents at intersections occur because drivers treat stop signs as suggestions. A full stop gives you time to assess the situation properly. It also demonstrates to other road users that you intend to comply with the rule.',
        'source_name': 'National Road Traffic Regulations on stop signs and intersections.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=53:road-traffic-signs',
        'faq': [
            {'question': 'Do I have to stop completely at a stop sign?', 'answer': 'Yes. A complete stop is required, not a slow roll.'},
            {'question': 'Where should I stop at a stop sign?', 'answer': 'At the marked stop line or before entering the intersection if no line is present.'},
            {'question': 'What if there is no other traffic?', 'answer': 'You must still stop completely before proceeding when safe.'},
            {'question': 'Can I be fined for rolling through a stop sign?', 'answer': 'Yes. Failing to stop properly is an offence.'},
        ],
    },
    {
        'slug': 'yield-sign-rules-give-way-south-africa',
        'headline': 'Did You Know? Yield Signs Require You to Give Way, Not Necessarily Stop',
        'fact_text': 'A yield (give-way) sign requires you to give right of way to traffic on the intersecting road. You do not have to stop completely if the way is clear, but you must be prepared to stop if necessary.',
        'context': 'A yield (give-way) sign requires you to give right of way to traffic on the intersecting road. You do not have to stop completely if the way is clear, but you must be prepared to stop if necessary. Approach yield signs at a speed that allows you to stop if traffic is approaching. Check both directions, watch for pedestrians and cyclists, and proceed only when safe. Do not assume other drivers will yield to you. Yield signs are common at T-junctions, merges and some roundabouts. Understanding the difference between yield and stop helps you navigate intersections smoothly and legally.',
        'source_name': 'National Road Traffic Regulations on yield signs and right of way.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=53:road-traffic-signs',
        'faq': [
            {'question': 'Do I have to stop at a yield sign?', 'answer': 'Only if traffic requires it. You must be prepared to stop but can proceed if the way is clear.'},
            {'question': 'Who has right of way at a yield sign?', 'answer': 'Traffic on the intersecting road has right of way.'},
            {'question': 'Can I be fined for not yielding?', 'answer': 'Yes. Failing to give way is an offence.'},
            {'question': 'Are yield signs the same as stop signs?', 'answer': 'No. Stop signs require a complete stop; yield signs require giving way.'},
        ],
    },
    {
        'slug': 'one-way-street-rules-lane-use-south-africa',
        'headline': 'Did You Know? One-Way Streets Have Specific Lane Rules',
        'fact_text': 'One-way streets require all traffic to flow in a single direction. Entering a one-way street against the flow is illegal and dangerous.',
        'context': 'One-way streets require all traffic to flow in a single direction. Entering a one-way street against the flow is illegal and dangerous. Drivers must observe one-way signs and road markings before entering. On multi-lane one-way streets, use the left lane for normal driving and the right lane for overtaking where permitted. Do not weave between lanes unnecessarily. Watch for pedestrians, cyclists and vehicles entering from side streets. One-way systems are common in urban areas to manage traffic flow. Always confirm the direction before turning into a street, especially in unfamiliar areas. If you realise you have entered incorrectly, do not reverse or make a U-turn. Continue safely and correct your route at the next legal opportunity.',
        'source_name': 'National Road Traffic Regulations on one-way streets and lane discipline.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=53:road-traffic-signs',
        'faq': [
            {'question': 'How do I know if a street is one-way?', 'answer': 'Look for one-way signs and road markings indicating direction.'},
            {'question': 'Can I overtake on a one-way street?', 'answer': 'Yes, where lane markings and signs permit, using the correct lane.'},
            {'question': 'What if I enter a one-way street by mistake?', 'answer': 'Do not reverse or make a U-turn. Continue safely and correct your route legally.'},
            {'question': 'Are one-way streets always single lane?', 'answer': 'No. They can have multiple lanes all flowing in the same direction.'},
        ],
    },
    {
        'slug': 'no-entry-sign-rules-south-africa',
        'headline': 'Did You Know? No-Entry Signs Are Not Suggestions',
        'fact_text': 'No-entry signs prohibit vehicles from entering a road or lane from a specific direction. Ignoring these signs can lead to head-on collisions, fines and serious danger.',
        'context': 'No-entry signs prohibit vehicles from entering a road or lane from a specific direction. Ignoring these signs can lead to head-on collisions, fines and serious danger. No-entry signs are often used at exit-only lanes, one-way street entrances and restricted areas. If you see a no-entry sign, do not proceed. Turn around safely at the next legal opportunity. Some drivers mistakenly follow GPS directions into no-entry zones. Always prioritise road signs over navigation instructions. If you realise you are approaching a no-entry, stop safely before the sign and find an alternative route.',
        'source_name': 'National Road Traffic Regulations on no-entry signs.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=53:road-traffic-signs',
        'faq': [
            {'question': 'What does a no-entry sign mean?', 'answer': 'It prohibits entry from your direction. Do not proceed past the sign.'},
            {'question': 'Can I enter if there is no traffic?', 'answer': 'No. No-entry signs apply regardless of traffic conditions.'},
            {'question': 'What if my GPS tells me to turn into a no-entry?', 'answer': 'Ignore the GPS. Follow road signs and find an alternative legal route.'},
            {'question': 'Can I be fined for ignoring a no-entry sign?', 'answer': 'Yes. It is a traffic offence.'},
        ],
    },
    {
        'slug': 'school-zone-speed-limits-south-africa',
        'headline': 'Did You Know? School Zones May Have Lower Speed Limits',
        'fact_text': 'School zones often have reduced speed limits during specific times to protect children walking to and from school. Government road-safety guidance emphasises obeying speed limits and being alert around schools.',
        'context': 'School zones often have reduced speed limits during specific times to protect children walking to and from school. Government road-safety guidance emphasises obeying speed limits and being alert around schools. Speed limits in school zones may be lower than surrounding roads and may apply only during certain hours. Look for signs indicating school-zone speed limits and times. Even outside posted hours, drive cautiously near schools because children may be present. Do not park in a way that blocks visibility or pedestrian paths near schools. Watch for school buses, parent vehicles and children crossing unexpectedly. Patience and reduced speed can prevent tragic accidents.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'Are school-zone speed limits mandatory?', 'answer': 'Yes. Obey posted school-zone speed limits during indicated times.'},
            {'question': 'Do school zones apply all day?', 'answer': 'Not always. Check signs for specific hours, but remain cautious at all times.'},
            {'question': 'Should I park near school entrances?', 'answer': 'Only where legal and safe. Do not block visibility or pedestrian paths.'},
            {'question': 'What if there are no signs but children are present?', 'answer': 'Reduce speed and drive with extra caution regardless of posted limits.'},
        ],
    },
    {
        'slug': 'bus-lane-rules-south-africa-restricted-times',
        'headline': 'Did You Know? Bus Lanes Have Restricted Usage Times',
        'fact_text': 'Bus lanes are designated for buses and sometimes other authorised vehicles during specific times. Using a bus lane outside permitted hours may be allowed, but restrictions vary by location.',
        'context': 'Bus lanes are designated for buses and sometimes other authorised vehicles during specific times. Using a bus lane outside permitted hours may be allowed, but restrictions vary by location. Signs indicate when bus lanes are in operation. During restricted times, general traffic must not use the lane. Violating bus-lane rules can result in fines and disrupt public transport. Some bus lanes also allow taxis, motorcycles or emergency vehicles. Check local signage for exact rules. Even when bus lanes are not in operation, drive cautiously and watch for buses merging or stopping.',
        'source_name': 'National Road Traffic Regulations on bus lanes and special lanes.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=53:road-traffic-signs',
        'faq': [
            {'question': 'Can I drive in a bus lane?', 'answer': 'Only outside restricted times or if your vehicle type is permitted. Check signs.'},
            {'question': 'Are bus lanes 24 hours?', 'answer': 'Not always. Many operate during peak hours only.'},
            {'question': 'Can taxis use bus lanes?', 'answer': 'It depends on local rules. Check signage for permitted vehicles.'},
            {'question': 'Can I be fined for using a bus lane?', 'answer': 'Yes, if you use it during restricted times without authorisation.'},
        ],
    },
    {
        'slug': 'parking-restrictions-signs-markings-south-africa',
        'headline': 'Did You Know? Parking Restrictions Vary by Sign and Marking',
        'fact_text': 'Parking rules depend on signs, road markings and local by-laws. Double yellow lines along a curb typically indicate no parking or stopping.',
        'context': 'Parking rules depend on signs, road markings and local by-laws. Double yellow lines along a curb typically indicate no parking or stopping. Other signs may restrict parking to certain times, permit holders or specific vehicle types. Always check both signs and markings before parking. Do not assume a space is legal because other cars are parked there. Illegally parked vehicles can be fined, towed or cause accidents by blocking visibility. Do not park near intersections, pedestrian crossings, railway crossings or in front of driveways. Leave enough space for other road users and emergency vehicles. When in doubt, find a clearly legal parking area.',
        'source_name': 'National Road Traffic Regulations on parking and road markings.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=53:road-traffic-signs',
        'faq': [
            {'question': 'What do double yellow lines mean for parking?', 'answer': 'They typically indicate no parking or stopping along that curb.'},
            {'question': 'Can I park if there are no signs?', 'answer': 'Check road markings and local by-laws. Absence of signs does not always mean parking is allowed.'},
            {'question': 'Can my car be towed for illegal parking?', 'answer': 'Yes. Illegally parked vehicles can be fined or towed.'},
            {'question': 'Should I park near intersections?', 'answer': 'No. Parking near intersections can block visibility and is often prohibited.'},
        ],
    },
    {
        'slug': 'double-white-line-overtaking-restrictions',
        'headline': 'Did You Know? Double White Lines Restrict Overtaking',
        'fact_text': 'Double white centre lines, especially where one or both are solid, restrict overtaking. Crossing solid centre lines to overtake is generally prohibited.',
        'context': 'Double white centre lines, especially where one or both are solid, restrict overtaking. Crossing solid centre lines to overtake is generally prohibited. These markings are used where overtaking is dangerous, such as on bends, near intersections or where visibility is limited. Broken lines may allow overtaking when safe, but solid lines indicate you must stay in your lane. Ignoring these markings can lead to head-on collisions and serious penalties. If you are behind a slow vehicle, wait for a legal overtaking zone with clear visibility and broken lines. Patience is safer than a risky pass.',
        'source_name': 'National Road Traffic Regulations on road markings and overtaking.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=53:road-traffic-signs',
        'faq': [
            {'question': 'Can I cross double white lines to overtake?', 'answer': 'Generally no, especially if one or both lines are solid.'},
            {'question': 'Where are double white lines used?', 'answer': 'On roads where overtaking is dangerous, such as bends and limited-visibility areas.'},
            {'question': 'What if the vehicle ahead is very slow?', 'answer': 'Wait for a legal overtaking zone with broken lines and clear visibility.'},
            {'question': 'Can I be fined for crossing solid white lines?', 'answer': 'Yes. It is a traffic offence.'},
        ],
    },
    {
        'slug': 'give-way-from-the-right-intersection-rules',
        'headline': 'Did You Know? Some Intersections Have Give-Way From the Right Rules',
        'fact_text': 'At some uncontrolled intersections, drivers must yield to traffic approaching from the right. This rule applies where no traffic signs or signals control the junction.',
        'context': 'At some uncontrolled intersections, drivers must yield to traffic approaching from the right. This rule applies where no traffic signs or signals control the junction. Approach such intersections at a speed that allows you to stop if necessary. Look left and right, check for pedestrians and cyclists, and yield to vehicles from the right before proceeding. Do not assume other drivers know or will follow the rule. Give-way from the right is common in residential areas and some older urban layouts. Always treat uncontrolled intersections with caution, even if you believe you have right of way.',
        'source_name': 'Draft traffic by-law on junction right-of-way rules.',
        'source_url': 'https://lekwalm.gov.za/wp-content/uploads/2025/03/CCT-Traffic-bylaw-Draft-3-008-1.pdf',
        'faq': [
            {'question': 'What is give-way from the right?', 'answer': 'It is a rule requiring drivers to yield to traffic approaching from the right at certain uncontrolled intersections.'},
            {'question': 'Do I stop at give-way from the right?', 'answer': 'You must be prepared to stop if traffic is approaching from the right.'},
            {'question': 'Are these intersections signposted?', 'answer': 'Not always. Some rely on general right-of-way rules.'},
            {'question': 'What if two vehicles arrive at the same time?', 'answer': 'The vehicle on the right generally has priority. Proceed with caution.'},
        ],
    },
    {
        'slug': 'u-turn-rules-prohibited-locations-south-africa',
        'headline': 'Did You Know? U-Turns Are Prohibited at Many Locations',
        'fact_text': 'U-turns are prohibited at many locations, including intersections with traffic lights, pedestrian crossings, railway crossings and where signs prohibit them. Performing a U-turn where prohibited is dangerous and illegal.',
        'context': 'U-turns are prohibited at many locations, including intersections with traffic lights, pedestrian crossings, railway crossings and where signs prohibit them. Performing a U-turn where prohibited is dangerous and illegal. Before making a U-turn, check for signs, road markings and visibility. Ensure you can complete the turn safely without obstructing traffic. Do not U-turn on bends, hills or where you cannot see approaching traffic clearly. If you miss a turn, continue safely and correct your route at the next legal opportunity. A U-turn is never worth risking a collision or fine.',
        'source_name': 'National Road Traffic Regulations on U-turns and prohibited manoeuvres.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=53:road-traffic-signs',
        'faq': [
            {'question': 'Where are U-turns prohibited?', 'answer': 'At many intersections, pedestrian crossings, railway crossings and where signs prohibit them.'},
            {'question': 'Can I U-turn at a traffic light?', 'answer': 'Only if permitted by signs and it is safe. Many intersections prohibit U-turns.'},
            {'question': 'What if I miss my turn?', 'answer': 'Continue safely and correct your route legally at the next opportunity.'},
            {'question': 'Can I be fined for an illegal U-turn?', 'answer': 'Yes. It is a traffic offence.'},
        ],
    },
    {
        'slug': 'ekurhuleni-pedestrian-safety-driving',
        'headline': 'Did You Know? Ekurhuleni Roads Can Have Unexpected Pedestrian Activity',
        'fact_text': 'Ekurhuleni, including areas like Daveyton, Benoni and Springs, has busy pedestrian activity in many suburbs and township areas.',
        'context': 'Ekurhuleni, including areas like Daveyton, Benoni and Springs, has busy pedestrian activity in many suburbs and township areas. Pedestrians may cross at unmarked locations, walk along roadsides where pavements are absent, or appear suddenly near taxi ranks and shopping areas. Government road-safety guidance emphasises obeying speed limits and watching for pedestrians. In Ekurhuleni, reduce speed in residential and high-pedestrian areas, especially near schools, taxi ranks and informal trading zones. Always be prepared to stop. Do not assume pedestrians will use marked crossings. At night, watch for people in dark clothing. Extra observation can prevent tragic accidents in busy communities.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'Where are pedestrians most likely to appear in Ekurhuleni?', 'answer': 'Near taxi ranks, shopping areas, schools, residential streets and informal trading zones.'},
            {'question': 'Should I slow down in township areas?', 'answer': 'Yes. Reduce speed and increase observation where pedestrian activity is high.'},
            {'question': 'Do pedestrians always use crossings?', 'answer': 'Not always. Be prepared for unmarked crossings.'},
            {'question': 'How can I improve pedestrian safety?', 'answer': 'Slow down, scan ahead and be ready to stop, especially in busy areas.'},
        ],
    },
    {
        'slug': 'daveyton-intersections-extra-observation',
        'headline': 'Did You Know? Daveyton Intersections Need Extra Observation',
        'fact_text': 'Daveyton, like many busy Ekurhuleni areas, has intersections with mixed traffic, pedestrians, taxis and motorcycles. Some intersections may be uncontrolled or have limited signage.',
        'context': 'Daveyton, like many busy Ekurhuleni areas, has intersections with mixed traffic, pedestrians, taxis and motorcycles. Some intersections may be uncontrolled or have limited signage. Extra observation is essential. Approach intersections at a speed that allows you to stop. Look left and right multiple times, check mirrors and watch for pedestrians stepping into the road. Be aware that other drivers may not always follow right-of-way rules perfectly. Defensive driving is particularly important in Daveyton. Assume hazards may appear from any direction and be ready to react safely. Local knowledge helps, but consistent observation habits protect you everywhere.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.gov.za/about-government/road-safety-arrive-alive',
        'faq': [
            {'question': 'Why are Daveyton intersections challenging?', 'answer': 'They can have mixed traffic, pedestrians and sometimes limited signage.'},
            {'question': 'How should I approach an uncontrolled intersection?', 'answer': 'Slow down, look both ways, check for pedestrians and be prepared to stop.'},
            {'question': 'Do taxis always follow road rules at intersections?', 'answer': 'Not always. Drive defensively and do not assume compliance.'},
            {'question': 'How can I improve intersection safety?', 'answer': 'Reduce speed, increase observation and be ready to yield or stop.'},
        ],
    },
    {
        'slug': 'benoni-peak-traffic-driving-tips',
        'headline': 'Did You Know? Benoni Traffic Can Change Quickly at Peak Times',
        'fact_text': 'Benoni experiences significant traffic volume changes between peak and off-peak times. Morning and evening commutes can bring congestion, especially on main routes towards industrial areas, schools and shopping centres.',
        'context': 'Benoni experiences significant traffic volume changes between peak and off-peak times. Morning and evening commutes can bring congestion, especially on main routes towards industrial areas, schools and shopping centres. Plan extra travel time during peak hours. Routes that are quiet at midday may be congested at 7am or 5pm. Taxis, buses and delivery vehicles add to traffic complexity. Use defensive driving: maintain following distance, avoid aggressive lane changes and watch for pedestrians near busy areas. If possible, schedule non-urgent trips outside peak times to reduce stress and risk.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.gov.za/about-government/road-safety-arrive-alive',
        'faq': [
            {'question': 'When is Benoni traffic busiest?', 'answer': 'Typically during morning and evening peak commuting hours.'},
            {'question': 'How can I avoid peak traffic?', 'answer': 'Schedule non-urgent trips outside peak times where possible.'},
            {'question': 'Should I change lanes frequently in heavy traffic?', 'answer': 'No. Maintain lane discipline and avoid aggressive manoeuvres.'},
            {'question': 'Are pedestrians more common during peak times?', 'answer': 'Yes, especially near schools, taxi ranks and shopping areas.'},
        ],
    },
    {
        'slug': 'springs-mixed-road-types-driving',
        'headline': 'Did You Know? Springs Has Mixed Urban and Semi-Rural Roads',
        'fact_text': 'Springs, in the Ekurhuleni area, includes both urban streets and more open semi-rural roads. Drivers may transition quickly from busy commercial areas to quieter roads with different hazards.',
        'context': 'Springs, in the Ekurhuleni area, includes both urban streets and more open semi-rural roads. Drivers may transition quickly from busy commercial areas to quieter roads with different hazards. Urban sections have more pedestrians, intersections and traffic. Semi-rural sections may have higher speeds, fewer street lights, animals near the road and long bends. Adjust speed and observation to match conditions. Be especially cautious at dawn and dusk when visibility changes and animals may be more active. Do not assume a quiet road means low risk. Different road types require different driving approaches.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.gov.za/about-government/road-safety-arrive-alive',
        'faq': [
            {'question': 'What road types are common in Springs?', 'answer': 'Both urban streets and semi-rural roads with different hazards.'},
            {'question': 'Should I drive the same way on all Springs roads?', 'answer': 'No. Adjust speed and observation to match urban or semi-rural conditions.'},
            {'question': 'Are animals a risk on Springs roads?', 'answer': 'Yes, especially on semi-rural sections at dawn and dusk.'},
            {'question': 'How can I prepare for mixed road types?', 'answer': 'Slow down when conditions change, increase observation and expect different hazards.'},
        ],
    },
    {
        'slug': 'etwatwa-informal-trading-road-safety',
        'headline': 'Did You Know? Etwatwa Roads May Have Informal Trading Nearby',
        'fact_text': 'Etwatwa, like many Ekurhuleni areas, has informal trading zones near roads. Traders, customers and pedestrians may be close to traffic, especially near taxi ranks and shopping areas.',
        'context': 'Etwatwa, like many Ekurhuleni areas, has informal trading zones near roads. Traders, customers and pedestrians may be close to traffic, especially near taxi ranks and shopping areas. Reduce speed near trading zones. Watch for people stepping into the road, goods being carried across streets, and vehicles stopping unexpectedly. Do not assume pedestrians will stay on pavements. Be patient and courteous. Aggressive driving or honking can startle people and create dangerous situations. Extra observation and reduced speed protect everyone in busy community areas.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.gov.za/about-government/road-safety-arrive-alive',
        'faq': [
            {'question': 'Where are informal traders most common in Etwatwa?', 'answer': 'Near taxi ranks, shopping areas and busy community roads.'},
            {'question': 'Should I slow down near traders?', 'answer': 'Yes. Reduce speed and increase observation.'},
            {'question': 'Can traders block the road?', 'answer': 'Sometimes. Be patient and wait for a safe opportunity to pass.'},
            {'question': 'How can I drive safely near trading zones?', 'answer': 'Slow down, watch for pedestrians and avoid aggressive behaviour.'},
        ],
    },
    {
        'slug': 'wattville-school-traffic-safe-driving',
        'headline': 'Did You Know? Wattville Routes Can Include School Traffic',
        'fact_text': 'Wattville, in the Ekurhuleni area, has schools that generate significant traffic at certain times. Parents, scholars and school transport can increase congestion near schools during mornings and afternoons.',
        'context': 'Wattville, in the Ekurhuleni area, has schools that generate significant traffic at certain times. Parents, scholars and school transport can increase congestion near schools during mornings and afternoons. Reduce speed near schools, watch for children crossing and obey school-zone signs where present. Do not park in ways that block visibility or pedestrian paths. Be patient with school buses and parent vehicles stopping frequently. Extra caution during school hours can prevent accidents. Children may be distracted and not notice traffic. Your patience and observation protect vulnerable road users.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.gov.za/about-government/road-safety-arrive-alive',
        'faq': [
            {'question': 'When is school traffic busiest in Wattville?', 'answer': 'Typically mornings and afternoons on school days.'},
            {'question': 'Should I slow down near schools?', 'answer': 'Yes. Reduce speed and increase observation.'},
            {'question': 'Can I park near school entrances?', 'answer': 'Only where legal and safe. Do not block visibility or pedestrian paths.'},
            {'question': 'How can I help keep children safe?', 'answer': 'Slow down, watch for crossings and be patient with school traffic.'},
        ],
    },
    {
        'slug': 'crystal-park-quiet-busy-roads-driving',
        'headline': 'Did You Know? Crystal Park Areas Have Both Quiet and Busy Sections',
        'fact_text': 'Crystal Park, in the Ekurhuleni area, includes both quiet residential streets and busier commercial routes. Drivers may move between low-traffic neighbourhoods and more congested roads within short distances.',
        'context': 'Crystal Park, in the Ekurhuleni area, includes both quiet residential streets and busier commercial routes. Drivers may move between low-traffic neighbourhoods and more congested roads within short distances. Adjust speed and observation to match each section. Quiet streets may still have children playing, pedestrians and unexpected driveways. Busy sections have more vehicles, taxis and intersections. Do not become complacent in quiet areas. Maintain observation and be ready for hazards. In busy sections, keep safe following distance and avoid aggressive lane changes.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'What road types are in Crystal Park?', 'answer': 'Both quiet residential streets and busier commercial routes.'},
            {'question': 'Should I drive differently in quiet sections?', 'answer': 'Yes. Maintain observation for children, pedestrians and driveways.'},
            {'question': 'How should I handle busy Crystal Park roads?', 'answer': 'Keep safe distance, watch for taxis and avoid aggressive manoeuvres.'},
            {'question': 'Can I relax in quiet areas?', 'answer': 'No. Stay alert even on quiet streets.'},
        ],
    },
    {
        'slug': 'gauteng-afternoon-storms-flood-driving',
        'headline': 'Did You Know? Gauteng Afternoon Storms Can Flood Roads Quickly',
        'fact_text': 'Gauteng, including Ekurhuleni, experiences sudden afternoon thunderstorms, especially in summer. Heavy rain can cause flash flooding, standing water and reduced visibility within minutes.',
        'context': 'Gauteng, including Ekurhuleni, experiences sudden afternoon thunderstorms, especially in summer. Heavy rain can cause flash flooding, standing water and reduced visibility within minutes. Government road-safety guidance advises obeying speed limits and ensuring vehicles are roadworthy. In heavy rain, reduce speed, increase following distance and avoid driving through deep standing water. Do not attempt to cross flooded roads. Water depth can be deceptive, and vehicles can stall or be swept away. If roads become impassable, find a safe place to wait until conditions improve.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'How quickly can Gauteng roads flood?', 'answer': 'Flash flooding can occur within minutes during heavy afternoon storms.'},
            {'question': 'Should I drive through standing water?', 'answer': 'No. Avoid flooded sections. Water depth can be deceptive.'},
            {'question': 'How should I adjust speed in heavy rain?', 'answer': 'Reduce speed significantly and increase following distance.'},
            {'question': 'What if my car stalls in flood water?', 'answer': 'Get out safely if possible, move to higher ground and call for assistance.'},
        ],
    },
    {
        'slug': 'township-unmarked-pedestrian-crossings',
        'headline': 'Did You Know? Township Roads May Have Unmarked Pedestrian Crossings',
        'fact_text': 'Many township roads in Ekurhuleni and Gauteng have frequent pedestrian crossings that are not formally marked. People cross at intersections, near shops, taxi ranks and community facilities.',
        'context': 'Many township roads in Ekurhuleni and Gauteng have frequent pedestrian crossings that are not formally marked. People cross at intersections, near shops, taxi ranks and community facilities. Government road-safety guidance emphasises watching for pedestrians and obeying speed limits. In township areas, assume pedestrians may cross anywhere. Reduce speed, scan ahead and be ready to stop. Do not rely only on marked crossings. Children, shoppers and commuters may cross where it is convenient for them. Extra observation and patience can prevent tragic accidents in busy communities.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'Are pedestrian crossings always marked in townships?', 'answer': 'No. Many crossings are unmarked but still used frequently.'},
            {'question': 'Should I slow down in township areas?', 'answer': 'Yes. Reduce speed and increase observation for pedestrians.'},
            {'question': 'Where are pedestrians most likely to cross?', 'answer': 'Near shops, taxi ranks, schools and community facilities.'},
            {'question': 'How can I improve safety?', 'answer': 'Slow down, scan ahead and be ready to stop for pedestrians.'},
        ],
    },
    {
        'slug': 'local-driving-school-ekurhuleni-benefits',
        'headline': 'Did You Know? Choosing a Local Driving School Can Help With Area Familiarity',
        'fact_text': 'A local driving school in Ekurhuleni can help learners become familiar with area-specific roads, intersections, traffic patterns and common hazards.',
        'context': 'A local driving school in Ekurhuleni can help learners become familiar with area-specific roads, intersections, traffic patterns and common hazards. Instructors who know Daveyton, Benoni, Springs, Etwatwa, Wattville and Crystal Park can tailor lessons to real routes learners will use. Government road-safety guidance emphasises proper training and roadworthy vehicles. Local instructors can also prepare learners for DLTC test routes and typical test conditions in the area. This does not guarantee a pass, but it can build confidence and reduce surprises on test day. Learners gain practical experience on roads they will actually drive, not just generic practice routes.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'Why choose a local driving school?', 'answer': 'Local instructors know area roads, hazards and typical test routes.'},
            {'question': 'Does a local school guarantee passing?', 'answer': 'No. But it can improve familiarity and confidence.'},
            {'question': 'What areas do local schools cover?', 'answer': 'Many cover Daveyton, Benoni, Springs, Etwatwa, Wattville, Crystal Park and surrounding Ekurhuleni.'},
            {'question': 'How can local lessons help on test day?', 'answer': 'They can reduce surprises by practising on realistic routes and conditions.'},
        ],
    },
    {
        'slug': 'reaction-time-stopping-distance-driving',
        'headline': 'Did You Know? Reaction Time Is Part of Your Total Stopping Distance',
        'fact_text': 'Your total stopping distance includes both reaction time and braking distance. Reaction time is the period between recognising a hazard and applying the brakes.',
        'context': 'Your total stopping distance includes both reaction time and braking distance. Reaction time is the period between recognising a hazard and applying the brakes. During this time, your vehicle continues travelling at its current speed. At 60 km/h, a typical reaction time of 1 to 1.5 seconds means you travel approximately 17 to 25 metres before even touching the brake pedal. Only after this does braking distance begin. This is why following distance and speed management are critical for safety. Factors affecting reaction time include fatigue, distraction, age, experience and impairment. Avoid distractions, stay alert and maintain safe following distances to compensate for inevitable human reaction delays.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.gov.za/about-government/road-safety-arrive-alive',
        'faq': [
            {'question': 'What is reaction time in driving?', 'answer': 'It is the time between seeing a hazard and applying the brakes.'},
            {'question': 'How far do I travel during reaction time at 60 km/h?', 'answer': 'Approximately 17 to 25 metres, depending on your reaction speed.'},
            {'question': 'Can reaction time be improved?', 'answer': 'Yes, through alertness, experience and avoiding distractions, but it can never be eliminated.'},
            {'question': 'Why is following distance important?', 'answer': 'It provides time and space to react and stop safely when hazards appear.'},
        ],
    },
    {
        'slug': 'mirror-adjustment-safe-driving',
        'headline': 'Did You Know? Mirrors Need Regular Adjustment for Different Drivers',
        'fact_text': 'Mirrors must be correctly adjusted for each driver to provide optimal visibility. Different heights, seating positions and driving styles require different mirror angles.',
        'context': 'Mirrors must be correctly adjusted for each driver to provide optimal visibility. Different heights, seating positions and driving styles require different mirror angles. K53 observation requires effective use of mirrors and blind-spot checks. Before driving, adjust your interior and exterior mirrors to minimise blind spots while maintaining awareness of traffic behind and beside you. You should see a small portion of your own vehicle in side mirrors for reference, with most of the view showing the road. If multiple people use the same vehicle, mirrors should be readjusted for each driver. Never rely on mirrors set for someone else, as this can create dangerous blind spots. Proper adjustment supports safe lane changes, reversing and general observation.',
        'source_name': 'NaTIS K53 documentation on observation and mirrors.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
        'faq': [
            {'question': 'How should I adjust my mirrors?', 'answer': 'Adjust to see the road behind and beside you with minimal blind spots, including a small reference of your own vehicle.'},
            {'question': 'Do mirrors need adjustment for each driver?', 'answer': 'Yes. Different drivers need different mirror angles for optimal visibility.'},
            {'question': 'Can mirrors eliminate all blind spots?', 'answer': 'No. Blind-spot checks are still required even with properly adjusted mirrors.'},
            {'question': 'When should I check mirror adjustment?', 'answer': 'Before every drive, especially if the vehicle is used by multiple drivers.'},
        ],
    },
    {
        'slug': 'seatbelt-law-south-africa-requirements',
        'headline': 'Did You Know? Seatbelts Must Be Worn by All Occupants',
        'fact_text': 'South African law requires all vehicle occupants to wear seatbelts where fitted. The driver is responsible for ensuring all passengers are properly restrained.',
        'context': 'South African law requires all vehicle occupants to wear seatbelts where fitted. The driver is responsible for ensuring all passengers are properly restrained. Government road-safety guidance emphasises seatbelt use as a critical safety measure. Seatbelts significantly reduce the risk of serious injury or death in collisions. They keep occupants in their seats, prevent ejection and work with airbags to provide maximum protection. Children under 14 must sit in the rear seat where possible, and appropriate child restraints are required for young children. Never allow passengers to travel without seatbelts, even on short trips. The few seconds saved are not worth the life-threatening risk.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'Is wearing a seatbelt mandatory in South Africa?', 'answer': 'Yes, for all occupants where seatbelts are fitted.'},
            {'question': 'Who is responsible for passengers wearing seatbelts?', 'answer': 'The driver is responsible for ensuring all occupants are properly restrained.'},
            {'question': 'Can I be fined for passengers not wearing seatbelts?', 'answer': 'Yes. The driver can be fined for unrestrained passengers.'},
            {'question': 'Do seatbelts help in minor accidents?', 'answer': 'Yes. Even low-speed collisions can cause serious injury without seatbelts.'},
        ],
    },
    {
        'slug': 'child-car-seat-requirements-south-africa',
        'headline': 'Did You Know? Children Need Appropriate Restraint Systems',
        'fact_text': 'Children require age-appropriate restraint systems for safe travel. Infants need rear-facing car seats, toddlers need forward-facing seats with harnesses, and older children need booster seats until adult seatbelts fit properly.',
        'context': 'Children require age-appropriate restraint systems for safe travel. Infants need rear-facing car seats, toddlers need forward-facing seats with harnesses, and older children need booster seats until adult seatbelts fit properly. Government road-safety guidance emphasises child passenger safety. Adult seatbelts do not fit children correctly and can cause serious injury in collisions. The belt may rest on the neck or abdomen instead of the shoulder and hips. Proper child restraints position the belt correctly and provide additional protection. Children under 14 should sit in the rear seat where possible. Never hold a child on your lap while driving—even at low speeds, a collision can throw the child from your arms. Always use appropriate restraints for every journey.',
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'What restraint does my child need?', 'answer': 'It depends on age, weight and height. Infants need rear-facing seats, toddlers need forwardfacing seats, older children need boosters.'},
            {'question': 'When can a child use an adult seatbelt?', 'answer': 'When the belt fits properly across the shoulder and hips, typically around 145cm tall.'},
            {'question': 'Where should children sit in the car?', 'answer': 'In the rear seat where possible, especially for children under 14.'},
            {'question': 'Can I hold a child on my lap while driving?', 'answer': 'No. Even at low speeds, a collision can throw the child from your arms.'},
        ],
    },
    {
        'slug': 'load-security-vehicle-handling',
        'headline': 'Did You Know? Load Security Affects Vehicle Handling',
        'fact_text': 'Unsecured loads can shift during driving, affecting vehicle balance, braking and steering. This can lead to loss of control, especially during emergency manoeuvres or on uneven roads.',
        'context': "Unsecured loads can shift during driving, affecting vehicle balance, braking and steering. This can lead to loss of control, especially during emergency manoeuvres or on uneven roads. Government road-safety guidance emphasises vehicle roadworthiness and safe loading. Always secure loads properly using appropriate restraints. Heavy items should be placed low and towards the centre of the vehicle. Do not exceed the vehicle's rated load capacity, as this affects braking, suspension and tyre wear. Check load security before and during journeys. Loose items can become dangerous projectiles in sudden stops or collisions. Proper load management is essential for safe driving, whether carrying groceries or heavy equipment.",
        'source_name': 'South African Government road-safety guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'Why is load security important?', 'answer': 'Unsecured loads can shift, affecting vehicle handling and becoming dangerous in sudden stops.'},
            {'question': 'How should heavy items be loaded?', 'answer': 'Place them low and towards the centre of the vehicle, properly secured.'},
            {'question': "Can I exceed my vehicle's load capacity?", 'answer': 'No. Overloading affects braking, suspension and tyre safety.'},
            {'question': 'When should I check load security?', 'answer': 'Before and during journeys, especially on longer trips.'},
        ],
    },
    {
        'slug': 'learners-licence-documents-required',
        'headline': "Did You Know? You Need Specific Documents for Your Learner's Test",
        'fact_text': "Applying for a learner's licence requires specific documents. You need your original identity document (ID), proof of address, two identical black-and-white ID photographs, and the completed application form (LL1).",
        'context': "Applying for a learner's licence requires specific documents. You need your original identity document (ID), proof of address, two identical black-and-white ID photographs, and the completed application form (LL1). Proof of address must be recent, typically not older than three months. Acceptable documents include utility bills, bank statements or official letters with your name and address. If you are under 18, a parent or guardian must sign the application form. Book your test at a Driving Licence Testing Centre (DLTC). Arrive early with all documents, as incomplete applications will be rejected. The learner's test is computer-based and covers road signs, rules of the road and vehicle controls.",
        'source_name': "South African Government: apply for a learner's licence.",
        'source_url': 'https://www.gov.za/services/driving-licence/apply-learners-licence',
        'faq': [
            {'question': "What documents do I need for a learner's licence?", 'answer': 'Your ID, proof of address, two ID photographs and completed LL1 form.'},
            {'question': 'How recent must proof of address be?', 'answer': 'Typically not older than three months.'},
            {'question': "Do I need a parent's signature if under 18?", 'answer': 'Yes. A parent or guardian must sign the application.'},
            {'question': 'Can I book the test online?', 'answer': 'Booking processes vary by province. Check with your local DLTC for current procedures.'},
        ],
    },
    {
        'slug': 'computerised-learners-licence-test',
        'headline': "Did You Know? The Learner's Test Is Computer-Based at Most Centres",
        'fact_text': "South Africa uses the Computerised Learner's Licence Testing (CLLT) system at most Driving Licence Testing Centres. The test is taken on a computer with multiple-choice questions covering road signs, rules of the road and vehicle controls.",
        'context': "South Africa uses the Computerised Learner's Licence Testing (CLLT) system at most Driving Licence Testing Centres. The test is taken on a computer with multiple-choice questions covering road signs, rules of the road and vehicle controls. The system is available in multiple South African languages. You answer questions by selecting options on the screen. Results are typically provided immediately after completion. To pass, you must achieve the required pass mark (typically 77 out of 100). Familiarise yourself with the test format beforehand. Practice tests are available online and in study guides. The computerised system reduces administrative errors and provides standardised testing across centres.",
        'source_name': "Western Cape Government: computerised learner's licence testing.",
        'source_url': 'https://www.westerncape.gov.za/service/learners-licence',
        'faq': [
            {'question': "Is the learner's test computer-based?", 'answer': 'Yes, at most centres using the CLLT system.'},
            {'question': 'How many questions are on the test?', 'answer': 'Typically 100 multiple-choice questions.'},
            {'question': 'What is the pass mark?', 'answer': 'Typically 77 out of 100, though confirm with your DLTC.'},
            {'question': 'Can I choose the language?', 'answer': 'Yes, the system is available in multiple South African languages.'},
        ],
    },
    {
        'slug': 'retake-learners-test-after-failing',
        'headline': "Did You Know? You Can Retake the Learner's Test If You Fail",
        'fact_text': "If you fail your learner's licence test, you can retake it. There is no limit on the number of attempts, but you must pay the test fee each time and book a new appointment.",
        'context': "If you fail your learner's licence test, you can retake it. There is no limit on the number of attempts, but you must pay the test fee each time and book a new appointment. Use the time between attempts to study areas where you struggled. Focus on road signs, rules of the road and vehicle controls. Practice tests can help identify weak areas. Many learners pass on their second or third attempt after better preparation. Do not be discouraged by failing. The test ensures all licensed drivers have minimum knowledge standards. Take time to learn properly rather than rushing to retest without adequate preparation.",
        'source_name': "Western Cape Government: learner's licence service information.",
        'source_url': 'https://www.westerncape.gov.za/service/learners-licence',
        'faq': [
            {'question': "Can I retake the learner's test if I fail?", 'answer': 'Yes. You can retake it as many times as needed.'},
            {'question': 'Do I pay for each attempt?', 'answer': 'Yes. The test fee applies to each attempt.'},
            {'question': 'How soon can I retest?', 'answer': 'You can book a new appointment, subject to DLTC availability.'},
            {'question': 'Should I retest immediately?', 'answer': 'Only if you have adequately addressed the areas where you struggled.'},
        ],
    },
    {
        'slug': 'learners-licence-medical-vision-requirements',
        'headline': "Did You Know? Vision and Health Requirements Apply to Learner's Licences",
        'fact_text': "Applicants for learner's licences must meet certain vision and health requirements. You must be able to read a vehicle number plate from a prescribed distance and meet eyesight standards.",
        'context': "Applicants for learner's licences must meet certain vision and health requirements. You must be able to read a vehicle number plate from a prescribed distance and meet eyesight standards. The application form includes health declarations. Certain medical conditions may affect your eligibility or require additional medical certification. If you wear glasses or contact lenses, you may need to wear them when driving, and this will be noted on your licence. Be honest about health conditions. Driving with uncorrected vision or untreated medical conditions that affect driving ability endangers yourself and others. If in doubt, consult a medical professional before applying.",
        'source_name': "South African Government: learner's licence application requirements.",
        'source_url': 'https://www.gov.za/services/driving-licence/apply-learners-licence',
        'faq': [
            {'question': "What vision test is required for a learner's licence?", 'answer': 'You must be able to read a vehicle number plate from a prescribed distance.'},
            {'question': 'Do I need medical certification?', 'answer': 'Certain conditions may require additional medical certification. Declare all health issues on the application.'},
            {'question': 'Can I drive with glasses?', 'answer': 'Yes, if your vision meets standards with correction. This will be noted on your licence.'},
            {'question': 'What health conditions affect driving eligibility?', 'answer': 'Conditions affecting vision, coordination, consciousness or judgement may require assessment.'},
        ],
    },
    {
        'slug': 'carry-learners-licence-legal-requirement',
        'headline': "Did You Know? Your Learner's Licence Must Be Carried When Practising",
        'fact_text': "When driving with a learner's licence, you must carry it with you. Traffic officers may request to see it during roadside checks.",
        'context': "When driving with a learner's licence, you must carry it with you. Traffic officers may request to see it during roadside checks. Driving without your learner's licence when required can result in fines. Your learner's licence proves you are legally authorised to drive under supervision. It shows your licence category, expiry date and any conditions. Keep it in a safe but accessible place in the vehicle. Remember, a learner's licence only allows supervised driving. You must be accompanied by a licensed driver qualified for the vehicle category. The supervisor's licence must also be valid.",
        'source_name': "South African Government: learner's licence requirements.",
        'source_url': 'https://www.gov.za/services/driving-licence/apply-learners-licence',
        'faq': [
            {'question': "Must I carry my learner's licence when driving?", 'answer': 'Yes. You must have it with you when driving.'},
            {'question': "What if I forget my learner's licence?", 'answer': 'You can be fined. Always carry it when driving.'},
            {'question': "Can I drive alone with a learner's licence?", 'answer': 'No. You must be supervised by a licensed driver.'},
            {'question': 'Does the supervisor need their licence with them?', 'answer': 'Yes. The supervisor must have a valid licence for the vehicle category.'},
        ],
    },
    {
        'slug': 'k53-pre-drive-vehicle-checks',
        'headline': 'Did You Know? The K53 Test Includes Pre-Drive Vehicle Checks',
        'fact_text': 'The K53 practical driving test includes pre-drive vehicle checks. Before moving off, you must demonstrate that the vehicle is safe and roadworthy.',
        'context': 'The K53 practical driving test includes pre-drive vehicle checks. Before moving off, you must demonstrate that the vehicle is safe and roadworthy. This includes checking lights, brakes, steering, tyres and other critical components. Examiners expect you to know basic vehicle controls and instruments. You may be asked to identify windscreen wipers, demisters, headlights, brake lights and other controls. Understanding your vehicle is part of safe driving. These checks ensure you can identify potential safety issues before driving. Regular vehicle maintenance and pre-drive inspections are good habits for all drivers, not just test candidates.',
        'source_name': 'City of Cape Town: K53 practical driving-test overview.',
        'source_url': 'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
        'faq': [
            {'question': 'What pre-drive checks are in the K53 test?', 'answer': 'Checks may include lights, brakes, steering, tyres and basic vehicle controls.'},
            {'question': 'Do I need to know all vehicle controls?', 'answer': 'Yes. You should understand basic controls like wipers, lights and demisters.'},
            {'question': 'Why are pre-drive checks important?', 'answer': 'They ensure the vehicle is safe and you can identify potential issues before driving.'},
            {'question': 'Should I check tyres before every drive?', 'answer': 'Regular checks are recommended, especially before long trips.'},
        ],
    },
    {
        'slug': 'k53-observation-assessment-examiners',
        'headline': 'Did You Know? Examiners Assess Your Observation Throughout the Test',
        'fact_text': 'K53 examiners continuously assess your observation throughout the test. Observation includes mirror checks, blind-spot checks, scanning ahead and monitoring surrounding traffic.',
        'context': 'K53 examiners continuously assess your observation throughout the test. Observation includes mirror checks, blind-spot checks, scanning ahead and monitoring surrounding traffic. Examiners watch for consistent observation habits, not just occasional checks. They note whether you check mirrors before changing speed or direction, whether you scan intersections properly and whether you monitor blind spots before manoeuvres. Poor observation is a common reason for test failure. Even perfect vehicle control cannot compensate for inadequate observation. Make observation a continuous habit, not a test-day performance.',
        'source_name': 'NaTIS K53 documentation on observation.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=58:k53-light-motor-vehicle-combinations-part2-code-eb',
        'faq': [
            {'question': 'How is observation assessed in K53?', 'answer': 'Examiners watch for consistent mirror checks, blind-spot checks and scanning throughout the drive.'},
            {'question': 'When should I check mirrors?', 'answer': 'Before changing speed or direction, and regularly to monitor surrounding traffic.'},
            {'question': 'Are blind-spot checks required for every manoeuvre?', 'answer': 'For manoeuvres involving lateral movement, such as lane changes and moving off.'},
            {'question': 'Can good observation compensate for other errors?', 'answer': 'Good observation is essential but cannot fully compensate for serious control or rule violations.'},
        ],
    },
    {
        'slug': 'k53-parking-manoeuvres-test',
        'headline': 'Did You Know? You May Be Asked to Perform Multiple Parking Manoeuvres',
        'fact_text': 'The K53 practical test may include multiple parking manoeuvres. Common manoeuvres include parallel parking, bay parking and reversing.',
        'context': 'The K53 practical test may include multiple parking manoeuvres. Common manoeuvres include parallel parking, bay parking and reversing. Examiners assess your observation, control and accuracy. Each manoeuvre requires proper observation before and during movement. Check mirrors, blind spots and the area around the vehicle. Move slowly and be prepared to stop and correct if needed. Practise different parking types during lessons. Do not focus only on one manoeuvre. Realworld driving requires various parking skills, and the test reflects this diversity.',
        'source_name': 'City of Cape Town: K53 practical test includes parking.',
        'source_url': 'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
        'faq': [
            {'question': 'What parking manoeuvres are in the K53 test?', 'answer': 'Common manoeuvres include parallel parking, bay parking and reversing.'},
            {'question': 'How many parking manoeuvres must I do?', 'answer': 'It varies. You may be asked to perform multiple manoeuvres.'},
            {'question': 'Is observation important during parking?', 'answer': 'Yes. Check mirrors, blind spots and surrounding areas before and during manoeuvres.'},
            {'question': 'Can I correct during parking?', 'answer': 'Yes, if done safely and with proper observation.'},
        ],
    },
    {
        'slug': 'k53-freeway-driving-test',
        'headline': 'Did You Know? The Road Test May Include Freeway Driving',
        'fact_text': 'The K53 road test may include freeway or highway driving, depending on the test centre and route. This assesses your ability to merge, maintain speed, change lanes and exit safely on highspeed roads.',
        'context': 'The K53 road test may include freeway or highway driving, depending on the test centre and route. This assesses your ability to merge, maintain speed, change lanes and exit safely on highspeed roads. Freeway driving requires good observation, speed judgement and lane discipline. You must merge smoothly, maintain appropriate speed, keep safe following distances and use mirrors and blind spots before lane changes. Not all test routes include freeways, but you should be prepared. If you have not driven on freeways during lessons, ask your instructor to include freeway practice before your test.',
        'source_name': 'City of Cape Town: K53 practical driving-test overview.',
        'source_url': 'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
        'faq': [
            {'question': 'Does the K53 test include freeway driving?', 'answer': 'It may, depending on the test centre and route.'},
            {'question': 'What skills are assessed on freeways?', 'answer': 'Merging, speed maintenance, lane changes, observation and exiting safely.'},
            {'question': 'Should I practise freeway driving before the test?', 'answer': 'Yes, if freeways are part of your test route or future driving.'},
            {'question': 'What if I have not driven on freeways before?', 'answer': 'Ask your instructor to include freeway practice in your lessons.'},
        ],
    },
    {
        'slug': 'temporary-driving-licence-south-africa',
        'headline': 'Did You Know? Temporary Licences Are Issued After Passing',
        'fact_text': 'After passing your K53 practical driving test, you receive a temporary driving licence. This allows you to drive legally while waiting for your permanent licence card to be issued.',
        'context': 'After passing your K53 practical driving test, you receive a temporary driving licence. This allows you to drive legally while waiting for your permanent licence card to be issued. The temporary licence is valid for a specific period, typically six months. Keep it with you when driving, as you must produce it if requested by traffic officers. Your permanent licence card will be available for collection at the DLTC once processed. Do not drive after the temporary licence expires without your permanent licence. If your permanent licence is delayed, contact the DLTC for guidance. Always carry valid licensing documentation when driving.',
        'source_name': 'Ekurhuleni: K53 test and temporary licence information.',
        'source_url': 'https://www.ekurhuleni.gov.za/press-releases/community-empowerment/tips-for-learner-drivers-on-the-road/',
        'faq': [
            {'question': 'What is a temporary driving licence?', 'answer': 'It is a provisional licence issued after passing your test, valid until your permanent card arrives.'},
            {'question': 'How long is the temporary licence valid?', 'answer': 'Typically six months, but confirm with your DLTC.'},
            {'question': 'Must I carry the temporary licence?', 'answer': 'Yes. Carry it when driving as you would a permanent licence.'},
            {'question': 'What if my permanent licence is delayed?', 'answer': 'Contact the DLTC for guidance if your permanent licence is not ready before the temporary expires.'},
        ],
    },
    {
        'slug': 'manual-downshifting-speed-revs',
        'headline': 'Did You Know? Downshifting Requires Matching Speed and Revs',
        'fact_text': 'Downshifting in a manual car requires matching vehicle speed and engine revs. Downshift when you need more power, such as climbing hills, overtaking or slowing for hazards.',
        'context': 'Downshifting in a manual car requires matching vehicle speed and engine revs. Downshift when you need more power, such as climbing hills, overtaking or slowing for hazards. To downshift smoothly, reduce speed appropriately, depress the clutch, select the lower gear, and release the clutch progressively while matching accelerator input. Rev-matching helps prevent jerking and reduces wear on the drivetrain. Avoid downshifting too early or too late. Too early can over-rev the engine; too late can cause strain or stalling. Practice downshifting in safe areas until it becomes smooth and automatic.',
        'source_name': 'City of Cape Town: K53 practical driving-test vehicle control.',
        'source_url': 'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
        'faq': [
            {'question': 'When should I downshift?', 'answer': 'When you need more power, such as climbing, overtaking or slowing for hazards.'},
            {'question': 'How do I downshift smoothly?', 'answer': 'Match speed and revs, depress clutch, select lower gear, release clutch progressively with appropriate accelerator.'},
            {'question': 'What is rev-matching?', 'answer': 'Adjusting engine revs to match the lower gear speed for smooth engagement.'},
            {'question': 'Can poor downshifting damage the car?', 'answer': 'Yes. Rough downshifting can increase wear on the clutch and transmission.'},
        ],
    },
    {
        'slug': 'coasting-neutral-manual-driving',
        'headline': 'Did You Know? Neutral Should Not Be Used for Coasting',
        'fact_text': 'Coasting in neutral—driving with the gear lever in neutral—is dangerous and should be avoided. It reduces vehicle control, increases stopping distance and can be illegal.',
        'context': 'Coasting in neutral—driving with the gear lever in neutral—is dangerous and should be avoided. It reduces vehicle control, increases stopping distance and can be illegal. In neutral, the engine is disconnected from the wheels, so you lose engine braking and responsive acceleration. This is particularly dangerous on downhills, when approaching hazards or in emergency situations. Always keep the vehicle in an appropriate gear for your speed. Use neutral only when stationary or when specifically required, such as during certain starting procedures. Proper gear selection supports safe, controlled driving.',
        'source_name': 'City of Cape Town: K53 practical driving-test vehicle control.',
        'source_url': 'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
        'faq': [
            {'question': 'Is coasting in neutral dangerous?', 'answer': 'Yes. It reduces control and increases stopping distance.'},
            {'question': 'When should I use neutral?', 'answer': 'Only when stationary or when specifically required for starting procedures.'},
            {'question': 'Does coasting save fuel?', 'answer': 'Modern fuel-injected cars often use more fuel coasting than in gear with throttle closed.'},
            {'question': 'Can I be fined for coasting?', 'answer': 'It can be considered dangerous driving and may result in penalties.'},
        ],
    },
    {
        'slug': 'handbrake-secure-parking-manual',
        'headline': 'Did You Know? The Handbrake Is Essential for Secure Parking',
        'fact_text': 'The handbrake (parking brake) is essential for secure parking, especially on inclines. It holds the vehicle independently of the transmission and prevents rolling.',
        'context': 'The handbrake (parking brake) is essential for secure parking, especially on inclines. It holds the vehicle independently of the transmission and prevents rolling. Always apply the handbrake when parking, even on flat ground. On hills, apply it before releasing the foot brake to prevent rolling. In manual cars, leave the vehicle in gear when parked for additional security. Do not rely solely on Park (in automatics) or gear selection (in manuals). The handbrake provides an independent mechanical hold. Regularly check that your handbrake functions correctly as part of vehicle maintenance.',
        'source_name': 'City of Cape Town: K53 practical driving-test vehicle control.',
        'source_url': 'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
        'faq': [
            {'question': 'Should I always use the handbrake when parking?', 'answer': 'Yes. Apply it every time you park for secure holding.'},
            {'question': 'When should I apply the handbrake on a hill?', 'answer': 'Before releasing the foot brake to prevent rolling.'},
            {'question': 'Do automatic cars need the handbrake?', 'answer': 'Yes. Park alone is not sufficient for secure parking.'},
            {'question': 'How often should I check my handbrake?', 'answer': 'Include it in regular vehicle maintenance checks.'},
        ],
    },
    {
        'slug': 'engine-temperature-vehicle-performance',
        'headline': 'Did You Know? Engine Temperature Affects Performance',
        'fact_text': 'Engine temperature affects vehicle performance and efficiency. Engines operate best at their designed operating temperature.',
        'context': 'Engine temperature affects vehicle performance and efficiency. Engines operate best at their designed operating temperature. Driving with a cold engine or an overheating engine can cause damage and poor performance. Allow the engine to warm up briefly before driving hard, especially in cold weather. Watch the temperature gauge and warning lights. If the engine overheats, stop safely and allow it to cool before continuing or seeking assistance. Regular cooling system maintenance, including coolant levels and radiator condition, helps prevent overheating. Proper engine temperature management extends engine life and improves fuel efficiency.',
        'source_name': 'South African Government road-safety and vehicle maintenance guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'Why does engine temperature matter?', 'answer': 'Engines perform best at designed operating temperature. Too cold or too hot causes problems.'},
            {'question': 'Should I warm up the engine before driving?', 'answer': 'Brief warm-up is beneficial, especially in cold weather, but avoid prolonged idling.'},
            {'question': 'What if the engine overheats?', 'answer': 'Stop safely, allow it to cool, and seek assistance if needed.'},
            {'question': 'How can I prevent overheating?', 'answer': 'Maintain coolant levels, check the radiator, and address cooling system issues promptly.'},
        ],
    },
    {
        'slug': 'regular-vehicle-servicing-maintenance',
        'headline': 'Did You Know? Regular Servicing Extends Vehicle Life',
        'fact_text': 'Regular servicing extends vehicle life, maintains safety and prevents costly repairs. Manufacturer service schedules specify intervals for oil changes, filter replacements, brake inspections and other maintenance.',
        'context': 'Regular servicing extends vehicle life, maintains safety and prevents costly repairs. Manufacturer service schedules specify intervals for oil changes, filter replacements, brake inspections and other maintenance. Servicing includes checking brakes, tyres, suspension, lights and other safety-critical components. It also addresses wear items before they fail. Regular maintenance keeps your vehicle roadworthy and safe. Keep service records as proof of maintenance. This helps with resale value and warranty claims. Do not skip services to save money—preventive maintenance is cheaper than major repairs.',
        'source_name': 'South African Government road-safety and vehicle maintenance guidance.',
        'source_url': 'https://www.vukuzenzele.gov.za/road-safety-tips',
        'faq': [
            {'question': 'How often should I service my vehicle?', 'answer': "Follow the manufacturer's service schedule, typically every 10,000 to 15,000 km or annually."},
            {'question': 'What does servicing include?', 'answer': 'Oil changes, filter replacements, brake checks, tyre inspections and safety component checks.'},
            {'question': 'Why keep service records?', 'answer': 'For warranty claims, resale value and proof of maintenance.'},
            {'question': 'Can I skip services to save money?', 'answer': 'No. Preventive maintenance is cheaper than major repairs from neglect.'},
        ],
    },
    {
        'slug': 'automatic-sport-low-modes',
        'headline': 'Did You Know? Sport or Low Modes Change Gear Behaviour',
        'fact_text': 'Many automatic vehicles have sport, low or manual modes that change gear-shift behaviour. Sport mode holds gears longer for more responsive acceleration.',
        'context': "Many automatic vehicles have sport, low or manual modes that change gear-shift behaviour. Sport mode holds gears longer for more responsive acceleration. Low modes provide more engine braking on downhills. Use sport mode when you want more responsive performance, such as overtaking or spirited driving. Use low modes on steep descents for additional engine braking. Always return to normal mode for regular driving. Understand your vehicle's specific modes by reading the handbook. Different manufacturers use different systems. Using the wrong mode can increase fuel consumption or cause unnecessary wear.",
        'source_name': 'City of Cape Town: K53 practical driving-test vehicle control.',
        'source_url': 'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
        'faq': [
            {'question': 'What does sport mode do in an automatic?', 'answer': 'It holds gears longer for more responsive acceleration.'},
            {'question': 'When should I use low mode?', 'answer': 'On steep descents for additional engine braking.'},
            {'question': 'Do all automatics have these modes?', 'answer': 'No. Check your vehicle handbook for available modes.'},
            {'question': 'Can using wrong modes damage the car?', 'answer': 'It can increase wear or fuel consumption. Use modes appropriately.'},
        ],
    },
    {
        'slug': 'automatic-towing-special-care',
        'headline': 'Did You Know? Towing in an Automatic Requires Special Care',
        'fact_text': 'Towing with an automatic vehicle requires special care and may have specific limitations. Check your vehicle handbook for towing capacity, recommended modes and any restrictions.',
        'context': 'Towing with an automatic vehicle requires special care and may have specific limitations. Check your vehicle handbook for towing capacity, recommended modes and any restrictions. Use appropriate modes for towing. Some vehicles recommend specific gears or modes when towing. Monitor engine temperature and transmission temperature, especially on long climbs. Allow extra distance for braking and acceleration. Ensure the trailer is properly coupled, lights work and load is secure. Towing changes vehicle handling, braking and acceleration. Practise in safe areas before towing on public roads.',
        'source_name': 'City of Cape Town: K53 practical driving-test vehicle control.',
        'source_url': 'https://www.capetown.gov.za/Family and home/transport-and-vehicles/vehicles-and-driving/learner-and-driverslicenses',
        'faq': [
            {'question': 'Can I tow with an automatic car?', 'answer': "Yes, but check your vehicle's towing capacity and limitations first."},
            {'question': 'What modes should I use when towing?', 'answer': 'Follow your vehicle handbook. Some recommend specific gears or modes.'},
            {'question': 'Does towing affect braking?', 'answer': 'Yes. Towing increases stopping distance. Allow extra braking distance.'},
            {'question': 'Should I practise before towing on roads?', 'answer': 'Yes. Practise coupling, uncoupling and manoeuvring in safe areas first.'},
        ],
    },
    {
        'slug': 'motorcycle-learner-supervision',
        'headline': 'Did You Know? Motorcycle Learners Need Supervised Practice',
        'fact_text': "Motorcycle learners need supervised practice, just like car learners. A motorcycle learner's licence requires supervision by a licensed motorcycle rider.",
        'context': "Motorcycle learners need supervised practice, just like car learners. A motorcycle learner's licence requires supervision by a licensed motorcycle rider. Supervision is critical because motorcycles require different skills from cars: balance, braking, cornering and road positioning. A qualified supervisor can guide learners through progressive skill development in safe environments. Start in controlled areas like empty parking lots before progressing to quiet roads and eventually busier traffic. Never practise alone on public roads with only a learner's licence. Proper supervision reduces accident risk during the learning phase.",
        'source_name': 'NaTIS K53 motorcycle practical-driving-test documentation.',
        'source_url': 'https://www.natis.gov.za/index.php/downloads/general-documents?download=56:k53-motor-cycles-part2',
        'faq': [
            {'question': 'Do motorcycle learners need supervision?', 'answer': 'Yes. A licensed motorcycle rider must supervise learners.'},
            {'question': 'Where should motorcycle practice begin?', 'answer': 'In controlled areas like empty parking lots before progressing to roads.'},
            {'question': "Can I practise alone with a motorcycle learner's licence?", 'answer': 'No. Supervision is required on public roads.'},
            {'question': 'Why is motorcycle supervision important?', 'answer': 'Motorcycles require specialised skills. Supervision reduces accident risk during learning.'},
        ],
    },
    {
        'slug': 'vehicle-mass-licence-category',
        'headline': 'Did You Know? Vehicle Mass Determines Your Licence Category',
        'fact_text': 'Vehicle mass determines which licence category you need. South African licensing distinguishes between light motor vehicles (Code B), heavier goods vehicles (Code C1, C) and articulated combinations (Code EC1, EC).',
        'context': 'Vehicle mass determines which licence category you need. South African licensing distinguishes between light motor vehicles (Code B), heavier goods vehicles (Code C1, C) and articulated combinations (Code EC1, EC). Code B covers vehicles up to 3,500 kg gross vehicle mass. Heavier vehicles require different categories. The exact category depends on vehicle mass, whether it is a combination, and the type of vehicle. Before driving heavier vehicles, confirm the required licence category. Driving without the correct licence is illegal and dangerous. Different categories require different training and testing to ensure safe operation.',
        'source_name': 'South African Government: licence categories and amendments.',
        'source_url': 'https://www.gov.za/news/media-statements/transport-publishes-amendments-national-road-traffic-regulations-200014-nov',
        'faq': [
            {'question': 'What determines my licence category?', 'answer': 'Vehicle mass, whether it is a combination, and vehicle type.'},
            {'question': 'What does Code B cover?', 'answer': 'Light motor vehicles up to 3,500 kg gross vehicle mass.'},
            {'question': 'Do I need a different licence for heavier vehicles?', 'answer': 'Yes. Heavier vehicles require Code C1, C, EC1 or EC depending on specifications.'},
            {'question': 'Can I be fined for driving without the correct licence?', 'answer': 'Yes. It is illegal and dangerous.'},
        ],
    },
    {
        'slug': 'traffic-officer-stop-instructions',
        'headline': 'Did You Know? Traffic Officers Can Direct You to Stop',
        'fact_text': 'Traffic officers have the authority to direct vehicles to stop for checks. You must comply with lawful instructions from uniformed traffic officers, police and other authorised officials.',
        'context': 'Traffic officers have the authority to direct vehicles to stop for checks. You must comply with lawful instructions from uniformed traffic officers, police and other authorised officials. When directed to stop, signal, pull over safely and switch off the engine. Keep hands visible and follow instructions. Officers may check licences, vehicle documents, roadworthiness or investigate offences. Do not argue at the roadside. If you disagree with an instruction or fine, follow proper appeal procedures later. Cooperating safely protects everyone involved.',
        'source_name': 'Draft traffic by-law on traffic officer authority.',
        'source_url': 'https://lekwalm.gov.za/wp-content/uploads/2025/03/CCT-Traffic-bylaw-Draft-3-008-1.pdf',
        'faq': [
            {'question': 'Must I stop when a traffic officer directs me?', 'answer': 'Yes. You must comply with lawful instructions from authorised officers.'},
            {'question': 'What should I do when directed to stop?', 'answer': 'Signal, pull over safely, switch off and follow instructions.'},
            {'question': 'What can officers check?', 'answer': 'Licences, vehicle documents, roadworthiness and potential offences.'},
            {'question': 'Can I argue at the roadside?', 'answer': 'No. Follow proper appeal procedures later if you disagree.'},
        ],
    },
]

sql_lines = [
    "-- ============================================================",
    f"-- LCD KHAYA \"DID YOU KNOW?\" FACTS SEED — batch 3 ({len(FACTS)} facts)",
    "-- LCD-DYK-101 to LCD-DYK-150 — category: Driving",
    "-- NOTE: LCD-DYK-076 to LCD-DYK-100 are not yet provided/imported",
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
