import {
  CampusLocation,
  WalkwayNode,
  WalkwayEdge,
  RouteComputationResult,
  NavigationStep,
} from '../types/campus';

export const INITIAL_CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'gate-01',
    name: 'Main Entrance & Security Plaza',
    code: 'GATE-01',
    category: 'entrance',
    shortDescription: 'Primary campus vehicular and pedestrian gate with visitor registration and security post.',
    description: 'The main ceremonial entrance of the campus featuring 24/7 security control, visitor pass issuance desk, campus map directory kiosk, and shuttle pickup bays.',
    block: 'Entrance Zone',
    floorCount: 1,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Level',
        rooms: ['Security Control Room', 'Visitor Pass Counter', 'Baggage Screening', 'Information Helpdesk'],
      },
    ],
    facilities: ['Visitor Registration', 'Wheelchair Ramp', 'Automated Boom Barriers', 'Help Desk', '24/7 CCTV'],
    openingHours: {
      weekdays: 'Open 24 Hours',
      saturday: 'Open 24 Hours',
      sunday: 'Open 24 Hours',
      is24Hours: true,
    },
    contact: {
      inCharge: 'Col. Rajesh Sharma (Retd.)',
      designation: 'Chief Security Officer',
      phone: '+91 80 2345 6001',
      email: 'security@campus.edu.in',
      officeRoom: 'Security Post A',
    },
    coordinates: { lat: 12.9716, lng: 77.5946 },
    gridPos: { x: 500, y: 640 },
    isAccessible: true,
    hasElevator: false,
    color: '#0284c7',
  },
  {
    id: 'adm-01',
    name: 'Main Administration Block',
    code: 'ADM-01',
    category: 'administrative',
    shortDescription: "Central headquarters housing the Principal, Dean's Office, Registrar, and Student Affairs.",
    description: 'The neoclassical heritage landmark building of the institution. Houses the Principal and Vice-Chancellor chambers, Academic Affairs, Fee counters, Examination Branch, and Admissions Office.',
    block: 'Central Admin Zone',
    floorCount: 3,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Floor',
        rooms: ['Admissions Office (Room 101)', 'Student Fee Counters (102-104)', 'Verification Desk', 'Dean of Student Affairs'],
      },
      {
        floorNumber: 1,
        floorName: 'First Floor',
        rooms: ["Principal's Chamber (201)", "Dean of Academic Affairs (204)", 'Boardroom A', 'Academic Senate Hall'],
      },
      {
        floorNumber: 2,
        floorName: 'Second Floor',
        rooms: ['Controller of Examinations (Room 301)', 'Confidential Section', 'Human Resources', 'Accounts & Finance'],
      },
    ],
    facilities: ['Elevator Available', 'Wheelchair Accessible Ramp', 'Air Conditioning', 'Centralized Enquiry', 'RO Water Station', 'Restrooms'],
    openingHours: {
      weekdays: '09:00 AM – 05:00 PM',
      saturday: '09:00 AM – 01:30 PM',
      sunday: 'Closed',
    },
    contact: {
      inCharge: 'Dr. Meenakshi Sundaram',
      designation: 'Registrar',
      phone: '+91 80 2345 6100',
      email: 'registrar@campus.edu.in',
      officeRoom: 'ADM-201',
    },
    coordinates: { lat: 12.9734, lng: 77.5946 },
    gridPos: { x: 500, y: 380 },
    isAccessible: true,
    hasElevator: true,
    color: '#1d4ed8',
  },
  {
    id: 'lib-01',
    name: 'Vikram Sarabhai Central Library',
    code: 'LIB-01',
    category: 'library',
    shortDescription: 'Four-storey modern knowledge repository with digital reading lounge, research archives, and quiet study carrels.',
    description: 'A world-class academic library housing over 120,000 volumes, international print journals, e-resource multimedia terminals, group discussion capsules, and 24-hour reading hall during exam seasons.',
    block: 'Block A (Academic Core)',
    floorCount: 4,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Floor',
        rooms: ['Circulation & Issue Desk', 'Reference Book Collection', 'Digital Learning Centre (60 PCs)', 'Librarian Office'],
      },
      {
        floorNumber: 1,
        floorName: 'First Floor',
        rooms: ['Engineering & Technology Stacks (Rooms 110-125)', 'Periodicals & Magazines', 'Reading Hall A (150 Seats)'],
      },
      {
        floorNumber: 2,
        floorName: 'Second Floor',
        rooms: ['Basic Sciences & Humanities Archive', 'Group Study Cubicles (1-8)', 'Doctoral Research Carrels'],
      },
      {
        floorNumber: 3,
        floorName: 'Third Floor',
        rooms: ['Digital Media Lab', 'Audio-Visual Seminar Room', 'Thesis & Rare Manuscript Archive'],
      },
    ],
    facilities: ['Wi-Fi 6', 'Air Conditioning', 'Wheelchair Ramp & Elevator', 'Self-Checkout RFID Kiosk', 'Reprographics & Xerox', 'Restrooms'],
    openingHours: {
      weekdays: '08:00 AM – 10:00 PM',
      saturday: '09:00 AM – 08:00 PM',
      sunday: '10:00 AM – 05:00 PM',
    },
    contact: {
      inCharge: 'Dr. S. K. Kulkarni',
      designation: 'Chief University Librarian',
      phone: '+91 80 2345 6201',
      email: 'library@campus.edu.in',
      officeRoom: 'LIB-G04',
    },
    coordinates: { lat: 12.9738, lng: 77.5930 },
    gridPos: { x: 260, y: 330 },
    isAccessible: true,
    hasElevator: true,
    color: '#0891b2',
  },
  {
    id: 'cs-lab',
    name: 'APJ Abdul Kalam Computer Centre',
    code: 'CS-LAB',
    category: 'laboratory',
    shortDescription: 'High-tech computing hub with AI/ML labs, cloud computing cluster, cybersecurity testbed, and data center.',
    description: 'Premier technical facility serving Computer Science, Artificial Intelligence, and Data Engineering departments. Equipped with high-performance GPU clusters, Gigabit fiber connectivity, and dedicated research workstations.',
    block: 'Block B (Technology Complex)',
    floorCount: 3,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Floor',
        rooms: ['Systems Administration & Server Farm', 'Programming Lab 1 (Rooms CS-01 to CS-04)', 'Hardware & IoT Lab'],
      },
      {
        floorNumber: 1,
        floorName: 'First Floor',
        rooms: ['AI & Neural Networks Research Lab', 'Cloud Computing Center (CS-101)', 'Cyber Security Simulation Lab (CS-105)'],
      },
      {
        floorNumber: 2,
        floorName: 'Second Floor',
        rooms: ['Software Engineering Project Studio', 'HOD Computer Science Chamber', 'Faculty Research Chambers (201-210)'],
      },
    ],
    facilities: ['High-speed Fiber LAN', 'Central AC', 'Elevator', 'Dual Redundant UPS', 'Access Card Security', 'Fire Suppression System'],
    openingHours: {
      weekdays: '08:30 AM – 08:30 PM',
      saturday: '09:00 AM – 05:00 PM',
      sunday: 'Closed',
    },
    contact: {
      inCharge: 'Prof. Ananya Sen',
      designation: 'Head, Computer Science & Systems',
      phone: '+91 80 2345 6301',
      email: 'cse.hod@campus.edu.in',
      officeRoom: 'CS-201',
    },
    coordinates: { lat: 12.9740, lng: 77.5962 },
    gridPos: { x: 740, y: 310 },
    isAccessible: true,
    hasElevator: true,
    color: '#4f46e5',
  },
  {
    id: 'lhc-01',
    name: 'Aryabhata Lecture Hall Complex',
    code: 'LHC-01',
    category: 'classroom',
    shortDescription: 'Tiered acoustic smart lecture theatres with multimedia projectors, lecture capture cameras, and 120-seat capacity each.',
    description: 'The core academic instructional hub featuring 18 smart classrooms and 6 large tiered auditoria. Fitted with 4K laser projection, interactive digital podiums, and assisted listening acoustics.',
    block: 'Block A (Academic Core)',
    floorCount: 3,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Floor',
        rooms: ['Lecture Theatre LHC-101 (Tiered, 150 Seats)', 'Lecture Theatre LHC-102 (150 Seats)', 'Smart Classrooms 103-108'],
      },
      {
        floorNumber: 1,
        floorName: 'First Floor',
        rooms: ['Lecture Theatres LHC-201 to LHC-204', 'Tutorial Rooms TR-01 to TR-06', 'Faculty Common Lounge'],
      },
      {
        floorNumber: 2,
        floorName: 'Second Floor',
        rooms: ['Lecture Theatres LHC-301 to LHC-304', 'Mathematics & Analytics Classrooms 305-310'],
      },
    ],
    facilities: ['Smart Interactive Podiums', 'Acoustic Soundproofing', 'Elevator & Ramps', 'Lecture Capture System', 'Restrooms per floor'],
    openingHours: {
      weekdays: '08:00 AM – 06:30 PM',
      saturday: '08:30 AM – 02:00 PM',
      sunday: 'Closed',
    },
    contact: {
      inCharge: 'Prof. R. Venkatraman',
      designation: 'Dean of Undergraduate Instruction',
      phone: '+91 80 2345 6140',
      email: 'academic.lhc@campus.edu.in',
      officeRoom: 'LHC-112',
    },
    coordinates: { lat: 12.9724, lng: 77.5932 },
    gridPos: { x: 280, y: 490 },
    isAccessible: true,
    hasElevator: true,
    color: '#2563eb',
  },
  {
    id: 'sci-02',
    name: 'CV Raman Science Laboratories',
    code: 'SCI-02',
    category: 'laboratory',
    shortDescription: 'Advanced Physics, Chemistry, and Environmental Biotechnology testing and wet laboratories.',
    description: 'Houses state-of-the-art scientific research labs including spectroscopy, chromatography, optics, synthesis benches, and analytical instrumentation chambers.',
    block: 'Block B (Science Wing)',
    floorCount: 3,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Floor',
        rooms: ['General Physics Lab 1 & 2', 'Laser & Optics Research Darkroom', 'Materials Science Workshop'],
      },
      {
        floorNumber: 1,
        floorName: 'First Floor',
        rooms: ['Inorganic & Organic Synthesis Labs', 'Fume Hood Chemical Storage', 'Instrumentation Lab (NMR, UV-Vis)'],
      },
      {
        floorNumber: 2,
        floorName: 'Second Floor',
        rooms: ['Biotechnology & Microbiology Cell Culture', 'Environmental Testing Facility', 'Department Faculty Offices'],
      },
    ],
    facilities: ['Emergency Eyewash & Safety Showers', 'Fume Hood Ventilation', 'Hazardous Waste Neutralization', 'Elevator', 'Fire Safety Station'],
    openingHours: {
      weekdays: '08:30 AM – 06:00 PM',
      saturday: '09:00 AM – 02:00 PM',
      sunday: 'Closed',
    },
    contact: {
      inCharge: 'Dr. G. Nalini',
      designation: 'Head, Department of Applied Sciences',
      phone: '+91 80 2345 6410',
      email: 'science.labs@campus.edu.in',
      officeRoom: 'SCI-204',
    },
    coordinates: { lat: 12.9722, lng: 77.5960 },
    gridPos: { x: 720, y: 500 },
    isAccessible: true,
    hasElevator: true,
    color: '#0d9488',
  },
  {
    id: 'can-01',
    name: 'Campus Cafeteria & Food Court',
    code: 'CAN-01',
    category: 'canteen',
    shortDescription: 'Spacious dining facility with multi-cuisine food stalls, bakery counter, juice bar, and outdoor garden seating.',
    description: 'A vibrant social dining hub serving hygienic vegetarian and non-vegetarian meals, fresh breakfast specials, espresso coffee, natural smoothies, and quick snacks at student-subsidized rates.',
    block: 'Student Life Zone',
    floorCount: 2,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Floor',
        rooms: ['South & North Indian Meal Counters', 'Chef Hot Kitchen', 'Outdoor Lawn Seating Deck', 'Digital Payment Kiosk'],
      },
      {
        floorNumber: 1,
        floorName: 'First Floor',
        rooms: ['Bakery & Espresso Coffee Lounge', 'Faculty Dining Hall', 'Fresh Juice & Healthy Salads Corner'],
      },
    ],
    facilities: ['Seating Capacity 450+', 'Outdoor Shaded Terrace', 'Digital UPI Kiosks', 'Wheelchair Accessible Ground Deck', 'Hand Wash Stations'],
    openingHours: {
      weekdays: '07:30 AM – 09:30 PM',
      saturday: '08:00 AM – 09:00 PM',
      sunday: '08:30 AM – 08:30 PM',
    },
    contact: {
      inCharge: 'Mr. Pradeep Kumar',
      designation: 'Campus Hospitality & Food Safety Officer',
      phone: '+91 80 2345 6500',
      email: 'cafeteria@campus.edu.in',
      officeRoom: 'CAN-Manager Desk',
    },
    coordinates: { lat: 12.9744, lng: 77.5942 },
    gridPos: { x: 440, y: 220 },
    isAccessible: true,
    hasElevator: false,
    color: '#ea580c',
  },
  {
    id: 'aud-01',
    name: 'Dr. B.R. Ambedkar Convention Hall',
    code: 'AUD-01',
    category: 'auditorium',
    shortDescription: '1,200-seat grand auditorium for academic conferences, convocation, cultural festivals, and guest lectures.',
    description: 'An architectural centerpiece with acoustic wood paneling, motorized stage curtains, theatrical lighting grid, green rooms, and integrated simultaneous translation booths.',
    block: 'Central Arts & Culture Zone',
    floorCount: 2,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Level',
        rooms: ['Main Auditorium Stalls (800 Seats)', 'Stage & Green Rooms 1-2', 'VIP Reception Lounge', 'Registration Foyer'],
      },
      {
        floorNumber: 1,
        floorName: 'Balcony Level',
        rooms: ['Balcony Seating (400 Seats)', 'Audio-Visual Control Booth', 'Lighting Console Desk'],
      },
    ],
    facilities: ['Surround Sound PA System', 'Green Rooms', 'Wheelchair Seating Bays', 'Central AC', 'VIP Lounge', 'Ample Parking'],
    openingHours: {
      weekdays: '08:30 AM – 08:00 PM',
      saturday: '09:00 AM – 07:00 PM',
      sunday: 'Event Specific',
    },
    contact: {
      inCharge: 'Prof. Shalini Roy',
      designation: 'Director of Cultural Affairs',
      phone: '+91 80 2345 6601',
      email: 'auditorium@campus.edu.in',
      officeRoom: 'AUD-Green Room Office',
    },
    coordinates: { lat: 12.9748, lng: 77.5954 },
    gridPos: { x: 600, y: 190 },
    isAccessible: true,
    hasElevator: true,
    color: '#7c3aed',
  },
  {
    id: 'spt-01',
    name: 'Netaji Subhash Sports Complex',
    code: 'SPT-01',
    category: 'sports',
    shortDescription: 'Indoor badminton and basketball courts, gymnasium, table tennis hall, and athletic ground pavilion.',
    description: 'Comprehensive sports facility offering Olympic-standard wooden indoor courts, fitness training gym, changing locker rooms, yoga studio, and outdoor running track.',
    block: 'Sports & Wellness Zone',
    floorCount: 2,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Floor',
        rooms: ['Indoor Wooden Basketball/Badminton Court', 'Locker & Shower Rooms', 'Equipment Dispatch Counter', 'Physical Education Office'],
      },
      {
        floorNumber: 1,
        floorName: 'Mezzanine Floor',
        rooms: ['Cardio & Strength Gym', 'Table Tennis Arena', 'Yoga & Aerobics Studio'],
      },
    ],
    facilities: ['Locker Rooms & Showers', 'Drinking Water Dispensers', 'First Aid Station', 'Physiotherapy Corner', 'Equipment Rental'],
    openingHours: {
      weekdays: '06:00 AM – 09:00 AM & 04:30 PM – 09:00 PM',
      saturday: '06:30 AM – 08:30 PM',
      sunday: '07:00 AM – 06:00 PM',
    },
    contact: {
      inCharge: 'Coach Satish Patil',
      designation: 'Director of Physical Education',
      phone: '+91 80 2345 6701',
      email: 'sports@campus.edu.in',
      officeRoom: 'SPT-101',
    },
    coordinates: { lat: 12.9752, lng: 77.5930 },
    gridPos: { x: 200, y: 160 },
    isAccessible: true,
    hasElevator: false,
    color: '#16a34a',
  },
  {
    id: 'med-01',
    name: 'Student Health Centre & Dispensary',
    code: 'MED-01',
    category: 'amenity',
    shortDescription: '24/7 medical consultation, emergency triage, nursing care, and dedicated on-campus ambulance bay.',
    description: 'Provides free primary health care for students, faculty, and campus residents. Staffed with full-time medical officers, resident nurses, essential medicines dispensary, and observation beds.',
    block: 'Wellness Quad',
    floorCount: 1,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Level',
        rooms: ['Doctor Consultation Room', 'Observation Ward (4 Beds)', 'Pharmacy & Medicine Dispensing', 'Triage & Dressing Room'],
      },
    ],
    facilities: ['24/7 Ambulance Bay', 'Oxygen Concentrators', 'Free Medicines for Students', 'Wheelchair Ramp', 'Emergency Phone Hotlines'],
    openingHours: {
      weekdays: 'Open 24 Hours',
      saturday: 'Open 24 Hours',
      sunday: 'Open 24 Hours',
      is24Hours: true,
    },
    contact: {
      inCharge: 'Dr. Vivek Menon, MBBS, MD',
      designation: 'Chief Medical Officer',
      phone: '+91 80 2345 6800',
      email: 'healthcenter@campus.edu.in',
      officeRoom: 'MED-Consultation 1',
    },
    coordinates: { lat: 12.9718, lng: 77.5940 },
    gridPos: { x: 380, y: 590 },
    isAccessible: true,
    hasElevator: false,
    color: '#e11d48',
  },
  {
    id: 'eng-01',
    name: 'Sir M. Visvesvaraya Engineering Workshops',
    code: 'ENG-01',
    category: 'laboratory',
    shortDescription: 'Heavy mechanical fabrication, CNC machining, carpentry, welding, and 3D prototyping workshops.',
    description: 'Practical engineering lab complex equipped with industrial CNC milling machines, foundry furnaces, metal lathe lines, sheet metal fabrication, and additive manufacturing 3D print farms.',
    block: 'Block C (Engineering Workshops)',
    floorCount: 1,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Floor High-Bay',
        rooms: ['Machine Shop & Lathe Bay', 'Welding & Metallurgy Shed', 'Carpentry & Foundry Unit', 'Rapid 3D Prototyping FabLab'],
      },
    ],
    facilities: ['Overhead Crane 5-Ton', 'Industrial Safety Gear', 'Compressed Air Lines', '3D Printers', 'Fire Hydrants'],
    openingHours: {
      weekdays: '08:30 AM – 05:30 PM',
      saturday: '09:00 AM – 01:00 PM',
      sunday: 'Closed',
    },
    contact: {
      inCharge: 'Prof. Hemant Joshi',
      designation: 'Workshop Superintendent',
      phone: '+91 80 2345 6901',
      email: 'workshops@campus.edu.in',
      officeRoom: 'ENG-WS10',
    },
    coordinates: { lat: 12.9718, lng: 77.5966 },
    gridPos: { x: 860, y: 550 },
    isAccessible: true,
    hasElevator: false,
    color: '#c026d3',
  },
  {
    id: 'inc-01',
    name: 'Innovation & Career Services Hub',
    code: 'INC-01',
    category: 'administrative',
    shortDescription: 'Student startup incubation centre, corporate training suites, interview booths, and placement office.',
    description: 'Facilitates student entrepreneurship with co-working desks, mentorship pods, patent advisory, and comprehensive on-campus placement recruitment drive facilities.',
    block: 'Block B (Technology Complex)',
    floorCount: 2,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Floor',
        rooms: ['Campus Placement Office', 'Corporate Interview Rooms 1-12', 'Group Discussion Suites A & B', 'Reception Lounge'],
      },
      {
        floorNumber: 1,
        floorName: 'First Floor',
        rooms: ['Incubatee Co-working Pods (1-20)', 'Makerspace Electronics Lab', 'Investor Pitch Conference Room'],
      },
    ],
    facilities: ['High-speed Wi-Fi', 'Video Conferencing Rooms', 'Elevator', 'Cafe Kiosk', 'Lounge Seating'],
    openingHours: {
      weekdays: '09:00 AM – 07:00 PM',
      saturday: '09:30 AM – 04:00 PM',
      sunday: 'Closed',
    },
    contact: {
      inCharge: 'Ms. Tanvi Kapoor',
      designation: 'Head of Placements & Industry Relations',
      phone: '+91 80 2345 6950',
      email: 'placements@campus.edu.in',
      officeRoom: 'INC-G02',
    },
    coordinates: { lat: 12.9752, lng: 77.5962 },
    gridPos: { x: 800, y: 170 },
    isAccessible: true,
    hasElevator: true,
    color: '#059669',
  },
  {
    id: 'hst-01',
    name: 'North Residence Quad (Hostels)',
    code: 'HST-01',
    category: 'amenity',
    shortDescription: 'Student residential halls with study rooms, laundromat, recreation room, and warden offices.',
    description: 'Modern residential hostel facilities offering furnished rooms, round-the-clock security, automated laundry, solar water heating, and indoor recreation lounges.',
    block: 'Residential Quad',
    floorCount: 4,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Ground Floor',
        rooms: ["Chief Warden Office", 'Common Lounge & TV Room', 'Laundromat Facility', 'Indoor Games Room'],
      },
      {
        floorNumber: 1,
        floorName: 'Floor 1',
        rooms: ['Rooms 101-140', 'Study Room A', 'Pantry & Microwave Room'],
      },
      {
        floorNumber: 2,
        floorName: 'Floor 2',
        rooms: ['Rooms 201-240', 'Study Room B', 'Pantry'],
      },
      {
        floorNumber: 3,
        floorName: 'Floor 3',
        rooms: ['Rooms 301-340', 'Study Room C', 'Open Roof Terrace Access'],
      },
    ],
    facilities: ['Wi-Fi Campus Mesh', 'Biometric Entry', 'Elevator', 'Solar Hot Water', '24/7 Security Desk'],
    openingHours: {
      weekdays: 'Open 24 Hours (Curfew 10:00 PM)',
      saturday: 'Open 24 Hours (Curfew 10:30 PM)',
      sunday: 'Open 24 Hours (Curfew 10:00 PM)',
      is24Hours: true,
    },
    contact: {
      inCharge: 'Prof. K. Ramanathan',
      designation: 'Chief Warden',
      phone: '+91 80 2345 6990',
      email: 'warden@campus.edu.in',
      officeRoom: 'HST-Warden House',
    },
    coordinates: { lat: 12.9758, lng: 77.5942 },
    gridPos: { x: 480, y: 90 },
    isAccessible: true,
    hasElevator: true,
    color: '#0284c7',
  },
  {
    id: 'gate-02',
    name: 'Metro Transit Plaza & South Gate',
    code: 'GATE-02',
    category: 'entrance',
    shortDescription: 'Pedestrian access directly connecting the campus to the University Metro Station and bus terminus.',
    description: 'Convenient southern pedestrian gateway connecting directly to the city metro rail skywalk. Features turnstile smartcard access, bicycle parking stands, and security checkpoint.',
    block: 'Transit Zone',
    floorCount: 1,
    floors: [
      {
        floorNumber: 0,
        floorName: 'Plaza Level',
        rooms: ['Smartcard RFID Turnstiles', 'Campus Shuttle Stop', 'Public Bicycle Share Dock', 'Security Kiosk'],
      },
    ],
    facilities: ['Metro Skywalk Connection', 'Turnstile Access', 'Bicycle Stands', 'CCTV Surveillance', 'Ramp Access'],
    openingHours: {
      weekdays: '06:00 AM – 11:00 PM',
      saturday: '06:00 AM – 11:00 PM',
      sunday: '06:30 AM – 10:30 PM',
    },
    contact: {
      inCharge: 'Officer N. Gopal',
      designation: 'Transit Gate Supervisor',
      phone: '+91 80 2345 6002',
      email: 'transit@campus.edu.in',
      officeRoom: 'GATE-02 Kiosk',
    },
    coordinates: { lat: 12.9710, lng: 77.5946 },
    gridPos: { x: 500, y: 685 },
    isAccessible: true,
    hasElevator: false,
    color: '#0369a1',
  },
];

