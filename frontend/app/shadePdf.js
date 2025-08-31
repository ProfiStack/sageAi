import jsPDF from "jspdf";

export const generateMakeupReportPDF = (resultsData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Professional color palette - same as skincare
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
    matte: [156, 39, 176], // Purple for matte - #9C27B0
    matteLight: [243, 229, 245], // Light purple - #F3E5F5
    dewy: [33, 150, 243], // Blue for dewy - #2196F3
    dewyLight: [227, 242, 253], // Light blue - #E3F2FD
    natural: [76, 175, 80], // Green for natural - #4CAF50
    naturalLight: [232, 245, 233], // Light green - #E8F5E9
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
      currentY += fontSize * 0.352778 * lineHeight;
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

  const getFinishColor = (finish) => {
    const finishLower = finish.toLowerCase();
    if (finishLower.includes("matte")) return colors.matte;
    if (finishLower.includes("dewy")) return colors.dewy;
    if (finishLower.includes("natural")) return colors.natural;
    return colors.accent;
  };

  const getFinishLightColor = (finish) => {
    const finishLower = finish.toLowerCase();
    if (finishLower.includes("matte")) return colors.matteLight;
    if (finishLower.includes("dewy")) return colors.dewyLight;
    if (finishLower.includes("natural")) return colors.naturalLight;
    return colors.accentLight;
  };

  const addProductCard = (product, index) => {
    checkPageBreak(65);

    const cardHeight = 60;

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

    // Left accent strip based on finish
    const finishColor = getFinishColor(product.finish);
    doc.setFillColor(finishColor[0], finishColor[1], finishColor[2]);
    doc.roundedRect(margin, yPosition - 5, 4, cardHeight, 3, 0, "F");

    // Product name and brand
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    setColor(colors.text);
    doc.text(`${product.product}`, margin + 12, yPosition + 8);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    setColor(colors.accent);
    doc.text(`by ${product.brand}`, margin + 12, yPosition + 18);

    // Shade information
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    setColor(colors.primary);
    doc.text(`Shade: ${product.shade}`, margin + 12, yPosition + 28);

    // Finish badge
    const finishBadgeWidth = doc.getTextWidth(product.finish) + 12;
    const finishLightColor = getFinishLightColor(product.finish);
    doc.setFillColor(
      finishLightColor[0],
      finishLightColor[1],
      finishLightColor[2]
    );
    doc.roundedRect(
      pageWidth - margin - finishBadgeWidth - 5,
      yPosition + 2,
      finishBadgeWidth,
      12,
      6,
      6,
      "F"
    );

    doc.setDrawColor(finishColor[0], finishColor[1], finishColor[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(
      pageWidth - margin - finishBadgeWidth - 5,
      yPosition + 2,
      finishBadgeWidth,
      12,
      6,
      6,
      "S"
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    setColor(finishColor);
    doc.text(
      product.finish,
      pageWidth - margin - finishBadgeWidth + 1,
      yPosition + 10
    );

    // Undertone fit
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    setColor(colors.text);
    yPosition = addWrappedText(
      `Undertone: ${product.undertone_fit}`,
      margin + 12,
      yPosition + 38,
      contentWidth - 20,
      9,
      1.3
    );

    // Perfect for
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    setColor(colors.lightText);
    doc.text(`Perfect for: ${product.perfect_for}`, margin + 12, yPosition + 8);

    yPosition += 20;
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
    doc.text("AI-Powered Makeup Analysis", pageWidth / 2, pageHeight - 15, {
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
    doc.text("SHADE MATCHING", pageWidth / 2, 80, { align: "center" });

    doc.setFontSize(26);
    doc.text("REPORT", pageWidth / 2, 105, { align: "center" });

    // Professional subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Personalized shade recommendations powered by AI",
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
      "Comprehensive makeup analysis and shade matching",
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

  // 1. Makeup Profile Section
  addSectionHeader("Your Makeup Profile");

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

  // 2. Perfect Shade Matches Section
  addSectionHeader("Perfect Shade Matches");

  resultsData.products_section.exact_brand_shade_matches.forEach(
    (product, index) => {
      addProductCard(product, index);
    }
  );
  yPosition += 10;

  // 3. Products by Finish Type Section
  addSectionHeader("Products by Finish Type");

  resultsData.products_section.matching_textures.forEach((category, index) => {
    checkPageBreak(50);

    const finishColor = getFinishColor(category.finish_type);
    const finishLightColor = getFinishLightColor(category.finish_type);

    // Category header with finish-specific styling
    doc.setFillColor(
      finishLightColor[0],
      finishLightColor[1],
      finishLightColor[2]
    );
    const categoryHeight = Math.max(35, category.products.length * 12 + 25);
    doc.roundedRect(
      margin,
      yPosition - 8,
      contentWidth,
      categoryHeight,
      6,
      6,
      "F"
    );

    doc.setDrawColor(finishColor[0], finishColor[1], finishColor[2]);
    doc.setLineWidth(1.5);
    doc.roundedRect(
      margin,
      yPosition - 8,
      contentWidth,
      categoryHeight,
      6,
      6,
      "S"
    );

    // Header
    doc.setFillColor(finishColor[0], finishColor[1], finishColor[2]);
    doc.roundedRect(margin, yPosition - 8, contentWidth, 20, 6, 6, "F");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    setColor(colors.white);
    doc.text(`${category.finish_type} Finish`, pageWidth / 2, yPosition + 5, {
      align: "center",
    });

    doc.setFontSize(10);
    setColor(colors.text);
    doc.text(
      `Best for ${category.recommended_for} skin`,
      pageWidth / 2,
      yPosition + 15,
      {
        align: "center",
      }
    );

    yPosition += 25;

    // Products list
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    setColor(colors.text);

    category.products.forEach((product, productIndex) => {
      // Elegant bullet point
      doc.setFillColor(finishColor[0], finishColor[1], finishColor[2]);
      doc.circle(margin + 12, yPosition - 1, 3, "F");

      doc.text(product, margin + 22, yPosition);
      yPosition += 12;
    });

    yPosition += 15;
  });

  // 4. Better Than Viral Section
  addSectionHeader("Better Than Viral Products");

  resultsData.products_section.better_than_viral.forEach(
    (comparison, index) => {
      checkPageBreak(70);

      const comparisonHeight = 65;

      // Main card background
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.roundedRect(
        margin,
        yPosition - 5,
        contentWidth,
        comparisonHeight,
        4,
        4,
        "F"
      );

      doc.setDrawColor(
        colors.borderLight[0],
        colors.borderLight[1],
        colors.borderLight[2]
      );
      doc.setLineWidth(0.5);
      doc.roundedRect(
        margin,
        yPosition - 5,
        contentWidth,
        comparisonHeight,
        4,
        4,
        "S"
      );

      // Left side - Viral Product
      const columnWidth = (contentWidth - 20) / 2;
      doc.setFillColor(
        colors.warningLight[0],
        colors.warningLight[1],
        colors.warningLight[2]
      );
      doc.roundedRect(margin + 8, yPosition, columnWidth, 25, 3, 3, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      setColor(colors.warning);
      doc.text("VIRAL PRODUCT", margin + 12, yPosition + 8);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      setColor(colors.text);
      yPosition = addWrappedText(
        comparison.viral_product,
        margin + 12,
        yPosition + 15,
        columnWidth - 8,
        9,
        1.2
      );

      let rightYPosition = yPosition - 15;

      // Right side - Better Alternative
      doc.setFillColor(
        colors.successLight[0],
        colors.successLight[1],
        colors.successLight[2]
      );
      doc.roundedRect(
        margin + columnWidth + 12,
        rightYPosition,
        columnWidth,
        25,
        3,
        3,
        "F"
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      setColor(colors.success);
      doc.text("BETTER CHOICE", margin + columnWidth + 16, rightYPosition + 8);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      setColor(colors.text);
      addWrappedText(
        comparison.better_alternative,
        margin + columnWidth + 16,
        rightYPosition + 15,
        columnWidth - 8,
        9,
        1.2
      );

      yPosition += 5;

      // Reason section
      doc.setFillColor(
        colors.accentLight[0],
        colors.accentLight[1],
        colors.accentLight[2]
      );
      doc.roundedRect(margin + 8, yPosition, contentWidth - 16, 20, 3, 3, "F");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      setColor(colors.accent);
      doc.text("Why It's Better:", margin + 12, yPosition + 8);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      setColor(colors.text);
      yPosition = addWrappedText(
        comparison.reason,
        margin + 12,
        yPosition + 15,
        contentWidth - 24,
        8,
        1.2
      );

      yPosition += 20;
    }
  );

  // 5. Professional Summary
  addSectionHeader("Key Takeaways", colors.accentLight);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setColor(colors.text);

  resultsData.summary_section.forEach((point, index) => {
    checkPageBreak(15);

    // Elegant number badge
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.circle(margin + 12, yPosition - 1, 9, "F");

    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(1);
    doc.circle(margin + 12, yPosition - 1, 9, "S");

    // Center the number text
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    setColor(colors.white);
    const numberText = `${index + 1}`;
    const textWidth = doc.getTextWidth(numberText);
    doc.text(numberText, margin + 12 - textWidth / 2, yPosition + 2);

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
export const downloadMakeupReportPDF = (resultsData, fileName = null) => {
  try {
    const doc = generateMakeupReportPDF(resultsData);
    const currentDate = new Date().toISOString().split("T")[0];
    const defaultFileName = `makeup-analysis-report-${currentDate}.pdf`;
    doc.save(fileName || defaultFileName);

    // Success notification
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "pdf_download", {
        event_category: "engagement",
        event_label: "makeup_report",
      });
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("There was an error generating your PDF report. Please try again.");
  }
};

// Enhanced blob function
export const getMakeupReportPDFBlob = (resultsData) => {
  try {
    const doc = generateMakeupReportPDF(resultsData);
    return doc.output("blob");
  } catch (error) {
    console.error("Error generating PDF blob:", error);
    return null;
  }
};

// Enhanced share function
export const shareMakeupReportPDF = async (resultsData) => {
  try {
    const pdfBlob = getMakeupReportPDFBlob(resultsData);
    if (!pdfBlob) {
      throw new Error("Failed to generate PDF");
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `makeup-analysis-report-${currentDate}.pdf`;
    const file = new File([pdfBlob], fileName, {
      type: "application/pdf",
    });

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        title: "My Makeup Analysis Report",
        text: "Check out my personalized makeup shade analysis report!",
        files: [file],
      });

      // Analytics tracking
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "pdf_share", {
          event_category: "engagement",
          event_label: "makeup_report",
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
