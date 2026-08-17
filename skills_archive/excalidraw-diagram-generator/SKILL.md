---
name: excalidraw-diagram-generator
description: 'Generate Excalidraw diagrams from natural language descriptions. Use when asked to "create a diagram", "make a flowchart", "visualize a process", "draw a system architecture", "create a mind map", or "generate an Excalidraw file". Supports flowcharts, relationship diagrams, mind maps, and system architecture diagrams. Outputs .excalidraw JSON files that can be opened directly in Excalidraw.'
---

# Excalidraw Diagram Generator

A skill for generating Excalidraw-format diagrams from natural language descriptions. This skill helps create visual representations of processes, systems, relationships, and ideas without manual drawing.

## When to Use This Skill

Use this skill when users request:

- "Create a diagram showing..."
- "Make a flowchart for..."
- "Visualize the process of..."
- "Draw the system architecture of..."
- "Generate a mind map about..."
- "Create an Excalidraw file for..."
- "Show the relationship between..."
- "Diagram the workflow of..."

**Supported diagram types:**
- 📊 **Flowcharts**: Sequential processes, workflows, decision trees
- 🔗 **Relationship Diagrams**: Entity relationships, system components, dependencies
- 🧠 **Mind Maps**: Concept hierarchies, brainstorming results, topic organization
- 🏗️ **Architecture Diagrams**: System design, module interactions, data flow
- 📈 **Data Flow Diagrams (DFD)**: Data flow visualization, data transformation processes
- 🏊 **Business Flow (Swimlane)**: Cross-functional workflows, actor-based process flows
- 📦 **Class Diagrams**: Object-oriented design, class structures and relationships
- 🔄 **Sequence Diagrams**: Object interactions over time, message flows
- 🗃️ **ER Diagrams**: Database entity relationships, data models

## Prerequisites

- Clear description of what should be visualized
- Identification of key entities, steps, or concepts
- Understanding of relationships or flow between elements

## Step-by-Step Workflow

### Step 1: Understand the Request

Analyze the user's description to determine:
1. **Diagram type** (flowchart, relationship, mind map, architecture)
2. **Key elements** (entities, steps, concepts)
3. **Relationships** (flow, connections, hierarchy)
4. **Complexity** (number of elements)

### Step 2: Choose the Appropriate Diagram Type

| User Intent | Diagram Type | Example Keywords |
|-------------|--------------|------------------|
| Process flow, steps, procedures | **Flowchart** | "workflow", "process", "steps", "procedure" |
| Connections, dependencies, associations | **Relationship Diagram** | "relationship", "connections", "dependencies", "structure" |
| Concept hierarchy, brainstorming | **Mind Map** | "mind map", "concepts", "ideas", "breakdown" |
| System design, components | **Architecture Diagram** | "architecture", "system", "components", "modules" |
| Data flow, transformation processes | **Data Flow Diagram (DFD)** | "data flow", "data processing", "data transformation" |
| Cross-functional processes, actor responsibilities | **Business Flow (Swimlane)** | "business process", "swimlane", "actors", "responsibilities" |
| Object-oriented design, class structures | **Class Diagram** | "class", "inheritance", "OOP", "object model" |
| Interaction sequences, message flows | **Sequence Diagram** | "sequence", "interaction", "messages", "timeline" |
| Database design, entity relationships | **ER Diagram** | "database", "entity", "relationship", "data model" |

### Step 3: Extract Structured Information

**For Flowcharts:**
- List of sequential steps
- Decision points (if any) — each decision diamond must have a label on every outgoing arrow (e.g. "YES"/"NO", "Pass"/"Fail", or a short condition phrase)
- Start and end points

**For Relationship Diagrams:**
- Entities/nodes (name + optional description)
- Relationships between entities (from → to, with label)

**For Mind Maps:**
- Central topic
- Main branches (3-6 recommended)
- Sub-topics for each branch (optional)

**For Data Flow Diagrams (DFD):**
- Data sources and destinations (external entities)
- Processes (data transformations)
- Data stores (databases, files)
- Data flows (arrows showing data movement from left-to-right or from top-left to bottom-right)
- **Important**: Do not represent process order, only data flow