// Campus Walkway Routing Graph Nodes
export const CAMPUS_WALKWAY_NODES: WalkwayNode[] = [
  { id: 'node_gate_02', name: 'South Metro Gate', x: 500, y: 685, lat: 12.9710, lng: 77.5946, locationId: 'gate-02' },
  { id: 'node_gate_01', name: 'Main Campus Gate', x: 500, y: 640, lat: 12.9716, lng: 77.5946, locationId: 'gate-01' },
  { id: 'node_health_dispensary', name: 'Health Centre Entrance', x: 380, y: 590, lat: 12.9718, lng: 77.5940, locationId: 'med-01' },
  { id: 'node_workshops', name: 'Engineering Workshops', x: 860, y: 550, lat: 12.9718, lng: 77.5966, locationId: 'eng-01' },
  { id: 'node_south_cross', name: 'South Avenue Junction', x: 500, y: 580, lat: 12.9720, lng: 77.5946 },
  { id: 'node_west_path_1', name: 'West Garden Walk South', x: 330, y: 540, lat: 12.9722, lng: 77.5936 },
  { id: 'node_east_path_1', name: 'East Tech Walk South', x: 670, y: 540, lat: 12.9722, lng: 77.5956 },
  { id: 'node_lhc', name: 'Lecture Hall Complex Plaza', x: 280, y: 490, lat: 12.9724, lng: 77.5932, locationId: 'lhc-01' },
  { id: 'node_science_lab', name: 'Science Labs Entrance', x: 720, y: 500, lat: 12.9722, lng: 77.5960, locationId: 'sci-02' },
  { id: 'node_central_fountain', name: 'Central Quad Fountain Plaza', x: 500, y: 470, lat: 12.9728, lng: 77.5946 },
  { id: 'node_admin_block', name: 'Main Admin Block Steps & Ramp', x: 500, y: 380, lat: 12.9734, lng: 77.5946, locationId: 'adm-01' },
  { id: 'node_central_hub', name: 'Academic Spine Central Hub', x: 500, y: 320, lat: 12.9736, lng: 77.5946 },
  { id: 'node_library_walk', name: 'Central Library Lawn Entrance', x: 260, y: 330, lat: 12.9738, lng: 77.5930, locationId: 'lib-01' },
  { id: 'node_west_cross_north', name: 'Northwest Pavilion Junction', x: 320, y: 260, lat: 12.9742, lng: 77.5934 },
  { id: 'node_sports_complex', name: 'Sports Arena Pavilion', x: 200, y: 160, lat: 12.9752, lng: 77.5930, locationId: 'spt-01' },
  { id: 'node_cs_centre', name: 'Computer Centre & IT Labs', x: 740, y: 310, lat: 12.9740, lng: 77.5962, locationId: 'cs-lab' },
  { id: 'node_east_cross_north', name: 'Northeast Tech Cross', x: 670, y: 240, lat: 12.9745, lng: 77.5958 },
  { id: 'node_auditorium', name: 'Ambedkar Convention Hall', x: 600, y: 190, lat: 12.9748, lng: 77.5954, locationId: 'aud-01' },
  { id: 'node_innovation_hub', name: 'Innovation & Career Hub', x: 800, y: 170, lat: 12.9752, lng: 77.5962, locationId: 'inc-01' },
  { id: 'node_cafeteria', name: 'Campus Cafeteria Terrace', x: 440, y: 220, lat: 12.9744, lng: 77.5942, locationId: 'can-01' },
  { id: 'node_north_residence', name: 'North Hostels Gateway', x: 480, y: 90, lat: 12.9758, lng: 77.5942, locationId: 'hst-01' },
];

