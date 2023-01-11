import PdfPrinter from "pdfmake";

export const getPDFReadableStream = (post) => {
  // define font files:
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      {
        text: `${post.title}`,
        style: "header",
      },
      {
        // image: `${post.cover}`,
      },
      {
        text: `${post.content}`,
        style: "normalText",
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
      },
      normalText: {
        fontSize: 12,
        bold: false,
        alignment: "center",
      },
      image: {
        URL,
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
