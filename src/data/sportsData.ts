import {
  Dribbble,
  CircleDot,
  Waves,
  Bike,
  Mountain,
  Target,
  Swords,
  Snowflake,
  Wind,
  Zap,
  Trophy,
  Medal,
  Dumbbell,
  Timer,
  Volleyball,
  LucideIcon,
} from "lucide-react";

export interface Sport {
  id: string;
  name: string;
  icon: string;
  description: string;
  warmupTips: string[];
  exercises: {
    name: string;
    description: string;
    duration: string;
    difficulty: "beginner" | "intermediate" | "advanced";
  }[];
}

export const sportsData: Sport[] = [
  {
    id: "soccer",
    name: "Soccer",
    icon: "Dribbble",
    description: "Build endurance, agility, and leg strength for the beautiful game.",
    warmupTips: [
      "Start with 5-10 minutes of light jogging around the field",
      "Perform dynamic leg swings (front-to-back and side-to-side)",
      "Do high knees and butt kicks for 30 seconds each",
      "Practice ball dribbling at walking pace to warm up coordination",
      "Stretch your hip flexors and quadriceps thoroughly"
    ],
    exercises: [
      { name: "Shuttle Runs", description: "Sprint between cones placed 10-20 meters apart", duration: "10 mins", difficulty: "intermediate" },
      { name: "Box Jumps", description: "Jump onto a sturdy platform to build explosive power", duration: "5 mins", difficulty: "intermediate" },
      { name: "Lateral Bounds", description: "Jump side to side to improve lateral movement", duration: "5 mins", difficulty: "beginner" },
      { name: "Single-Leg Squats", description: "Build balance and leg strength one leg at a time", duration: "8 mins", difficulty: "advanced" },
      { name: "Cone Dribbling", description: "Weave through cones with the ball at your feet", duration: "10 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: "CircleDot",
    description: "Develop vertical leap, speed, and hand-eye coordination.",
    warmupTips: [
      "Jump rope for 3-5 minutes to get your heart rate up",
      "Perform arm circles and shoulder stretches",
      "Do defensive slides across the court",
      "Practice dribbling drills at moderate pace",
      "Stretch your ankles and calves to prevent injury"
    ],
    exercises: [
      { name: "Vertical Jumps", description: "Practice jumping to touch the rim or backboard", duration: "5 mins", difficulty: "intermediate" },
      { name: "Defensive Slides", description: "Shuffle laterally in defensive stance", duration: "5 mins", difficulty: "beginner" },
      { name: "Suicide Sprints", description: "Sprint to progressively distant lines and back", duration: "10 mins", difficulty: "advanced" },
      { name: "Dribble Drills", description: "Crossovers, behind-the-back, and between legs", duration: "10 mins", difficulty: "intermediate" },
      { name: "Jump Squats", description: "Explosive squats to build lower body power", duration: "5 mins", difficulty: "intermediate" }
    ]
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: "Target",
    description: "Enhance agility, arm strength, and quick reflexes.",
    warmupTips: [
      "Jog around the court for 5 minutes",
      "Perform wrist circles and arm stretches",
      "Do lateral shuffles along the baseline",
      "Practice shadow swings without the ball",
      "Stretch your shoulders, back, and legs"
    ],
    exercises: [
      { name: "Ladder Drills", description: "Quick footwork through agility ladder", duration: "8 mins", difficulty: "intermediate" },
      { name: "Medicine Ball Throws", description: "Rotational throws to build core power", duration: "5 mins", difficulty: "intermediate" },
      { name: "Split Step Practice", description: "Hop and react to different directions", duration: "5 mins", difficulty: "beginner" },
      { name: "Forearm Curls", description: "Strengthen wrists for better racket control", duration: "5 mins", difficulty: "beginner" },
      { name: "Cone Sprints", description: "Sprint to cones simulating court coverage", duration: "10 mins", difficulty: "advanced" }
    ]
  },
  {
    id: "swimming",
    name: "Swimming",
    icon: "Waves",
    description: "Build total body strength and cardiovascular endurance.",
    warmupTips: [
      "Do arm circles and shoulder rotations on deck",
      "Perform leg swings to loosen hip flexors",
      "Start with 200m easy freestyle to warm up",
      "Do some flutter kicks while holding the wall",
      "Practice breathing exercises before intense sets"
    ],
    exercises: [
      { name: "Dryland Push-ups", description: "Build upper body strength for strokes", duration: "5 mins", difficulty: "beginner" },
      { name: "Flutter Kicks", description: "Strengthen legs and core on deck or in pool", duration: "5 mins", difficulty: "beginner" },
      { name: "Lat Pulldowns", description: "Mimic pulling motion of swimming strokes", duration: "8 mins", difficulty: "intermediate" },
      { name: "Plank Holds", description: "Build core stability for streamlined body position", duration: "3 mins", difficulty: "intermediate" },
      { name: "Resistance Band Pulls", description: "Simulate stroke movement against resistance", duration: "8 mins", difficulty: "intermediate" }
    ]
  },
  {
    id: "cycling",
    name: "Cycling",
    icon: "Bike",
    description: "Develop leg power, endurance, and cardiovascular fitness.",
    warmupTips: [
      "Start with 10 minutes of easy spinning",
      "Gradually increase cadence every 2 minutes",
      "Do standing pedals for 30 seconds intervals",
      "Stretch your quadriceps and hamstrings",
      "Roll out your IT band with a foam roller"
    ],
    exercises: [
      { name: "Hill Repeats", description: "Climb steep grades repeatedly", duration: "20 mins", difficulty: "advanced" },
      { name: "Single-Leg Pedaling", description: "Pedal with one leg to improve technique", duration: "10 mins", difficulty: "intermediate" },
      { name: "Lunges", description: "Build leg strength off the bike", duration: "8 mins", difficulty: "beginner" },
      { name: "Core Rotations", description: "Strengthen core for better bike control", duration: "5 mins", difficulty: "beginner" },
      { name: "Interval Sprints", description: "Alternate between max effort and recovery", duration: "15 mins", difficulty: "advanced" }
    ]
  },
  {
    id: "running",
    name: "Running",
    icon: "Zap",
    description: "Build endurance, speed, and mental toughness.",
    warmupTips: [
      "Walk briskly for 5 minutes before running",
      "Do leg swings and hip circles",
      "Perform A-skips and B-skips for 30 meters",
      "Start your run at an easy, conversational pace",
      "Focus on landing with a midfoot strike"
    ],
    exercises: [
      { name: "Tempo Runs", description: "Run at comfortably hard pace for sustained periods", duration: "20 mins", difficulty: "intermediate" },
      { name: "Hill Sprints", description: "Sprint up hills for power and speed", duration: "15 mins", difficulty: "advanced" },
      { name: "Calf Raises", description: "Strengthen calves for better push-off", duration: "5 mins", difficulty: "beginner" },
      { name: "Glute Bridges", description: "Activate glutes for improved running form", duration: "5 mins", difficulty: "beginner" },
      { name: "Fartlek Training", description: "Vary pace throughout your run randomly", duration: "25 mins", difficulty: "intermediate" }
    ]
  },
  {
    id: "golf",
    name: "Golf",
    icon: "Target",
    description: "Develop rotational power, flexibility, and precision.",
    warmupTips: [
      "Swing a weighted club or two clubs together slowly",
      "Perform trunk rotations holding a club behind your back",
      "Do wrist circles and forearm stretches",
      "Practice half swings before full swings",
      "Walk the practice area to get blood flowing"
    ],
    exercises: [
      { name: "Cable Woodchops", description: "Build rotational core power", duration: "8 mins", difficulty: "intermediate" },
      { name: "Hip Rotations", description: "Improve hip mobility for better swing", duration: "5 mins", difficulty: "beginner" },
      { name: "Single-Leg Balance", description: "Improve stability during your swing", duration: "5 mins", difficulty: "beginner" },
      { name: "Resistance Band Rotations", description: "Strengthen rotational muscles", duration: "8 mins", difficulty: "intermediate" },
      { name: "Deadlifts", description: "Build posterior chain strength", duration: "10 mins", difficulty: "advanced" }
    ]
  },
  {
    id: "volleyball",
    name: "Volleyball",
    icon: "Volleyball",
    description: "Build explosive jumping power and quick reflexes.",
    warmupTips: [
      "Jog around the court 3-4 times",
      "Perform shoulder circles and arm swings",
      "Do jumping jacks and high knees",
      "Practice passing and setting at low intensity",
      "Stretch your shoulders and wrists thoroughly"
    ],
    exercises: [
      { name: "Block Jumps", description: "Practice vertical jumps at the net", duration: "8 mins", difficulty: "intermediate" },
      { name: "Burpees", description: "Full body conditioning for quick recoveries", duration: "5 mins", difficulty: "advanced" },
      { name: "Wall Sits", description: "Build leg endurance for sustained play", duration: "3 mins", difficulty: "beginner" },
      { name: "Lateral Jumps", description: "Quick side-to-side movements", duration: "5 mins", difficulty: "intermediate" },
      { name: "Shoulder Press", description: "Strengthen shoulders for hitting", duration: "8 mins", difficulty: "intermediate" }
    ]
  },
  {
    id: "baseball",
    name: "Baseball",
    icon: "CircleDot",
    description: "Develop throwing arm strength, bat speed, and agility.",
    warmupTips: [
      "Play catch starting at short distance, gradually increasing",
      "Do arm circles progressing from small to large",
      "Perform trunk rotations with a bat",
      "Do high knees and lateral shuffles",
      "Stretch your rotator cuff muscles carefully"
    ],
    exercises: [
      { name: "Long Toss", description: "Gradually increase throwing distance", duration: "10 mins", difficulty: "intermediate" },
      { name: "Rotator Cuff Exercises", description: "Strengthen shoulder stability muscles", duration: "8 mins", difficulty: "beginner" },
      { name: "Medicine Ball Slams", description: "Build explosive rotational power", duration: "5 mins", difficulty: "intermediate" },
      { name: "Sprint Drills", description: "Quick burst running for base stealing", duration: "10 mins", difficulty: "intermediate" },
      { name: "Bat Swings", description: "Weighted bat swings for bat speed", duration: "5 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "cricket",
    name: "Cricket",
    icon: "Trophy",
    description: "Build endurance, throwing accuracy, and batting power.",
    warmupTips: [
      "Jog around the boundary at light pace",
      "Do shoulder and arm warm-up exercises",
      "Practice catching with soft hands",
      "Do shadow batting and bowling motions",
      "Stretch your back, shoulders, and legs"
    ],
    exercises: [
      { name: "Shuttle Runs", description: "Quick running between wickets", duration: "10 mins", difficulty: "intermediate" },
      { name: "Shoulder Rotations", description: "Warm up bowling arm properly", duration: "5 mins", difficulty: "beginner" },
      { name: "Core Twists", description: "Build rotational power for batting", duration: "5 mins", difficulty: "beginner" },
      { name: "Lateral Lunges", description: "Improve fielding agility", duration: "8 mins", difficulty: "intermediate" },
      { name: "Wrist Curls", description: "Strengthen wrists for better bat control", duration: "5 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "rugby",
    name: "Rugby",
    icon: "Swords",
    description: "Build tackling power, endurance, and team coordination.",
    warmupTips: [
      "Jog progressively faster over 5 minutes",
      "Perform dynamic stretches for hips and shoulders",
      "Do tackle bag hits at 50% intensity",
      "Practice passing while moving",
      "Stretch your neck and shoulders carefully"
    ],
    exercises: [
      { name: "Sled Pushes", description: "Build driving power for scrums", duration: "8 mins", difficulty: "advanced" },
      { name: "Bear Crawls", description: "Full body conditioning and core strength", duration: "5 mins", difficulty: "intermediate" },
      { name: "Tackle Technique", description: "Practice proper tackling form", duration: "10 mins", difficulty: "intermediate" },
      { name: "Box Jumps", description: "Explosive power for lineouts", duration: "5 mins", difficulty: "intermediate" },
      { name: "Farmer Carries", description: "Build grip and core strength", duration: "5 mins", difficulty: "intermediate" }
    ]
  },
  {
    id: "hockey",
    name: "Hockey",
    icon: "Swords",
    description: "Develop stick handling, skating power, and quick reflexes.",
    warmupTips: [
      "Skate easy laps around the rink",
      "Do crossovers in both directions",
      "Practice stick handling while stationary",
      "Perform dynamic leg stretches off ice",
      "Stretch your groin and hip flexors"
    ],
    exercises: [
      { name: "Skating Drills", description: "Crossovers, stops, and starts", duration: "10 mins", difficulty: "intermediate" },
      { name: "Squats", description: "Build skating power in legs", duration: "8 mins", difficulty: "beginner" },
      { name: "Core Planks", description: "Stability for shot power", duration: "5 mins", difficulty: "beginner" },
      { name: "Lateral Slides", description: "Quick side movements for defense", duration: "5 mins", difficulty: "intermediate" },
      { name: "Wrist Shots", description: "Practice shooting technique", duration: "10 mins", difficulty: "intermediate" }
    ]
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    icon: "Target",
    description: "Sharpen reflexes, footwork, and spin technique.",
    warmupTips: [
      "Rally gently for 5 minutes to find timing",
      "Do wrist rotations and finger stretches",
      "Practice footwork patterns without the ball",
      "Focus on consistent ball contact",
      "Stretch your forearm and shoulder"
    ],
    exercises: [
      { name: "Shadow Strokes", description: "Practice strokes without ball", duration: "5 mins", difficulty: "beginner" },
      { name: "Footwork Drills", description: "Quick feet movements around the table", duration: "8 mins", difficulty: "intermediate" },
      { name: "Wrist Flexibility", description: "Improve spin generation", duration: "5 mins", difficulty: "beginner" },
      { name: "Multi-Ball Training", description: "Rapid fire ball returns", duration: "10 mins", difficulty: "advanced" },
      { name: "Core Rotations", description: "Power for forehand loops", duration: "5 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: "Wind",
    description: "Build explosive speed, wrist power, and court coverage.",
    warmupTips: [
      "Jog around the court 3-4 times",
      "Perform arm swings and shoulder rotations",
      "Do shadow racket swings",
      "Practice footwork patterns on court",
      "Stretch your calves and Achilles tendon"
    ],
    exercises: [
      { name: "Ghosting", description: "Move to corners without shuttle", duration: "10 mins", difficulty: "intermediate" },
      { name: "Lunges", description: "Strengthen legs for reaching shots", duration: "8 mins", difficulty: "beginner" },
      { name: "Wrist Strengthening", description: "Build power for smashes", duration: "5 mins", difficulty: "beginner" },
      { name: "Jump Smash Practice", description: "Overhead power shots", duration: "8 mins", difficulty: "advanced" },
      { name: "Quick Feet Ladder", description: "Improve foot speed", duration: "5 mins", difficulty: "intermediate" }
    ]
  },
  {
    id: "boxing",
    name: "Boxing",
    icon: "Swords",
    description: "Build power, speed, and defensive reflexes.",
    warmupTips: [
      "Jump rope for 5 minutes",
      "Shadow box at low intensity",
      "Roll your shoulders and neck",
      "Do arm circles and wrist rotations",
      "Practice slip and weave movements"
    ],
    exercises: [
      { name: "Heavy Bag Work", description: "Practice combinations on the bag", duration: "15 mins", difficulty: "intermediate" },
      { name: "Speed Bag", description: "Improve hand speed and rhythm", duration: "10 mins", difficulty: "advanced" },
      { name: "Slip Drills", description: "Head movement for defense", duration: "5 mins", difficulty: "intermediate" },
      { name: "Push-ups", description: "Build punching power", duration: "5 mins", difficulty: "beginner" },
      { name: "Burpees", description: "Full body conditioning", duration: "5 mins", difficulty: "advanced" }
    ]
  },
  {
    id: "martial-arts",
    name: "Martial Arts",
    icon: "Swords",
    description: "Develop flexibility, striking power, and self-discipline.",
    warmupTips: [
      "Do joint rotations from head to toe",
      "Perform light stretching for kicks",
      "Practice basic stances and footwork",
      "Do slow-motion techniques",
      "Meditate briefly to focus your mind"
    ],
    exercises: [
      { name: "Kicking Drills", description: "Practice various kick techniques", duration: "10 mins", difficulty: "intermediate" },
      { name: "Kata Practice", description: "Form training for technique", duration: "15 mins", difficulty: "intermediate" },
      { name: "Flexibility Training", description: "Stretching for high kicks", duration: "10 mins", difficulty: "beginner" },
      { name: "Bag Work", description: "Power strikes on heavy bag", duration: "10 mins", difficulty: "intermediate" },
      { name: "Sparring Drills", description: "Controlled practice with partner", duration: "15 mins", difficulty: "advanced" }
    ]
  },
  {
    id: "skiing",
    name: "Skiing",
    icon: "Snowflake",
    description: "Build leg strength, balance, and cold-weather endurance.",
    warmupTips: [
      "Do leg swings holding onto ski poles",
      "Perform squats to warm up thighs",
      "Do ankle circles and calf raises",
      "Take an easy warm-up run first",
      "Stretch your hip flexors and quads"
    ],
    exercises: [
      { name: "Wall Sits", description: "Build thigh endurance for turns", duration: "5 mins", difficulty: "intermediate" },
      { name: "Single-Leg Squats", description: "Balance and strength for skiing", duration: "8 mins", difficulty: "advanced" },
      { name: "Lateral Hops", description: "Quick edge-to-edge movements", duration: "5 mins", difficulty: "intermediate" },
      { name: "Core Planks", description: "Stability for moguls and turns", duration: "5 mins", difficulty: "beginner" },
      { name: "Box Jumps", description: "Explosive power for jumps", duration: "8 mins", difficulty: "advanced" }
    ]
  },
  {
    id: "snowboarding",
    name: "Snowboarding",
    icon: "Snowflake",
    description: "Develop balance, core strength, and edge control.",
    warmupTips: [
      "Do trunk rotations to warm up your core",
      "Perform squats and lunges",
      "Stretch your ankles thoroughly",
      "Do some light jumping on flat ground",
      "Practice balance on one foot"
    ],
    exercises: [
      { name: "Balance Board Training", description: "Core and ankle stability", duration: "10 mins", difficulty: "intermediate" },
      { name: "Squats", description: "Build leg strength for carving", duration: "8 mins", difficulty: "beginner" },
      { name: "Core Rotations", description: "Power for spins and tricks", duration: "5 mins", difficulty: "intermediate" },
      { name: "Jump Training", description: "Practice aerial awareness", duration: "10 mins", difficulty: "advanced" },
      { name: "Calf Raises", description: "Ankle strength for edge control", duration: "5 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "surfing",
    name: "Surfing",
    icon: "Waves",
    description: "Build paddle strength, balance, and wave reading skills.",
    warmupTips: [
      "Swim or paddle easy for 5-10 minutes",
      "Do arm circles and shoulder stretches on shore",
      "Practice pop-ups on the beach",
      "Stretch your lower back and hips",
      "Do some light yoga poses"
    ],
    exercises: [
      { name: "Pop-up Practice", description: "Quick transitions from prone to standing", duration: "10 mins", difficulty: "beginner" },
      { name: "Paddle Strength", description: "Swimming or resistance band pulls", duration: "15 mins", difficulty: "intermediate" },
      { name: "Balance Training", description: "Indo board or balance exercises", duration: "10 mins", difficulty: "intermediate" },
      { name: "Core Work", description: "Planks and rotations for turns", duration: "8 mins", difficulty: "beginner" },
      { name: "Squats", description: "Leg strength for generating speed", duration: "8 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "climbing",
    name: "Rock Climbing",
    icon: "Mountain",
    description: "Build grip strength, problem-solving, and full-body power.",
    warmupTips: [
      "Climb easy routes for 10-15 minutes",
      "Do finger stretches and wrist circles",
      "Perform shoulder rotations",
      "Stretch your forearms thoroughly",
      "Do some light cardio to warm up"
    ],
    exercises: [
      { name: "Hangboard Training", description: "Build finger and grip strength", duration: "15 mins", difficulty: "advanced" },
      { name: "Pull-ups", description: "Upper body pulling power", duration: "8 mins", difficulty: "intermediate" },
      { name: "Core Work", description: "Body tension for overhangs", duration: "8 mins", difficulty: "intermediate" },
      { name: "Flexibility Training", description: "Hip and leg flexibility for high steps", duration: "10 mins", difficulty: "beginner" },
      { name: "Antagonist Training", description: "Push-ups to balance pulling muscles", duration: "5 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "gymnastics",
    name: "Gymnastics",
    icon: "Medal",
    description: "Master flexibility, strength, and body control.",
    warmupTips: [
      "Jog and skip for 5 minutes",
      "Do full body dynamic stretches",
      "Practice basic shapes (tuck, pike, straddle)",
      "Do handstand holds against the wall",
      "Warm up wrists thoroughly"
    ],
    exercises: [
      { name: "Handstand Practice", description: "Build shoulder strength and balance", duration: "10 mins", difficulty: "intermediate" },
      { name: "Flexibility Work", description: "Splits, bridges, and straddles", duration: "15 mins", difficulty: "intermediate" },
      { name: "Core Conditioning", description: "Hollow holds and V-ups", duration: "8 mins", difficulty: "intermediate" },
      { name: "Pull-ups", description: "Upper body strength for apparatus", duration: "8 mins", difficulty: "intermediate" },
      { name: "Tumbling Basics", description: "Rolls and cartwheels", duration: "15 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "weightlifting",
    name: "Weightlifting",
    icon: "Dumbbell",
    description: "Build raw strength, power, and proper lifting technique.",
    warmupTips: [
      "Do 5-10 minutes of light cardio",
      "Perform empty barbell movements",
      "Do mobility work for hips and shoulders",
      "Gradually increase weight over warm-up sets",
      "Activate your core before heavy lifts"
    ],
    exercises: [
      { name: "Squats", description: "Fundamental lower body strength", duration: "15 mins", difficulty: "intermediate" },
      { name: "Deadlifts", description: "Full posterior chain development", duration: "15 mins", difficulty: "intermediate" },
      { name: "Bench Press", description: "Upper body pushing strength", duration: "12 mins", difficulty: "intermediate" },
      { name: "Overhead Press", description: "Shoulder and tricep strength", duration: "10 mins", difficulty: "intermediate" },
      { name: "Rows", description: "Back strength and posture", duration: "10 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "crossfit",
    name: "CrossFit",
    icon: "Zap",
    description: "Build functional fitness across all domains.",
    warmupTips: [
      "Row or bike for 3-5 minutes",
      "Do dynamic stretches and mobility work",
      "Practice movements in the WOD at low intensity",
      "Scale weights and movements as needed",
      "Focus on form before intensity"
    ],
    exercises: [
      { name: "WOD Training", description: "Workout of the day with varied movements", duration: "20 mins", difficulty: "advanced" },
      { name: "Olympic Lifts", description: "Snatch and clean & jerk technique", duration: "15 mins", difficulty: "advanced" },
      { name: "Gymnastics Skills", description: "Pull-ups, muscle-ups, handstands", duration: "15 mins", difficulty: "intermediate" },
      { name: "Metabolic Conditioning", description: "AMRAP and EMOM workouts", duration: "15 mins", difficulty: "intermediate" },
      { name: "Mobility Work", description: "Recovery and flexibility", duration: "10 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "yoga",
    name: "Yoga",
    icon: "Wind",
    description: "Develop flexibility, mindfulness, and body awareness.",
    warmupTips: [
      "Start with gentle breathing exercises",
      "Do cat-cow stretches to warm up spine",
      "Move through sun salutations slowly",
      "Listen to your body and don't force poses",
      "Focus on breath throughout practice"
    ],
    exercises: [
      { name: "Sun Salutations", description: "Flowing sequence to warm up body", duration: "10 mins", difficulty: "beginner" },
      { name: "Standing Poses", description: "Build strength and balance", duration: "15 mins", difficulty: "intermediate" },
      { name: "Hip Openers", description: "Deep flexibility work", duration: "10 mins", difficulty: "intermediate" },
      { name: "Backbends", description: "Spine mobility and strength", duration: "10 mins", difficulty: "advanced" },
      { name: "Restorative Poses", description: "Deep relaxation and recovery", duration: "15 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "rowing",
    name: "Rowing",
    icon: "Waves",
    description: "Build full-body endurance and synchronized power.",
    warmupTips: [
      "Row at light pressure for 5-10 minutes",
      "Focus on technique over power initially",
      "Stretch your hamstrings and lower back",
      "Do arm circles and shoulder mobility",
      "Practice catch and drive separately"
    ],
    exercises: [
      { name: "Steady State Rowing", description: "Long duration at moderate pace", duration: "20 mins", difficulty: "intermediate" },
      { name: "Interval Pieces", description: "High intensity with rest periods", duration: "15 mins", difficulty: "advanced" },
      { name: "Legs-Only Drills", description: "Isolate leg drive technique", duration: "10 mins", difficulty: "beginner" },
      { name: "Core Work", description: "Stability for the stroke", duration: "8 mins", difficulty: "beginner" },
      { name: "Back Extensions", description: "Lower back strength", duration: "5 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "wrestling",
    name: "Wrestling",
    icon: "Swords",
    description: "Build grappling strength, explosive power, and mental toughness.",
    warmupTips: [
      "Jog and do tumbling exercises",
      "Practice sprawls and shots at low intensity",
      "Do neck bridges and rolls carefully",
      "Perform dynamic stretches for hips",
      "Drill basic moves with a partner"
    ],
    exercises: [
      { name: "Sprawl Drills", description: "Defensive movement practice", duration: "8 mins", difficulty: "intermediate" },
      { name: "Shot Drills", description: "Offensive takedown technique", duration: "10 mins", difficulty: "intermediate" },
      { name: "Neck Strengthening", description: "Bridges and resistance exercises", duration: "5 mins", difficulty: "intermediate" },
      { name: "Conditioning Circuits", description: "Wrestling-specific cardio", duration: "15 mins", difficulty: "advanced" },
      { name: "Partner Drills", description: "Live technique practice", duration: "15 mins", difficulty: "intermediate" }
    ]
  },
  {
    id: "american-football",
    name: "American Football",
    icon: "Trophy",
    description: "Build explosive power, tackling strength, and game IQ.",
    warmupTips: [
      "Jog progressively faster over 5 minutes",
      "Do high knees, butt kicks, and karioka",
      "Practice position-specific movements",
      "Stretch hip flexors and hamstrings",
      "Do light throwing and catching"
    ],
    exercises: [
      { name: "40-Yard Dashes", description: "Explosive sprinting speed", duration: "10 mins", difficulty: "intermediate" },
      { name: "Cone Drills", description: "Agility and change of direction", duration: "10 mins", difficulty: "intermediate" },
      { name: "Blocking Technique", description: "Proper blocking form", duration: "10 mins", difficulty: "intermediate" },
      { name: "Tackling Drills", description: "Safe tackling practice", duration: "10 mins", difficulty: "intermediate" },
      { name: "Strength Training", description: "Squats, bench, and cleans", duration: "20 mins", difficulty: "advanced" }
    ]
  },
  {
    id: "track-field",
    name: "Track & Field",
    icon: "Timer",
    description: "Master sprinting, jumping, or throwing events.",
    warmupTips: [
      "Jog 800m at easy pace",
      "Do dynamic drills (A-skips, B-skips)",
      "Perform event-specific warm-up movements",
      "Do strides building to race pace",
      "Stretch key muscle groups for your event"
    ],
    exercises: [
      { name: "Block Starts", description: "Explosive sprint starts", duration: "10 mins", difficulty: "intermediate" },
      { name: "Plyometrics", description: "Jumping power for field events", duration: "15 mins", difficulty: "advanced" },
      { name: "Technique Drills", description: "Event-specific skill work", duration: "15 mins", difficulty: "intermediate" },
      { name: "Speed Endurance", description: "Maintain speed over distance", duration: "15 mins", difficulty: "advanced" },
      { name: "Core Training", description: "Rotational power for throws", duration: "10 mins", difficulty: "beginner" }
    ]
  },
  {
    id: "fencing",
    name: "Fencing",
    icon: "Swords",
    description: "Develop quick reflexes, precision, and tactical thinking.",
    warmupTips: [
      "Do footwork drills for 5 minutes",
      "Perform lunges and advances/retreats",
      "Stretch your legs and shoulders",
      "Practice blade work at slow speed",
      "Do reaction drills with a partner"
    ],
    exercises: [
      { name: "Footwork Drills", description: "Advances, retreats, and lunges", duration: "10 mins", difficulty: "beginner" },
      { name: "Blade Work", description: "Parries and attacks", duration: "10 mins", difficulty: "intermediate" },
      { name: "Leg Strength", description: "Squats and lunges for fencing stance", duration: "8 mins", difficulty: "intermediate" },
      { name: "Reaction Training", description: "Quick response to attacks", duration: "10 mins", difficulty: "advanced" },
      { name: "Bout Practice", description: "Simulated competition", duration: "15 mins", difficulty: "intermediate" }
    ]
  }
];

export const getSportById = (id: string): Sport | undefined => {
  return sportsData.find(sport => sport.id === id);
};

export const iconMap: Record<string, any> = {
  Dribbble,
  CircleDot,
  Waves,
  Bike,
  Mountain,
  Target,
  Swords,
  Snowflake,
  Wind,
  Zap,
  Trophy,
  Medal,
  Dumbbell,
  Timer,
  Volleyball,
};
