% Resume in Latex
%------------------------

\documentclass[a4paper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\usepackage{fontawesome5}
\usepackage{multicol}
\usepackage{xcolor}
\setlength{\multicolsep}{-3.0pt}
\setlength{\columnsep}{-1pt}
\input{glyphtounicode}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

%-----------Page Margins-----------
\addtolength{\oddsidemargin}{-0.45in}
\addtolength{\evensidemargin}{-0.45in}
\addtolength{\textwidth}{0.9in}
\addtolength{\topmargin}{-0.55in}
\addtolength{\textheight}{1.1in}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{-4pt}]

\pdfgentounicode=1

%---------------- Commands ----------------
\newcommand{\resumeItem}[1]{\item\small{{#1 \vspace{-3pt}}}}
\newcommand{\resumeSubheading}[4]{
  \vspace{-3pt}\item
    \begin{tabular*}{1.0\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & \textbf{\small #2} \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-6pt}
}
\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{1.0\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & \textbf{\small #2}\\
    \end{tabular*}\vspace{-6pt}
}
\newcommand{\resumeItemListStart}{\begin{itemize}[leftmargin=0.15in]}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-4pt}}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.0in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}

\begin{document}

%----------HEADING----------
%----------HEADING----------
 %----------HEADING----------
 %----------HEADING----------
 %----------HEADING----------
 %----------HEADING----------

%----------HEADING----------
  %----------HEADING----------
\begin{center}
    {\Huge \scshape Ayush Nagar} \\ \vspace{4pt}
    \textbf{\Large \scshape Full Stack Developer} \\ \vspace{6pt}
    \small \faPhone\ +91-9079644035 ~ 
    \href{mailto:ayushnagar5350@gmail.com}{\faEnvelope\ \underline{ayushnagar5350@gmail.com}} ~
    \href{https://www.linkedin.com/in/ayushnagar10}{\faLinkedin\ \underline{linkedin.com/in/ayushnagar10}} ~
    \href{https://github.com/ayushnagar52}{\faGithub\ \underline{github.com/ayushnagar52}}
\end{center}

\vspace{8pt}

%-----------SUMMARY-----------
\section{Professional Summary}
 I'm a skilled Full Stack Developer with hands-on experience building responsive, high-performance web applications using MongoDB, Express, ReactJS and Node.js. Strong skills in HTML, CSS, JavaScript, TypeScript, SQL and Next.js with solid problem-solving ability backed by C++ and Data Structures and Algorithms. Quick learner, team-oriented and driven to deliver scalable, user-focused solutions.
 %-----------SKILLS-----------
\section{Skills}
\textbf{Programming Languages:} C++, JavaScript, TypeScript, HTML, CSS, SQL  \\
\textbf{Frontend Technologies:} React.js, Next.js, Tailwind CSS\\
\textbf{Backend Technologies:} Node.js, Express.js\\
\textbf{Databases:} MongoDB\\
\textbf{Version Control:} Git, GitHub \\
\textbf{Developer Tools:} VS Code, Netlify, Vercel \\
\textbf{Core Fundamentals:} DSA, OOP, DBMS, OS, CN \\
%-----------EXPERIENCE-----------
\section{Experience}
\resumeSubHeadingListStart

\resumeSubheading
{West Central Railway, Kota Division \hfill \href{https://gatepassify-internayush.netlify.app/}{\textcolor{blue}{\small View Project}}}{Kota, Rajasthan}
{Summer Vocational Trainee}
{June 2025 -- July 2025}
\resumeItemListStart

\resumeItem{Developed an interactive seating layout in React.js using JavaScript, HTML, CSS, and Tailwind CSS, boosting interface rendering speed by 25\%. Built a smart pricing system based on seat location and ticket demand to improve booking efficiency.}

\resumeItem{Structured MongoDB database models with optimized indexing and developed scalable backend APIs using Node.js and Express.js, eliminating loading delays while supporting over 600 concurrent users.}

\resumeItem{Reduced booking errors by 40\% by implementing secure authentication, input validation, and booking logic. Managed the codebase with Git and GitHub, ensuring smooth collaboration, version control, and deployment.}

\resumeItemListEnd

\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\section{Projects}
\resumeSubHeadingListStart

  \resumeProjectHeading
   {\textbf{Ayush-Astroverse} $|$ \emph{Html, CSS, Javascript, React}
    \hfill \href{https://ayushastroverse.netlify.app/}{\textcolor{blue}{View Project}}}{May 2025}
\resumeItemListStart
  \resumeItem{Developed a responsive Astrology web app using HTML, CSS, JavaScript, and React with dynamic user interaction.}
  \resumeItem{Implemented component-based architecture and integrated API-based horoscope data with efficient asynchronous handling.}
  \resumeItem{Designed intuitive, mobile-responsive UI ensuring smooth navigation and enhanced user experience.}
\resumeItemListEnd
\resumeSubHeadingListEnd

%-----------CERTIFICATIONS-----------
\section{Certifications}
\resumeItemListStart

\resumeItem{MERN Stack Development \& Data Structures and Algorithms — \href{https://generateinvoice.teachx.in/generatecertificate/certificate/rohitnegi_db/27103/14127/4?download=true}{\textcolor{blue}{CoderArmy}} (2025)}

\resumeItem{Basics of Data Structures and Algorithms — \href{https://simpli-web.app.link/e/TcQbyLmHTZb}{\textcolor{blue}{SimpliLearn}} (2025)}

\resumeItem{React (Basics) — \href{https://www.hackerrank.com/certificates/iframe/588f255a1bbc}{\textcolor{blue}{HackerRank}} (2026)}

\resumeItem{Advanced Data Structures and Software Architecture — \href{https://www.theforage.com/completion-certificates/prBZoAihniNijyD6d/oX6f9BbCL9kJDJzfg_prBZoAihniNijyD6d_vnz2TGbTFE34Hf46m_1768319882178_completion_certificate.pdf}{\textcolor{blue}{Forage}} (2026)}

\resumeItem{Problem Solving (Basics) — \href{https://www.hackerrank.com/certificates/iframe/03606c147f2f}{\textcolor{blue}{HackerRank}} (2026)}

\resumeItemListEnd

\resumeItemListEnd
%-----------EDUCATION-----------
\section{Education}
\resumeSubHeadingListStart
  \resumeSubheading
    {B.Tech in Electronics Instru. and Control Engineering \hfill CGPA: 7.1/10}{2023 -- 2027}
    {Rajasthan Technical University (RTU), Kota}{}
\resumeSubHeadingListEnd
\resumeSubHeadingListStart
\resumeSubheading
    {Higher Secondary (10+2) \hfill Persentage: 94.20/100}{2021}
    {Kashyap Academy Sr. Sec. School, Baran}{}
\resumeSubHeadingListEnd


\end{document}