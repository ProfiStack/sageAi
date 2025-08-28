import jsPDF from "jspdf";

export const generateSkincareReportPDF = (resultsData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Professional color palette - removed gray/black backgrounds
  const colors = {
    primary: [2, 51, 30], // Deep forest green - #02331E
    accent: [212, 176, 56], // Elegant gold - #D4B038
    lightAccent: [249, 247, 237], // Warm cream - #F9F7ED
    accentSoft: [240, 233, 199], // Soft champagne - #F0E9C7
    text: [44, 62, 80], // Professional navy - #2C3E50
    lightText: [127, 140, 141], // Sophisticated grey - #7F8C8D
    white: [255, 255, 255], // Pure white
    success: [39, 174, 96], // Fresh green - #27AE60
    successLight: [232, 248, 237], // Very light green - #E8F8ED
    warning: [231, 76, 60], // Refined red - #E74C3C
    warningLight: [253, 237, 237], // Very light red - #FDEDED
    summer: [241, 196, 15], // Warm gold - #F1C40F
    summerLight: [254, 249, 231], // Very light yellow - #FEF9E7
    winter: [52, 152, 219], // Cool blue - #3498DB
    winterLight: [235, 245, 254], // Very light blue - #EBF5FE
    cardBg: [253, 252, 248], // Elegant off-white - #FDFCF8
    headerBg: [250, 248, 240], // Light cream - #FAF8F0
    borderLight: [236, 240, 241], // Soft border - #ECF0F1
    accentLight: [254, 250, 224], // Very light gold - #FEFAE0
  };

  // Helper functions
  const setColor = (colorArray) => {
    if (colorArray.length === 4) {
      doc.setFillColor(colorArray[0], colorArray[1], colorArray[2]);
    } else {
      doc.setTextColor(colorArray[0], colorArray[1], colorArray[2]);
    }
  };

  const checkPageBreak = (requiredSpace = 25) => {
    if (yPosition + requiredSpace > pageHeight - margin - 30) {
      addFooter();
      doc.addPage();
      yPosition = margin + 20;
      return true;
    }
    return false;
  };

  const addWrappedText = (
    text,
    x,
    y,
    maxWidth,
    fontSize = 11,
    lineHeight = 1.4
  ) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    let currentY = y;

    lines.forEach((line, index) => {
      if (currentY + fontSize * 0.5 > pageHeight - margin - 30) {
        addFooter();
        doc.addPage();
        currentY = margin + 20;
      }
      doc.text(line, x, currentY);
      currentY += fontSize * 0.352778 * lineHeight; // Convert pt to mm
    });

    return currentY;
  };

  const addSectionHeader = (title, bgColor = colors.lightAccent) => {
    checkPageBreak(35);

    // Main background with elegant styling
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.roundedRect(margin, yPosition - 5, contentWidth, 25, 3, 3, "F");

    // Subtle accent border
    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPosition - 5, contentWidth, 25, 3, 3, "S");

    // Left accent bar
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.roundedRect(margin, yPosition - 5, 5, 25, 3, 0, "F");

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    setColor(colors.primary);

    doc.text(title, margin + 15, yPosition + 10);
    yPosition += 30;
  };

  const addSubHeader = (title, color = colors.accent) => {
    checkPageBreak(25);

    // Subtle background for subheaders
    doc.setFillColor(
      colors.accentLight[0],
      colors.accentLight[1],
      colors.accentLight[2]
    );
    doc.roundedRect(margin, yPosition - 8, contentWidth, 20, 2, 2, "F");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    setColor(color);
    doc.text(title, margin + 8, yPosition);
    yPosition += 15;
  };

  const addProductCard = (product, index) => {
    checkPageBreak(50);

    const cardHeight = 45;

    // Card background with professional styling
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.roundedRect(margin, yPosition - 5, contentWidth, cardHeight, 3, 3, "F");

    // Elegant border
    doc.setDrawColor(
      colors.borderLight[0],
      colors.borderLight[1],
      colors.borderLight[2]
    );
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition - 5, contentWidth, cardHeight, 3, 3, "S");

    // Left accent strip
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.roundedRect(margin, yPosition - 5, 4, cardHeight, 3, 0, "F");

    // Product name and brand
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    setColor(colors.text);
    doc.text(`${product.name}`, margin + 12, yPosition + 8);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    setColor(colors.accent);
    doc.text(`by ${product.brand}`, margin + 12, yPosition + 16);

    // Elegant price tag
    const priceText = `$${product.price.replace(" USD", "")}`;
    const priceWidth = doc.getTextWidth(priceText);
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.roundedRect(
      pageWidth - margin - priceWidth - 15,
      yPosition + 2,
      priceWidth + 10,
      12,
      6,
      6,
      "F"
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    setColor(colors.white);
    doc.text(priceText, pageWidth - margin - priceWidth - 10, yPosition + 10);

    // Description
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    setColor(colors.text);
    yPosition = addWrappedText(
      product.description,
      margin + 12,
      yPosition + 22,
      contentWidth - 20,
      9,
      1.3
    );

    // Perfect for tag
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    setColor(colors.lightText);
    doc.text(`Perfect for: ${product.perfect_for}`, margin + 12, yPosition + 5);

    yPosition += 20;
  };

  const addCenteredCircleNumber = (
    number,
    x,
    y,
    radius,
    bgColor,
    textColor
  ) => {
    // Draw circle background
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.circle(x, y, radius, "F");

    // White border for elegance
    doc.setDrawColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setLineWidth(1);
    doc.circle(x, y, radius, "S");

    // Center the number text
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    setColor(textColor);
    const numberText = `${number}`;
    const textWidth = doc.getTextWidth(numberText);
    const textHeight = 9 * 0.352778; // Convert pt to mm

    // Center both horizontally and vertically
    doc.text(numberText, x - textWidth / 2, y + textHeight / 3);
  };

  const addFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

    // Elegant footer line
    doc.setDrawColor(
      colors.borderLight[0],
      colors.borderLight[1],
      colors.borderLight[2]
    );
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);

    doc.setFontSize(8);
    setColor(colors.lightText);

    // Left: Generation date
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Generated on ${currentDate}`, margin, pageHeight - 15);

    // Center: Company info
    doc.text("AI-Powered Skincare Analysis", pageWidth / 2, pageHeight - 15, {
      align: "center",
    });

    // Right: Page number
    doc.text(
      `Page ${currentPage} of ${pageCount}`,
      pageWidth - margin,
      pageHeight - 15,
      { align: "right" }
    );
  };

  // Professional Cover Page
  const createCoverPage = () => {
    // Elegant gradient background effect
    for (let i = 0; i < 40; i++) {
      const opacity = 0.03 - i * 0.0007;
      doc.setFillColor(
        colors.lightAccent[0],
        colors.lightAccent[1],
        colors.lightAccent[2],
        opacity
      );
      doc.rect(0, i * 5, pageWidth, 5, "F");
    }

    // Main header with professional styling
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(margin, 50, contentWidth, 90, 8, 8, "F");

    // Elegant accent border
    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(2);
    doc.roundedRect(margin - 1, 49, contentWidth + 2, 92, 9, 9, "S");

    // Title
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    setColor(colors.white);
    doc.text("SKINCARE ANALYSIS", pageWidth / 2, 80, { align: "center" });

    doc.setFontSize(26);
    doc.text("REPORT", pageWidth / 2, 105, { align: "center" });

    // Professional subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Personalized skincare guidance powered by AI",
      pageWidth / 2,
      125,
      { align: "center" }
    );

    // Decorative professional elements
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.circle(50, 170, 6, "F");
    doc.circle(pageWidth - 50, 170, 4, "F");
    doc.circle(70, 210, 3, "F");
    doc.circle(pageWidth - 70, 210, 8, "F");

    // Report details box with elegant styling
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.roundedRect(margin + 15, 180, contentWidth - 30, 70, 6, 6, "F");

    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(1.5);
    doc.roundedRect(margin + 15, 180, contentWidth - 30, 70, 6, 6, "S");

    // Accent corner elements
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.triangle(margin + 15, 180, margin + 25, 180, margin + 15, 190, "F");
    doc.triangle(
      pageWidth - margin - 15,
      250,
      pageWidth - margin - 25,
      250,
      pageWidth - margin - 15,
      240,
      "F"
    );

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    setColor(colors.primary);
    doc.text("Your Personalized Report", pageWidth / 2, 205, {
      align: "center",
    });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    setColor(colors.text);
    const reportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Generated on ${reportDate}`, pageWidth / 2, 220, {
      align: "center",
    });
    doc.text(
      "Comprehensive skincare analysis and recommendations",
      pageWidth / 2,
      235,
      { align: "center" }
    );

    addFooter();
    doc.addPage();
    yPosition = margin + 20;
  };

  // Generate PDF
  createCoverPage();

  // 1. Skin Profile Section
  addSectionHeader("Your Skin Profile");

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  setColor(colors.text);
  yPosition = addWrappedText(
    resultsData.user_profile_section,
    margin + 5,
    yPosition,
    contentWidth - 10,
    11,
    1.5
  );
  yPosition += 20;

  // Expert Advice with elegant highlight box
  checkPageBreak(30);
  doc.setFillColor(
    colors.accentSoft[0],
    colors.accentSoft[1],
    colors.accentSoft[2]
  );
  const adviceHeight = Math.max(
    40,
    Math.ceil(resultsData.advice_section.length / 80) * 15
  );
  doc.roundedRect(margin, yPosition - 5, contentWidth, adviceHeight, 4, 4, "F");

  // Elegant border
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, yPosition - 5, contentWidth, adviceHeight, 4, 4, "S");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  setColor(colors.accent);
  doc.text("Expert Advice", margin + 12, yPosition + 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setColor(colors.text);
  yPosition = addWrappedText(
    resultsData.advice_section,
    margin + 12,
    yPosition + 20,
    contentWidth - 24,
    10,
    1.4
  );
  yPosition += 25;

  // 2. Daily Routine Section
  addSectionHeader("Daily Skincare Routine");

  // Morning Routine
  addSubHeader("Morning Routine", colors.accent);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setColor(colors.text);

  resultsData.day_routine_section.forEach((step, index) => {
    checkPageBreak(15);

    // Professional step number with proper centering
    addCenteredCircleNumber(
      index + 1,
      margin + 10,
      yPosition - 1,
      7,
      colors.accent,
      colors.white
    );

    const stepText = step.replace(/^Step \d+ - /, "");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    setColor(colors.text);
    yPosition = addWrappedText(
      stepText,
      margin + 25,
      yPosition,
      contentWidth - 30,
      10,
      1.3
    );
    yPosition += 8;
  });
  yPosition += 15;

  // Evening Routine
  addSubHeader("Evening Routine", colors.primary);

  resultsData.night_routine_section.forEach((step, index) => {
    checkPageBreak(15);

    // Professional step number with primary color and proper centering
    addCenteredCircleNumber(
      index + 1,
      margin + 10,
      yPosition - 1,
      7,
      colors.primary,
      colors.white
    );

    const stepText = step.replace(/^Step \d+ - /, "");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    setColor(colors.text);
    yPosition = addWrappedText(
      stepText,
      margin + 25,
      yPosition,
      contentWidth - 30,
      10,
      1.3
    );
    yPosition += 8;
  });
  yPosition += 20;

  // 3. Recommended Products
  addSectionHeader("Recommended Products");

  resultsData.products_section.forEach((product, index) => {
    addProductCard(product, index);
  });
  yPosition += 10;

  // 4. Enhanced Do's and Don'ts with professional styling
  addSectionHeader("Essential Guidelines");

  checkPageBreak(60);

  // Professional header section
  doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
  doc.roundedRect(margin, yPosition - 10, contentWidth, 30, 6, 6, "F");

  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.setLineWidth(1);
  doc.roundedRect(margin, yPosition - 10, contentWidth, 30, 6, 6, "S");

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  setColor(colors.primary);
  doc.text(
    "Best Practices for Your Skincare Journey",
    pageWidth / 2,
    yPosition + 5,
    { align: "center" }
  );

  yPosition += 35;

  // Create enhanced two-column layout
  const columnWidth = (contentWidth - 20) / 2;
  const leftColumn = margin + 8;
  const rightColumn = margin + columnWidth + 16;

  // Calculate dynamic heights for both columns
  const dosHeight = Math.max(
    80,
    resultsData.dos_donts_section.dos.length * 12 + 40
  );
  const dontsHeight = Math.max(
    80,
    resultsData.dos_donts_section.donts.length * 12 + 40
  );
  const maxHeight = Math.max(dosHeight, dontsHeight);

  // Do's column with enhanced professional styling
  doc.setFillColor(
    colors.successLight[0],
    colors.successLight[1],
    colors.successLight[2]
  );
  doc.roundedRect(
    leftColumn - 8,
    yPosition - 8,
    columnWidth + 8,
    maxHeight,
    6,
    6,
    "F"
  );

  doc.setDrawColor(colors.success[0], colors.success[1], colors.success[2]);
  doc.setLineWidth(1.5);
  doc.roundedRect(
    leftColumn - 8,
    yPosition - 8,
    columnWidth + 8,
    maxHeight,
    6,
    6,
    "S"
  );

  // Enhanced header for Do's
  doc.setFillColor(colors.success[0], colors.success[1], colors.success[2]);
  doc.roundedRect(
    leftColumn - 8,
    yPosition - 8,
    columnWidth + 8,
    25,
    6,
    6,
    "F"
  );

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  setColor(colors.white);
  doc.text("RECOMMENDED", leftColumn + columnWidth / 2 - 4, yPosition + 8, {
    align: "center",
  });

  let leftYPosition = yPosition + 25;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  setColor(colors.text);

  resultsData.dos_donts_section.dos.forEach((item, index) => {
    doc.setFillColor(colors.success[0], colors.success[1], colors.success[2]);
    doc.circle(leftColumn + 6, leftYPosition - 1, 2.5, "F");

    const textHeight = addWrappedText(
      item,
      leftColumn + 15,
      leftYPosition,
      columnWidth - 23,
      9,
      1.3
    );
    leftYPosition = textHeight + 8;
  });

  // Don'ts column with enhanced professional styling
  doc.setFillColor(
    colors.warningLight[0],
    colors.warningLight[1],
    colors.warningLight[2]
  );
  doc.roundedRect(
    rightColumn - 8,
    yPosition - 8,
    columnWidth + 8,
    maxHeight,
    6,
    6,
    "F"
  );

  doc.setDrawColor(colors.warning[0], colors.warning[1], colors.warning[2]);
  doc.setLineWidth(1.5);
  doc.roundedRect(
    rightColumn - 8,
    yPosition - 8,
    columnWidth + 8,
    maxHeight,
    6,
    6,
    "S"
  );

  // Enhanced header for Don'ts
  doc.setFillColor(colors.warning[0], colors.warning[1], colors.warning[2]);
  doc.roundedRect(
    rightColumn - 8,
    yPosition - 8,
    columnWidth + 8,
    25,
    6,
    6,
    "F"
  );

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  setColor(colors.white);
  doc.text("AVOID", rightColumn + columnWidth / 2 - 4, yPosition + 8, {
    align: "center",
  });

  let rightYPosition = yPosition + 25;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  setColor(colors.text);

  resultsData.dos_donts_section.donts.forEach((item, index) => {
    doc.setFillColor(colors.warning[0], colors.warning[1], colors.warning[2]);
    doc.circle(rightColumn + 6, rightYPosition - 1, 2.5, "F");

    const textHeight = addWrappedText(
      item,
      rightColumn + 15,
      rightYPosition,
      columnWidth - 23,
      9,
      1.3
    );
    rightYPosition = textHeight + 8;
  });

  yPosition += maxHeight + 20;

  // 5. Enhanced Seasonal Care with professional styling
  addSectionHeader("Seasonal Care Guide");

  // Enhanced Summer Care
  checkPageBreak(60);
  doc.setFillColor(
    colors.summerLight[0],
    colors.summerLight[1],
    colors.summerLight[2]
  );
  const summerHeight = Math.max(
    50,
    Math.ceil(resultsData.seasonal_switches_section.summer.length / 90) * 15 +
      35
  );
  doc.roundedRect(margin, yPosition - 8, contentWidth, summerHeight, 8, 8, "F");

  doc.setDrawColor(colors.summer[0], colors.summer[1], colors.summer[2]);
  doc.setLineWidth(1.5);
  doc.roundedRect(margin, yPosition - 8, contentWidth, summerHeight, 8, 8, "S");

  // Professional summer header
  doc.setFillColor(colors.summer[0], colors.summer[1], colors.summer[2]);
  doc.roundedRect(margin, yPosition - 8, contentWidth, 25, 8, 8, "F");

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  setColor(colors.white);
  doc.text("SUMMER SKINCARE", pageWidth / 2, yPosition + 8, {
    align: "center",
  });

  yPosition += 30;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setColor(colors.text);
  yPosition = addWrappedText(
    resultsData.seasonal_switches_section.summer,
    margin + 15,
    yPosition,
    contentWidth - 30,
    10,
    1.4
  );
  yPosition += 25;

  // Enhanced Winter Care
  checkPageBreak(60);
  doc.setFillColor(
    colors.winterLight[0],
    colors.winterLight[1],
    colors.winterLight[2]
  );
  const winterHeight = Math.max(
    50,
    Math.ceil(resultsData.seasonal_switches_section.winter.length / 90) * 15 +
      35
  );
  doc.roundedRect(margin, yPosition - 8, contentWidth, winterHeight, 8, 8, "F");

  doc.setDrawColor(colors.winter[0], colors.winter[1], colors.winter[2]);
  doc.setLineWidth(1.5);
  doc.roundedRect(margin, yPosition - 8, contentWidth, winterHeight, 8, 8, "S");

  // Professional winter header
  doc.setFillColor(colors.winter[0], colors.winter[1], colors.winter[2]);
  doc.roundedRect(margin, yPosition - 8, contentWidth, 25, 8, 8, "F");

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  setColor(colors.white);
  doc.text("WINTER SKINCARE", pageWidth / 2, yPosition + 8, {
    align: "center",
  });

  yPosition += 30;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setColor(colors.text);
  yPosition = addWrappedText(
    resultsData.seasonal_switches_section.winter,
    margin + 15,
    yPosition,
    contentWidth - 30,
    10,
    1.4
  );
  yPosition += 25;

  // 6. Lifestyle Adjustments with elegant bullets
  addSectionHeader("Lifestyle Recommendations");

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setColor(colors.text);

  resultsData.lifestyle_adjustments_section.forEach((tip, index) => {
    checkPageBreak(15);

    // Elegant bullet point
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.circle(margin + 8, yPosition - 1, 4, "F");

    doc.setDrawColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setLineWidth(0.5);
    doc.circle(margin + 8, yPosition - 1, 4, "S");

    doc.setFontSize(10);
    setColor(colors.text);
    yPosition = addWrappedText(
      tip,
      margin + 20,
      yPosition,
      contentWidth - 25,
      10,
      1.3
    );
    yPosition += 12;
  });
  yPosition += 15;

  // 7. Professional Summary
  addSectionHeader("Key Takeaways", colors.accentLight);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setColor(colors.text);

  resultsData.summary_section.forEach((point, index) => {
    checkPageBreak(15);

    // Elegant number badge with proper centering
    addCenteredCircleNumber(
      index + 1,
      margin + 12,
      yPosition - 1,
      9,
      colors.primary,
      colors.white
    );

    // Add accent border
    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(1);
    doc.circle(margin + 12, yPosition - 1, 9, "S");

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    setColor(colors.text);
    yPosition = addWrappedText(
      point,
      margin + 28,
      yPosition,
      contentWidth - 33,
      11,
      1.4
    );
    yPosition += 15;
  });

  // Add final footer
  addFooter();

  return doc;
};

