/* ============================================================
   COURSE OUTLINE — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     1. SIDE PANEL TOGGLE (open / collapse)
  ───────────────────────────────────────────── */
  const sidePanel   = document.getElementById('sidePanel');
  const panelToggle = document.getElementById('panelToggle');

  if (sidePanel && panelToggle) {
    panelToggle.addEventListener('click', () => {
      sidePanel.classList.toggle('collapsed');
    });
  }

  /* ─────────────────────────────────────────────
     2. TAB SWITCHING
     Buttons exist in both the side panel (desktop)
     and the mobile top nav — keep them in sync.
  ───────────────────────────────────────────── */
  const tabBtns     = document.querySelectorAll('.tab-btn[data-tab]');
  const tabSections = document.querySelectorAll('.tab-section');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Highlight every button that points to this tab
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`.tab-btn[data-tab="${target}"]`)
        .forEach(b => b.classList.add('active'));

      // Show the matching section
      tabSections.forEach(s => s.classList.remove('active'));
      const section = document.getElementById('tab-' + target);
      if (section) {
        section.classList.add('active');
        if (target === 'outcomes')  animateOutcomes();
        if (target === 'breakdown') animateBar();
      }

      // On mobile, close the panel after a tab is chosen (optional UX)
      if (sidePanel && window.innerWidth <= 640) {
        sidePanel.classList.add('collapsed');
      }
    });
  });

  /* ─────────────────────────────────────────────
     3. MODULE ACCORDIONS
     The whole .mc-header is the click target.
     Clicking opens/closes .mc-body via .open class.
  ───────────────────────────────────────────── */
  const moduleCards = document.querySelectorAll('.module-card');

  moduleCards.forEach(card => {
    const header = card.querySelector('.mc-header');
    if (!header) return;

    // Make header keyboard-accessible
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');

    const toggle = () => {
      const isOpen = card.classList.contains('open');

      // Close all other cards
      moduleCards.forEach(c => {
        c.classList.remove('open');
        const h = c.querySelector('.mc-header');
        if (h) h.setAttribute('aria-expanded', 'false');
      });

      // Toggle this one
      if (!isOpen) {
        card.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    };

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  // Open first module by default
  if (moduleCards.length > 0) {
    moduleCards[0].classList.add('open');
    const firstHeader = moduleCards[0].querySelector('.mc-header');
    if (firstHeader) firstHeader.setAttribute('aria-expanded', 'true');
  }

  /* ─────────────────────────────────────────────
     4. TIMELINE HOVER TOOLTIPS
  ───────────────────────────────────────────── */
  const tlTooltip = document.getElementById('tlTooltip');

  if (tlTooltip) {
    document.querySelectorAll('.tl-node[data-topics]').forEach(node => {
      node.addEventListener('mouseenter', e => {
        const topics = node.dataset.topics.split('|').map(t => t.trim());
        tlTooltip.innerHTML = `<ul>${topics.map(t => `<li>${t}</li>`).join('')}</ul>`;
        tlTooltip.classList.add('visible');
        positionTooltip(e);
      });
      node.addEventListener('mousemove', positionTooltip);
      node.addEventListener('mouseleave', () => tlTooltip.classList.remove('visible'));
    });
  }

  function positionTooltip(e) {
    const x = e.clientX + 15, y = e.clientY - 10;
    const tw = tlTooltip.offsetWidth, th = tlTooltip.offsetHeight;
    tlTooltip.style.left = (x + tw > window.innerWidth  ? x - tw - 30 : x) + 'px';
    tlTooltip.style.top  = (y + th > window.innerHeight ? y - th      : y) + 'px';
  }

  /* ─────────────────────────────────────────────
     5. BREAKDOWN BAR — click segment → show topics
  ───────────────────────────────────────────── */
  const segments   = document.querySelectorAll('.bar-segment');
  const topicPanel = document.getElementById('breakdownTopicPanel');

  const breakdownTopics = {
    concept: {
      label: 'Concept — 35%', cls: 'concept',
      topics: [
        'What is Python, AI, and Machine Learning',
        'History and evolution of AI',
        'Supervised, Unsupervised, Reinforcement Learning',
        'Data Science Life Cycle',
        'Statistics: Mean, Median, Mode, Variance',
        'Types of Analysis: Descriptive, Diagnostic, Predictive',
        'Artificial Neural Networks & Backpropagation',
        'Types of Neural Networks: ANN, CNN, RNN, LSTM',
        'Transfer Learning concepts',
        'What is Generative AI & Foundation Models',
        'LLM Fundamentals: Tokens, Embeddings, Context Window',
        'Hallucination, Temperature, Top-P, API concepts',
        'RAG fundamentals: Chunking, Vector Databases',
        'AI Evaluation: Groundedness, RAG Evaluation',
        'What is an Agent vs AI Assistant',
        'Agentic Workflow & Autonomous Systems',
        'Types of Agents: Reactive, Planning, Multi-Agent',
        'Agent Memory types: Working, Semantic, Episodic',
      ]
    },
    practical: {
      label: 'Practical — 30%', cls: 'practical',
      topics: [
        'Python coding drills: variables, loops, functions',
        'Building data structures: lists, dicts, sets',
        'Data cleaning with pandas: missing values, outliers',
        'Data visualisation with matplotlib',
        'Training Regression models (Linear, Polynomial)',
        'Building Classification models (KNN, SVM, Random Forest)',
        'K-Means and Hierarchical Clustering exercises',
        'Model evaluation: Accuracy, Precision, F1, ROC',
        'TensorFlow neural network implementation',
        'Fine-tuning pre-trained models',
        'Prompt Engineering: Zero/Few-shot, Chain of Thought',
        'Building RAG pipelines with vector databases',
        'LangChain agent implementation',
        'Tool Calling: Function Calling, JSON Schema',
        'Planning patterns: ReAct, Plan and Execute',
        'Multi-agent system orchestration with CrewAI',
      ]
    },
    development: {
      label: 'Development — 20%', cls: 'development',
      topics: [
        'Module 1 Project: Python Capstone Application',
        'Module 2 Project: Data Analysis Dashboard',
        'Module 3 Project: ML Model (Fraud/Prediction)',
        'Module 4 Project: Deep Learning Capstone',
        'Module 5 Project: Generative AI Application',
        'Module 6 Project: Agentic AI Workflow',
        'Module 7 Project: AI Tools Integration',
        'Grand Final Project: End-to-end Agentic AI App',
      ]
    },
    ai: {
      label: 'AI Usage — 15%', cls: 'ai',
      topics: [
        'Using ChatGPT for drafting reports and summaries',
        'Using Claude for complex reasoning tasks',
        'Excel Copilot for financial spreadsheet automation',
        'Hellowbooks.ai for accounting workflows',
        'Integrating LLM APIs into custom applications',
        'Prompt workflows for documentation generation',
        'AI-assisted code review and debugging',
        'Evaluating AI outputs for accuracy and bias',
      ]
    }
  };

  if (topicPanel) {
    segments.forEach(seg => {
      seg.addEventListener('click', () => {
        const type = seg.dataset.type;
        const data = breakdownTopics[type];
        if (!data) return;

        segments.forEach(s => s.classList.remove('active-seg'));
        seg.classList.add('active-seg');

        const itemsHtml = data.topics
          .map(t => `<div class="btp-topic-item ${data.cls}">${t}</div>`)
          .join('');

        topicPanel.className = `breakdown-topic-panel active-${type}`;
        topicPanel.innerHTML = `
          <div class="btp-header">
            <div class="btp-dot ${data.cls}"></div>
            <h3>${data.label}</h3>
            <span>${data.topics.length} topics</span>
          </div>
          <div class="btp-topics-grid">${itemsHtml}</div>
        `;
      });
    });
  }

  /* ─────────────────────────────────────────────
     6. ANIMATE BAR (called when breakdown tab opens)
  ───────────────────────────────────────────── */
  function animateBar() {
    segments.forEach(seg => {
      const target = seg.dataset.pct + '%';
      seg.style.width = '0%';
      setTimeout(() => {
        seg.style.transition = 'width 0.8s cubic-bezier(0.4,0,0.2,1)';
        seg.style.width = target;
      }, 50);
    });
  }

  /* ─────────────────────────────────────────────
     7. ANIMATE OUTCOME CARDS (called when outcomes tab opens)
  ───────────────────────────────────────────── */
  function animateOutcomes() {
    document.querySelectorAll('.outcome-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
      }, i * 70);
    });
  }

  /* ─────────────────────────────────────────────
     8. SCROLL-IN FADE for module cards + outcome cards
  ───────────────────────────────────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.module-card, .outcome-card, .tl-box').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });

});
