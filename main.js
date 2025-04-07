import express from "express";
import  PDFDocument from 'pdfkit';
import customerSchema from "./Model/CustomerModel.js";
import fs from 'fs';
import mongoose from "mongoose";
import cors from "cors";
import router from "./route/route.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 1234;

const uri = process.env.MONGODB_URL;
mongoose
  .connect(uri)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
app.use(cors());
app.use(express.json());
app.use("/user", router);


app.get('/pdf/generate-pdf/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await customerSchema.findById(orderId);

    if (!order) {
      return res.status(404).send('Order not found');
    }

    const doc = new PDFDocument({ margin: 30 });
    const filename = `${order.name}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    doc.pipe(res);

    // Initial settings
    doc.fontSize(20).text(`BAVA CRACKERS BILL`, { align: 'left' });
    doc.fontSize(12).text(`Order ID: ${order.orderId}`, { align: 'right' });
    doc.text(`Order Date & Time: ${new Date(order.createdAt).toLocaleString()}`, { align: 'right' });
    
    doc.fontSize(12).moveDown();
    doc.text(`Bill From`, { align: 'left' });
    doc.text(`Name: ${order.name}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`WhatsApp: ${order.whatsapp}`);
    doc.text(`Country: ${order.country}`);
    doc.text(`Address: ${order.address}`);

    const totalAmount = Number(order.totalAmount) || 0; 
    doc.text(`Total Amount: Rs. ${totalAmount.toFixed(2)}`);

    doc.fontSize(12).moveDown();
    doc.text(`Bill To`, { align: 'right' });
    doc.text(`Name: Logajith`, { align: 'right' });
    doc.text(`Address: Puthur`, { align: 'right' });
    doc.text(`City: Madurai`, { align: 'right' });
    doc.text(`State: Tamil Nadu, India`, { align: 'right' });
    doc.text(`Cell: 6383290293`, { align: 'right' });

    doc.moveDown();

    const tableTop = doc.y;
    const col1X = 30;  
    const col2X = 100;
    const col3X = 320;
    const col4X = 400;
    const col5X = 480;
    const rowHeight = 20; 

    // Maximum Y position for a single page (adjust as needed)
    const maxY = 750; 

    // Function to draw table headers
    function drawTableHeaders(doc, y) {
      doc.fontSize(10).font('Helvetica-Bold');
      drawTableRowBorders(doc, y, col1X, col5X + 60, rowHeight);
      doc.text('S.No', col1X, y + 5)
        .text('Product Name', col2X, y + 5)
        .text('Price (Rs)', col3X, y + 5)
        .text('Qty', col4X, y + 5)
        .text('Subtotal', col5X, y + 5);
    }

    // Function to draw the table row
    function drawTableRow(doc, product, index, yPosition) {
      const price = Number(product.price) || 0;
      const subtotal = Number(product.subtotal) || 0;

      drawTableRowBorders(doc, yPosition, col1X, col5X + 60, rowHeight);

      doc.text(index + 1, col1X + 5, yPosition + 5) 
        .text(product.title, col2X + 5, yPosition + 5) 
        .text(`Rs. ${price.toFixed(2)}`, col3X + 5, yPosition + 5) 
        .text(product.quantity, col4X + 5, yPosition + 5) 
        .text(`Rs. ${subtotal.toFixed(2)}`, col5X + 5, yPosition + 5); 
    }

    // Initial drawing of headers
    drawTableHeaders(doc, tableTop);
    let yPosition = tableTop + rowHeight; 

    doc.font('Helvetica').fontSize(10);

    // Iterate through products and draw each row
    order.products.forEach((product, index) => {
      if (yPosition + rowHeight > maxY) {
        // If adding another row would go past maxY, add a new page
        doc.addPage();
        yPosition = 50; // Reset yPosition for new page

        // Draw headers on the new page
        drawTableHeaders(doc, yPosition);
        yPosition += rowHeight;
      }

      drawTableRow(doc, product, index, yPosition);
      yPosition += rowHeight;
    });

    // Draw Grand Total at the end
    if (yPosition + rowHeight > maxY) {
      // Add new page if necessary
      doc.addPage();
      yPosition = 50;
    }

    doc.moveDown(1);
    doc.fontSize(12);
    drawTableRowBorders(doc, yPosition, col1X, col5X + 60, rowHeight);
    doc.text('Grand Total:', col3X, yPosition + 5)
      .text(`Rs. ${totalAmount.toFixed(2)}`, col4X + 1, yPosition + 5);

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

// Helper function to draw table row borders
function drawTableRowBorders(doc, y, xStart, xEnd, height) {
  doc.lineWidth(0.5)
    .rect(xStart, y, xEnd - xStart, height)
    .stroke();
}





app.listen(PORT, (err) => {
  if (err) {
    console.error("Error in server creation:", err);
  } else {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});