**For Business Flow (Swimlane):**
- Actors/roles (departments, systems, people) - displayed as header columns
- Process lanes (vertical lanes under each actor)
- Process boxes (activities within each lane)
- Flow arrows (connecting process boxes, including cross-lane handoffs)

**For Class Diagrams:**
- Classes with names
- Attributes with visibility (+, -, #)
- Methods with visibility and parameters
- Relationships: inheritance (solid line + white triangle), implementation (dashed line + white triangle), association (solid line), dependency (dashed line), aggregation (solid line + white diamond), composition (solid line + filled diamond)
- Multiplicity notations (1, 0..1, 1..*, *)

**For Sequence Diagrams:**
- Objects/actors (arranged horizontally at top)
- Lifelines (vertical lines from each object)
- Messages (horizontal arrows between lifelines)
- Synchronous messages (solid arrow), asynchronous messages (dashed arrow)
- Return values (dashed arrows)
- Activation boxes (rectangles on lifelines during execution)
- Time flows from top to bottom

**For ER Diagrams:**
- Entities (rectangles with entity names)
- Attributes (listed inside entities)
- Primary keys (underlined or marked with PK)
- Foreign keys (marked with FK)
- Relationships (lines connecting entities)
- Cardinality: 1:1 (one-to-one), 1:N (one-to-many), N:M (many-to-many)
- Junction/associative entities for many-to-many relationships (dashed rectangles)

### Step 4: Generate the Excalidraw JSON

Create the `.excalidraw` file with appropriate elements:

**Available element types:**
- `rectangle`: Boxes for entities, steps, concepts
- `ellipse`: Alternative shapes for emphasis
- `diamond`: Decision points
- `arrow`: Directional connections
- `text`: Labels and annotations

**Key properties to set:**
- **Position**: `x`, `y` coordinates
- **Size**: `width`, `height`
- **Style**: `strokeColor`, `backgroundColor`, `fillStyle`
- **Font**: `fontFamily: 1` (Virgil - **required for all text elements**)
- **Index**: `index` must be a zero-padded 6-digit string in format `"a000000"`, `"a000001"`, `"a000002"`, etc., assigned sequentially to every element in element-array order. This is Excalidraw's fractional-index format, required for load validation. Formats like `"a1"`, `"a0a"`, or `"a0b"` will cause Excalidraw to reject the file on load.
- **Text in shapes**: Use a separate `type: "text"` element with `containerId` pointing to the parent shape; add `{"id": "<text-id>", "type": "text"}` to the shape's `boundElements` array. **Never put text properties directly on shape elements** — they will not render in modern Excalidraw.
- **Arrow bindings**: Every arrow connecting two shapes **must** have `startBinding` and `endBinding` set (never `null`). Each connected shape must also list the arrow in its `boundElements` array. Without this, arrows render as floating segments that don't snap to shape edges.
- **Arrow routing**: All arrows must include `"elbowed": true` and `"roundness": null` for right-angle elbow routing.

**Arrow binding pattern** (required for all arrows that connect shapes):
```json
// Arrow element — startBinding and endBinding reference the connected shapes
{
  "id": "arrow1",
  "type": "arrow",
  "x": 500, "y": 280,
  "points": [[0,0],[0,100]],
  "elbowed": true,
  "roundness": null,
  "startBinding": { "elementId": "step1", "focus": 0, "gap": 8 },
  "endBinding":   { "elementId": "step2", "focus": 0, "gap": 8 }
}
// Source shape — lists both text label AND arrow in boundElements
{
  "id": "step1", "type": "rectangle", ...,
  "boundElements": [
    {"id": "step1-label", "type": "text"},
    {"id": "arrow1",      "type": "arrow"}
  ]
}
// Target shape — same
{
  "id": "step2", "type": "rectangle", ...,
  "boundElements": [
    {"id": "step2-label", "type": "text"},
    {"id": "arrow1",      "type": "arrow"}
  ]
}
```
Binding fields: `elementId` = connected shape ID; `focus` = `-1` to `1` (0 = center of edge); `gap` = `8` (clearance between arrow tip and shape edge).

**CRITICAL — arrow coordinates must match shape edges**: Bindings snap the arrow tip to the nearest point on the shape's edge, but they do NOT reroute an arrow whose raw coordinates are far from the shape. If an arrow's start point is nowhere near the source shape, it will render as a floating segment. Always calculate arrow coordinates from the actual shape geometry:

| Shape type | Edge points |
|-----------|-------------|
| Rectangle (x, y, w, h) | left=(x, y+h/2), right=(x+w, y+h/2), top=(x+w/2, y), bottom=(x+w/2, y+h) |
| Diamond (x, y, w, h) | left=(x, y+h/2), right=(x+w, y+h/2), top=(x+w/2, y), bottom=(x+w/2, y+h) |
| Ellipse (x, y, w, h) | same cardinal points as rectangle/diamond |

Arrow start (`x`, `y`) ≈ exit edge of source shape; arrow end (`x+points[-1][0]`, `y+points[-1][1]`) ≈ entry edge of target shape. Use `gap: 8` to stop just before the edge.

**Example**: source rectangle at x=400, y=200, w=200, h=80 → right edge at (600, 240); target rectangle at x=720, y=200, w=200, h=80 → left edge at (720, 240). Arrow: `x=600, y=240, points=[[0,0],[120,0]]` (horizontal, 120px wide, 8px gap handled by binding).

**Bound text element pattern** (required for all shape labels):
```json
// 1. Shape element — no text properties, boundElements references the label
{
  "id": "box1",
  "type": "rectangle",
  "x": 400, "y": 200, "width": 200, "height": 80,
  "boundElements": [{"id": "box1-label", "type": "text"}]
}
// 2. Separate text element — containerId links it to the shape
{
  "id": "box1-label",
  "type": "text",
  "x": 410, "y": 228, "width": 180, "height": 25,
  "angle": 0, "strokeColor": "#282a36", "backgroundColor": "transparent",
  "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
  "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
  "index": "a0a", "roundness": null,
  "seed": 1234567891, "version": 1, "versionNonce": 987654322,
  "isDeleted": false, "boundElements": [], "updated": 1706659200000,
  "link": null, "locked": false,
  "text": "Step 1", "fontSize": 20, "fontFamily": 1,
  "textAlign": "center", "verticalAlign": "middle",
  "containerId": "box1", "originalText": "Step 1",
  "lineHeight": 1.25
}
```
**Text color rule**: use `"#282a36"` (dark) on light/bright backgrounds; use `"#f8f8f2"` (light) on dark/purple (`#bd93f9`) backgrounds.

**Important**: All text elements must use `fontFamily: 1` (Virgil) for consistent visual appearance.

### Step 5: Format the Output

Structure the complete Excalidraw file:

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    // Array of diagram elements
  ],
  "appState": {
    "viewBackgroundColor": "#282a36",
    "gridSize": 20
  },
  "files": {}
}
```

### Step 6: Save and Provide Instructions

1. Save as `<descriptive-name>.excalidraw`
2. Inform user how to open:
   - Visit https://excalidraw.com
   - Click "Open" or drag-and-drop the file
   - Or use Excalidraw VS Code extension

## Best Practices

### Element Count Guidelines

| Diagram Type | Recommended Count | Maximum |
|--------------|-------------------|---------|
| Flowchart steps | 3-10 | 15 |
| Relationship entities | 3-8 | 12 |
| Mind map branches | 4-6 | 8 |
| Mind map sub-topics per branch | 2-4 | 6 |

### Layout Tips

1. **Start positions**: Center important elements, use consistent spacing
2. **Spacing**: 
   - Horizontal gap: 200-300px between elements
   - Vertical gap: 100-150px between rows
3. **Colors**: Use consistent color scheme (Dracula dark theme)
   - Primary elements: Purple (`#bd93f9`)
   - Secondary elements: Green (`#50fa7b`)
   - Important/Central: Yellow (`#f1fa8c`)
   - Alerts/Warnings: Red (`#ff5555`)
   - Text/Stroke color: Light gray (`#f8f8f2`)
   - Canvas background: Dark gray (`#282a36`)