// Enhanced download function
export const downloadSkincareReportPDF = (resultsData, fileName = null) => {
  try {
    const doc = generateSkincareReportPDF(resultsData);
    const currentDate = new Date().toISOString().split("T")[0];
    const defaultFileName = `skincare-analysis-report-${currentDate}.pdf`;
    doc.save(fileName || defaultFileName);

    // Success notification
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "pdf_download", {
        event_category: "engagement",
        event_label: "skincare_report",
      });
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("There was an error generating your PDF report. Please try again.");
  }
};

// Enhanced blob function
export const getSkincareReportPDFBlob = (resultsData) => {
  try {
    const doc = generateSkincareReportPDF(resultsData);
    return doc.output("blob");
  } catch (error) {
    console.error("Error generating PDF blob:", error);
    return null;
  }
};

// Enhanced share function
export const shareSkincareReportPDF = async (resultsData) => {
  try {
    const pdfBlob = getSkincareReportPDFBlob(resultsData);
    if (!pdfBlob) {
      throw new Error("Failed to generate PDF");
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `skincare-analysis-report-${currentDate}.pdf`;
    const file = new File([pdfBlob], fileName, {
      type: "application/pdf",
    });

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        title: "My Skincare Analysis Report",
        text: "Check out my personalized skincare analysis report!",
        files: [file],
      });

      // Analytics tracking
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "pdf_share", {
          event_category: "engagement",
          event_label: "skincare_report",
        });
      }
    } else {
      // Enhanced fallback with better UX
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success message
      const message =
        "PDF downloaded successfully! You can now share the file from your downloads folder.";
      if (typeof window !== "undefined" && window.alert) {
        window.alert(message);
      }
    }
  } catch (error) {
    console.error("Error sharing PDF:", error);
    const errorMessage =
      "There was an error sharing your PDF report. Please try downloading instead.";
    if (typeof window !== "undefined" && window.alert) {
      window.alert(errorMessage);
    }
  }
};
