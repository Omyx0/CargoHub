import jsPDF from "jspdf";

export const generateInvoicePDF = (invoiceData: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(2, 89, 221); // Brand Primary
  doc.text("CargoHub", 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("GSTIN: 27AADCB2230M1Z3", 14, 30);
  doc.text("123 Logistics Park, Andheri East", 14, 35);
  doc.text("Mumbai, Maharashtra 400069", 14, 40);

  // Title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("TAX INVOICE", 150, 22, { align: "right" });

  // Invoice Details
  doc.setFontSize(10);
  doc.text(`Invoice No: INV-${invoiceData.bookingRef || Math.floor(Math.random() * 100000)}`, 140, 30);
  doc.text(`Date: ${new Date(invoiceData.date || invoiceData.createdAt || Date.now()).toLocaleDateString()}`, 140, 35);
  
  // Line
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 45, 196, 45);

  // Customer Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Billed To:", 14, 55);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Customer", 14, 62);

  // Booking Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Shipment Details:", 14, 80);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`From: ${invoiceData.pickup || invoiceData.pickupAddress}`, 14, 87);
  doc.text(`To: ${invoiceData.drop || invoiceData.dropAddress}`, 14, 94);
  doc.text(`Vehicle: ${invoiceData.vehicleType}`, 14, 101);

  // Line
  doc.line(14, 110, 196, 110);

  // Items Header
  doc.setFont("helvetica", "bold");
  doc.text("Description", 14, 120);
  doc.text("Amount", 170, 120);
  
  // Line
  doc.line(14, 125, 196, 125);

  // Items
  doc.setFont("helvetica", "normal");
  doc.text("Transportation Services", 14, 135);
  const amount = invoiceData.amount || invoiceData.finalFare || invoiceData.fareEstimate || 0;
  const base = (amount / 1.18).toFixed(2);
  const gst = (amount - parseFloat(base)).toFixed(2);

  doc.text(`Rs. ${base}`, 170, 135);

  // Totals
  doc.line(130, 145, 196, 145);
  doc.text("Subtotal:", 130, 155);
  doc.text(`Rs. ${base}`, 170, 155);
  
  doc.text("GST (18%):", 130, 162);
  doc.text(`Rs. ${gst}`, 170, 162);

  doc.setFont("helvetica", "bold");
  doc.text("Total:", 130, 172);
  doc.text(`Rs. ${amount.toFixed(2)}`, 170, 172);

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("This is a computer generated invoice and does not require a physical signature.", 105, 280, { align: "center" });

  // Download
  doc.save(`Invoice_${invoiceData.bookingRef || 'CargoHub'}.pdf`);
};