4. **Text sizing**: 16-24px for readability
5. **Font**: Always use `fontFamily: 1` (Virgil) for all text elements
6. **Arrow style**: Use straight arrows for simple flows, curved for complex relationships

### Complexity Management

**If user request has too many elements:**
- Suggest breaking into multiple diagrams
- Focus on main elements first
- Offer to create detailed sub-diagrams

**Example response:**
```
"Your request includes 15 components. For clarity, I recommend:
1. High-level architecture diagram (6 main components)
2. Detailed diagram for each subsystem

Would you like me to start with the high-level view?"
```

## Example Prompts and Responses

### Example 1: Simple Flowchart

**User:** "Create a flowchart for user registration"

**Agent generates:**
1. Extract steps: "Enter email" → "Verify email" → "Set password" → "Complete"
2. Create flowchart with 4 rectangles + 3 arrows
3. Save as `user-registration-flow.excalidraw`

### Example 2: Relationship Diagram

**User:** "Diagram the relationship between User, Post, and Comment entities"

**Agent generates:**
1. Entities: User, Post, Comment
2. Relationships: User → Post ("creates"), User → Comment ("writes"), Post → Comment ("contains")
3. Save as `user-content-relationships.excalidraw`

### Example 3: Mind Map

**User:** "Mind map about machine learning concepts"

