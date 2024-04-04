import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { PDFDocument } from 'pdf-lib';

// This function is used to show a pdf document & split by specified pages
function Pdfshow(props) {

    const [numPages, setNumPages] = useState();
    const [selectedPages, setSelectedPages] = useState([]);
    const [splitpdf, setSplitpdf] = useState(null);

    // It is used to calculate the total pages of the pdf when it loaded
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // It is used to select specific pageNumbers user want to split
    function togglePageSelection(pageNumber) {
        console.log("togglePageSelection  pageNumber:", pageNumber)

        const index = selectedPages.indexOf(pageNumber);
        if (index === -1) {
            setSelectedPages([...selectedPages, pageNumber]);
        } else {
            setSelectedPages(selectedPages.filter((page) => page !== pageNumber));
        }
    };

    // It is used to split pdf by user selected pages
    const handleSplitPDF = async () => {
        if (!props.file || selectedPages.length === 0) return alert('Please select any page');

        try {
            const sourcePdfBytes = await props.file.arrayBuffer();
            const sourcePdfDoc = await PDFDocument.load(sourcePdfBytes);

            const newPdfDoc = await PDFDocument.create();
            for (const selectedPage of selectedPages) {
                const [copiedPage] = await newPdfDoc.copyPages(sourcePdfDoc, [
                    selectedPage - 1
                ]);
                newPdfDoc.addPage(copiedPage);
            }

            const newPdfBytes = await newPdfDoc.save();
            const newPdfBlob = new Blob([newPdfBytes], { type: "application/pdf" });
            console.log("handleSplitPDF  newPdfBlob:", newPdfBlob)

            setSplitpdf(newPdfBlob);

        } catch (error) {
            console.error('Error splitting PDF:', error);
        }
    };

    // jsx component to render on browser

    return (
        // show the uploaded pdf on browser and putpages to select
        <div className='pdf-div'>

            <Document file={props.pdffile} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} style={{ marginBottom: '20px' }}>
                        <input
                            type="checkbox"
                            onChange={() => togglePageSelection(index + 1)}
                            checked={selectedPages.includes(index + 1)}
                        />
                        <label>Page {index + 1}</label>
                        <Page
                            pageNumber={index + 1}
                        />
                    </div>
                    // <Page
                    //     key={`page_${index + 1}`}
                    //     pageNumber={index + 1}

                    //     onClick={() => togglePageSelection(index + 1)}
                    //     selected={selectedPages.includes(index + 1)}
                    // />
                ))}

            </Document>
            <button className="btn btn-primary" onClick={handleSplitPDF}>Split PDF</button> <br /><br />

            {/* It is executed when the split pdf has data */}
            {splitpdf && (
                <div>
                    <a
                        href={URL.createObjectURL(splitpdf)}
                        download="generated-pdf.pdf"
                    >
                        Download Generated PDF
                    </a>
                </div>
            )}

        </div>
    );
}

export default Pdfshow;