// Campus Walkway Edges with accurate distances in meters
export const CAMPUS_WALKWAY_EDGES: WalkwayEdge[] = [
  // South Entrance Avenue
  { fromNodeId: 'node_gate_02', toNodeId: 'node_gate_01', distanceMeters: 45, isStepFree: true, type: 'paved_walkway', instruction: 'Walk north through the Metro Plaza towards Main Gate' },
  { fromNodeId: 'node_gate_01', toNodeId: 'node_south_cross', distanceMeters: 60, isStepFree: true, type: 'paved_walkway', instruction: 'Proceed north past the Main Security Post along Palm Avenue' },
  { fromNodeId: 'node_south_cross', toNodeId: 'node_health_dispensary', distanceMeters: 120, isStepFree: true, type: 'paved_walkway', instruction: 'Turn left onto the Wellness Walk to reach Health Centre' },
  { fromNodeId: 'node_south_cross', toNodeId: 'node_west_path_1', distanceMeters: 175, isStepFree: true, type: 'paved_walkway', instruction: 'Follow the paved pathway northwest towards Lecture Hall Complex' },
  { fromNodeId: 'node_south_cross', toNodeId: 'node_central_fountain', distanceMeters: 110, isStepFree: true, type: 'paved_walkway', instruction: 'Head straight along the palm promenade toward Central Fountain' },
  { fromNodeId: 'node_south_cross', toNodeId: 'node_east_path_1', distanceMeters: 175, isStepFree: true, type: 'paved_walkway', instruction: 'Turn northeast along the Engineering Walkway' },
  { fromNodeId: 'node_east_path_1', toNodeId: 'node_workshops', distanceMeters: 190, isStepFree: true, type: 'paved_walkway', instruction: 'Take the eastern access road to Engineering Workshops' },

  // South-West Sector (LHC)
  { fromNodeId: 'node_west_path_1', toNodeId: 'node_lhc', distanceMeters: 70, isStepFree: true, type: 'covered_corridor', instruction: 'Follow the covered colonnade into Aryabhata Lecture Hall Complex' },
  { fromNodeId: 'node_west_path_1', toNodeId: 'node_central_fountain', distanceMeters: 180, isStepFree: true, type: 'garden_path', instruction: 'Cross the South Lawn pathway toward Central Fountain' },

  // South-East Sector (Science Labs)
  { fromNodeId: 'node_east_path_1', toNodeId: 'node_science_lab', distanceMeters: 65, isStepFree: true, type: 'covered_corridor', instruction: 'Proceed through the glass corridor into CV Raman Science Labs' },
  { fromNodeId: 'node_east_path_1', toNodeId: 'node_central_fountain', distanceMeters: 180, isStepFree: true, type: 'garden_path', instruction: 'Walk through the manicured lawn toward Central Fountain' },

  // Central Quad & Admin
  { fromNodeId: 'node_central_fountain', toNodeId: 'node_admin_block', distanceMeters: 90, isStepFree: true, type: 'paved_walkway', instruction: 'Walk directly north up the Main Quad to the Admin Block portico' },
  { fromNodeId: 'node_central_fountain', toNodeId: 'node_library_walk', distanceMeters: 275, isStepFree: true, type: 'garden_path', instruction: 'Walk diagonally across the West Quad lawn toward Central Library' },
  { fromNodeId: 'node_central_fountain', toNodeId: 'node_cs_centre', distanceMeters: 280, isStepFree: true, type: 'garden_path', instruction: 'Walk diagonally across the East Quad lawn toward Computer Centre' },

  // Admin Block to Academic Spine
  { fromNodeId: 'node_admin_block', toNodeId: 'node_central_hub', distanceMeters: 60, isStepFree: true, type: 'covered_corridor', instruction: 'Pass through the Admin Block breezeway to Academic Central Hub' },

  // Central Hub connections
  { fromNodeId: 'node_central_hub', toNodeId: 'node_library_walk', distanceMeters: 240, isStepFree: true, type: 'paved_walkway', instruction: 'Take the West Academic Avenue toward Central Library' },
  { fromNodeId: 'node_central_hub', toNodeId: 'node_cs_centre', distanceMeters: 240, isStepFree: true, type: 'paved_walkway', instruction: 'Take the East Academic Avenue toward Computer Centre' },
  { fromNodeId: 'node_central_hub', toNodeId: 'node_cafeteria', distanceMeters: 120, isStepFree: true, type: 'paved_walkway', instruction: 'Walk north along the shaded corridor directly into Campus Cafeteria' },

  // West Sector (Library & Sports)
  { fromNodeId: 'node_lhc', toNodeId: 'node_library_walk', distanceMeters: 165, isStepFree: true, type: 'covered_corridor', instruction: 'Walk north through the covered student galleria to Central Library' },
  { fromNodeId: 'node_library_walk', toNodeId: 'node_west_cross_north', distanceMeters: 90, isStepFree: true, type: 'paved_walkway', instruction: 'Continue north past the Library outdoor reading patio' },
  { fromNodeId: 'node_west_cross_north', toNodeId: 'node_sports_complex', distanceMeters: 155, isStepFree: true, type: 'paved_walkway', instruction: 'Follow the sports avenue into Netaji Subhash Sports Complex' },
  { fromNodeId: 'node_west_cross_north', toNodeId: 'node_cafeteria', distanceMeters: 130, isStepFree: true, type: 'paved_walkway', instruction: 'Turn east toward Campus Cafeteria and Food Court' },

  // East Sector (CS Centre, Auditorium, Innovation Hub)
  { fromNodeId: 'node_science_lab', toNodeId: 'node_cs_centre', distanceMeters: 195, isStepFree: true, type: 'covered_corridor', instruction: 'Take the Technology Skybridge link to APJ Kalam Computer Centre' },
  { fromNodeId: 'node_cs_centre', toNodeId: 'node_east_cross_north', distanceMeters: 100, isStepFree: true, type: 'paved_walkway', instruction: 'Proceed north towards the Auditorium and Innovation plaza' },
  { fromNodeId: 'node_east_cross_north', toNodeId: 'node_auditorium', distanceMeters: 85, isStepFree: true, type: 'paved_walkway', instruction: 'Arrive at Dr. Ambedkar Convention Hall entrance' },
  { fromNodeId: 'node_east_cross_north', toNodeId: 'node_innovation_hub', distanceMeters: 140, isStepFree: true, type: 'paved_walkway', instruction: 'Follow the innovation lane to Career & Incubation Hub' },
  { fromNodeId: 'node_east_cross_north', toNodeId: 'node_cafeteria', distanceMeters: 230, isStepFree: true, type: 'paved_walkway', instruction: 'Walk west past the reflection pond to the Cafeteria' },

  // North Sector (Hostels & Cafeteria)
  { fromNodeId: 'node_cafeteria', toNodeId: 'node_north_residence', distanceMeters: 140, isStepFree: true, type: 'paved_walkway', instruction: 'Head north on the shaded residence boulevard to North Hostels' },
  { fromNodeId: 'node_auditorium', toNodeId: 'node_north_residence', distanceMeters: 155, isStepFree: true, type: 'paved_walkway', instruction: 'Walk northwest along the student residential green to Hostels' },
  { fromNodeId: 'node_sports_complex', toNodeId: 'node_north_residence', distanceMeters: 290, isStepFree: true, type: 'paved_walkway', instruction: 'Follow the northern perimeter track toward North Hostels' },
];