**Agent generates:**
1. Center: "Machine Learning"
2. Branches: Supervised Learning, Unsupervised Learning, Reinforcement Learning, Deep Learning
3. Sub-topics under each branch
4. Save as `machine-learning-mindmap.excalidraw`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Elements overlap | Increase spacing between coordinates |
| Text doesn't fit in boxes | Increase box width or reduce font size |
| Too many elements | Break into multiple diagrams |
| Unclear layout | Use grid layout (rows/columns) or radial layout (mind maps) |
| Colors inconsistent | Define color palette upfront based on element types |

## Advanced Techniques

### Grid Layout (for Relationship Diagrams)
```javascript
const columns = Math.ceil(Math.sqrt(entityCount));
const x = startX + (index % columns) * horizontalGap;
const y = startY + Math.floor(index / columns) * verticalGap;
```

### Radial Layout (for Mind Maps)
```javascript
const angle = (2 * Math.PI * index) / branchCount;
const x = centerX + radius * Math.cos(angle);
const y = centerY + radius * Math.sin(angle);
```

### Auto-generated IDs
Use timestamp + random string for unique IDs:
```javascript
const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
```

## Output Format

Always provide:
1. ✅ Complete `.excalidraw` JSON file
2. 📊 Summary of what was created
3. 📝 Element count
4. 💡 Instructions for opening/editing

**Example summary:**
```
Created: user-workflow.excalidraw
Type: Flowchart
Elements: 7 rectangles, 6 arrows, 1 title text
Total: 14 elements

To view:
1. Visit https://excalidraw.com
2. Drag and drop user-workflow.excalidraw
3. Or use File → Open in Excalidraw VS Code extension
```

## Validation Checklist

Before delivering the diagram:
- [ ] All elements have unique IDs
- [ ] **Every element has an `index` field in zero-padded 6-digit format (`"a000000"`, `"a000001"`, …) assigned sequentially** — no `"a1"`/`"a2"` or `"a0a"`/`"a0b"` values, which cause Excalidraw load failures
- [ ] Coordinates prevent overlapping
- [ ] Text is readable (font size 16+)
- [ ] **All shape labels use separate bound `text` elements with `containerId` — no text properties on shape elements**
- [ ] **All text elements use `fontFamily: 1` (Virgil)**
- [ ] **All arrows connecting shapes have `startBinding` and `endBinding` set (not null)**
- [ ] **All connected shapes list each arrow's ID in their `boundElements` arrays**
- [ ] **Arrow start point (`x`, `y`) is approximately on the source shape's exit edge; arrow end point is approximately on the target shape's entry edge** — bindings snap the tip precisely but cannot reroute an arrow whose coordinates are far from the shape
- [ ] **Every outgoing arrow from a decision diamond has a floating text label** (YES/NO, condition phrase, etc.) positioned near the arrow's midpoint with `strokeColor: "#f8f8f2"` and `backgroundColor: "transparent"`
- [ ] Colors follow Dracula dark theme scheme
- [ ] File is valid JSON
- [ ] Element count is reasonable (<20 for clarity)

## Icon Libraries (Optional Enhancement)

For specialized diagrams (e.g., AWS/GCP/Azure architecture diagrams), you can use pre-made icon libraries from Excalidraw. This provides professional, standardized icons instead of basic shapes.

### When User Requests Icons

**If user asks for AWS/cloud architecture diagrams or mentions wanting to use specific icons:**

