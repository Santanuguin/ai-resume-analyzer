import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

export interface PdfConversionResult {
    file: File | null;
    error?: string;
}

// Point worker to public folder
GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        const pdfData = new Uint8Array(await file.arrayBuffer());
        const pdf = await getDocument({ data: pdfData }).promise;
        const page = await pdf.getPage(1); // first page only

        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // ✅ add `canvas`
        await page.render({ canvasContext: context, viewport, canvas }).promise;

        return new Promise<PdfConversionResult>((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    return resolve({ file: null, error: "Failed to create blob from canvas" });
                }
                const imageFile = new File([blob], "resume.png", { type: "image/png" });
                resolve({ file: imageFile });
            });
        });
    } catch (err: any) {
        console.error("convertPdfToImage error:", err);
        return { file: null, error: err.message };
    }
}
