/* ============================================================
   COURSE OUTLINE — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. TAB SWITCHING ---------- */
  // Collect buttons from BOTH sidebars (desktop + mobile)
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const tabSections = document.querySelectorAll('.tab-section');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Sync ALL tab buttons (sidebar + mobile nav)
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`.tab-btn[data-tab="${target}"]`)
        .forEach(b => b.classList.add('active'));

      tabSections.forEach(s => s.classList.remove('active'));
      const section = document.getElementById('tab-' + target);
      if (section) {
        section.classList.add('active');
        if (target === 'outcomes')  animateOutcomes();
        if (target === 'breakdown') animateBar();
      }
    });
  });

  /* Scroll hero arrow → go to content */
  document.querySelector('.hero-scroll')?.addEventListener('click', () => {
    document.querySelector('.page-layout')?.scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- 2. MODULE ACCORDIONS ---------- */
  document.querySelectorAll('.module-header').forEach(header => {
    header.addEventListener('click', () => {
      const card   = header.closest('.module-card');
      const isOpen = card.classList.contains('open');

      // Close all first
      document.querySelectorAll('.module-card.open').forEach(c => c.classList.remove('open'));

      // Toggle
      if (!isOpen) card.classList.add('open');
    });

    // Keyboard accessibility
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
    });
  });

  // Open first module by default
  document.querySelector('.module-card')?.classList.add('open');

  /* ---------- 3. TIMELINE HOVER TOOLTIPS ---------- */
  const tlTooltip = document.getElementById('tlTooltip');

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

  function positionTooltip(e) {
    const x = e.clientX + 15, y = e.clientY - 10;
    const tw = tlTooltip.offsetWidth, th = tlTooltip.offsetHeight;
    tlTooltip.style.left = (x + tw > window.innerWidth  ? x - tw - 30 : x) + 'px';
    tlTooltip.style.top  = (y + th > window.innerHeight ? y - th : y) + 'px';
  }

  /* ---------- 4. BREAKDOWN BAR — click to show topics ---------- */
  const segments   = document.querySelectorAll('.bar-segment');
  const topicPanel = document.getElementById('breakdownTopicPanel');

  const breakdownTopics = {
    concept: {
      label: 'Concept — 35%',
      cls: 'concept',
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
      label: 'Practical — 30%',
      cls: 'practical',
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
      label: 'Development — 20%',
      cls: 'development',
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
      label: 'AI Usage — 15%',
      cls: 'ai',
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

  segments.forEach(seg => {
    seg.addEventListener('click', () => {
      const type = seg.dataset.type;
      const data = breakdownTopics[type];
      if (!data) return;

      // Highlight active segment
      segments.forEach(s => s.classList.remove('active-seg'));
      seg.classList.add('active-seg');

      // Build panel HTML
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

  // Also trigger panel on legend item click
  document.querySelectorAll('.bl-item').forEach(item => {
    item.addEventListener('click', () => {
      const type = item.dataset.type;
      const seg = document.querySelector(`.bar-segment[data-type="${type}"]`);
      if (seg) seg.click();
    });
  });

  /* ---------- 5. ANIMATE BAR ON LOAD ---------- */
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

  /* ---------- 6. ANIMATE OUTCOME CARDS ---------- */
  function animateOutcomes() {
    document.querySelectorAll('.outcome-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 70);
    });
  }

  /* ---------- 7. INTERSECTION OBSERVER — fade in on scroll ---------- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.module-card, .bk-card, .bl-item, .tl-content, .outcome-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });

  /* ---------- 8. LEGEND HOVER — dim other bar segments ---------- */
  document.querySelectorAll('.bl-item').forEach(item => {
    const type = item.dataset.type;
    item.addEventListener('mouseenter', () => {
      segments.forEach(seg => {
        seg.style.opacity = seg.dataset.type === type ? '1' : '0.4';
      });
    });
    item.addEventListener('mouseleave', () => {
      segments.forEach(seg => { seg.style.opacity = '1'; });
    });
  });

});