1. **Check if library exists**: Look for `libraries/<library-name>/reference.md`
2. **If library exists**: Proceed to use icons (see AI Assistant Workflow below)
3. **If library does NOT exist**: Respond with setup instructions:

   ```
   To use [AWS/GCP/Azure/etc.] architecture icons, please follow these steps:
   
   1. Visit https://libraries.excalidraw.com/
   2. Search for "[AWS Architecture Icons/etc.]" and download the .excalidrawlib file
   3. Create directory: skills/excalidraw-diagram-generator/libraries/[icon-set-name]/
   4. Place the downloaded file in that directory
   5. Run the splitter script:
      python skills/excalidraw-diagram-generator/scripts/split-excalidraw-library.py skills/excalidraw-diagram-generator/libraries/[icon-set-name]/
   
   This will split the library into individual icon files for efficient use.
   After setup is complete, I can create your diagram using the actual AWS/cloud icons.
   
   Alternatively, I can create the diagram now using simple shapes (rectangles, ellipses) 
   which you can later replace with icons manually in Excalidraw.
   ```

### AI Assistant Workflow

**When icon libraries are available in `libraries/`:**

**RECOMMENDED APPROACH: Use Python Scripts (Efficient & Reliable)**

The repository includes Python scripts that handle icon integration automatically:

1. **Create base diagram structure**:
   - Create `.excalidraw` file with basic layout (title, boxes, regions)
   - This establishes the canvas and overall structure

2. **Add icons using Python script**:
   ```bash
   python skills/excalidraw-diagram-generator/scripts/add-icon-to-diagram.py \
     <diagram-path> <icon-name> <x> <y> [--label "Text"] [--library-path PATH]
   ```
   - Edit via `.excalidraw.edit` is enabled by default to avoid overwrite issues; pass `--no-use-edit-suffix` to disable.
   
   **Examples**:
   ```bash
   # Add EC2 icon at position (400, 300) with label
   python scripts/add-icon-to-diagram.py diagram.excalidraw EC2 400 300 --label "Web Server"
   
   # Add VPC icon at position (200, 150)
   python scripts/add-icon-to-diagram.py diagram.excalidraw VPC 200 150
   
   # Add icon from different library
   python scripts/add-icon-to-diagram.py diagram.excalidraw Compute-Engine 500 200 \
     --library-path libraries/gcp-icons --label "API Server"
   ```

3. **Add connecting arrows**:
   ```bash
   python skills/excalidraw-diagram-generator/scripts/add-arrow.py \
     <diagram-path> <from-x> <from-y> <to-x> <to-y> [--label "Text"] [--style solid|dashed|dotted] [--color HEX]
   ```
   - Edit via `.excalidraw.edit` is enabled by default to avoid overwrite issues; pass `--no-use-edit-suffix` to disable.
   
   **Examples**:
   ```bash
   # Simple arrow from (300, 250) to (500, 300)
   python scripts/add-arrow.py diagram.excalidraw 300 250 500 300
   
   # Arrow with label
   python scripts/add-arrow.py diagram.excalidraw 300 250 500 300 --label "HTTPS"
   
   # Dashed arrow with custom color
   python scripts/add-arrow.py diagram.excalidraw 400 350 600 400 --style dashed --color "#7950f2"
   ```

4. **Workflow summary**:
   ```bash
   # Step 1: Create base diagram with title and structure
   # (Create .excalidraw file with initial elements)
   
   # Step 2: Add icons with labels
   python scripts/add-icon-to-diagram.py my-diagram.excalidraw "Internet-gateway" 200 150 --label "Internet Gateway"
   python scripts/add-icon-to-diagram.py my-diagram.excalidraw VPC 250 250
   python scripts/add-icon-to-diagram.py my-diagram.excalidraw ELB 350 300 --label "Load Balancer"
   python scripts/add-icon-to-diagram.py my-diagram.excalidraw EC2 450 350 --label "EC2 Instance"
   python scripts/add-icon-to-diagram.py my-diagram.excalidraw RDS 550 400 --label "Database"
   
   # Step 3: Add connecting arrows
   python scripts/add-arrow.py my-diagram.excalidraw 250 200 300 250  # Internet → VPC
   python scripts/add-arrow.py my-diagram.excalidraw 300 300 400 300  # VPC → ELB
   python scripts/add-arrow.py my-diagram.excalidraw 400 330 500 350  # ELB → EC2
   python scripts/add-arrow.py my-diagram.excalidraw 500 380 600 400  # EC2 → RDS
   ```

