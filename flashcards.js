
const FLASHCARDS = [
  { t: 'dsa', f: 'Time complexities:\nArray access, Linear Search, Binary Search', b: 'Array access: O(1)\nLinear Search best/worst: O(1) / O(n)\nBinary Search: O(log n)\nInsertion Sort best case: O(n)' },
  { t: 'dsa', f: 'Stack vs Queue — key differences', b: 'Stack = LIFO (Last In, First Out)\n  push() adds to top, pop() removes from top\nQueue = FIFO (First In, First Out)\n  enqueue at rear, dequeue from front' },
  { t: 'dsa', f: 'BST property and traversals', b: 'BST: left < parent < right\nIn-order (L→Root→R) = ascending sorted output\nBFS uses a Queue; DFS uses a Stack' },
  { t: 'dsa', f: 'Bubble Sort vs Selection Sort vs Insertion Sort', b: 'Bubble: swaps adjacent pairs; O(n²) worst, O(n) optimized best\nSelection: finds minimum each pass; always O(n²)\nInsertion: shifts elements into position; O(n) best (sorted data)' },
  { t: 'dsa', f: 'ArrayList vs LinkedList tradeoffs', b: 'ArrayList: O(1) random access, O(n) middle insert/delete\nLinkedList: O(1) insert/delete (with reference), O(n) random access' },
  { t: 'dsa', f: 'AVL Trees — balance factor rule', b: 'Balance factor = |height(left) - height(right)|\nMust never exceed 1\nViolations trigger left/right rotations\nGuarantees O(log n) worst case' },
  { t: 'dsa', f: 'Directed vs Undirected graphs', b: 'Directed: edges have a direction (one-way)\nUndirected: edges are bidirectional\nGraphs can also be weighted (edges carry costs/distances)' },

  { t: 'oop', f: 'The 4 pillars of OOP', b: 'Encapsulation: bundle data + behavior, private fields + getters/setters\nInheritance: parent-child via extends\nPolymorphism: overloading (compile-time) + overriding (runtime)\nAbstraction: Abstract Classes + Interfaces' },
  { t: 'oop', f: 'Access modifiers matrix', b: 'private: same class only\ndefault: same package\nprotected: same package + subclasses\npublic: everywhere' },
  { t: 'oop', f: 'final keyword — three uses', b: 'final variable: cannot be reassigned after init\nfinal method: cannot be overridden by subclasses\nfinal class: cannot be extended (e.g., Java\'s String class)' },
  { t: 'oop', f: 'static vs this vs super', b: 'static: belongs to class, not instances; shared memory\nthis: current object instance reference\nsuper: immediate parent class reference' },
  { t: 'oop', f: 'Diamond Problem — why Java uses single inheritance', b: 'Diamond Problem: ambiguity when two parents share a common ancestor and both define the same method. Java prevents this by enforcing single class inheritance. Interfaces can be multiply implemented.' },
  { t: 'oop', f: 'Constructor rules', b: 'Must match the class name exactly\nNo return type (not even void)\nIf none written, compiler auto-generates a default no-arg constructor\nsuper() runs implicitly first in subclass constructors' },

  { t: 'web', f: 'CSS Box Model (inside → outside) + shorthand', b: 'Content → Padding → Border → Margin\nShorthand: Top Right Bottom Left (clockwise)\nmargin: 10px 20px 5px 15px\n→ top=10, right=20, bottom=5, left=15' },
  { t: 'web', f: 'CSS specificity order', b: 'Highest → Lowest:\n1. Inline styles (style="")\n2. ID selectors (#id)\n3. Class selectors (.class)\n4. Type/element selectors (p, div)' },
  { t: 'web', f: 'HTML5 semantic elements quick reference', b: '<header> — top brand/navigation\n<nav> — navigation links\n<main> — primary content\n<section> — thematic chapters\n<article> — self-contained content\n<aside> — sidebar\n<footer> — bottom metadata' },
  { t: 'web', f: 'Flexbox key properties', b: 'display: flex — enables flexbox\njustify-content — main axis alignment\nalign-items — cross axis alignment\nFlex is ONE-dimensional (row or column)\nGrid is TWO-dimensional' },
  { t: 'web', f: 'GET vs POST in HTML forms', b: 'GET: data in URL query string — visible, length-limited\nPOST: data in request body — hidden, no length limit\naction = destination URL\nmethod = GET or POST' },
  { t: 'web', f: 'display: none vs visibility: hidden', b: 'display: none — removes element from layout entirely (no space)\nvisibility: hidden — hides element but keeps its space in layout' },

  { t: 'db', f: 'Normal Forms summary', b: '1NF: all values are atomic (no repeating groups)\n2NF: 1NF + no partial dependencies on composite PK\n3NF: 2NF + no transitive dependencies between non-key columns' },
  { t: 'db', f: 'SQL JOIN types', b: 'INNER JOIN: only matching rows from both tables\nLEFT JOIN: all left rows + matching right (NULL if no match)\nFULL JOIN: all rows from both tables\nCROSS JOIN: Cartesian product of all row combinations' },
  { t: 'db', f: 'SQL command families: DDL vs DML', b: 'DDL (Data Definition Language):\n  CREATE, ALTER, DROP — structure changes\nDML (Data Manipulation Language):\n  SELECT, INSERT, UPDATE, DELETE — data changes' },
  { t: 'db', f: 'Three database anomalies', b: 'Insertion Anomaly: cannot add data without unrelated data\nDeletion Anomaly: deleting one record loses other needed data\nUpdate Anomaly: updating one copy leaves duplicates stale' },
  { t: 'db', f: 'Primary Key vs Foreign Key vs NOT NULL vs NULL', b: 'PK: unique + NOT NULL identifier for each row\nFK: references PK in another table; ensures referential integrity\nNOT NULL: field must always have a value\nNULL: missing/unknown — ≠ 0, ≠ empty string' },

  { t: 'gfx', f: 'Canvas coordinate system + moving objects', b: 'Origin (0,0) = top-left corner\nX increases → (rightward)\nY increases ↓ (downward)\n→ Move up: Y decreases\n→ Move right: X increases\n→ Move to bottom-right: both X and Y increase' },
  { t: 'gfx', f: 'Image format quick reference', b: 'JPEG: photos, lossy compression, no transparency\nPNG: lossless, supports alpha transparency\nGIF: 256 colors max, supports looping animation\nSVG: vector, math-based, infinitely scalable\nAI/EPS: vector formats (print/design)' },
  { t: 'gfx', f: 'RGB vs CMYK + Alpha Channel', b: 'RGB: additive light (screens), 0-255 per channel\nCMYK: subtractive ink (print), Cyan+Magenta+Yellow+Black\nAlpha channel: per-pixel transparency (0=transparent, 255=opaque)' },
  { t: 'gfx', f: 'Keyframe, Tweening, FPS, Rasterization', b: 'Keyframe: defines start/end state at specific timestamp\nTweening: auto-generates intermediate frames between keyframes\nFPS: frames per second (60fps web, 24fps cinema)\nRasterization: converts vector paths to pixel grids' },

  { t: 'php', f: 'PHP syntax essentials', b: 'Variables: must start with $\nStatements: end with ;\nString concat: period (.)\nOutput: echo or print\nCode block: <?php ... ?>\nComments: // or # (single), /* */ (multi)' },
  { t: 'php', f: '== vs === in PHP', b: '== (loose equality): compares values after type coercion\n  "5" == 5 → TRUE\n=== (strict identity): checks value AND type\n  "5" === 5 → FALSE\nAlways prefer === to avoid bugs' },
  { t: 'php', f: 'PHP superglobals + array functions', b: '$_GET: URL query string data\n$_POST: HTTP POST body data\nisset($v): true if exists and not null\nempty($v): true if falsy (0, "", null, false, [])\ncount($arr): number of elements' },
  { t: 'php', f: 'PHP array types', b: 'Indexed: $arr = [1, 2, 3] — numeric keys starting at 0\nAssociative: $arr["key"] = "value" — string keys\ncount($arr) — returns total element count' },

  { t: 'net', f: 'OSI Model — all 7 layers with devices', b: '7 Application — HTTP, DNS, FTP, DHCP\n6 Presentation — format, compress, encrypt\n5 Session — manage connections\n4 Transport — TCP/UDP, ports, flow control\n3 Network — IP routing (Routers)\n2 Data Link — MAC addresses, frames (Switches)\n1 Physical — raw bits (Cables, Hubs)' },
  { t: 'net', f: 'DNS, DHCP, ARP, TCP vs UDP', b: 'DNS: domain name → IP address\nDHCP: auto-assigns IP config to devices\nARP: known IP → MAC address on LAN\nTCP: reliable, ordered, connection-oriented (handshake)\nUDP: fast, connectionless, no guaranteed delivery' },
  { t: 'net', f: 'Network topologies comparison', b: 'Star: all → central switch; switch fail = full outage\nBus: shared cable; cable break = full segment outage\nFull Mesh: every node linked; n(n-1)/2 links needed\nRing: nodes in closed loop' },
  { t: 'net', f: 'IPv4 vs IPv6 + subnet', b: 'IPv4: 32-bit, dotted decimal, ~4.3B addresses\nIPv6: 128-bit, hexadecimal, nearly unlimited\nClass C default subnet: 255.255.255.0\nMax octet value: 255 (8 bits)' },
  { t: 'net', f: 'LAN vs WAN', b: 'LAN: Local Area Network — confined to a building/office/lab, high speed, low error rate\nWAN: Wide Area Network — spans cities/countries, the Internet is the largest WAN' },
];
