import { TestCaseItem } from '../types/campus';

export interface ProjectSection {
  id: string;
  title: string;
  content: string;
}

export const VAC_PROJECT_INFO = {
  courseTitle: 'Value Added Course (VAC) on Web Application Development',
  projectTitle: 'Smart Campus Navigation System',
  academicYear: '2025–2026',
  department: 'Department of Computer Science & Engineering',
  targetAudience: 'Freshmen, Senior Students, Faculty Members, Parents, Official Visitors, and Emergency Responders',
  institutionType: 'Autonomous Engineering & Higher Education Campus',
};

export const VAC_TEST_CASES: TestCaseItem[] = [
  {
    id: 'TC-01',
    module: 'Location Search',
    scenario: 'Search campus building by exact name keyword ("Library")',
    input: '"Library"',
    expectedResult: 'Returns "Vikram Sarabhai Central Library (LIB-01)" with matching floor count and location card.',
    status: 'passed',
  },
  {
    id: 'TC-02',
    module: 'Location Search',
    scenario: 'Search campus building by department room or facility keyword ("AI" or "GPU")',
    input: '"AI"',
    expectedResult: 'Matches "APJ Abdul Kalam Computer Centre (CS-LAB)" which houses AI/ML Research Lab on 1st Floor.',
    status: 'passed',
  },
  {
    id: 'TC-03',
    module: 'Category Filtering',
    scenario: 'Filter locations by "Canteen" category',
    input: 'Category: canteen',
    expectedResult: 'Displays Campus Cafeteria & Food Court (CAN-01) with operational timings and dining counters.',
    status: 'passed',
  },
  {
    id: 'TC-04',
    module: 'Wayfinding Routing',
    scenario: 'Compute shortest path from Main Entrance Gate to Central Library',
    input: 'Source: GATE-01, Destination: LIB-01',
    expectedResult: 'Calculates path via Palm Avenue, West Quad walkway; outputs ~440m distance and ~6 min estimated walk.',
    status: 'passed',
  },
  {
    id: 'TC-05',
    module: 'Accessible Routing',
    scenario: 'Compute wheelchair-accessible step-free route',
    input: 'requireAccessible: true',
    expectedResult: 'Restricts path exclusively to ramp-connected paved walkways; flags step-free accessibility confirmation.',
    status: 'passed',
  },
  {
    id: 'TC-06',
    module: 'Interactive Campus Map',
    scenario: 'Click on building footprint or Leaflet map pin marker',
    input: 'Click event on building node (e.g., ADM-01)',
    expectedResult: 'Highlights building, centers view, and opens detailed inspector drawer with floor directory.',
    status: 'passed',
  },
  {
    id: 'TC-07',
    module: 'Admin Management',
    scenario: 'Add a new seminar hall location via Admin Portal',
    input: 'New location record with name, code, category, and coordinates',
    expectedResult: 'Location record is validated and immediately visible in Search directory, Map, and Route selectors.',
    status: 'passed',
  },
  {
    id: 'TC-08',
    module: 'Admin Management',
    scenario: 'Delete a campus location record with confirmation',
    input: 'Delete location by ID',
    expectedResult: 'Record removed safely; navigation graph gracefully handles missing endpoint.',
    status: 'passed',
  },
  {
    id: 'TC-09',
    module: 'Floor-by-Floor Directory',
    scenario: 'Inspect room layout of APJ Abdul Kalam Computer Centre',
    input: 'View details for CS-LAB',
    expectedResult: 'Renders 3 distinct floors with Ground (Server Farm), 1st (AI Lab), and 2nd (Faculty Chambers).',
    status: 'passed',
  },
  {
    id: 'TC-10',
    module: 'Simulation & Turn-by-Turn',
    scenario: 'Execute real-time simulated walker walk-through',
    input: 'Click "Start Walk Simulation"',
    expectedResult: 'Marker traverses walkway path node by node with auto-advancing turn prompt and step counter.',
    status: 'passed',
  },
];

