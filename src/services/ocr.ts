/* eslint-disable no-console */
import TextRecognition from "@react-native-ml-kit/text-recognition";

const LOG_PREFIX = "[OCR]";

export async function recognizeText(imageUri: string): Promise<string> {
  console.log(`${LOG_PREFIX} Starting text recognition...`);
  console.log(`${LOG_PREFIX} Image URI: ${imageUri}`);

  try {
    console.log(`${LOG_PREFIX} Calling TextRecognition.recognize()...`);
    const result = await TextRecognition.recognize(imageUri);

    console.log(`${LOG_PREFIX} Recognition successful!`);
    console.log(
      `${LOG_PREFIX} Raw text length: ${result.text.length} characters`
    );
    console.log(`${LOG_PREFIX} Blocks count: ${result.blocks.length}`);
    console.log(`${LOG_PREFIX} --- RAW TEXT START ---`);
    console.log(result.text);
    console.log(`${LOG_PREFIX} --- RAW TEXT END ---`);

    return result.text;
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Recognition failed:`,
      (error as Error).message
    );
    throw new Error("Gagal mengenali teks dari gambar");
  }
}

export async function extractTextBlocks(imageUri: string): Promise<string[]> {
  console.log(`${LOG_PREFIX} Extracting text blocks...`);

  try {
    const result = await TextRecognition.recognize(imageUri);
    const blocks = result.blocks.map((block, index) => {
      console.log(`${LOG_PREFIX} Block ${index + 1}: "${block.text}"`);
      return block.text;
    });

    console.log(`${LOG_PREFIX} Extracted ${blocks.length} blocks`);
    return blocks;
  } catch (error) {
    console.error(
      `${LOG_PREFIX} Block extraction failed:`,
      (error as Error).message
    );
    throw new Error("Gagal mengekstrak teks dari gambar");
  }
}
