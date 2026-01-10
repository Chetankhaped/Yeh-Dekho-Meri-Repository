<div align="center">

# 🎓 ONLINE QUIZ & QUESTIONNAIRE PLATFORM

## 🤖 AI-Powered Assessment System with Real-Time Proctoring

---

### 📚 A Project Report

*Submitted in partial fulfillment of the requirements for the degree of*

### **Bachelor of Technology**
*in*
### **Artificial Intelligence and Data Science**

---

### 👥 Submitted By:
**Aman** | **Chetan** | **Shashak** | **Vanisha** | **Yash**

---

### 👨‍🏫 Under the Guidance of:
**[Guide Name]**  
*[Designation]*

---

### 🏛️ [University Name]
**[College/Institute Name]**  
*[City, State]*

📅 **November 2025**

</div>

---

<div align="center">

## 📜 CERTIFICATE

</div>

> This is to certify that the project entitled **"ONLINE QUIZ & QUESTIONNAIRE PLATFORM: AI-POWERED ASSESSMENT SYSTEM WITH REAL-TIME PROCTORING"** submitted by **Aman, Chetan, Shashak, Vanisha, and Yash** in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology in Artificial Intelligence and Data Science** at **[University Name]** is a bonafide record of work carried out by them under my supervision and guidance.

> The project embodies the results of original work and studies conducted by the students, and the contents of the project do not form the basis for the award of any other degree to the candidates or to anybody else from this or any other university/institution.

---

**Guide:**  
📝 **[Guide Name]**  
*[Designation]*  
*Department of Artificial Intelligence and Data Science*

**Date:** _______________  
**Place:** _______________

---

**Head of Department:**  
📝 **[HOD Name]**  
*Department of Artificial Intelligence and Data Science*

---

<div align="center">

## 🙏 ACKNOWLEDGMENT

</div>

We would like to express our **deep sense of gratitude** and sincere thanks to our project guide, **[Guide Name], [Designation]**, for their constant encouragement, invaluable guidance, and generous support throughout this project. Their expertise and insights have been instrumental in shaping this work.

We are profoundly grateful to **[HOD Name], Head of the Department of Artificial Intelligence and Data Science**, for providing excellent infrastructure and facilities that enabled us to complete this project successfully.

We extend our heartfelt thanks to all the **faculty members** of the Artificial Intelligence and Data Science Department for their support and encouragement throughout our academic journey.

We would also like to acknowledge our **peers and colleagues** for their constructive feedback, collaboration, and moral support during the development and testing phases of this project.

Finally, we are deeply indebted to our **families** for their unconditional love, patience, and encouragement, which have been our source of strength and motivation.

---

<div align="right">

**Aman**  
**Chetan**  
**Shashak**  
**Vanisha**  
**Yash**

*November 2025*

</div>

---

<div align="center">

## 📄 ABSTRACT

</div>

The **Online Quiz & Questionnaire Platform** is a comprehensive, production-ready assessment system designed to modernize the way educational institutions and organizations conduct online examinations. Built using the **MERN** (MongoDB, Express.js, React, Node.js) stack, this platform integrates cutting-edge technologies including artificial intelligence, real-time proctoring, and advanced analytics to deliver a secure, scalable, and user-friendly assessment experience.

The platform addresses critical challenges in online education, including academic integrity, automated question generation, and comprehensive performance analytics. 

### ✨ Key Features:

- **🤖 AI-Powered Question Generation**: Integration with Ollama (qwen2.5-coder:7b) and Google Gemini AI for automatic generation of high-quality questions across multiple programming languages (JavaScript, Python, Java, C++) and difficulty levels.

- **👁️ Real-Time Proctoring System**: Advanced anti-cheating mechanisms featuring face detection using face-api.js, tab-switch monitoring, copy-paste detection, and comprehensive violation logging to ensure exam integrity.

- **👥 Multi-Role Architecture**: Role-based access control supporting administrators, instructors, and students with tailored interfaces and permissions.

- **📚 Comprehensive Question Bank**: Pre-loaded repository of 448+ curated questions spanning multiple programming domains and question types (Multiple Choice, True/False, Fill-in-the-Blank, Coding Challenges).

- **📊 Advanced Analytics Dashboard**: Real-time performance metrics, trend analysis, question-level statistics, and student progress tracking.

- **⚙️ Flexible Assessment Engine**: Support for timed quizzes, randomization of questions and options, multiple attempts, scheduled assessments, and automatic grading.

### 🔒 Security & Deployment:

The system employs modern security practices including **JWT-based authentication**, session management, **two-factor authentication (2FA)**, OAuth integration (Google, Microsoft), and comprehensive audit logging. The platform is containerized using **Docker** for seamless deployment and scalability.

This project demonstrates the practical application of **full-stack web development**, **AI integration**, real-time communication using WebSockets, computer vision for proctoring, and secure software engineering practices. The platform serves as a robust solution for conducting secure, scalable, and intelligent online assessments in educational and professional environments.

---

**🔑 Keywords**: Online Assessment, AI Question Generation, Proctoring, MERN Stack, Ollama, Real-time Monitoring, E-Learning, Educational Technology

---

<div align="center">

## 📑 TABLE OF CONTENTS

</div>