// Helper Dijkstra shortest path algorithm
export function computeCampusRoute(
  fromLocationId: string,
  toLocationId: string,
  requireAccessible: boolean = false,
  allLocations: CampusLocation[] = INITIAL_CAMPUS_LOCATIONS
): RouteComputationResult | null {
  const fromLoc = allLocations.find((l) => l.id === fromLocationId);
  const toLoc = allLocations.find((l) => l.id === toLocationId);

  if (!fromLoc || !toLoc) return null;
  if (fromLocationId === toLocationId) {
    const singleNode = CAMPUS_WALKWAY_NODES.find((n) => n.locationId === fromLocationId) || CAMPUS_WALKWAY_NODES[0];
    return {
      fromLocation: fromLoc,
      toLocation: toLoc,
      pathNodes: [singleNode],
      totalDistanceMeters: 0,
      estimatedMinutes: 0,
      stepCount: 0,
      caloriesBurned: 0,
      steps: [
        {
          stepNumber: 1,
          instruction: `You are already at ${toLoc.name}.`,
          distanceMeters: 0,
          estimatedSeconds: 0,
          icon: 'arrive',
          landmark: toLoc.name,
        },
      ],
      isAccessible: true,
    };
  }

  // Find start and end nodes
  const startNode = CAMPUS_WALKWAY_NODES.find((n) => n.locationId === fromLocationId);
  const endNode = CAMPUS_WALKWAY_NODES.find((n) => n.locationId === toLocationId);

  if (!startNode || !endNode) {
    // Fallback if node direct mapping is missing: find closest node by euclidean distance
    const sNode = findClosestNode(fromLoc.gridPos.x, fromLoc.gridPos.y);
    const eNode = findClosestNode(toLoc.gridPos.x, toLoc.gridPos.y);
    return runDijkstra(fromLoc, toLoc, sNode, eNode, requireAccessible);
  }

  return runDijkstra(fromLoc, toLoc, startNode, endNode, requireAccessible);
}

