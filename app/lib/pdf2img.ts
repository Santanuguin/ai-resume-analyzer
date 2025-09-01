export interface PdfConversionResult {
    file: File | null;
    error?: string;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    // ✅ ensure this only runs in browser
    if (typeof window === "undefined") {
        throw new Error("convertPdfToImage must be called in the browser");
    }

    try {
        // ✅ dynamically import pdfjs only in browser
        const pdfjsLib = await import("pdfjs-dist");
        const { getDocument, GlobalWorkerOptions } = pdfjsLib;

        // Set worker (adjust path if needed)
        GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

        const pdfData = new Uint8Array(await file.arrayBuffer());
        const pdf = await getDocument({ data: pdfData }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport,
            canvas,
        } as any).promise;

        return new Promise<PdfConversionResult>((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    return resolve({
                        file: null,
                        error: "Failed to create blob from canvas",
                    });
                }
                const imageFile = new File([blob], "resume.png", {
                    type: "image/png",
                });
                resolve({ file: imageFile });
            });
        });
    } catch (err: any) {
        console.error("convertPdfToImage error:", err);
        return { file: null, error: err.message };
    }
}
