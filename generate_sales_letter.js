const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, ExternalHyperlink, PageNumber, Header, Footer
} = require("C:/Users/cnrhs/AppData/Roaming/npm/node_modules/docx");
const fs = require("fs");

const AMBER = "C8970F";
const DARK = "1A1A1A";
const GRAY = "666666";
const LIGHT_GRAY = "F5F5F5";
const MID_GRAY = "DDDDDD";

const border = { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    spacing: { before: 480, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: AMBER, space: 6 } },
    children: [new TextRun({ text, bold: true, size: 36, color: DARK, font: "Arial" })]
  });
}

function h2(text) {
  return new Paragraph({
    spacing: { before: 360, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, color: DARK, font: "Arial" })]
  });
}

function h3(text) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, color: DARK, font: "Arial" })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, color: opts.color || DARK, font: "Arial", bold: opts.bold || false, italics: opts.italic || false })]
  });
}

function boldLabel(label, rest) {
  return new Paragraph({
    spacing: { before: 120, after: 80 },
    children: [
      new TextRun({ text: label, bold: true, size: 22, color: DARK, font: "Arial" }),
      new TextRun({ text: rest || "", size: 22, color: DARK, font: "Arial" })
    ]
  });
}

function bullet(text, numbered = false, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, color: DARK, font: "Arial" })]
  });
}

function spacer(n = 1) {
  return Array.from({ length: n }, () => new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "", size: 22 })] }));
}

function divider() {
  return new Paragraph({
    spacing: { before: 240, after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_GRAY, space: 1 } },
    children: [new TextRun({ text: "", size: 4 })]
  });
}

function resultBox(text) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: { style: BorderStyle.SINGLE, size: 4, color: AMBER }, bottom: { style: BorderStyle.SINGLE, size: 4, color: AMBER }, left: { style: BorderStyle.SINGLE, size: 16, color: AMBER }, right: { style: BorderStyle.SINGLE, size: 4, color: AMBER } },
        shading: { fill: "FFF8E7", type: ShadingType.CLEAR },
        margins: { top: 160, bottom: 160, left: 200, right: 200 },
        width: { size: 9360, type: WidthType.DXA },
        children: [new Paragraph({
          children: [new TextRun({ text, bold: true, size: 24, color: "8B6500", font: "Arial" })]
        })]
      })]
    })]
  });
}

function metricTable(metrics) {
  const colW = Math.floor(9360 / metrics.length);
  const cols = metrics.map(() => colW);
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({
        children: metrics.map(m => new TableCell({
          borders,
          shading: { fill: LIGHT_GRAY, type: ShadingType.CLEAR },
          margins: { top: 160, bottom: 80, left: 160, right: 160 },
          width: { size: colW, type: WidthType.DXA },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: m.value, bold: true, size: 36, color: AMBER, font: "Arial" })]
          })]
        }))
      }),
      new TableRow({
        children: metrics.map(m => new TableCell({
          borders,
          shading: { fill: LIGHT_GRAY, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 160, left: 160, right: 160 },
          width: { size: colW, type: WidthType.DXA },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: m.label, size: 18, color: GRAY, font: "Arial" })]
          })]
        }))
      })
    ]
  });
}

