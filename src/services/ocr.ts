import TextRecognition from "@react-native-ml-kit/text-recognition";
import { createLogger } from "@utils/logger";

const logger = createLogger("[OCR]");

export async function recognizeText(imageUri: string): Promise<string> {
  logger.debug("Starting text recognition...", imageUri);

  try {
    const result = await TextRecognition.recognize(imageUri);

    logger.debug("Recognition successful!", {
      textLength: result.text.length,
      blocksCount: result.blocks.length
    });

    return result.text;
  } catch (error) {
    logger.error("Recognition failed:", error);
    throw new Error("Gagal mengenali teks dari gambar");
  }
}

export async function extractTextBlocks(imageUri: string): Promise<string[]> {
  logger.debug("Extracting text blocks...");

  try {
    const result = await TextRecognition.recognize(imageUri);
    const blocks = result.blocks.map((block) => block.text);

    logger.debug(`Extracted ${blocks.length} blocks`);
    return blocks;
  } catch (error) {
    logger.error("Block extraction failed:", error);
    throw new Error("Gagal mengekstrak teks dari gambar");
  }
}