function findClosestNode(x: number, y: number): WalkwayNode {
  let best = CAMPUS_WALKWAY_NODES[0];
  let minD = Infinity;
  for (const n of CAMPUS_WALKWAY_NODES) {
    const d = Math.hypot(n.x - x, n.y - y);
    if (d < minD) {
      minD = d;
      best = n;
    }
  }
  return best;
}

function runDijkstra(
  fromLoc: CampusLocation,
  toLoc: CampusLocation,
  startNode: WalkwayNode,
  endNode: WalkwayNode,
  requireAccessible: boolean
): RouteComputationResult {
  // Build adjacency list (bi-directional edges)
  const adj: Map<string, { to: string; edge: WalkwayEdge }[]> = new Map();
  CAMPUS_WALKWAY_NODES.forEach((n) => adj.set(n.id, []));

  CAMPUS_WALKWAY_EDGES.forEach((edge) => {
    if (requireAccessible && !edge.isStepFree) return; // skip staircases if wheelchair required

    adj.get(edge.fromNodeId)?.push({ to: edge.toNodeId, edge });
    adj.get(edge.toNodeId)?.push({
      to: edge.fromNodeId,
      edge: {
        ...edge,
        fromNodeId: edge.toNodeId,
        toNodeId: edge.fromNodeId,
      },
    });
  });

  const distances: Map<string, number> = new Map();
  const previous: Map<string, { node: string; edge: WalkwayEdge } | null> = new Map();
  const unvisited = new Set<string>();

  CAMPUS_WALKWAY_NODES.forEach((n) => {
    distances.set(n.id, Infinity);
    previous.set(n.id, null);
    unvisited.add(n.id);
  });

  distances.set(startNode.id, 0);

  while (unvisited.size > 0) {
    let currNodeId: string | null = null;
    let shortestDist = Infinity;

    unvisited.forEach((id) => {
      const d = distances.get(id) ?? Infinity;
      if (d < shortestDist) {
        shortestDist = d;
        currNodeId = id;
      }
    });

    if (currNodeId === null || shortestDist === Infinity) break;
    if (currNodeId === endNode.id) break;

    unvisited.delete(currNodeId);

    const neighbors = adj.get(currNodeId) || [];
    for (const { to, edge } of neighbors) {
      if (!unvisited.has(to)) continue;

      const alt = shortestDist + edge.distanceMeters;
      if (alt < (distances.get(to) ?? Infinity)) {
        distances.set(to, alt);
        previous.set(to, { node: currNodeId, edge });
      }
    }
  }

  // Backtrack path
  const pathNodeIds: string[] = [];
  const pathEdges: WalkwayEdge[] = [];
  let curr: string | null = endNode.id;

  while (curr) {
    pathNodeIds.unshift(curr);
    const prevEntry = previous.get(curr);
    if (!prevEntry) break;
    pathEdges.unshift(prevEntry.edge);
    curr = prevEntry.node;
  }

  // If path disconnected, fallback direct connection
  const pathNodes = pathNodeIds.map((id) => CAMPUS_WALKWAY_NODES.find((n) => n.id === id)!).filter(Boolean);
  if (pathNodes.length === 0 || pathNodes[0].id !== startNode.id) {
    pathNodes.length = 0;
    pathNodes.push(startNode, endNode);
  }

  const totalDistanceMeters =
    pathEdges.reduce((acc, e) => acc + e.distanceMeters, 0) ||
    Math.round(Math.hypot(startNode.x - endNode.x, startNode.y - endNode.y) * 0.8);

  // Standard pedestrian speed: ~75 meters/min (1.25 m/s)
  const estimatedMinutes = Math.max(1, Math.round(totalDistanceMeters / 75));
  const stepCount = Math.round(totalDistanceMeters * 1.35); // ~0.74m per step
  const caloriesBurned = Math.round(totalDistanceMeters * 0.045); // ~45 kcal per km

  // Generate directions
  const steps: NavigationStep[] = [];
  steps.push({
    stepNumber: 1,
    instruction: `Start at ${fromLoc.name} (${fromLoc.code}). Check your belongings and proceed outside to the walkway.`,
    distanceMeters: 0,
    estimatedSeconds: 0,
    icon: 'straight',
    landmark: fromLoc.name,
  });

  if (pathEdges.length > 0) {
    pathEdges.forEach((edge, idx) => {
      const toNode = CAMPUS_WALKWAY_NODES.find((n) => n.id === edge.toNodeId);
      steps.push({
        stepNumber: idx + 2,
        instruction: edge.instruction,
        distanceMeters: edge.distanceMeters,
        estimatedSeconds: Math.round(edge.distanceMeters / 1.25),
        icon: idx % 2 === 0 ? 'straight' : 'slight-right',
        landmark: toNode?.name,
      });
    });
  } else {
    steps.push({
      stepNumber: 2,
      instruction: `Walk directly along the main quad walkway towards ${toLoc.name}.`,
      distanceMeters: totalDistanceMeters,
      estimatedSeconds: Math.round(totalDistanceMeters / 1.25),
      icon: 'straight',
      landmark: toLoc.name,
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    instruction: `You have arrived at ${toLoc.name} (${toLoc.code}). Entrance is accessible on Ground Level.`,
    distanceMeters: 0,
    estimatedSeconds: 0,
    icon: 'arrive',
    landmark: toLoc.name,
  });

  return {
    fromLocation: fromLoc,
    toLocation: toLoc,
    pathNodes,
    totalDistanceMeters,
    estimatedMinutes,
    stepCount,
    caloriesBurned,
    steps,
    isAccessible: requireAccessible || fromLoc.isAccessible && toLoc.isAccessible,
  };
}