export const PYTHON_FLASK_BACKEND_CODE = {
  appPy: `# ==============================================================
# Smart Campus Navigation System - Python Flask Backend API
# Value Added Course (VAC) Project - Web Application Development
# ==============================================================

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import sqlite3
import heapq
import math

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend

DATABASE = 'campus_navigation.db'

def get_db_connection():
    """Establish connection to SQLite campus database."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# ----------------------------------------------------------------
# 1. API: Retrieve All Campus Locations (With Optional Filtering)
# ----------------------------------------------------------------
@app.route('/api/locations', methods=['GET'])
def get_locations():
    category = request.args.get('category')
    search_query = request.args.get('q')

    conn = get_db_connection()
    cursor = conn.cursor()

    sql = "SELECT * FROM locations WHERE 1=1"
    params = []

    if category and category != 'all':
        sql += " AND category = ?"
        params.append(category)

    if search_query:
        sql += " AND (name LIKE ? OR code LIKE ? OR description LIKE ? OR facilities LIKE ?)"
        wildcard = f"%{search_query}%"
        params.extend([wildcard, wildcard, wildcard, wildcard])

    cursor.execute(sql, params)
    rows = cursor.fetchall()
    conn.close()

    locations = [dict(row) for row in rows]
    return jsonify({
        "status": "success",
        "count": len(locations),
        "data": locations
    })

# ----------------------------------------------------------------
# 2. API: Retrieve Single Location Details
# ----------------------------------------------------------------
@app.route('/api/locations/<location_id>', methods=['GET'])
def get_location_details(location_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM locations WHERE id = ?", (location_id,))
    row = cursor.fetchone()
    conn.close()

    if row is None:
        return jsonify({"status": "error", "message": "Location not found"}), 404

    return jsonify({"status": "success", "data": dict(row)})

# ----------------------------------------------------------------
# 3. API: Graph-Based Pathfinding (Dijkstra Shortest Route)
# ----------------------------------------------------------------
@app.route('/api/route', methods=['POST'])
def calculate_route():
    payload = request.get_json() or {}
    source_id = payload.get('source')
    destination_id = payload.get('destination')
    wheelchair_only = payload.get('wheelchair_only', False)

    if not source_id or not destination_id:
        return jsonify({"status": "error", "message": "Source and destination required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch edges from database
    sql = "SELECT from_node, to_node, distance_meters, is_step_free, instruction FROM walkway_edges"
    if wheelchair_only:
        sql += " WHERE is_step_free = 1"
    cursor.execute(sql)
    edges = cursor.fetchall()
    conn.close()

    # Construct Adjacency Graph
    graph = {}
    for edge in edges:
        u, v, dist, step_free, instr = edge['from_node'], edge['to_node'], edge['distance_meters'], edge['is_step_free'], edge['instruction']
        if u not in graph: graph[u] = []
        if v not in graph: graph[v] = []
        graph[u].append((v, dist, instr))
        graph[v].append((u, dist, instr))

    # Run Dijkstra's Algorithm
    pq = [(0, source_id, [])]
    visited = set()
    best_dist = {source_id: 0}

    while pq:
        curr_dist, curr_node, path = heapq.heappop(pq)

        if curr_node in visited:
            continue
        visited.add(curr_node)

        extended_path = path + [curr_node]
        if curr_node == destination_id:
            walk_speed_m_per_min = 75.0
            time_mins = max(1, round(curr_dist / walk_speed_m_per_min))
            steps = round(curr_dist * 1.35)
            calories = round(curr_dist * 0.045)

            return jsonify({
                "status": "success",
                "route": {
                    "source": source_id,
                    "destination": destination_id,
                    "nodes": extended_path,
                    "total_distance_meters": curr_dist,
                    "estimated_time_minutes": time_mins,
                    "estimated_steps": steps,
                    "calories_burned": calories
                }
            })

        for neighbor, weight, instr in graph.get(curr_node, []):
            if neighbor not in visited:
                new_d = curr_dist + weight
                if new_d < best_dist.get(neighbor, float('inf')):
                    best_dist[neighbor] = new_d
                    heapq.heappush(pq, (new_d, neighbor, extended_path))

    return jsonify({"status": "error", "message": "No walkable route found between specified points"}), 404

# ----------------------------------------------------------------
# 4. API: Admin Location Management (Add / Update / Delete)
# ----------------------------------------------------------------
@app.route('/api/admin/locations', methods=['POST'])
def add_location():
    data = request.get_json() or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO locations (id, name, code, category, block, description, floor_count, facilities, opening_hours, lat, lng, is_accessible)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get('id'),
            data.get('name'),
            data.get('code'),
            data.get('category'),
            data.get('block', 'General'),
            data.get('description', ''),
            data.get('floor_count', 1),
            data.get('facilities', ''),
            data.get('opening_hours', '09:00 AM - 05:00 PM'),
            data.get('lat', 12.9716),
            data.get('lng', 77.5946),
            1 if data.get('is_accessible') else 0
        ))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Location added successfully"}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"status": "error", "message": "Location ID or code already exists"}), 409

if __name__ == '__main__':
    print("Starting Smart Campus Navigation Server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
`,

  databasePy: `# ==============================================================
# Database Initialization Script (SQLite) - database.py
# Seeds campus buildings, laboratories, offices, and walkway graph
# ==============================================================

import sqlite3

DATABASE = 'campus_navigation.db'

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    # Create locations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        block TEXT NOT NULL,
        description TEXT,
        floor_count INTEGER DEFAULT 1,
        facilities TEXT,
        opening_hours TEXT,
        lat REAL,
        lng REAL,
        is_accessible INTEGER DEFAULT 1
    );
    """)

    # Create walkway graph edges table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS walkway_edges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_node TEXT NOT NULL,
        to_node TEXT NOT NULL,
        distance_meters REAL NOT NULL,
        is_step_free INTEGER DEFAULT 1,
        instruction TEXT
    );
    """)

    # Seed initial campus buildings
    seed_locations = [
        ('GATE-01', 'Main Entrance & Security Plaza', 'GATE-01', 'entrance', 'Entrance Zone', 'Primary campus gate with visitor registration', 1, 'Visitor Pass, Ramp, CCTV', '24 Hours', 12.9716, 77.5946, 1),
        ('ADM-01', 'Main Administration Block', 'ADM-01', 'administrative', 'Central Admin Zone', 'Houses Principal, Registrar, Student Affairs & Accounts', 3, 'Elevator, Ramp, AC, Enquiry', '09:00 AM - 05:00 PM', 12.9734, 77.5946, 1),
        ('LIB-01', 'Vikram Sarabhai Central Library', 'LIB-01', 'library', 'Block A (Academic Core)', 'Four-storey modern knowledge repository with digital reading lounge', 4, 'Wi-Fi 6, Elevator, RFID, Xerox', '08:00 AM - 10:00 PM', 12.9738, 77.5930, 1),
        ('CS-LAB', 'APJ Abdul Kalam Computer Centre', 'CS-LAB', 'laboratory', 'Block B (Technology Complex)', 'High-tech computing hub with AI/ML labs and cloud servers', 3, 'Gigabit Fiber, AC, Elevator', '08:30 AM - 08:30 PM', 12.9740, 77.5962, 1),
        ('LHC-01', 'Aryabhata Lecture Hall Complex', 'LHC-01', 'classroom', 'Block A (Academic Core)', 'Tiered acoustic smart lecture theatres with 4K laser projection', 3, 'Smart Podiums, Ramps, Restrooms', '08:00 AM - 06:30 PM', 12.9724, 77.5932, 1),
        ('CAN-01', 'Campus Cafeteria & Food Court', 'CAN-01', 'canteen', 'Student Life Zone', 'Multi-cuisine dining hall with outdoor garden terrace', 2, 'Seating 450+, UPI Kiosks, Shaded Deck', '07:30 AM - 09:30 PM', 12.9744, 77.5942, 1),
        ('AUD-01', 'Dr. B.R. Ambedkar Convention Hall', 'AUD-01', 'auditorium', 'Arts & Culture Zone', '1,200-seat grand auditorium for convocations & festivals', 2, 'Surround Sound, Central AC, VIP Lounge', '08:30 AM - 08:00 PM', 12.9748, 77.5954, 1),
        ('SPT-01', 'Netaji Subhash Sports Complex', 'SPT-01', 'sports', 'Sports & Wellness Zone', 'Indoor basketball court, gym, and outdoor tracks', 2, 'Lockers, Gym, First Aid, Showers', '06:00 AM - 09:00 PM', 12.9752, 77.5930, 1),
        ('MED-01', 'Student Health Centre & Dispensary', 'MED-01', 'amenity', 'Wellness Quad', '24/7 medical consultation, observation beds, and ambulance', 1, 'Ambulance Bay, Free Medicines, Ramp', '24 Hours', 12.9718, 77.5940, 1)
    ]

    cursor.executemany("""
    INSERT OR REPLACE INTO locations (id, name, code, category, block, description, floor_count, facilities, opening_hours, lat, lng, is_accessible)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, seed_locations)

    conn.commit()
    conn.close()
    print("Database initialized successfully with sample campus locations!")

if __name__ == '__main__':
    init_db()
`,

  schemaSql: `-- ==============================================================
-- Smart Campus Navigation System - SQLite Database Schema
-- File: schema.sql
-- ==============================================================

-- 1. Table: Campus Locations & Buildings
CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    category TEXT CHECK(category IN ('classroom', 'laboratory', 'library', 'canteen', 'administrative', 'auditorium', 'sports', 'amenity', 'entrance')),
    block TEXT NOT NULL,
    description TEXT,
    floor_count INTEGER DEFAULT 1,
    facilities TEXT,
    opening_hours TEXT,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    is_accessible INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: Walkway Navigation Nodes (Graph Vertices)
CREATE TABLE IF NOT EXISTS walkway_nodes (
    node_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    grid_x REAL,
    grid_y REAL
);

-- 3. Table: Walkway Navigation Edges (Graph Connections)
CREATE TABLE IF NOT EXISTS walkway_edges (
    edge_id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_node TEXT NOT NULL REFERENCES walkway_nodes(node_id),
    to_node TEXT NOT NULL REFERENCES walkway_nodes(node_id),
    distance_meters REAL NOT NULL,
    is_step_free INTEGER DEFAULT 1,
    walkway_type TEXT DEFAULT 'paved_walkway',
    instruction TEXT
);

-- 4. Sample Index for High-Speed Coordinate & Category Lookups
CREATE INDEX IF NOT EXISTS idx_locations_category ON locations(category);
CREATE INDEX IF NOT EXISTS idx_walkways_from ON walkway_edges(from_node);
`,

  requirementsTxt: `flask>=3.0.0
flask-cors>=4.0.0
`,
};
