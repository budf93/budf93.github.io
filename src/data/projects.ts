import { site } from './site';

export interface Project {
  id: string;
  title: string;
  category: string;
  context: string;
  description: string;
  tags: string[];
  github?: string;
  reference?: string;
  problem: string;
  constraints: string;
  approach: string;
  impact: string;
  note?: string;
  featured?: boolean;
  draft?: boolean;
}

const projectEntries: Project[] = [
  {
    id: 'graph-sentiment-analysis',
    featured: true,
    title: 'Graph neural networks for sentiment analysis',
    category: 'Natural language processing',
    context: 'Independent project · Nov 2025',
    description:
      'An IMDB sentiment classifier using graph representations of text and a graph convolutional network.',
    tags: ['PyTorch Geometric', 'GCN', 'Python', 'Streamlit'],
    reference: site.linkedin,
    problem: 'Classify sentiment in IMDB movie reviews using graph representations.',
    constraints:
      'Text must be converted into graph structures suitable for a graph neural network.',
    approach:
      'Represented words as nodes connected by contextual proximity and implemented a graph convolutional network with PyTorch Geometric.',
    impact:
      'Built a sentiment-analysis pipeline with a Streamlit application for inspecting graph topology and model predictions.',
  },
  {
    id: 'realtime-vision',
    draft: true,
    title: 'Real-time computer vision pipeline optimization',
    category: 'Computer vision',
    context: 'Engineering work · 2026',
    featured: true,
    description:
      'Persistent video processing, hardware-aware inference, and latency profiling for CCTV analytics.',
    tags: ['Python', 'OpenVINO', 'CUDA', 'SQLite'],
    problem:
      'A CCTV pipeline was processing a documented 1080p25 feed at about 1.3 detector frames per second. Fresh video and useful, time-aligned detections required attention to the whole pipeline.',
    constraints:
      'Capture, inference, tracking, event persistence, and presentation share a latency budget. Hardware capabilities vary, and a fast detector alone does not establish end-to-end responsiveness.',
    approach:
      'Profiled the tracking path and removed repeated SQL aggregation over a detector-event journal backlog. Worked on persistent capture sessions, bounded frame scheduling, timestamped frames, and hardware-specific inference adapters.',
    impact:
      'The documented single-feed test improved detector throughput from approximately 1.3 to 19.9 FPS and publishing latency from approximately 987 to 107 ms.',
    note: 'These are measurements from one test feed. Capacity and latency depend on hardware, source, model, and pipeline configuration.',
  },
  {
    id: 'jobpulse',
    title: 'JobPulse',
    category: 'Information retrieval',
    context: 'Independent project · May 2026',
    featured: true,
    description:
      'A job-search application supporting BM25, semantic vector search, and hybrid retrieval with reciprocal rank fusion.',
    tags: ['FastAPI', 'Elasticsearch', 'Vue 3', 'RRF'],
    github: 'https://github.com/budf93/JobPulse',
    problem:
      'Job descriptions and search queries can express the same intent with different words. A search interface needs to support both exact matches and semantic similarity.',
    constraints:
      'Embedding generation and indexing must fit limited memory. Multiple retrieval strategies also need a consistent API and an interface for comparing their results.',
    approach:
      'Implemented BM25 lexical search, multilingual vector search, and hybrid retrieval using reciprocal rank fusion. Added caching, protected the indexing pipeline against memory pressure, and throttled indexing throughput.',
    impact:
      'Built a complete search application with a FastAPI backend and Vue 3 frontend, plus Docker configuration and k6 tooling for concurrent-load evaluation.',
  },
  {
    id: 'edge-video',
    draft: true,
    title: 'Edge video streaming and evidence delivery',
    category: 'Streaming systems',
    context: 'Engineering work · 2026',
    featured: true,
    description:
      'Direct-ingest WebRTC delivery, recovery paths, and durable evidence transfer for drone operations.',
    tags: ['WebRTC', 'MediaMTX', 'FastAPI', 'Durable queues'],
    problem:
      'Delayed video and unreliable fallback paths made it harder to keep an operations view current. Evidence produced at the edge also needed to survive connectivity interruptions.',
    constraints:
      'Local operation must remain useful during outages. Video transport, detector inference, and evidence synchronization have different timing and reliability requirements.',
    approach:
      'Optimized direct-ingest WebRTC and stream recovery. Implemented a durable observation outbox and versioned evidence uplink, with explicit ownership of inference between edge and centre.',
    impact:
      'A local single-laptop test with a synthetic 720p source at 25 FPS measured 177 ms median and 193 ms p90 send-to-browser latency. Durable evidence delivery and recovery workflows were implemented.',
    note: 'The latency figures measure video transport in a local test. They do not measure AI inference or establish field performance.',
  },
  {
    id: 'search-engine',
    featured: true,
    title: 'Search Engine from Scratch',
    category: 'Information retrieval',
    context: 'Independent project · Mar 2026',
    description:
      'A retrieval engine with inverted indexing, postings compression, neural reranking, and offline relevance evaluation.',
    tags: ['Python', 'Inverted indexes', 'ColBERT-style reranking', 'Flask'],
    github: 'https://github.com/budf93/search-engine-from-scratch',
    problem:
      'Retrieval quality depends on decisions throughout indexing and ranking. Building these components directly makes those decisions easier to study.',
    constraints:
      'Indexes and postings need efficient storage, while neural ranking adds computation. Evaluation must compare approaches using consistent relevance metrics.',
    approach:
      'Implemented inverted indexing, postings compression, lexical retrieval, and ColBERT-style token-level MaxSim reranking with transformer representations. Exposed retrieval through a Flask API and dashboard.',
    impact:
      'Created an inspectable retrieval pipeline with offline evaluation using nDCG, MAP, and DCG. The project connects index implementation to ranking experiments.',
  },
  {
    id: 'documentation-rag',
    title: 'Retrieval for technical documentation',
    category: 'NLP & retrieval',
    context: 'Independent project · Feb 2025',
    description:
      'Document ingestion, retrieval, and language-model answers in a containerized application.',
    tags: ['FastAPI', 'LangChain', 'ChromaDB', 'Ollama'],
    github: 'https://github.com/budf93/rag-for-documentation',
    problem:
      'Technical answers are scattered across PDF and Markdown documents. A question-answering interface needs to retrieve useful context before generating a response.',
    constraints:
      'Document structure, chunk boundaries, and the retrieved context affect the answer. Response time and token use also need to be visible.',
    approach:
      'Built document ingestion, chunking, embedding generation, retrieval, and context-aware prompts. Containerized the API, vector database, and model service with Docker.',
    impact:
      'Delivered a document question-answering application with instrumentation for response times, token use, and request outcomes.',
  },
  {
    id: 'neural-recommender',
    title: 'Neural collaborative filtering',
    category: 'Deep learning',
    context: 'Independent project · Sep 2025',
    description:
      'A PyTorch movie-recommendation pipeline, from interaction data to served predictions.',
    tags: ['PyTorch', 'MovieLens', 'Flask'],
    github: 'https://github.com/budf93/ncf-recommender',
    problem:
      'Recommendation models need to turn user–item interactions into useful predictions and make those predictions accessible to an application.',
    constraints:
      'Data preparation, training, and serving should have clear interfaces so model experiments remain manageable.',
    approach:
      'Implemented a neural collaborative filtering model in PyTorch with MovieLens 100k data and separated data processing, model definition, and API code.',
    impact:
      'Built the training-to-serving pipeline and exposed predictions through a Flask REST API with frontend integration.',
  },
];

// Only public entries are used by page listings and static route generation.
export const projects = projectEntries.filter((project) => !project.draft);