**Benefits of Python Script Approach**:
- ✅ **No token consumption**: Icon JSON data (200-1000 lines each) never enters AI context
- ✅ **Accurate transformations**: Coordinate calculations handled deterministically
- ✅ **ID management**: Automatic UUID generation prevents conflicts
- ✅ **Reliable**: No risk of coordinate miscalculation or ID collision
- ✅ **Fast**: Direct file manipulation, no parsing overhead
- ✅ **Reusable**: Works with any Excalidraw library you provide

**ALTERNATIVE: Manual Icon Integration (Not Recommended)**

Only use this if Python scripts are unavailable:

1. **Check for libraries**: 
   ```
   List directory: skills/excalidraw-diagram-generator/libraries/
   Look for subdirectories containing reference.md files
   ```

2. **Read reference.md**:
   ```
   Open: libraries/<library-name>/reference.md
   This is lightweight (typically <300 lines) and lists all available icons
   ```

3. **Find relevant icons**:
   ```
   Search the reference.md table for icon names matching diagram needs
   Example: For AWS diagram with EC2, S3, Lambda → Find "EC2", "S3", "Lambda" in table
   ```

4. **Load specific icon data** (WARNING: Large files):
   ```
   Read ONLY the needed icon files:
   - libraries/aws-architecture-icons/icons/EC2.json (200-300 lines)
   - libraries/aws-architecture-icons/icons/S3.json (200-300 lines)
   - libraries/aws-architecture-icons/icons/Lambda.json (200-300 lines)
   Note: Each icon file is 200-1000 lines - this consumes significant tokens
   ```

5. **Extract and transform elements**:
   ```
   Each icon JSON contains an "elements" array
   Calculate bounding box (min_x, min_y, max_x, max_y)
   Apply offset to all x/y coordinates
   Generate new unique IDs for all elements
   Update groupIds references
   Copy transformed elements into your diagram
   ```

6. **Position icons and add connections**:
   ```
   Adjust x/y coordinates to position icons correctly in the diagram
   Update IDs to ensure uniqueness across diagram
   Add connecting arrows and labels as needed
   ```

**Manual Integration Challenges**:
- ⚠️ High token consumption (200-1000 lines per icon × number of icons)
- ⚠️ Complex coordinate transformation calculations
- ⚠️ Risk of ID collision if not handled carefully
- ⚠️ Time-consuming for diagrams with many icons

### Supported Icon Libraries (Examples — verify availability)

- This workflow works with any valid `.excalidrawlib` file you provide.
- Examples of library categories you may find on https://libraries.excalidraw.com/:
   - Cloud service icons
   - Kubernetes / infrastructure icons
   - UI / Material icons
   - Flowchart / diagram symbols
   - Network diagram icons
- Availability and naming can change; verify exact library names on the site before use.

### Fallback: No Icons Available

**If no icon libraries are set up:**
- Create diagrams using basic shapes (rectangles, ellipses, arrows)
- Use color coding and text labels to distinguish components
- Inform user they can add icons later or set up libraries for future diagrams
- The diagram will still be functional and clear, just less visually polished

## References

See bundled references for:
- `references/excalidraw-schema.md` - Complete Excalidraw JSON schema
- `references/element-types.md` - Detailed element type specifications
- `templates/flowchart-template.json` - Basic flowchart starter
- `templates/relationship-template.json` - Relationship diagram starter
- `templates/mindmap-template.json` - Mind map starter
- `scripts/split-excalidraw-library.py` - Tool to split `.excalidrawlib` files
- `scripts/README.md` - Documentation for library tools
- `scripts/.gitignore` - Prevents local Python artifacts from being committed

## Limitations

- Complex curves are simplified to straight/basic curved lines
- Hand-drawn roughness is set to default (1)
- No embedded images support in auto-generation
- Maximum recommended elements: 20 per diagram
- No automatic collision detection (use spacing guidelines)

## Future Enhancements

Potential improvements:
- Auto-layout optimization algorithms
- Import from Mermaid/PlantUML syntax
- Template library expansion
- Interactive editing after generation