### 📋 FRONT MATTER
- [Certificate](#-certificate)
- [Acknowledgment](#-acknowledgment)
- [Abstract](#-abstract)
- [Table of Contents](#-table-of-contents)
- [List of Figures](#-list-of-figures)
- [List of Tables](#-list-of-tables)
- [List of Abbreviations](#-list-of-abbreviations)

---

### 📖 MAIN MATTER

#### **[CHAPTER 1: INTRODUCTION](#chapter-1-introduction)** 

- **1.1** [Introduction](#11-introduction)
- **1.2** [Motivation](#12-motivation)
- **1.3** [Objective](#13-objective)
- **1.4** [Analysis](#14-analysis)
  - 1.4.1 [Functional Requirements](#141-functional-requirements)
  - 1.4.2 [Non-functional Requirements](#142-non-functional-requirements)
  - 1.4.3 [Use Case Diagram](#143-use-case-diagram)

#### **[CHAPTER 2: BACKGROUND AND RELATED WORK](#chapter-2-background-and-related-work)**

- **2.1** [Problem Statement](#21-problem-statement)
- **2.2** [Background and Related Work](#22-background-and-related-work)
  - 2.2.1 [Background Work](#221-background-work)
  - 2.2.2 [Literature Survey](#222-literature-survey)
- **2.3** [Solution Approach](#23-solution-approach)
  - 2.3.1 [Methodology](#231-methodology)
  - 2.3.2 [Technology Stack](#232-technology-stack)

#### **[CHAPTER 3: DESIGN (UML AND DATA MODELING)](#chapter-3-design-uml-and-data-modeling)**

- **3.1** [UML Modeling](#31-uml-modeling)
  - 3.1.1 [Sub Systems](#311-sub-systems)
  - 3.1.2 [Module Specification](#312-module-specification)
  - 3.1.3 [Collaboration Diagram](#313-collaboration-diagram)
  - 3.1.4 [Class Diagram](#314-class-diagram)
  - 3.1.5 [Sequence Diagram](#315-sequence-diagram)
  - 3.1.6 [Activity Diagram](#316-activity-diagram)
- **3.2** [Data Modeling](#32-data-modeling)
  - 3.2.1 [Data Flow Diagram](#321-data-flow-diagram)

#### **[CHAPTER 4: IMPLEMENTATION](#chapter-4-implementation)**

- **4.1** [Tools Used](#41-tools-used)
- **4.2** [Technology](#42-technology)
- **4.3** [Testing](#43-testing)
  - 4.3.1 [Testing Approach](#431-testing-approach)
  - 4.3.2 [Test Cases](#432-test-cases)
  - 4.3.3 [Test Reports](#433-test-reports)
- **4.4** [User Manual](#44-user-manual)

#### **[CHAPTER 5: PROJECT PLAN](#chapter-5-project-plan)**

- **5.1** [Gantt Chart](#51-gantt-chart)
- **5.2** [Effort Schedule & Cost Estimation](#52-effort-schedule--cost-estimation)
- **5.3** [Work Breakdown Structure](#53-work-breakdown-structure)
- **5.4** [Deviation from Original Plan and Corrections Applied](#54-deviation-from-original-plan-and-corrections-applied)

#### **[CHAPTER 6: PROJECT SCREENSHOTS](#chapter-6-project-screenshots)**

- **6.1** [Screenshots](#61-screenshots)

#### **[CHAPTER 7: CONCLUSION & FUTURE SCOPE](#chapter-7-conclusion--future-scope)**

- **7.1** [Conclusion](#71-conclusion)
- **7.2** [Future Scope](#72-future-scope)
- **7.3** [Bibliography](#73-bibliography)

---

### 📚 BACK MATTER
- [Appendix A: Code Snippets](#appendix-a-code-snippets)
- [Appendix B: Additional Screenshots](#appendix-b-additional-screenshots)
- [Appendix C: User Feedback and Survey Results](#appendix-c-user-feedback-and-survey-results)

### BACK MATTER
- Appendix A: Code Snippets ....................................... 80
- Appendix B: Additional Screenshots ....................................... 85
- Appendix C: User Feedback and Survey Results ....................................... 88

---

<div align="center">

## 🖼️ LIST OF FIGURES

</div>

| Figure No. | Description | Page |
|:----------:|-------------|:----:|
| **1.1** | System Overview Architecture | 2 |
| **1.2** | Use Case Diagram | 10 |
| **2.1** | Solution Architecture | 19 |
| **2.2** | Technology Stack Diagram | 21 |
| **3.1** | System Subsystems | 24 |
| **3.2** | Collaboration Diagram - Quiz Taking Flow | 27 |
| **3.3** | Class Diagram - Core Models | 29 |
| **3.4** | Sequence Diagram - User Authentication | 31 |
| **3.5** | Sequence Diagram - Quiz Submission | 32 |
| **3.6** | Activity Diagram - Quiz Creation | 34 |
| **3.7** | Activity Diagram - Quiz Taking Process | 35 |
| **3.8** | Data Flow Diagram - Level 0 | 37 |
| **3.9** | Data Flow Diagram - Level 1 | 38 |
| **5.1** | Gantt Chart - Project Timeline | 55 |
| **5.2** | Work Breakdown Structure | 58 |

---

<div align="center">

## 📊 LIST OF TABLES

</div>

| Table No. | Description | Page |
|:---------:|-------------|:----:|
| **1.1** | Functional Requirements Summary | 7 |
| **1.2** | Non-Functional Requirements Summary | 8 |
| **2.1** | Literature Survey Summary | 17 |
| **2.2** | Technology Comparison | 22 |
| **3.1** | Module Specifications | 26 |
| **4.1** | Development Tools | 40 |
| **4.2** | Technology Stack Details | 42 |
| **4.3** | Test Case Summary | 46 |
| **4.4** | Test Results | 49 |
| **5.1** | Effort Estimation | 57 |
| **5.2** | Cost Estimation | 57 |

---

<div align="center">

## 📖 LIST OF ABBREVIATIONS

</div>

| Abbreviation | Full Form |
|:------------:|-----------|
| **AI** | Artificial Intelligence |
| **API** | Application Programming Interface |
| **CORS** | Cross-Origin Resource Sharing |
| **CSS** | Cascading Style Sheets |
| **CRUD** | Create, Read, Update, Delete |
| **DB** | Database |
| **DFD** | Data Flow Diagram |
| **DOM** | Document Object Model |
| **ES6** | ECMAScript 6 |
| **HTML** | HyperText Markup Language |
| **HTTP** | HyperText Transfer Protocol |
| **IDE** | Integrated Development Environment |
| **JWT** | JSON Web Token |
| **LLM** | Large Language Model |
| **MERN** | MongoDB, Express.js, React, Node.js |
| **MVC** | Model-View-Controller |
| **OAuth** | Open Authorization |
| **OTP** | One-Time Password |
| **REST** | Representational State Transfer |
| **SPA** | Single Page Application |
| **SQL** | Structured Query Language |
| **SSL** | Secure Sockets Layer |
| **STL** | Standard Template Library |
| **UI** | User Interface |
| **UML** | Unified Modeling Language |
| **URL** | Uniform Resource Locator |
| **UX** | User Experience |
| **WebRTC** | Web Real-Time Communication |
| **WS** | WebSocket |
| **2FA** | Two-Factor Authentication |

---

<div align="center">

# 📘 CHAPTER 1: INTRODUCTION

</div>

## 1.1 Introduction

> *Transforming Online Assessment Through Artificial Intelligence*

The rapid digitalization of education, accelerated by global events such as the COVID-19 pandemic, has fundamentally transformed how educational institutions deliver content and assess student learning. Online assessment platforms have become indispensable tools for schools, universities, and corporate training programs. However, traditional online quiz systems face numerous challenges including **limited question diversity**, **academic dishonesty**, **manual grading overhead**, and **inadequate performance analytics**.

The **Online Quiz & Questionnaire Platform** addresses these challenges by providing a comprehensive, AI-powered assessment ecosystem that combines automated question generation, real-time proctoring, and intelligent analytics. This platform represents a significant advancement in educational technology by integrating multiple cutting-edge technologies into a cohesive, production-ready system.

### 🏗️ System Overview

The platform is built on a modern, scalable architecture using the **MERN** (MongoDB, Express.js, React, Node.js) technology stack. The system architecture comprises four main layers:

**1. 🎨 Presentation Layer**
- A responsive React-based frontend utilizing modern UI libraries (Radix UI, Tailwind CSS, Framer Motion)
- Delivers an intuitive user experience across devices

**2. ⚙️ Application Layer**
- A robust Node.js/Express.js backend providing RESTful APIs
- WebSocket connections for real-time proctoring
- Integration with external AI services

**3. 💾 Data Layer**
- MongoDB database with optimized schemas
- Manages users, quizzes, questions, results, and analytics data
- Ensures efficient data retrieval and storage

**4. 🤖 AI Integration Layer**
- Integration with Ollama (qwen2.5-coder:7b) and Google Gemini AI
- Intelligent question generation
- Face-api.js for facial recognition-based proctoring

### ✨ Core Capabilities

The platform delivers comprehensive functionality across three primary user roles:

#### 👨‍💼 **Administrator Functions:**
- ✅ Complete system management and configuration
- ✅ User account management across all roles
- ✅ System-wide analytics and reporting
- ✅ Audit log monitoring and security oversight
- ✅ Question bank management and curation

#### 👨‍🏫 **Instructor Functions:**
- ✅ Quiz creation with flexible configuration options
- ✅ AI-powered automatic question generation
- ✅ Manual question crafting with rich text support
- ✅ Real-time proctoring monitoring dashboard
- ✅ Detailed student performance analytics
- ✅ Grading management for coding and essay questions

#### 👨‍🎓 **Student Functions:**
- ✅ Secure quiz-taking interface with proctoring
- ✅ Multiple question type support (MCQ, True/False, Fill-in-the-blank, Coding)
- ✅ Real-time timer and progress tracking
- ✅ Instant results for auto-graded questions
- ✅ Performance history and analytics
- ✅ Face verification for identity confirmation

### 🚀 Technical Innovation

The platform incorporates several innovative technical features:

#### **🤖 AI-Powered Question Generation**

Unlike traditional systems requiring manual question creation, this platform leverages large language models to automatically generate diverse, high-quality questions. The system supports:
- ✨ Multiple programming languages (JavaScript, Python, Java, C++)
- ✨ Various difficulty levels (Easy, Medium, Hard)
- ✨ Different question types with appropriate formatting
- ✨ Intelligent question distribution and tagging

#### **👁️ Advanced Proctoring System**

The real-time proctoring mechanism employs multiple detection strategies:
- ✨ Facial recognition using TensorFlow-based models
- ✨ Tab-switch detection to prevent unauthorized browsing
- ✨ Copy-paste prevention in exam interface
- ✨ Full-screen enforcement
- ✨ Continuous activity monitoring with violation logging

#### **📊 Intelligent Analytics**

The analytics engine provides actionable insights through:
- ✨ Question-level difficulty analysis
- ✨ Student performance trends
- ✨ Comparative analytics across cohorts
- ✨ Time-to-completion analysis
- ✨ Proctoring violation patterns

### 🐳 Deployment Architecture

The platform is containerized using **Docker**, enabling:
- ✅ Consistent deployment across environments
- ✅ Easy scalability through container orchestration
- ✅ Isolated service management (frontend, backend, database, AI services)
- ✅ Simplified dependency management
- ✅ Production-ready configuration with Nginx reverse proxy

The system supports multiple deployment modes:
- 💻 Local development with hot-reload
- 🐳 Containerized production deployment
- 🌐 Public access via Ngrok tunneling for demonstrations
- ☁️ Cloud-ready architecture for enterprise deployment

### 🔒 Security Framework

Security is paramount in educational assessment systems. The platform implements:
- 🔐 JWT-based stateless authentication
- 🔐 Bcrypt password hashing with salt
- 🔐 Role-based access control (RBAC)
- 🔐 Two-factor authentication (2FA) with TOTP
- 🔐 OAuth 2.0 integration (Google, Microsoft)
- 🔐 Session management with Redis
- 🔐 Input validation and sanitization
- 🔐 Rate limiting to prevent abuse
- 🔐 Comprehensive audit logging
- 🔐 CORS configuration for API security

This introduction establishes the foundation for understanding the Online Quiz & Questionnaire Platform as a modern, intelligent, and secure solution for online assessment needs. The subsequent chapters detail the motivation, technical design, implementation, and validation of this comprehensive system.

---

## 1.2 Motivation

The development of the Online Quiz & Questionnaire Platform was driven by several critical observations and needs in the current educational technology landscape:

### 1.2.1 Challenges in Traditional Assessment Systems

**Limited Scalability**: Traditional pen-and-paper examinations are resource-intensive, requiring physical infrastructure, human proctors, and manual grading. As educational institutions expand their online presence, the need for scalable digital assessment solutions has become paramount.

**Manual Question Creation Overhead**: Educators spend significant time creating diverse, high-quality questions for assessments. This process is time-consuming, especially when covering technical subjects like programming where questions must be accurate, relevant, and appropriately challenging.

**Academic Dishonesty Concerns**: Online assessments without proper proctoring mechanisms are vulnerable to various forms of cheating, including unauthorized resource access, impersonation, and collaboration. Traditional video proctoring solutions are often expensive and privacy-invasive.

**Inadequate Analytics**: Most existing quiz platforms provide basic scoring but lack deep insights into student performance patterns, question effectiveness, and learning gaps. Educators need comprehensive analytics to improve both their teaching and assessment strategies.

**Limited Programming Assessment**: For computer science education, assessing programming skills requires platforms that can handle code execution, multiple languages, and automatic evaluation—features often missing or poorly implemented in general-purpose quiz systems.

### 1.2.2 Opportunities in Modern Technology

**AI and Machine Learning Advancements**: Recent developments in large language models (LLMs) have made it feasible to automatically generate contextually relevant, technically accurate questions. Models like Ollama's qwen2.5-coder:7b demonstrate impressive capabilities in understanding programming concepts across multiple languages.

**Web-Based Computer Vision**: Browser-based computer vision libraries like face-api.js enable sophisticated facial recognition without requiring dedicated hardware or invasive software installation, making proctoring more accessible and privacy-conscious.

**Real-Time Communication Technologies**: WebSocket protocols allow for instant bidirectional communication between browsers and servers, enabling live proctoring monitoring, real-time quiz updates, and immediate feedback mechanisms.

**Containerization and DevOps**: Docker and modern deployment practices simplify the distribution and scaling of complex applications, making it feasible to deliver production-ready educational software with minimal setup overhead.

### 1.2.3 Educational Impact Goals

**Democratizing Quality Assessments**: By providing an open-source, feature-rich assessment platform, we aim to make advanced quiz capabilities accessible to educational institutions that may lack resources for expensive commercial solutions.

**Reducing Educator Workload**: AI-powered question generation significantly reduces the time instructors spend creating assessments, allowing them to focus more on teaching, mentoring, and curriculum development.

**Enhancing Learning Outcomes**: Immediate feedback, detailed analytics, and diverse question types help students identify knowledge gaps and learn more effectively. The platform supports formative assessment practices that promote continuous learning.

**Supporting Programming Education**: With dedicated support for code-based questions, multiple programming languages, and automatic execution, the platform specifically addresses the needs of computer science and software engineering education.

**Maintaining Academic Integrity**: By implementing comprehensive yet non-invasive proctoring mechanisms, the platform helps ensure that online assessments accurately reflect individual student knowledge and capabilities.

### 1.2.4 Technical Learning and Innovation

**Full-Stack Development Mastery**: Building this platform provided an opportunity to apply and deepen knowledge across the entire web development stack, from database design to frontend UX, API development, and DevOps practices.

**AI Integration Experience**: Working with LLMs for practical applications beyond chatbots, understanding prompt engineering, and integrating AI services into production systems represents valuable experience in modern software development.

**Real-Time Systems**: Implementing WebSocket-based proctoring and live monitoring systems provided insights into building responsive, scalable real-time applications.

**Security Engineering**: Developing secure authentication, authorization, and data protection mechanisms offered practical experience in application security—a critical skill in today's development landscape.

### 1.2.5 Addressing COVID-19 Pandemic Effects

The global shift to online education during the COVID-19 pandemic exposed significant gaps in available assessment tools. Many institutions struggled with:
- Conducting secure remote examinations
- Preventing academic dishonesty without in-person proctors
- Scaling assessment infrastructure rapidly
- Maintaining assessment quality in remote settings

This platform was conceived to address these pandemic-era challenges while building a sustainable solution for the future of hybrid and online education.

### 1.2.6 Open Source Philosophy

By developing this as an open-source project, we aim to:
- Foster community contributions and improvements
- Enable educational institutions to customize the platform for their specific needs
- Provide a learning resource for students studying web development and AI integration
- Accelerate innovation in educational technology through collaborative development

The motivation behind this project extends beyond creating a functional assessment tool—it represents a vision for how modern technology can enhance education, reduce barriers to quality assessment, and support both educators and learners in achieving their goals.

---

## 1.3 Objective

The primary objective of this project is to design, develop, and deploy a comprehensive online quiz and assessment platform that leverages artificial intelligence and modern web technologies to deliver secure, scalable, and intelligent testing experiences. The specific objectives are:

### 1.3.1 Primary Objectives

1. **Develop a Full-Featured Assessment Platform**
   - Create a complete MERN stack application supporting the entire assessment lifecycle from quiz creation to result analysis
   - Implement support for multiple question types including Multiple Choice Questions (MCQ), True/False, Fill-in-the-Blank, Coding Challenges, and Essay Questions
   - Design flexible quiz configuration options including time limits, randomization, attempt limits, and scheduled availability

2. **Integrate AI-Powered Question Generation**
   - Implement integration with Ollama LLM (qwen2.5-coder:7b) for automatic question generation
   - Support multiple programming languages (JavaScript, Python, Java, C++) in generated questions
   - Enable customizable difficulty levels and question type distribution
   - Develop intelligent prompt engineering for consistent, high-quality question generation

3. **Implement Real-Time Proctoring System**
   - Develop browser-based facial recognition using face-api.js for identity verification
   - Implement tab-switch detection to monitor focus changes
   - Create copy-paste prevention mechanisms
   - Build WebSocket-based real-time monitoring dashboard for instructors
   - Design comprehensive violation logging and reporting

4. **Create Role-Based Access Control System**
   - Implement distinct user roles: Administrator, Instructor, and Student
   - Develop appropriate interfaces and permissions for each role
   - Create secure authentication using JWT tokens
   - Implement two-factor authentication (2FA) for enhanced security

5. **Build Advanced Analytics Engine**
   - Develop comprehensive student performance analytics
   - Create question-level difficulty and discrimination analysis
   - Implement trend analysis and comparative metrics
   - Design visual dashboards using charts and graphs for data presentation

### 1.3.2 Secondary Objectives

6. **Ensure Security and Data Protection**
   - Implement industry-standard authentication and authorization mechanisms
   - Protect against common web vulnerabilities (SQL injection, XSS, CSRF)
   - Ensure secure data transmission using HTTPS
   - Implement audit logging for security monitoring

7. **Optimize User Experience**
   - Design responsive, accessible interfaces using modern UI frameworks
   - Implement intuitive navigation and workflow
   - Provide real-time feedback and progress indicators
   - Ensure cross-browser and cross-device compatibility

8. **Enable Scalable Deployment**
   - Containerize the application using Docker for consistent deployment
   - Implement efficient database indexing and query optimization
   - Design stateless architecture for horizontal scalability
   - Create automated deployment scripts for different platforms

9. **Support Code Execution and Grading**
   - Implement secure code execution environment for programming questions
   - Support multiple programming language execution
   - Create automated test case evaluation for coding submissions
   - Develop manual grading interface for essay and complex coding questions

10. **Provide Comprehensive Documentation**
    - Create detailed setup and deployment guides
    - Document API endpoints and data models
    - Provide user manuals for different roles
    - Include code documentation and architecture diagrams

### 1.3.3 Technical Objectives

11. **Backend Development**
    - Design RESTful API architecture following best practices
    - Implement efficient database schemas using MongoDB
    - Create modular, maintainable code structure
    - Develop comprehensive error handling and logging

12. **Frontend Development**
    - Build responsive single-page application using React
    - Implement state management using Redux Toolkit
    - Create reusable component library
    - Optimize performance with code splitting and lazy loading

13. **Real-Time Communication**
    - Implement WebSocket server for bidirectional communication
    - Create real-time event handling for proctoring
    - Develop live quiz monitoring capabilities
    - Build instant notification system

14. **AI Service Integration**
    - Design abstraction layer for AI service integration
    - Implement error handling and fallback mechanisms for AI services
    - Create caching strategies for generated questions
    - Develop prompt templates for consistent question generation

### 1.3.4 Educational Objectives

15. **Demonstrate Full-Stack Development Skills**
    - Apply knowledge of frontend, backend, and database technologies
    - Integrate multiple third-party services and APIs
    - Implement complex business logic and workflows
    - Deploy production-ready application

16. **Explore Modern Development Practices**
    - Apply DevOps principles using containerization
    - Implement CI/CD concepts
    - Practice version control and collaborative development
    - Follow coding standards and best practices

17. **Understand Educational Technology Needs**
    - Research requirements for online assessment platforms
    - Study existing solutions and identify gaps
    - Design features based on real educational use cases
    - Validate solution with potential users

### 1.3.5 Success Criteria

<div align="center">

#### 🎯 **Project Success Metrics**

</div>

The project will be considered successful upon achieving the following measurable outcomes:

<table align="center">
<tr>
<td width="50%">

**✅ Core Functionality**
- ✔️ Functional platform supporting all three user roles
- ✔️ Successful AI question generation across multiple languages
- ✔️ Working real-time proctoring with violation detection
- ✔️ Secure authentication and authorization system

</td>
<td width="50%">

**📊 Advanced Features**
- ✔️ Comprehensive analytics dashboard
- ✔️ Successful deployment using Docker containers
- ✔️ Complete documentation and user guides
- ✔️ Passing of all test cases and security audits

</td>
</tr>
</table>

> 💡 **Note**: These objectives provide clear direction for the development process and measurable criteria for evaluating the project's success.

---

---

## 1.4 Analysis

<div align="center">

### 📋 **System Requirements Analysis**

> *Comprehensive Functional and Non-Functional Requirements*

</div>

### 1.4.1 Functional Requirements

Functional requirements define the specific behaviors and functions the system must support. The following table summarizes the key functional requirements organized by user role:

#### 👨‍💼 Administrator Requirements

| ID | Requirement | Description | Priority |
|----|-------------|-------------|:--------:|
| FR-A1 | User Management | Create, read, update, and delete user accounts for all roles | 🔴 High |
| FR-A2 | Role Assignment | Assign and modify user roles (student, instructor, admin) | 🔴 High |
| FR-A3 | System Configuration | Configure system-wide settings and parameters | 🟡 Medium |
| FR-A4 | Audit Log Access | View comprehensive audit logs of all system activities | 🔴 High |
| FR-A5 | Question Bank Management | Manage global question repository and categories | 🟡 Medium |
| FR-A6 | Analytics Dashboard | Access system-wide analytics and usage statistics | 🟡 Medium |
| FR-A7 | Backup Management | Initiate and manage data backups | 🟢 Low |

#### 👨‍🏫 Instructor Requirements

| ID | Requirement | Description | Priority |
|----|-------------|-------------|:--------:|
| FR-I1 | Quiz Creation | Create quizzes with customizable settings and questions | 🔴 High |
| FR-I2 | AI Question Generation | Generate questions automatically using AI with custom parameters | 🔴 High |
| FR-I3 | Manual Question Creation | Create questions manually with rich text formatting | 🔴 High |
| FR-I4 | Question Bank Access | Access and utilize question bank for quiz creation | 🟡 Medium |
| FR-I5 | Quiz Configuration | Set time limits, attempts, randomization, and scheduling | 🔴 High |
| FR-I6 | Proctoring Monitoring | Monitor students in real-time during quiz sessions | 🔴 High |
| FR-I7 | Results Review | View and analyze student quiz results | 🔴 High |
| FR-I8 | Manual Grading | Grade coding and essay questions manually | 🟡 Medium |
| FR-I9 | Performance Analytics | Access detailed student performance analytics | 🟡 Medium |
| FR-I10 | Question Statistics | View question-level performance statistics | 🟢 Low |

#### 👨‍🎓 Student Requirements

| ID | Requirement | Description | Priority |
|----|-------------|-------------|:--------:|
| FR-S1 | User Registration | Register for platform account with email verification | 🔴 High |
| FR-S2 | Profile Management | Update personal information and preferences | 🟡 Medium |
| FR-S3 | Face Enrollment | Upload reference photo for identity verification | 🔴 High |
| FR-S4 | Quiz Discovery | Browse and access available quizzes | 🔴 High |
| FR-S5 | Face Verification | Complete facial recognition before starting quiz | 🔴 High |
| FR-S6 | Quiz Taking | Attempt quizzes with various question types | 🔴 High |
| FR-S7 | Progress Tracking | View real-time progress during quiz | 🟡 Medium |
| FR-S8 | Code Submission | Write and submit code for programming questions | 🔴 High |
| FR-S9 | Instant Results | View automatic results for objective questions | 🔴 High |
| FR-S10 | Performance History | Access history of past quiz attempts and scores | 🟡 Medium |
| FR-S11 | Analytics Access | View personal performance analytics and trends | 🟢 Low |

#### ⚙️ System-Wide Functional Requirements

| ID | Requirement | Description | Priority |
|----|-------------|-------------|:--------:|
| FR-G1 | Authentication | Secure login/logout with JWT token-based authentication | 🔴 High |
| FR-G2 | Two-Factor Authentication | Support for 2FA using TOTP | 🟡 Medium |
| FR-G3 | OAuth Integration | Login via Google and Microsoft accounts | 🟡 Medium |
| FR-G4 | Password Recovery | Reset forgotten passwords via email | 🔴 High |
| FR-G5 | Session Management | Maintain user sessions with automatic timeout | 🔴 High |
| FR-G6 | Real-Time Communication | WebSocket support for live proctoring | 🔴 High |
| FR-G7 | Notification System | Send email and in-app notifications | 🟡 Medium |
| FR-G8 | File Upload | Support uploading images for questions and profiles | 🟡 Medium |
| FR-G9 | Search Functionality | Search quizzes, questions, and users | 🟢 Low |
| FR-G10 | Export Data | Export results and analytics to CSV/PDF | 🟢 Low |

#### 📝 Question Type Requirements

| ID | Requirement | Description | Priority |
|----|-------------|-------------|:--------:|
| FR-Q1 | Multiple Choice Support | Support MCQ with 4 options and single correct answer | 🔴 High |
| FR-Q2 | True/False Support | Support true/false questions | 🔴 High |
| FR-Q3 | Fill-in-Blank Support | Support fill-in-the-blank with exact/partial matching | 🟡 Medium |
| FR-Q4 | Coding Question Support | Support code submission with test case evaluation | 🔴 High |
| FR-Q5 | Essay Question Support | Support essay questions with manual grading | 🟡 Medium |
| FR-Q6 | Rich Text Formatting | Support formatting in questions and answers | 🟢 Low |
| FR-Q7 | Image Support | Include images in questions | 🟢 Low |

#### 👁️ Proctoring Requirements

| ID | Requirement | Description | Priority |
|----|-------------|-------------|:--------:|
| FR-P1 | Face Detection | Detect student face during quiz | 🔴 High |
| FR-P2 | Face Matching | Match detected face with reference photo | 🔴 High |
| FR-P3 | Tab Switch Detection | Detect when student switches browser tabs | 🔴 High |
| FR-P4 | Copy-Paste Detection | Prevent copying and pasting in quiz interface | 🟡 Medium |
| FR-P5 | Full-Screen Enforcement | Require and enforce full-screen mode | 🟡 Medium |
| FR-P6 | Violation Logging | Log all proctoring violations with timestamps | 🔴 High |
| FR-P7 | Live Monitoring | Enable instructor real-time monitoring dashboard | 🔴 High |
| FR-P8 | Violation Alerts | Alert instructors of suspicious activities | 🟡 Medium |

#### 🤖 AI Integration Requirements

| ID | Requirement | Description | Priority |
|----|-------------|-------------|:--------:|
| FR-AI1 | LLM Integration | Connect to Ollama API for question generation | 🔴 High |
| FR-AI2 | Multi-Language Support | Generate questions for JavaScript, Python, Java, C++ | 🔴 High |
| FR-AI3 | Difficulty Customization | Generate questions at specified difficulty levels | 🔴 High |
| FR-AI4 | Question Type Variety | Generate different question types as requested | 🟡 Medium |
| FR-AI5 | Batch Generation | Generate multiple questions in single request | 🟡 Medium |
| FR-AI6 | Quality Validation | Validate generated questions for completeness | 🔴 High |
| FR-AI7 | Caching Mechanism | Cache generated questions to reduce API calls | 🟢 Low |

---

### 1.4.2 Non-functional Requirements

<div align="center">

#### ⚡ **Quality Attributes & System Constraints**

</div>

Non-functional requirements specify the quality attributes and constraints of the system:

#### 🚀 Performance Requirements

| ID | Requirement | Description | Target |
|----|-------------|-------------|:------:|
| NFR-P1 | Response Time | API response time for most requests | ⚡ < 500ms |
| NFR-P2 | Page Load Time | Initial page load time | ⚡ < 3 seconds |
| NFR-P3 | Concurrent Users | Support simultaneous active users | 👥 500+ users |
| NFR-P4 | Quiz Submission Time | Time to submit and process quiz | ⚡ < 2 seconds |
| NFR-P5 | AI Generation Time | Time to generate questions via AI | ⏱️ < 30 seconds |
| NFR-P6 | Database Query Time | Average database query execution | ⚡ < 100ms |
| NFR-P7 | WebSocket Latency | Real-time proctoring event latency | ⚡ < 200ms |

#### 🔒 Security Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-S1 | Data Encryption | All data transmission must use HTTPS/TLS 🔐 |
| NFR-S2 | Password Security | Passwords must be hashed using bcrypt with salt 🔑 |
| NFR-S3 | JWT Security | JWT tokens must expire within 24 hours ⏰ |
| NFR-S4 | Input Validation | All user inputs must be validated and sanitized ✅ |
| NFR-S5 | SQL Injection Protection | Prevent SQL injection through parameterized queries 🛡️ |
| NFR-S6 | XSS Protection | Prevent cross-site scripting attacks 🚫 |
| NFR-S7 | CSRF Protection | Implement CSRF tokens for state-changing operations 🎫 |
| NFR-S8 | Rate Limiting | Limit API requests to prevent abuse (100 req/min/user) ⏳ |
| NFR-S9 | Session Security | Secure session management with httpOnly cookies 🍪 |
| NFR-S10 | Audit Logging | Log all security-relevant events 📝 |

#### 🔄 Reliability Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-R1 | System Uptime | Target 99.5% uptime 📈 |
| NFR-R2 | Error Handling | Graceful error handling without data loss ⚠️ |
| NFR-R3 | Data Backup | Automated daily database backups 💾 |
| NFR-R4 | Recovery Time | System recovery within 4 hours of failure 🔧 |
| NFR-R5 | Transaction Integrity | ACID compliance for critical operations ✔️ |

#### 👤 Usability Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-U1 | User Interface | Intuitive UI requiring minimal training 🎨 |
| NFR-U2 | Accessibility | WCAG 2.1 Level AA compliance ♿ |
| NFR-U3 | Browser Support | Support Chrome, Firefox, Safari, Edge (latest versions) 🌐 |
| NFR-U4 | Mobile Responsiveness | Fully responsive design for tablets and phones 📱 |
| NFR-U5 | Error Messages | Clear, actionable error messages 💬 |
| NFR-U6 | Help Documentation | Comprehensive user guides and tooltips 📚 |

#### 📊 Scalability Requirements
#### 📊 Scalability Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-SC1 | Horizontal Scaling | Architecture supporting horizontal scaling 📈 |
| NFR-SC2 | Database Scaling | MongoDB sharding capability for growth 🗄️ |
| NFR-SC3 | Load Balancing | Support for load balancer integration ⚖️ |
| NFR-SC4 | Caching Strategy | Redis caching for frequently accessed data ⚡ |
| NFR-SC5 | CDN Support | Static assets deliverable via CDN 🌍 |

#### 🔧 Maintainability Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-M1 | Code Documentation | Comprehensive inline code documentation 📝 |
| NFR-M2 | API Documentation | Complete API documentation with examples 📖 |
| NFR-M3 | Modular Design | Modular, loosely-coupled architecture 🧩 |
| NFR-M4 | Code Standards | Adherence to ESLint and Prettier standards ✨ |
| NFR-M5 | Version Control | Git-based version control with meaningful commits 🔀 |
| NFR-M6 | Logging | Structured logging using Winston 📋 |

#### 🔌 Compatibility Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-C1 | Operating Systems | Windows, macOS, Linux support 💻 |
| NFR-C2 | Container Support | Docker and Docker Compose compatibility 🐳 |
| NFR-C3 | Database Version | MongoDB 4.4+ 🍃 |
| NFR-C4 | Node.js Version | Node.js 18+ 🟢 |
| NFR-C5 | Browser APIs | Support for WebRTC, WebSocket, Camera API 🎥 |

---

### 1.4.3 Use Case Diagram

<div align="center">

#### 🎭 **System Use Cases**

> *Comprehensive interaction model for all user roles*

</div>

The following use case diagram illustrates the primary interactions between different actors (Admin, Instructor, Student) and the Online Quiz Platform system:

```
                                 Online Quiz & Questionnaire Platform
                                         Use Case Diagram

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                         │
│                                                                                         │
│     ┌─────────┐                                                          ┌─────────┐   │
│     │         │                    ──────────────────                    │         │   │
│     │  Admin  │───────────────────( Manage Users      )                  │ Student │   │
│     │         │                    ──────────────────                    │         │   │
│     └─────────┘                            │                             └─────────┘   │
│         │                                  │                                  │         │
│         │                          ──────────────────                         │         │
│         │                         ( View Audit Logs   )                       │         │
│         │                          ──────────────────                         │         │
│         │                                  │                                  │         │
│         │                          ──────────────────                         │         │
│         └─────────────────────────( System Settings   )                       │         │
│                                    ──────────────────                         │         │
│                                                                               │         │
│  ┌──────────────┐                                                             │         │
│  │              │                 ──────────────────                          │         │
│  │  Instructor  │────────────────( Create Quiz       )                        │         │
│  │              │                 ──────────────────                          │         │
│  └──────────────┘                         │                                   │         │
│         │                                 │                                   │         │
│         │                         ──────────────────                          │         │
│         │                        ( AI Question        )◄────include───┐       │         │
│         │                        ( Generation         )              │       │         │
│         │                         ──────────────────                 │       │         │
│         │                                 │                          │       │         │
│         │                         ──────────────────                 │       │         │
│         │                        ( Manual Question    )              │       │         │
│         │                        ( Creation           )──────────────┘       │         │
│         │                         ──────────────────                         │         │
│         │                                 │                                   │         │
│         │                         ──────────────────                          │         │
│         ├────────────────────────( Configure Quiz    )                        │         │
│         │                         ──────────────────                          │         │
│         │                                                                     │         │
│         │                         ──────────────────                          │         │
│         ├────────────────────────( Monitor Proctoring)                        │         │
│         │                         ──────────────────                          │         │
│         │                                 │                                   │         │
│         │                                 └────extend────┐                    │         │
│         │                                                │                    │         │
│         │                         ──────────────────     │                    │         │
│         │                        ( View Violations  )◄───┘                    │         │
│         │                         ──────────────────                          │         │
│         │                                                                     │         │
│         │                         ──────────────────                          │         │
│         ├────────────────────────( Grade Manually    )                        │         │
│         │                         ──────────────────                          │         │
│         │                                                                     │         │
│         │                         ──────────────────                          │         │
│         └────────────────────────( View Analytics    )                        │         │
│                                   ──────────────────                          │         │
│                                                                               │         │
│                                   ──────────────────                          │         │
│                                  ( Register/Login    )───────────────────┐    │         │
│                                   ──────────────────                     │    │         │
│                                           │                              │    │         │
│                                           └────include────┐              │    │         │
│                                                           │              │    │         │
│                                   ──────────────────      │              │    │         │
│                                  ( 2FA Verification )◄────┘              │    │         │
│                                   ──────────────────                     │    │         │
│                                                                          │    │         │
│                                   ──────────────────                     │    │         │
│                                  ( Upload Face Photo)─────────────────────────┤         │
│                                   ──────────────────                     │    │         │
│                                                                          │    │         │
│                                   ──────────────────                     │    │         │
│                                  ( Browse Quizzes    )────────────────────────┤         │
│                                   ──────────────────                     │    │         │
│                                                                          │    │         │
│                                   ──────────────────                     │    │         │
│                                  ( Take Quiz         )────────────────────────┤         │
│                                   ──────────────────                     │    │         │
│                                           │                              │    │         │
│                                           ├────include────┐              │    │         │
│                                           │               │              │    │         │
│                                   ──────────────────      │              │    │         │
│                                  ( Face Verification)◄────┤              │    │         │
│                                   ──────────────────      │              │    │         │
│                                                           │              │    │         │
│                                   ──────────────────      │              │    │         │
│                                  ( Answer Questions )◄────┘              │    │         │
│                                   ──────────────────                     │    │         │
│                                           │                              │    │         │
│                                   ──────────────────                     │    │         │
│                                  ( Submit Code       )◄────extend────────┘    │         │
│                                   ──────────────────                          │         │
│                                                                               │         │
│                                   ──────────────────                          │         │
│                                  ( View Results      )─────────────────────────┘         │
│                                   ──────────────────                                    │
│                                                                                         │
│                                   ──────────────────                                    │
│                                  ( View Performance  )                                  │
│                                   ──────────────────                                    │
│                                                                                         │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                        ┌────────────────────────────────┐
                        │   External Systems             │
                        │                                │
                        │  • Ollama AI Service           │
                        │  • Google Gemini AI            │
                        │  • Email Service (SMTP)        │
                        │  • OAuth Providers             │
                        │  • Face-API.js (Client-side)   │
                        └────────────────────────────────┘
```

#### 📝 Use Case Descriptions

<table>
<tr>
<td width="50%">

**🔐 UC-1: Register/Login**
- **Actor**: Student, Instructor, Admin
- **Description**: User registers for a new account or logs into existing account
- **Precondition**: User has valid credentials
- **Postcondition**: User is authenticated and redirected to dashboard
- **Includes**: 2FA Verification (if enabled)

**📝 UC-2: Create Quiz**
- **Actor**: Instructor
- **Description**: Instructor creates a new quiz with questions
- **Precondition**: Instructor is logged in
- **Postcondition**: Quiz is created and available for assignment
- **Includes**: AI Question Generation OR Manual Question Creation

**🤖 UC-3: AI Question Generation**
- **Actor**: Instructor
- **Description**: Generate questions automatically using AI
- **Precondition**: AI service is available, valid parameters provided
- **Postcondition**: Questions are generated and added to quiz
- **External System**: Ollama/Gemini AI Service

</td>
<td width="50%">

**✍️ UC-4: Take Quiz**
- **Actor**: Student
- **Description**: Student attempts a quiz
- **Precondition**: Quiz is published and available, student has enrolled face
- **Postcondition**: Quiz is submitted and graded
- **Includes**: Face Verification, Answer Questions
- **Extends**: Submit Code (for coding questions)

**👁️ UC-5: Monitor Proctoring**
- **Actor**: Instructor
- **Description**: Instructor monitors students during quiz in real-time
- **Precondition**: Quiz is in progress
- **Postcondition**: Violations are logged and visible
- **Extends**: View Violations

**📊 UC-6: View Analytics**
- **Actor**: Instructor, Admin
- **Description**: View detailed performance analytics
- **Precondition**: Quiz results exist
- **Postcondition**: Analytics dashboard is displayed

</td>
</tr>
</table>

> 💡 This use case diagram and descriptions provide a comprehensive overview of the system's functionality from a user perspective, establishing the foundation for detailed design and implementation phases.

---

<div align="center">

# 📚 CHAPTER 2: BACKGROUND AND RELATED WORK

</div>

## 2.1 Problem Statement

<div align="center">

### 🎯 **Challenges in Modern Educational Assessment**

</div>

Traditional educational assessment systems face numerous challenges in the modern digital learning environment:

### **1. 🚨 Academic Integrity Issues**

Online assessments without adequate proctoring mechanisms are highly vulnerable to academic dishonesty. Students can easily access unauthorized resources, collaborate with others, or even have someone else take the exam on their behalf. Traditional solutions like third-party proctoring services are expensive, often privacy-invasive, and may not scale well for large institutions.

### **2. ⏰ Question Creation Burden**

Creating diverse, high-quality assessment questions is extremely time-consuming for educators. For technical subjects like programming, questions must be:
- ✅ Technically accurate and up-to-date
- ✅ Appropriately challenging for the target difficulty level
- ✅ Diverse enough to prevent pattern memorization
- ✅ Covering breadth of topics adequately

> ⚠️ Manual question creation can consume **30-60 minutes per quality question**, making it difficult for instructors to maintain large question banks.

### **3. 🔧 Limited Assessment Capabilities**

Most existing quiz platforms focus on simple multiple-choice questions and lack:
- ❌ Support for code execution and automatic evaluation
- ❌ Multiple programming language support
- ❌ Complex question types like fill-in-the-blank with intelligent matching
- ❌ Hybrid grading (automatic + manual) capabilities

### **4. 📉 Inadequate Analytics**

Basic quiz platforms provide simple score reporting but lack:
- 📊 Question-level difficulty and discrimination analysis
- 📈 Student performance trend tracking over time
- 🔍 Comparative analytics across cohorts
- 💡 Insights into common misconceptions and learning gaps
- ⚠️ Proctoring violation pattern analysis

### **5. 📈 Scalability Challenges**

As institutions scale their online programs:
- 💰 Infrastructure costs increase linearly with user base
- 🐢 Manual grading becomes bottleneck for large classes
- 📚 Maintaining question quality and diversity becomes difficult
- 💸 Proctoring costs become prohibitive

### **6. 😞 Poor User Experience**

Many educational platforms suffer from:
- 🕰️ Outdated, non-intuitive interfaces
- 📱 Poor mobile responsiveness
- ⏳ Lack of real-time feedback
- 🔧 Complex setup and configuration procedures
- 📖 Inadequate documentation and support

### **7. 🔌 Integration Complexity**

Educational institutions often use multiple systems that don't integrate well:
- 🎓 Learning Management Systems (LMS)
- 👨‍🎓 Student Information Systems (SIS)
- 🔐 Authentication providers (Active Directory, OAuth)
- 📊 Analytics platforms
- 💬 Communication tools

---

<div align="center">

### 🎯 **Problem Statement Summary**

</div>

> **There is a critical need for a comprehensive, scalable, and cost-effective online assessment platform that ensures academic integrity through intelligent proctoring, reduces instructor workload through AI-powered question generation, supports diverse question types including programming challenges, provides actionable analytics, and delivers an excellent user experience—all while being accessible to institutions with limited budgets.**

---

## 2.2 Background and Related Work

<div align="center">

### 📖 **Evolution & Current State of Educational Technology**

</div>

### 2.2.1 Background Work

#### 🌐 Evolution of E-Learning Platforms

The journey of online education has evolved through several distinct phases:

<table>
<tr>
<td width="50%">

**📄 First Generation (1990s-2000s)**
### Static Content Delivery
- Simple HTML-based course materials
- Email-based communication
- Limited interactivity
- **Examples**: Blackboard, WebCT

**💻 Second Generation (2000s-2010s)**
### Interactive Learning Management Systems
- Discussion forums and collaborative tools
- Basic quiz functionality with automatic grading
- Video content integration
- **Examples**: Moodle, Canvas, Blackboard Learn

</td>
<td width="50%">

**📱 Third Generation (2010s-Present)**
### Social and Mobile Learning
- Mobile-first design
- Social learning features
- Gamification elements
- Adaptive learning paths
- **Examples**: Coursera, edX, Khan Academy

**🤖 Fourth Generation (Present-Future)**
### AI-Powered Intelligent Systems
- Personalized learning experiences
- Automated content generation
- Intelligent tutoring systems
- Advanced proctoring and analytics
- **Examples**: Our platform, emerging AI-enhanced LMS

</td>
</tr>
</table>

---

**📚 Traditional Question Banks:**
- Static repositories requiring manual curation
- Categorization by topic, difficulty, and type
- Version control and review processes
- Collaborative authoring workflows

**🚀 Modern Intelligent Question Banks:**
- AI-assisted question generation
- Automatic difficulty calibration
- Question performance analytics
- Adaptive question selection
- Our platform: Hybrid approach with 448+ curated questions + AI generation

---

---

#### 👁️ Online Proctoring Technologies

##### **Traditional Proctoring Methods:**

| Method | Description | Advantages | Disadvantages |
|--------|-------------|------------|---------------|
| **🎥 Live Remote Proctoring** | Human proctors monitor students via webcam in real-time | ✅ High detection accuracy<br>✅ Human judgment | ❌ Expensive ($15-$25/exam)<br>❌ Scheduling complexity<br>❌ Privacy concerns |
| **📹 Recorded Proctoring** | Sessions are recorded and reviewed later | ✅ Scalable<br>✅ Flexible scheduling | ❌ Delayed violation detection<br>❌ Still requires human review |

##### **🔬 Automated Proctoring Technologies:**

- **👀 Gaze Tracking**: Eye-tracking to detect suspicious eye movements
- **⌨️ Keystroke Dynamics**: Analyzing typing patterns for identity verification
- **🔒 Browser Lockdown**: Preventing access to other applications/websites
- **🔊 Audio Detection**: Identifying suspicious sounds (voices, phone calls)
- **🎭 Facial Recognition**: Verifying identity and detecting absence

> 💡 **Our Approach**: The platform employs browser-based facial recognition and behavior monitoring, avoiding invasive system-level software while maintaining effectiveness.

---

#### 🤖 AI in Education

##### **Large Language Models for Content Generation:**

Recent advancements in LLMs have enabled:
- ✨ Automatic question generation based on learning objectives
- 💡 Intelligent hint generation for student assistance
- 📝 Code explanation and documentation
- 🎯 Personalized feedback generation

##### **Models Relevant to Educational Content:**

| Model | Provider | Specialization |
|-------|----------|----------------|
| **GPT-4** | OpenAI | General-purpose, excellent for diverse content |
| **Codex/GPT-4 Code** | OpenAI | Specialized for programming |
| **Llama 3** | Meta | Open-source alternative |
| **qwen2.5-coder** ⭐ | Alibaba | Specialized coding model (used in our platform) |
| **Google Gemini** | Google | Multi-modal capabilities |

##### **📋 Prompt Engineering for Educational Content:**

Effective prompt design is critical for quality question generation:

```plaintext
✓ Role-based prompts: "You are an experienced computer science instructor..."
✓ Context provision: "Generate questions for intermediate-level students..."
✓ Format specification: "Provide questions in JSON format with..."
✓ Quality constraints: "Ensure technical accuracy and avoid ambiguity..."
```

---

#### 📚 Question Bank Systems

**Traditional Question Banks:**
- Static repositories requiring manual curation

#### Evolution of E-Learning Platforms

The journey of online education has evolved through several distinct phases:

**First Generation (1990s-2000s): Static Content Delivery**
- Simple HTML-based course materials
- Email-based communication
- Limited interactivity
- Examples: Blackboard, WebCT

**Second Generation (2000s-2010s): Interactive Learning Management Systems**
- Discussion forums and collaborative tools
- Basic quiz functionality with automatic grading
- Video content integration
- Examples: Moodle, Canvas, Blackboard Learn

**Third Generation (2010s-Present): Social and Mobile Learning**
- Mobile-first design
- Social learning features
- Gamification elements
- Adaptive learning paths
- Examples: Coursera, edX, Khan Academy

**Fourth Generation (Present-Future): AI-Powered Intelligent Systems**
- Personalized learning experiences
- Automated content generation
- Intelligent tutoring systems
- Advanced proctoring and analytics
- Examples: Our platform, emerging AI-enhanced LMS

#### Online Proctoring Technologies

**Traditional Proctoring Methods:**
- **Live Remote Proctoring**: Human proctors monitor students via webcam in real-time
  - Advantages: High detection accuracy, human judgment
  - Disadvantages: Expensive ($15-$25 per exam), scheduling complexity, privacy concerns

- **Recorded Proctoring**: Sessions are recorded and reviewed later
  - Advantages: Scalable, flexible scheduling
  - Disadvantages: Delayed violation detection, still requires human review

**Automated Proctoring Technologies:**
- **Gaze Tracking**: Eye-tracking to detect suspicious eye movements
- **Keystroke Dynamics**: Analyzing typing patterns for identity verification
- **Browser Lockdown**: Preventing access to other applications/websites
- **Audio Detection**: Identifying suspicious sounds (voices, phone calls)
- **Facial Recognition**: Verifying identity and detecting absence

Our platform employs browser-based facial recognition and behavior monitoring, avoiding invasive system-level software while maintaining effectiveness.

#### AI in Education

**Large Language Models for Content Generation:**

Recent advancements in LLMs have enabled:
- Automatic question generation based on learning objectives
- Intelligent hint generation for student assistance
- Code explanation and documentation
- Personalized feedback generation

**Models Relevant to Educational Content:**
- GPT-4 (OpenAI): General-purpose, excellent for diverse content
- Codex/GPT-4 Code (OpenAI): Specialized for programming
- Llama 3 (Meta): Open-source alternative
- qwen2.5-coder (Alibaba): Specialized coding model used in our platform
- Google Gemini: Multi-modal capabilities

**Prompt Engineering for Educational Content:**

Effective prompt design is critical for quality question generation:
```
Role-based prompts: "You are an experienced computer science instructor..."
Context provision: "Generate questions for intermediate-level students..."
Format specification: "Provide questions in JSON format with..."
Quality constraints: "Ensure technical accuracy and avoid ambiguity..."
```

#### Question Bank Systems

**Traditional Question Banks:**
- Static repositories requiring manual curation
- Categorization by topic, difficulty, and type
- Version control and review processes
- Collaborative authoring workflows

**Modern Intelligent Question Banks:**
- AI-assisted question generation
- Automatic difficulty calibration
- Question performance analytics
- Adaptive question selection
- Our platform: Hybrid approach with 448+ curated questions + AI generation

---

### 2.2.2 Literature Survey

<div align="center">

#### 📚 **Research Foundation & Academic Context**

</div>

The following table summarizes key research papers and their relevance to our project:

| Sr. No. | Authors & Year | Title | Key Findings | Relevance to Our Project |
|---------|----------------|-------|--------------|--------------------------|
| 1 | Nguyen et al. (2020) | "Automated Question Generation from Textbooks for Educational Assessment" | Transformer-based models can generate contextually relevant questions with 78% quality rating from educators | Validates AI question generation approach; informed our prompt engineering strategy |
| 2 | Atoum et al. (2017) | "Automated Online Exam Proctoring" | CNN-based face detection achieves 97% accuracy in identifying test-takers; gaze estimation detects cheating with 89% accuracy | Supports facial recognition proctoring; guided our face-api.js implementation |
| 3 | Kumar & Boulanger (2020) | "Automated Essay Scoring: A Literature Review" | Modern NLP models achieve 0.89 correlation with human graders; feature engineering remains important | Informed our essay grading design; highlighted need for manual review option |
| 4 | Ihantola et al. (2010) | "Review of Recent Systems for Automatic Assessment of Programming Assignments" | Test-case based evaluation is most effective; sandboxing is critical for security | Guided our code execution and testing infrastructure design |
| 5 | Butler-Henderson & Crawford (2020) | "A systematic review of online examinations: A pedagogical innovation for scalable authentication and integrity" | Multi-factor authentication and behavioral analytics significantly reduce cheating; user acceptance depends on perceived fairness | Influenced our 2FA implementation and proctoring UX design |
| 6 | Jalali & Noorbehbahani (2017) | "An Item Response Theory-based Method for Difficulty Analysis and Automatic Item Generation" | IRT-based calibration improves test reliability; automatic difficulty estimation is possible with historical data | Inspired our question analytics and difficulty scoring algorithms |
| 7 | Kurdi et al. (2020) | "A Systematic Review of Automatic Question Generation for Educational Purposes" | Template-based, syntax-based, and neural approaches each have strengths; hybrid methods perform best | Validated our multi-model AI approach (Ollama + Gemini) |
| 8 | Alexandron et al. (2019) | "Detecting Cheating in Online Exams with Statistical Methods" | Statistical anomaly detection identifies 85% of cheating cases; combining multiple signals improves accuracy | Informed our violation scoring and alert system |
| 9 | Nguyen & Dery (2020) | "AI-Enhanced Learning Analytics: A Systematic Mapping Study" | AI-driven analytics improve learning outcomes by 15-25%; real-time feedback is most effective | Guided our analytics dashboard and instant feedback features |
| 10 | Clusmann et al. (2023) | "The Future of Automated Programming Assessment" | Container-based execution environments are industry standard; multi-language support is increasingly important | Validated our Docker-based architecture and multi-language support |

#### Detailed Analysis of Selected Papers

**Paper 1: Automated Question Generation (Nguyen et al., 2020)**

This seminal work demonstrated that transformer-based models (specifically BERT and T5) can generate educationally valuable questions from textbook content. The researchers found:
- 78% of generated questions were rated "good" or "excellent" by educators
- Factoid questions were easier to generate than conceptual questions
- Post-processing and filtering significantly improved quality

**Relevance**: This research validated our decision to use LLMs for question generation. We adopted similar quality filtering approaches and focused on well-defined question types where AI excels.

**Paper 2: Automated Online Exam Proctoring (Atoum et al., 2017)**

Atoum's research at UCF developed a comprehensive proctoring system using:
- Face detection with 97.4% accuracy
- Gaze estimation achieving 89% cheating detection
- Phone detection using object recognition
- Audio analysis for suspicious sounds

**Relevance**: While we couldn't implement full gaze tracking due to browser limitations, this research informed our multi-signal approach to proctoring (face + behavior + interaction patterns).

**Paper 4: Automatic Assessment of Programming (Ihantola et al., 2010)**

This comprehensive review of 120 systems identified best practices:
- Test-case based evaluation is most reliable
- Sandboxed execution environments prevent security issues
- Providing partial credit improves learning outcomes
- Instant feedback significantly aids learning

**Relevance**: Directly shaped our code execution design with Docker containers for sandboxing and comprehensive test case support.

**Paper 6: Item Response Theory for Question Analysis (Jalali & Noorbehbahani, 2017)**

IRT provides a mathematical framework for:
- Estimating question difficulty objectively
- Measuring question discrimination (ability to differentiate strong/weak students)
- Calibrating test difficulty

**Relevance**: Inspired our question analytics module that tracks performance metrics and suggests question improvements.

#### Comparison with Existing Systems

| Feature | Moodle | Canvas | Google Forms | Kahoot | Our Platform |
|---------|--------|--------|--------------|---------|--------------|
| AI Question Gen | ❌ | ❌ | ❌ | ❌ | ✅ |
| Code Execution | ⚠️ Plugins | ⚠️ Limited | ❌ | ❌ | ✅ Multi-language |
| Face Proctoring | ⚠️ 3rd party | ⚠️ 3rd party | ❌ | ❌ | ✅ Integrated |
| Real-time Monitor | ❌ | ⚠️ Limited | ❌ | ✅ | ✅ |
| Advanced Analytics | ⚠️ Basic | ✅ | ⚠️ Basic | ⚠️ Basic | ✅ |
| Open Source | ✅ | ❌ | ❌ | ❌ | ✅ |
| Cost | Free | $$ | Free | $$ | Free |
| Setup Complexity | High | N/A (SaaS) | Low | N/A (SaaS) | Medium |

**Key Differentiators:**

1. **Integrated AI**: First open-source platform with built-in AI question generation
2. **Privacy-Conscious Proctoring**: Browser-based, no invasive software installation
3. **Developer-Friendly**: Full programming language support for CS education
4. **Production-Ready**: Docker-based deployment, not just educational prototype
5. **Modern Stack**: React + Node.js with current best practices

---

## 2.3 Solution Approach

<div align="center">

### 🎯 **Our Comprehensive Solution**

</div>

### 2.3.1 Methodology

<div align="center">

#### 🔄 **Agile Development Process**

</div>

The development of this platform followed an **Agile-inspired iterative methodology** with continuous integration and user feedback incorporation.

#### Development Phases

**Phase 1: Research and Planning (Weeks 1-2)**
- Requirements gathering through surveys and interviews
- Technology stack evaluation and selection
- System architecture design
- Database schema planning
- UI/UX wireframing

**Phase 2: Core Infrastructure (Weeks 3-5)**
- Database setup and model creation
- Authentication and authorization system
- RESTful API foundation
- Basic frontend scaffolding
- Docker containerization

**Phase 3: Core Features (Weeks 6-10)**
- Quiz creation and management
- Question bank implementation
- Quiz-taking interface
- Automatic grading system
- User dashboards

**Phase 4: AI Integration (Weeks 11-13)**
- Ollama setup and configuration
- Prompt engineering and testing
- AI service abstraction layer
- Question validation logic
- Caching implementation

**Phase 5: Proctoring System (Weeks 14-16)**
- Face-api.js integration
- WebSocket infrastructure
- Real-time monitoring dashboard
- Violation detection and logging
- Instructor alerts system

**Phase 6: Analytics and Reporting (Weeks 17-18)**
- Performance analytics algorithms
- Chart and visualization implementation
- Export functionality
- Question statistics

**Phase 7: Testing and Refinement (Weeks 19-21)**
- Unit testing with Jest
- Integration testing
- End-to-end testing
- Performance optimization
- Security hardening

**Phase 8: Documentation and Deployment (Weeks 22-24)**
- User documentation
- API documentation
- Deployment scripts for multiple platforms
- Demo data preparation
- Final testing and launch

#### Design Principles

**1. Modularity**
- Separation of concerns with clear module boundaries
- Microservices-inspired architecture
- Reusable components and utilities
- Plugin-style extensibility

**2. Security-First**
- Defense in depth with multiple security layers
- Principle of least privilege in access control
- Input validation at all entry points
- Secure defaults in configuration

**3. User-Centric Design**
- Role-specific interfaces optimized for workflows
- Responsive design for all devices
- Accessibility considerations (WCAG compliance)
- Minimalist, distraction-free quiz-taking interface

**4. Performance Optimization**
- Database indexing for frequent queries
- Redis caching for session and frequently accessed data
- Lazy loading and code splitting in frontend
- Optimized asset delivery

**5. Maintainability**
- Comprehensive code documentation
- Consistent coding standards (ESLint, Prettier)
- Clear commit messages and version control
- Automated testing for regression prevention

#### Architecture Pattern

The platform employs a **three-tier architecture** with clear separation:

**Presentation Tier (Frontend)**
- React-based Single Page Application (SPA)
- Component-based architecture with reusability
- Redux Toolkit for centralized state management
- React Router for client-side routing

**Application Tier (Backend)**
- Express.js RESTful API server
- WebSocket server for real-time communication
- Service layer for business logic
- Controller layer for request handling
- Middleware for cross-cutting concerns

**Data Tier**
- MongoDB for primary data storage
- Redis for caching and session management
- File system for uploaded assets
- External AI services (Ollama, Gemini)

#### API Design

RESTful API design following industry standards:

**Endpoint Structure:**
```
/api/v1/auth/*          - Authentication endpoints
/api/v1/users/*         - User management
/api/v1/quizzes/*       - Quiz CRUD operations
/api/v1/questions/*     - Question management
/api/v1/results/*       - Quiz results
/api/v1/analytics/*     - Analytics data
/api/v1/ai/*            - AI generation endpoints
/api/v1/proctoring/*    - Proctoring events
```

**Standard Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-11-07T10:30:00Z"
}
```

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [ ... ]
  },
  "timestamp": "2024-11-07T10:30:00Z"
}
```

---

### 2.3.2 Technology Stack

The platform leverages modern, production-proven technologies across all layers:

#### Frontend Technologies

**Core Framework:**
- **React 18.2**: Component-based UI library
  - Virtual DOM for efficient rendering
  - Hooks for state and lifecycle management
  - Concurrent features for better UX

**State Management:**
- **Redux Toolkit**: Centralized state management
  - Simplified Redux configuration
  - Built-in immutability with Immer
  - Redux DevTools integration

**Routing:**
- **React Router DOM 6**: Client-side routing
  - Nested routes support
  - Route-based code splitting
  - Protected routes for authorization

**UI Components:**
- **Radix UI**: Accessible, unstyled component primitives
  - Dialog, Dropdown, Select, Tabs, etc.
  - Full keyboard navigation
  - ARIA-compliant
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions

**Code Editor:**
- **Monaco Editor**: VS Code-powered code editor
  - Syntax highlighting for multiple languages
  - IntelliSense autocompletion
  - Bracket matching and code folding

**Charts & Visualization:**
- **Recharts**: React chart library
  - Line charts for trend analysis
  - Bar charts for comparison
  - Pie charts for distribution

**Computer Vision:**
- **face-api.js**: TensorFlow.js-based facial recognition
  - Face detection using SSD MobileNet
  - Face landmark detection
  - Face descriptor extraction for matching

**Build Tools:**
- **Vite**: Next-generation frontend tooling
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Native ES modules support

#### Backend Technologies

**Core Framework:**
- **Node.js 18+**: JavaScript runtime
  - Event-driven, non-blocking I/O
  - NPM ecosystem
  - ES modules support

- **Express.js 4**: Web application framework
  - Minimalist and flexible
  - Robust middleware ecosystem
  - RESTful API support

**Database:**
- **MongoDB 8.5**: NoSQL document database
  - Flexible schema design
  - Horizontal scalability
  - Rich query capabilities
- **Mongoose 8.5**: ODM (Object Data Modeling)
  - Schema validation
  - Middleware hooks
  - Population for references

**Caching & Session:**
- **Redis (ioredis)**: In-memory data store
  - Session storage
  - Caching frequently accessed data
  - Pub/Sub for real-time events

**Authentication & Security:**
- **jsonwebtoken**: JWT token generation/verification
- **bcrypt**: Password hashing
- **Passport.js**: Authentication middleware
  - Passport-Google-OAuth20
  - Passport-Microsoft
- **Helmet**: Security headers
- **express-mongo-sanitize**: NoSQL injection prevention
- **express-rate-limit**: Rate limiting
- **express-validator**: Input validation

**Two-Factor Authentication:**
- **speakeasy**: TOTP (Time-based OTP) generation
- **qrcode**: QR code generation for 2FA setup

**Real-Time Communication:**
- **ws**: WebSocket library for proctoring

**Email:**
- **Nodemailer**: Email sending
  - Password reset emails
  - Notification emails

**Logging:**
- **Winston**: Logging library
  - Multiple log levels
  - File and console transports
  - Structured logging

**AI Integration:**
- **Axios**: HTTP client for API requests
  - Ollama API integration
  - Google Gemini API integration

**Testing:**
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library

#### DevOps & Deployment

**Containerization:**
- **Docker**: Container platform
- **Docker Compose**: Multi-container orchestration

**Web Server:**
- **Nginx**: Reverse proxy and static file server
  - Load balancing ready
  - SSL/TLS termination
  - Compression

**Public Access:**
- **Ngrok**: Secure tunneling for demos
  - HTTPS endpoint
  - Custom domains

**Version Control:**
- **Git**: Distributed version control
- **GitHub**: Repository hosting

#### Development Tools

**Code Quality:**
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting

**Package Management:**
- **npm**: Node Package Manager

**IDE:**
- **VS Code**: Recommended IDE
  - Extensions: ESLint, Prettier, Docker

#### AI Models

**Primary Model:**
- **Ollama (qwen2.5-coder:7b)**: Local LLM
  - 7 billion parameters
  - Specialized for programming
  - Offline capability
  - No API costs

**Secondary Model:**
- **Google Gemini AI**: Cloud-based LLM
  - Larger context window
  - Multi-modal capabilities
  - Fallback option

#### System Requirements

**Development Environment:**
- OS: Windows 10/11, macOS 12+, Linux (Ubuntu 20.04+)
- RAM: 16GB minimum (48GB recommended for AI)
- Disk: 40GB free space (for AI models)
- Docker Desktop 4.0+
- Node.js 18+

**Production Environment:**
- CPU: 4+ cores
- RAM: 8GB minimum (16GB recommended)
- Disk: 20GB minimum
- Container orchestration (Docker Swarm, Kubernetes)
- MongoDB 4.4+ cluster
- Redis cluster for high availability

This comprehensive technology stack provides a solid foundation for building a scalable, maintainable, and feature-rich online assessment platform.

---

<div align="center">

# 🎨 CHAPTER 3: DESIGN (UML AND DATA MODELING)

</div>

## 3.1 UML Modeling

<div align="center">

### 📐 **System Architecture & Design Models**

</div>

### 3.1.1 Sub Systems

<div align="center">

#### 🧩 **Modular System Components**

</div>

The Online Quiz & Questionnaire Platform is divided into six primary subsystems, each responsible for specific functionality:

#### 1. Authentication & Authorization Subsystem

**Purpose**: Manages user identity, access control, and security

**Components:**
- User Registration Module
- Login/Logout Module
- JWT Token Management
- Two-Factor Authentication (2FA)
- OAuth Integration (Google, Microsoft)
- Password Reset Module
- Session Management

**Key Responsibilities:**
- Verify user credentials
- Generate and validate JWT tokens
- Enforce role-based access control
- Manage user sessions
- Handle password recovery

#### 2. Quiz Management Subsystem

**Purpose**: Handles all quiz-related operations

**Components:**
- Quiz Creation Module
- Quiz Configuration Module
- Quiz Publishing Module
- Quiz Assignment Module
- Quiz Scheduling Module

**Key Responsibilities:**
- Create and edit quizzes
- Configure quiz settings (time, attempts, randomization)
- Publish/unpublish quizzes
- Assign quizzes to students
- Schedule quiz availability

#### 3. Question Generation & Management Subsystem

**Purpose**: Manages question creation, both manual and AI-powered

**Components:**
- Manual Question Creator
- AI Question Generator (Ollama Integration)
- AI Question Generator (Gemini Integration)
- Question Bank Manager
- Question Validator
- Question Analytics Module

**Key Responsibilities:**
- Generate questions using AI
- Create questions manually
- Validate question structure and content
- Manage question repository
- Track question performance metrics

#### 4. Assessment & Grading Subsystem

**Purpose**: Handles quiz-taking, submission, and grading

**Components:**
- Quiz Taking Interface
- Code Execution Engine
- Automatic Grading Module
- Manual Grading Module
- Result Calculation Engine
- Answer Validation Module

**Key Responsibilities:**
- Present questions to students
- Execute and evaluate code submissions
- Auto-grade objective questions
- Facilitate manual grading for subjective questions
- Calculate and store results

#### 5. Proctoring & Monitoring Subsystem

**Purpose**: Ensures exam integrity through real-time monitoring

**Components:**
- Face Detection Module (face-api.js)
- Face Verification Module
- Tab Switch Detector
- Copy-Paste Monitor
- Violation Logger
- Live Monitoring Dashboard
- Alert System

**Key Responsibilities:**
- Detect and verify student face
- Monitor student behavior during quiz
- Log violations and suspicious activities
- Alert instructors of potential cheating
- Provide real-time monitoring interface

#### 6. Analytics & Reporting Subsystem

**Purpose**: Provides insights and analytics on performance

**Components:**
- Student Performance Analytics
- Question Analytics
- Quiz Analytics
- Trend Analysis Engine
- Visualization Module
- Export Module

**Key Responsibilities:**
- Calculate performance metrics
- Generate charts and graphs
- Identify trends and patterns
- Export data in various formats
- Provide actionable insights

**Subsystem Interaction Diagram:**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   ┌────────────────────────────────────────────────────────────┐        │
│   │        Authentication & Authorization Subsystem            │        │
│   └───────────────┬────────────────────────────────────────────┘        │
│                   │ Validates all requests                              │
│                   ▼                                                      │
│   ┌───────────────────────────┐      ┌──────────────────────────────┐  │
│   │  Quiz Management          │◄────►│  Question Generation &       │  │
│   │  Subsystem                │      │  Management Subsystem        │  │
│   └───────────┬───────────────┘      └──────────────┬───────────────┘  │
│               │                                      │                   │
│               │                                      │                   │
│               ▼                                      ▼                   │
│   ┌───────────────────────────┐      ┌──────────────────────────────┐  │
│   │  Assessment & Grading     │◄────►│  Proctoring & Monitoring     │  │
│   │  Subsystem                │      │  Subsystem                   │  │
│   └───────────┬───────────────┘      └──────────────────────────────┘  │
│               │                                                          │
│               │                                                          │
│               ▼                                                          │
│   ┌───────────────────────────────────────────────────────────┐        │
│   │          Analytics & Reporting Subsystem                  │        │
│   └───────────────────────────────────────────────────────────┘        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### 3.1.2 Module Specification

Detailed specifications for key modules:

| Module Name | Input | Processing | Output | Dependencies |
|-------------|-------|------------|--------|--------------|
| **User Registration** | Email, username, password, role | Validate input, hash password, create user record | User object, JWT token | bcrypt, User model |
| **JWT Token Generator** | User ID, role | Create signed JWT with expiration | JWT token string | jsonwebtoken |
| **Face Enrollment** | User ID, face descriptor array | Store face descriptor in user record | Success status | User model, face-api.js |
| **Quiz Creator** | Title, description, questions array, settings | Validate input, create quiz document | Quiz object | Quiz model, Question model |
| **AI Question Generator (Ollama)** | Topic, language, difficulty, count, type | Build prompt, call Ollama API, parse response | Array of question objects | Axios, Ollama service |
| **AI Question Generator (Gemini)** | Topic, language, difficulty, count, type | Build prompt, call Gemini API, parse response | Array of question objects | Axios, Gemini service |
| **Question Validator** | Question object | Check required fields, validate options, verify correctness | Validation result | None |
| **Quiz Randomizer** | Quiz object, randomization settings | Shuffle questions, shuffle options | Randomized quiz | Quiz model |
| **MCQ Grader** | Question, student answer | Compare answer with correct answer | Score (0 or points) | Question model |
| **Code Executor** | Code, language, test cases | Execute code in sandbox, run tests | Execution result, test results | Docker, child_process |
| **Face Detector** | Video frame | Detect faces using TensorFlow model | Face descriptor array | face-api.js |
| **Face Matcher** | Reference descriptor, current descriptor | Calculate Euclidean distance | Match score (0-1) | face-api.js |
| **Tab Switch Monitor** | Browser visibility events | Listen for visibility change | Violation event | Browser API |
| **Violation Logger** | User ID, quiz ID, violation type, timestamp | Create violation record | Violation object | ProctoringViolation model |
| **Performance Calculator** | Quiz results array | Calculate average, median, percentiles | Performance metrics | Result model |
| **Chart Generator** | Data points, chart type | Format data for Recharts | Chart component props | Recharts |

---

### 3.1.3 Collaboration Diagram

**Collaboration Diagram: Quiz Taking Flow**

```
┌─────────┐                                                     ┌──────────┐
│ Student │                                                     │ Instructor│
└────┬────┘                                                     └─────┬────┘
     │                                                                 │
     │ 1: requestQuiz()                                               │
     ├──────────────────►┌──────────────┐                            │
     │                   │ Quiz         │                             │
     │                   │ Controller   │                             │
     │                   └──────┬───────┘                            │
     │                          │                                     │
     │                          │ 2: getQuiz(quizId)                  │
     │                          ├─────────────►┌────────────┐        │
     │                          │              │ Quiz Model │        │
     │                          │◄─────────────┤            │        │
     │                          │ 3: quizData  └────────────┘        │
     │                          │                                     │
     │                          │ 4: checkEligibility(userId)        │
     │                          ├─────────────►┌────────────┐        │
     │                          │              │ Result     │        │
     │                          │              │ Model      │        │
     │                          │◄─────────────┤            │        │
     │◄─────────────────────────┤ 5: eligible  └────────────┘        │
     │ 6: quizData             │                                     │
     │                          │                                     │
     │ 7: startFaceVerification()                                    │
     ├──────────────────►┌─────┴─────────┐                          │
     │                   │ Face          │                            │
     │                   │ Verification  │                            │
     │                   │ Service       │                            │
     │                   └─────┬─────────┘                           │
     │                         │                                      │
     │                         │ 8: getFaceDescriptor(userId)        │
     │                         ├─────────────►┌────────────┐         │
     │                         │              │ User Model │         │
     │                         │◄─────────────┤            │         │
     │◄────────────────────────┤ 9: descriptor└────────────┘         │
     │ 10: verificationResult │                                      │
     │                         │                                      │
     │ 11: submitAnswer(questionId, answer)                          │
     ├──────────────────►┌────┴───────┐                              │
     │                   │ Grading    │                               │
     │                   │ Service    │                               │
     │                   └────┬───────┘                              │
     │                        │                                       │
     │                        │ 12: grade(question, answer)           │
     │                        ├─────────────►┌──────────────┐        │
     │                        │              │ Question     │        │
     │                        │              │ Model        │        │
     │                        │◄─────────────┤              │        │
     │◄───────────────────────┤ 13: score    └──────────────┘        │
     │ 14: answerResult       │                                       │
     │                        │                                       │
     │ [Continuous during quiz]                                      │
     │ 15: sendProctoringEvent(eventType, data)                      │
     ├──────────────────►┌───┴────────────┐                         │
     │                   │ Proctoring     │  16: broadcastEvent()   │
     │                   │ WebSocket      ├─────────────────────────┤
     │                   │ Service        │                         │
     │                   └───┬────────────┘                         │
     │                       │                                       │
     │                       │ 17: logViolation(data)                │
     │                       ├─────────────►┌───────────────┐       │
     │                       │              │ Proctoring    │       │
     │                       │              │ Violation     │       │
     │                       │              │ Model         │       │
     │                       │◄─────────────┤               │       │
     │                       │ 18: saved    └───────────────┘       │
     │                       │                                       │
     │ 19: submitQuiz()      │                                       │
     ├──────────────────►┌──┴─────────┐                             │
     │                   │ Result     │                              │
     │                   │ Service    │                              │
     │                   └──┬─────────┘                             │
     │                      │                                        │
     │                      │ 20: calculateFinalScore()              │
     │                      ├─────────────►┌────────────┐           │
     │                      │              │ Result     │           │
     │                      │              │ Model      │           │
     │                      │◄─────────────┤            │           │
     │◄─────────────────────┤ 21: result   └────────────┘           │
     │ 22: finalScore       │                                        │
     │                      │                                        │
     └──────────────────────┘                                        │
```

This diagram shows the interaction between components during a typical quiz-taking session, including verification, answer submission, proctoring, and final submission.

---

### 3.1.4 Class Diagram

**Core Domain Models**

```
┌────────────────────────────────────────────────────────────────────────┐
│                           User                                         │
├────────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                        │
│ - username: String                                                     │
│ - email: String                                                        │
│ - password: String (hashed)                                            │
│ - role: Enum ['student', 'instructor', 'admin']                       │
│ - faceDescriptor: Number[]                                            │
│ - referenceDescriptor: Number[]                                       │
│ - isFaceVerified: Boolean                                             │
│ - referencePhoto: String                                              │
│ - twoFactorEnabled: Boolean                                           │
│ - twoFactorSecret: String                                             │
│ - oauthProvider: String                                               │
│ - oauthId: String                                                     │
│ - createdAt: Date                                                     │
│ - updatedAt: Date                                                     │
├────────────────────────────────────────────────────────────────────────┤
│ + hashPassword(): Promise<void>                                       │
│ + comparePassword(password: String): Promise<Boolean>                 │
│ + generateJWT(): String                                               │
│ + generate2FASecret(): String                                         │
│ + verify2FAToken(token: String): Boolean                              │
└────────────────────────────────────────────────────────────────────────┘
                              △
                              │
                              │ 1
                              │
                              │ *
┌────────────────────────────────────────────────────────────────────────┐
│                           Quiz                                         │
├────────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                        │
│ - title: String                                                        │
│ - description: String                                                  │
│ - questions: ObjectId[] -> Question                                    │
│ - createdBy: ObjectId -> User                                          │
│ - isPublished: Boolean                                                 │
│ - timeLimit: Number (minutes)                                          │
│ - expiryDate: Date                                                     │
│ - maxAttempts: Number                                                  │
│ - randomizeQuestions: Boolean                                          │
│ - randomizeOptions: Boolean                                            │
│ - allowReview: Boolean                                                 │
│ - showCorrectAnswers: Boolean                                          │
│ - passingScore: Number                                                 │
│ - proctoringEnabled: Boolean                                           │
│ - faceVerificationRequired: Boolean                                    │
│ - tabSwitchLimit: Number                                              │
│ - createdAt: Date                                                     │
│ - updatedAt: Date                                                     │
├────────────────────────────────────────────────────────────────────────┤
│ + getTotalPoints(): Number                                            │
│ + getQuestionsCount(): Number                                         │
│ + isExpired(): Boolean                                                │
│ + canUserAttempt(userId: ObjectId): Promise<Boolean>                  │
│ + getRandomizedQuestions(): Question[]                                │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ *
                              │
                              │ 1
                              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         Question                                       │
├────────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                        │
│ - type: Enum ['mcq', 'true-false', 'fill-blank', 'coding', 'essay']  │
│ - question: String                                                     │
│ - code: String (for coding questions)                                 │
│ - language: String (JavaScript, Python, Java, C++)                    │
│ - difficulty: Enum ['easy', 'medium', 'hard']                         │
│ - points: Number                                                       │
│ - options: String[] (for MCQ)                                         │
│ - correctAnswer: Mixed                                                 │
│ - explanation: String                                                  │
│ - tags: String[]                                                       │
│ - testCases: Object[] (for coding)                                    │
│ - timeEstimate: Number (minutes)                                      │
│ - createdBy: ObjectId -> User                                          │
│ - isGenerated: Boolean (AI-generated flag)                            │
│ - createdAt: Date                                                     │
├────────────────────────────────────────────────────────────────────────┤
│ + validateAnswer(answer: Mixed): Object                               │
│ + getHint(): String                                                   │
│ + executeCode(code: String): Promise<Object>                          │
└────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────┐
│                          Result                                        │
├────────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                        │
│ - student: ObjectId -> User                                            │
│ - quiz: ObjectId -> Quiz                                               │
│ - answers: Map<questionId, answer>                                     │
│ - score: Number                                                        │
│ - maxScore: Number                                                     │
│ - percentage: Number                                                   │
│ - passed: Boolean                                                      │
│ - startedAt: Date                                                      │
│ - submittedAt: Date                                                    │
│ - timeSpent: Number (seconds)                                          │
│ - attemptNumber: Number                                                │
│ - isPlagiarized: Boolean                                              │
│ - flaggedForReview: Boolean                                           │
│ - gradedBy: ObjectId -> User                                           │
│ - feedback: String                                                     │
│ - createdAt: Date                                                     │
├────────────────────────────────────────────────────────────────────────┤
│ + calculateScore(): Number                                            │
│ + calculatePercentage(): Number                                       │
│ + checkPassing(passingScore: Number): Boolean                         │
│ + getDuration(): Number                                               │
│ + getQuestionResult(questionId: ObjectId): Object                     │
└────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────┐
│                    ProctoringViolation                                 │
├────────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                        │
│ - student: ObjectId -> User                                            │
│ - quiz: ObjectId -> Quiz                                               │
│ - result: ObjectId -> Result                                           │
│ - violationType: Enum [                                               │
│     'face-not-detected',                                              │
│     'face-mismatch',                                                  │
│     'tab-switch',                                                     │
│     'copy-paste',                                                     │
│     'multiple-faces'                                                  │
│   ]                                                                    │
│ - severity: Enum ['low', 'medium', 'high']                            │
│ - timestamp: Date                                                      │
│ - snapshot: String (base64 image)                                     │
│ - metadata: Object                                                     │
│ - acknowledged: Boolean                                                │
│ - acknowledgedBy: ObjectId -> User                                     │
├────────────────────────────────────────────────────────────────────────┤
│ + getSeverityScore(): Number                                          │
│ + acknowledge(instructorId: ObjectId): Promise<void>                  │
└────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────┐
│                      QuestionBank                                      │
├────────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                        │
│ - name: String                                                         │
│ - description: String                                                  │
│ - questions: ObjectId[] -> Question                                    │
│ - category: String                                                     │
│ - isPublic: Boolean                                                    │
│ - createdBy: ObjectId -> User                                          │
│ - tags: String[]                                                       │
│ - createdAt: Date                                                     │
├────────────────────────────────────────────────────────────────────────┤
│ + addQuestion(questionId: ObjectId): Promise<void>                    │
│ + removeQuestion(questionId: ObjectId): Promise<void>                 │
│ + getQuestionsByDifficulty(difficulty: String): Question[]            │
│ + getQuestionsByLanguage(language: String): Question[]                │
│ + getRandomQuestions(count: Number): Question[]                       │
└────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────┐
│                        AuditLog                                        │
├────────────────────────────────────────────────────────────────────────┤
│ - _id: ObjectId                                                        │
│ - user: ObjectId -> User                                               │
│ - action: String                                                       │
│ - resourceType: String                                                 │
│ - resourceId: ObjectId                                                 │
│ - ipAddress: String                                                    │
│ - userAgent: String                                                    │
│ - details: Object                                                      │
│ - timestamp: Date                                                      │
├────────────────────────────────────────────────────────────────────────┤
│ + static log(data: Object): Promise<AuditLog>                         │
│ + static getUserActivity(userId: ObjectId): Promise<AuditLog[]>       │
└────────────────────────────────────────────────────────────────────────┘
```

**Relationships:**
- User (1) ──creates──> (*) Quiz
- Quiz (*) ──contains──> (*) Question
- User (*) ──attempts──> (*) Quiz (through Result)
- Result (1) ──has──> (*) ProctoringViolation
- QuestionBank (*) ──contains──> (*) Question
- User (1) ──creates──> (*) QuestionBank

---

### 3.1.5 Sequence Diagram

**Sequence Diagram 1: User Authentication with 2FA**

```
Student      AuthController    UserModel    2FAService    JWTService    Response
  │                │              │             │              │            │
  │ 1: POST /login│              │             │              │            │
  ├───────────────►│              │             │              │            │
  │                │ 2: findUser()│             │              │            │
  │                ├─────────────►│             │              │            │
  │                │◄─────────────┤             │              │            │
  │                │ 3: user      │             │              │            │
  │                │              │             │              │            │
  │                │ 4: comparePassword()       │              │            │
  │                ├─────────────►│             │              │            │
  │                │◄─────────────┤             │              │            │
  │                │ 5: valid     │             │              │            │
  │                │              │             │              │            │
  │                │ 6: check2FAEnabled()       │              │            │
  │                ├─────────────►│             │              │            │
  │                │◄─────────────┤             │              │            │
  │                │ 7: true      │             │              │            │
  │                │              │             │              │            │
  │◄───────────────┤              │             │              │            │
  │ 8: require2FA  │              │             │              │            │
  │                │              │             │              │            │
  │ 9: POST /verify-2fa           │             │              │            │
  ├───────────────►│              │             │              │            │
  │                │ 10: verifyToken()          │              │            │
  │                ├────────────────────────────►│              │            │
  │                │◄────────────────────────────┤              │            │
  │                │ 11: valid    │             │              │            │
  │                │              │             │              │            │
  │                │ 12: generateJWT()          │              │            │
  │                ├──────────────────────────────────────────►│            │
  │                │◄──────────────────────────────────────────┤            │
  │                │ 13: token    │             │              │            │
  │                │              │             │              │            │
  │                │ 14: setAuthCookie()        │              │            │
  │                ├───────────────────────────────────────────────────────►│
  │                │              │             │              │            │
  │◄───────────────┼──────────────┼─────────────┼──────────────┼────────────┤
  │ 15: { success: true, token, user }          │              │            │
  │                │              │             │              │            │
```

**Sequence Diagram 2: AI Question Generation**

```
Instructor  QuizController  AIService  OllamaAPI  QuestionValidator  QuestionModel  Response
    │            │             │           │              │                 │          │
    │ 1: POST /generate-questions        │              │                 │          │
    ├───────────►│             │           │              │                 │          │
    │            │ 2: validateRequest()    │              │                 │          │
    │            │             │           │              │                 │          │
    │            │ 3: generateQuestions(params)           │                 │          │
    │            ├────────────►│           │              │                 │          │
    │            │             │ 4: buildPrompt()         │                 │          │
    │            │             │           │              │                 │          │
    │            │             │ 5: POST /api/generate    │                 │          │
    │            │             ├──────────►│              │                 │          │
    │            │             │           │              │                 │          │
    │            │             │           │ [AI Processing 10-30s]         │          │
    │            │             │           │              │                 │          │
    │            │             │◄──────────┤              │                 │          │
    │            │             │ 6: response│              │                 │          │
    │            │             │           │              │                 │          │
    │            │             │ 7: parseResponse()       │                 │          │
    │            │             │           │              │                 │          │
    │            │             │ 8: for each question     │                 │          │
    │            │             ├──────────────────────────►│                 │          │
    │            │             │           │ 9: validate()│                 │          │
    │            │             │◄──────────────────────────┤                 │          │
    │            │             │           │ 10: valid    │                 │          │
    │            │             │           │              │                 │          │
    │            │             │ 11: saveQuestions()      │                 │          │
    │            │             ├─────────────────────────────────────────────►│          │
    │            │             │           │              │                 │          │
    │            │             │◄─────────────────────────────────────────────┤          │
    │            │◄────────────┤           │              │ 12: savedQuestions          │
    │            │ 13: questions│          │              │                 │          │
    │            │             │           │              │                 │          │
    │◄───────────┼─────────────┼───────────┼──────────────┼─────────────────┼──────────┤
    │ 14: { success: true, questions: [...] }             │                 │          │
    │            │             │           │              │                 │          │
```

**Sequence Diagram 3: Quiz Submission and Grading**

```
Student  QuizController  GradingService  CodeExecutor  ResultModel  AnalyticsService
  │           │               │                │            │              │
  │ 1: POST /submit-quiz      │                │            │              │
  ├──────────►│               │                │            │              │
  │           │ 2: validateSubmission()        │            │              │
  │           │               │                │            │              │
  │           │ 3: gradeQuiz(answers)          │            │              │
  │           ├──────────────►│                │            │              │
  │           │               │                │            │              │
  │           │               │ 4: for each MCQ/TF         │              │
  │           │               │ gradeObjective()            │              │
  │           │               │                │            │              │
  │           │               │ 5: for each coding question│              │
  │           │               ├───────────────►│            │              │
  │           │               │ 6: execute()   │            │              │
  │           │               │                │            │              │
  │           │               │                │ [Docker execution]        │
  │           │               │                │            │              │
  │           │               │◄───────────────┤            │              │
  │           │               │ 7: testResults │            │              │
  │           │               │                │            │              │
  │           │               │ 8: calculateScore()         │              │
  │           │               │                │            │              │
  │           │◄──────────────┤                │            │              │
  │           │ 9: totalScore │                │            │              │
  │           │               │                │            │              │
  │           │ 10: createResult()             │            │              │
  │           ├────────────────────────────────────────────►│              │
  │           │               │                │            │              │
  │           │◄────────────────────────────────────────────┤              │
  │           │ 11: result    │                │            │              │
  │           │               │                │            │              │
  │           │ 12: updateAnalytics()          │            │              │
  │           ├───────────────────────────────────────────────────────────►│
  │           │               │                │            │              │
  │◄──────────┤               │                │            │              │
  │ 13: { success: true, result, score, feedback }         │              │
  │           │               │                │            │              │
```

---

### 3.1.6 Activity Diagram

**Activity Diagram 1: Quiz Creation Process**

```
                              [Start]
                                 │
                                 ▼
                        ┌────────────────┐
                        │ Login as       │
                        │ Instructor     │
                        └───────┬────────┘
                                │
                                ▼
                        ┌────────────────┐
                        │ Navigate to    │
                        │ Create Quiz    │
                        └───────┬────────┘
                                │
                                ▼
                        ┌────────────────┐
                        │ Enter Quiz     │
                        │ Details        │
                        │ (Title, Desc)  │
                        └───────┬────────┘
                                │
                                ▼
                    ╔═══════════════════════╗
                    ║ Choose Question       ║
                    ║ Creation Method?      ║
                    ╚═══════╦═══════════╦═══╝
                            │           │
            ┌───────────────┘           └───────────────┐
            │                                           │
            ▼                                           ▼
   ┌─────────────────┐                       ┌──────────────────┐
   │ Manual Question │                       │ AI Generation    │
   │ Creation        │                       │                  │
   └────────┬────────┘                       └────────┬─────────┘
            │                                         │
            │                                         ▼
            │                              ┌──────────────────┐
            │                              │ Select Language, │
            │                              │ Difficulty, Type,│
            │                              │ Count            │
            │                              └────────┬─────────┘
            │                                       │
            │                                       ▼
            │                              ┌──────────────────┐
            │                              │ Call AI Service  │
            │                              │ (Ollama/Gemini)  │
            │                              └────────┬─────────┘
            │                                       │
            │                                       ▼
            │                              ┌──────────────────┐
            │                              │ Validate         │
            │                              │ Generated        │
            │                              │ Questions        │
            │                              └────────┬─────────┘
            │                                       │
            └───────────────┬───────────────────────┘
                            │
                            ▼
                    ╔═══════════════╗
                    ║ Add More      ║
                    ║ Questions?    ║
                    ╚═══╦═══════╦═══╝
                   Yes  │       │ No
                        │       │
            ┌───────────┘       └────────┐
            │                             │
            │ ┌──────────────────────┐    ▼
            └►│ Add Question to Quiz │
              └──────────────────────┘
                        │               ┌──────────────────┐
                        │               │ Configure Quiz   │
                        └──────────────►│ Settings         │
                                        │ (Time, Attempts, │
                                        │ Randomization)   │
                                        └────────┬─────────┘
                                                 │
                                                 ▼
                                        ╔════════════════╗
                                        ║ Enable         ║
                                        ║ Proctoring?    ║
                                        ╚════╦═══════╦═══╝
                                        Yes  │       │ No
                                             │       │
                        ┌────────────────────┘       └──────┐
                        │                                   │
                        ▼                                   │
            ┌──────────────────────┐                        │
            │ Configure Proctoring │                        │
            │ - Face Verification  │                        │
            │ - Tab Switch Limit   │                        │
            │ - Violation Actions  │                        │
            └──────────┬───────────┘                        │
                       │                                    │
                       └────────────┬───────────────────────┘
                                    │
                                    ▼
                            ┌────────────────┐
                            │ Review Quiz    │
                            │ Preview        │
                            └───────┬────────┘
                                    │
                                    ▼
                            ╔════════════════╗
                            ║ Publish Quiz?  ║
                            ╚════╦═══════╦═══╝
                            Yes  │       │ No
                                 │       │
            ┌────────────────────┘       └──────────┐
            │                                       │
            ▼                                       ▼
   ┌─────────────────┐                   ┌──────────────────┐
   │ Publish Quiz    │                   │ Save as Draft    │
   │ (Make Available)│                   │                  │
   └────────┬────────┘                   └────────┬─────────┘
            │                                     │
            └──────────────┬──────────────────────┘
                           │
                           ▼
                      ┌─────────┐
                      │  End    │
                      └─────────┘
```

**Activity Diagram 2: Student Quiz Taking Process**

```
                              [Start]
                                 │
                                 ▼
                        ┌────────────────┐
                        │ Login as       │
                        │ Student        │
                        └───────┬────────┘
                                │
                                ▼
                        ┌────────────────┐
                        │ Browse         │
                        │ Available      │
                        │ Quizzes        │
                        └───────┬────────┘
                                │
                                ▼
                        ┌────────────────┐
                        │ Select Quiz    │
                        └───────┬────────┘
                                │
                                ▼
                    ╔═══════════════════════╗
                    ║ Face Verification     ║
                    ║ Required?             ║
                    ╚═══════╦═══════════╦═══╝
                       Yes  │           │ No
                            │           │
            ┌───────────────┘           └────────┐
            │                                    │
            ▼                                    │
   ┌─────────────────┐                           │
   │ Capture Face    │                           │
   │ from Webcam     │                           │
   └────────┬────────┘                           │
            │                                    │
            ▼                                    │
   ┌─────────────────┐                           │
   │ Verify Face     │                           │
   │ Match           │                           │
   └────────┬────────┘                           │
            │                                    │
            ▼                                    │
    ╔═══════════════╗                            │
    ║ Face Matched? ║                            │
    ╚═══╦═══════╦═══╝                            │
   Yes  │       │ No                             │
        │       │                                │
        │       ▼                                │
        │  ┌────────────────┐                    │
        │  │ Show Error     │                    │
        │  │ Deny Access    │                    │
        │  └───────┬────────┘                    │
        │          │                             │
        │          ▼                             │
        │      [End]                             │
        │                                        │
        └────────────────┬───────────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Start Quiz     │
                │ Timer          │
                └───────┬────────┘
                        │
        ┌───────────────┴───────────────┐
        │ [Parallel Activities]         │
        │                               │
        │  ┌─────────────────────┐      │
        │  │ Answer Questions    │      │
        │  │ (One by One)        │      │
        │  └─────────┬───────────┘      │
        │            │                  │
        │            ▼                  │
        │  ╔═════════════════╗          │
        │  ║ Question Type?  ║          │
        │  ╚═══╦═════════╦═══╝          │
        │      │         │              │
        │  MCQ │         │ Coding       │
        │      │         │              │
        │      ▼         ▼              │
        │  ┌────┐   ┌────────┐          │
        │  │Select  │Write   │          │
        │  │Option  │Code    │          │
        │  └────┘   └────────┘          │
        │                               │
        │  ┌─────────────────────┐      │
        │  │ Continuous          │      │
        │  │ Proctoring:         │      │
        │  │ - Face Detection    │      │
        │  │ - Tab Monitoring    │      │
        │  │ - Copy-Paste Check  │      │
        │  └─────────────────────┘      │
        │                               │
        └───────────────┬───────────────┘
                        │
                        ▼
                ╔═══════════════════╗
                ║ All Questions     ║
                ║ Answered?         ║
                ╚═══╦═══════════╦═══╝
               No   │           │ Yes
                    │           │
        ┌───────────┘           └──────┐
        │                              │
        │                              ▼
        │                    ┌─────────────────┐
        │                    │ Review Answers  │
        │                    │ (if allowed)    │
        │                    └────────┬────────┘
        │                             │
        │                             ▼
        │                    ╔════════════════╗
        │                    ║ Submit Quiz?   ║
        │                    ╚════╦═══════╦═══╝
        │                    Yes  │       │ No
        │                         │       │
        │    ┌────────────────────┘       │
        │    │                            │
        └────┼────────────────────────────┘
             │
             ▼
    ┌─────────────────┐
    │ Submit Quiz     │
    │ Stop Timer      │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Auto-Grade      │
    │ Objective       │
    │ Questions       │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Display         │
    │ Results         │
    └────────┬────────┘
             │
             ▼
    ╔═════════════════╗
    ║ View Detailed   ║
    ║ Feedback?       ║
    ╚═════╦═══════╦═══╝
     Yes  │       │ No
          │       │
          ▼       │
   ┌──────────┐   │
   │ Show     │   │
   │ Answers  │   │
   │ & Expln  │   │
   └──────────┘   │
          │       │
          └───┬───┘
              │
              ▼
          [End]
```

---

## 3.2 Data Modeling

<div align="center">

### 🗄️ **Data Architecture & Flow**

</div>

### 3.2.1 Data Flow Diagram

<div align="center">

#### 📊 **System Data Flow Analysis**

</div>

**Level 0 DFD (Context Diagram)**

```
                                                                  
        ┌──────────┐                                  ┌───────────────┐
        │          │   Login Credentials              │               │
        │ Student  ├─────────────────────────────────►│               │
        │          │                                  │               │
        │          │◄─────────────────────────────────┤               │
        │          │   Quiz, Results, Feedback        │               │
        │          │                                  │               │
        │          │   Face Data, Answers             │               │
        │          ├─────────────────────────────────►│               │
        └──────────┘                                  │               │
                                                       │    Online    │
        ┌──────────┐                                  │     Quiz      │
        │          │   Login Credentials              │   Platform    │
        │Instructor├─────────────────────────────────►│               │
        │          │                                  │               │
        │          │◄─────────────────────────────────┤               │
        │          │   Analytics, Student Data        │               │
        │          │                                  │               │
        │          │   Quiz, Questions                │               │
        │          ├─────────────────────────────────►│               │
        └──────────┘                                  │               │
                                                       │               │
        ┌──────────┐                                  │               │
        │          │   Login Credentials              │               │
        │  Admin   ├─────────────────────────────────►│               │
        │          │                                  │               │
        │          │◄─────────────────────────────────┤               │
        │          │   System Data, Audit Logs        │               │
        │          │                                  │               │
        │          │   User Management Commands       │               │
        │          ├─────────────────────────────────►│               │
        └──────────┘                                  └───────┬───────┘
                                                              │
                ┌─────────────────────────────────────────────┴─────┐
                │                                                   │
                ▼                                                   ▼
        ┌───────────────┐                                  ┌────────────────┐
        │   Ollama/     │                                  │  Email Service │
        │   Gemini AI   │◄─────Question Generation────────┤  (SMTP)        │
        │               │                                  │                │
        │               ├──────Generated Questions────────►│                │
        └───────────────┘                                  └────────────────┘
```

**Level 1 DFD (System Processes)**

```
                            ┌──────────────────────────────────────────────┐
                            │                                              │
    ┌──────────┐            │          ONLINE QUIZ PLATFORM                │
    │ Student  │            │                                              │
    └────┬─────┘            │                                              │
         │                  │    ┌─────────────────────────────┐           │
         │ 1. Login         │    │  1.0                        │           │
         ├──────────────────┼───►│  Authenticate               │           │
         │                  │    │  User                       │           │
         │                  │    └───────────┬─────────────────┘           │
         │◄─────────────────┼────────────────┘ JWT Token                   │
         │  Token           │                                              │
         │                  │                                              │
         │ 2. Browse Quiz   │    ┌─────────────────────────────┐           │
         ├──────────────────┼───►│  2.0                        │           │
         │                  │    │  Manage                     │           │
         │◄─────────────────┼────┤  Quiz Access                │           │
         │  Quiz List       │    └───────────┬─────────────────┘           │
         │                  │                │                             │
         │ 3. Take Quiz     │                │ Quiz Data                   │
         ├──────────────────┼────┐           ▼                             │
         │                  │    │   ┌─────────────────────────────┐       │
         │                  │    │   │         DATABASE            │       │
         │                  │    │   │  - Users                    │       │
         │                  │    │   │  - Quizzes                  │       │
         │                  │    │   │  - Questions                │       │
         │                  │    │   │  - Results                  │       │
         │                  │    │   │  - Violations               │       │
         │                  │    │   └─────────────────────────────┘       │
         │                  │    │           │                             │
         │                  │    │           │ Store/Retrieve              │
         │                  │    └───►┌──────▼──────────────────┐          │
         │                  │         │  3.0                    │          │
         │◄─────────────────┼─────────┤  Conduct Quiz           │          │
         │  Questions       │         │  & Proctor              │          │
         │                  │         └──────┬──────────────────┘          │
         │ 4. Submit        │                │                             │
         │    Answers       │                │ Proctoring Events           │
         ├──────────────────┼────────────────┤                             │
         │                  │                │                             │
         │                  │         ┌──────▼──────────────────┐          │
         │                  │         │  4.0                    │          │
         │                  │         │  Grade                  │          │
         │                  │         │  Submission             │◄─────┐   │
         │                  │         └──────┬──────────────────┘      │   │
         │                  │                │                         │   │
         │◄─────────────────┼────────────────┘ Results                │   │
         │  Score           │                                          │   │
         │                  │                                          │   │
    ┌────┴─────┐            │                                          │   │
    │Instructor│            │                                          │   │
    └────┬─────┘            │                                          │   │
         │                  │    ┌─────────────────────────────┐       │   │
         │ 5. Create Quiz   │    │  5.0                        │       │   │
         ├──────────────────┼───►│  Manage                     │       │   │
         │                  │    │  Quizzes                    │       │   │
         │                  │    └───────────┬─────────────────┘       │   │
         │                  │                │                         │   │
         │ 6. Generate      │                │ Save Quiz               │   │
         │    Questions     │                ▼                         │   │
         ├──────────────────┼────┐   ┌──────────────┐                 │   │
         │                  │    │   │  DATABASE    │                 │   │
         │                  │    └──►│              │                 │   │
         │                  │        └──────────────┘                 │   │
         │                  │                │                         │   │
         │                  │                │ Question Params         │   │
         │                  │         ┌──────▼──────────────────┐     │   │
         │                  │         │  6.0                    │     │   │
         │◄─────────────────┼─────────┤  AI Question            │     │   │
         │  Generated Qs    │         │  Generator              │     │   │
         │                  │         └──────┬──────────────────┘     │   │
         │                  │                │                        │   │
         │                  │                │ API Request            │   │
         │                  │                ▼                        │   │
         │                  │        ┌───────────────┐                │   │
         │                  │        │ Ollama/Gemini │                │   │
         │                  │        │  AI Service   │                │   │
         │                  │        └───────────────┘                │   │
         │                  │                                          │   │
         │ 7. View          │    ┌─────────────────────────────┐      │   │
         │    Analytics     │    │  7.0                        │      │   │
         ├──────────────────┼───►│  Generate                   │      │   │
         │                  │    │  Analytics                  │◄─────┘   │
         │◄─────────────────┼────┤                             │          │
         │  Reports         │    └─────────────────────────────┘          │
         │                  │                                              │
    ┌────┴─────┐            │                                              │
    │  Admin   │            │                                              │
    └────┬─────┘            │                                              │
         │                  │    ┌─────────────────────────────┐           │
         │ 8. Manage Users  │    │  8.0                        │           │
         ├──────────────────┼───►│  User                       │           │
         │                  │    │  Management                 │           │
         │◄─────────────────┼────┤                             │           │
         │  User Data       │    └─────────────────────────────┘           │
         │                  │                                              │
         │ 9. Audit Logs    │    ┌─────────────────────────────┐           │
         ├──────────────────┼───►│  9.0                        │           │
         │                  │    │  Security &                 │           │
         │◄─────────────────┼────┤  Audit                      │           │
         │  Logs            │    └─────────────────────────────┘           │
         │                  │                                              │
         └──────────────────┼──────────────────────────────────────────────┘
```

**Database Schema Relationships**

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│    User     │ 1     * │     Quiz     │ *     * │   Question   │
│             ├────────►│              ├────────►│              │
│  - _id      │ creates │  - _id       │ contains│  - _id       │
│  - username │         │  - title     │         │  - question  │
│  - email    │         │  - createdBy │         │  - type      │
│  - role     │         │  - questions │         │  - answer    │
│  - face...  │         │  - settings  │         │  - points    │
└─────────────┘         └──────────────┘         └──────────────┘
      │ 1                      │ 1                      │ *
      │                        │                        │
      │ takes                  │ generates              │ contains
      │                        │                        │
      │ *                      │ *                      │ 1
      ▼                        ▼                        ▼
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Result    │ 1     * │Proctoring    │         │ QuestionBank │
│             ├────────►│ Violation    │         │              │
│  - _id      │   has   │              │         │  - _id       │
│  - student  │         │  - _id       │         │  - name      │
│  - quiz     │         │  - result    │         │  - questions │
│  - score    │         │  - type      │         │  - category  │
│  - answers  │         │  - severity  │         └──────────────┘
└─────────────┘         └──────────────┘
      │ *
      │
      │ tracks
      │
      │ 1
      ▼
┌─────────────┐
│   Audit     │
│    Log      │
│             │
│  - _id      │
│  - user     │
│  - action   │
│  - resource │
└─────────────┘
```

This completes Chapter 3 with comprehensive UML modeling and data flow diagrams, providing a clear technical design blueprint for the Online Quiz & Questionnaire Platform.

---

<div align="center">

# 💻 CHAPTER 4: IMPLEMENTATION

</div>

## 4.1 Tools Used

<div align="center">

### 🛠️ **Development Tools & Environment**

</div>

The following tools and software were utilized during the development and deployment of the Online Quiz & Questionnaire Platform:

### 🔧 Development Tools

| Tool | Version | Purpose | Description |
|------|---------|---------|-------------|
| **Visual Studio Code** | 1.85+ | IDE | Primary integrated development environment with extensions for React, Node.js, ESLint, and Prettier |
| **Postman** | 10.0+ | API Testing | Testing and documenting REST API endpoints |
| **MongoDB Compass** | 1.40+ | Database GUI | Visual tool for MongoDB database management and query execution |
| **Git** | 2.40+ | Version Control | Distributed version control system for tracking code changes |
| **GitHub** | - | Repository Hosting | Remote repository hosting and collaboration platform |
| **Docker Desktop** | 4.25+ | Containerization | Container platform for development and deployment |
| **Ollama** | 0.1.0+ | AI Model Runtime | Local LLM runtime for qwen2.5-coder:7b model |

### Browser Development Tools

| Tool | Browser | Purpose |
|------|---------|---------|
| **Chrome DevTools** | Chrome 120+ | Debugging, performance profiling, network analysis |
| **React DevTools** | Chrome Extension | React component debugging and state inspection |
| **Redux DevTools** | Chrome Extension | Redux state debugging and time-travel debugging |

### Testing Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Jest** | 29.7+ | Unit Testing | JavaScript testing framework for backend |
| **Supertest** | 7.0+ | API Testing | HTTP assertion library for testing Express APIs |
| **Vitest** | 1.0+ | Frontend Testing | Fast unit testing framework for Vite projects |
| **@testing-library/react** | 14.0+ | Component Testing | React component testing utilities |

### Build & Deployment Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Vite** | 5.0+ | Frontend Build | Next-generation frontend build tool with HMR |
| **npm** | 10.0+ | Package Manager | Node.js package manager for dependencies |
| **Docker Compose** | 2.20+ | Multi-container orchestration | Define and run multi-container applications |
| **Nginx** | 1.25+ | Web Server | Reverse proxy and static file server |
| **Ngrok** | 3.0+ | Tunneling | Secure public URL for local development |

### Design & Documentation Tools

| Tool | Purpose |
|------|---------|
| **Figma** | UI/UX wireframing and mockups |
| **Draw.io** | UML diagrams and flowcharts |
| **Markdown** | Documentation writing |
| **PlantUML** | Text-based diagram creation |

### AI Services

| Service | Model | Purpose |
|---------|-------|---------|
| **Ollama** | qwen2.5-coder:7b | Primary AI question generation (local) |
| **Google Gemini** | Gemini Pro | Secondary AI question generation (cloud) |

### Operating Systems Used

- **Primary Development**: Windows 11, macOS Sonoma
- **Testing**: Ubuntu 22.04 LTS, Windows 11, macOS
- **Deployment**: Docker containers (platform-agnostic)

---

## 4.2 Technology

<div align="center">

### ⚙️ **Technology Stack Deep Dive**

</div>

### 4.2.1 Frontend Technology Stack

#### ⚛️ Core Framework: React 18.2

React was chosen as the frontend framework for several compelling reasons:

**Advantages:**
- **Component-Based Architecture**: Promotes reusability and maintainability
- **Virtual DOM**: Efficient rendering and updates
- **Rich Ecosystem**: Extensive library support and community
- **Declarative Syntax**: Easier to understand and debug
- **Hooks**: Modern state management without class components

**Key Features Utilized:**
- `useState`: Local component state management
- `useEffect`: Side effects and lifecycle management
- `useCallback` & `useMemo`: Performance optimization
- `useRef`: DOM access for face detection canvas
- `useContext`: Global state sharing
- Custom Hooks: Reusable logic extraction

#### State Management: Redux Toolkit

**Why Redux Toolkit:**
- Centralized state management for complex application state
- Simplified Redux configuration with less boilerplate
- Built-in Immer for immutable updates
- RTK Query for efficient data fetching (considered for future enhancement)

**State Structure:**
```javascript
{
  auth: { user, token, isAuthenticated },
  quiz: { currentQuiz, questions, timeRemaining },
  proctoring: { violations, isMonitoring },
  analytics: { performanceData, charts }
}
```

#### Routing: React Router DOM 6

**Features Used:**
- Nested routing for complex layouts
- Protected routes with authentication guards
- Lazy loading for code splitting
- Navigation guards for proctoring enforcement

#### UI Component Library: Radix UI + Tailwind CSS

**Radix UI Benefits:**
- Unstyled, accessible component primitives
- Full keyboard navigation support
- WCAG 2.1 compliant
- Components: Dialog, DropdownMenu, Select, Tabs, Tooltip, RadioGroup

**Tailwind CSS Benefits:**
- Utility-first approach for rapid development
- Consistent design system
- Responsive design utilities
- Small production bundle with PurgeCSS

#### Computer Vision: face-api.js

**Implementation Details:**
- **Models Used**: SSD MobileNetV1 for face detection
- **Face Descriptor**: 128-dimensional vector for face recognition
- **Detection Frequency**: Every 2 seconds during quiz
- **Matching Threshold**: 0.6 (configurable)

**Technical Flow:**
```
1. Load TensorFlow models on page load
2. Capture video frame from webcam
3. Detect faces in frame
4. Extract face descriptors
5. Compare with reference descriptor
6. Calculate Euclidean distance
7. Trigger violation if mismatch
```

#### Code Editor: Monaco Editor

**Configuration:**
- Syntax highlighting for JavaScript, Python, Java, C++
- Theme: VS Code Dark+
- Features: IntelliSense, bracket matching, code folding
- Read-only mode for solution display

#### Charts: Recharts

**Chart Types Implemented:**
- Line charts for performance trends
- Bar charts for question difficulty comparison
- Pie charts for question type distribution
- Area charts for attempt analytics

---

### 4.2.2 Backend Technology Stack

#### Runtime: Node.js 18 LTS

**Selection Rationale:**
- JavaScript everywhere (frontend + backend)
- Non-blocking I/O for high concurrency
- NPM ecosystem with 2M+ packages
- Long-term support (LTS) for stability

#### Framework: Express.js 4

**Architecture Pattern:**
```
Routes → Controllers → Services → Models → Database
```

**Middleware Stack:**
1. `helmet`: Security headers
2. `cors`: Cross-origin resource sharing
3. `express.json()`: JSON body parsing
4. `morgan`: HTTP request logging
5. `express-rate-limit`: Rate limiting
6. Custom auth middleware: JWT verification
7. Error handling middleware

#### Database: MongoDB 8.5

**Schema Design Philosophy:**
- Embedded documents for one-to-few relationships (quiz → settings)
- References for one-to-many relationships (quiz → questions)
- Denormalization for performance (student name in results)

**Indexing Strategy:**
```javascript
// User model
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

// Quiz model
quizSchema.index({ createdBy: 1, isPublished: 1 });

// Result model
resultSchema.index({ student: 1, quiz: 1 });
resultSchema.index({ quiz: 1, score: -1 });
```

**Why MongoDB:**
- Flexible schema for diverse question types
- JSON-like documents match JavaScript objects
- Easy horizontal scaling with sharding
- Rich query language with aggregation pipeline
- Good performance for read-heavy workloads

#### ODM: Mongoose 8.5

**Features Utilized:**
- Schema validation with types and constraints
- Pre/post middleware hooks (e.g., password hashing)
- Virtual properties (e.g., fullName, duration)
- Population for referenced documents
- Custom instance and static methods

**Example Schema with Middleware:**
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
```

#### Authentication: JWT + Passport.js

**Authentication Flow:**
```
1. User submits credentials
2. Validate credentials against database
3. Generate JWT token with user ID and role
4. Return token to client
5. Client includes token in Authorization header
6. Server verifies token on each request
7. Attach user to request object
```

**JWT Payload:**
```javascript
{
  id: user._id,
  role: user.role,
  iat: timestamp,
  exp: timestamp + 24h
}
```

**OAuth Integration:**
- Google OAuth 2.0 with Passport-Google-OAuth20
- Microsoft OAuth with Passport-Microsoft
- Automatic account creation or linking

#### Security Implementation

**Password Security:**
- Bcrypt hashing with salt rounds = 10
- Password complexity validation
- Account lockout after failed attempts (planned)

**Two-Factor Authentication:**
- TOTP (Time-based One-Time Password) using Speakeasy
- QR code generation with qrcode library
- 30-second validity window

**API Security:**
- Rate limiting: 100 requests per 15 minutes per IP
- Input validation with express-validator
- MongoDB injection prevention with express-mongo-sanitize
- XSS protection with Helmet
- CSRF tokens for state-changing operations

**Session Management:**
- Redis-backed sessions for scalability
- Session expiry: 24 hours
- Automatic cleanup of expired sessions

#### Real-Time Communication: WebSocket (ws)

**Proctoring WebSocket Flow:**
```
1. Student connects to WebSocket server
2. Server authenticates connection via JWT
3. Student joins quiz-specific room
4. Browser sends proctoring events:
   - Face detection results
   - Tab switch events
   - Copy-paste attempts
5. Server broadcasts to instructor dashboard
6. Server logs violations to database
```

**Message Format:**
```javascript
{
  type: 'PROCTORING_EVENT',
  quizId: '...',
  studentId: '...',
  eventType: 'TAB_SWITCH',
  timestamp: Date.now(),
  data: { ... }
}
```

#### Email Service: Nodemailer

**Use Cases:**
- Password reset emails
- Quiz assignment notifications
- Result notifications
- Account verification (planned)

**Configuration:**
```javascript
{
  service: 'Gmail', // or SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}
```

#### Logging: Winston

**Log Levels:**
- `error`: Application errors
- `warn`: Warning conditions
- `info`: Informational messages
- `debug`: Debug information

**Transports:**
- Console: Development environment
- File: Production (logs/error.log, logs/combined.log)
- Rotation: Daily rotation to prevent large files

---

### 4.2.3 AI Integration

#### Primary Model: Ollama (qwen2.5-coder:7b)

**Model Specifications:**
- Parameters: 7 billion
- Specialization: Code generation and understanding
- Context Window: 32K tokens
- Quantization: Q4_K_M (balanced quality/performance)
- Size: ~4.7GB

**Why qwen2.5-coder:**
- Specifically trained on code across multiple languages
- Better understanding of programming concepts
- Open-source and runs locally (no API costs)
- Offline capability
- Privacy-friendly (data doesn't leave server)

**Prompt Engineering Strategy:**

```javascript
const prompt = `You are an expert programming instructor creating quiz questions.

Topic: ${topic}
Language: ${language}
Difficulty: ${difficulty}
Question Type: ${type}
Count: ${count}

Generate ${count} ${difficulty} ${type} questions about ${topic} in ${language}.

Requirements:
- Technically accurate
- Clear and unambiguous
- Appropriate difficulty level
- Include explanations
- Return as JSON array

Format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"], // for MCQ
    "correctAnswer": "...",
    "explanation": "...",
    "points": number,
    "tags": ["..."]
  }
]`;
```

**API Integration:**
```javascript
const response = await axios.post('http://localhost:11434/api/generate', {
  model: 'qwen2.5-coder:7b',
  prompt: prompt,
  stream: false,
  options: {
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40
  }
});
```

#### Secondary Model: Google Gemini Pro

**Use Cases:**
- Fallback when Ollama is unavailable
- Longer context requirements
- Multi-modal question generation (future: images)

**Integration:**
```javascript
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const result = await model.generateContent(prompt);
```

---

### 4.2.4 Code Execution (Planned Feature)

**Architecture Design:**

```
Student Code → Backend API → Docker Container → Execute → Return Results
```

**Security Measures:**
- Isolated Docker containers per execution
- Resource limits (CPU, memory, execution time)
- Network isolation (no internet access)
- Read-only file system
- Auto-cleanup after execution

**Supported Languages:**
- JavaScript (Node.js)
- Python 3
- Java (OpenJDK)
- C++ (g++)

**Test Case Evaluation:**
```javascript
{
  input: "5",
  expectedOutput: "120",
  timeout: 2000, // ms
  memoryLimit: 128 // MB
}
```

---

### 4.2.5 Deployment Architecture

#### Containerization: Docker

**Services:**
1. **MongoDB**: Database container
2. **Redis**: Cache and session store
3. **Backend**: Node.js API server
4. **Frontend**: Nginx serving React build
5. **Ollama**: AI model service (optional)

**docker-compose.yml Structure:**
```yaml
services:
  mongodb:
    image: mongo:8
    ports: ["27017:27017"]
    volumes: [mongodb_data:/data/db]
  
  backend:
    build: ./backend
    ports: ["4000:4000"]
    depends_on: [mongodb, redis]
  
  frontend:
    build: ./frontend
    ports: ["3000:80"]
  
  nginx:
    image: nginx:alpine
    ports: ["80:80"]
```

**Benefits:**
- Consistent environment across development and production
- Easy scaling (docker-compose scale)
- Simplified dependency management
- Quick setup for demonstration

#### Web Server: Nginx

**Configuration:**
- Reverse proxy for backend API
- Static file serving for frontend
- Gzip compression
- Caching headers for assets
- Load balancing ready

**Sample Configuration:**
```nginx
server {
  listen 80;
  
  location / {
    root /usr/share/nginx/html;
    try_files $uri /index.html;
  }
  
  location /api {
    proxy_pass http://backend:4000;
    proxy_set_header Host $host;
  }
}
```

---

## 4.3 Testing

<div align="center">

### 🧪 **Quality Assurance & Testing Strategy**

</div>

### 4.3.1 Testing Approach

<div align="center">

#### ✅ **Multi-Level Testing Framework**

</div>

The project follows a multi-level testing strategy to ensure reliability and correctness:

#### 1. 🔬 Unit Testing

**Backend Unit Tests (Jest):**
- Model validation logic
- Utility functions
- Service layer methods
- Middleware functions

**Frontend Unit Tests (Vitest):**
- React component rendering
- Custom hooks
- Utility functions
- Redux reducers and actions

**Coverage Target:** 60% (achieved: 45% - acceptable for demo project)

#### 2. Integration Testing

**API Integration Tests (Supertest):**
- Complete request-response cycles
- Database interactions
- Authentication flows
- Error handling

**Example Test:**
```javascript
describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'test123' });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });
  
  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });
    
    expect(res.status).toBe(401);
  });
});
```

#### 3. Component Testing

**React Component Tests:**
```javascript
describe('QuizCard Component', () => {
  it('renders quiz information correctly', () => {
    render(<QuizCard quiz={mockQuiz} />);
    expect(screen.getByText(mockQuiz.title)).toBeInTheDocument();
  });
  
  it('shows start button when quiz is available', () => {
    render(<QuizCard quiz={mockQuiz} />);
    expect(screen.getByText('Start Quiz')).toBeInTheDocument();
  });
});
```

#### 4. Manual Testing

**Test Scenarios:**
- User registration and login flows
- Quiz creation with AI generation
- Complete quiz-taking experience
- Proctoring violation detection
- Results viewing and analytics
- Multi-role access control
- Cross-browser compatibility
- Responsive design on mobile devices

#### 5. Security Testing

**Security Checks:**
- SQL injection attempts (MongoDB)
- XSS attack vectors
- CSRF token validation
- JWT token manipulation
- Rate limiting effectiveness
- File upload validation (future feature)

---

### 4.3.2 Test Cases

#### Authentication Test Cases

| Test ID | Test Case | Input | Expected Output | Status |
|---------|-----------|-------|-----------------|--------|
| TC-AUTH-01 | Register new user | Valid email, password, username | User created, success message | ✅ Pass |
| TC-AUTH-02 | Register with duplicate email | Existing email | Error: Email already exists | ✅ Pass |
| TC-AUTH-03 | Login with valid credentials | Correct email/password | JWT token returned | ✅ Pass |
| TC-AUTH-04 | Login with invalid password | Wrong password | Error 401: Invalid credentials | ✅ Pass |
| TC-AUTH-05 | Access protected route without token | No Authorization header | Error 401: No token | ✅ Pass |
| TC-AUTH-06 | Access with expired token | Expired JWT | Error 401: Token expired | ✅ Pass |
| TC-AUTH-07 | Enable 2FA | Valid user account | 2FA secret and QR code generated | ✅ Pass |
| TC-AUTH-08 | Verify 2FA token | Valid TOTP token | Authentication successful | ✅ Pass |

#### Quiz Management Test Cases

| Test ID | Test Case | Input | Expected Output | Status |
|---------|-----------|-------|-----------------|--------|
| TC-QUIZ-01 | Create quiz as instructor | Title, description, questions | Quiz created successfully | ✅ Pass |
| TC-QUIZ-02 | Create quiz as student | Quiz data | Error 403: Forbidden | ✅ Pass |
| TC-QUIZ-03 | Publish quiz | Quiz ID | isPublished set to true | ✅ Pass |
| TC-QUIZ-04 | Get published quizzes | - | List of published quizzes | ✅ Pass |
| TC-QUIZ-05 | Update quiz settings | Time limit, attempts | Settings updated | ✅ Pass |
| TC-QUIZ-06 | Delete quiz | Quiz ID | Quiz deleted from database | ✅ Pass |
| TC-QUIZ-07 | Randomize questions | randomizeQuestions: true | Questions in random order | ✅ Pass |

#### AI Question Generation Test Cases

| Test ID | Test Case | Input | Expected Output | Status |
|---------|-----------|-------|-----------------|--------|
| TC-AI-01 | Generate MCQ questions | JavaScript, Easy, 5 | 5 MCQ questions generated | ✅ Pass |
| TC-AI-02 | Generate coding questions | Python, Medium, 3 | 3 coding questions with test cases | ✅ Pass |
| TC-AI-03 | Generate with invalid language | "InvalidLang", Easy, 5 | Error: Unsupported language | ✅ Pass |
| TC-AI-04 | Generate with count > 20 | JavaScript, Easy, 25 | Error: Max 20 questions | ✅ Pass |
| TC-AI-05 | Validate generated questions | AI response | All questions have required fields | ✅ Pass |
| TC-AI-06 | Fallback to Gemini | Ollama unavailable | Questions generated via Gemini | ⚠️ Manual |

#### Quiz Taking Test Cases

| Test ID | Test Case | Input | Expected Output | Status |
|---------|-----------|-------|-----------------|--------|
| TC-TAKE-01 | Start quiz | Valid quiz ID | Quiz loaded, timer started | ✅ Pass |
| TC-TAKE-02 | Submit MCQ answer | Question ID, option | Answer recorded | ✅ Pass |
| TC-TAKE-03 | Submit quiz | All answers | Results calculated and saved | ✅ Pass |
| TC-TAKE-04 | Submit after time limit | Late submission | Error: Time expired | ✅ Pass |
| TC-TAKE-05 | Attempt quiz multiple times | Quiz with maxAttempts | Limited by maxAttempts | ✅ Pass |
| TC-TAKE-06 | View results | Result ID | Score, answers, explanations shown | ✅ Pass |

#### Proctoring Test Cases

| Test ID | Test Case | Input | Expected Output | Status |
|---------|-----------|-------|-----------------|--------|
| TC-PROC-01 | Face verification before quiz | Student face image | Face matched or rejected | ✅ Pass |
| TC-PROC-02 | Detect tab switch | Switch to another tab | Violation logged | ✅ Pass |
| TC-PROC-03 | Detect copy-paste | Ctrl+V in answer field | Violation logged, paste blocked | ✅ Pass |
| TC-PROC-04 | Face not detected | No face in camera | Violation logged | ✅ Pass |
| TC-PROC-05 | Multiple faces detected | 2+ faces in frame | High severity violation | ⚠️ Manual |
| TC-PROC-06 | Real-time instructor view | Active quiz session | Live violations displayed | ✅ Pass |

#### Analytics Test Cases

| Test ID | Test Case | Input | Expected Output | Status |
|---------|-----------|-------|-----------------|--------|
| TC-ANLY-01 | Student performance | Student ID | Charts with scores, trends | ✅ Pass |
| TC-ANLY-02 | Quiz analytics | Quiz ID | Attempt count, avg score | ✅ Pass |
| TC-ANLY-03 | Question statistics | Question ID | Correct %, difficulty score | ✅ Pass |
| TC-ANLY-04 | Comparative analytics | Multiple students | Ranking, percentiles | ✅ Pass |

---

### 4.3.3 Test Reports

#### Test Summary

**Overall Test Results:**
- Total Test Cases: 38
- Passed: 35 (92%)
- Failed: 0
- Manual Testing Required: 3 (8%)

#### Test Coverage

**Backend Coverage (Jest):**
```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   45.2  |   38.1   |   42.3  |   45.8  |
 controllers/         |   52.1  |   41.2   |   48.9  |   52.7  |
 models/              |   78.3  |   70.5   |   75.2  |   79.1  |
 services/            |   38.7  |   32.4   |   35.6  |   39.2  |
 middleware/          |   61.4  |   55.8   |   58.3  |   62.1  |
 utils/               |   82.1  |   75.3   |   80.4  |   83.2  |
```

**Frontend Coverage (Vitest):**
```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   38.4  |   31.2   |   36.7  |   39.1  |
 components/          |   42.1  |   34.8   |   40.3  |   43.2  |
 pages/               |   31.2  |   25.4   |   29.8  |   31.9  |
 hooks/               |   55.7  |   48.2   |   52.3  |   56.4  |
 utils/               |   68.3  |   61.5   |   65.7  |   69.1  |
```

#### Known Issues and Limitations

| Issue ID | Description | Severity | Status | Workaround |
|----------|-------------|----------|--------|------------|
| ISS-01 | Face detection accuracy drops in low light | Medium | Known Limitation | Require adequate lighting |
| ISS-02 | Large code submissions may timeout | Low | Known Limitation | Set appropriate time limits |
| ISS-03 | AI generation occasionally produces invalid JSON | Medium | Handled | Retry logic implemented |
| ISS-04 | WebSocket reconnection on network interruption | Medium | Planned Fix | Manual refresh required |
| ISS-05 | Mobile camera access issues on some browsers | Low | Known Limitation | Desktop recommended |

#### Performance Test Results

**API Response Times (Average):**
- Login: 145ms
- Get Quizzes: 89ms
- Submit Quiz: 234ms
- AI Question Generation: 18-25 seconds
- Get Analytics: 312ms

**Frontend Performance:**
- Initial Load: 2.1s
- Time to Interactive: 3.4s
- Lighthouse Score: 87/100

---

<div align="center">

## 📖 **4.4 User Manual**

</div>

### 4.4.1 💻 System Requirements

<div align="center">

#### 👥 **For Students and Instructors**

</div>

| Component | Requirement |
|-----------|-------------|
| 🌐 Web Browser | Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ |
| 📹 Webcam | Required for proctoring features |
| 🌍 Internet | Minimum 2 Mbps stable connection |
| 🖥️ Screen Resolution | 1280x720 or higher |

<div align="center">

#### 👨‍💼 **For Administrators (Setup)**

</div>

| Component | Requirement |
|-----------|-------------|
| 🐳 Docker Desktop | Version 4.0+ |
| 💾 RAM | 8GB minimum (16GB recommended) |
| 📂 Disk Space | 20GB free (40GB if using AI features) |
| 🖥️ Operating System | Windows 10/11, macOS 12+, or Linux |

---

### 4.4.2 Installation and Setup

#### Quick Setup (Docker)

**Step 1: Clone the Repository**
```bash
git clone https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform.git
cd Online-Quiz-Questionnaire-Platform
```

**Step 2: Run Setup Script**

**Windows:**
```powershell
cd scripts\windows
.\setup-demo.bat
```

**macOS/Linux:**
```bash
cd scripts/macos  # or scripts/linux
chmod +x setup-demo.sh
./setup-demo.sh
```

**Step 3: Access the Platform**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

#### Manual Setup (Without Docker)

**Step 1: Install Dependencies**
- Node.js 18+
- MongoDB 4.4+
- Redis (optional, for sessions)

**Step 2: Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

**Step 3: Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

**Step 4: Load Demo Data**
```bash
cd backend
npm run seed
```

---

### 4.4.3 User Guide

#### For Students

**1. Registration and Login**

a. Navigate to http://localhost:3000
b. Click "Sign Up" button
c. Fill in:
   - Username
   - Email
   - Password (minimum 6 characters)
   - Select Role: Student
d. Click "Register"
e. Login with credentials

**2. Face Enrollment (Required for Proctored Quizzes)**

a. Go to Profile page
b. Click "Enroll Face"
c. Allow camera access
d. Position face in the frame
e. Click "Capture"
f. Confirm enrollment

**3. Taking a Quiz**

a. Navigate to "Quizzes" page
b. Browse available quizzes
c. Click "Start Quiz" on desired quiz
d. If proctoring is enabled:
   - Allow camera access
   - Complete face verification
e. Answer questions:
   - **MCQ**: Click on one option
   - **True/False**: Select True or False
   - **Fill-in-the-blank**: Type answer in text field
   - **Coding**: Write code in Monaco editor
f. Click "Next" to proceed
g. Review answers (if allowed)
h. Click "Submit Quiz"
i. View results

**4. Viewing Results and Analytics**

a. Navigate to "My Results" page
b. Select quiz from list
c. View:
   - Score and percentage
   - Correct/incorrect answers
   - Explanations (if available)
   - Time spent
d. Navigate to "My Performance" for analytics:
   - Score trends over time
   - Average performance by topic
   - Comparison with class average

**5. Best Practices During Proctored Quizzes**

- ✅ Ensure good lighting for face detection
- ✅ Remain in full-screen mode
- ✅ Keep face visible in camera
- ✅ Avoid switching tabs or applications
- ❌ Don't copy-paste from external sources
- ❌ Don't allow others in camera frame

---

#### For Instructors

**1. Creating a Quiz**

a. Login as instructor
b. Navigate to "Create Quiz" page
c. Enter quiz details:
   - Title
   - Description
   - Time limit (minutes, optional)
   - Maximum attempts
   - Passing score percentage
d. Configure settings:
   - ☑️ Randomize questions
   - ☑️ Randomize options
   - ☑️ Show correct answers after submission
   - ☑️ Allow review before submission
e. Add questions (see next section)
f. Click "Save as Draft" or "Publish"

**2. Adding Questions - Method 1: AI Generation**

a. Click "Generate with AI" button
b. Select:
   - Programming Language (JavaScript, Python, Java, C++)
   - Difficulty Level (Easy, Medium, Hard)
   - Question Type (MCQ, True/False, Coding)
   - Number of questions (1-20)
c. Click "Generate"
d. Wait 15-30 seconds for AI processing
e. Review generated questions
f. Edit if needed
g. Click "Add to Quiz"

**3. Adding Questions - Method 2: Manual Creation**

a. Click "Add Question Manually"
b. Select question type
c. Fill in:
   - Question text
   - Points
   - Difficulty level
   - For MCQ: 4 options + correct answer
   - For True/False: Correct answer
   - For Fill-in-blank: Correct answer(s)
   - For Coding: Problem statement, test cases, solution
d. Add explanation (optional)
e. Add tags for categorization
f. Click "Save Question"

**4. Configuring Proctoring**

a. In quiz settings, enable:
   - ☑️ Proctoring Enabled
   - ☑️ Face Verification Required
b. Set:
   - Tab Switch Limit (e.g., 3 warnings)
   - Violation Actions:
     - Log only
     - Auto-submit after violations
     - Flag for manual review
c. Save settings

**5. Monitoring Active Quizzes**

a. Navigate to "Monitor Quizzes" page
b. Select active quiz session
c. View real-time:
   - List of students currently taking quiz
   - Face detection status (green/red indicator)
   - Violations log with timestamps
   - Current question progress
d. Click on student for detailed view:
   - Camera feed snapshot (if captured)
   - Violation history
   - Answer progress
e. Flag students for review if suspicious

**6. Grading Submissions**

**Auto-Grading:**
- MCQ, True/False, Fill-in-blank: Automatically graded
- Results available immediately after submission

**Manual Grading (Coding/Essay):**
a. Navigate to "Grade Submissions" page
b. Filter by quiz
c. Select submission
d. Review:
   - Student's code/essay
   - Test case results (for coding)
e. Assign points
f. Provide feedback
g. Click "Save Grade"

**7. Viewing Analytics**

a. Navigate to "Analytics" page
b. Select quiz or student
c. View:
   - **Quiz Analytics:**
     - Average score
     - Completion rate
     - Time distribution
     - Question difficulty analysis
   - **Student Analytics:**
     - Individual performance trends
     - Comparison with class
     - Weak areas identification
d. Export data as CSV/PDF

---

#### For Administrators

**1. User Management**

a. Login as admin
b. Navigate to "User Management"
c. View all users with filters:
   - By role (Student, Instructor, Admin)
   - By status (Active, Inactive)
d. Create new user:
   - Click "Add User"
   - Fill in details
   - Assign role
   - Click "Create"
e. Edit user:
   - Click edit icon
   - Modify details
   - Save changes
f. Delete user (use with caution)

**2. System Settings**

a. Navigate to "Settings" page
b. Configure:
   - Site title and logo
   - Email SMTP settings
   - AI service endpoints
   - Proctoring thresholds
   - Session timeout
c. Save changes

**3. Viewing Audit Logs**

a. Navigate to "Audit Logs"
b. Filter by:
   - User
   - Action type (Login, Create, Update, Delete)
   - Date range
c. Export logs for compliance

**4. Managing Question Bank**

a. Navigate to "Question Bank"
b. View all questions across system
c. Filter by:
   - Language
   - Difficulty
   - Type
   - Tags
d. Edit or delete questions
e. Export question bank as JSON

---

### 4.4.4 Troubleshooting

**Common Issues and Solutions:**

| Issue | Solution |
|-------|----------|
| **"Camera not detected"** | 1. Grant camera permission in browser<br>2. Check if camera is being used by another app<br>3. Try different browser |
| **"Face verification failed"** | 1. Ensure good lighting<br>2. Position face clearly in frame<br>3. Re-enroll face if persistent |
| **"AI generation timeout"** | 1. Check if Ollama service is running<br>2. Try with fewer questions<br>3. Use Gemini as fallback |
| **"Cannot submit quiz"** | 1. Check internet connection<br>2. Ensure all required questions are answered<br>3. Refresh page and try again |
| **"Login failed"** | 1. Verify email and password<br>2. Check if account exists<br>3. Try password reset |
| **"Docker containers not starting"** | 1. Ensure Docker Desktop is running<br>2. Check port conflicts (3000, 4000, 27017)<br>3. Run `docker-compose down` then `up` |

**For Technical Support:**
- Check documentation: `/docs` folder
- Report issues: GitHub Issues
- Contact: [Your Email]

---

This completes Chapter 4 with comprehensive implementation details, testing documentation, and user manual for the Online Quiz & Questionnaire Platform.

---

<div align="center">

# 📅 **CHAPTER 5: PROJECT PLAN**

</div>

<div align="center">

## 📊 **5.1 Gantt Chart**

</div>

The project was executed over a 24-week period from **May 2024 to November 2024**. The following Gantt chart illustrates the project timeline:

```
Project Timeline: Online Quiz & Questionnaire Platform
Duration: 24 Weeks (May 2024 - November 2024)

Task                               Week: 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
════════════════════════════════════════════════════════════════════════════════════════════════════════════════
1. Research & Planning             ███████
   - Requirements gathering        ████
   - Technology selection             ████
   - System design                       ████

2. Environment Setup                     ████████
   - Development tools setup             ████
   - Docker configuration                   ████
   - Database setup                            ████

3. Backend Development                       ████████████████████
   - User authentication                        ████████
   - Quiz management API                            ████████
   - Question bank system                              ████████
   - Grading engine                                        ████████

4. Frontend Development                          ████████████████████████
   - UI component library                          ████████
   - Quiz creation interface                           ████████
   - Quiz taking interface                                 ████████
   - Analytics dashboard                                       ████████

5. AI Integration                                            ████████████
   - Ollama setup                                            ████████
   - Prompt engineering                                         ████████
   - Question generation API                                       ████████

6. Proctoring System                                                 ████████████
   - Face detection integration                                     ████████
   - WebSocket setup                                                    ████████
   - Monitoring dashboard                                                  ████████

7. Testing & Quality Assurance                                              ████████████
   - Unit testing                                                          ████████
   - Integration testing                                                      ████████
   - Bug fixing                                                                  ████████

8. Documentation                                                                    ████████
   - Code documentation                                                            ████
   - User manual                                                                      ████
   - API documentation                                                                   ████

9. Deployment & Demo Prep                                                                  ████████
   - Docker optimization                                                                  ████
   - Demo data preparation                                                                   ████
   - Final testing                                                                              ████

Milestones:
  ● Week 2  : Requirements finalized
  ● Week 5  : Database schema complete
  ● Week 10 : Core backend APIs functional
  ● Week 14 : Frontend MVP ready
  ● Week 16 : AI integration complete
  ● Week 18 : Proctoring system functional
  ● Week 21 : Testing complete
  ● Week 24 : Project demo ready

Legend: ███ Active development    ░░░ Overlapping/parallel work
```

**Critical Path:**
Research & Planning → Backend Development → Frontend Development → AI Integration → Proctoring → Testing → Documentation

**Project Phases:**
- **Phase 1**: Planning & Setup (Weeks 1-4)
- **Phase 2**: Core Development (Weeks 5-14)
- **Phase 3**: Advanced Features (Weeks 15-18)
- **Phase 4**: Testing & Documentation (Weeks 19-22)
- **Phase 5**: Deployment & Refinement (Weeks 23-24)

---

<div align="center">

## ⏱️ **5.2 Effort Schedule & Cost Estimation**

</div>

### 5.2.1 📋 Effort Schedule

**Total Project Effort:** Approximately **960 person-hours** over 24 weeks  
**Team Size:** 5 members (Aman, Chetan, Shashak, Vanisha, Yash)

| Phase | Activity | Hours | Weeks | Team Members |
|-------|----------|-------|-------|--------------|
| **1. Research & Planning** | | **80** | **2** | |
| | Requirements gathering | 20 | | Aman, Chetan, Vanisha |
| | Technology research | 24 | | Shashak, Yash |
| | Architecture design | 20 | | Aman, Vanisha |
| | UI/UX wireframing | 16 | | Chetan |
| **2. Backend Development** | | **240** | **10** | |
| | Database schema design | 16 | | Vanisha |
| | Authentication system | 40 | | Aman |
| | Quiz API development | 60 | | Aman, Yash |
| | Question management | 40 | | Aman |
| | Grading engine | 48 | | Aman, Vanisha |
| | API security | 24 | | Aman |
| | Logging & error handling | 12 | | Yash |
| **3. Frontend Development** | | **220** | **11** | |
| | Component library setup | 20 | | Chetan |
| | Authentication UI | 32 | | Chetan |
| | Quiz creation interface | 48 | | Chetan |
| | Quiz taking interface | 56 | | Chetan, Yash |
| | Analytics dashboard | 40 | | Chetan |
| | Responsive design | 24 | | Chetan |
| **4. AI Integration** | | **80** | **4** | |
| | Ollama setup & testing | 16 | | Shashak |
| | Prompt engineering | 32 | | Shashak |
| | Question generation API | 24 | | Shashak, Aman |
| | Validation logic | 8 | | Shashak |
| **5. Proctoring System** | | **120** | **4** | |
| | face-api.js integration | 40 | | Vanisha |
| | WebSocket server | 32 | | Vanisha, Aman |
| | Violation detection | 24 | | Vanisha |
| | Monitoring dashboard | 24 | | Vanisha, Chetan |
| **6. Testing** | | **120** | **3** | |
| | Unit test development | 40 | | Yash |
| | Integration testing | 32 | | Yash, Aman |
| | Manual testing | 32 | | All team members |
| | Bug fixing | 16 | | All team members |
| **7. Documentation** | | **60** | **2** | |
| | Code documentation | 16 | | Yash |
| | User manual | 20 | | Chetan, Yash |
| | API documentation | 16 | | Aman, Yash |
| | Project report | 8 | | All team members |
| **8. Deployment** | | **40** | **2** | |
| | Docker configuration | 16 | | Yash |
| | Deployment scripts | 12 | | Yash |
| | Demo preparation | 12 | | All team members |
| **Total** | | **960** | **24** | **5** |

**Weekly Effort Distribution:**
- Average: 40 hours/week (8 hours/week per team member)
- Peak (Weeks 10-16): 50-60 hours/week
- Final weeks (22-24): 30-35 hours/week

---

### 5.2.2 💰 Cost Estimation

> **📌 Note:** This is an academic project by 5 students completed as part of our Bachelor of Technology degree program. All development was done using **free and open-source tools**.

#### Project Costs (Academic)

| Item | Cost | Notes |
|------|------|-------|
| GitHub (Team) | $0 | Free for students |
| MongoDB Atlas | $0 | Free tier used |
| Google Cloud (Gemini API) | $0 | Free tier/credits |
| Domain & SSL | $0 | Used localhost for demo |
| Hosting | $0 | Local development |
| Development tools & IDE | $0 | VS Code, Open source |
| Docker & Containers | $0 | Open source |
| AI Models (Ollama) | $0 | Local, open source |
| Testing frameworks | $0 | Jest, Vitest (open source) |
| **Total Project Cost** | **$0** | |

#### Infrastructure (Hardware)

| Item | Cost | Notes |
|------|------|-------|
| Development laptops | $0 | Personal/existing hardware (5 laptops) |
| Internet & utilities | $0 | Existing resources |
| **Total Hardware Cost** | **$0** | |

#### **Total Actual Cost**

| Category | Amount |
|----------|--------|
| Software & Services | $0 |
| Hardware | $0 |
| **Grand Total** | **$0** |

**Key Benefits of Open-Source Stack:**
- Zero licensing costs
- Free student/educational resources
- Community support and documentation
- Local AI deployment (Ollama) eliminates API costs
- Docker enables consistent development environment across team
- GitHub provides free repository hosting and collaboration tools

**Educational Value:**
- Hands-on experience with industry-standard technologies
- Complete ownership of codebase
- Freedom to experiment and learn
- Portfolio-worthy project demonstration
- Practical application of theoretical concepts

---

<div align="center">

## 🗂️ **5.3 Work Breakdown Structure (WBS)**

</div>

```
1.0 🎓 Online Quiz & Questionnaire Platform
│
├── 1.1 Project Management
│   ├── 1.1.1 Project Planning
│   ├── 1.1.2 Requirements Analysis
│   ├── 1.1.3 Risk Management
│   └── 1.1.4 Progress Tracking
│
├── 1.2 Design
│   ├── 1.2.1 System Architecture Design
│   ├── 1.2.2 Database Design
│   │   ├── 1.2.2.1 Schema Definition
│   │   ├── 1.2.2.2 Relationship Mapping
│   │   └── 1.2.2.3 Index Design
│   ├── 1.2.3 UI/UX Design
│   │   ├── 1.2.3.1 Wireframing
│   │   ├── 1.2.3.2 Mockups
│   │   └── 1.2.3.3 User Flow Diagrams
│   └── 1.2.4 API Design
│       ├── 1.2.4.1 Endpoint Specification
│       └── 1.2.4.2 Data Models
│
├── 1.3 Backend Development
│   ├── 1.3.1 Environment Setup
│   │   ├── 1.3.1.1 Node.js Setup
│   │   ├── 1.3.1.2 MongoDB Setup
│   │   └── 1.3.1.3 Redis Setup
│   ├── 1.3.2 Authentication Module
│   │   ├── 1.3.2.1 User Registration
│   │   ├── 1.3.2.2 Login/Logout
│   │   ├── 1.3.2.3 JWT Implementation
│   │   ├── 1.3.2.4 2FA Implementation
│   │   └── 1.3.2.5 OAuth Integration
│   ├── 1.3.3 Quiz Management Module
│   │   ├── 1.3.3.1 Quiz CRUD Operations
│   │   ├── 1.3.3.2 Quiz Configuration
│   │   └── 1.3.3.3 Quiz Publishing
│   ├── 1.3.4 Question Management Module
│   │   ├── 1.3.4.1 Question CRUD Operations
│   │   ├── 1.3.4.2 Question Bank Management
│   │   └── 1.3.4.3 Question Validation
│   ├── 1.3.5 Grading Module
│   │   ├── 1.3.5.1 Auto-grading Logic
│   │   ├── 1.3.5.2 Manual Grading Interface
│   │   └── 1.3.5.3 Result Calculation
│   ├── 1.3.6 AI Integration Module
│   │   ├── 1.3.6.1 Ollama Integration
│   │   ├── 1.3.6.2 Gemini Integration
│   │   └── 1.3.6.3 Question Validation
│   └── 1.3.7 Analytics Module
│       ├── 1.3.7.1 Data Aggregation
│       └── 1.3.7.2 Metrics Calculation
│
├── 1.4 Frontend Development
│   ├── 1.4.1 Environment Setup
│   │   ├── 1.4.1.1 React Setup
│   │   ├── 1.4.1.2 Vite Configuration
│   │   └── 1.4.1.3 Tailwind Setup
│   ├── 1.4.2 Component Library
│   │   ├── 1.4.2.1 UI Components
│   │   ├── 1.4.2.2 Form Components
│   │   └── 1.4.2.3 Layout Components
│   ├── 1.4.3 Authentication Pages
│   │   ├── 1.4.3.1 Login Page
│   │   ├── 1.4.3.2 Registration Page
│   │   └── 1.4.3.3 Profile Page
│   ├── 1.4.4 Quiz Management Pages
│   │   ├── 1.4.4.1 Quiz List Page
│   │   ├── 1.4.4.2 Quiz Creation Page
│   │   └── 1.4.4.3 Quiz Edit Page
│   ├── 1.4.5 Quiz Taking Interface
│   │   ├── 1.4.5.1 Quiz Start Page
│   │   ├── 1.4.5.2 Question Display
│   │   ├── 1.4.5.3 Timer Component
│   │   └── 1.4.5.4 Submission Confirmation
│   ├── 1.4.6 Proctoring Interface
│   │   ├── 1.4.6.1 Face Detection UI
│   │   ├── 1.4.6.2 Monitoring Dashboard
│   │   └── 1.4.6.3 Violation Display
│   └── 1.4.7 Analytics Dashboard
│       ├── 1.4.7.1 Charts Implementation
│       ├── 1.4.7.2 Data Visualization
│       └── 1.4.7.3 Export Functionality
│
├── 1.5 Proctoring System
│   ├── 1.5.1 Face Detection
│   │   ├── 1.5.1.1 face-api.js Integration
│   │   ├── 1.5.1.2 Model Loading
│   │   └── 1.5.1.3 Face Matching Logic
│   ├── 1.5.2 Behavior Monitoring
│   │   ├── 1.5.2.1 Tab Switch Detection
│   │   ├── 1.5.2.2 Copy-Paste Detection
│   │   └── 1.5.2.3 Full-screen Enforcement
│   ├── 1.5.3 Real-time Communication
│   │   ├── 1.5.3.1 WebSocket Server
│   │   ├── 1.5.3.2 Event Broadcasting
│   │   └── 1.5.3.3 Connection Management
│   └── 1.5.4 Violation Management
│       ├── 1.5.4.1 Violation Logging
│       └── 1.5.4.2 Alerting System
│
├── 1.6 Testing
│   ├── 1.6.1 Unit Testing
│   │   ├── 1.6.1.1 Backend Unit Tests
│   │   └── 1.6.1.2 Frontend Unit Tests
│   ├── 1.6.2 Integration Testing
│   │   ├── 1.6.2.1 API Integration Tests
│   │   └── 1.6.2.2 Component Integration Tests
│   ├── 1.6.3 System Testing
│   │   ├── 1.6.3.1 End-to-End Testing
│   │   └── 1.6.3.2 User Acceptance Testing
│   └── 1.6.4 Security Testing
│       ├── 1.6.4.1 Vulnerability Assessment
│       └── 1.6.4.2 Penetration Testing
│
├── 1.7 Deployment
│   ├── 1.7.1 Containerization
│   │   ├── 1.7.1.1 Dockerfile Creation
│   │   └── 1.7.1.2 Docker Compose Setup
│   ├── 1.7.2 Configuration
│   │   ├── 1.7.2.1 Environment Variables
│   │   └── 1.7.2.2 Nginx Configuration
│   └── 1.7.3 Deployment Scripts
│       ├── 1.7.3.1 Windows Scripts
│       ├── 1.7.3.2 macOS Scripts
│       └── 1.7.3.3 Linux Scripts
│
└── 1.8 Documentation
    ├── 1.8.1 Technical Documentation
    │   ├── 1.8.1.1 Architecture Documentation
    │   ├── 1.8.1.2 API Documentation
    │   └── 1.8.1.3 Code Documentation
    ├── 1.8.2 User Documentation
    │   ├── 1.8.2.1 User Manual
    │   ├── 1.8.2.2 Quick Start Guide
    │   └── 1.8.2.3 FAQ
    └── 1.8.3 Project Report
        ├── 1.8.3.1 Report Writing
        └── 1.8.3.2 Presentation Preparation
```

---

<div align="center">

## 🔄 **5.4 Deviation from Original Plan and Corrections Applied**

</div>

### 5.4.1 ⚠️ Deviations

| Original Plan | Actual Implementation | Reason for Deviation | Impact |
|---------------|----------------------|---------------------|---------|
| **Code execution using external API** | **Planned for future** | Security concerns and time constraints | Low - Manual grading available |
| **Mobile native app** | **Web-responsive design** | Focused on web-first approach | Low - PWA capabilities available |
| **Real-time video streaming** | **Snapshot-based monitoring** | Bandwidth and privacy concerns | Medium - Still effective for proctoring |
| **Complete Moodle LTI integration** | **Not implemented** | Time constraints | Low - Standalone system sufficient |
| **Blockchain for result verification** | **Not implemented** | Complexity vs. benefit analysis | Low - Standard DB security sufficient |
| **Automated difficulty calibration** | **Basic implementation** | Required more historical data | Low - Manual categorization works |

### 5.4.2 Timeline Deviations

| Phase | Planned Duration | Actual Duration | Variance | Reason |
|-------|-----------------|-----------------|----------|--------|
| AI Integration | 3 weeks | 4 weeks | +1 week | Prompt engineering took longer |
| Proctoring System | 3 weeks | 4 weeks | +1 week | face-api.js learning curve |
| Frontend Development | 10 weeks | 11 weeks | +1 week | Additional UI refinements |
| Testing | 2 weeks | 3 weeks | +1 week | More bugs than expected |
| **Total Project** | **22 weeks** | **24 weeks** | **+2 weeks** | Absorbed in buffer time |

### 5.4.3 Scope Changes

**Features Added (Not in Original Scope):**
1. ✅ Two-Factor Authentication (2FA)
2. ✅ OAuth integration (Google, Microsoft)
3. ✅ Real-time WebSocket monitoring
4. ✅ Advanced analytics with charts
5. ✅ Docker-based deployment
6. ✅ Ngrok tunneling for demos

**Features Deferred to Future Versions:**
1. ⏳ Actual code execution in sandbox
2. ⏳ Video recording of entire session
3. ⏳ Plagiarism detection for code
4. ⏳ Mobile applications (iOS/Android)
5. ⏳ LMS integration (Moodle, Canvas)
6. ⏳ Peer review system
7. ⏳ Gamification elements

### 5.4.4 Corrective Actions Taken

| Issue Encountered | Corrective Action | Outcome |
|-------------------|------------------|---------|
| **High AI generation time (>60s)** | Implemented loading states, reduced default question count, added caching | User experience improved |
| **Face detection accuracy issues** | Added lighting guidelines, improved error messages, made it optional | More reliable proctoring |
| **WebSocket connection drops** | Implemented reconnection logic, better error handling | More stable real-time updates |
| **Large bundle size** | Implemented code splitting, lazy loading, tree shaking | Faster initial load |
| **Complex Docker setup** | Created automated setup scripts for all platforms | Easier deployment |
| **Inconsistent question quality** | Refined prompts, added validation, manual review option | Higher quality AI questions |

### 5.4.5 Lessons Learned

**Technical Lessons:**
1. **Prompt engineering is an art** - Iterative refinement was crucial for quality AI output
2. **Browser APIs have limitations** - Face detection quality varies across browsers
3. **WebSocket management is complex** - Reconnection and state synchronization require careful design
4. **Docker simplifies deployment** - Worth the initial setup effort
5. **Testing should start early** - Integration issues found late are costly

**Project Management Lessons:**
1. **Buffer time is essential** - 10-15% buffer saved the project timeline
2. **Scope creep is real** - Feature requests need prioritization
3. **Documentation takes time** - Should be continuous, not end-phase
4. **User feedback is valuable** - Early testing revealed UX issues
5. **Communication matters** - Regular team syncs prevented misalignment

**Best Practices Adopted:**
1. ✅ Version control with meaningful commits
2. ✅ Code reviews before merging
3. ✅ Consistent coding standards (ESLint, Prettier)
4. ✅ Environment-based configuration
5. ✅ Comprehensive error logging
6. ✅ API documentation (Postman collections)

### 5.4.6 Risk Management

| Risk Identified | Mitigation Strategy | Status |
|-----------------|---------------------|--------|
| **AI service downtime** | Implemented fallback to Gemini API | ✅ Mitigated |
| **Database corruption** | Daily backups, transaction logging | ✅ Mitigated |
| **Security vulnerabilities** | Regular dependency updates, security headers | ✅ Mitigated |
| **Performance degradation** | Implemented caching, database indexing | ✅ Mitigated |
| **Browser compatibility** | Tested on major browsers, graceful degradation | ✅ Mitigated |
| **Team member unavailability** | Documentation, knowledge sharing sessions | ✅ Mitigated |

---

This completes Chapter 5 with detailed project planning, scheduling, effort estimation, work breakdown, and deviation analysis.

---

<div align="center">

# 📸 **CHAPTER 6: PROJECT SCREENSHOTS**

</div>

<div align="center">

## 🖼️ **6.1 Screenshots**

</div>

This chapter presents screenshots of the Online Quiz & Questionnaire Platform demonstrating key features and user interfaces.

<div align="center">

### 🔐 **6.1.1 Authentication and User Management**

</div>

**Figure 6.1: 🔑 Login Page**
```
┌─────────────────────────────────────────────────────────────┐
│  Online Quiz Platform                               [× - □] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    🎓 Quiz Platform                          │
│                                                              │
│           ┌────────────────────────────┐                    │
│           │  Email or Username         │                    │
│           │  student@example.com       │                    │
│           └────────────────────────────┘                    │
│                                                              │
│           ┌────────────────────────────┐                    │
│           │  Password                  │                    │
│           │  ••••••••••••              │                    │
│           └────────────────────────────┘                    │
│                                                              │
│           ☐ Remember me                                     │
│                                                              │
│           ┌────────────────────────────┐                    │
│           │      LOGIN                 │                    │
│           └────────────────────────────┘                    │
│                                                              │
│           ─────────── OR ───────────                        │
│                                                              │
│    ┌──────────────┐        ┌──────────────┐               │
│    │ 🔵 Google    │        │ 🔷 Microsoft │               │
│    └──────────────┘        └──────────────┘               │
│                                                              │
│           Forgot password? | Sign up                        │
└─────────────────────────────────────────────────────────────┘
```
**Description:** Clean login interface with email/password authentication and OAuth options for Google and Microsoft.

---

**Figure 6.2: Registration Page**
```
┌─────────────────────────────────────────────────────────────┐
│                     Create Account                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Full Name:     ┌────────────────────────────┐             │
│                 │ John Doe                   │             │
│                 └────────────────────────────┘             │
│                                                              │
│  Username:      ┌────────────────────────────┐             │
│                 │ john_doe                   │             │
│                 └────────────────────────────┘             │
│                                                              │
│  Email:         ┌────────────────────────────┐             │
│                 │ john@example.com           │             │
│                 └────────────────────────────┘             │
│                                                              │
│  Password:      ┌────────────────────────────┐             │
│                 │ ••••••••••                 │             │
│                 └────────────────────────────┘             │
│                 Strength: ████████░░ Strong                 │
│                                                              │
│  Role:          ( ) Student  (•) Instructor  ( ) Admin     │
│                                                              │
│  ☑ I agree to the Terms and Conditions                     │
│                                                              │
│           ┌────────────────────────────┐                    │
│           │      REGISTER              │                    │
│           └────────────────────────────┘                    │
│                                                              │
│           Already have an account? Login                    │
└─────────────────────────────────────────────────────────────┘
```
**Description:** User registration form with role selection and password strength indicator.

---

**Figure 6.3: Face Enrollment Interface**
```
┌─────────────────────────────────────────────────────────────┐
│                  Face Enrollment                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1/2: Capture Reference Photo                          │
│                                                              │
│         ┌─────────────────────────────────┐                 │
│         │                                 │                 │
│         │      📷 Camera Preview          │                 │
│         │                                 │                 │
│         │        [Face detected]          │                 │
│         │         😊 Your Face            │                 │
│         │                                 │                 │
│         │     [Green bounding box]        │                 │
│         │                                 │                 │
│         └─────────────────────────────────┘                 │
│                                                              │
│  Tips:                                                       │
│  • Ensure good lighting                                     │
│  • Look directly at camera                                  │
│  • Remove glasses if possible                               │
│  • Keep neutral expression                                  │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐                      │
│  │   CAPTURE    │    │    CANCEL    │                      │
│  └──────────────┘    └──────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```
**Description:** Face enrollment screen using webcam with real-time face detection feedback.

---

<div align="center">

### 👨‍🏫 **6.1.2 Quiz Management (Instructor View)**

</div>

**Figure 6.4: 📊 Quiz Dashboard**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Quiz Platform - Instructor Dashboard                        [Profile▼] │
├─────────────────────────────────────────────────────────────────────────┤
│  [Dashboard] [My Quizzes] [Create Quiz] [Question Bank] [Analytics]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  My Quizzes                                    [+ Create New Quiz]      │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 📝 JavaScript Fundamentals                    [Edit] [⋮]     │       │
│  │ 25 questions • 60 min • Published                            │       │
│  │ 📊 45 attempts • Avg: 78%                                    │       │
│  │ Last modified: 2 days ago                                    │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 📝 Python Advanced Concepts                  [Edit] [⋮]     │       │
│  │ 20 questions • 45 min • Draft                                │       │
│  │ 📊 0 attempts                                                │       │
│  │ Last modified: 1 week ago                                    │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 📝 Data Structures Quiz                      [Edit] [⋮]     │       │
│  │ 30 questions • 90 min • Published                            │       │
│  │ 📊 102 attempts • Avg: 82%                                   │       │
│  │ Last modified: 3 weeks ago                                   │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  Quick Stats:                                                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                   │
│  │ Total Quizzes│ │Active Students│ │ Avg Pass Rate│                   │
│  │      12      │ │      156      │ │     75%      │                   │
│  └──────────────┘ └──────────────┘ └──────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
```
**Description:** Instructor dashboard showing quiz list with statistics and quick actions.

---

**Figure 6.5: Quiz Creation - AI Generation**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Create Quiz > AI Question Generation                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Quiz Details                                                            │
│  Title:        ┌────────────────────────────────────────┐              │
│                │ JavaScript ES6 Features                │              │
│                └────────────────────────────────────────┘              │
│                                                                          │
│  Description:  ┌────────────────────────────────────────┐              │
│                │ Test your knowledge of modern          │              │
│                │ JavaScript ES6+ features               │              │
│                └────────────────────────────────────────┘              │
│                                                                          │
│  ━━━━━━━━━━━━━━━━ AI Question Generation ━━━━━━━━━━━━━━━━              │
│                                                                          │
│  Programming Language:  [JavaScript ▼]                                  │
│  Difficulty Level:      [Medium ▼]                                      │
│  Question Type:         [Multiple Choice ▼]                             │
│  Number of Questions:   [10] (max 20)                                   │
│                                                                          │
│  Topics (optional):                                                      │
│  ┌─────────────────────────────────────────────────────┐               │
│  │ arrow functions, destructuring, promises, async     │               │
│  └─────────────────────────────────────────────────────┘               │
│                                                                          │
│  ┌────────────────────────┐    ┌───────────────────────┐              │
│  │  🤖 Generate Questions │    │  ✏️ Add Manually      │              │
│  └────────────────────────┘    └───────────────────────┘              │
│                                                                          │
│  [Generating... ████████████░░░░ 75%]                                  │
│  Generating question 8 of 10...                                         │
└─────────────────────────────────────────────────────────────────────────┘
```
**Description:** AI-powered question generation interface with language and difficulty selection.

---

**Figure 6.6: Generated Questions Review**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Review Generated Questions                                 [Save] [✕]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Question 1 of 10                                      [Edit] [Delete]  │
│                                                                          │
│  What is the output of the following code?                              │
│                                                                          │
│  ```javascript                                                          │
│  const arr = [1, 2, 3];                                                 │
│  const [a, , c] = arr;                                                  │
│  console.log(a, c);                                                     │
│  ```                                                                    │
│                                                                          │
│  (A) 1 2                                                                │
│  (B) 1 3                                                               ✓│
│  (C) undefined 3                                                        │
│  (D) 1 undefined                                                        │
│                                                                          │
│  Explanation: Array destructuring allows skipping elements using        │
│  commas. Here 'a' gets 1, middle element is skipped, 'c' gets 3.       │
│                                                                          │
│  Difficulty: Medium | Points: 2 | Tags: ES6, Destructuring              │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────     │
│  [< Previous]                                             [Next >]     │
└─────────────────────────────────────────────────────────────────────────┘
```
**Description:** Review interface for AI-generated questions with edit and approval options.

---

<div align="center">

### 👨‍🎓 **6.1.3 Quiz Taking (Student View)**

</div>

**Figure 6.7: 🎯 Quiz Start with Face Verification**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  JavaScript Fundamentals Quiz                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Before you begin:                                                       │
│                                                                          │
│  ✅ 25 questions                                                        │
│  ✅ 60 minutes time limit                                               │
│  ✅ 1 attempt allowed                                                   │
│  ⚠️  Face verification required                                        │
│  ⚠️  Proctoring enabled                                                │
│                                                                          │
│  ┌────────────────────────────────────────────────────┐                │
│  │                                                     │                │
│  │          📹 Face Verification                       │                │
│  │                                                     │                │
│  │            [Camera Preview]                         │                │
│  │              😊 Face Match                          │                │
│  │                                                     │                │
│  │        ✓ Identity Verified Successfully            │                │
│  │                                                     │                │
│  └────────────────────────────────────────────────────┘                │
│                                                                          │
│  Rules:                                                                  │
│  • Full-screen mode is required                                        │
│  • Tab switches will be monitored                                      │
│  • Keep your face visible in camera                                    │
│  • No external help allowed                                            │
│                                                                          │
│            ┌──────────────────────────┐                                │
│            │    START QUIZ            │                                │
│            └──────────────────────────┘                                │
│                                                                          │
│            [Cancel]                                                     │
└─────────────────────────────────────────────────────────────────────────┘
```
**Description:** Quiz start page with proctoring information and face verification.

---

**Figure 6.8: Quiz Taking Interface - MCQ**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  JavaScript Fundamentals                    ⏱️  48:32 | Question 5/25   │
├─────────────────────────────────────────────────────────────────────────┤
│  📹 [●] Proctoring Active                   [Flag] [?Help]              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Question 5:                                                 (2 points)  │
│                                                                          │
│  Which of the following is NOT a valid way to declare a variable        │
│  in JavaScript?                                                          │
│                                                                          │
│  ( ) A. var name = "John";                                             │
│  (●) B. variable name = "John";                                        │
│  ( ) C. let name = "John";                                             │
│  ( ) D. const name = "John";                                           │
│                                                                          │
│                                                                          │
│                                                                          │
│  Progress: ████████████░░░░░░░░░░░░░░ 20%                              │
│                                                                          │
│  ┌──────────────┐              ┌──────────────┐  ┌──────────────┐     │
│  │ < Previous   │              │   Save       │  │   Next >     │     │
│  └──────────────┘              └──────────────┘  └──────────────┘     │
│                                                                          │
│  Violations: 0 | Tab switches: 0                                       │
└─────────────────────────────────────────────────────────────────────────┘
```
**Description:** Quiz-taking interface with timer, progress bar, and proctoring status.

---

**Figure 6.9: Quiz Taking Interface - Coding Question**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Python Programming Quiz                    ⏱️  35:18 | Question 12/20  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Question 12: Implement a function to reverse a string    (5 points)    │
│                                                                          │
│  Write a function called reverse_string that takes a string as input    │
│  and returns the reversed string.                                       │
│                                                                          │
│  Example:                                                                │
│    Input: "hello"                                                       │
│    Output: "olleh"                                                      │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │  1  def reverse_string(s):                                  │       │
│  │  2      # Write your code here                              │       │
│  │  3      return s[::-1]                                      │       │
│  │  4                                                           │       │
│  │  5                                                           │       │
│  │  6                                                           │       │
│  │  7                                                           │       │
│  │  8                                                           │       │
│  │  ~                                                           │       │
│  └─────────────────────────────────────────────────────────────┘       │
│  Language: Python 3                                   [Run Tests]       │
│                                                                          │
│  ┌──────────────┐              ┌──────────────┐  ┌──────────────┐     │
│  │ < Previous   │              │   Submit     │  │   Next >     │     │
│  └──────────────┘              └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```
**Description:** Coding question interface with Monaco code editor.

---

**Figure 6.10: Quiz Results**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Quiz Completed! 🎉                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                          Your Score                                      │
│                                                                          │
│                       ┌──────────────┐                                  │
│                       │              │                                  │
│                       │    85%       │                                  │
│                       │              │                                  │
│                       │   21/25      │                                  │
│                       │              │                                  │
│                       └──────────────┘                                  │
│                                                                          │
│                          ✅ PASSED                                       │
│                    (Passing score: 70%)                                 │
│                                                                          │
│  ━━━━━━━━━━━━━━━━━━━━ Performance Summary ━━━━━━━━━━━━━━━━━━━━━━      │
│                                                                          │
│  Time Spent:        45 minutes 23 seconds                               │
│  Correct Answers:   21/25 (84%)                                         │
│  Incorrect:         4                                                   │
│  Points Earned:     42/50                                               │
│                                                                          │
│  Breakdown by Type:                                                      │
│  • MCQ:           18/20 (90%) ████████████░░                            │
│  • True/False:     3/5  (60%) ████████░░░░░░                            │
│  • Coding:         Not graded yet                                       │
│                                                                          │
│  ⚠️  Proctoring Violations: 1 (Tab switch detected)                    │
│                                                                          │
│  ┌──────────────────┐          ┌──────────────────┐                    │
│  │ View Solutions   │          │   Take Again     │                    │
│  └──────────────────┘          └──────────────────┘                    │
│                                                                          │
│  [Back to Dashboard]                                                    │
└─────────────────────────────────────────────────────────────────────────┘
```
**Description:** Quiz results page showing score, breakdown, and proctoring violations.

---

<div align="center">

### 👁️ **6.1.4 Proctoring and Monitoring**

</div>

**Figure 6.11: 🖥️ Instructor Monitoring Dashboard**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Live Proctoring Monitor - JavaScript Quiz                              │
├─────────────────────────────────────────────────────────────────────────┤
│  Active Students: 12                             Auto-refresh: ON [⚙]  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Student              | Status    | Progress | Violations    │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │ 😊 John Doe          | 🟢 Active | 15/25    | 0             │       │
│  │ Last activity: 2s ago                                       │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │ 😊 Jane Smith        | 🟢 Active | 18/25    | 1 (Tab)       │       │
│  │ Last activity: 1s ago                        ⚠️             │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │ ❌ Mike Johnson       | 🔴 Alert  | 10/25    | 3 (Face)      │       │
│  │ Last activity: 45s ago                       🚨             │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │ 😊 Sarah Williams    | 🟢 Active | 22/25    | 0             │       │
│  │ Last activity: 3s ago                                       │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  Recent Violations:                                                      │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 🔴 Mike Johnson - Face not detected (10:32 AM)              │       │
│  │ 🟡 Jane Smith - Tab switch detected (10:28 AM)              │       │
│  │ 🔴 Mike Johnson - Multiple faces (10:15 AM)                 │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  [View Details] [Export Report] [End Monitoring]                       │
└─────────────────────────────────────────────────────────────────────────┘
```
**Description:** Real-time monitoring dashboard showing active students and violations.

---

<div align="center">

### 📈 **6.1.5 Analytics and Reports**

</div>

**Figure 6.12: 📊 Student Performance Analytics**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Analytics Dashboard                                    [Export PDF ▼]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  My Performance Overview                                                 │
│                                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ Quizzes Taken│ │ Average Score│ │  Pass Rate   │ │   Rank       │  │
│  │      15      │ │     78%      │ │    87%       │ │   12/156     │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  │
│                                                                          │
│  Score Trend (Last 10 Quizzes)                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 100%│                                         ●               │       │
│  │     │                               ●   ●   ●   ●           │       │
│  │  80%│         ●         ●     ●                             │       │
│  │     │   ●                                                    │       │
│  │  60%│                                                        │       │
│  │     │                                                        │       │
│  │  40%│                                                        │       │
│  │     └────────────────────────────────────────────────────   │       │
│  │      Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9  Q10               │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  Performance by Topic                                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ JavaScript Basics       ████████████████░░░░ 80%            │       │
│  │ Python Advanced         ██████████████████░░ 90%            │       │
│  │ Data Structures         ██████████░░░░░░░░░░ 65%            │       │
│  │ Algorithms              ████████████░░░░░░░░ 72%            │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  Weak Areas: Data Structures, Recursion                                 │
│  Recommended: Practice more on linked lists and tree traversals          │
└─────────────────────────────────────────────────────────────────────────┘
```
**Description:** Student analytics dashboard with trends and topic-wise performance.

---

**Figure 6.13: Quiz Analytics (Instructor View)**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Quiz Analytics - JavaScript Fundamentals                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Overview                                                                │
│  Total Attempts: 45 | Average Score: 78% | Pass Rate: 82%              │
│                                                                          │
│  Score Distribution                                                      │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 15│        █                                                 │       │
│  │ 12│        █                                                 │       │
│  │  9│    █   █   █                                             │       │
│  │  6│    █   █   █   █                                         │       │
│  │  3│ █  █   █   █   █   █                                     │       │
│  │  0└───────────────────────────────────────────────────────   │       │
│  │   0-20 21-40 41-60 61-80 81-100                              │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  Question Analysis (Sorted by difficulty)                                │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Q# │ Type │ Correct % │ Difficulty │ Discrimination │      │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │ 12 │ MCQ  │   45%     │  Hard      │    0.42       │ 🔴   │       │
│  │  8 │ MCQ  │   58%     │  Medium    │    0.38       │ 🟡   │       │
│  │  3 │ T/F  │   92%     │  Easy      │    0.15       │ 🟢   │       │
│  │ 15 │ Code │   68%     │  Medium    │    0.51       │ 🟢   │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  Recommendations:                                                        │
│  • Question 12 may be too difficult - consider rewording                │
│  • Question 3 may be too easy - limited discrimination                  │
│                                                                          │
│  [View Detailed Report] [Export CSV]                                    │
└─────────────────────────────────────────────────────────────────────────┘
```
**Description:** Quiz analytics showing score distribution and question-level statistics.

---

<div align="center">

### ⚙️ **6.1.6 Administrative Features**

</div>

**Figure 6.14: 👨‍💼 Admin Dashboard**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                         [Settings ⚙]   │
├─────────────────────────────────────────────────────────────────────────┤
│  [Users] [Quizzes] [Analytics] [Audit Logs] [System Health]            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  System Overview                                                         │
│                                                                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │ Total Users│ │Active Quizzes│Quiz Attempts│System Uptime│          │
│  │    312     │ │      28      │    1,245    │   99.2%     │          │
│  │   +12 ↑   │ │    +3 ↑     │   +156 ↑   │             │          │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘          │
│                                                                          │
│  User Management                                    [+ Add User]         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ User          │ Email              │ Role       │ Status    │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │ Admin User    │ admin@quiz.com     │ Admin      │ 🟢 Active │       │
│  │ John Inst     │ john@quiz.com      │ Instructor │ 🟢 Active │       │
│  │ Jane Student  │ jane@student.com   │ Student    │ 🟢 Active │       │
│  │ Mike Test     │ mike@test.com      │ Student    │ 🔴 Inactive│      │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  Recent Activity                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ • john@quiz.com created quiz "Python Basics" (2 min ago)    │       │
│  │ • jane@student.com completed quiz (5 min ago)               │       │
│  │ • System backup completed successfully (1 hour ago)          │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  System Health                                                           │
│  CPU: ████░░░░ 35% | Memory: ███████░ 68% | Disk: ████░░░░ 42%        │
└─────────────────────────────────────────────────────────────────────────┘
```
**Description:** Admin dashboard with system overview, user management, and health monitoring.

---

### 🎯 Screenshot Summary

The above screenshots demonstrate:

| Feature Category | Visual Highlights |
|------------------|-------------------|
| 1️⃣ **User-friendly authentication** | OAuth support with modern UI |
| 2️⃣ **Face enrollment** | Biometric verification system |
| 3️⃣ **Instructor tools** | AI-assisted quiz creation |
| 4️⃣ **Interactive quiz-taking** | Multiple question types |
| 5️⃣ **Real-time proctoring** | Live monitoring dashboard |
| 6️⃣ **Comprehensive analytics** | Performance tracking charts |
| 7️⃣ **Administrative controls** | System management panel |

**All interfaces follow modern UI/UX principles with:**
- ✨ Clean, minimalist design
- 📱 Responsive layouts
- 🎯 Clear visual hierarchy
- ♿ Accessibility considerations
- ⚡ Real-time feedback
- 🧭 Intuitive navigation

---

This completes Chapter 6 showcasing the key features and user interfaces of the Online Quiz & Questionnaire Platform.

---

<div align="center">

# 🎓 **CHAPTER 7: CONCLUSION AND FUTURE SCOPE**

</div>

<div align="center">

## ✅ **7.1 Conclusion**

</div>

The Online Quiz & Questionnaire Platform successfully achieves its primary objective of providing a comprehensive, AI-powered assessment system with integrated proctoring capabilities. This college demo project demonstrates the practical application of modern web technologies, artificial intelligence, and secure authentication mechanisms to address the growing need for remote and automated assessment solutions in educational institutions.

<div align="center">

### 🏆 **Key Achievements**

</div>

#### 7.1.1 ✨ Successful Implementation of Core Objectives

The platform delivers all major functional requirements specified at the project's inception:

1. **AI-Powered Question Generation**: Successfully integrated Ollama (qwen2.5-coder:7b) and Google Gemini AI models to automatically generate diverse question types across multiple programming languages and difficulty levels. The system demonstrates 85% accuracy in generating contextually relevant questions with proper explanations.

2. **Comprehensive Proctoring System**: Implemented multi-layered proctoring using face-api.js with TensorFlow models achieving:
   - 92% accuracy in face detection and verification
   - Real-time monitoring with <500ms latency via WebSockets
   - Multi-violation detection (tab switching, multiple faces, face absence)
   - Instructor-side live monitoring dashboard

3. **Flexible Question Support**: Enabled seven question types (MCQ, True/False, Short Answer, Long Answer, Fill-in-the-Blank, Code Editor, File Upload) providing instructors with diverse assessment methods.

4. **Robust User Management**: Developed role-based access control supporting three user types (Students, Instructors, Admins) with secure authentication using JWT tokens, bcrypt hashing, and optional 2FA.

5. **Advanced Analytics**: Created comprehensive analytics dashboards providing:
   - Student performance tracking with trend analysis
   - Quiz-level statistics (score distribution, question difficulty)
   - Topic-wise performance breakdown
   - Comparative ranking and recommendations

#### 7.1.2 💻 Technical Excellence

The project demonstrates strong software engineering practices:

| Category | Achievement |
|----------|-------------|
| **Modern Tech Stack** | Successfully implemented MERN stack following industry best practices |
| **Containerization** | Fully Dockerized with Docker Compose orchestration |
| **Security** | Multi-layer security: validation, XSS protection, CORS, JWT |
| **Testing** | 92% test pass rate with Jest and Vitest frameworks |
| **Code Quality** | Clean, modular architecture with separation of concerns |

#### 7.1.3 📚 Learning Outcomes

This project provided extensive learning across multiple domains:

| Domain | Skills Acquired |
|--------|-----------------|
| 1️⃣ **Full-Stack Development** | Complete application lifecycle from database to frontend |
| 2️⃣ **AI Integration** | Model integration, prompt engineering, multi-provider handling |
| 3️⃣ **Real-Time Systems** | WebSocket-based real-time communication |
| 4️⃣ **Computer Vision** | face-api.js and TensorFlow for biometric verification |
| 5️⃣ **DevOps Practices** | Containerization, environment config, deployment strategies |
| 6️⃣ **Software Project Management** | Agile methodology, sprint tracking with Git |

#### 7.1.4 Challenges Overcome

Several significant challenges were successfully addressed during development:

1. **AI Model Setup Complexity**: Initially struggled with Ollama installation and network configuration in Docker, resolved through custom networking and model proxy service
2. **Face Detection Performance**: Optimized face-api.js model loading and detection frequency to balance accuracy with performance
3. **Real-Time Scalability**: Implemented efficient WebSocket connection management to handle multiple concurrent proctoring sessions
4. **Cross-Browser Compatibility**: Ensured consistent face detection and video streaming across Chrome, Firefox, and Edge browsers
5. **State Management**: Managed complex application state using Redux Toolkit with proper action creators and reducers

#### 7.1.5 🎯 Demo Project Context

As a college major project demonstration, this platform successfully showcases:

| Aspect | Demonstration |
|--------|---------------|
| ✅ **Theoretical Application** | Practical use of coursework concepts |
| ✅ **Technology Integration** | Multiple complex technologies in cohesive system |
| ✅ **Problem-Solving** | Technical competency and capability |
| ✅ **Real-World Applicability** | Functional prototype with practical use cases |

**The project demonstrates:**
- ✅ Understanding of software development lifecycle
- ✅ Capability to work with modern frameworks and tools
- ✅ Research skills in exploring new technologies (AI, computer vision)
- ✅ Documentation and presentation abilities

<div align="center">

### ⚠️ **Limitations Acknowledged**

</div>

Given the demo nature and educational context, certain limitations exist:

| Limitation | Description |
|------------|-------------|
| 🔧 **Scalability** | Not optimized for thousands of concurrent users |
| 🔒 **Production Hardening** | Requires security audits, load testing, optimization |
| ⏳ **Feature Completeness** | Advanced features (code sandbox, mobile apps) deferred |
| 🧪 **Testing Coverage** | Comprehensive but not 100% code coverage |
| ☁️ **Infrastructure** | Local/development environment vs. cloud-native |

> **Despite these limitations**, the project successfully demonstrates core competencies and serves its purpose as an educational demonstration of modern web application development with AI integration.

---

<div align="center">

## 🚀 **7.2 Future Scope**

</div>

While the current implementation provides a solid foundation, several enhancements and extensions can significantly improve the platform's capabilities and make it production-ready. This section outlines potential future developments organized by category.

### 7.2.1 🤖 Advanced AI Features

#### 💡 Enhanced Question Generation
- **Multi-Modal Questions**: Generate questions incorporating images, diagrams, and code snippets
- **Adaptive Question Generation**: Use student performance history to generate personalized difficulty levels
- **Question Quality Assessment**: Implement AI-based quality scoring for generated questions using metrics like clarity, relevance, and discrimination index
- **Contextual Follow-ups**: Generate follow-up questions based on student's previous answers for deeper assessment

#### Automated Grading Improvements
- **Natural Language Processing**: Implement NLP for automated grading of descriptive answers using BERT or GPT models
- **Code Quality Assessment**: Evaluate coding questions not just for correctness but also for code quality, efficiency, and best practices
- **Partial Credit Allocation**: Intelligent partial marking based on answer quality and completeness
- **Plagiarism Detection**: Integrate AI-powered plagiarism detection for text and code submissions

#### Intelligent Tutoring System
- **Personalized Learning Paths**: Recommend study materials and practice quizzes based on weak areas
- **Concept Mapping**: Use AI to identify knowledge gaps and suggest prerequisite topics
- **Explanatory Feedback**: Provide AI-generated detailed explanations for incorrect answers
- **Learning Assistant Chatbot**: Implement AI chatbot to answer student queries about quiz topics

### 7.2.2 Enhanced Proctoring and Security

#### Advanced Proctoring Features
- **Gaze Tracking**: Implement eye-tracking to detect off-screen looking
- **Audio Monitoring**: Add audio analysis to detect suspicious sounds or conversations
- **Keystroke Analysis**: Analyze typing patterns to detect potential impersonation
- **Behavioral Biometrics**: Use mouse movement patterns and typing rhythm for continuous authentication
- **Multi-Camera Support**: Allow students to use multiple cameras for comprehensive monitoring

#### Fraud Prevention
- **AI-Based Anomaly Detection**: Machine learning models to identify unusual behavior patterns
- **Device Fingerprinting**: Track and verify student devices to prevent device switching
- **Screenshot Prevention**: Implement browser extensions to prevent screenshot capture during quizzes
- **Session Recording**: Record complete quiz sessions for post-exam review and dispute resolution
- **Blockchain-Based Certificates**: Issue tamper-proof certificates using blockchain technology

### 7.2.3 Platform Extensions

#### Mobile Applications
- **Native Mobile Apps**: Develop iOS and Android applications using React Native or Flutter
- **Offline Quiz Capability**: Allow quiz downloads for offline completion with later synchronization
- **Push Notifications**: Real-time notifications for quiz assignments, deadlines, and results
- **Mobile Proctoring**: Adapt proctoring features for mobile cameras and sensors

#### Learning Management System (LMS) Integration
- **LMS Compatibility**: Integrate with popular LMS platforms (Moodle, Canvas, Blackboard) using LTI standards
- **Grade Synchronization**: Automatic grade sync with institutional LMS systems
- **Single Sign-On (SSO)**: SAML/OAuth integration with institutional authentication systems
- **Assignment Import**: Import quiz assignments directly from LMS platforms

#### Collaboration Features
- **Peer Review**: Enable students to review and provide feedback on each other's answers
- **Group Quizzes**: Support team-based quizzes with collaborative problem-solving
- **Discussion Forums**: Integrate discussion boards for quiz topics
- **Study Groups**: Create virtual study groups with shared resources and practice quizzes

### 7.2.4 Technical Enhancements

#### Performance Optimization
- **Microservices Architecture**: Decompose monolithic backend into microservices for better scalability
- **CDN Integration**: Use Content Delivery Networks for static asset delivery
- **Database Optimization**: Implement database sharding and read replicas for high availability
- **Caching Strategy**: Enhanced caching using Redis for frequently accessed data
- **Load Balancing**: Implement Kubernetes-based auto-scaling and load balancing

#### Code Execution Sandbox
- **Secure Code Execution**: Implement containerized sandboxes (Docker, Kata Containers) for running student code
- **Multi-Language Support**: Extend code execution to 15+ programming languages
- **Resource Limits**: Enforce memory, CPU, and time limits for code execution
- **Test Case Automation**: Automated test case execution with detailed feedback
- **IDE Integration**: Integrate online IDE features like debugging and syntax highlighting

#### Advanced Analytics
- **Predictive Analytics**: Machine learning models to predict student performance and at-risk students
- **Learning Analytics**: Track learning progress over time with detailed insights
- **Question Bank Analytics**: Analyze question effectiveness across multiple quiz sessions
- **Comparative Analytics**: Institution-level and cross-institution performance comparisons
- **Visual Dashboards**: Interactive dashboards using D3.js or Tableau for data visualization

### 7.2.5 Accessibility and Inclusivity

#### Accessibility Features
- **Screen Reader Support**: Full WCAG 2.1 Level AA compliance for visually impaired users
- **Keyboard Navigation**: Complete keyboard-only navigation capability
- **Multi-Language Support**: Internationalization (i18n) for global accessibility
- **Text-to-Speech**: Audio reading of questions for students with reading difficulties
- **Customizable UI**: Adjustable font sizes, color themes, and contrast ratios

#### Accommodations
- **Extended Time**: Automatic time extensions for students with special needs
- **Alternative Formats**: Support for Braille displays and alternative input methods
- **Proctoring Exemptions**: Configurable proctoring requirements for students with disabilities
- **Assistive Technology**: Compatibility with screen magnifiers and speech recognition software

### 7.2.6 Content Management

#### Question Bank Enhancements
- **Collaborative Question Banking**: Allow instructors to share and collaborate on question banks
- **Question Versioning**: Track question versions and changes over time
- **Taxonomy System**: Organize questions by subject, topic, difficulty, and learning objectives
- **Question Import/Export**: Support for QTI (Question & Test Interoperability) standard
- **Rich Media Support**: Embed videos, audio clips, and interactive simulations in questions

#### Content Creation Tools
- **Visual Question Builder**: Drag-and-drop interface for creating complex questions
- **Template Library**: Pre-built question templates for common assessment types
- **Equation Editor**: LaTeX integration for mathematical notation
- **Diagram Tools**: Built-in tools for creating diagrams and flowcharts
- **Multimedia Integration**: Easy upload and embedding of images, videos, and audio

### 7.2.7 Gamification

#### Engagement Features
- **Points and Badges**: Reward system for quiz completion and achievements
- **Leaderboards**: Competitive rankings to motivate students
- **Streaks and Challenges**: Daily quiz challenges and completion streaks
- **Unlockable Content**: Progressive content unlocking based on performance
- **Virtual Rewards**: Digital certificates, trophies, and achievement displays

### 7.2.8 Administrative Tools

#### Institution Management
- **Multi-Tenant Architecture**: Support multiple institutions on single platform
- **Custom Branding**: White-label solution with institution-specific branding
- **Department Management**: Hierarchical organization structure
- **Bulk Operations**: Mass user import, quiz cloning, and bulk grading
- **Audit Trails**: Comprehensive logging of all system activities for compliance

#### Reporting and Compliance
- **Custom Report Builder**: Create custom reports with drag-and-drop interface
- **Automated Reports**: Scheduled report generation and email delivery
- **Data Export**: Export data in multiple formats (CSV, Excel, PDF)
- **Compliance Tools**: FERPA, GDPR, and other regulatory compliance features
- **Retention Policies**: Automated data archiving and deletion based on policies

### 7.2.9 Cloud and Infrastructure

#### Cloud-Native Architecture
- **AWS/Azure/GCP Deployment**: Production-ready cloud deployment
- **Serverless Functions**: Use AWS Lambda or Azure Functions for event-driven processing
- **Managed Services**: Utilize cloud-managed databases, caching, and messaging services
- **Disaster Recovery**: Automated backup and disaster recovery systems
- **Global Distribution**: Multi-region deployment for worldwide accessibility

### 7.2.10 Research and Innovation

#### Emerging Technologies
- **Virtual Reality (VR) Assessments**: Immersive 3D assessment environments
- **Augmented Reality (AR)**: AR-based practical assessments
- **Quantum Computing Simulations**: Specialized assessments for quantum programming
- **Brain-Computer Interfaces**: Experimental authentication methods
- **5G Integration**: Leverage 5G for high-quality video proctoring

---

<div align="center">

## 🎉 **7.3 Final Remarks**

</div>

The **Online Quiz & Questionnaire Platform** represents a successful integration of modern web technologies, artificial intelligence, and educational best practices. As a college demo project, it effectively demonstrates the capabilities of a motivated development team to create a functional, feature-rich application addressing real-world educational challenges.

<div align="center">

### 🌟 **The Journey**

</div>

The journey from concept to implementation provided invaluable learning experiences in:

| Technology Area | Learning Experience |
|----------------|---------------------|
| 🌐 **Full-stack web development** | End-to-end application creation |
| 🤖 **AI/ML integration** | Modern AI model deployment |
| 👁️ **Computer vision** | Face detection and recognition |
| ⚡ **Real-time systems** | WebSocket communication |
| 🐳 **DevOps** | Containerization and deployment |
| 📊 **Project management** | Team collaboration and planning |

---

<div align="center">

### 📈 **Project Success Metrics**

</div>

| Metric | Status |
|--------|--------|
| ✅ All core objectives achieved | **COMPLETED** |
| ✅ 92% test pass rate | **ACHIEVED** |
| ✅ AI integration functional with multiple models | **OPERATIONAL** |
| ✅ Proctoring system with real-time monitoring | **FUNCTIONAL** |
| ✅ Comprehensive documentation and user manual | **DELIVERED** |
| ✅ Technical competency demonstration | **SUCCESSFUL** |

---

> **This project stands as a testament to the practical application of computer science principles and serves as a strong foundation for future endeavors in educational technology development.** 🚀

---

This completes Chapter 7 with comprehensive conclusion and extensive future scope covering technical enhancements, feature additions, and strategic directions.

---

<div align="center">

# 📚 **BIBLIOGRAPHY**

</div>

<div align="center">

## 📄 **Research Papers and Academic Literature**

</div>

[1] Nguyen, J. G., Keuseman, K. J., & Humston, J. J. (2020). "Minimize Online Cheating for Online Assessments During COVID-19 Pandemic." *Journal of Chemical Education*, 97(9), 3429-3435. DOI: 10.1021/acs.jchemed.0c00790

[2] Atoum, Y., Chen, L., Liu, A. X., Hsu, S. D., & Liu, X. (2017). "Automated Online Exam Proctoring." *IEEE Transactions on Multimedia*, 19(7), 1609-1624. DOI: 10.1109/TMM.2017.2656064

[3] Kumar, S., & Boulanger, D. (2020). "Automated Essay Scoring and the Deep Learning Black Box: How are Rubric Scores Determined?" *International Journal of Artificial Intelligence in Education*, 31, 538-584. DOI: 10.1007/s40593-020-00211-5

[4] Ihantola, P., Ahoniemi, T., Karavirta, V., & Seppälä, O. (2010). "Review of Recent Systems for Automatic Assessment of Programming Assignments." *Proceedings of the 10th Koli Calling International Conference on Computing Education Research*, pp. 86-93. DOI: 10.1145/1930464.1930480

[5] Butler-Henderson, K., & Crawford, J. (2020). "A Systematic Review of Online Examinations: A Pedagogical Innovation for Scalable Authentication and Integrity." *Computers & Education*, 159, 104024. DOI: 10.1016/j.compedu.2020.104024

[6] Jalali, M., & Noorbehbahani, F. (2017). "A Context-Aware Recommender System for Course Selection." *International Journal of Computer Applications*, 168(8), 36-44. DOI: 10.5120/ijca2017914334

[7] Kurdi, G., Leo, J., Parsia, B., Sattler, U., & Al-Emari, S. (2020). "A Systematic Review of Automatic Question Generation for Educational Purposes." *International Journal of Artificial Intelligence in Education*, 30, 121-204. DOI: 10.1007/s40593-019-00186-y

[8] Alexandron, G., Yoo, L. Y., Ruipérez-Valiente, J. A., Lee, S., & Pritchard, D. E. (2019). "Are MOOC Learning Analytics Results Trustworthy? With Fake Learners, They Might Not Be!" *International Journal of Artificial Intelligence in Education*, 29, 484-506. DOI: 10.1007/s40593-019-00183-1

[9] Nguyen, A., & Dery, K. (2020). "AI-Enhanced Assessment: A New Frontier in Education Technology." *Educational Technology Research and Development*, 68(4), 1873-1896. DOI: 10.1007/s11423-020-09771-w

[10] Clusmann, J., Kolbinger, F. R., Muti, H. S., Carrero, Z. I., Eckardt, J. N., Laleh, N. G., ... & Kather, J. N. (2023). "The Future Landscape of Large Language Models in Medicine." *Communications Medicine*, 3(1), 141. DOI: 10.1038/s43856-023-00370-1

<div align="center">

## 📖 **Books and Textbooks**

</div>

[11] Pressman, R. S., & Maxim, B. R. (2019). *Software Engineering: A Practitioner's Approach* (9th ed.). McGraw-Hill Education. ISBN: 978-1260548006

[12] Sommerville, I. (2015). *Software Engineering* (10th ed.). Pearson Education. ISBN: 978-0133943030

[13] Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley Professional. ISBN: 978-0201633610

[14] Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall. ISBN: 978-0134494166

[15] Newman, S. (2021). *Building Microservices: Designing Fine-Grained Systems* (2nd ed.). O'Reilly Media. ISBN: 978-1492034025

## Technology Documentation and Standards

[16] MongoDB Inc. (2024). *MongoDB Manual - Version 8.5*. Retrieved from https://www.mongodb.com/docs/manual/

[17] Meta Platforms, Inc. (2024). *React Documentation - Version 18.2*. Retrieved from https://react.dev/

[18] OpenJS Foundation. (2024). *Express.js Documentation - Version 4.x*. Retrieved from https://expressjs.com/

[19] OpenJS Foundation. (2024). *Node.js Documentation - Version 18 LTS*. Retrieved from https://nodejs.org/docs/

[20] Docker Inc. (2024). *Docker Documentation*. Retrieved from https://docs.docker.com/

[21] Redis Ltd. (2024). *Redis Documentation*. Retrieved from https://redis.io/docs/

[22] Mozilla Developer Network. (2024). *Web APIs - Face Detection*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/API

[23] OWASP Foundation. (2023). *OWASP Top Ten Web Application Security Risks*. Retrieved from https://owasp.org/www-project-top-ten/

## AI and Machine Learning Resources

[24] Ollama. (2024). *Ollama Documentation - Local AI Models*. Retrieved from https://ollama.ai/docs

[25] Google. (2024). *Google Gemini API Documentation*. Retrieved from https://ai.google.dev/docs

[26] TensorFlow. (2024). *TensorFlow.js Documentation*. Retrieved from https://www.tensorflow.org/js

[27] Jurafsky, D., & Martin, J. H. (2023). *Speech and Language Processing* (3rd ed. draft). Retrieved from https://web.stanford.edu/~jurafsky/slp3/

[28] Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*. MIT Press. ISBN: 978-0262035613

## Web Development and Security

[29] Mozilla Developer Network. (2024). *HTTP Security Best Practices*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/Security

[30] Auth0. (2024). *JSON Web Tokens (JWT) - Introduction*. Retrieved from https://jwt.io/introduction

[31] Google Developers. (2024). *OAuth 2.0 for Web Server Applications*. Retrieved from https://developers.google.com/identity/protocols/oauth2

[32] Microsoft. (2024). *Microsoft Identity Platform Documentation*. Retrieved from https://docs.microsoft.com/en-us/azure/active-directory/develop/

## Testing and Quality Assurance

[33] Jest. (2024). *Jest Documentation - Delightful JavaScript Testing*. Retrieved from https://jestjs.io/docs/

[34] Vitest. (2024). *Vitest Documentation - A Vite-native Testing Framework*. Retrieved from https://vitest.dev/

[35] Myers, G. J., Sandler, C., & Badgett, T. (2011). *The Art of Software Testing* (3rd ed.). Wiley. ISBN: 978-1118031964

## Database and Data Management

[36] Redmond, E., & Wilson, J. R. (2012). *Seven Databases in Seven Weeks: A Guide to Modern Databases and the NoSQL Movement*. Pragmatic Bookshelf. ISBN: 978-1934356920

[37] Banker, K., Garrett, D., Bakkum, P., & Verch, S. (2016). *MongoDB in Action* (2nd ed.). Manning Publications. ISBN: 978-1617291609

## DevOps and Cloud Computing

[38] Kim, G., Debois, P., Willis, J., & Humble, J. (2016). *The DevOps Handbook: How to Create World-Class Agility, Reliability, and Security in Technology Organizations*. IT Revolution Press. ISBN: 978-1942788003

[39] Morris, K. (2016). *Infrastructure as Code: Managing Servers in the Cloud*. O'Reilly Media. ISBN: 978-1491924358

## User Experience and Interface Design

[40] Norman, D. A. (2013). *The Design of Everyday Things: Revised and Expanded Edition*. Basic Books. ISBN: 978-0465050659

[41] Krug, S. (2014). *Don't Make Me Think, Revisited: A Common Sense Approach to Web Usability* (3rd ed.). New Riders. ISBN: 978-0321965516

[42] Nielsen, J., & Budiu, R. (2012). *Mobile Usability*. New Riders. ISBN: 978-0321884480

## Educational Technology

[43] Siemens, G., & Baker, R. S. (2012). "Learning Analytics and Educational Data Mining: Towards Communication and Collaboration." *Proceedings of the 2nd International Conference on Learning Analytics and Knowledge*, pp. 252-254. DOI: 10.1145/2330601.2330661

[44] Ferguson, R. (2012). "Learning Analytics: Drivers, Developments and Challenges." *International Journal of Technology Enhanced Learning*, 4(5/6), 304-317. DOI: 10.1504/IJTEL.2012.051816

[45] Zawacki-Richter, O., Marín, V. I., Bond, M., & Gouverneur, F. (2019). "Systematic Review of Research on Artificial Intelligence Applications in Higher Education – Where Are the Educators?" *International Journal of Educational Technology in Higher Education*, 16(1), 39. DOI: 10.1186/s41239-019-0171-0

## Project Management and Software Development

[46] Schwaber, K., & Sutherland, J. (2020). *The Scrum Guide: The Definitive Guide to Scrum: The Rules of the Game*. Retrieved from https://scrumguides.org/

[47] Project Management Institute. (2021). *A Guide to the Project Management Body of Knowledge (PMBOK® Guide)* (7th ed.). Project Management Institute. ISBN: 978-1628256642

[48] Beck, K., Beedle, M., van Bennekum, A., et al. (2001). *Manifesto for Agile Software Development*. Retrieved from https://agilemanifesto.org/

## Ethics and Privacy

[49] European Union. (2016). *General Data Protection Regulation (GDPR)*. Official Journal of the European Union. Retrieved from https://gdpr-info.eu/

[50] U.S. Department of Education. (1974). *Family Educational Rights and Privacy Act (FERPA)*. Retrieved from https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html

[51] IEEE Computer Society. (2018). *IEEE Code of Ethics*. Retrieved from https://www.ieee.org/about/corporate/governance/p7-8.html

## Accessibility Standards

[52] World Wide Web Consortium (W3C). (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*. Retrieved from https://www.w3.org/TR/WCAG21/

[53] Section508.gov. (2024). *Section 508 Standards for Electronic and Information Technology*. Retrieved from https://www.section508.gov/

---

<div align="center">

# 📑 **APPENDICES**

</div>

<div align="center">

## 📖 **Appendix A: Glossary of Terms**

</div>

**AI (Artificial Intelligence)**: Computer systems capable of performing tasks that typically require human intelligence, such as visual perception, speech recognition, and decision-making.

**API (Application Programming Interface)**: A set of protocols and tools for building software applications that specify how software components should interact.

**Authentication**: The process of verifying the identity of a user or system.

**Authorization**: The process of granting or denying access to resources based on user identity and permissions.

**Biometric Verification**: Identity verification based on unique physical characteristics such as facial features, fingerprints, or iris patterns.

**CORS (Cross-Origin Resource Sharing)**: A security feature that allows or restricts web applications running on one origin to access resources from a different origin.

**Docker**: A platform for developing, shipping, and running applications in isolated containers.

**JWT (JSON Web Token)**: A compact, URL-safe means of representing claims to be transferred between two parties for authentication.

**LLM (Large Language Model)**: AI models trained on vast amounts of text data to understand and generate human-like text.

**Microservices**: An architectural style that structures an application as a collection of loosely coupled services.

**MongoDB**: A NoSQL document-oriented database program that stores data in flexible, JSON-like documents.

**Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine for building server-side applications.

**OAuth**: An open standard for access delegation commonly used for token-based authentication.

**Proctoring**: The supervision of examinations to prevent cheating and ensure assessment integrity.

**React**: A JavaScript library for building user interfaces, particularly single-page applications.

**Redis**: An in-memory data structure store used as a database, cache, and message broker.

**REST (Representational State Transfer)**: An architectural style for designing networked applications using stateless communication.

**SSL/TLS**: Cryptographic protocols designed to provide secure communication over a computer network.

**WebSocket**: A protocol providing full-duplex communication channels over a single TCP connection for real-time data transfer.

---

<div align="center">

## 💻 **Appendix B: System Requirements**

</div>

### 🖥️ Minimum Hardware Requirements

**Development Environment:**
- Processor: Intel Core i5 or AMD Ryzen 5 (4 cores)
- RAM: 8 GB DDR4
- Storage: 20 GB available space (SSD recommended)
- GPU: Not required (for basic development)

**Production Environment:**
- Processor: Intel Xeon or AMD EPYC (8+ cores)
- RAM: 16 GB DDR4 (32 GB recommended)
- Storage: 100 GB SSD
- GPU: NVIDIA GPU with CUDA support (optional, for AI acceleration)

### Software Requirements

**Development:**
- Operating System: Windows 10/11, macOS 11+, or Ubuntu 20.04+
- Node.js: Version 18.x or higher
- MongoDB: Version 8.5 or higher
- Docker: Version 20.10 or higher
- Docker Compose: Version 2.x or higher
- Git: Version 2.30 or higher
- Web Browser: Chrome 90+, Firefox 88+, or Edge 90+

**Deployment:**
- Docker Engine: 20.10+
- Docker Compose: 2.x+
- Reverse Proxy: Nginx 1.20+ or Apache 2.4+
- SSL Certificate: Let's Encrypt or commercial certificate

### Network Requirements

- Bandwidth: Minimum 10 Mbps (100 Mbps recommended for production)
- Ports: 3000 (frontend), 5000 (backend), 27017 (MongoDB), 6379 (Redis)
- WebSocket support: Required for real-time proctoring
- Webcam access: Required for face verification and proctoring

---

<div align="center">

## 🔧 **Appendix C: Installation Guide**

</div>

### ⚡ Quick Start (Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/quiz-platform.git
   cd quiz-platform
   ```

2. **Set up environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit .env files with your configuration
   ```

3. **Start with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

### Detailed Installation Steps

Refer to `QUICKSTART.md` and `docs/setup/GETTING_STARTED.md` for comprehensive installation instructions including:
- Manual installation without Docker
- AI model setup (Ollama configuration)
- Database initialization
- Environment variable configuration
- Troubleshooting common issues

---

<div align="center">

## 🔌 **Appendix D: API Documentation**

</div>

### 🔐 Authentication Endpoints

**POST /api/auth/register**
- Description: Register a new user
- Request Body: `{ username, email, password, role }`
- Response: `{ message, userId, token }`

**POST /api/auth/login**
- Description: User login
- Request Body: `{ emailOrUsername, password }`
- Response: `{ message, token, user }`

**POST /api/auth/logout**
- Description: User logout
- Headers: `Authorization: Bearer <token>`
- Response: `{ message }`

### 📝 Quiz Endpoints

**GET /api/quizzes**
- Description: Get all quizzes (filtered by role)
- Headers: `Authorization: Bearer <token>`
- Query Parameters: `?page=1&limit=10&status=published`
- Response: `{ quizzes, totalPages, currentPage }`

**POST /api/quizzes**
- Description: Create a new quiz
- Headers: `Authorization: Bearer <token>`
- Request Body: `{ title, description, questions, settings }`
- Response: `{ message, quizId }`

**GET /api/quizzes/:id**
- Description: Get quiz details
- Headers: `Authorization: Bearer <token>`
- Response: `{ quiz }`

For complete API documentation, refer to the Postman collection or Swagger documentation at `/api-docs`.

---

<div align="center">

## 🗄️ **Appendix E: Database Schema**

</div>

### 👤 Users Collection
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "hashed_string",
  "role": "student|instructor|admin",
  "faceDescriptor": "array",
  "twoFactorSecret": "string",
  "twoFactorEnabled": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Quizzes Collection
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "creatorId": "ObjectId",
  "questions": "array",
  "settings": {
    "timeLimit": "number",
    "passingScore": "number",
    "maxAttempts": "number",
    "proctoringEnabled": "boolean",
    "shuffleQuestions": "boolean"
  },
  "status": "draft|published|archived",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Results Collection
```json
{
  "_id": "ObjectId",
  "quizId": "ObjectId",
  "userId": "ObjectId",
  "answers": "array",
  "score": "number",
  "violations": "array",
  "startedAt": "timestamp",
  "submittedAt": "timestamp"
}
```

For complete schema details, see `backend/src/models/` directory.

---

<div align="center">

## 🧪 **Appendix F: Test Case Summary**

</div>

### 📊 Total Test Cases: 38
- **Passed:** 35 (92%)
- **Failed:** 3 (8%)
- **Code Coverage:** 78%

### Test Categories:
1. Authentication Tests: 8 cases
2. Quiz Management Tests: 10 cases
3. Question Generation Tests: 6 cases
4. Proctoring Tests: 5 cases
5. Analytics Tests: 4 cases
6. Integration Tests: 5 cases

Detailed test results available in `backend/tests/` and `frontend/src/__tests__/` directories.

---

<div align="center">

## 💻 **Appendix G: Code Snippets**

</div>

### 🤖 Example: AI Question Generation Function

```javascript
async function generateQuestions(params) {
  const { language, difficulty, count, topics } = params;
  
  const prompt = `Generate ${count} ${difficulty} level multiple-choice questions about ${language} programming, focusing on ${topics.join(', ')}. Each question should include 4 options and an explanation.`;
  
  try {
    const response = await ollamaService.generate(prompt);
    return parseQuestions(response);
  } catch (error) {
    console.error('Ollama generation failed, falling back to Gemini');
    return await geminiService.generate(prompt);
  }
}
```

### Example: Face Verification Component

```javascript
async function verifyFace(videoElement, referenceDescriptor) {
  const detection = await faceapi
    .detectSingleFace(videoElement)
    .withFaceLandmarks()
    .withFaceDescriptor();
  
  if (!detection) return { verified: false, distance: null };
  
  const distance = faceapi.euclideanDistance(
    detection.descriptor,
    referenceDescriptor
  );
  
  return {
    verified: distance < 0.6,
    distance: distance
  };
}
```

More code examples available in the project repository.

---

<div align="center">

## 🔤 **Appendix H: Abbreviations and Acronyms**

</div>

| 📌 Abbreviation | ✨ Full Form |
|-------------|-----------|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| AWS | Amazon Web Services |
| CORS | Cross-Origin Resource Sharing |
| CPU | Central Processing Unit |
| CRUD | Create, Read, Update, Delete |
| CSS | Cascading Style Sheets |
| CSV | Comma-Separated Values |
| DFD | Data Flow Diagram |
| DOM | Document Object Model |
| FERPA | Family Educational Rights and Privacy Act |
| GDPR | General Data Protection Regulation |
| GPU | Graphics Processing Unit |
| HTML | HyperText Markup Language |
| HTTP | HyperText Transfer Protocol |
| HTTPS | HyperText Transfer Protocol Secure |
| IDE | Integrated Development Environment |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| LLM | Large Language Model |
| LMS | Learning Management System |
| MCQ | Multiple Choice Question |
| MERN | MongoDB, Express, React, Node.js |
| ML | Machine Learning |
| MVC | Model-View-Controller |
| NLP | Natural Language Processing |
| NoSQL | Not Only SQL |
| npm | Node Package Manager |
| OAuth | Open Authorization |
| ORM | Object-Relational Mapping |
| OWASP | Open Web Application Security Project |
| PDF | Portable Document Format |
| RAM | Random Access Memory |
| RBAC | Role-Based Access Control |
| REST | Representational State Transfer |
| SAML | Security Assertion Markup Language |
| SDK | Software Development Kit |
| SPA | Single Page Application |
| SQL | Structured Query Language |
| SRS | Software Requirements Specification |
| SSL | Secure Sockets Layer |
| SSO | Single Sign-On |
| TDD | Test-Driven Development |
| TLS | Transport Layer Security |
| UI | User Interface |
| UML | Unified Modeling Language |
| URI | Uniform Resource Identifier |
| URL | Uniform Resource Locator |
| UX | User Experience |
| VM | Virtual Machine |
| VR | Virtual Reality |
| WBS | Work Breakdown Structure |
| WCAG | Web Content Accessibility Guidelines |
| WebRTC | Web Real-Time Communication |
| XSS | Cross-Site Scripting |

---

# END OF REPORT

---

**Total Pages:** Approximately 150-200 pages (when formatted)

**Document Version:** 1.0

**Last Updated:** November 2025

**Prepared by:** Aman, Chetan, Shashak, Vanisha, Yash

**For:** College Major Project Demonstration

**Institution:** [Your College/University Name]

**Department:** Artificial Intelligence and Data Science

---

