
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

    doc.fontSize(20).text(`BAVA CRACKERS BILL`, { align: 'left' });

    doc.fontSize(12).text(`Order ID: ${order.orderId}`, { align: 'right' });
    doc.text(`Order Date & Time: ${new Date(order.createdAt).toLocaleString()}`, { align: 'right' });
    
    doc.fontSize(12).moveDown();
    doc.text(`Bill From`,{ align: 'left' });
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

 
    doc.fontSize(10).font('Helvetica-Bold');
    drawTableRowBorders(doc, tableTop, col1X, col5X + 60, rowHeight); 
    doc.text('S.No', col1X, tableTop + 5)
      .text('Product Name', col2X, tableTop + 5)
      .text('Price (Rs)', col3X, tableTop + 5)
      .text('Qty', col4X, tableTop + 5)
      .text('Subtotal', col5X, tableTop + 5);

    let yPosition = tableTop + rowHeight; 
    doc.font('Helvetica').fontSize(10);

    order.products.forEach((product, index) => {
      const price = Number(product.price) || 0;
      const subtotal = Number(product.subtotal) || 0;

      drawTableRowBorders(doc, yPosition, col1X, col5X + 60, rowHeight);


      doc.text(index + 1, col1X + 5, yPosition + 5) 
        .text(product.title, col2X + 5, yPosition + 5) 
        .text(`Rs. ${price.toFixed(2)}`, col3X + 5, yPosition + 5) 
        .text(product.quantity, col4X + 5, yPosition + 5) 
        .text(`Rs. ${subtotal.toFixed(2)}`, col5X + 5, yPosition + 5); 

  
      yPosition += rowHeight;
    });

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

function drawTableRowBorders(doc, y, xStart, xEnd, height) {
  doc.lineWidth(0.5)
    .rect(xStart, y, xEnd - xStart, height)
    .stroke();
}

