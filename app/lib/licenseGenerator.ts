/**
 * License key generator for VocalFelt plugin
 * Format: VOCALFELT-XXXX-XXXX-XXXX-XXXX
 * Last segment is a checksum of the first three segments
 */

const BASE36_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeBase36(value: number, length: number): string {
  let result = '';
  let remaining = value;

  for (let i = 0; i < length; i++) {
    result = BASE36_CHARS[remaining % 36] + result;
    remaining = Math.floor(remaining / 36);
  }

  return result;
}

function randomSegment(): string {
  let segment = '';
  for (let i = 0; i < 4; i++) {
    segment += BASE36_CHARS[Math.floor(Math.random() * 36)];
  }
  return segment;
}

function calculateChecksum(part1: string, part2: string, part3: string): string {
  let checksum = 0;

  // Sum ASCII values of all characters in parts 1-3
  for (let i = 0; i < 4; i++) {
    checksum += part1.charCodeAt(i);
    checksum += part2.charCodeAt(i);
    checksum += part3.charCodeAt(i);
  }

  return encodeBase36(checksum, 4);
}

/**
 * Generate a valid VocalFelt license key
 * @returns License key in format VOCALFELT-XXXX-XXXX-XXXX-XXXX
 */
export function generateVocalFeltLicense(): string {
  const part1 = randomSegment();
  const part2 = randomSegment();
  const part3 = randomSegment();
  const part4 = calculateChecksum(part1, part2, part3);

  return `VOCALFELT-${part1}-${part2}-${part3}-${part4}`;
}

/**
 * Generate a valid TapeBloom license key
 * @returns License key in format TAPEBLOOM-XXXX-XXXX-XXXX-XXXX
 */
export function generateTapeBloomLicense(): string {
  const part1 = randomSegment();
  const part2 = randomSegment();
  const part3 = randomSegment();
  const part4 = calculateChecksum(part1, part2, part3);

  return `TAPEBLOOM-${part1}-${part2}-${part3}-${part4}`;
}

/**
 * Validate a VocalFelt license key
 * @param key License key to validate
 * @returns true if valid, false otherwise
 */
export function validateVocalFeltLicense(key: string): boolean {
  if (!key || key.length < 29) {
    return false;
  }

  const parts = key.split('-');
  if (parts.length !== 5) {
    return false;
  }

  if (parts[0] !== 'VOCALFELT') {
    return false;
  }

  // Validate each segment is alphanumeric and correct length
  for (let i = 1; i < 5; i++) {
    if (parts[i].length !== 4) {
      return false;
    }

    for (let j = 0; j < 4; j++) {
      const c = parts[i][j];
      const valid = (c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z');
      if (!valid) {
        return false;
      }
    }
  }

  // Verify checksum
  const expectedChecksum = calculateChecksum(parts[1], parts[2], parts[3]);
  return parts[4].toUpperCase() === expectedChecksum.toUpperCase();
}

/**
 * Validate a TapeBloom license key
 * @param key License key to validate
 * @returns true if valid, false otherwise
 */
export function validateTapeBloomLicense(key: string): boolean {
  if (!key || key.length < 29) {
    return false;
  }

  const parts = key.split('-');
  if (parts.length !== 5) {
    return false;
  }

  if (parts[0] !== 'TAPEBLOOM') {
    return false;
  }

  // Validate each segment is alphanumeric and correct length
  for (let i = 1; i < 5; i++) {
    if (parts[i].length !== 4) {
      return false;
    }

    for (let j = 0; j < 4; j++) {
      const c = parts[i][j];
      const valid = (c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z');
      if (!valid) {
        return false;
      }
    }
  }

  // Verify checksum
  const expectedChecksum = calculateChecksum(parts[1], parts[2], parts[3]);
  return parts[4].toUpperCase() === expectedChecksum.toUpperCase();
}