function dataTable(headers, rows, colWidths) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((h, i) => new TableCell({
          borders,
          shading: { fill: "222222", type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 160, right: 160 },
          width: { size: colWidths[i], type: WidthType.DXA },
          children: [new Paragraph({
            children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF", font: "Arial" })]
          })]
        }))
      }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((cell, ci) => new TableCell({
          borders,
          shading: { fill: ri % 2 === 0 ? "FFFFFF" : LIGHT_GRAY, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          width: { size: colWidths[ci], type: WidthType.DXA },
          children: [new Paragraph({
            children: [new TextRun({
              text: cell,
              size: 20,
              color: (ri === rows.length - 1) ? "8B6500" : DARK,
              bold: ri === rows.length - 1,
              font: "Arial"
            })]
          })]
        }))
      }))
    ]
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "leadacquisition.io  |  Page ", size: 18, color: GRAY, font: "Arial" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GRAY, font: "Arial" })
          ]
        })]
      })
    },
    children: [

      // TITLE BLOCK
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "For B2B Agencies and SaaS Companies", size: 22, color: GRAY, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 160 },
        children: [new TextRun({ text: "How B2B Agencies and SaaS Companies Predictably Land 20-30 Sales-Ready Leads Per Month Without Wasting Money on Ads", bold: true, size: 36, color: DARK, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 40 },
        children: [new TextRun({ text: "For Agencies and Software Companies, Founders, CEOs and CMOs", size: 20, color: GRAY, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text: "Author: Conor Houston, CEO of Lead Acquisition", size: 20, color: GRAY, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 240 },
        children: [new ExternalHyperlink({
          link: "https://calendly.com/leadacquisition/30min",
          children: [new TextRun({ text: "Book A Call Here", size: 22, color: AMBER, bold: true, font: "Arial", underline: {} })]
        })]
      }),

      divider(),

      // CASE STUDY 1
      h1("Lead Acquisition Case Study #1"),
      h2("How Dimension6 Went From 5-10 Demos Per Month to 56 Demos in 40 Days Using the Acquisition System"),
      ...spacer(1),
      body("Dimension6 is a full stack podcast growth service working with household names and brands like Tony Robbins, Salesforce and Mattel."),
      body("They were booking a decent number of calls but could not find a reliable way to go from decent to great. They needed more leads coming through the pipeline if they wanted to scale properly, and current lead sources were not cutting it."),
      ...spacer(1),

      metricTable([
        { value: "9,354", label: "Emails Sent" },
        { value: "4.7%", label: "Reply Rate" },
        { value: "36%", label: "Positive Reply Rate" },
        { value: "56", label: "Demos Booked" }
      ]),
      ...spacer(1),

      boldLabel("What We Did"),
      body("We ran the Acquisition System targeting podcast hosts with 10k+ listeners in the US and UK. Rather than chasing volume, we prioritised untapped lead data that competitors were not touching."),
      body("We tested our private lead data against standard Apollo.io lists. The difference was a 9.33x increase in reply rate. Prospects who rarely receive cold email respond differently to it. This directly resulted in more booked calls because there was less competition and friction in the outreach."),
      ...spacer(1),

      resultBox("Result: 40 x $9,000 LTV = $360,000 pipeline value generated"),

      ...spacer(1),
      h3("Campaign Results"),
      body("Below are screenshots from the Dimension6 campaigns inside our sending platform."),
      ...spacer(1),

      // Screenshot placeholder 1
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders: { top: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, bottom: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, left: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, right: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY } },
          shading: { fill: "F9F9F9", type: ShadingType.CLEAR },
          margins: { top: 800, bottom: 800, left: 200, right: 200 },
          width: { size: 9360, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[ Insert Campaign Screenshot ]", size: 22, color: "AAAAAA", font: "Arial", italics: true })] })]
        })] })]
      }),
      ...spacer(1),

      // Screenshot placeholder 2
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders: { top: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, bottom: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, left: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, right: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY } },
          shading: { fill: "F9F9F9", type: ShadingType.CLEAR },
          margins: { top: 800, bottom: 800, left: 200, right: 200 },
          width: { size: 9360, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[ Insert Campaign Screenshot ]", size: 22, color: "AAAAAA", font: "Arial", italics: true })] })]
        })] })]
      }),

      divider(),

      // CASE STUDY 2
      h1("Lead Acquisition Case Study #2"),
      h2("How BossDigital Went From Zero Outbound to Making Cold Email Its Primary Channel, Generating 26 MQLs in the Process"),
      ...spacer(1),
      body("BossDigital is a B2B UGC agency specialising in ecommerce. They came to us with a weak pipeline looking for a more reliable way to generate qualified, ready-to-buy leads."),
      ...spacer(1),
      boldLabel("Before working with us:"),
      bullet("Very little outbound activity"),
      bullet("Generating 3-5 leads per month"),
      bullet("Handling everything in-house"),
      bullet("Skeptical of cold email due to lack of results previously"),
      ...spacer(1),
      boldLabel("After:"),
      bullet("Cold email became the main source of lead flow"),
      bullet("Generating 3-5 qualified bookings per week"),
      bullet("Booked 20+ meetings every month"),
      bullet("$576,000 pipeline value"),
      ...spacer(1),

      metricTable([
        { value: "20+", label: "Meetings / Month" },
        { value: "1/233", label: "Emails to Lead" },
        { value: "$5k+", label: "Avg Deal Size" },
        { value: "$576k", label: "Pipeline Generated" }
      ]),
      ...spacer(1),

      boldLabel("What We Did"),
      body("BossDigital had specific criteria. They wanted to be in front of ecommerce brands doing $1M per year or more, currently running ads and in need of consistent UGC."),
      body("Instead of another generic pitch, we gave prospects something tangible upfront: 2 to 3 free UGC creatives to use in their ads. This approach outperformed the typical \"We can do X, Y and Z for you, let us chat\" emails."),
      body("The result: leads were not getting on a sales call. They were getting on a call to collect something they already wanted. This flipped the narrative and had leads eager to engage."),

      ...spacer(1),
      h3("Campaign Results"),
      body("Below are screenshots from the BossDigital campaigns inside our sending platform."),
      ...spacer(1),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders: { top: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, bottom: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, left: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, right: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY } },
          shading: { fill: "F9F9F9", type: ShadingType.CLEAR },
          margins: { top: 800, bottom: 800, left: 200, right: 200 },
          width: { size: 9360, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[ Insert Campaign Screenshot ]", size: 22, color: "AAAAAA", font: "Arial", italics: true })] })]
        })] })]
      }),
      ...spacer(1),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders: { top: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, bottom: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, left: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY }, right: { style: BorderStyle.DASHED, size: 4, color: MID_GRAY } },
          shading: { fill: "F9F9F9", type: ShadingType.CLEAR },
          margins: { top: 800, bottom: 800, left: 200, right: 200 },
          width: { size: 9360, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[ Insert Campaign Screenshot ]", size: 22, color: "AAAAAA", font: "Arial", italics: true })] })]
        })] })]
      }),

      divider(),

      // WHO IS THIS FOR
      h1("Who Is This For?"),
      body("On a macro level, this is for executives in agencies and B2B software companies doing more than $350K ARR."),
      body("This is specifically relevant to you if:"),
      ...spacer(1),
      bullet("You are exhausted from spending hours daily chasing cold prospects manually across LinkedIn, cold calling and email. Response rates keep dropping."),
      bullet("You are landing monthly retainer clients that drain your resources because they are not properly qualified upfront."),
      bullet("You have an exceptional service or software solution priced at $10K+ annually but struggle to get it in front of the right decision-makers."),
      bullet("You are trapped in the endless cycle of relying on referrals and inbound leads, wondering where the next deal is coming from."),
      bullet("You have tried every marketing channel from paid ads to content and SEO but cannot find a predictable way to generate quality leads."),
      bullet("Your sales pipeline has only 3-5 discovery calls each month when you know you could be scaling dramatically with the right client acquisition system."),

      divider(),

      // CORE CONCEPT
      h1("Core Concept"),
      body("Dealflow can now be sourced on demand. You can take the initiative. You do not need to rely on ads, referrals or content."),
      body("There is a gap in the market for sourcing high-quality opportunities. Companies lack the assets, sales processes and lead generation infrastructure."),
      body("We are the firm dedicated to sourcing deal flow and implementing an Acquisition System that allows software companies and agencies to scale without worrying about the quality of meetings or being the primary salesperson."),

      divider(),

      // ABOUT
      h1("About Conor Houston"),
      body("My name is Conor Houston, CEO and founder of Lead Acquisition. Before starting the company, I worked as a consultant helping marketing companies build their strategies."),
      body("I started Lead Acquisition after recognising a critical gap in the market. There had to be a better way for agencies and software companies to generate leads instead of:"),
      ...spacer(1),
      bullet("Relying solely on referrals and word of mouth"),
      bullet("Wasting budget on ineffective marketing campaigns"),
      bullet("Spending hours each day on manual outreach that yields poor results"),
      ...spacer(1),
      body("Working closely with SaaS companies and agencies, I noticed a consistent pattern: many had excellent services and products but lacked an effective system for reaching their ideal clients. This led to the development of the Acquisition System."),

      divider(),

      // PROCESS OVERVIEW
      h1("Lead Acquisition Process Overview"),
      body("At Lead Acquisition, we follow a 5-step process when helping clients generate deal flow."),
      ...spacer(1),
      bullet("Creating the Technical Infrastructure", false, "numbers"),
      bullet("Gathering Data Your Competitors Do Not Use", false, "numbers"),
      bullet("Building an Offer Designed to Convert Cold Traffic", false, "numbers"),
      bullet("Launching the Acquisition System", false, "numbers"),
      bullet("Refining the Campaigns and Sales Process", false, "numbers"),

      divider(),

      // STEP 1
      h1("Step 1 - Creating the Technical Infrastructure"),
      body("The correct technical infrastructure is the foundation for building a reliable and scaleable client acquisition system. In 2025, deliverability has become the focal point of high performing campaigns."),
      ...spacer(1),
      boldLabel("What we focus on:"),
      bullet("Reply Rate"),
      bullet("Positive Reply Rate"),
      bullet("Booking Rate"),
      bullet("Inbox Placement Rate"),
      ...spacer(1),
      resultBox("Result: Constant inbox placement to your ideal client. No periods of downtime due to dead inboxes or burned domains."),

      divider(),

      // STEP 2
      h1("Step 2 - Gathering Data Your Competitors Do Not Use"),
      body("Cold email data gathering is the most undervalued part of the system. Most businesses rely on enterprise vendors that everyone is sending emails to. Our methodology is to target those your competitors are not."),
      body("While we utilise Apollo.io, PeopleDataLabs and ZoomInfo, we primarily source data from our own platform (tryxenoleads.com). All leads have been privately scraped and sourced, ensuring prospects are much higher quality than typical lead lists."),
      body("Once the list is built, we waterfall enrich using MillionVerifier, Enrichley and Scrubby. This process gives us 20 to 30% extra leads that no one else is emailing."),
      ...spacer(1),
      resultBox("Result: Consistent high quality lead lists full of prospects not used to receiving cold emails. Higher reply rates. More bookings."),

      divider(),

      // STEP 3
      h1("Step 3 - Building an Offer Designed to Convert Cold Traffic"),
      body("Booking calls via cold traffic is significantly more sophisticated than booking calls with warm inbound traffic. The purpose of cold email is to generate demand, and this can only be done with an irresistible offer."),
      ...spacer(1),
      boldLabel("Our internal offer framework:"),
      bullet("Value-First"),
      bullet("Free Resource"),
      bullet("Natural Pitch Transition"),
      bullet("Systematic Follow-up"),
      ...spacer(1),
      body("We start by delivering immediate value through a free resource, then use strategic conversation methods to understand their business challenges. Only once we have qualified them and identified clear pain points do we transition to discussing the recurring service."),
      ...spacer(1),
      resultBox("Result: High conversion rate of booked calls through a proven offer system that builds trust while qualifying prospects."),

      divider(),

      // STEP 4
      h1("Step 4 - Launching the Acquisition System"),
      body("We implement the Acquisition System in two main steps."),
      ...spacer(1),
      boldLabel("Initial System Build:"),
      bullet("Email accounts and domains"),
      bullet("Campaign messaging"),
      bullet("Untapped data and TAM assessment"),
      bullet("Frontend offer and lead magnet creation"),
      bullet("Follow-up subsequences"),
      bullet("50,000 emails per month"),
      ...spacer(1),
      boldLabel("Sales Process Refinement:"),
      bullet("Post-booking flows and reminders"),
      bullet("Sales letter creation"),
      bullet("Show-up rate optimisation"),
      bullet("Close rate optimisation"),
      ...spacer(1),
      resultBox("Result: A lean acquisition system, easy to track with full transparency. 10-20 qualified leads in the first month and growing from there."),

      divider(),

      // STEP 5
      h1("Step 5 - Refining the Sales Process"),
      body("We use three main methods to increase your closing and show-up rates:"),
      ...spacer(1),
      bullet("Analyse your current sales process to identify gaps"),
      bullet("Build automated follow-up sequences and reminders"),
      bullet("Create high-converting sales assets (case studies, sales letters)"),
      bullet("Implement call and text confirmation systems"),
      bullet("Design pre-call email sequences"),
      bullet("Set up multi-channel reminder systems"),
      ...spacer(1),
      resultBox("Result: Increased closing and show-up rates. Prospects are educated and excited to be on the call."),

      divider(),

      // ALTERNATIVES TABLE
      h1("Why Not Another Alternative?"),
      ...spacer(1),
      dataTable(
        ["Alternative", "Result", "Time to Results"],
        [
          ["Hiring a Marketing Department", "High overhead, inconsistent results", "6-12 months"],
          ["Handling It Yourself", "Inconsistent, no clear system", "6-12 months"],
          ["Hiring SDRs", "High overhead, payment regardless of results", "5-8 months total"],
          ["Lead Acquisition", "Systematic, data-driven, live in 2 weeks", "Results in month 1"]
        ],
        [3200, 4160, 2000]
      ),

      divider(),

      // WHAT YOU GET TABLE
      h1("What You Get"),
      ...spacer(1),
      dataTable(
        ["Deliverable", "Breakdown"],
        [
          ["Done-For-You Cold Email", "Strategic system targeting 20,000-150,000 leads per month"],
          ["Script Writing", "Campaign messaging built to get leads interested in your offer"],
          ["Lead Magnet Creation", "Custom-designed resources that capture and nurture leads"],
          ["Technical Infrastructure Setup", "Proven infrastructure to ensure inbox uptime, 3%+ reply rates"],
          ["Funnel Optimisation", "Complete sales process and landing page optimisation"]
        ],
        [3600, 5760]
      ),

      divider(),

      // NEXT STEPS
      h1("Next Steps"),
      body("Speak with Conor and the team to start, launch and scale your own Lead Acquisition System."),
      ...spacer(1),
      new Paragraph({
        spacing: { before: 80, after: 160 },
        children: [
          new TextRun({ text: "Book a call: ", size: 22, font: "Arial", color: DARK }),
          new ExternalHyperlink({
            link: "https://calendly.com/leadacquisition/30min",
            children: [new TextRun({ text: "calendly.com/leadacquisition/30min", size: 22, color: AMBER, font: "Arial", underline: {} })]
          })
        ]
      }),

      divider(),

      // Q&A
      h1("Q&A"),
      ...spacer(1),

      boldLabel("Q: What kind of results can I expect?"),
      body("Results vary based on your offer and market, but our case studies demonstrate significant outcomes. Typically, clients can expect 20-30 qualified leads per month when the system is fully implemented."),
      ...spacer(1),

      boldLabel("Q: What if I already have an in-house marketing team?"),
      body("We are happy to collaborate with your existing marketing team. We also offer a consulting option where we can work alongside your team and train them to run the system in-house."),
      ...spacer(1),

      boldLabel("Q: What does the onboarding process look like?"),
      body("Once you become a client, you will receive access to our Slack channel where we update you on the build of your Acquisition System. The initial setup includes campaign messaging development, sales process optimisation, lead magnet creation and technical infrastructure creation."),
      ...spacer(1),

      boldLabel("Q: How long until I see results?"),
      body("Clients typically begin seeing results within the first month of launch. The system continues to optimise over time as we refine the outbound strategy and funnel performance."),
      ...spacer(1),

      boldLabel("Q: What do you need from me?"),
      body("An initial strategy session to understand your business and offerings, access to any existing case studies or client success stories, and occasional availability for optimisation discussions."),
      ...spacer(1),

      boldLabel("Q: Why is your approach different from traditional lead generation?"),
      body("Unlike traditional methods, we build an acquisition system that creates authority positioning through case study presentation, generates hyper-relevant leads instead of tire kickers, and builds a scalable system rather than relying on manual efforts."),
      ...spacer(1),

      boldLabel("Q: Is there a minimum commitment?"),
      body("Yes, we require a minimum 3-month commitment to properly implement and optimise the system."),

      divider(),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 80 },
        children: [new TextRun({ text: "leadacquisition.io", bold: true, size: 24, color: AMBER, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: "Conor Houston, Founder and CEO", size: 20, color: GRAY, font: "Arial" })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:/Users/cnrhs/Desktop/laio-website/Lead_Acquisition_Sales_Letter.docx", buffer);
  console.log("Done: Lead_Acquisition_Sales_Letter.docx");
});
